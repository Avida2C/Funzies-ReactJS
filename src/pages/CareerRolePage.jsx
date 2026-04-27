import { Link, useParams } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import TagPill from "../components/TagPill";
import ThemedButton from "../components/ThemedButton";
import ThemedSurface from "../components/ThemedSurface";
import { useCareersRoles } from "../hooks/useCareersRoles";
import { useTheme } from "../theme/themeContext";

export default function CareerRolePage() {
  const { roleId } = useParams();
  const { colors } = useTheme();
  const { roles } = useCareersRoles();
  const role = roles.find((r) => r.id === roleId);

  if (!role) {
    return (
      <AppLayout title="Role not found" description="The job post you are looking for is no longer available.">
        <ThemedSurface className="p-6 space-y-4">
          <p className="leading-7 text-base-content/80">Please return to careers and explore currently open roles.</p>
          <ThemedButton
            as={Link}
            to="/careers"
            variant="primary"
            size="sm"
          >
            Back to careers
          </ThemedButton>
        </ThemedSurface>
      </AppLayout>
    );
  }

  return (
    <AppLayout title={role.title} description={`${role.team} - ${role.location} - ${role.type}`}>
      <div className="grid gap-6">
        <ThemedSurface className="p-6 md:p-8 space-y-6">
          <div className="flex flex-wrap gap-2 text-xs">
            <TagPill variant="meta">{role.location}</TagPill>
            <TagPill variant="meta">{role.type}</TagPill>
            <TagPill variant="team">{role.team}</TagPill>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold" style={{ color: colors.primary }}>About this role</h2>
            <p className="leading-7 text-base-content/80">{role.summary}</p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold" style={{ color: colors.primary }}>What you will do</h2>
            <ul className="list-disc space-y-2 pl-6 leading-7 text-base-content/80">
              {role.responsibilities.map((item) => (
                <li key={`${role.id}-responsibility-${item}`}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold" style={{ color: colors.primary }}>What we are looking for</h2>
            <ul className="list-disc space-y-2 pl-6 leading-7 text-base-content/80">
              {role.requirements.map((item) => (
                <li key={`${role.id}-requirement-${item}`}>{item}</li>
              ))}
            </ul>
          </div>
        </ThemedSurface>

        <ThemedSurface className="p-6 md:p-8 space-y-3">
          <h2 className="text-xl font-semibold" style={{ color: colors.primary }}>Core skills</h2>
          <ul className="flex flex-wrap gap-2">
            {role.skills.map((skill) => (
              <li key={`${role.id}-skill-${skill}`}>
                <TagPill variant="skill" className="px-3">{skill}</TagPill>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3 pt-2">
            <ThemedButton
              as={Link}
              to={`/careers/${role.id}/apply`}
              variant="primary"
              size="md"
            >
              Apply now
            </ThemedButton>
            <ThemedButton
              as={Link}
              to="/careers"
              variant="outline"
              size="md"
            >
              View all roles
            </ThemedButton>
          </div>
        </ThemedSurface>
      </div>
    </AppLayout>
  );
}
