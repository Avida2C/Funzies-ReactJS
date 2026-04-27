import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { useTheme } from "../../theme/themeContext";
import { textStyles } from "../../theme/typography";
import ThemedSurface from "../ThemedSurface";

/**
 * @typedef {{ to: string; label: string; icon: any; end?: boolean }} AdminQuickLink
 */

/**
 * @param {{ items: AdminQuickLink[]; columnsMobile?: number; columnsSm?: number; columnsLg?: number }} props
 */
export default function AdminQuickAccessCards({ items, columnsMobile = 3, columnsSm = 2, columnsLg = 3 }) {
  const { colors } = useTheme();
  const mobileCols = Math.max(1, Math.min(4, Number(columnsMobile) || 3));
  const smCols = Math.max(1, Math.min(4, Number(columnsSm) || 2));
  const lgCols = Math.max(1, Math.min(6, Number(columnsLg) || 3));

  // Tailwind needs static classnames; map small set explicitly.
  const mobileColsClass = mobileCols === 4 ? "grid-cols-4" : mobileCols === 2 ? "grid-cols-2" : "grid-cols-3";
  const smColsClass = smCols === 4 ? "sm:grid-cols-4" : smCols === 3 ? "sm:grid-cols-3" : smCols === 2 ? "sm:grid-cols-2" : "sm:grid-cols-1";
  const lgColsClass =
    lgCols === 6
      ? "lg:grid-cols-6"
      : lgCols === 4
        ? "lg:grid-cols-4"
        : lgCols === 2
          ? "lg:grid-cols-2"
          : "lg:grid-cols-3";

  return (
    <ul className={`grid ${mobileColsClass} gap-3 ${smColsClass} ${lgColsClass}`}>
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <li key={item.to}>
            <Link
              to={item.to}
              className="block rounded-lg transition-opacity hover:opacity-95"
              style={{ textDecoration: "none" }}
            >
              <ThemedSurface bordered className="group flex h-24 min-w-0 flex-col justify-center gap-2 p-4">
                <div className="flex items-start justify-between gap-2">
                  <span
                    className="inline-flex h-9 w-9 items-center justify-center rounded border"
                    style={{ borderColor: colors.border, color: colors.primary, backgroundColor: colors.background }}
                    aria-hidden
                  >
                    <Icon size={18} />
                  </span>
                  <span style={{ color: colors.primary, opacity: 0.7 }} aria-hidden>
                    <FiArrowRight size={18} className="shrink-0" />
                  </span>
                </div>
                <p className="truncate font-semibold" style={{ color: colors.text, ...textStyles.body }}>
                  {item.label}
                </p>
              </ThemedSurface>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

