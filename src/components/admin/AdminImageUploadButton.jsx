import { useId, useState } from "react";
import { useTheme } from "../../theme/themeContext";
import { textStyles } from "../../theme/typography";
import { uploadProductImage } from "../../lib/crudApi";

/**
 * Picks a file, POSTs to /api/upload, and passes the returned `img/products/...` path to onUploaded.
 * @param {{ onUploaded: (path: string) => void; disabled?: boolean; className?: string; children?: import("react").ReactNode; }} props
 */
export default function AdminImageUploadButton({ onUploaded, disabled = false, className = "", children }) {
  const { colors } = useTheme();
  const id = useId();
  const inputId = `upload-${id.replace(/:/g, "")}`;
  const [busy, setBusy] = useState(false);

  return (
    <div className={className}>
      <input
        id={inputId}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        className="sr-only"
        disabled={disabled || busy}
        onChange={async (e) => {
          const f = e.target.files?.[0];
          e.target.value = "";
          if (!f) {
            return;
          }
          setBusy(true);
          try {
            const data = await uploadProductImage(f);
            if (data?.path) {
              onUploaded(String(data.path));
            }
          } catch (e2) {
            window.alert(e2 instanceof Error ? e2.message : "Upload failed");
          } finally {
            setBusy(false);
          }
        }}
      />
      <label
        htmlFor={inputId}
        className={`inline-block rounded border px-2.5 py-1 text-sm font-medium transition-opacity ${busy || disabled ? "pointer-events-none opacity-50" : "cursor-pointer hover:opacity-95"}`}
        style={{ borderColor: colors.border, color: colors.text, backgroundColor: colors.panel, ...textStyles.button }}
      >
        {busy ? "Uploading…" : (children ?? "Upload image")}
      </label>
    </div>
  );
}
