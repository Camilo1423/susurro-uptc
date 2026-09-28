import { CONFIG_TYPES, NETWORK_TYPES } from "@Container";
import type { ApiResponse, ChatMessage, NestedRoutes } from "@Types";
import { Logger } from "@Utils";
import type { AxiosService } from "@Services";
import { inject, injectable } from "inversify";
import { AbstractService } from "../abstract/abstract.use-case";

@injectable()
export class SendChatMessageUseCase extends AbstractService<ChatMessage> {
  private readonly axiosRequest: AxiosService;

  constructor(
    @inject(NETWORK_TYPES._AxiosRequest) axiosRequest: AxiosService,
    @inject(CONFIG_TYPES._Routes) routes: NestedRoutes,
    @inject(CONFIG_TYPES._IsProd) isProd: boolean,
  ) {
    super(routes, isProd);
    this.axiosRequest = axiosRequest;
  }

  /** Envía un mensaje (opcionalmente citando otro). Devuelve el mensaje creado. */
  async execute(
    conversationId: string,
    content: string,
    replyToId?: string,
  ): Promise<ChatMessage> {
    try {
      const response = await this.axiosRequest.execute<
        ApiResponse<ChatMessage>
      >({
        url: this.getRoute("conversations.messages", [conversationId]),
        method: "POST",
        body: { content, ...(replyToId ? { replyToId } : {}) },
      });
      return response.data;
    } catch (error) {
      Logger.error("Error sendChatMessage", error);
      throw error;
    }
  }
}
