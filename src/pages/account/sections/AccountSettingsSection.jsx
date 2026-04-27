import { FiEyeOff } from "react-icons/fi";
import { textStyles } from "../../../theme/typography";
import { ReadOnlyField, SectionHeader } from "../AccountSectionPrimitives";

export default function AccountSettingsSection({ mutedText, profile }) {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionHeader>Personal Information</SectionHeader>
        <div className="grid gap-4 md:grid-cols-2">
          <ReadOnlyField label="First Name" value={profile.firstName} />
          <ReadOnlyField label="Last Name" value={profile.lastName} />
          <ReadOnlyField label="Date of Birth" value="03/10/1988" />
          <ReadOnlyField label="Gender" value="Male" />
        </div>
        <ReadOnlyField label="Contact Number" value={profile.phone} />
        <p style={{ ...textStyles.bodySm, color: mutedText }}>Profile editing is managed via the Admin dataset in this demo.</p>
      </section>

      <section className="space-y-4">
        <SectionHeader>Email Address Management</SectionHeader>
        <ReadOnlyField label="Email Address" value={profile.emailMasked} />
      </section>

      <section className="space-y-4">
        <SectionHeader>Password Management</SectionHeader>
        <p style={{ ...textStyles.body, color: mutedText }}>Last changed on: 2025-06-01</p>
        <ReadOnlyField label="Current Password" value="*******************" rightIcon={<FiEyeOff size={16} style={{ color: mutedText }} />} />
        <ReadOnlyField label="New Password" value="*******************" rightIcon={<FiEyeOff size={16} style={{ color: mutedText }} />} />
        <ReadOnlyField label="Confirm New Password" value="*******************" rightIcon={<FiEyeOff size={16} style={{ color: mutedText }} />} />
        <p style={{ ...textStyles.bodySm, color: mutedText }}>Password updates aren’t implemented in this demo UI.</p>
      </section>
    </div>
  );
}

