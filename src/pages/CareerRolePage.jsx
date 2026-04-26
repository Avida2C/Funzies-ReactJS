import { Link, useParams } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import ThemedSurface from "../components/ThemedSurface";
import { getRoleById } from "../data/careersData";

export default function CareerRolePage() {
  const { roleId } = useParams();
  const role = getRoleById(roleId);

  if (!role) {
    return (
      <AppLayout title="Role not found" description="The job post you are looking for is no longer available.">
        <ThemedSurface className="p-6 space-y-4">
          <p className="leading-7 text-base-content/80">Please return to careers and explore currently open roles.</p>
          <Link to="/careers" className="btn btn-primary btn-sm">
            Back to careers
          </Link>
        </ThemedSurface>
      </AppLayout>
    );
  }

  return (
    <AppLayout title={role.title} description={`${role.team} - ${role.location} - ${role.type}`}>
      <div className="grid gap-6">
        <ThemedSurface className="p-6 space-y-3">
          <h2 className="text-xl font-semibold text-base-content">About this role</h2>
          <p className="leading-7 text-base-content/80">{role.summary}</p>
        </ThemedSurface>

        <ThemedSurface className="p-6 space-y-3">
          <h2 className="text-xl font-semibold text-base-content">What you will do</h2>
          <ul className="list-disc space-y-2 pl-6 leading-7 text-base-content/80">
            {role.responsibilities.map((item) => (
              <li key={`${role.id}-responsibility-${item}`}>{item}</li>
            ))}
          </ul>
        </ThemedSurface>

        <ThemedSurface className="p-6 space-y-3">
          <h2 className="text-xl font-semibold text-base-content">What we are looking for</h2>
          <ul className="list-disc space-y-2 pl-6 leading-7 text-base-content/80">
            {role.requirements.map((item) => (
              <li key={`${role.id}-requirement-${item}`}>{item}</li>
            ))}
          </ul>
        </ThemedSurface>

        <ThemedSurface className="p-6 space-y-3">
          <h2 className="text-xl font-semibold text-base-content">Core skills</h2>
          <ul className="flex flex-wrap gap-2">
            {role.skills.map((skill) => (
              <li key={`${role.id}-skill-${skill}`} className="rounded-full bg-base-200 px-3 py-1 text-xs text-base-content/80">
                {skill}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-2 pt-2">
            <Link to={`/careers/${role.id}/apply`} className="btn btn-primary btn-sm">
              Apply now
            </Link>
            <Link to="/careers" className="btn btn-outline btn-sm">
              View all roles
            </Link>
          </div>
        </ThemedSurface>
      </div>
    </AppLayout>
  );
}
