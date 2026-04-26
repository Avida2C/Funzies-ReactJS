import { Link } from "react-router-dom";
import ThemedSurface from "./ThemedSurface";
import { useTheme } from "../theme/themeContext";

export default function SupportHelpSection({
  title = "Still Need help?",
  message = "If you still have questions, we are here to help. Start with our Help Center for quick answers or contact us directly using the contact form.",
  className = "",
  showHelpCenterButton = true,
}) {
  const { colors } = useTheme();

  return (
    <ThemedSurface bordered className={`p-6 ${className}`.trim()}>
      <h2 className="text-xl font-semibold text-base-content">{title}</h2>
      <p className="mt-2 max-w-3xl leading-7 text-base-content/80">{message}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        {showHelpCenterButton && (
          <Link
            to="/help-center"
            className="inline-flex items-center rounded px-3 text-xs font-semibold"
            style={{ border: `1px solid ${colors.primary}`, color: colors.primary, minHeight: "2rem" }}
          >
            Help Center
          </Link>
        )}
        <Link
          to="/contact"
          className="btn btn-sm"
          style={{ backgroundColor: colors.primary, borderColor: colors.primary, color: colors.white }}
        >
          Contact us
        </Link>
      </div>
    </ThemedSurface>
  );
}
