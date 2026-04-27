import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import ThemedButton from "../components/ThemedButton";
import ThemedSurface from "../components/ThemedSurface";
import ThemedTextField from "../components/ThemedTextField";
import { useCareersRoles } from "../hooks/useCareersRoles";

export default function CareerApplicationPage() {
  const { roleId } = useParams();
  const navigate = useNavigate();
  const { roles } = useCareersRoles();
  const role = roles.find((r) => r.id === roleId);
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
          <ThemedButton as={Link} to="/careers" variant="primary" size="sm">
            Back to careers
          </ThemedButton>
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
      <ThemedSurface className="p-6 md:p-8">
        <p className="mb-4 leading-7 text-base-content/80">
          Fill in your details below. This demo form does not submit to a backend yet, but follows the full application flow.
        </p>

        <form className="grid max-w-[600px] gap-4" onSubmit={handleSubmit}>
          <ThemedTextField
            className="w-full"
            label="Full name"
            type="text"
            name="fullName"
            required
            placeholder="Enter your full name"
            autoComplete="name"
            value={formData.fullName}
            onChange={handleChange}
          />

          <ThemedTextField
            className="w-full"
            label="Email"
            type="email"
            name="email"
            required
            placeholder="Enter your email address"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
          />

          <ThemedTextField
            className="w-full"
            label="Portfolio / LinkedIn URL"
            type="url"
            name="portfolio"
            placeholder="https://"
            autoComplete="url"
            value={formData.portfolio}
            onChange={handleChange}
          />

          <ThemedTextField
            className="w-full"
            label="Why are you a great fit?"
            name="motivation"
            required
            multiline
            rows={6}
            placeholder="Share relevant experience, product taste, and why this role fits you."
            value={formData.motivation}
            onChange={handleChange}
          />

          <div className="flex flex-wrap gap-3 pt-2">
            <ThemedButton type="submit" variant="primary" size="md">
              Submit application
            </ThemedButton>
            <ThemedButton as={Link} to={`/careers/${role.id}`} variant="outline" size="md">
              Back to role details
            </ThemedButton>
          </div>
        </form>
      </ThemedSurface>
    </AppLayout>
  );
}
