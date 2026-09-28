import { CONFIG_TYPES, NETWORK_TYPES, SERVICES_TYPES } from "@Container";
import type { NestedRoutes } from "@Types";
import { SIGN_IN_STATUS_KEY } from "@Types";
import { Logger } from "@Utils";
import type { AxiosService, LocalStorageService } from "@Services";
import { inject, injectable } from "inversify";
import { AbstractService } from "../abstract/abstract.use-case";

@injectable()
export class SignOutUseCase extends AbstractService<void> {
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
   * Cierra sesión usando la cookie refresh_token. El backend limpia las
   * cookies; se elimina `statusSignIn` de localStorage. El consumidor debe
   * limpiar el estado global aunque la petición falle.
   */
  async execute(): Promise<void> {
    try {
      await this.axiosRequest.execute<unknown>({
        url: this.getRoute("auth.signOut"),
        method: "POST",
        queryParams: { rf: "true" },
      });
    } catch (error) {
      Logger.error("Error signOut", error);
      throw error;
    } finally {
      this.storage.removeItem(SIGN_IN_STATUS_KEY);
    }
  }
}
