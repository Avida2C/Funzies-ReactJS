import { useState } from "react";
import { Link } from "react-router-dom";
import { FiExternalLink, FiMail, FiMessageCircle } from "react-icons/fi";
import AppLayout from "../components/AppLayout";
import ThemedSurface from "../components/ThemedSurface";
import { useTheme } from "../theme/themeContext";

const TOPIC_OPTIONS = [
  { value: "order-shipping", label: "Order & shipping" },
  { value: "returns", label: "Returns & refunds" },
  { value: "product", label: "Product authenticity or specs" },
  { value: "account", label: "Account & login" },
  { value: "partnership", label: "Partnerships & wholesale" },
  { value: "other", label: "Something else" },
];

const SELF_SERVE_LINKS = [
  { to: "/help-center", label: "Help Center", blurb: "Search FAQs and popular topics." },
  { to: "/shipping-information", label: "Shipping information", blurb: "Tracking, carriers, and timelines." },
  { to: "/return-refund-policy", label: "Return & refund policy", blurb: "Eligibility and how to start a return." },
  { to: "/purchase-protection", label: "Purchase protection", blurb: "Coverage for defects and high-value orders." },
];

const INITIAL_FORM = {
  name: "",
  email: "",
  topic: "order-shipping",
  orderNumber: "",
  message: "",
};

export default function ContactPage() {
  const { colors } = useTheme();
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  const handleSendAnother = () => {
    setSubmitted(false);
    setForm(INITIAL_FORM);
  };

  return (
    <AppLayout
      title="Contact"
      description="We are here for orders, returns, and product questions. Many answers are instant in the Help Center."
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-start">
        <div className="space-y-6">
          <section
            className="rounded-box border border-primary/20 p-6 shadow"
            style={{
              background: `linear-gradient(to bottom right, ${colors.primary}1a, ${colors.background}, ${colors.background})`,
            }}
          >
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <FiMessageCircle size={22} aria-hidden />
              </span>
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-base-content">Response times</h2>
                <p className="leading-7 text-base-content/80">
                  We typically reply within <strong className="text-base-content">1 business day</strong> for general
                  support. Order issues with a valid order number are prioritized.
                </p>
              </div>
            </div>
          </section>

          <ThemedSurface className="p-6 space-y-4">
            <h2 className="text-xl font-semibold text-base-content">Before you write</h2>
            <p className="leading-7 text-base-content/80">
              These pages solve most questions without waiting on a reply.
            </p>
            <ul className="space-y-2">
              {SELF_SERVE_LINKS.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="flex items-start justify-between gap-3 rounded-lg border border-base-300 bg-base-200/20 px-4 py-3 transition hover:border-primary/40 hover:bg-base-200/40"
                  >
                    <span>
                      <span className="font-medium text-base-content">{item.label}</span>
                      <span className="mt-0.5 block text-sm text-base-content/75">{item.blurb}</span>
                    </span>
                    <FiExternalLink className="mt-1 shrink-0 text-base-content/45" size={18} aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </ThemedSurface>

          <ThemedSurface className="p-6 space-y-3">
            <h2 className="text-xl font-semibold text-base-content">Direct email</h2>
            <p className="leading-7 text-base-content/80">
              Prefer email? Use the form for the fastest routing, or reach out directly:
            </p>
            <ul className="space-y-2 text-sm leading-7 text-base-content/80">
              <li className="flex flex-wrap items-center gap-2">
                <FiMail className="text-primary" size={16} aria-hidden />
                <strong className="text-base-content">Support:</strong>
                <a className="link link-primary" href="mailto:demo@infofunzies.com.mt">
                  demo@infofunzies.com.mt
                </a>
              </li>
              <li className="flex flex-wrap items-center gap-2">
                <FiMail className="text-primary" size={16} aria-hidden />
                <strong className="text-base-content">Corporate:</strong>
                <a className="link link-primary" href="mailto:corporate@funziescollection.com">
                  corporate@funziescollection.com
                </a>
              </li>
              <li className="flex flex-wrap items-center gap-2">
                <FiMail className="text-primary" size={16} aria-hidden />
                <strong className="text-base-content">Partnerships:</strong>
                <a className="link link-primary" href="mailto:partners@funziescollection.com">
                  partners@funziescollection.com
                </a>
              </li>
            </ul>
            <p className="text-sm leading-6 text-base-content/80">
              Accessibility feedback:{" "}
              <Link to="/accessibility" className="link link-primary">
                Accessibility
              </Link>
              .
            </p>
          </ThemedSurface>
        </div>

        <ThemedSurface className="p-6 md:p-8">
          {submitted ? (
            <div className="space-y-4">
              <div className="rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-success">
                <p className="font-semibold">Message received</p>
                <p className="mt-1 text-sm leading-6 opacity-90">
                  Thanks{form.name ? `, ${form.name}` : ""}. This demo does not send email yet, but your details are ready
                  to wire to your support inbox or ticket system.
                </p>
              </div>
              <button type="button" className="btn btn-outline btn-sm" onClick={handleSendAnother}>
                Send another message
              </button>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-base-content">Send us a message</h2>
                <p className="text-sm leading-6 text-base-content/80">
                  Include your <strong className="text-base-content">order number</strong> if this is about a purchase.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="form-control w-full">
                  <span className="label-text mb-1.5 text-sm font-medium text-base-content">Name</span>
                  <input
                    className="input input-bordered w-full"
                    type="text"
                    name="name"
                    required
                    autoComplete="name"
                    value={form.name}
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
                    autoComplete="email"
                    value={form.email}
                    onChange={handleChange}
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="form-control w-full">
                  <span className="label-text mb-1.5 text-sm font-medium text-base-content">Topic</span>
                  <select
                    className="select select-bordered w-full"
                    name="topic"
                    value={form.topic}
                    onChange={handleChange}
                  >
                    {TOPIC_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="form-control w-full">
                  <span className="label-text mb-1.5 text-sm font-medium text-base-content">Order number (optional)</span>
                  <input
                    className="input input-bordered w-full"
                    type="text"
                    name="orderNumber"
                    placeholder="e.g. FC-102938"
                    autoComplete="off"
                    value={form.orderNumber}
                    onChange={handleChange}
                  />
                </label>
              </div>

              <label className="form-control w-full">
                <span className="label-text mb-1.5 text-sm font-medium text-base-content">Message</span>
                <textarea
                  className="textarea textarea-bordered min-h-36 w-full"
                  name="message"
                  required
                  placeholder="Tell us what happened and what you need."
                  value={form.message}
                  onChange={handleChange}
                />
              </label>

              <div className="flex flex-wrap gap-3 pt-2">
                <button type="submit" className="btn btn-primary">
                  Send message
                </button>
                <Link to="/help-center" className="btn btn-outline">
                  Browse Help Center
                </Link>
              </div>
            </form>
          )}
        </ThemedSurface>
      </div>
    </AppLayout>
  );
}
