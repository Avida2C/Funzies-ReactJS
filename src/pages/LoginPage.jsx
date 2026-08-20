import { useEffect, useMemo, useState } from "react";
import { FaApple, FaFacebook, FaGoogle, FaMicrosoft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import ThemedButton from "../components/ThemedButton";
import ThemedCheckbox from "../components/ThemedCheckbox";
import ThemedTextField from "../components/ThemedTextField";
import { useAuth } from "../lib/authContext";
import { ADMIN_DEMO_EMAIL, ADMIN_DEMO_PASSWORD } from "../lib/adminAuth";
import {
  canUsePasswordless,
  currentAuthenticatorCode,
  generateEmailCode,
  hasAnyTwoFactor,
  readTwoFactorState,
  twoFactorMethodsEnabled,
  writeTwoFactorState,
} from "../lib/twoFactorAuth";
import { getStoredAccountPassword } from "./ChangePasswordPage";
import { textStyles } from "../theme/typography";
import { useTheme } from "../theme/themeContext";

const SOCIAL_PROVIDERS = [
  { name: "Google", Icon: FaGoogle, iconColor: "#EA4335" },
  { name: "Facebook", Icon: FaFacebook, iconColor: "#1877F2" },
  { name: "Microsoft", Icon: FaMicrosoft, iconColor: "#00A4EF" },
  { name: "Apple", Icon: FaApple, iconColor: "#111827" },
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

function InputField({ label, required = false, type = "text", placeholder, trailing = null, className = "", ...props }) {
  return (
    <ThemedTextField
      className={className}
      label={label}
      required={required}
      type={type}
      placeholder={placeholder}
      inputClassName="text-base"
      endAdornment={trailing ? <span className="px-2">{trailing}</span> : null}
      {...props}
    />
  );
}

export default function LoginPage({ initialMode = "login" }) {
  const { colors, mode } = useTheme();
  const { signIn, signInAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeMode, setActiveMode] = useState(initialMode);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [awaitingTwoFactor, setAwaitingTwoFactor] = useState(false);
  const [twoFactorMethod, setTwoFactorMethod] = useState("authenticator");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [demoEmailCode, setDemoEmailCode] = useState("");
  const [pendingSignIn, setPendingSignIn] = useState(/** @type {null | { displayName: string, email: string, isDemo: boolean, password: string }} */ (null));
  const [otpTick, setOtpTick] = useState(0);

  useEffect(() => {
    if (!awaitingTwoFactor || twoFactorMethod !== "authenticator") {
      return undefined;
    }
    const id = window.setInterval(() => setOtpTick((n) => n + 1), 1000);
    return () => window.clearInterval(id);
  }, [awaitingTwoFactor, twoFactorMethod]);
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
    }),
    [colors.background, isDark],
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

  const completeSignIn = (profile, passwordValue, isDemo) => {
    if (isDemo) {
      signInAdmin({ email: profile.email, password: passwordValue });
    }
    signIn({ displayName: profile.displayName, email: profile.email });
    setAwaitingTwoFactor(false);
    setPendingSignIn(null);
    navigate("/account");
  };

  const beginTwoFactor = (profile, passwordValue, isDemo) => {
    const twoFactor = readTwoFactorState(profile.email);
    const methods = twoFactorMethodsEnabled(twoFactor);
    const firstMethod = methods.authenticator
      ? "authenticator"
      : methods.email
        ? "email"
        : methods.passkey
          ? "passkey"
          : "backup";
    setPendingSignIn({ ...profile, isDemo, password: passwordValue });
    setTwoFactorMethod(firstMethod);
    setTwoFactorCode("");
    setDemoEmailCode(methods.email ? generateEmailCode() : "");
    setAwaitingTwoFactor(true);
    setLoginError("");
  };

  const handlePrimaryAction = () => {
    if (activeMode === "forgot") {
      return;
    }
    setLoginError("");
    const trimmedEmail = email.trim();
    const normalizedEmail = trimmedEmail.toLowerCase();
    const twoFactor = readTwoFactorState(trimmedEmail);
    const passwordless = canUsePasswordless(twoFactor);
    const storedPassword = getStoredAccountPassword(trimmedEmail);
    const isDemoAccount = normalizedEmail === ADMIN_DEMO_EMAIL.toLowerCase() && password === ADMIN_DEMO_PASSWORD;
    const profile = {
      displayName: isDemoAccount ? "Demo Account" : "Nadine",
      email: trimmedEmail,
    };

    if (activeMode === "signup") {
      signIn({ displayName: profile.displayName, email: trimmedEmail });
      navigate("/account");
      return;
    }

    if (passwordless) {
      beginTwoFactor(profile, password, isDemoAccount);
      return;
    }

    if (!isDemoAccount && storedPassword && storedPassword !== password) {
      setLoginError("Incorrect password.");
      return;
    }

    if (hasAnyTwoFactor(twoFactor)) {
      beginTwoFactor(profile, password, isDemoAccount);
      return;
    }

    completeSignIn(profile, password, isDemoAccount);
  };

  const verifyTwoFactor = () => {
    if (!pendingSignIn) {
      return;
    }
    const twoFactor = readTwoFactorState(pendingSignIn.email);
    const methods = twoFactorMethodsEnabled(twoFactor);
    const code = twoFactorCode.trim();

    if (twoFactorMethod === "authenticator") {
      const expected = currentAuthenticatorCode(twoFactor.authenticator.secret);
      const supplied = code || expected;
      if (!methods.authenticator || supplied !== expected) {
        setLoginError("Authenticator code is not valid or has expired.");
        return;
      }
    } else if (twoFactorMethod === "email") {
      const supplied = code || demoEmailCode;
      if (!methods.email || supplied !== demoEmailCode) {
        setLoginError("Email code does not match.");
        return;
      }
    } else if (twoFactorMethod === "backup") {
      const match = twoFactor.backupCodes.unused.find((item) => item.replace(/\s+/g, "").toUpperCase() === code.replace(/\s+/g, "").toUpperCase());
      if (!match) {
        setLoginError("That backup code is not valid.");
        return;
      }
      writeTwoFactorState(pendingSignIn.email, {
        ...twoFactor,
        backupCodes: {
          ...twoFactor.backupCodes,
          unused: twoFactor.backupCodes.unused.filter((item) => item !== match),
          used: [...twoFactor.backupCodes.used, match],
        },
      });
    } else if (twoFactorMethod === "passkey") {
      if (!methods.passkey) {
        setLoginError("No passkey on this account.");
        return;
      }
    }

    completeSignIn(pendingSignIn, pendingSignIn.password, pendingSignIn.isDemo);
  };

  const fillDemoAccount = () => {
    setEmail(ADMIN_DEMO_EMAIL);
    setPassword(ADMIN_DEMO_PASSWORD);
  };

  const headingStyle = isForgotMode
    ? { ...textStyles.sectionTitle, color: colors.primary, fontWeight: 600 }
    : { ...textStyles.title, color: colors.primary, fontWeight: 400 };

  return (
    <AppLayout title={copy.title} description="Access your account." showPageHeader={false} contentClassName="">
      <section className="rounded-box border p-5 shadow md:p-8" style={panelStyles.outer}>
        <div className={`w-full space-y-4 ${isForgotMode ? "max-w-[600px]" : "max-w-[500px]"}`}>
            <h1 style={headingStyle}>{copy.title}</h1>

            {activeMode === "login" && !awaitingTwoFactor && (
              <>
                <InputField
                  label="Email Address"
                  type="email"
                  placeholder="example@email.com"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
                {canUsePasswordless(readTwoFactorState(email)) ? (
                  <p style={{ ...textStyles.bodySm, color: colors.text }}>
                    Passwordless is on for this email. Continue to verify with a passkey or email code.
                  </p>
                ) : (
                  <InputField
                    label="Password"
                    type="password"
                    placeholder="***********"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                )}
                {loginError ? <p style={{ ...textStyles.bodySm, color: "#b91c1c" }}>{loginError}</p> : null}
                <div className="rounded border p-3" style={{ borderColor: colors.border, backgroundColor: colors.background }}>
                  <p style={{ ...textStyles.bodySm, color: colors.text, fontWeight: 600 }}>Demo Account</p>
                  <p style={{ ...textStyles.bodySm, color: "#8896b2" }}>Email: {ADMIN_DEMO_EMAIL}</p>
                  <p style={{ ...textStyles.bodySm, color: "#8896b2" }}>Password: {ADMIN_DEMO_PASSWORD}</p>
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
                <InputField label="Password" required type="password" autoComplete="new-password" placeholder="***********" />
                <InputField label="Confirm Password" required type="password" autoComplete="new-password" placeholder="***********" />
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
                <InputField
                  label="Email Address"
                  required
                  type="email"
                  autoComplete="email"
                  placeholder="email@email.com"
                />
              </>
            )}

            {activeMode === "login" && awaitingTwoFactor ? (
              <div className="space-y-3">
                <p style={{ ...textStyles.body, color: colors.text }}>Second step for {pendingSignIn?.email}</p>
                {loginError ? <p style={{ ...textStyles.bodySm, color: "#b91c1c" }}>{loginError}</p> : null}
                <div className="flex flex-wrap gap-2">
                  {(() => {
                    const enabled = twoFactorMethodsEnabled(readTwoFactorState(pendingSignIn?.email));
                    return [
                      enabled.authenticator ? "authenticator" : null,
                      enabled.email ? "email" : null,
                      enabled.passkey ? "passkey" : null,
                      enabled.backupCodes ? "backup" : null,
                    ].filter(Boolean);
                  })().map((method) => (
                    <button
                      key={method}
                      type="button"
                      className="rounded border px-2 py-1 text-sm capitalize"
                      style={{
                        borderColor: twoFactorMethod === method ? colors.primary : colors.border,
                        color: twoFactorMethod === method ? colors.primary : colors.text,
                      }}
                      onClick={() => {
                        setTwoFactorMethod(method);
                        setLoginError("");
                        if (method === "email" && !demoEmailCode) {
                          setDemoEmailCode(generateEmailCode());
                        }
                      }}
                    >
                      {method}
                    </button>
                  ))}
                </div>
                {twoFactorMethod === "email" ? (
                  <p style={{ ...textStyles.bodySm, color: "#8896b2" }}>
                    Demo inbox code: <span className="font-mono" style={{ color: colors.text }}>{demoEmailCode}</span>
                  </p>
                ) : null}
                {twoFactorMethod === "authenticator" ? (
                  <p style={{ ...textStyles.bodySm, color: colors.text }}>
                    Current authenticator code:{" "}
                    <span className="font-mono font-semibold">
                      {otpTick >= 0
                        ? currentAuthenticatorCode(readTwoFactorState(pendingSignIn?.email).authenticator.secret)
                        : ""}
                    </span>
                    <span style={{ color: "#8896b2" }}> (updates every 30s)</span>
                  </p>
                ) : null}
                {twoFactorMethod === "passkey" ? (
                  <p style={{ ...textStyles.bodySm, color: "#8896b2" }}>
                    Continue to confirm the passkey stored for this account on this device.
                  </p>
                ) : null}
                {twoFactorMethod !== "passkey" && twoFactorMethod !== "authenticator" && twoFactorMethod !== "email" ? (
                  <InputField
                    label="Backup code"
                    value={twoFactorCode}
                    onChange={(event) => setTwoFactorCode(event.target.value)}
                  />
                ) : null}
                <ThemedButton type="button" variant="redOutline" size="sm" onClick={() => { setAwaitingTwoFactor(false); setPendingSignIn(null); setLoginError(""); }}>
                  Back
                </ThemedButton>
              </div>
            ) : null}

            {copy.showRememberMe && !awaitingTwoFactor && (
              <div className="flex items-center justify-between" style={{ color: colors.primary }}>
                <ThemedCheckbox
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  label="Remember Me"
                  className="items-center"
                  labelClassName="!text-sm"
                />
                {copy.showForgotLink && (
                  <button type="button" onClick={() => goToMode("forgot")} style={textStyles.body}>
                    Forgot Password?
                  </button>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={awaitingTwoFactor ? verifyTwoFactor : handlePrimaryAction}
              className="min-h-[45px] w-full rounded px-4 py-2 text-white"
              style={{ ...textStyles.sectionTitle, backgroundColor: colors.primary, fontWeight: 400 }}
            >
              {awaitingTwoFactor ? (twoFactorMethod === "passkey" ? "Continue with passkey" : "Verify") : copy.actionLabel}
            </button>

            {activeMode === "forgot" ? null : activeMode === "login" ? (
              <p className="text-right" style={{ ...textStyles.bodySm, color: colors.text, textAlign: "right" }}>
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => goToMode("signup")}
                  className="underline"
                  style={{ color: colors.primary }}
                >
                  Sign Up
                </button>
              </p>
            ) : (
              <p className="text-right" style={{ ...textStyles.bodySm, color: colors.text, textAlign: "right" }}>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => goToMode("login")}
                  className="underline"
                  style={{ color: colors.primary }}
                >
                  Log In
                </button>
              </p>
            )}

            {copy.showSocial && !awaitingTwoFactor && (
              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-2">
                  <div className="h-px w-full" style={{ backgroundColor: colors.border }} />
                  <span className="whitespace-nowrap text-xs" style={panelStyles.helper}>or continue with</span>
                  <div className="h-px w-full" style={{ backgroundColor: colors.border }} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {SOCIAL_PROVIDERS.map((provider) => {
                    const Icon = provider.Icon;
                    return (
                      <button
                        key={provider.name}
                        type="button"
                        className="flex flex-col items-center justify-center gap-2 rounded border p-3"
                        style={{ borderColor: colors.border, backgroundColor: colors.white }}
                        aria-label={`Continue with ${provider.name}`}
                      >
                        <Icon size={32} color={provider.iconColor} aria-hidden />
                        <p style={{ ...textStyles.body, color: "#8896b2" }}>{provider.name}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
        </div>
      </section>
    </AppLayout>
  );
}
