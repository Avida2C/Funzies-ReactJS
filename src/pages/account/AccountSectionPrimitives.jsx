import { useTheme } from "../../theme/themeContext";
import { textStyles } from "../../theme/typography";
import ThemedTextBox from "../../components/ThemedTextBox";

export function ReadOnlyField({ label, value, rightIcon, className = "" }) {
  return (
    <div className={`space-y-2 ${className}`.trim()}>
      <ThemedTextBox
        label={label}
        value={value}
        readOnly
        aria-readonly="true"
        endAdornment={rightIcon ? <span className="flex items-center px-3">{rightIcon}</span> : null}
      />
    </div>
  );
}

export function SectionHeader({ children }) {
  const { colors } = useTheme();
  return <h2 style={{ ...textStyles.sectionTitle, color: colors.primary }}>{children}</h2>;
}

export function InfoCard({ children, className = "" }) {
  const { colors } = useTheme();
  return (
    <div className={`rounded-box p-4 shadow ${className}`.trim()} style={{ backgroundColor: colors.background }}>
      {children}
    </div>
  );
}

