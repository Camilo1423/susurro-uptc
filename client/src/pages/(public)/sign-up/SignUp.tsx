import { Link } from "@Components";
import { USE_CASES_TYPES } from "@Container";
import { useInjection, useNavigate, useSession } from "@Hooks";
import type { DocumentTypeOption, SignUpRequest } from "@Types";
import type {
  GetDocumentTypesUseCase,
  SignInUseCase,
  SignUpUseCase,
} from "@UseCase";
import { useEffect, useState } from "react";
import { useTheme } from "../../../context/ThemeContext";
import { LogoColor, LogoWhite } from "@Assets/index";

type FormState = SignUpRequest;

const INITIAL: FormState = {
  email: "",
  username: "",
  password: "",
  firstName: "",
  secondName: "",
  firstLastName: "",
  secondLastName: "",
  documentTypeId: "",
  documentNumber: "",
  phoneNumber: "",
};

/** Extrae un mensaje legible del error del backend. */
function errorMessage(err: unknown): string {
  const data = err as { message?: string | string[] } | undefined;
  const m = data?.message;
  if (Array.isArray(m)) return m[0];
  if (typeof m === "string") return m;
  return "No se pudo completar el registro.";
}

/** Registro público. Al completarse, inicia sesión automáticamente. */
export default function SignUp() {
  const signUp = useInjection<SignUpUseCase>(USE_CASES_TYPES._SignUp);
  const signIn = useInjection<SignInUseCase>(USE_CASES_TYPES._SignIn);
  const getDocumentTypes = useInjection<GetDocumentTypesUseCase>(
    USE_CASES_TYPES._GetDocumentTypes,
  );
  const { InitSession } = useSession();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [docTypes, setDocTypes] = useState<DocumentTypeOption[]>([]);
  const [form, setForm] = useState<FormState>(INITIAL);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getDocumentTypes
      .execute()
      .then(setDocTypes)
      .catch(() => setDocTypes([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // Solo enviamos los opcionales si tienen valor.
      const payload: SignUpRequest = {
        email: form.email.trim(),
        username: form.username.trim(),
        password: form.password,
        firstName: form.firstName.trim(),
        firstLastName: form.firstLastName.trim(),
        documentTypeId: form.documentTypeId,
        documentNumber: form.documentNumber.trim(),
        ...(form.secondName?.trim() ? { secondName: form.secondName.trim() } : {}),
        ...(form.secondLastName?.trim()
          ? { secondLastName: form.secondLastName.trim() }
          : {}),
        ...(form.phoneNumber?.trim()
          ? { phoneNumber: form.phoneNumber.trim() }
          : {}),
      };

      await signUp.execute(payload);
      // Auto-login reutilizando el sign-in existente.
      const user = await signIn.execute({
        email: payload.email,
        password: payload.password,
      });
      InitSession(user);
      navigate("/dashboard");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Panel de marca */}
      <aside className="relative hidden overflow-hidden bg-uptc-carbon lg:flex lg:flex-col lg:justify-center lg:px-14">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-uptc-gold/10 blur-3xl"
        />
        <div className="relative max-w-md">
          <span className="badge-gold animate-fade-up">
            Semillero de Programación · UPTC
          </span>
          <h1 className="animate-fade-up mt-6 font-display text-4xl font-bold leading-tight text-white xl:text-5xl">
            Crea tu cuenta y{" "}
            <span className="text-uptc-gold-light">habla sin filtros.</span>
          </h1>
          <p className="animate-fade-up-slow mt-6 text-lg leading-relaxed text-neutral-300">
            Únete a Susurro para conocer gente nueva de la universidad y conversar de
            forma anónima, sin miedo a ser juzgado. Tu cuenta queda activa al
            instante.
          </p>
          <div className="divider-gold ml-0 mt-12" />
        </div>
      </aside>

      {/* Formulario */}
      <main className="flex items-center justify-center overflow-y-auto px-5 py-10">
        <div className="w-full max-w-md">
          <div className="mb-6 flex flex-col items-center text-center">
            <img
              src={theme === "light" ? LogoColor : LogoWhite}
              alt="UPTC"
              className="h-12 w-auto"
            />
            <h2 className="mt-4 font-display text-2xl font-bold text-uptc-carbon dark:text-white">
              Crear cuenta
            </h2>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <F label="Primer nombre" value={form.firstName} onChange={set("firstName")} placeholder="Andrés" />
              <F label="Segundo nombre" value={form.secondName ?? ""} onChange={set("secondName")} placeholder="Camilo" optional />
              <F label="Primer apellido" value={form.firstLastName} onChange={set("firstLastName")} placeholder="Moreno" />
              <F label="Segundo apellido" value={form.secondLastName ?? ""} onChange={set("secondLastName")} placeholder="Roa" optional />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="field-label" htmlFor="documentTypeId">Tipo doc.</label>
                <select
                  id="documentTypeId"
                  required
                  value={form.documentTypeId}
                  onChange={set("documentTypeId")}
                  className="field-input"
                >
                  <option value="" disabled>—</option>
                  {docTypes.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.code}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <F label="Número de documento" value={form.documentNumber} onChange={set("documentNumber")} placeholder="1234567890" />
              </div>
            </div>

            <F label="Correo" type="email" value={form.email} onChange={set("email")} placeholder="tucorreo@uptc.edu.co" />
            <F label="Usuario" value={form.username} onChange={set("username")} placeholder="juanperez" />
            <F label="Contraseña" type="password" value={form.password} onChange={set("password")} placeholder="Mínimo 8 caracteres" />
            <F label="Teléfono" value={form.phoneNumber ?? ""} onChange={set("phoneNumber")} placeholder="+57 300 123 4567" optional />

            {error ? <p className="field-error">{error}</p> : null}

            <button type="submit" disabled={loading} className="btn-gold mt-2 w-full">
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
            ¿Ya tienes cuenta?{" "}
            <Link to="/" className="font-semibold text-uptc-gold hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

/** Campo de texto con etiqueta y marca de opcional. */
function F({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  optional = false,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  optional?: boolean;
}) {
  return (
    <div>
      <label className="field-label flex items-center gap-1.5">
        <span>{label}</span>
        {optional ? (
          <span className="text-[11px] font-normal text-neutral-400">
            (opcional)
          </span>
        ) : (
          <span className="text-uptc-gold" aria-hidden>
            *
          </span>
        )}
      </label>
      <input
        type={type}
        className="field-input"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={!optional}
      />
    </div>
  );
}
