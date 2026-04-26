import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import ThemedSurface from "../components/ThemedSurface";
import { getRoleById } from "../data/careersData";

export default function CareerApplicationPage() {
  const { roleId } = useParams();
  const navigate = useNavigate();
  const role = getRoleById(roleId);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    portfolio: "",
    motivation: "",
  });

  if (!role) {
    return (
      <AppLayout title="Role not found" description="This application link is no longer active.">
        <ThemedSurface className="p-6 space-y-4">
          <p className="leading-7 text-base-content/80">Please return to careers to apply for an active opening.</p>
          <Link to="/careers" className="btn btn-primary btn-sm">
            Back to careers
          </Link>
        </ThemedSurface>
      </AppLayout>
    );
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate(`/careers/${role.id}/application-received`);
  };

  return (
    <AppLayout title={`Apply: ${role.title}`} description={`Complete your application for ${role.team}.`}>
      <ThemedSurface className="p-6 space-y-5">
        <p className="leading-7 text-base-content/80">
          Fill in your details below. This demo form does not submit to a backend yet, but follows the full application flow.
        </p>

        <form className="grid gap-4" onSubmit={handleSubmit}>
          <label className="form-control w-full">
            <span className="label-text mb-1.5 text-sm font-medium text-base-content">Full name</span>
            <input
              className="input input-bordered w-full"
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
            />
          </label>

          <label className="form-control w-full">
            <span className="label-text mb-1.5 text-sm font-medium text-base-content">Email</span>
            <input
              className="input input-bordered w-full"
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </label>

          <label className="form-control w-full">
            <span className="label-text mb-1.5 text-sm font-medium text-base-content">Portfolio / LinkedIn URL</span>
            <input
              className="input input-bordered w-full"
              type="url"
              name="portfolio"
              placeholder="https://"
              value={formData.portfolio}
              onChange={handleChange}
            />
          </label>

          <label className="form-control w-full">
            <span className="label-text mb-1.5 text-sm font-medium text-base-content">Why are you a great fit?</span>
            <textarea
              className="textarea textarea-bordered min-h-32 w-full"
              name="motivation"
              required
              value={formData.motivation}
              onChange={handleChange}
            />
          </label>

          <div className="flex flex-wrap gap-2 pt-2">
            <button type="submit" className="btn btn-primary btn-sm">
              Submit application
            </button>
            <Link to={`/careers/${role.id}`} className="btn btn-outline btn-sm">
              Back to role details
            </Link>
          </div>
        </form>
      </ThemedSurface>
    </AppLayout>
  );
}
