import { textStyles } from "../../../theme/typography";
import ThemedButton from "../../../components/ThemedButton";
import ThemedCheckbox from "../../../components/ThemedCheckbox";
import { SectionHeader } from "../AccountSectionPrimitives";

export default function CommunicationSettingsSection({ colors, communicationGroups, communication, setCommunication }) {
  return (
    <section className="space-y-6">
      <div>
        <SectionHeader>Communication Preferences</SectionHeader>
        <p style={{ ...textStyles.body, color: colors.text }}>Choose how you&apos;d like to hear from us.</p>
      </div>
      {communicationGroups.map((group) => (
        <div key={group.title} className="space-y-2">
          <h3 style={{ ...textStyles.body, color: colors.text, fontWeight: 600 }}>{group.title}</h3>
          {group.options.map((option) => {
            const key = `${group.title}-${option}`;
            return (
              <ThemedCheckbox
                key={key}
                checked={Boolean(communication[key])}
                onChange={() => setCommunication((current) => ({ ...current, [key]: !current[key] }))}
                label={option}
                className="items-center"
              />
            );
          })}
        </div>
      ))}
      <ThemedButton type="button" variant="redSolid" size="md" style={{ ...textStyles.sectionTitle }}>
        Save Preferences
      </ThemedButton>
    </section>
  );
}

