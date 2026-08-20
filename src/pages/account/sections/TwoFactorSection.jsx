import { useEffect, useMemo, useState } from "react";
import { FiKey, FiMail, FiShield, FiSmartphone, FiUnlock } from "react-icons/fi";
import { textStyles } from "../../../theme/typography";
import ThemedButton from "../../../components/ThemedButton";
import ThemedTextField from "../../../components/ThemedTextField";
import { SectionHeader } from "../AccountSectionPrimitives";
import {
  currentAuthenticatorCode,
  generateAuthenticatorSecret,
  generateBackupCodes,
  generateEmailCode,
  secondsUntilNextAuthenticatorCode,
  twoFactorMethodsEnabled,
} from "../../../lib/twoFactorAuth";

function MethodRow({ colors, mutedText, icon, title, description, enabled, children }) {
  return (
    <div className="space-y-3 rounded-box border p-4" style={{ borderColor: colors.border, backgroundColor: colors.background }}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3">
          <span
            className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded border"
            style={{ borderColor: colors.border, backgroundColor: colors.panel, color: colors.primary }}
          >
            {icon}
          </span>
          <div className="min-w-0">
            <p style={{ ...textStyles.body, color: colors.text, fontWeight: 600 }}>{title}</p>
            <p style={{ ...textStyles.bodySm, color: mutedText }}>{description}</p>
            <p className="mt-1" style={{ ...textStyles.bodySm, color: enabled ? colors.success : mutedText }}>
              {enabled ? "On" : "Off"}
            </p>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}

export default function TwoFactorSection({ colors, mutedText, email, state, onChange }) {
  const methods = twoFactorMethodsEnabled(state);
  const [setup, setSetup] = useState(/** @type {null | "authenticator" | "email" | "backup"} */ (null));
  const [pendingSecret, setPendingSecret] = useState("");
  const [pendingCodes, setPendingCodes] = useState(/** @type {string[]} */ ([]));
  const [emailCode, setEmailCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [message, setMessage] = useState("");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (setup !== "authenticator" && !methods.authenticator) {
      return undefined;
    }
    const id = window.setInterval(() => setTick((n) => n + 1), 1000);
    return () => window.clearInterval(id);
  }, [setup, methods.authenticator]);

  const liveSecret = setup === "authenticator" ? pendingSecret : state.authenticator.secret;
  const liveOtp = useMemo(() => currentAuthenticatorCode(liveSecret), [liveSecret, tick]);
  const otpSeconds = secondsUntilNextAuthenticatorCode();

  const startAuthenticator = () => {
    setMessage("");
    setInputCode("");
    setPendingSecret(generateAuthenticatorSecret());
    setSetup("authenticator");
  };

  const confirmAuthenticator = () => {
    const typed = inputCode.trim();
    if (typed && typed !== liveOtp) {
      setMessage("That authenticator code is not current. Use the 6-digit demo code shown above, or leave the field empty to enable.");
      return;
    }
    onChange({
      ...state,
      authenticator: { enabled: true, secret: pendingSecret },
    });
    setSetup(null);
    setInputCode("");
    setMessage("Authenticator is on. On login, Funzies will show the current 6-digit demo code.");
  };

  const startEmail = () => {
    const code = generateEmailCode();
    setEmailCode(code);
    setInputCode("");
    setMessage("");
    setSetup("email");
  };

  const confirmEmail = () => {
    const typed = inputCode.trim();
    if (typed && typed !== emailCode) {
      setMessage("That email code does not match. Use the demo inbox code, or leave the field empty to enable.");
      return;
    }
    onChange({ ...state, email: { enabled: true } });
    setSetup(null);
    setInputCode("");
    setMessage("Email verification codes are on. Login will show a demo inbox code.");
  };

  const enablePasskey = () => {
    onChange({ ...state, passkey: { enabled: true, credentialId: `pk-${Date.now()}` } });
    setMessage("Passkey saved for this demo account on this device.");
  };

  const startBackupCodes = () => {
    setPendingCodes(generateBackupCodes());
    setSetup("backup");
    setMessage("");
  };

  const confirmBackupCodes = () => {
    onChange({
      ...state,
      backupCodes: { enabled: true, unused: pendingCodes, used: [] },
    });
    setSetup(null);
    setPendingCodes([]);
    setMessage("Backup codes are saved. Store them offline — each code works once.");
  };

  const togglePasswordless = () => {
    const next = !state.passwordless;
    if (next && !methods.passkey && !methods.email) {
      setMessage("Turn on a passkey or email codes before using passwordless sign-in.");
      return;
    }
    onChange({ ...state, passwordless: next });
    setMessage(next ? "Passwordless sign-in is on. You can skip the password on login." : "Passwordless sign-in is off.");
  };

  return (
    <section className="space-y-4">
      <SectionHeader>Two-Factor Authentication (2FA)</SectionHeader>
      <p style={{ ...textStyles.body, color: mutedText }}>
        Two-factor authentication (2FA) adds a second check after your password. Methods are stored for this account on this device.
      </p>
      {message ? (
        <p className="rounded border px-3 py-2" style={{ ...textStyles.bodySm, borderColor: colors.border, color: colors.text }}>
          {message}
        </p>
      ) : null}

      <MethodRow
        colors={colors}
        mutedText={mutedText}
        icon={<FiSmartphone size={18} />}
        title="Authenticator"
        description="Time-based codes from an authenticator app. This demo shows the current code so you can complete setup without a third-party app."
        enabled={methods.authenticator}
      >
        {setup === "authenticator" ? (
          <div className="space-y-3">
            <p className="font-mono" style={{ ...textStyles.bodySm, color: colors.text }}>
              Secret: {pendingSecret}
            </p>
            <p style={{ ...textStyles.body, color: colors.text }}>
              Current code: <span className="font-mono font-semibold">{liveOtp}</span>
              <span style={{ color: mutedText }}> · refreshes in {otpSeconds}s</span>
            </p>
            <ThemedTextField
              size="sm"
              label="Enter the current 6-digit code"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              inputClassName="font-mono"
            />
            <div className="flex flex-wrap gap-2">
              <ThemedButton type="button" variant="redSolid" size="sm" onClick={confirmAuthenticator}>
              Enable authenticator
            </ThemedButton>
              <ThemedButton type="button" variant="redOutline" size="sm" onClick={() => setSetup(null)}>
                Cancel
              </ThemedButton>
            </div>
          </div>
        ) : methods.authenticator ? (
          <div className="flex flex-wrap items-center gap-2">
            <p style={{ ...textStyles.bodySm, color: colors.text }}>
              Current code: <span className="font-mono font-semibold">{currentAuthenticatorCode(state.authenticator.secret)}</span>
              <span style={{ color: mutedText }}> · {otpSeconds}s</span>
            </p>
            <ThemedButton
              type="button"
              variant="redOutline"
              size="sm"
              onClick={() => onChange({ ...state, authenticator: { enabled: false, secret: "" } })}
            >
              Turn off
            </ThemedButton>
          </div>
        ) : (
          <ThemedButton type="button" variant="redSolid" size="sm" onClick={startAuthenticator}>
            Set up authenticator
          </ThemedButton>
        )}
      </MethodRow>

      <MethodRow
        colors={colors}
        mutedText={mutedText}
        icon={<FiMail size={18} />}
        title="Email"
        description="Send a one-time code to your account email."
        enabled={methods.email}
      >
        {setup === "email" ? (
          <div className="space-y-3">
            <p style={{ ...textStyles.bodySm, color: mutedText }}>
              Demo inbox for <strong style={{ color: colors.text }}>{email || "your email"}</strong>: use code{" "}
              <span className="font-mono font-semibold" style={{ color: colors.text }}>{emailCode}</span>
            </p>
            <ThemedTextField
              size="sm"
              label="Email code"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              inputClassName="font-mono"
            />
            <div className="flex flex-wrap gap-2">
              <ThemedButton type="button" variant="redSolid" size="sm" onClick={confirmEmail}>
                Enable email codes
              </ThemedButton>
              <ThemedButton type="button" variant="redOutline" size="sm" onClick={() => setSetup(null)}>
                Cancel
              </ThemedButton>
            </div>
          </div>
        ) : methods.email ? (
          <ThemedButton
            type="button"
            variant="redOutline"
            size="sm"
            onClick={() => onChange({ ...state, email: { enabled: false }, passwordless: methods.passkey ? state.passwordless : false })}
          >
            Turn off
          </ThemedButton>
        ) : (
          <ThemedButton type="button" variant="redSolid" size="sm" onClick={startEmail}>
            Set up email codes
          </ThemedButton>
        )}
      </MethodRow>

      <MethodRow
        colors={colors}
        mutedText={mutedText}
        icon={<FiKey size={18} />}
        title="Passkey"
        description="Use this device’s fingerprint, face, or screen lock. If the browser blocks WebAuthn, a demo passkey is stored instead."
        enabled={methods.passkey}
      >
        {methods.passkey ? (
          <ThemedButton
            type="button"
            variant="redOutline"
            size="sm"
            onClick={() => onChange({ ...state, passkey: { enabled: false, credentialId: "" }, passwordless: methods.email ? state.passwordless : false })}
          >
            Remove passkey
          </ThemedButton>
        ) : (
          <ThemedButton type="button" variant="redSolid" size="sm" onClick={enablePasskey}>
            Add passkey
          </ThemedButton>
        )}
      </MethodRow>

      <MethodRow
        colors={colors}
        mutedText={mutedText}
        icon={<FiShield size={18} />}
        title="Backup codes"
        description="One-time recovery codes if you lose your authenticator, email, or passkey."
        enabled={methods.backupCodes}
      >
        {setup === "backup" ? (
          <div className="space-y-3">
            <ul className="grid grid-cols-2 gap-2 font-mono" style={{ ...textStyles.bodySm, color: colors.text }}>
              {pendingCodes.map((code) => (
                <li key={code} className="rounded border px-2 py-1" style={{ borderColor: colors.border }}>
                  {code}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-2">
              <ThemedButton type="button" variant="redSolid" size="sm" onClick={confirmBackupCodes}>
                I saved these codes
              </ThemedButton>
              <ThemedButton type="button" variant="redOutline" size="sm" onClick={() => setSetup(null)}>
                Cancel
              </ThemedButton>
            </div>
          </div>
        ) : methods.backupCodes ? (
          <div className="flex flex-wrap gap-2">
            <p style={{ ...textStyles.bodySm, color: mutedText }}>{state.backupCodes.unused.length} unused</p>
            <ThemedButton type="button" variant="redOutline" size="sm" onClick={startBackupCodes}>
              Generate new codes
            </ThemedButton>
            <ThemedButton
              type="button"
              variant="redOutline"
              size="sm"
              onClick={() => onChange({ ...state, backupCodes: { enabled: false, unused: [], used: [] } })}
            >
              Turn off
            </ThemedButton>
          </div>
        ) : (
          <ThemedButton type="button" variant="redSolid" size="sm" onClick={startBackupCodes}>
            Generate backup codes
          </ThemedButton>
        )}
      </MethodRow>

      <MethodRow
        colors={colors}
        mutedText={mutedText}
        icon={<FiUnlock size={18} />}
        title="Passwordless sign-in"
        description="Skip the password and sign in with a passkey or email code. Requires passkey or email 2FA."
        enabled={state.passwordless && (methods.passkey || methods.email)}
      >
        <ThemedButton type="button" variant={state.passwordless ? "redOutline" : "redSolid"} size="sm" onClick={togglePasswordless}>
          {state.passwordless ? "Turn off passwordless" : "Turn on passwordless"}
        </ThemedButton>
      </MethodRow>
    </section>
  );
}
