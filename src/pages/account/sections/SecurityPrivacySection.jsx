import { textStyles } from "../../../theme/typography";
import { SectionHeader } from "../AccountSectionPrimitives";
import { FiShield } from "react-icons/fi";
import { FaApple, FaFacebook, FaGoogle, FaMicrosoft } from "react-icons/fa";

export default function SecurityPrivacySection({
  colors,
  mutedText,
  linkedAccounts,
  setLinkedAccounts,
  linkedAccountRows,
}) {
  const iconStyle = { color: colors.primary };

  const getLinkedIcon = (title) => {
    switch (String(title).toLowerCase()) {
      case "google":
        return <FaGoogle size={18} style={iconStyle} />;
      case "apple":
        return <FaApple size={18} style={iconStyle} />;
      case "microsoft":
        return <FaMicrosoft size={18} style={iconStyle} />;
      case "facebook":
        return <FaFacebook size={18} style={iconStyle} />;
      default:
        return <FiShield size={18} style={iconStyle} />;
    }
  };

  const renderToggle = ({ checked, onChange, label }) => (
    <label className="inline-flex cursor-pointer items-center gap-2">
      <input type="checkbox" className="peer sr-only" checked={checked} onChange={onChange} aria-label={label} />
      <span
        className="relative h-8 w-[60px] rounded-full border transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2"
        style={{
          borderColor: checked ? colors.primary : colors.border,
          outlineColor: colors.primary,
          backgroundColor: checked ? colors.primary : "#9db2d2",
        }}
      >
        <span
          className="absolute top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-white shadow transition-transform"
          style={{ transform: `translate(${checked ? 32 : 4}px, -50%)` }}
        />
      </span>
    </label>
  );

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionHeader>Linked Accounts</SectionHeader>
        {linkedAccountRows.map((row) => (
          <div key={row.title} className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 gap-3">
              <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded border" style={{ borderColor: colors.border, backgroundColor: colors.panel }}>
                {getLinkedIcon(row.title)}
              </span>
              <div className="min-w-0">
                <p style={{ ...textStyles.body, color: colors.text, fontWeight: 600 }}>{row.title}</p>
                <p style={{ ...textStyles.body, color: mutedText }}>{row.description}</p>
              </div>
            </div>
            {renderToggle({
              checked: Boolean(linkedAccounts[row.title]),
              onChange: () => setLinkedAccounts((current) => ({ ...current, [row.title]: !current[row.title] })),
              label: `${row.title} toggle`,
            })}
          </div>
        ))}
      </section>
    </div>
  );
}
