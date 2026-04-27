import { useTheme } from "../../theme/themeContext";
import { textStyles } from "../../theme/typography";
import ThemedSurface from "../ThemedSurface";

/**
 * @param {{ error: string | null; entityLabel?: string }} props
 */
export default function AdminApiBanner({ error, entityLabel = "this page" }) {
  const { colors } = useTheme();
  if (!error) {
    return null;
  }
  return (
    <ThemedSurface bordered className="border-amber-500/40 bg-amber-500/10 p-3 sm:p-4">
      <p className="font-semibold" style={{ color: colors.text, ...textStyles.body }}>
        Could not load {entityLabel}
      </p>
      <p className="mt-1" style={{ ...textStyles.bodySm, color: colors.text, opacity: 0.9 }}>
        {error} — Start the data API in another terminal: <code className="rounded bg-black/10 px-1">npm run dev:api</code> (or
        use <code className="rounded bg-black/10 px-1">npm run dev:stack</code> to run the app and API together). Vite
        proxies <code className="rounded bg-black/10 px-1">/api</code> to port 3001 in development.
      </p>
    </ThemedSurface>
  );
}
