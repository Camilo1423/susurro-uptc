import { Providers } from "@Providers";
import { createBrowserRouter } from "react-router-dom";
import { privateRoutes } from "./private/private.route";
import { publicRoutes } from "./public/public.route";

/**
 * Crea el router de la aplicación. El árbol es **estático**: se combinan los
 * arrays `publicRoutes` y `privateRoutes` bajo un `Providers` raíz en `/`.
 */
export const createRouter = () => {
  return createBrowserRouter([
    {
      path: "/",
      element: <Providers />,
      children: [...publicRoutes, ...privateRoutes],
    },
  ]);
};
