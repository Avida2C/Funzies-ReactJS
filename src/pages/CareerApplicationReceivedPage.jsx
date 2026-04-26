import { Link, useParams } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import ThemedSurface from "../components/ThemedSurface";
import { getRoleById } from "../data/careersData";

export default function CareerApplicationReceivedPage() {
  const { roleId } = useParams();
  const role = getRoleById(roleId);

  if (!role) {
    return (
      <AppLayout title="Application status" description="We could not match this application to an active role.">
        <ThemedSurface className="p-6 space-y-4">
          <p className="leading-7 text-base-content/80">Please return to careers and submit a new application.</p>
          <Link to="/careers" className="btn btn-primary btn-sm">
            Back to careers
          </Link>
        </ThemedSurface>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Application received" description="Your submission is in queue for review.">
      <ThemedSurface className="p-6 space-y-4">
        <h2 className="text-xl font-semibold text-base-content">Thanks for applying to {role.title}.</h2>
        <p className="leading-7 text-base-content/80">
          We have received your application and our hiring team will review it shortly. If your profile matches the role
          requirements, we will reach out for the next step.
        </p>
        <div className="flex flex-wrap gap-2 pt-2">
          <Link to="/careers" className="btn btn-primary btn-sm">
            View more roles
          </Link>
          <Link to={`/careers/${role.id}`} className="btn btn-outline btn-sm">
            Back to role details
          </Link>
        </div>
      </ThemedSurface>
    </AppLayout>
  );
}
