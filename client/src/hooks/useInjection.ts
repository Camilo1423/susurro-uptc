import type { ServiceIdentifier } from "inversify";
import { appContainer } from "@Container";

/**
 * Resuelve una dependencia del contenedor de Inversify a partir de su token.
 *
 * @example
 * const signIn = useInjection<SignInUseCase>(USE_CASES_TYPES._SignIn);
 */
export const useInjection = <T>(identifier: ServiceIdentifier<T>): T => {
  return appContainer.get<T>(identifier);
};
