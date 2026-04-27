import { textStyles } from "../../../theme/typography";
import ThemedSelect from "../../../components/ThemedSelect";
import { SectionHeader } from "../AccountSectionPrimitives";

const LANGUAGE_OPTIONS = [
  "English",
  "Deutsch",
  "Français",
  "Italiano",
  "Español",
  "Nederlands",
];

const TIMEZONE_OPTIONS = [
  "GMT-5",
  "GMT-2",
  "GMT+0",
  "GMT+1",
  "GMT+2",
  "GMT+3",
  "GMT+8",
];

export default function PreferencesSection({ mutedText, language, setLanguage, timeZone, setTimeZone }) {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionHeader>Language & Region</SectionHeader>
        <div className="grid gap-4 md:grid-cols-2">
          <ThemedSelect
            size="sm"
            label="Language Preference"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            {LANGUAGE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </ThemedSelect>
          <ThemedSelect
            size="sm"
            label="Time Zone"
            value={timeZone}
            onChange={(e) => setTimeZone(e.target.value)}
          >
            {TIMEZONE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </ThemedSelect>
        </div>
        <p style={{ ...textStyles.bodySm, color: mutedText }}>Changes are saved locally for this demo UI.</p>
      </section>
    </div>
  );
}

