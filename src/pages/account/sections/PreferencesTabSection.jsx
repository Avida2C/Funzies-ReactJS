import CommunicationSettingsSection from "./CommunicationSettingsSection";
import PreferencesSection from "./PreferencesSection";
import SecurityPrivacySection from "./SecurityPrivacySection";
import { textStyles } from "../../../theme/typography";
import ThemedButton from "../../../components/ThemedButton";
import { SectionHeader } from "../AccountSectionPrimitives";

export default function PreferencesTabSection({
  colors,
  mutedText,
  language,
  setLanguage,
  timeZone,
  setTimeZone,
  communicationGroups,
  communication,
  setCommunication,
  securityToggles,
  setSecurityToggles,
  linkedAccounts,
  setLinkedAccounts,
  security2faRows,
  linkedAccountRows,
}) {
  return (
    <div className="space-y-10">
      <PreferencesSection
        mutedText={mutedText}
        language={language}
        setLanguage={setLanguage}
        timeZone={timeZone}
        setTimeZone={setTimeZone}
      />
      <SecurityPrivacySection
        colors={colors}
        mutedText={mutedText}
        securityToggles={securityToggles}
        setSecurityToggles={setSecurityToggles}
        linkedAccounts={linkedAccounts}
        setLinkedAccounts={setLinkedAccounts}
        security2faRows={security2faRows}
        linkedAccountRows={linkedAccountRows}
        showDeactivate={false}
      />
      <CommunicationSettingsSection
        colors={colors}
        communicationGroups={communicationGroups}
        communication={communication}
        setCommunication={setCommunication}
      />
      <section className="space-y-4">
        <SectionHeader>Deactivate or Delete Account</SectionHeader>
        <div className="flex flex-col gap-2 sm:flex-row">
          <ThemedButton
            type="button"
            variant="redOutline"
            size="sm"
            className="w-full sm:w-auto"
            style={{ ...textStyles.bodySm }}
          >
            Download Account Data
          </ThemedButton>
          <ThemedButton
            type="button"
            variant="redOutline"
            size="sm"
            className="w-full sm:w-auto"
            style={{ ...textStyles.bodySm }}
          >
            Deactivate / Delete
          </ThemedButton>
        </div>
      </section>
    </div>
  );
}

