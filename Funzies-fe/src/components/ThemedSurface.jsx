import { useTheme } from "../theme/themeContext";

/**
 * Same surface treatment as the AppLayout page title block: ThemeContext `colors.background`
 * plus rounded-box + shadow. Use instead of `bg-base-100` so panels match the hero strip.
 */
export default function ThemedSurface({ as: Component = "section", bordered = false, className = "", children, ...rest }) {
  const { colors } = useTheme();
  return (
    <Component
      className={`rounded-box shadow ${className}`.trim()}
      style={{
        backgroundColor: colors.background,
        ...(bordered ? { border: `1px solid ${colors.border}` } : {}),
      }}
      {...rest}
    >
      {children}
    </Component>
  );
}
