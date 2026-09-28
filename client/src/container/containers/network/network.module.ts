import { ContainerModule, type ContainerModuleLoadOptions } from "inversify";
import { AxiosService } from "@Services";
import { NETWORK_TYPES } from "./network.types";

export const networkModule = new ContainerModule(
  (options: ContainerModuleLoadOptions) => {
    options
      .bind<AxiosService>(NETWORK_TYPES._AxiosRequest)
      .to(AxiosService)
      .inSingletonScope();
  },
);
