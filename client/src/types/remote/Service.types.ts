import type { AxiosRequestConfig, AxiosProgressEvent } from "axios";

export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "DELETE"
  | "PATCH"
  | "get"
  | "post"
  | "put"
  | "delete"
  | "patch";

export type ExecutePetition = {
  url: string;
  method: HttpMethod;
  body?:
    | Record<string, unknown>
    | Record<string, unknown>[]
    | string
    | string[]
    | null
    | number
    | number[]
    | FormData;
  queryParams?: Record<
    string,
    string | number | boolean | (string | number | boolean)[]
  >;
  headers?: Record<string, string>;
  /** Añade `?rf=true` a la petición (rutas que usan el refresh_token). */
  useRF?: boolean;
  /** Por defecto JSON; use `"blob"` para descargas binarias. */
  responseType?: AxiosRequestConfig["responseType"];
  onDownloadProgress?: (event: AxiosProgressEvent) => void;
  /** Timeout en ms para esta petición. Use `0` para desactivar el timeout. */
  timeout?: number;
  /** AbortSignal para cancelar la petición en curso. */
  signal?: AbortSignal;
};

export type BlobDownloadResult = {
  blob: Blob;
  fileName: string;
};

export type BlobDownloadRequest = ExecutePetition & {
  defaultFileName?: string;
  onProgress?: (percent: number, loaded: number, total: number) => void;
};

/**
 * Estructura anidada del catálogo de rutas (el "gestor de rutas del back").
 * Las hojas son strings (el endpoint, con `:params` opcionales); los nodos
 * intermedios agrupan por dominio. La resuelve `AbstractService.getRoute`.
 */
export type NestedRoutes = {
  [key: string]: string | NestedRoutes;
};
