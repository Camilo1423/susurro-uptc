import { CONFIG_TYPES, NETWORK_TYPES } from "@Container";
import type { ApiResponse, NestedRoutes } from "@Types";
import { Logger } from "@Utils";
import type { AxiosService } from "@Services";
import { inject, injectable } from "inversify";
import { AbstractService } from "../abstract/abstract.use-case";

@injectable()
export class DeleteConversationUseCase extends AbstractService<void> {
  private readonly axiosRequest: AxiosService;

  constructor(
    @inject(NETWORK_TYPES._AxiosRequest) axiosRequest: AxiosService,
    @inject(CONFIG_TYPES._Routes) routes: NestedRoutes,
    @inject(CONFIG_TYPES._IsProd) isProd: boolean,
  ) {
    super(routes, isProd);
    this.axiosRequest = axiosRequest;
  }

  /** Elimina el chat por completo (mensajes + conversación). Solo un participante. */
  async execute(conversationId: string): Promise<void> {
    try {
      await this.axiosRequest.execute<ApiResponse<{ deleted: true }>>({
        url: this.getRoute("conversations.delete", [conversationId]),
        method: "DELETE",
      });
    } catch (error) {
      Logger.error("Error deleteConversation", error);
      throw error;
    }
  }
}
