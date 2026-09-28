import { CONFIG_TYPES, NETWORK_TYPES } from "@Container";
import type { ApiResponse, NestedRoutes, RandomChatResult } from "@Types";
import { Logger } from "@Utils";
import type { AxiosService } from "@Services";
import { inject, injectable } from "inversify";
import { AbstractService } from "../abstract/abstract.use-case";

@injectable()
export class StartRandomChatUseCase extends AbstractService<RandomChatResult> {
  private readonly axiosRequest: AxiosService;

  constructor(
    @inject(NETWORK_TYPES._AxiosRequest) axiosRequest: AxiosService,
    @inject(CONFIG_TYPES._Routes) routes: NestedRoutes,
    @inject(CONFIG_TYPES._IsProd) isProd: boolean,
  ) {
    super(routes, isProd);
    this.axiosRequest = axiosRequest;
  }

  /** Inicia un chat con un usuario aleatorio (sin chat previo, prioriza en línea). */
  async execute(): Promise<RandomChatResult> {
    try {
      const response = await this.axiosRequest.execute<
        ApiResponse<RandomChatResult>
      >({
        url: this.getRoute("conversations.random"),
        method: "POST",
      });
      return response.data;
    } catch (error) {
      Logger.error("Error startRandomChat", error);
      throw error;
    }
  }
}
