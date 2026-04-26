import { Link } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import TagPill from "../components/TagPill";
import ThemedButton from "../components/ThemedButton";
import ThemedSurface from "../components/ThemedSurface";
import { OPEN_ROLES } from "../data/careersData";
import { useTheme } from "../theme/themeContext";

export default function CareersPage() {
  const { colors } = useTheme();

  return (
    <AppLayout
      title="Careers at Funzies Collection"
      description="Join the team building the most trusted gamer-first shop. We are a focused team with high standards. We move quickly, collaborate with respect, and care deeply about trust across every part of the customer journey."
    >
      <div className="grid gap-6">
        <section className="space-y-4">
          <h3 className="text-xl font-semibold" style={{ color: colors.primary }}>Open roles</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {OPEN_ROLES.map((role) => (
              <ThemedSurface as="article" key={role.id} className="p-6 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-lg font-semibold" style={{ color: colors.primary }}>{role.title}</h4>
                  <TagPill variant="team">{role.team}</TagPill>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <TagPill variant="meta">{role.location}</TagPill>
                  <TagPill variant="meta">{role.type}</TagPill>
                </div>
                <p className="leading-7 text-base-content/80">{role.summary}</p>
                <ul className="flex flex-wrap gap-2">
                  {role.skills.map((skill) => (
                    <li key={`${role.title}-${skill}`}>
                      <TagPill variant="skill" className="px-3">{skill}</TagPill>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2">
                  <ThemedButton as={Link} variant="outline" size="sm" to={`/careers/${role.id}`}>
                    More information
                  </ThemedButton>
                  <ThemedButton as={Link} variant="primary" size="sm" to={`/careers/${role.id}/apply`}>
                    Apply now
                  </ThemedButton>
                </div>
              </ThemedSurface>
            ))}
          </div>
        </section>

        <ThemedSurface className="p-6 space-y-2">
          <h3 className="text-xl font-semibold" style={{ color: colors.primary }}>Do not see your role?</h3>
          <p className="leading-7 text-base-content/80">
            Send your portfolio and a short intro to{" "}
            <a className="underline" style={{ color: colors.primary }} href="mailto:careers@funziescollection.com">
              careers@funziescollection.com
            </a>
            . We are always scouting builders, creators, and players with strong taste.
          </p>
        </ThemedSurface>
      </div>
    </AppLayout>
  );
}
