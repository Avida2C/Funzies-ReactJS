import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LuLightbulb, LuLightbulbOff } from "react-icons/lu";
import { FiExternalLink } from "react-icons/fi";
import ThemedTextField from "../../components/ThemedTextField";
import { ADMIN_DEMO_EMAIL, ADMIN_DEMO_PASSWORD } from "../../lib/adminAuth";
import { useAuth } from "../../lib/authContext";
import { textStyles } from "../../theme/typography";
import { useTheme } from "../../theme/themeContext";
import { logoDarkMode, logoLightMode } from "../../lib/storeData";
import ThemedSurface from "../../components/ThemedSurface";

const SITE_NAME = "Funzies Collection";

function InputField({ label, type = "text", placeholder, value, onChange, autoComplete, endAdornment, ...rest }) {
  return (
    <ThemedTextField
      className="w-full"
      label={label}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      inputClassName="text-base"
      autoComplete={autoComplete}
      endAdornment={endAdornment}
      {...rest}
    />
  );
}

export default function AdminLoginPage() {
  const { colors, mode, toggleTheme } = useTheme();
  const { signInAdmin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = `Admin sign in | ${SITE_NAME}`;
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    const result = signInAdmin({ email, password });
    if (result?.ok) {
      navigate("/admin", { replace: true });
      return;
    }
    setError(result?.message ?? "Invalid email or password.");
  };

  const useDemo = () => {
    setEmail(ADMIN_DEMO_EMAIL);
    setPassword(ADMIN_DEMO_PASSWORD);
    setError("");
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <header className="border-b" style={{ borderColor: colors.border, backgroundColor: colors.background }}>
        <div className="mx-auto flex w-full max-w-[1200px] flex-wrap items-center justify-between gap-3 px-4 py-3 md:flex-nowrap">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <Link to="/" className="inline-flex shrink-0 items-center leading-none" aria-label="Funzies Collection home">
              <img src={mode === "dark" ? logoDarkMode : logoLightMode} alt="Funzies Collection" className="h-10 w-auto" />
            </Link>
            <span
              className="hidden rounded border px-2.5 py-1 sm:inline-flex"
              style={{ ...textStyles.caption, borderColor: colors.border, color: colors.primary, backgroundColor: colors.panel }}
            >
              Admin sign in
            </span>
          </div>
          <div className="flex h-9 w-full items-stretch justify-end gap-2 sm:w-auto">
            <Link
              to="/"
              className="hover-accent inline-flex h-full min-w-0 flex-1 items-center justify-center gap-1.5 rounded border px-3 sm:flex-initial"
              style={{ borderColor: colors.border, color: colors.text, backgroundColor: colors.panel, ...textStyles.button }}
            >
              <span className="truncate">Back to store</span>
              <FiExternalLink size={14} className="shrink-0" aria-hidden />
            </Link>
            <button
              type="button"
              className="hover-accent inline-flex h-full items-center rounded border px-3"
              onClick={toggleTheme}
              style={{ borderColor: colors.border, color: colors.text, backgroundColor: colors.panel }}
            >
              <span className="inline-flex items-center gap-1" style={textStyles.button}>
                {mode === "dark" ? <LuLightbulbOff size={14} /> : <LuLightbulb size={14} />}
                {mode === "dark" ? "Light" : "Dark"}
              </span>
            </button>
          </div>
        </div>
      </header>

      <main
        className="mx-auto w-full max-w-[1200px] p-4 pb-6 md:px-6 md:pt-6 md:pb-6"
        style={{ backgroundColor: colors.panel }}
      >
        <ThemedSurface bordered className="mx-auto max-w-lg p-6 md:p-8">
          <h1 className="text-2xl font-bold" style={{ ...textStyles.title, color: colors.text }}>
            Admin login
          </h1>
          <p className="mt-2" style={{ ...textStyles.body, color: colors.text, opacity: 0.9 }}>
            Sign in with a staff account to access the store administration area.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
            <InputField
              label="Email"
              type="email"
              placeholder="admin@example.com"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <InputField
              label="Password"
              type="password"
              placeholder="***********"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />

            {error ? (
              <p
                role="alert"
                className="rounded border px-3 py-2 text-sm"
                style={{ borderColor: "rgba(239, 68, 68, 0.45)", color: "#b91c1c", backgroundColor: "rgba(239, 68, 68, 0.08)" }}
              >
                {error}
              </p>
            ) : null}

            <ThemedSurface bordered className="p-3" style={{ backgroundColor: colors.background }}>
              <p style={{ ...textStyles.bodySm, color: colors.text, fontWeight: 600 }}>Demo admin</p>
              <p className="mt-1" style={{ ...textStyles.bodySm, color: colors.text, opacity: 0.75 }}>
                Email: {ADMIN_DEMO_EMAIL}
              </p>
              <p style={{ ...textStyles.bodySm, color: colors.text, opacity: 0.75 }}>
                Password: {ADMIN_DEMO_PASSWORD}
              </p>
              <button
                type="button"
                onClick={useDemo}
                className="mt-2 rounded border px-3 py-1.5"
                style={{ ...textStyles.bodySm, borderColor: colors.border, color: colors.primary, backgroundColor: colors.panel }}
              >
                Fill demo credentials
              </button>
            </ThemedSurface>

            <button
              type="submit"
              className="w-full min-h-[45px] rounded px-4 py-2 text-white"
              style={{ ...textStyles.sectionTitle, backgroundColor: colors.primary, fontWeight: 400 }}
            >
              Sign in
            </button>
          </form>
        </ThemedSurface>
      </main>
    </div>
  );
}
