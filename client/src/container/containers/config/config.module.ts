import { Config } from "@Constant";
import type { NestedRoutes } from "@Types";
import { ContainerModule, type ContainerModuleLoadOptions } from "inversify";
import { CONFIG_TYPES } from "./config.types";

/**
 * Registra la configuración "horneada" en build (config.json) como valores
 * constantes en el contenedor: URL del API, flag de producción, el catálogo de
 * rutas del back (NestedRoutes) y los params. Cualquier servicio/caso de uso los
 * inyecta por token en vez de importar el JSON directamente.
 */
export const configModule = new ContainerModule(
  (options: ContainerModuleLoadOptions) => {
    options.bind<string>(CONFIG_TYPES._ApiUrl).toConstantValue(Config.Api);
    options.bind<boolean>(CONFIG_TYPES._IsProd).toConstantValue(Config.isProd);
    options
      .bind<NestedRoutes>(CONFIG_TYPES._Routes)
      .toConstantValue(Config.Routes);
    options
      .bind<Record<string, unknown>>(CONFIG_TYPES._Params)
      .toConstantValue(Config.Params);
  },
);
