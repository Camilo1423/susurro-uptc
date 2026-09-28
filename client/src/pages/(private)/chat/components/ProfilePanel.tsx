import { USE_CASES_TYPES } from "@Container";
import { useInjection } from "@Hooks";
import { setSession, updateSession, useAppDispatch, useAppSelector } from "@Redux";
import type {
  DeleteAvatarUseCase,
  UpdateInfoUseCase,
  UploadAvatarUseCase,
} from "@UseCase";
import {
  ArrowLeft,
  Camera,
  Eye,
  ImagePlus,
  Loader2,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { postCrossTab } from "@Utils";
import AvatarCropper from "./AvatarCropper";

interface ProfilePanelProps {
  onClose: () => void;
}

/** Tamaño máximo permitido para la imagen de perfil (5 MB). */
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Vista de perfil (reemplaza el canvas del chat). Ver/editar datos personales y
 * gestionar la foto: al pasar el mouse sobre el avatar aparecen las acciones
 * (ver / actualizar / eliminar, o solo cargar si no hay foto). El recorte y el
 * visor son modales. Todo vía casos de uso (Inversify).
 */
export default function ProfilePanel({ onClose }: ProfilePanelProps) {
  const user = useAppSelector((state) => state.session.user);
  const dispatch = useAppDispatch();

  const updateInfo = useInjection<UpdateInfoUseCase>(USE_CASES_TYPES._UpdateInfo);
  const uploadAvatar = useInjection<UploadAvatarUseCase>(
    USE_CASES_TYPES._UploadAvatar,
  );
  const deleteAvatar = useInjection<DeleteAvatarUseCase>(
    USE_CASES_TYPES._DeleteAvatar,
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [avatarBusy, setAvatarBusy] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [form, setForm] = useState({
    firstName: user?.firstName ?? "",
    secondName: user?.secondName ?? "",
    firstLastName: user?.firstLastName ?? "",
    secondLastName: user?.secondLastName ?? "",
    phoneNumber: user?.phoneNumber ?? "",
  });

  // Escape: cierra primero el visor, luego el recorte, y por último el perfil.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (viewerOpen) setViewerOpen(false);
      else if (pendingFile) setPendingFile(null);
      else onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [viewerOpen, pendingFile, onClose]);

  if (!user) return null;

  const initials =
    `${user.firstName?.[0] ?? ""}${user.firstLastName?.[0] ?? ""}`.toUpperCase();
  const thumb = user.avatar?.thumbnail;
  const original = user.avatar?.original;
  const fullName = [
    user.firstName,
    user.secondName,
    user.firstLastName,
    user.secondLastName,
  ]
    .filter(Boolean)
    .join(" ");

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setOk(false);
    try {
      const payload = Object.fromEntries(
        Object.entries(form).map(([k, v]) => [k, v.trim()]),
      );
      const updated = await updateInfo.execute(payload);
      dispatch(setSession(updated));
      postCrossTab({ type: "session-set", user: updated }); // replica a otras pestañas
      setOk(true);
    } catch {
      setError("No se pudieron guardar los cambios.");
    } finally {
      setSaving(false);
    }
  };

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setAvatarError("El archivo debe ser una imagen (JPG, JPEG o PNG).");
      return;
    }
    if (f.size > MAX_FILE_SIZE) {
      setAvatarError("La imagen no debe superar los 5 MB.");
      return;
    }
    setAvatarError(null);
    setPendingFile(f);
  };

  const onCropConfirm = async (blob: Blob) => {
    setAvatarBusy(true);
    setAvatarError(null);
    try {
      const urls = await uploadAvatar.execute(blob);
      const v = Date.now();
      const patch = {
        avatar: {
          thumbnail: urls.thumbnail ? `${urls.thumbnail}&v=${v}` : null,
          original: urls.original ? `${urls.original}&v=${v}` : null,
        },
      };
      dispatch(updateSession(patch));
      postCrossTab({ type: "session-patch", patch }); // replica a otras pestañas
      setImgError(false);
      setPendingFile(null);
    } catch {
      setAvatarError("No se pudo subir la foto.");
    } finally {
      setAvatarBusy(false);
    }
  };

  const onDeleteAvatar = async () => {
    setAvatarBusy(true);
    setAvatarError(null);
    try {
      await deleteAvatar.execute();
      const patch = { avatar: { thumbnail: null, original: null } };
      dispatch(updateSession(patch));
      postCrossTab({ type: "session-patch", patch }); // replica a otras pestañas
    } catch {
      setAvatarError("No se pudo eliminar la foto.");
    } finally {
      setAvatarBusy(false);
    }
  };

  const hasAvatar = Boolean(thumb) && !imgError;

  return (
    <main className="flex flex-1 flex-col">
      {/* Cabecera con botón volver */}
      <header className="flex items-center gap-3 border-b border-neutral-200/70 bg-white px-6 py-3 dark:border-white/5 dark:bg-uptc-graphite">
        <button
          type="button"
          onClick={onClose}
          aria-label="Volver"
          className="grid size-9 place-items-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-white/5"
        >
          <ArrowLeft className="size-5" />
        </button>
        <p className="font-display text-lg font-bold text-uptc-carbon dark:text-white">
          Mi perfil
        </p>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-10">
        <div className="mx-auto max-w-sm">
          {/* Avatar con acciones al hover */}
          <div className="flex flex-col items-center">
            <div className="group relative size-32">
              <div className="grid size-32 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-uptc-gold/40 to-uptc-gold/10 text-4xl font-bold text-uptc-carbon dark:text-uptc-gold-light">
                {hasAvatar ? (
                  <img
                    src={thumb ?? undefined}
                    alt="Foto de perfil"
                    className="size-full object-cover"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  initials
                )}
              </div>

              {/* Overlay de acciones */}
              <div className="absolute inset-0 flex items-center justify-center gap-2 rounded-full bg-black/55 opacity-0 backdrop-blur-[1px] transition-opacity duration-200 group-hover:opacity-100">
                {avatarBusy ? (
                  <Loader2 className="size-6 animate-spin text-white" />
                ) : hasAvatar ? (
                  <>
                    <IconAction label="Ver" onClick={() => setViewerOpen(true)}>
                      <Eye className="size-5" />
                    </IconAction>
                    <IconAction
                      label="Actualizar"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera className="size-5" />
                    </IconAction>
                    <IconAction label="Eliminar" onClick={() => void onDeleteAvatar()}>
                      <Trash2 className="size-5" />
                    </IconAction>
                  </>
                ) : (
                  <IconAction
                    label="Cargar"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImagePlus className="size-5" />
                  </IconAction>
                )}
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={onPickFile}
              className="hidden"
            />

            <h2 className="mt-4 text-center font-display text-2xl font-bold text-uptc-carbon dark:text-white">
              {fullName}
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              @{user.username} · {user.email}
            </p>
            <span className="mt-3 rounded-full bg-uptc-gold/10 px-3 py-1 text-xs font-semibold tracking-widest text-uptc-gold">
              PIN {user.pin}
            </span>

            {avatarError ? (
              <p className="mt-3 text-xs font-medium text-red-600 dark:text-red-400">
                {avatarError}
              </p>
            ) : null}
          </div>

          {/* Edición de datos personales */}
          <form onSubmit={onSave} className="mt-8 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Datos personales
              </p>
              <p className="text-[11px] text-neutral-400">
                <span className="text-uptc-gold">*</span> obligatorio
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field id="firstName" label="Primer nombre" value={form.firstName} onChange={set("firstName")} placeholder="Andrés" />
              <Field id="secondName" label="Segundo nombre" value={form.secondName} onChange={set("secondName")} placeholder="Camilo" optional />
              <Field id="firstLastName" label="Primer apellido" value={form.firstLastName} onChange={set("firstLastName")} placeholder="Moreno" />
              <Field id="secondLastName" label="Segundo apellido" value={form.secondLastName} onChange={set("secondLastName")} placeholder="Roa" optional />
            </div>
            <Field id="phoneNumber" label="Teléfono" value={form.phoneNumber} onChange={set("phoneNumber")} placeholder="+57 300 123 4567" optional />

            {error ? <p className="field-error">{error}</p> : null}
            {ok ? (
              <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                Cambios guardados.
              </p>
            ) : null}

            <div className="mt-1 flex justify-end gap-2">
              <button type="button" onClick={onClose} className="btn-outline">
                Salir
              </button>
              <button type="submit" disabled={saving} className="btn-gold">
                {saving ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal: recorte 4:4 */}
      {pendingFile ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !avatarBusy) setPendingFile(null);
          }}
        >
          <div className="animate-scale-in w-full max-w-md rounded-2xl bg-white p-6 shadow-soft dark:bg-uptc-graphite">
            <h3 className="mb-4 font-display text-lg font-bold text-uptc-carbon dark:text-white">
              Ajusta tu foto
            </h3>
            <AvatarCropper
              file={pendingFile}
              busy={avatarBusy}
              onCancel={() => setPendingFile(null)}
              onConfirm={onCropConfirm}
            />
          </div>
        </div>
      ) : null}

      {/* Modal: visor de la foto (original) */}
      {viewerOpen && original ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-6"
          onMouseDown={() => setViewerOpen(false)}
        >
          <button
            type="button"
            aria-label="Cerrar"
            onClick={() => setViewerOpen(false)}
            className="absolute right-5 top-5 grid size-10 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <X className="size-5" />
          </button>
          <img
            src={original}
            alt="Foto de perfil"
            className="max-h-[85vh] max-w-[85vw] rounded-2xl object-contain"
          />
        </div>
      ) : null}
    </main>
  );
}

/** Botón redondo de acción sobre el avatar. */
function IconAction({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className="grid size-9 place-items-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/30"
    >
      {children}
    </button>
  );
}

/** Campo de formulario con etiqueta, placeholder y marca de opcional/obligatorio. */
function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  optional = false,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  optional?: boolean;
}) {
  return (
    <div>
      <label className="field-label flex items-center gap-1.5" htmlFor={id}>
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
        id={id}
        className="field-input"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}
