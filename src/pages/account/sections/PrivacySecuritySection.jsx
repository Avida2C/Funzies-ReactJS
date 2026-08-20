import TwoFactorSection from "./TwoFactorSection";
import { useTwoFactor } from "../../../lib/twoFactorAuth";
import { useAuth } from "../../../lib/authContext";

export default function PrivacySecuritySection({ colors, mutedText }) {
  const { email } = useAuth();
  const { state, persist } = useTwoFactor();

  return (
    <TwoFactorSection colors={colors} mutedText={mutedText} email={email} state={state} onChange={persist} />
  );
}
