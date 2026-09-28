import { CONFIG_TYPES, NETWORK_TYPES } from "@Container";
import type { ApiResponse, Message, NestedRoutes } from "@Types";
import { Logger } from "@Utils";
import type { AxiosService } from "@Services";
import { inject, injectable } from "inversify";
import { AbstractService } from "../abstract/abstract.use-case";

@injectable()
export class GetMessagesUseCase extends AbstractService<Message[]> {
  private readonly axiosRequest: AxiosService;

  constructor(
    @inject(NETWORK_TYPES._AxiosRequest) axiosRequest: AxiosService,
    @inject(CONFIG_TYPES._Routes) routes: NestedRoutes,
    @inject(CONFIG_TYPES._IsProd) isProd: boolean,
  ) {
    super(routes, isProd);
    this.axiosRequest = axiosRequest;
  }

  /** Lista los mensajes del chat (endpoint `messages.findAll`). */
  async execute(): Promise<Message[]> {
    try {
      const response = await this.axiosRequest.execute<
        ApiResponse<Message[]>
      >({
        url: this.getRoute("messages.findAll"),
        method: "GET",
      });
      return response.data;
    } catch (error) {
      Logger.error("Error getMessages", error);
      throw error;
    }
  }
}
