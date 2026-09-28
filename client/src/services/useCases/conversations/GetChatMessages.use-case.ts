import { CONFIG_TYPES, NETWORK_TYPES } from "@Container";
import type { ApiResponse, MessagesPage, NestedRoutes } from "@Types";
import { Logger } from "@Utils";
import type { AxiosService } from "@Services";
import { inject, injectable } from "inversify";
import { AbstractService } from "../abstract/abstract.use-case";

@injectable()
export class GetChatMessagesUseCase extends AbstractService<MessagesPage> {
  private readonly axiosRequest: AxiosService;

  constructor(
    @inject(NETWORK_TYPES._AxiosRequest) axiosRequest: AxiosService,
    @inject(CONFIG_TYPES._Routes) routes: NestedRoutes,
    @inject(CONFIG_TYPES._IsProd) isProd: boolean,
  ) {
    super(routes, isProd);
    this.axiosRequest = axiosRequest;
  }

  /** Historial paginado. `before` = id del mensaje más antiguo ya cargado. */
  async execute(
    conversationId: string,
    opts?: { before?: string; limit?: number },
  ): Promise<MessagesPage> {
    try {
      const response = await this.axiosRequest.execute<
        ApiResponse<MessagesPage>
      >({
        url: this.getRoute("conversations.messages", [conversationId]),
        method: "GET",
        queryParams: {
          ...(opts?.before ? { before: opts.before } : {}),
          ...(opts?.limit ? { limit: opts.limit } : {}),
        },
      });
      return response.data;
    } catch (error) {
      Logger.error("Error getChatMessages", error);
      throw error;
    }
  }
}
