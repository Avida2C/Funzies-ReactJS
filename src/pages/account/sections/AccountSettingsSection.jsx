import { useNavigate } from "react-router-dom";
import { textStyles } from "../../../theme/typography";
import { ReadOnlyField, SectionHeader } from "../AccountSectionPrimitives";
import ThemedButton from "../../../components/ThemedButton";
import { useTwoFactor, clearTwoFactorState } from "../../../lib/twoFactorAuth";
import { useAuth } from "../../../lib/authContext";
import { isDemoAccount } from "../../../lib/adminAuth";

export default function AccountSettingsSection({ colors, mutedText, profile }) {
  const navigate = useNavigate();
  const { signOut, email, displayName } = useAuth();
  const { state, persist } = useTwoFactor();
  const demoLocked = isDemoAccount({ email, displayName });

  const downloadAccountData = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      profile,
      twoFactor: {
        authenticator: state.authenticator.enabled,
        email: state.email.enabled,
        passkey: state.passkey.enabled,
        backupCodesRemaining: state.backupCodes.unused.length,
        passwordless: state.passwordless,
      },
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "funzies-account-data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const deleteAccount = () => {
    if (!window.confirm("Delete this account data on this device? You will be signed out.")) {
      return;
    }
    clearTwoFactorState(email);
    signOut();
    navigate("/", { replace: true });
  };

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionHeader>Personal Information</SectionHeader>
        <div className="grid gap-4 md:grid-cols-2">
          <ReadOnlyField label="First Name" value={profile.firstName} />
          <ReadOnlyField label="Last Name" value={profile.lastName} />
        </div>
        <ReadOnlyField label="Contact Number" value={profile.phone} />
        <ReadOnlyField label="Email Address" value={profile.emailMasked} />
      </section>

      <section className="space-y-4">
        <SectionHeader>Change email or password</SectionHeader>
        <p style={{ ...textStyles.body, color: mutedText }}>
          {demoLocked
            ? "The demo account keeps a fixed email and password so anyone can sign in with the published credentials."
            : "These open dedicated flows. Your current details stay on this page until you finish the change."}
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <ThemedButton
            type="button"
            variant="redSolid"
            size="sm"
            disabled={demoLocked}
            style={demoLocked ? { opacity: 0.5, cursor: "not-allowed" } : undefined}
            onClick={() => {
              if (demoLocked) return;
              navigate("/account/change-email");
            }}
          >
            Change email address
          </ThemedButton>
          <ThemedButton
            type="button"
            variant="redOutline"
            size="sm"
            disabled={demoLocked}
            style={demoLocked ? { opacity: 0.5, cursor: "not-allowed" } : undefined}
            onClick={() => {
              if (demoLocked) return;
              navigate("/account/change-password");
            }}
          >
            Change password
          </ThemedButton>
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeader>Download or delete account data</SectionHeader>
        <p style={{ ...textStyles.body, color: mutedText }}>
          Download a copy of your profile and security flags, or remove this account from this browser.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <ThemedButton type="button" variant="redOutline" size="sm" onClick={downloadAccountData}>
            Download account data
          </ThemedButton>
          <ThemedButton type="button" variant="redSolid" size="sm" onClick={deleteAccount}>
            Delete account
          </ThemedButton>
        </div>
      </section>
    </div>
  );
}
