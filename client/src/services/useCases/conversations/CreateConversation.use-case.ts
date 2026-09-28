import { CONFIG_TYPES, NETWORK_TYPES } from "@Container";
import type {
  ApiResponse,
  CreateConversationResult,
  NestedRoutes,
} from "@Types";
import { Logger } from "@Utils";
import type { AxiosService } from "@Services";
import { inject, injectable } from "inversify";
import { AbstractService } from "../abstract/abstract.use-case";

@injectable()
export class CreateConversationUseCase extends AbstractService<CreateConversationResult> {
  private readonly axiosRequest: AxiosService;

  constructor(
    @inject(NETWORK_TYPES._AxiosRequest) axiosRequest: AxiosService,
    @inject(CONFIG_TYPES._Routes) routes: NestedRoutes,
    @inject(CONFIG_TYPES._IsProd) isProd: boolean,
  ) {
    super(routes, isProd);
    this.axiosRequest = axiosRequest;
  }

  /** Inicia (o reutiliza) una conversación con el dueño del PIN. */
  async execute(pin: string): Promise<CreateConversationResult> {
    try {
      const response = await this.axiosRequest.execute<
        ApiResponse<CreateConversationResult>
      >({
        url: this.getRoute("conversations.create"),
        method: "POST",
        body: { pin },
      });
      return response.data;
    } catch (error) {
      Logger.error("Error createConversation", error);
      throw error;
    }
  }
}
