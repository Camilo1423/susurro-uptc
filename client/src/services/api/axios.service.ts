import { CONFIG_TYPES, USE_CASES_TYPES } from "@Container";
import { openModal, store } from "@Redux";
import type {
  BlobDownloadRequest,
  BlobDownloadResult,
  ExecutePetition,
} from "@Types";
import { SIGN_IN_STATUS_KEY, SignInStatus } from "@Types";
import type { RefreshTokenUseCase } from "@UseCase";
import { Logger } from "@Utils";
import type { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import axios from "axios";
import { inject, injectable } from "inversify";
import qs from "qs";

/** Nombre del Web Lock que serializa el refresh entre pestañas del mismo origen. */
const REFRESH_LOCK = "anomchat-token-refresh";
/** Timestamp (localStorage) del último refresh exitoso; compartido entre pestañas. */
const LAST_REFRESH_KEY = "anomchat-last-refresh";
/** Ventana en la que un refresh reciente de otra pestaña se reutiliza sin repetir. */
const REFRESH_SKIP_MS = 10_000;

/**
 * Cliente HTTP central (capa de red). Encapsula axios con:
 * - baseURL derivado del entorno (proxy de Vite en dev, gateway real en prod),
 * - interceptor de refresh de token single-flight + coordinado entre pestañas,
 * - normalización de errores y apertura del modal de sesión expirada.
 *
 * Los casos de uso NO usan axios directamente: llaman a `execute<T>()`.
 */
@injectable()
export class AxiosService {
  private readonly urlBase: string;
  private instanceAxios: AxiosInstance = axios.create({});
  private readonly prod: boolean;
  private readonly params: Record<string, unknown>;
  private readonly refreshUseCase: RefreshTokenUseCase;
  private authToken = "";
  /** Single-flight: dentro de una misma pestaña un solo refresh a la vez. */
  private refreshTokenPromise: Promise<void> | null = null;

  constructor(
    @inject(CONFIG_TYPES._ApiUrl) url: string,
    @inject(CONFIG_TYPES._IsProd) isProd: boolean,
    @inject(CONFIG_TYPES._Params) params: Record<string, unknown>,
    @inject(USE_CASES_TYPES._RefreshToken) refreshUseCase: RefreshTokenUseCase,
  ) {
    // En desarrollo las peticiones salen al mismo origen (Vite dev-server) para
    // que el proxy las reenvíe a la API: así las cookies httpOnly son
    // first-party. En producción se usa la URL real del gateway.
    this.urlBase = import.meta.env.DEV ? "" : url;
    this.prod = isProd;
    this.params = params;
    this.refreshUseCase = refreshUseCase;
    this._executeBuilder();
  }

  setAuthToken = (token: string) => {
    this.authToken = token;
  };

  createInstance = (): AxiosInstance => {
    const instance = axios.create({
      baseURL: this.urlBase,
      timeout: this.params.timeout as number,
      // El Content-Type se fija por request en `execute` (JSON o, para FormData,
      // se deja que el navegador ponga multipart + boundary). NO se pone default
      // aquí porque axios lo re-inyectaría sobre el FormData.
      paramsSerializer: {
        serialize: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
      },
      withCredentials: true,
    });

    instance.interceptors.request.use((config) => {
      if (this.authToken) {
        config.headers["Authorization"] = `Bearer ${this.authToken}`;
      }
      // Desfase horario del cliente (en minutos) para que el backend convierta
      // las fechas a la zona del usuario.
      config.headers["x-timezone-offset"] = new Date().getTimezoneOffset();
      return config;
    });

    return instance;
  };

  private readonly _executeBuilder = () => {
    this.instanceAxios = this.createInstance();
    this._setupInterceptors();
  };

  /**
   * Single-flight por pestaña: si ya hay un refresh en curso reutiliza esa
   * promesa; si no, dispara la variante coordinada entre pestañas.
   */
  private readonly _handleRefreshToken = (): Promise<void> => {
    if (this.refreshTokenPromise) return this.refreshTokenPromise;

    this.refreshTokenPromise = this._refreshCoordinated().finally(() => {
      this.refreshTokenPromise = null;
    });

    return this.refreshTokenPromise;
  };

  /**
   * Coordina el refresh entre varias pestañas del mismo origen con la Web Locks
   * API. Solo UNA pestaña rota el token; las demás reutilizan la cookie fresca
   * si el último refresh fue hace menos de REFRESH_SKIP_MS.
   */
  private readonly _refreshCoordinated = async (): Promise<void> => {
    const run = async (): Promise<void> => {
      const last = Number(localStorage.getItem(LAST_REFRESH_KEY) ?? "0");
      if (Date.now() - last < REFRESH_SKIP_MS) {
        if (!this.prod)
          Logger.log("⏭️ Refresh reciente de otra pestaña, se reutiliza");
        return;
      }
      await this.refreshUseCase.execute();
      localStorage.setItem(LAST_REFRESH_KEY, String(Date.now()));
    };

    if (typeof navigator !== "undefined" && navigator.locks?.request) {
      await navigator.locks.request(REFRESH_LOCK, run);
    } else {
      await run();
    }
  };

  private readonly _setupInterceptors = (): void => {
    this.instanceAxios.interceptors.response.use(
      (opt) => {
        if (!this.prod) Logger.log("Code: ", opt.status);
        return opt;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as
          | (AxiosRequestConfig & { _retry?: boolean })
          | undefined;

        // Normaliza el envoltorio de error de la gateway/microservicios.
        const data = error.response?.data as
          | {
              status?: number;
              statusCode?: number;
              msg?: string;
              message?: string;
            }
          | undefined;
        const status =
          data?.status ?? data?.statusCode ?? error.response?.status;

        // El access token vencido/ inválido devuelve 401 (Passport en el server
        // responde un 401 genérico; los tokens revocados, "Token revocado"). Solo
        // reintentamos si HAY sesión (`statusSignIn=DONE`): así un 401 del propio
        // login o del who-am-i sin sesión no dispara un refresh. Los 403 (permisos)
        // NO son problema de sesión y no se tocan.
        const isUnauthorized = status === 401;
        const isAuthenticated =
          localStorage.getItem(SIGN_IN_STATUS_KEY) === SignInStatus.Done;

        if (
          isUnauthorized &&
          isAuthenticated &&
          originalRequest &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;
          try {
            await this._handleRefreshToken();
            return await this.instanceAxios.request(originalRequest);
          } catch (refreshError) {
            // El refresh_token ya no sirve → sesión realmente expirada.
            store.dispatch(openModal());
            throw refreshError;
          }
        }

        if (!this.prod) Logger.error("❌ Response Error:", error);
        throw error;
      },
    );

    this.instanceAxios.interceptors.request.use(
      (opt) => {
        if (!this.prod) {
          Logger.log(
            "Request: ",
            (opt.baseURL ?? "") + (opt.url ?? ""),
            opt.method,
            opt.data ? "Data: " + JSON.stringify(opt.data) : "",
          );
        }
        return opt;
      },
      (error) => {
        if (!this.prod) Logger.error("❌ Request Error:", error);
        throw error;
      },
    );
  };

  execute = async <T>(request: ExecutePetition): Promise<T> => {
    try {
      const rf = request.useRF ? { rf: true } : {};

      const headers: Record<string, unknown> = {
        ...this.instanceAxios.defaults.headers.common,
        ...request.headers,
      };
      const isFormData =
        typeof FormData !== "undefined" && request.body instanceof FormData;
      if (isFormData) {
        // El navegador debe fijar `multipart/form-data` + boundary.
        delete headers["Content-Type"];
        delete headers["content-type"];
      } else if (!headers["Content-Type"] && !headers["content-type"]) {
        headers["Content-Type"] = "application/json";
      }

      const config: AxiosRequestConfig = {
        method: request.method.toLowerCase(),
        url: request.url,
        headers: headers as AxiosRequestConfig["headers"],
        params: {
          ...request.queryParams,
          ...rf,
        },
        data: request.body,
        responseType: request.responseType,
        ...(request.timeout !== undefined && { timeout: request.timeout }),
        ...(request.signal && { signal: request.signal }),
      };

      const res = await this.instanceAxios.request(config);
      return res.data as T;
    } catch (e) {
      Logger.error(
        `Error execute (${request.method.toUpperCase()} - ${request.url})`,
        e,
      );
      const error = e as AxiosError;
      throw error.response?.data;
    }
  };

  executeBlobDownload = async (
    request: BlobDownloadRequest,
  ): Promise<BlobDownloadResult> => {
    try {
      const rf = request.useRF ? { rf: true } : {};
      const fallbackName = request.defaultFileName ?? "download.zip";

      const config: AxiosRequestConfig = {
        method: request.method.toLowerCase(),
        url: request.url,
        headers: {
          ...this.instanceAxios.defaults.headers.common,
          ...request.headers,
        },
        params: {
          ...request.queryParams,
          ...rf,
        },
        data: request.body,
        responseType: "blob",
        ...(request.timeout !== undefined && { timeout: request.timeout }),
        ...(request.signal && { signal: request.signal }),
        onDownloadProgress: (event) => {
          request.onDownloadProgress?.(event);
          const total = event.total ?? 0;
          const loaded = event.loaded ?? 0;
          if (total > 0) {
            request.onProgress?.(
              Math.round((loaded / total) * 100),
              loaded,
              total,
            );
          }
        },
      };

      const res = await this.instanceAxios.request<Blob>(config);
      const headers = res.headers as Record<string, string | undefined>;
      const fileName = headers["x-file-name"] ?? fallbackName;

      return { blob: res.data, fileName };
    } catch (e) {
      Logger.error(
        `Error executeBlobDownload (${request.method.toUpperCase()} - ${request.url})`,
        e,
      );
      const error = e as AxiosError;
      throw error.response?.data;
    }
  };
}
