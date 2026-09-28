import { CONFIG_TYPES, NETWORK_TYPES } from "@Container";
import type {
  ApiResponse,
  ConversationListItem,
  NestedRoutes,
} from "@Types";
import { Logger } from "@Utils";
import type { AxiosService } from "@Services";
import { inject, injectable } from "inversify";
import { AbstractService } from "../abstract/abstract.use-case";

@injectable()
export class GetConversationsUseCase extends AbstractService<
  ConversationListItem[]
> {
  private readonly axiosRequest: AxiosService;

  constructor(
    @inject(NETWORK_TYPES._AxiosRequest) axiosRequest: AxiosService,
    @inject(CONFIG_TYPES._Routes) routes: NestedRoutes,
    @inject(CONFIG_TYPES._IsProd) isProd: boolean,
  ) {
    super(routes, isProd);
    this.axiosRequest = axiosRequest;
  }

  /** Trae todos los chats del usuario, ya ordenados por actividad reciente. */
  async execute(): Promise<ConversationListItem[]> {
    try {
      const response = await this.axiosRequest.execute<
        ApiResponse<ConversationListItem[]>
      >({
        url: this.getRoute("conversations.findAll"),
        method: "GET",
      });
      return response.data;
    } catch (error) {
      Logger.error("Error getConversations", error);
      throw error;
    }
  }
}
