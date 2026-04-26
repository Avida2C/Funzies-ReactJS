import { FiChevronRight } from "react-icons/fi";
import { useTheme } from "../theme/themeContext";

export default function Accordion({ items, className = "" }) {
  const { colors } = useTheme();

  return (
    <div className={`space-y-2 ${className}`.trim()}>
      {items.map((item) => (
        <details
          key={item.id}
          className="group rounded-box border shadow-sm open:shadow-md"
          style={{ backgroundColor: colors.background, borderColor: colors.border }}
        >
          <summary className="cursor-pointer list-none p-4 pr-12 font-medium text-base-content marker:hidden [&::-webkit-details-marker]:hidden">
            <span className="relative block">
              {item.title}
              <FiChevronRight
                className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-base-content/45 transition group-open:rotate-90"
                size={18}
                aria-hidden
              />
            </span>
          </summary>
          <div className="border-t px-4 pb-4 pt-3" style={{ borderColor: colors.border }}>
            {typeof item.content === "string" ? (
              <p className="leading-7 text-base-content/80">{item.content}</p>
            ) : (
              item.content
            )}
          </div>
        </details>
      ))}
    </div>
  );
}
