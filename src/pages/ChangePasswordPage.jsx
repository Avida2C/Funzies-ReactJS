import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import ThemedButton from "../components/ThemedButton";
import ThemedTextField from "../components/ThemedTextField";
import { useAuth } from "../lib/authContext";
import { isDemoAccount } from "../lib/adminAuth";
import { textStyles } from "../theme/typography";
import { useTheme } from "../theme/themeContext";

const PASSWORD_STORAGE_PREFIX = "funzies:account:password:";

function passwordKey(email) {
  return `${PASSWORD_STORAGE_PREFIX}${String(email ?? "").trim().toLowerCase()}`;
}

export function getStoredAccountPassword(email) {
  try {
    return window.localStorage.getItem(passwordKey(email)) || "";
  } catch {
    return "";
  }
}

export function setStoredAccountPassword(email, password) {
  try {
    window.localStorage.setItem(passwordKey(email), password);
  } catch {
    // ignore
  }
}

export default function ChangePasswordPage() {
  const { colors } = useTheme();
  const { isAuthenticated, email, displayName } = useAuth();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [nextPassword, setNextPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const demoLocked = isDemoAccount({ email, displayName });

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (demoLocked) {
    return <Navigate to="/account?tab=settings" replace />;
  }

  return (
    <AppLayout title="Change password" description="Update the password on your Funzies account." showPageHeader={false}>
      <section className="mx-auto max-w-[520px] space-y-4 rounded-box border p-5" style={{ borderColor: colors.border, backgroundColor: colors.panel }}>
        <h1 style={{ ...textStyles.title, color: colors.text }}>Change password</h1>
        <p style={{ ...textStyles.bodySm, color: colors.muted }}>
          If you have not set a password yet, leave current password blank and choose a new one.
        </p>
        {error ? <p style={{ ...textStyles.bodySm, color: "#b91c1c" }}>{error}</p> : null}
        <ThemedTextField
          label="Current password"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          autoComplete="current-password"
        />
        <ThemedTextField
          label="New password"
          type="password"
          required
          value={nextPassword}
          onChange={(e) => setNextPassword(e.target.value)}
          autoComplete="new-password"
        />
        <ThemedTextField
          label="Confirm new password"
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
        />
        <div className="flex flex-wrap gap-2">
          <ThemedButton
            type="button"
            variant="redSolid"
            size="md"
            onClick={() => {
              const stored = getStoredAccountPassword(email);
              if (stored && stored !== currentPassword) {
                setError("Current password is incorrect.");
                return;
              }
              if (nextPassword.length < 8) {
                setError("New password must be at least 8 characters.");
                return;
              }
              if (nextPassword !== confirmPassword) {
                setError("New password and confirmation do not match.");
                return;
              }
              setStoredAccountPassword(email, nextPassword);
              navigate("/account?tab=settings", { replace: true });
            }}
          >
            Save password
          </ThemedButton>
          <ThemedButton as={Link} to="/account?tab=settings" variant="redOutline" size="md">
            Cancel
          </ThemedButton>
        </div>
      </section>
    </AppLayout>
  );
}
