import { forwardRef } from "react";
import { NavLink as RouterNavLink, type NavLinkProps } from "react-router-dom";
import { useNavigationState } from "../../hooks/useNavigationState";
import { isSpaNavigation } from "./isSpaNavigation";

/**
 * `NavLink` enmascarado. Como el de react-router (conserva `isActive`/`isPending`
 * en `className`/`style`/children), pero al hacer click activa el loader de
 * navegación para cubrir la descarga del chunk lazy. Ver `Link` para el detalle
 * del workaround.
 */
export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  function NavLink({ onClick, target, ...rest }, ref) {
    const { setLoading } = useNavigationState();

    return (
      <RouterNavLink
        ref={ref}
        target={target}
        onClick={(e) => {
          onClick?.(e);
          if (isSpaNavigation(e, target)) setLoading(true);
        }}
        {...rest}
      />
    );
  },
);
