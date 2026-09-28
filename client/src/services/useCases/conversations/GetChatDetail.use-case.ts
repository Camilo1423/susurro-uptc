import { CONFIG_TYPES, NETWORK_TYPES } from "@Container";
import type { ApiResponse, ChatDetail, NestedRoutes } from "@Types";
import { Logger } from "@Utils";
import type { AxiosService } from "@Services";
import { inject, injectable } from "inversify";
import { AbstractService } from "../abstract/abstract.use-case";

@injectable()
export class GetChatDetailUseCase extends AbstractService<ChatDetail> {
  private readonly axiosRequest: AxiosService;

  constructor(
    @inject(NETWORK_TYPES._AxiosRequest) axiosRequest: AxiosService,
    @inject(CONFIG_TYPES._Routes) routes: NestedRoutes,
    @inject(CONFIG_TYPES._IsProd) isProd: boolean,
  ) {
    super(routes, isProd);
    this.axiosRequest = axiosRequest;
  }

  /** Detalle de un chat (contraparte + mi estado de anonimidad). */
  async execute(conversationId: string): Promise<ChatDetail> {
    try {
      const response = await this.axiosRequest.execute<ApiResponse<ChatDetail>>(
        {
          url: this.getRoute("conversations.detail", [conversationId]),
          method: "GET",
        },
      );
      return response.data;
    } catch (error) {
      Logger.error("Error getChatDetail", error);
      throw error;
    }
  }
}
