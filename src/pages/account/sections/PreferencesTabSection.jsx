import CommunicationSettingsSection from "./CommunicationSettingsSection";
import PreferencesSection from "./PreferencesSection";
import SecurityPrivacySection from "./SecurityPrivacySection";

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
  linkedAccounts,
  setLinkedAccounts,
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
        linkedAccounts={linkedAccounts}
        setLinkedAccounts={setLinkedAccounts}
        linkedAccountRows={linkedAccountRows}
      />
      <CommunicationSettingsSection
        colors={colors}
        communicationGroups={communicationGroups}
        communication={communication}
        setCommunication={setCommunication}
      />
    </div>
  );
}
