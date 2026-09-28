import type { NestedRoutes } from "@Types";
import { Logger } from "@Utils";

/**
 * Base de todos los casos de uso. Recibe el catálogo de rutas (NestedRoutes) y
 * el flag de producción por inyección. Su método `getRoute` resuelve un endpoint
 * a partir de una clave con notación de puntos (p. ej. `"auth.signIn"`) y
 * reemplaza los `:params` posicionalmente.
 */
export abstract class AbstractService<T = unknown> {
  private readonly routes: NestedRoutes;
  readonly isProd: boolean;

  constructor(routes: NestedRoutes, isProd: boolean) {
    this.routes = routes;
    this.isProd = isProd;
  }

  abstract execute(...args: unknown[]): Promise<T>;

  getRoute = (route: string, params: string[] = []): string => {
    const routePath = this.resolveRoutePath(route);
    this.validateRouteParams(route, routePath, params);
    const finalRoute = this.replaceRouteParams(routePath, params);
    return finalRoute;
  };

  /** Resuelve la ruta navegando el objeto anidado por la clave con puntos. */
  private readonly resolveRoutePath = (route: string): string => {
    const routeParts = route.split(".");
    let currentLevel: string | NestedRoutes = this.routes;

    for (let i = 0; i < routeParts.length; i++) {
      const part = routeParts[i];

      if (typeof currentLevel === "string") {
        Logger.error(
          `Cannot navigate further. '${routeParts
            .slice(0, i)
            .join(".")}' already resolved to a route`,
        );
        throw new Error(
          `Route '${route}' is invalid. Premature route resolution`,
        );
      }

      if (!currentLevel[part]) {
        Logger.error(
          `Route part '${part}' does not exist in path '${routeParts
            .slice(0, i + 1)
            .join(".")}'`,
        );
        throw new Error(`Route '${route}' not found. Failed at '${part}'`);
      }

      currentLevel = currentLevel[part];
    }

    if (typeof currentLevel !== "string") {
      Logger.error(`Route '${route}' does not resolve to a valid path`);
      throw new Error(`Route '${route}' is not a valid endpoint`);
    }

    return currentLevel;
  };

  /** Avisa si el número de parámetros no coincide con los `:params` de la ruta. */
  private readonly validateRouteParams = (
    route: string,
    routePath: string,
    params: string[],
  ): void => {
    const requiredParams = (routePath.match(/:[^/]+/g) || []).length;

    if (requiredParams > 0 && params.length === 0) {
      Logger.warn(
        `Route '${route}' requires ${requiredParams} parameters but none were provided`,
      );
    }

    if (params.length > 0 && params.length < requiredParams) {
      const missingParams = requiredParams - params.length;
      Logger.warn(
        `Route '${route}' requires ${requiredParams} parameters but only ${params.length} were provided. Missing ${missingParams} parameters`,
      );
    }
  };

  /** Reemplaza los `:params` de la ruta por los valores dados (por posición). */
  private readonly replaceRouteParams = (
    routePath: string,
    params: string[],
  ): string => {
    if (params.length === 0) {
      return routePath;
    }

    let finalRoute = routePath;
    const dynamicParams = routePath.match(/:[^/]+/g) || [];

    dynamicParams.forEach((dynamicParam, index) => {
      if (params[index]) {
        finalRoute = finalRoute.replace(dynamicParam, params[index]);
      }
    });

    return finalRoute;
  };
}
