import { Link } from "@Components";
import { USE_CASES_TYPES } from "@Container";
import { useInjection, useNavigate, useSession } from "@Hooks";
import type { SignInUseCase } from "@UseCase";
import { useState } from "react";
import { useTheme } from "../../../context/ThemeContext";
import { LogoColor, LogoWhite } from "@Assets/index";

const HIGHLIGHTS = [
  "Anónimo si quieres: tú decides cuándo mostrarte",
  "Conecta al azar con alguien nuevo",
  "Habla libre, sin miedo al qué dirán",
];

/**
 * Página de inicio de sesión. Layout dividido (branding + formulario) siguiendo
 * la línea de diseño UPTC. Demuestra el flujo completo: resuelve el caso de uso
 * por DI (`useInjection`), lo ejecuta, guarda la sesión y navega al dashboard.
 */
export default function SignIn() {
  const signIn = useInjection<SignInUseCase>(USE_CASES_TYPES._SignIn);
  const { InitSession } = useSession();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await signIn.execute({ email, password });
      InitSession(user);
      navigate("/dashboard");
    } catch {
      setError("No se pudo iniciar sesión. Verifica tus credenciales.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Panel de marca (motivacional) — oculto en móvil */}
      <aside className="relative hidden overflow-hidden bg-uptc-carbon lg:flex lg:flex-col lg:justify-center lg:px-14">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-uptc-gold/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 -left-24 h-80 w-80 rounded-full bg-uptc-gold/5 blur-3xl"
        />

        <div className="relative max-w-md">
          <span className="badge-gold animate-fade-up">
            Semillero de Programación · UPTC
          </span>

          <h1 className="animate-fade-up mt-6 font-display text-4xl font-bold leading-tight text-white xl:text-5xl">
            Conecta con desconocidos.{" "}
            <span className="text-uptc-gold-light">
              Habla sin miedo a ser juzgado.
            </span>
          </h1>

          <p className="animate-fade-up-slow mt-6 text-lg leading-relaxed text-neutral-300">
            Susurro es el espacio de la comunidad uptcista para conversar de forma anónima
            con otras personas. Sin nombres, sin prejuicios: solo conversaciones
            reales cuando tú quieras.
          </p>

          <ul className="animate-fade-up-slow mt-8 space-y-3">
            {HIGHLIGHTS.map((item) => (
              <li key={item} className="flex items-center gap-3 text-neutral-200">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-uptc-gold/15 text-uptc-gold-light">
                  <svg
                    viewBox="0 0 24 24"
                    className="size-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>

          <div className="divider-gold ml-0 mt-12" />
        </div>
      </aside>

      {/* Panel del formulario */}
      <main className="flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex flex-col items-center text-center">
            <img
              src={theme === "light" ? LogoColor : LogoWhite}
              alt="Universidad Pedagógica y Tecnológica de Colombia"
              className="h-14 w-auto"
            />
            <h2 className="mt-6 font-display text-2xl font-bold text-uptc-carbon dark:text-white">
              Bienvenido de vuelta
            </h2>
            <p className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400">
              Inicia sesión y sigue conversando en <strong>Susurro</strong>
            </p>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="email" className="field-label">
                Correo institucional
              </label>
              <input
                id="email"
                type="email"
                placeholder="tucorreo@uptc.edu.co"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="field-input"
              />
            </div>

            <div>
              <label htmlFor="password" className="field-label">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="field-input"
              />
            </div>

            {error ? <p className="field-error">{error}</p> : null}

            <button type="submit" disabled={loading} className="btn-gold mt-2 w-full">
              {loading ? "Entrando..." : "Iniciar sesión"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
            ¿No tienes cuenta?{" "}
            <Link
              to="/register"
              className="font-semibold text-uptc-gold hover:underline"
            >
              Regístrate
            </Link>
          </p>

          <p className="mt-6 text-center text-xs text-neutral-400">
            Semillero de Programación · UPTC
          </p>
        </div>
      </main>
    </div>
  );
}
