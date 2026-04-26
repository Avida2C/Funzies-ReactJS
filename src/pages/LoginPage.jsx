import { useMemo, useState } from "react";
import { FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import { useAuth } from "../lib/authContext";
import { textStyles } from "../theme/typography";
import { useTheme } from "../theme/themeContext";

const SOCIAL_PROVIDERS = [
  { name: "Google", icon: "https://www.figma.com/api/mcp/asset/0e32d3da-001e-4102-93e6-5f660cb5d13d" },
  { name: "Facebook", icon: "https://www.figma.com/api/mcp/asset/d0d55999-086c-452a-bafa-73cfb0651159" },
  { name: "Microsoft", icon: "https://www.figma.com/api/mcp/asset/830a1dc9-50c4-46dc-91f5-e3057980ae5f" },
  { name: "Apple", icon: "https://www.figma.com/api/mcp/asset/c1ed6ab2-354f-4979-855d-bd85c4b10c3e" },
];

const AUTH_COPY = {
  login: {
    title: "Log In",
    actionLabel: "Log In",
    sideActionLabel: "Sign Up",
    showRememberMe: true,
    showForgotLink: true,
    showSocial: true,
  },
  signup: {
    title: "Sign Up",
    actionLabel: "Sign Up",
    sideActionLabel: "Log In",
    showRememberMe: false,
    showForgotLink: false,
    showSocial: true,
  },
  forgot: {
    title: "Forgot Password",
    actionLabel: "Send Verification Code",
    sideActionLabel: "Log In",
    showRememberMe: false,
    showForgotLink: false,
    showSocial: false,
  },
};

function InputField({ label, required = false, type = "text", placeholder, trailing = null }) {
  const { colors } = useTheme();
  const inputBackground = colors.white;
  const inputBorder = colors.primary;
  const inputTextColor = "#1f2a36";
  const inputPlaceholder = "#9ca3af";
  return (
    <label className="block space-y-2">
      <div className="flex items-center gap-0.5">
        <span style={{ ...textStyles.sectionTitle, color: colors.text, fontWeight: 400 }}>{label}</span>
        {required && <span style={{ color: colors.primary }}>*</span>}
      </div>
      <div className="flex min-h-11 items-center border px-2" style={{ borderColor: inputBorder, backgroundColor: inputBackground }}>
        <input
          type={type}
          className="auth-input h-full w-full bg-transparent outline-none"
          placeholder={placeholder}
          style={{ ...textStyles.body, color: inputTextColor }}
        />
        <style>{`.auth-input::placeholder { color: ${inputPlaceholder}; opacity: 1; }`}</style>
        {trailing}
      </div>
    </label>
  );
}

export default function LoginPage({ initialMode = "login" }) {
  const { colors, mode } = useTheme();
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [activeMode, setActiveMode] = useState(initialMode);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const isDark = mode === "dark";
  const copy = AUTH_COPY[activeMode] ?? AUTH_COPY.login;
  const isForgotMode = activeMode === "forgot";

  const panelStyles = useMemo(
    () => ({
      outer: {
        backgroundColor: isDark ? "#1b273b" : colors.background,
        borderColor: isDark ? "#1b273b" : colors.border,
      },
      info: {
        backgroundColor: isDark ? "#101a2a" : colors.background,
      },
      helper: {
        color: "#8896b2",
      },
      inputBackground: colors.white,
      inputBorder: colors.primary,
      inputText: "#1f2a36",
      inputPlaceholder: "#9ca3af",
    }),
    [colors.background, colors.primary, isDark],
  );

  const goToMode = (nextMode) => {
    setActiveMode(nextMode);
    if (nextMode === "login") {
      navigate("/login");
      return;
    }
    if (nextMode === "signup") {
      navigate("/create-account");
      return;
    }
    navigate("/forgot-password");
  };

  const handlePrimaryAction = () => {
    if (activeMode === "forgot") {
      return;
    }
    const normalizedEmail = email.trim().toLowerCase();
    const isDemoAccount = normalizedEmail === "demo@funzies.com" && password === "Demo@1234";
    signIn({
      displayName: isDemoAccount ? "Demo Account" : "Nadine",
      email: email.trim(),
    });
    navigate("/account");
  };

  const fillDemoAccount = () => {
    setEmail("demo@funzies.com");
    setPassword("Demo@1234");
  };

  const headingStyle = isForgotMode
    ? { ...textStyles.sectionTitle, color: colors.primary, fontWeight: 600 }
    : { ...textStyles.title, color: colors.primary, fontWeight: 400 };

  return (
    <AppLayout title="Authentication" description="Access your account." showPageHeader={false} contentClassName="">
      <section className="rounded-box border p-5 shadow md:p-8" style={panelStyles.outer}>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,500px)_360px] xl:justify-between">
          <div className={`space-y-4 ${isForgotMode ? "max-w-[600px]" : "max-w-[500px]"}`}>
            <h1 style={headingStyle}>{copy.title}</h1>

            {activeMode === "login" && (
              <>
                <label className="block space-y-2">
                  <div className="flex items-center gap-0.5">
                    <span style={{ ...textStyles.sectionTitle, color: colors.text, fontWeight: 400 }}>Email Address</span>
                  </div>
                  <div className="flex min-h-11 items-center border px-2" style={{ borderColor: panelStyles.inputBorder, backgroundColor: panelStyles.inputBackground }}>
                    <input
                      type="email"
                      className="auth-input h-full w-full bg-transparent outline-none"
                      placeholder="example@email.com"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      style={{ ...textStyles.body, color: panelStyles.inputText }}
                    />
                  </div>
                </label>
                <label className="block space-y-2">
                  <div className="flex items-center gap-0.5">
                    <span style={{ ...textStyles.sectionTitle, color: colors.text, fontWeight: 400 }}>Password</span>
                  </div>
                  <div className="flex min-h-11 items-center border px-2" style={{ borderColor: panelStyles.inputBorder, backgroundColor: panelStyles.inputBackground }}>
                    <input
                      type="password"
                      className="auth-input h-full w-full bg-transparent outline-none"
                      placeholder="***********"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      style={{ ...textStyles.body, color: panelStyles.inputText }}
                    />
                    <FiEyeOff size={14} style={{ color: panelStyles.inputPlaceholder }} />
                  </div>
                </label>
                <style>{`.auth-input::placeholder { color: ${panelStyles.inputPlaceholder}; opacity: 1; }`}</style>
                <div className="rounded border p-3" style={{ borderColor: colors.border, backgroundColor: colors.background }}>
                  <p style={{ ...textStyles.bodySm, color: colors.text, fontWeight: 600 }}>Demo Account</p>
                  <p style={{ ...textStyles.bodySm, color: "#8896b2" }}>Email: demo@funzies.com</p>
                  <p style={{ ...textStyles.bodySm, color: "#8896b2" }}>Password: Demo@1234</p>
                  <button
                    type="button"
                    onClick={fillDemoAccount}
                    className="mt-2 rounded px-3 py-1.5 text-white"
                    style={{ ...textStyles.bodySm, backgroundColor: colors.primary }}
                  >
                    Use demo account
                  </button>
                </div>
              </>
            )}

            {activeMode === "signup" && (
              <>
                <InputField label="First Name" required placeholder="Jane" />
                <InputField label="Last Name" required placeholder="Doe" />
                <InputField label="Email Address" required placeholder="example@email.com" />
                <div className="space-y-1" style={{ ...textStyles.body, ...panelStyles.helper }}>
                  <p>Email must meet the following criteria:</p>
                  <ul className="list-disc pl-5">
                    <li>Must contain the &quot;@&quot; symbol.</li>
                    <li>Must have a valid domain name (e.g., example.com).</li>
                  </ul>
                </div>
                <InputField label="Password" required placeholder="***********" trailing={<FiEyeOff size={14} style={{ color: "#8896b2" }} />} />
                <InputField label="Confirm Password" required placeholder="***********" trailing={<FiEyeOff size={14} style={{ color: "#8896b2" }} />} />
                <div className="space-y-1" style={{ ...textStyles.body, ...panelStyles.helper }}>
                  <p>Password must contain at least:</p>
                  <ul className="list-disc pl-5">
                    <li>One lowercase letter</li>
                    <li>One uppercase letter</li>
                    <li>One digit</li>
                    <li>One special character from [@$!%*?&amp;]</li>
                  </ul>
                  <p className="mt-2 font-semibold">Must have a minimum length of 8 characters.</p>
                </div>
                <p style={{ ...textStyles.body, color: colors.primary }}>
                  By clicking Sign Up, you are agreeing to our <a href="/terms" className="underline">Terms and Conditions</a>.
                </p>
              </>
            )}

            {activeMode === "forgot" && (
              <>
                <div className="space-y-2 py-2" style={{ ...textStyles.body, ...panelStyles.helper }}>
                  <p>Lost your precious password key, adventurer? No worries!</p>
                  <p>Enter your email below, and we&apos;ll dispatch a special code - like a treasure map to your inbox.</p>
                  <p>Follow the clues, enter the code, and unlock the vault to your account&apos;s hidden treasures!</p>
                </div>
                <InputField label="Email Address" required placeholder="email@email.com" />
              </>
            )}

            {copy.showRememberMe && (
              <div className="flex items-center justify-between" style={{ color: colors.primary }}>
                <label className="inline-flex items-center gap-2" style={textStyles.body}>
                  <input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} />
                  Remember Me
                </label>
                {copy.showForgotLink && (
                  <button type="button" onClick={() => goToMode("forgot")} style={textStyles.body}>
                    Forgot Password?
                  </button>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={handlePrimaryAction}
              className="min-h-[45px] w-full rounded px-4 py-2 text-white"
              style={{ ...textStyles.sectionTitle, backgroundColor: colors.primary, fontWeight: 400 }}
            >
              {copy.actionLabel}
            </button>

            {copy.showSocial && (
              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-2">
                  <div className="h-px w-full" style={{ backgroundColor: colors.border }} />
                  <span className="whitespace-nowrap text-xs" style={panelStyles.helper}>or continue with</span>
                  <div className="h-px w-full" style={{ backgroundColor: colors.border }} />
                </div>
                <div className="grid gap-3 sm:grid-cols-4">
                  {SOCIAL_PROVIDERS.map((provider) => (
                    <button
                      key={provider.name}
                      type="button"
                      className="space-y-2 rounded border p-3"
                      style={{ borderColor: colors.border, backgroundColor: colors.white }}
                    >
                      <img src={provider.icon} alt={provider.name} className="mx-auto h-12 w-12 object-contain" />
                      <p style={{ ...textStyles.body, color: "#8896b2" }}>{provider.name}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="h-fit space-y-4 rounded-box p-4 shadow" style={panelStyles.info}>
            <div className="space-y-2 p-2" style={{ ...textStyles.body, ...panelStyles.helper }}>
              <p>Are you ready to explore the exciting world of collectibles?</p>
              <p>Whether you&apos;re looking to find unique items or add to your existing collection, just let us know what you&apos;re interested in.</p>
              <p>We&apos;ll guide you through this enjoyable experience, asking only for the essentials to enhance your collectibles journey.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (activeMode === "signup" || activeMode === "forgot") {
                  goToMode("login");
                  return;
                }
                goToMode("signup");
              }}
              className="min-h-[45px] w-full rounded px-4 py-2 text-base text-white"
              style={{ backgroundColor: colors.primary, ...textStyles.sectionTitle, fontWeight: 400 }}
            >
              {copy.sideActionLabel}
            </button>
          </aside>
        </div>
      </section>
    </AppLayout>
  );
}
