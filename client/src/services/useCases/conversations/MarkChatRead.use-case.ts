import { CONFIG_TYPES, NETWORK_TYPES } from "@Container";
import type { ApiResponse, NestedRoutes } from "@Types";
import { Logger } from "@Utils";
import type { AxiosService } from "@Services";
import { inject, injectable } from "inversify";
import { AbstractService } from "../abstract/abstract.use-case";

@injectable()
export class MarkChatReadUseCase extends AbstractService<void> {
  private readonly axiosRequest: AxiosService;

  constructor(
    @inject(NETWORK_TYPES._AxiosRequest) axiosRequest: AxiosService,
    @inject(CONFIG_TYPES._Routes) routes: NestedRoutes,
    @inject(CONFIG_TYPES._IsProd) isProd: boolean,
  ) {
    super(routes, isProd);
    this.axiosRequest = axiosRequest;
  }

  /** Marca como leídos los mensajes recibidos del chat. */
  async execute(conversationId: string): Promise<void> {
    try {
      await this.axiosRequest.execute<ApiResponse<{ readAt: string | null }>>({
        url: this.getRoute("conversations.read", [conversationId]),
        method: "POST",
      });
    } catch (error) {
      Logger.error("Error markChatRead", error);
      throw error;
    }
  }
}
