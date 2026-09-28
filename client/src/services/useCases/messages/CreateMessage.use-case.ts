import { CONFIG_TYPES, NETWORK_TYPES } from "@Container";
import type {
  ApiResponse,
  CreateMessageRequest,
  Message,
  NestedRoutes,
} from "@Types";
import { Logger } from "@Utils";
import type { AxiosService } from "@Services";
import { inject, injectable } from "inversify";
import { AbstractService } from "../abstract/abstract.use-case";

@injectable()
export class CreateMessageUseCase extends AbstractService<Message> {
  private readonly axiosRequest: AxiosService;

  constructor(
    @inject(NETWORK_TYPES._AxiosRequest) axiosRequest: AxiosService,
    @inject(CONFIG_TYPES._Routes) routes: NestedRoutes,
    @inject(CONFIG_TYPES._IsProd) isProd: boolean,
  ) {
    super(routes, isProd);
    this.axiosRequest = axiosRequest;
  }

  /** Crea un mensaje (endpoint `messages.create`). */
  async execute(payload: CreateMessageRequest): Promise<Message> {
    try {
      const response = await this.axiosRequest.execute<ApiResponse<Message>>({
        url: this.getRoute("messages.create"),
        method: "POST",
        body: { ...payload },
      });
      return response.data;
    } catch (error) {
      Logger.error("Error createMessage", error);
      throw error;
    }
  }
}
