// Versiones enmascaradas de los primitivos de navegación de react-router. Todas
// activan el estado del NavigationContext (`setLoading`) al navegar, para
// controlar manualmente la descarga del chunk lazy (workaround al bug de
// react-router con `lazy` + `import()`). El resto de la app SIEMPRE debe
// importar Link/NavLink/Navigate desde @Components, no desde react-router-dom.
export { Link } from "./Link";
export { NavLink } from "./NavLink";
export { Navigate } from "./Navigate";
