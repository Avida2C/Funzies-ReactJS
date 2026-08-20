import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import ThemedButton from "../components/ThemedButton";
import ThemedTextField from "../components/ThemedTextField";
import { useAuth } from "../lib/authContext";
import { isDemoAccount } from "../lib/adminAuth";
import { textStyles } from "../theme/typography";
import { useTheme } from "../theme/themeContext";

export default function ChangeEmailPage() {
  const { colors } = useTheme();
  const { isAuthenticated, email, displayName, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [nextEmail, setNextEmail] = useState("");
  const [error, setError] = useState("");
  const demoLocked = isDemoAccount({ email, displayName });

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (demoLocked) {
    return <Navigate to="/account?tab=settings" replace />;
  }

  return (
    <AppLayout title="Change email" description="Update the email on your Funzies account." showPageHeader={false}>
      <section className="mx-auto max-w-[520px] space-y-4 rounded-box border p-5" style={{ borderColor: colors.border, backgroundColor: colors.panel }}>
        <h1 style={{ ...textStyles.title, color: colors.text }}>Change email address</h1>
        <p style={{ ...textStyles.body, color: colors.muted }}>Current email: {email || "—"}</p>
        {error ? <p style={{ ...textStyles.bodySm, color: "#b91c1c" }}>{error}</p> : null}
        <ThemedTextField
          label="New email address"
          type="email"
          required
          value={nextEmail}
          onChange={(e) => setNextEmail(e.target.value)}
          autoComplete="email"
        />
        <div className="flex flex-wrap gap-2">
          <ThemedButton
            type="button"
            variant="redSolid"
            size="md"
            onClick={() => {
              const trimmed = nextEmail.trim();
              if (!trimmed.includes("@") || !trimmed.includes(".")) {
                setError("Enter a valid email address.");
                return;
              }
              updateProfile({ email: trimmed });
              navigate("/account?tab=settings", { replace: true });
            }}
          >
            Save email
          </ThemedButton>
          <ThemedButton as={Link} to="/account?tab=settings" variant="redOutline" size="md">
            Cancel
          </ThemedButton>
        </div>
      </section>
    </AppLayout>
  );
}
