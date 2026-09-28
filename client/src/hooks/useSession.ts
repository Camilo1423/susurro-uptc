import { SERVICES_TYPES, USE_CASES_TYPES } from "@Container";
import {
  clearSession,
  closeModal,
  openModal,
  setGlobalLoading,
  setSession,
  updateSession as updateSessionAction,
  useAppDispatch,
} from "@Redux";
import type { LocalStorageService } from "@Services";
import type { AuthUser } from "@Types";
import { SIGN_IN_STATUS_KEY, SignInStatus } from "@Types";
import type { SignOutUseCase, WhoAmIUseCase } from "@UseCase";
import { Logger } from "@Utils";
import { useState } from "react";
import { useInjection } from "./useInjection";

/**
 * Controla el ciclo de vida de la sesión: rehidratación al arrancar, logout y
 * reset al login. Como las cookies son httpOnly (no legibles desde JS), la
 * referencia de sesión del front es el flag `statusSignIn` de localStorage
 * combinado con el usuario en Redux.
 */
const useSession = () => {
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const dispatch = useAppDispatch();

  const whoAmI = useInjection<WhoAmIUseCase>(USE_CASES_TYPES._WhoAmI);
  const signOut = useInjection<SignOutUseCase>(USE_CASES_TYPES._SignOut);
  const storage = useInjection<LocalStorageService>(
    SERVICES_TYPES._LocalStorageService,
  );

  /** Guarda la sesión recién autenticada (tras sign-in). */
  const InitSession = (session: AuthUser) => {
    dispatch(setSession(session));
  };

  /** Actualiza parcialmente los datos del usuario en sesión. */
  const updateSession = (changes: Partial<AuthUser>) => {
    dispatch(
      updateSessionAction({ ...changes, updatedAt: new Date().toISOString() }),
    );
  };

  /** Marca la sesión como expirada de forma síncrona (arranque). */
  const isExpired = () => {
    storage.removeItem(SIGN_IN_STATUS_KEY);
    dispatch(clearSession());
  };

  /**
   * Vuelve al login limpiando todo. Activa el loader global un tick para dar
   * tiempo a React a desmontar/remontar el RouterProvider limpio en `/`.
   */
  const resetToLogin = async () => {
    dispatch(setGlobalLoading(true));
    storage.removeItem(SIGN_IN_STATUS_KEY);
    window.history.replaceState(null, "", "/");
    dispatch(clearSession());
    dispatch(closeModal());
    await new Promise((resolve) => setTimeout(resolve, 0));
    dispatch(setGlobalLoading(false));
  };

  /** Logout explícito: notifica al backend en segundo plano y vuelve al login. */
  const RemoveSession = async () => {
    signOut.execute().catch((error) => {
      Logger.error("Error trying to sign out", error);
    });
    await resetToLogin();
  };

  /**
   * Rehidrata la sesión al arrancar: si `statusSignIn === DONE` consulta
   * who-am-i y restaura el usuario en el store. Si algo falla, limpia la sesión.
   */
  const reloadSession = async () => {
    try {
      const status = storage.getItem<string>(SIGN_IN_STATUS_KEY);
      if (status === SignInStatus.Done) {
        const dataUser = await whoAmI.execute();
        if (dataUser) {
          dispatch(setSession(dataUser));
        } else {
          isExpired();
        }
      }
    } catch (error) {
      Logger.error("Error trying to reload session", error);
      dispatch(openModal());
    } finally {
      setIsLoadingSession(false);
    }
  };

  return {
    isLoadingSession,
    InitSession,
    updateSession,
    isExpired,
    resetToLogin,
    RemoveSession,
    reloadSession,
  };
};

export default useSession;
