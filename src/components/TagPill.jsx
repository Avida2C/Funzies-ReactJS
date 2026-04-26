import { useTheme } from "../theme/themeContext";

const VARIANT_CLASS_MAP = {
  team: "font-medium",
  meta: "border text-base-content/80",
  skill: "text-base-content/80",
};

export default function TagPill({ children, variant = "meta", className = "" }) {
  const { colors } = useTheme();

  const baseClassName = `rounded-full px-2.5 py-1 text-xs ${VARIANT_CLASS_MAP[variant] ?? VARIANT_CLASS_MAP.meta} ${className}`.trim();

  const styleByVariant = {
    team: { backgroundColor: `${colors.primary}1a`, color: colors.primary },
    meta: { borderColor: `${colors.primary}66` },
    skill: { border: `1px solid ${colors.primary}66`, backgroundColor: `${colors.primary}14` },
  };

  return (
    <span className={baseClassName} style={styleByVariant[variant] ?? styleByVariant.meta}>
      {children}
    </span>
  );
}
