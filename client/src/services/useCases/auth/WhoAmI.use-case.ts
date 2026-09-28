import { CONFIG_TYPES, NETWORK_TYPES } from "@Container";
import type { ApiResponse, AuthUser, NestedRoutes } from "@Types";
import { Logger } from "@Utils";
import type { AxiosService } from "@Services";
import { inject, injectable } from "inversify";
import { AbstractService } from "../abstract/abstract.use-case";

@injectable()
export class WhoAmIUseCase extends AbstractService<AuthUser> {
  private readonly axiosRequest: AxiosService;

  constructor(
    @inject(NETWORK_TYPES._AxiosRequest) axiosRequest: AxiosService,
    @inject(CONFIG_TYPES._Routes) routes: NestedRoutes,
    @inject(CONFIG_TYPES._IsProd) isProd: boolean,
  ) {
    super(routes, isProd);
    this.axiosRequest = axiosRequest;
  }

  /** Obtiene el usuario autenticado a partir de la cookie access_token. */
  async execute(): Promise<AuthUser> {
    try {
      const response = await this.axiosRequest.execute<ApiResponse<AuthUser>>({
        url: this.getRoute("auth.whoAmI"),
        method: "GET",
      });
      return response.data;
    } catch (error) {
      Logger.error("Error whoAmI", error);
      throw error;
    }
  }
}
