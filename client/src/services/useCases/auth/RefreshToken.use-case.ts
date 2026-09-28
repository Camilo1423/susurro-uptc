import { CONFIG_TYPES } from "@Container";
import type { NestedRoutes } from "@Types";
import { Logger } from "@Utils";
import axios from "axios";
import { inject, injectable } from "inversify";
import { AbstractService } from "../abstract/abstract.use-case";

@injectable()
export class RefreshTokenUseCase extends AbstractService<void> {
  private readonly apiUrl: string;

  constructor(
    @inject(CONFIG_TYPES._ApiUrl) apiUrl: string,
    @inject(CONFIG_TYPES._Routes) routes: NestedRoutes,
    @inject(CONFIG_TYPES._IsProd) isProd: boolean,
  ) {
    super(routes, isProd);
    this.apiUrl = apiUrl;
  }

  /**
   * Renueva el access_token usando la cookie refresh_token (`?rf=true`).
   *
   * Usa `axios` crudo (NO el `AxiosService`) a propósito: (a) evita la
   * dependencia circular con el `AxiosService`, que lo consume desde su
   * interceptor, y (b) no vuelve a pasar por ese interceptor, evitando bucles
   * de reintento. En dev el baseURL es "" (pasa por el proxy de Vite).
   */
  async execute(): Promise<void> {
    try {
      const base = import.meta.env.DEV ? "" : this.apiUrl;
      const baseParsed = base.replace(/\/$/, "");
      const endpoint = this.getRoute("auth.refreshToken");
      await axios.get(`${baseParsed}${endpoint}?rf=true`, {
        withCredentials: true,
      });
    } catch (error) {
      Logger.error("Error refreshToken", error);
      throw error;
    }
  }
}
