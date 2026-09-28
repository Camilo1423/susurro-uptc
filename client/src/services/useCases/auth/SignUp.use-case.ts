import { CONFIG_TYPES, NETWORK_TYPES } from "@Container";
import type {
  ApiResponse,
  AuthUser,
  NestedRoutes,
  SignUpRequest,
} from "@Types";
import { Logger } from "@Utils";
import type { AxiosService } from "@Services";
import { inject, injectable } from "inversify";
import { AbstractService } from "../abstract/abstract.use-case";

@injectable()
export class SignUpUseCase extends AbstractService<AuthUser> {
  private readonly axiosRequest: AxiosService;

  constructor(
    @inject(NETWORK_TYPES._AxiosRequest) axiosRequest: AxiosService,
    @inject(CONFIG_TYPES._Routes) routes: NestedRoutes,
    @inject(CONFIG_TYPES._IsProd) isProd: boolean,
  ) {
    super(routes, isProd);
    this.axiosRequest = axiosRequest;
  }

  /** Registra un usuario (queda activo y confirmado). Devuelve el usuario creado. */
  async execute(payload: SignUpRequest): Promise<AuthUser> {
    try {
      const response = await this.axiosRequest.execute<ApiResponse<AuthUser>>({
        url: this.getRoute("auth.signUp"),
        method: "POST",
        body: { ...payload },
      });
      return response.data;
    } catch (error) {
      Logger.error("Error signUp", error);
      throw error;
    }
  }
}
