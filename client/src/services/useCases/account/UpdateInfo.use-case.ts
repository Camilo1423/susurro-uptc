import { CONFIG_TYPES, NETWORK_TYPES } from "@Container";
import type {
  ApiResponse,
  AuthUser,
  NestedRoutes,
  UpdateInfoRequest,
} from "@Types";
import { Logger } from "@Utils";
import type { AxiosService } from "@Services";
import { inject, injectable } from "inversify";
import { AbstractService } from "../abstract/abstract.use-case";

@injectable()
export class UpdateInfoUseCase extends AbstractService<AuthUser> {
  private readonly axiosRequest: AxiosService;

  constructor(
    @inject(NETWORK_TYPES._AxiosRequest) axiosRequest: AxiosService,
    @inject(CONFIG_TYPES._Routes) routes: NestedRoutes,
    @inject(CONFIG_TYPES._IsProd) isProd: boolean,
  ) {
    super(routes, isProd);
    this.axiosRequest = axiosRequest;
  }

  /** Actualiza los datos personales y devuelve el usuario actualizado. */
  async execute(payload: UpdateInfoRequest): Promise<AuthUser> {
    try {
      const response = await this.axiosRequest.execute<ApiResponse<AuthUser>>({
        url: this.getRoute("account.updateInfo"),
        method: "PATCH",
        body: { ...payload },
      });
      return response.data;
    } catch (error) {
      Logger.error("Error updateInfo", error);
      throw error;
    }
  }
}
