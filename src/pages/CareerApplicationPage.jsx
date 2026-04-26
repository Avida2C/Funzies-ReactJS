import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import ThemedButton from "../components/ThemedButton";
import ThemedSurface from "../components/ThemedSurface";
import { getRoleById } from "../data/careersData";
import { useTheme } from "../theme/themeContext";

export default function CareerApplicationPage() {
  const { roleId } = useParams();
  const navigate = useNavigate();
  const { colors, mode } = useTheme();
  const role = getRoleById(roleId);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    portfolio: "",
    motivation: "",
  });
  const formFieldTextColor = mode === "dark" ? "#1f2a36" : colors.text;
  const formPlaceholderColor = mode === "dark" ? "#6b7280" : "#9ca3af";
  const formFieldStyle = {
    borderColor: colors.primary,
    backgroundColor: colors.white,
    color: formFieldTextColor,
  };

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
          <style>{`.career-application-input::placeholder { color: ${formPlaceholderColor}; opacity: 1; }`}</style>
          <label className="form-control w-full">
            <span className="label-text mb-1.5 text-sm font-medium text-base-content">Full name</span>
            <input
              className="career-application-input h-10 w-full rounded border px-3 text-sm outline-none"
              style={formFieldStyle}
              type="text"
              name="fullName"
              required
              placeholder="Enter your full name"
              autoComplete="name"
              value={formData.fullName}
              onChange={handleChange}
            />
          </label>

          <label className="form-control w-full">
            <span className="label-text mb-1.5 text-sm font-medium text-base-content">Email</span>
            <input
              className="career-application-input h-10 w-full rounded border px-3 text-sm outline-none"
              style={formFieldStyle}
              type="email"
              name="email"
              required
              placeholder="Enter your email address"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
            />
          </label>

          <label className="form-control w-full">
            <span className="label-text mb-1.5 text-sm font-medium text-base-content">Portfolio / LinkedIn URL</span>
            <input
              className="career-application-input h-10 w-full rounded border px-3 text-sm outline-none"
              style={formFieldStyle}
              type="url"
              name="portfolio"
              placeholder="https://"
              autoComplete="url"
              value={formData.portfolio}
              onChange={handleChange}
            />
          </label>

          <label className="form-control w-full">
            <span className="label-text mb-1.5 text-sm font-medium text-base-content">Why are you a great fit?</span>
            <textarea
              className="career-application-input min-h-36 w-full rounded border px-3 py-2 text-sm outline-none"
              style={formFieldStyle}
              name="motivation"
              required
              placeholder="Share relevant experience, product taste, and why this role fits you."
              value={formData.motivation}
              onChange={handleChange}
            />
          </label>

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
