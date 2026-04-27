import { BsFillStarFill } from "react-icons/bs";
import { textStyles } from "../../../theme/typography";
import { InfoCard } from "../AccountSectionPrimitives";

export default function ProfileOverviewSection({ colors, mutedText, profile, defaultAddress, formatAddressBlock }) {
  return (
    <div className="space-y-8">
      <InfoCard className="max-w-[640px]">
        <div className="flex items-start gap-3">
          <BsFillStarFill size={26} color="#facc15" />
          <div className="space-y-6">
            <div>
              <p style={{ ...textStyles.sectionTitle, color: colors.text }}>Premium Member</p>
              <p style={{ ...textStyles.body, color: colors.text }}>1,245 Loyalty Points</p>
            </div>
            <div>
              <p style={{ ...textStyles.body, color: colors.text, fontWeight: 600 }}>Joined On</p>
              <p style={{ ...textStyles.body, color: colors.text }}>{profile.joinedOn}</p>
            </div>
          </div>
        </div>
      </InfoCard>

      <section className="space-y-3">
        <h2 style={{ ...textStyles.sectionTitle, color: colors.text }}>Default Shipping Address</h2>
        <InfoCard className="w-full max-w-[280px]">
          {defaultAddress ? (
            <p style={{ ...textStyles.body, color: colors.text, whiteSpace: "pre-line" }}>{formatAddressBlock(defaultAddress)}</p>
          ) : (
            <p style={{ ...textStyles.body, color: mutedText }}>
              No shipping addresses yet. Add one under the <strong>Addresses</strong> tab.
            </p>
          )}
        </InfoCard>
      </section>
    </div>
  );
}

