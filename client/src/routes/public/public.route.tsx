import { lazy } from "react";
import PublicMiddleware from "../../middleware/public.middleware";
import { LayoutPublic } from "./layout/Layout";

const SignIn = lazy(() => import("@Pages/(public)/sign-in/SignIn"));
const SignUp = lazy(() => import("@Pages/(public)/sign-up/SignUp"));
const NotFoundPage = lazy(() => import("@Pages/notFound/NotFound"));

/**
 * Rutas públicas (estáticas). El login es el índice de `/`. El guard
 * `PublicMiddleware` expulsa al dashboard si ya hay sesión.
 */
export const publicRoutes = [
  {
    path: "/",
    element: (
      <PublicMiddleware>
        <LayoutPublic />
      </PublicMiddleware>
    ),
    children: [
      {
        index: true,
        element: <SignIn />,
      },
      {
        path: "register",
        element: <SignUp />,
      },
      {
        path: "*",
        element: <NotFoundPage redirectTo="/" />,
      },
    ],
  },
];
