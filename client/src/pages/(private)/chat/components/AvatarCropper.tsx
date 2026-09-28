import { useCallback, useEffect, useRef, useState } from "react";

interface AvatarCropperProps {
  /** Imagen original elegida por el usuario. */
  file: File;
  busy?: boolean;
  onCancel: () => void;
  /** Devuelve el recorte cuadrado (webp) listo para subir. */
  onConfirm: (blob: Blob) => void;
}

/** Lado del área de recorte en pantalla (px). */
const VIEWPORT = 340;
/** Lado del cuadrado exportado (px). */
const TARGET = 512;

/**
 * Recorta la imagen a aspecto 1:1 (cuadrado). El usuario mueve (arrastrando) y
 * hace zoom para elegir qué parte queda dentro del cuadrado. Al confirmar,
 * dibuja esa región en un canvas y la exporta como webp.
 */
export default function AvatarCropper({
  file,
  busy = false,
  onCancel,
  onConfirm,
}: AvatarCropperProps) {
  const [url, setUrl] = useState<string>("");
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [nat, setNat] = useState<{ w: number; h: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number } | null>(null);

  // Object URL de la imagen elegida.
  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const baseScale = nat ? Math.max(VIEWPORT / nat.w, VIEWPORT / nat.h) : 1;
  const displayScale = baseScale * zoom;
  const dw = nat ? nat.w * displayScale : 0;
  const dh = nat ? nat.h * displayScale : 0;

  /** Mantiene el offset dentro de rango para que la imagen siempre cubra el cuadro. */
  const clamp = useCallback(
    (o: { x: number; y: number }, w: number, h: number) => ({
      x: Math.min(0, Math.max(VIEWPORT - w, o.x)),
      y: Math.min(0, Math.max(VIEWPORT - h, o.y)),
    }),
    [],
  );

  const onImgLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const el = e.currentTarget;
    imgRef.current = el;
    const w = el.naturalWidth;
    const h = el.naturalHeight;
    setNat({ w, h });
    const bScale = Math.max(VIEWPORT / w, VIEWPORT / h);
    const iw = w * bScale;
    const ih = h * bScale;
    setZoom(1);
    setOffset({ x: (VIEWPORT - iw) / 2, y: (VIEWPORT - ih) / 2 });
  };

  const onPointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const next = { x: e.clientX - drag.current.x, y: e.clientY - drag.current.y };
    setOffset(clamp(next, dw, dh));
  };
  const onPointerUp = () => {
    drag.current = null;
  };

  const onZoom = (value: number) => {
    if (!nat) return;
    const newDisplay = baseScale * value;
    const newDw = nat.w * newDisplay;
    const newDh = nat.h * newDisplay;
    // Mantiene fijo el punto central del cuadro al hacer zoom.
    const cx = (VIEWPORT / 2 - offset.x) / displayScale;
    const cy = (VIEWPORT / 2 - offset.y) / displayScale;
    const next = {
      x: VIEWPORT / 2 - cx * newDisplay,
      y: VIEWPORT / 2 - cy * newDisplay,
    };
    setZoom(value);
    setOffset(clamp(next, newDw, newDh));
  };

  const confirm = () => {
    const img = imgRef.current;
    if (!img || !nat) return;
    const cropSize = VIEWPORT / displayScale;
    const cropX = -offset.x / displayScale;
    const cropY = -offset.y / displayScale;

    const canvas = document.createElement("canvas");
    canvas.width = TARGET;
    canvas.height = TARGET;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, cropX, cropY, cropSize, cropSize, 0, 0, TARGET, TARGET);
    canvas.toBlob(
      (blob) => {
        if (blob) onConfirm(blob);
      },
      "image/webp",
      0.9,
    );
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        Arrastra para mover y usa el control para acercar. El recuadro es lo que
        se guardará.
      </p>

      <div
        className="relative overflow-hidden rounded-2xl bg-neutral-100 dark:bg-uptc-carbon"
        style={{ width: VIEWPORT, height: VIEWPORT, touchAction: "none" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {url ? (
          <img
            src={url}
            alt="Recorte de avatar"
            draggable={false}
            onLoad={onImgLoad}
            className="absolute cursor-grab select-none active:cursor-grabbing"
            style={{
              width: dw || undefined,
              height: dh || undefined,
              // Anula `img { max-width:100%; height:auto }` de Tailwind preflight,
              // que deformaba la imagen al hacer zoom.
              maxWidth: "none",
              maxHeight: "none",
              left: offset.x,
              top: offset.y,
            }}
          />
        ) : null}
        {/* Guía circular: cómo se verá el avatar. */}
        <div className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-white/70 dark:ring-black/40" />
      </div>

      <input
        type="range"
        min={1}
        max={3}
        step={0.01}
        value={zoom}
        onChange={(e) => onZoom(Number(e.target.value))}
        aria-label="Zoom"
        className="w-full accent-uptc-gold"
      />

      <div className="flex w-full items-center justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={busy}
          className="btn-outline"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={confirm}
          disabled={busy || !nat}
          className="btn-gold"
        >
          {busy ? "Subiendo..." : "Guardar foto"}
        </button>
      </div>
    </div>
  );
}
