import { useId } from "react";
import { useTheme } from "../../theme/themeContext";
import { textStyles } from "../../theme/typography";
import ThemedSurface from "../ThemedSurface";

/**
 * @param {{
 *  columns: { id: string; label: string; className?: string; align?: "left" | "right" }[];
 *  children: import("react").ReactNode;
 *  caption?: string;
 *  className?: string;
 * }} props
 */
export function AdminDataTable({ columns, children, caption, className = "" }) {
  const { colors } = useTheme();
  const captionId = useId();
  return (
    <ThemedSurface bordered className={`overflow-x-auto ${className}`.trim()}>
      {caption ? (
        <p
          className="px-4 pt-3 pb-1"
          id={captionId}
          style={{ ...textStyles.caption, color: colors.text, opacity: 0.85 }}
          role="status"
        >
          {caption}
        </p>
      ) : null}
      <table
        className="w-full min-w-[640px] table-auto border-collapse text-left"
        aria-describedby={caption ? captionId : undefined}
      >
        {!caption ? <caption className="sr-only">Data table</caption> : null}
        <thead>
          <tr className="border-b" style={{ borderColor: colors.border, backgroundColor: colors.background }}>
            {columns.map((col) => (
              <th
                key={col.id}
                className={`px-3 py-2.5 font-semibold first:pl-4 last:pr-4 sm:px-4 sm:py-3 ${col.align === "right" ? "text-right" : "text-left"} ${col.className ?? ""}`.trim()}
                style={{ ...textStyles.bodySm, color: colors.text, fontWeight: 600 }}
                scope="col"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody style={{ ...textStyles.bodySm, color: colors.text }}>{children}</tbody>
      </table>
    </ThemedSurface>
  );
}

export function AdminDataRow({ children, onClick, className = "" }) {
  const { colors } = useTheme();
  return (
    <tr
      className={`border-b transition-colors last:border-0 ${onClick ? "cursor-pointer hover:opacity-95" : ""} ${className}`.trim()}
      style={{ borderColor: colors.border }}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </tr>
  );
}

export function AdminDataCell({ children, className = "", align = "left", colSpan }) {
  return (
    <td
      colSpan={colSpan}
      className={`px-3 py-2.5 first:pl-4 last:pr-4 sm:px-4 sm:py-3 align-top ${
        align === "right" ? "text-right" : "text-left"
      } break-words ${className}`.trim()}
    >
      {children}
    </td>
  );
}
