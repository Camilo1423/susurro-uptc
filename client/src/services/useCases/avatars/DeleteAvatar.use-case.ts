import { CONFIG_TYPES, NETWORK_TYPES } from "@Container";
import type { ApiResponse, NestedRoutes } from "@Types";
import { Logger } from "@Utils";
import type { AxiosService } from "@Services";
import { inject, injectable } from "inversify";
import { AbstractService } from "../abstract/abstract.use-case";

@injectable()
export class DeleteAvatarUseCase extends AbstractService<void> {
  private readonly axiosRequest: AxiosService;

  constructor(
    @inject(NETWORK_TYPES._AxiosRequest) axiosRequest: AxiosService,
    @inject(CONFIG_TYPES._Routes) routes: NestedRoutes,
    @inject(CONFIG_TYPES._IsProd) isProd: boolean,
  ) {
    super(routes, isProd);
    this.axiosRequest = axiosRequest;
  }

  /** Elimina la foto de perfil del usuario. */
  async execute(): Promise<void> {
    try {
      await this.axiosRequest.execute<ApiResponse<object>>({
        url: this.getRoute("avatars.delete"),
        method: "DELETE",
      });
    } catch (error) {
      Logger.error("Error deleteAvatar", error);
      throw error;
    }
  }
}
