import { CONFIG_TYPES, NETWORK_TYPES } from "@Container";
import type { ApiResponse, ChatDetail, NestedRoutes } from "@Types";
import { Logger } from "@Utils";
import type { AxiosService } from "@Services";
import { inject, injectable } from "inversify";
import { AbstractService } from "../abstract/abstract.use-case";

@injectable()
export class SetChatAnonymityUseCase extends AbstractService<ChatDetail> {
  private readonly axiosRequest: AxiosService;

  constructor(
    @inject(NETWORK_TYPES._AxiosRequest) axiosRequest: AxiosService,
    @inject(CONFIG_TYPES._Routes) routes: NestedRoutes,
    @inject(CONFIG_TYPES._IsProd) isProd: boolean,
  ) {
    super(routes, isProd);
    this.axiosRequest = axiosRequest;
  }

  /** Activa/desactiva MI anonimidad en el chat. Devuelve el detalle actualizado. */
  async execute(conversationId: string, anonymous: boolean): Promise<ChatDetail> {
    try {
      const response = await this.axiosRequest.execute<ApiResponse<ChatDetail>>(
        {
          url: this.getRoute("conversations.anonymity", [conversationId]),
          method: "PATCH",
          body: { anonymous },
        },
      );
      return response.data;
    } catch (error) {
      Logger.error("Error setChatAnonymity", error);
      throw error;
    }
  }
}
