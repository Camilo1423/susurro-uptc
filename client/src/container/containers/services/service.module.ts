import { ContainerModule, type ContainerModuleLoadOptions } from "inversify";
import { SERVICES_TYPES } from "./services.types";
import { CookieService, LocalStorageService } from "@Services";

export const servicesModule = new ContainerModule(
  (options: ContainerModuleLoadOptions) => {
    options
      .bind<LocalStorageService>(SERVICES_TYPES._LocalStorageService)
      .to(LocalStorageService);

    options
      .bind<CookieService>(SERVICES_TYPES._CookieService)
      .to(CookieService);
  },
);
