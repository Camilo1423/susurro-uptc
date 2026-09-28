import { CONFIG_TYPES, NETWORK_TYPES } from "@Container";
import type { ApiResponse, NestedRoutes } from "@Types";
import { Logger } from "@Utils";
import type { AxiosService } from "@Services";
import { inject, injectable } from "inversify";
import { AbstractService } from "../abstract/abstract.use-case";

interface HealthStatus {
  status: string;
}

@injectable()
export class HealthCheckUseCase extends AbstractService<HealthStatus> {
  private readonly axiosRequest: AxiosService;

  constructor(
    @inject(NETWORK_TYPES._AxiosRequest) axiosRequest: AxiosService,
    @inject(CONFIG_TYPES._Routes) routes: NestedRoutes,
    @inject(CONFIG_TYPES._IsProd) isProd: boolean,
  ) {
    super(routes, isProd);
    this.axiosRequest = axiosRequest;
  }

  /** Comprueba que el backend responde (endpoint `health.check`). */
  async execute(): Promise<HealthStatus> {
    try {
      const response = await this.axiosRequest.execute<
        ApiResponse<HealthStatus>
      >({
        url: this.getRoute("health.check"),
        method: "GET",
      });
      return response.data;
    } catch (error) {
      Logger.error("Error healthCheck", error);
      throw error;
    }
  }
}
