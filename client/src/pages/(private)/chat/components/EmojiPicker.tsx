import Picker, { EmojiStyle, Theme } from "emoji-picker-react";

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

/**
 * Selector de emojis completo (emoji-picker-react): categorías, buscador, tonos
 * de piel y "usados recientemente" (los persiste la propia librería). Emojis
 * nativos del sistema (sin descargar imágenes). Se cierra al tocar fuera.
 */
export default function EmojiPicker({ onSelect, onClose }: EmojiPickerProps) {
  // Tema efectivo: se lee del atributo que fija el ThemeProvider (resuelve "system").
  const isDark =
    typeof document !== "undefined" &&
    document.documentElement.getAttribute("data-theme") === "dark";

  return (
    <>
      {/* Fondo para cerrar al tocar fuera */}
      <button
        type="button"
        aria-label="Cerrar emojis"
        onClick={onClose}
        className="fixed inset-0 z-20 cursor-default"
      />
      <div className="absolute bottom-full left-0 z-30 mb-2 overflow-hidden rounded-lg shadow-soft">
        <Picker
          onEmojiClick={(data) => onSelect(data.emoji)}
          theme={isDark ? Theme.DARK : Theme.LIGHT}
          emojiStyle={EmojiStyle.NATIVE}
          lazyLoadEmojis
          width={320}
          height={400}
          previewConfig={{ showPreview: false }}
          searchPlaceholder="Buscar emoji"
        />
      </div>
    </>
  );
}
