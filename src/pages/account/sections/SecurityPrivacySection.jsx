import { textStyles } from "../../../theme/typography";
import ThemedButton from "../../../components/ThemedButton";
import { SectionHeader } from "../AccountSectionPrimitives";
import {
  FiBell,
  FiDownload,
  FiKey,
  FiMail,
  FiMessageSquare,
  FiPhone,
  FiShield,
  FiSmartphone,
} from "react-icons/fi";
import { FaApple, FaFacebook, FaGoogle, FaMicrosoft } from "react-icons/fa";

export default function SecurityPrivacySection({
  colors,
  mutedText,
  securityToggles,
  setSecurityToggles,
  linkedAccounts,
  setLinkedAccounts,
  security2faRows,
  linkedAccountRows,
  showDeactivate = true,
}) {
  const iconStyle = { color: colors.primary };

  const getTwoFaIcon = (title) => {
    switch (String(title).toLowerCase()) {
      case "sms":
        return <FiMessageSquare size={18} style={iconStyle} />;
      case "email":
        return <FiMail size={18} style={iconStyle} />;
      case "phone call":
        return <FiPhone size={18} style={iconStyle} />;
      case "push notification":
        return <FiBell size={18} style={iconStyle} />;
      case "authenticator app":
        return <FiShield size={18} style={iconStyle} />;
      case "backup codes":
        return <FiKey size={18} style={iconStyle} />;
      default:
        return <FiSmartphone size={18} style={iconStyle} />;
    }
  };

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
      case "download account data":
        return <FiDownload size={18} style={iconStyle} />;
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
        <SectionHeader>Two-Factor Authentication (2FA)</SectionHeader>
        {security2faRows.map((row) => (
          <div key={row.title} className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 gap-3">
              <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded border" style={{ borderColor: colors.border, backgroundColor: colors.panel }}>
                {getTwoFaIcon(row.title)}
              </span>
              <div className="min-w-0">
                <p style={{ ...textStyles.body, color: colors.text, fontWeight: 600 }}>{row.title}</p>
              <p style={{ ...textStyles.body, color: mutedText }}>{row.description}</p>
            </div>
            </div>
            {renderToggle({
              checked: Boolean(securityToggles[row.title]),
              onChange: () => setSecurityToggles((current) => ({ ...current, [row.title]: !current[row.title] })),
              label: `${row.title} toggle`,
            })}
          </div>
        ))}
      </section>

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

      {showDeactivate ? (
        <section className="space-y-4">
          <SectionHeader>Deactivate or Delete Account</SectionHeader>
          <ThemedButton type="button" variant="redSolid" size="md" className="w-full" style={{ ...textStyles.sectionTitle }}>
            Download Account Data (GDPR/CCPA)
          </ThemedButton>
          <ThemedButton type="button" variant="redSolid" size="md" className="w-full" style={{ ...textStyles.sectionTitle }}>
            Deactivate or Delete Account
          </ThemedButton>
        </section>
      ) : null}
    </div>
  );
}

