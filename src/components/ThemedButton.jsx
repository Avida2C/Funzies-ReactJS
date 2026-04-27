import { useTheme } from "../theme/themeContext";

const SIZE_CLASS_MAP = {
  sm: "h-8 px-3 text-xs",
  md: "min-h-[2.5rem] px-6 text-sm",
};

export default function ThemedButton({
  as: Component = "button",
  variant = "redOutline",
  size = "sm",
  className = "",
  style = {},
  type,
  children,
  ...props
}) {
  const { colors } = useTheme();

  const variantStyleMap = {
    redSolid: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
      color: colors.white,
      borderWidth: "1px",
      borderStyle: "solid",
    },
    redOutline: {
      border: `1px solid ${colors.primary}`,
      color: colors.primary,
      backgroundColor: "transparent",
    },
    greenSolid: {
      backgroundColor: colors.success,
      borderColor: colors.success,
      color: colors.white,
      borderWidth: "1px",
      borderStyle: "solid",
    },
    // Backward compatibility aliases while standardizing naming.
    primary: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
      color: colors.white,
      borderWidth: "1px",
      borderStyle: "solid",
    },
    outline: {
      border: `1px solid ${colors.primary}`,
      color: colors.primary,
      backgroundColor: "transparent",
    },
    success: {
      backgroundColor: colors.success,
      borderColor: colors.success,
      color: colors.white,
      borderWidth: "1px",
      borderStyle: "solid",
    },
  };

  const resolvedType = Component === "button" ? (type ?? "button") : undefined;

  const hoverVars = (() => {
    if (variant === "redOutline" || variant === "outline") {
      return {
        "--hover-accent-bg": `${colors.primary}14`,
        "--hover-accent-border": colors.primary,
        "--hover-accent-fg": colors.primary,
      };
    }
    if (variant === "redSolid" || variant === "primary") {
      return {
        "--hover-accent-border": colors.primary,
      };
    }
    if (variant === "greenSolid" || variant === "success") {
      return {
        "--hover-accent-border": colors.success,
      };
    }
    return {};
  })();

  return (
    <Component
      className={`hover-accent inline-flex items-center justify-center rounded font-semibold ${SIZE_CLASS_MAP[size] ?? SIZE_CLASS_MAP.sm} ${className}`.trim()}
      style={{ ...(variantStyleMap[variant] ?? variantStyleMap.redOutline), ...hoverVars, ...style }}
      type={resolvedType}
      {...props}
    >
      <span className="hover-accent-text inline-flex items-center">{children}</span>
    </Component>
  );
}
