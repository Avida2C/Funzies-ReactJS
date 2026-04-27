import { useEffect, useId } from "react";
import { useTheme } from "../../theme/themeContext";
import { textStyles } from "../../theme/typography";
import ThemedSurface from "../ThemedSurface";

/**
 * @param {{
 *   open: boolean;
 *   title: string;
 *   onClose: () => void;
 *   children: import("react").ReactNode;
 *   footer?: import("react").ReactNode;
 *   size?: "md" | "lg";
 * }} props
 */
export default function AdminModal({ open, title, onClose, children, footer, size = "md" }) {
  const { colors } = useTheme();
  const labelId = useId();

  useEffect(() => {
    if (!open) {
      return undefined;
    }
    const onKey = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const maxW = size === "lg" ? "max-w-2xl" : "max-w-lg";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center" role="presentation">
      <button
        type="button"
        className="absolute inset-0 cursor-default border-0 bg-black/50"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <ThemedSurface
        bordered
        className={`relative z-10 max-h-[min(90vh,720px)] w-full ${maxW} overflow-y-auto p-4 shadow-lg sm:p-5`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelId}
      >
        <div className="flex items-start justify-between gap-2">
          <h2 id={labelId} style={{ ...textStyles.sectionTitle, color: colors.text }}>
            {title}
          </h2>
          <button
            type="button"
            className="shrink-0 rounded border px-2.5 py-1 text-sm"
            style={{ borderColor: colors.border, color: colors.text, backgroundColor: colors.background }}
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="mt-4">{children}</div>
        {footer ? <div className="mt-6 flex flex-wrap items-center justify-end gap-2 border-t pt-4" style={{ borderColor: colors.border }}>{footer}</div> : null}
      </ThemedSurface>
    </div>
  );
}
