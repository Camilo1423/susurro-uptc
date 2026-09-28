import { createContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

type NavContextType = {
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

const NavContext = createContext<NavContextType | undefined>(undefined);

/**
 * Expone un estado de "navegación en curso" que se apaga al cambiar de ruta.
 * Lo activan los hooks de navegación para mostrar loaders entre páginas lazy.
 */
function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setLoading(false);
  }, [location]);

  const contextValue = useMemo(
    () => ({ loading, setLoading }),
    [loading, setLoading],
  );

  return (
    <NavContext.Provider value={contextValue}>{children}</NavContext.Provider>
  );
}

export { NavigationProvider, NavContext };
