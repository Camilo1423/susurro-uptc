import { CONFIG_TYPES, NETWORK_TYPES, SERVICES_TYPES } from "@Container";
import type {
  ApiResponse,
  NestedRoutes,
  SignInRequest,
  SignInResult,
} from "@Types";
import { SIGN_IN_STATUS_KEY, SignInStatus } from "@Types";
import { Logger } from "@Utils";
import type { AxiosService, LocalStorageService } from "@Services";
import { inject, injectable } from "inversify";
import { AbstractService } from "../abstract/abstract.use-case";

@injectable()
export class SignInUseCase extends AbstractService<SignInResult> {
  private readonly axiosRequest: AxiosService;
  private readonly storage: LocalStorageService;

  constructor(
    @inject(NETWORK_TYPES._AxiosRequest) axiosRequest: AxiosService,
    @inject(SERVICES_TYPES._LocalStorageService) storage: LocalStorageService,
    @inject(CONFIG_TYPES._Routes) routes: NestedRoutes,
    @inject(CONFIG_TYPES._IsProd) isProd: boolean,
  ) {
    super(routes, isProd);
    this.axiosRequest = axiosRequest;
    this.storage = storage;
  }

  /**
   * Inicia sesión. Las cookies (access_token / refresh_token) las setea el
   * backend automáticamente. Persiste `statusSignIn=DONE` en localStorage como
   * referencia de sesión (las cookies httpOnly no son legibles desde JS).
   */
  async execute(payload: SignInRequest): Promise<SignInResult> {
    try {
      const response = await this.axiosRequest.execute<
        ApiResponse<SignInResult>
      >({
        url: this.getRoute("auth.signIn"),
        method: "POST",
        body: { ...payload },
      });

      const result = response.data;
      this.storage.setItem(SIGN_IN_STATUS_KEY, SignInStatus.Done);
      return result;
    } catch (error) {
      Logger.error("Error signIn", error);
      throw error;
    }
  }
}
