import { CONFIG_TYPES, NETWORK_TYPES } from "@Container";
import type { ApiResponse, NestedRoutes, SocketCredentials } from "@Types";
import { Logger } from "@Utils";
import type { AxiosService } from "@Services";
import { inject, injectable } from "inversify";
import { AbstractService } from "../abstract/abstract.use-case";

@injectable()
export class GetSocketCredentialsUseCase extends AbstractService<SocketCredentials> {
  private readonly axiosRequest: AxiosService;

  constructor(
    @inject(NETWORK_TYPES._AxiosRequest) axiosRequest: AxiosService,
    @inject(CONFIG_TYPES._Routes) routes: NestedRoutes,
    @inject(CONFIG_TYPES._IsProd) isProd: boolean,
  ) {
    super(routes, isProd);
    this.axiosRequest = axiosRequest;
  }

  /** Obtiene el token efímero para conectar el socket. */
  async execute(): Promise<SocketCredentials> {
    try {
      const response = await this.axiosRequest.execute<
        ApiResponse<SocketCredentials>
      >({
        url: this.getRoute("socket.getSocketCredentials"),
        method: "POST",
      });
      return response.data;
    } catch (error) {
      Logger.error("Error getSocketCredentials", error);
      throw error;
    }
  }
}
