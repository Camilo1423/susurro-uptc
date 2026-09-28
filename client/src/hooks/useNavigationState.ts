import { useContext } from "react";
import { NavContext } from "../context/NavigationContext";

/** Accede al estado de navegación (loading) proporcionado por NavigationProvider. */
export const useNavigationState = () => {
  const ctx = useContext(NavContext);
  if (!ctx) {
    throw new Error(
      "useNavigationState debe usarse dentro de <NavigationProvider>",
    );
  }
  return ctx;
};
