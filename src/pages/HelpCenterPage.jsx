import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronRight, FiHelpCircle, FiPackage, FiRotateCcw, FiSearch, FiShield, FiUser } from "react-icons/fi";
import { LuScale } from "react-icons/lu";
import AppLayout from "../components/AppLayout";
import ThemedSurface from "../components/ThemedSurface";
import SupportHelpSection from "../components/SupportHelpSection";
import { useTheme } from "../theme/themeContext";

const QUICK_TOPICS = [
  {
    to: "/shipping-information",
    title: "Shipping & delivery",
    blurb: "Processing times, tracking, carriers, and international notes.",
    icon: FiPackage,
  },
  {
    to: "/return-refund-policy",
    title: "Returns & refunds",
    blurb: "Eligibility, timelines, and how to start a return.",
    icon: FiRotateCcw,
  },
  {
    to: "/purchase-protection",
    title: "Purchase protection",
    blurb: "DOA coverage, secure checkout, and high-value order peace of mind.",
    icon: FiShield,
  },
  {
    to: "/trust-safety",
    title: "Trust & safety",
    blurb: "How we keep the marketplace legit and community-first.",
    icon: FiHelpCircle,
  },
  {
    to: "/account",
    title: "Account & orders",
    blurb: "Profile, sign-in, and order-related questions.",
    icon: FiUser,
  },
  {
    to: "/legal",
    title: "Legal center",
    blurb: "Policies, terms, and regulatory references in one place.",
    icon: LuScale,
  },
];

const FAQ_ITEMS = [
  {
    q: "Where is my order?",
    a: "Check your email for a shipping confirmation with tracking. Delivery estimates depend on your region and carrier. For full details, open Shipping & delivery.",
    tags: ["tracking", "ship", "delivery", "order status"],
  },
  {
    q: "Can I change my shipping address after I place an order?",
    a: "If your order has not shipped yet, contact us as soon as possible with your order number. Once a package is dispatched, the carrier may need to handle redirects.",
    tags: ["address", "change", "shipping"],
  },
  {
    q: "How do returns work?",
    a: "Most eligible items can be returned within the policy window if they meet condition and proof-of-purchase requirements. Start by reading Returns & refunds, then contact us for return authorization and next steps.",
    tags: ["return", "refund", "exchange"],
  },
  {
    q: "What if my item arrives damaged or defective?",
    a: "Reach out right away with your order number and photos if possible. We prioritize replacements and refunds for verified issues, including guidance in Purchase protection.",
    tags: ["damaged", "defect", "doa", "broken"],
  },
  {
    q: "Are products authentic?",
    a: "We focus on curated, trustworthy inventory and authorized sourcing where applicable. If you have a specific authenticity question, include the product link when you contact support.",
    tags: ["authentic", "fake", "real", "warranty"],
  },
  {
    q: "How do I reset my password?",
    a: "Use the Forgot password flow to request a secure reset link. If you do not receive an email, check spam filters and try again with the exact address on your account.",
    tags: ["password", "login", "account", "email"],
  },
  {
    q: "Do you ship internationally?",
    a: "We may ship to select regions depending on product restrictions and carrier coverage. International orders can include duties and taxes assessed by customs. See Shipping & delivery for the full picture.",
    tags: ["international", "customs", "duty", "tax"],
  },
  {
    q: "Who do I contact for accessibility help?",
    a: "Visit our Accessibility page for commitments and contact options. We aim to respond quickly to accessibility feedback.",
    tags: ["accessibility", "a11y", "screen reader"],
  },
];

function normalizeText(value) {
  return value.toLowerCase();
}

export default function HelpCenterPage() {
  const { colors, mode } = useTheme();
  const [query, setQuery] = useState("");
  const searchLikeTextColor = mode === "dark" ? "#1f2a36" : colors.text;
  const searchLikePlaceholderColor = mode === "dark" ? "#6b7280" : "#9ca3af";

  const filteredFaq = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      return FAQ_ITEMS;
    }
    const needle = normalizeText(trimmed);
    return FAQ_ITEMS.filter((item) => {
      const haystack = normalizeText(
        `${item.q} ${item.a} ${item.tags.join(" ")}`,
      );
      return haystack.includes(needle);
    });
  }, [query]);

  return (
    <AppLayout
      title="Help Center"
      description="Find answers fast, browse popular topics, and reach out only when you need a human."
    >
      <div className="grid gap-6">
        <section
          className="rounded-box border p-6 shadow md:p-8"
          style={{
            borderColor: `${colors.primary}33`,
            background: `linear-gradient(to bottom right, ${colors.primary}1a, ${colors.background}, ${colors.background})`,
          }}
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <p
                className="inline-flex rounded-full border px-3 py-1 text-xs font-semibold"
                style={{ backgroundColor: `${colors.background}cc`, borderColor: `${colors.primary}4d`, color: colors.primary }}
              >
                Self-serve first
              </p>
              <h2 className="text-2xl font-semibold text-base-content md:text-3xl">
                Search the knowledge base
              </h2>
              <p className="max-w-2xl leading-7 text-base-content/80">
                Type a keyword like &quot;tracking&quot;, &quot;return&quot;, or &quot;password&quot; to filter FAQs
                instantly.
              </p>
            </div>
            <div className="w-full max-w-md shrink-0">
              <label className="form-control w-full">
                <span className="sr-only">Search help articles</span>
                <div className="relative">
                  <FiSearch
                    className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2"
                    style={{ color: "#ef4444" }}
                    size={16}
                    aria-hidden
                  />
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Try: tracking, refund, authentic…"
                    className="help-center-search-input h-9 w-full rounded border p-0.5 pl-7 pr-2 text-sm outline-none"
                    style={{ borderColor: colors.primary, backgroundColor: colors.white, color: searchLikeTextColor }}
                    autoComplete="off"
                  />
                  <style>{`.help-center-search-input::placeholder { color: ${searchLikePlaceholderColor}; opacity: 1; }`}</style>
                </div>
              </label>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2 text-sm">
            <span className="text-base-content/60">Jump to:</span>
            <a href="#popular-topics" className="link" style={{ color: colors.primary }}>
              Popular topics
            </a>
            <span className="text-base-content/40">·</span>
            <a href="#faq" className="link" style={{ color: colors.primary }}>
              FAQ
            </a>
            <span className="text-base-content/40">·</span>
            <a href="#contact" className="link" style={{ color: colors.primary }}>
              Contact
            </a>
          </div>
        </section>

        <section id="popular-topics" className="scroll-mt-24 space-y-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-semibold text-base-content">Popular topics</h2>
            <p className="leading-7 text-base-content/80">
              The fastest fixes live here. Tap a card to open the full guide.
            </p>
          </div>

          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {QUICK_TOPICS.map((topic) => {
              const Icon = topic.icon;
              return (
                <li key={topic.to}>
                  <Link
                    to={topic.to}
                    className="group flex h-full gap-4 rounded-box border p-4 shadow-sm transition hover:shadow-md"
                    style={{ backgroundColor: colors.background, borderColor: `${colors.primary}4d` }}
                  >
                    <span
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${colors.primary}1a`, color: colors.primary }}
                    >
                      <Icon size={20} aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-base-content">{topic.title}</span>
                        <FiChevronRight className="mt-0.5 shrink-0 text-base-content/40" size={18} aria-hidden style={{ color: colors.primary }} />
                      </span>
                      <span className="mt-1 block text-sm leading-6 text-base-content/75">{topic.blurb}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="rounded-box border border-dashed p-4" style={{ borderColor: colors.border, backgroundColor: colors.panel }}>
            <p className="text-sm leading-6 text-base-content/80">
              <strong className="text-base-content">Tip:</strong> If your question is about privacy or terms, start at{" "}
              <Link to="/privacy" className="link" style={{ color: colors.primary }}>
                Privacy &amp; Terms
              </Link>{" "}
              or the{" "}
              <Link to="/legal" className="link" style={{ color: colors.primary }}>
                Legal center
              </Link>
              .
            </p>
          </div>
        </section>

        <section id="faq" className="scroll-mt-24 space-y-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-semibold text-base-content">FAQ</h2>
            <p className="leading-7 text-base-content/80">
              {filteredFaq.length === FAQ_ITEMS.length
                ? "Answers to the questions we see the most."
                : `${filteredFaq.length} result${filteredFaq.length === 1 ? "" : "s"} for your search.`}
            </p>
          </div>

          {filteredFaq.length === 0 ? (
            <ThemedSurface bordered className="p-6">
              <p className="leading-7 text-base-content/80">
                No matches yet. Try a shorter keyword, browse Popular topics above, or contact us below and include your
                order number for a faster reply.
              </p>
            </ThemedSurface>
          ) : (
            <div className="space-y-2">
              {filteredFaq.map((item) => (
                <details
                  key={item.q}
                  className="group rounded-box border shadow-sm open:shadow-md"
                  style={{ backgroundColor: colors.background, borderColor: colors.border }}
                >
                  <summary className="cursor-pointer list-none p-4 pr-12 font-medium text-base-content marker:hidden [&::-webkit-details-marker]:hidden">
                    <span className="relative block">
                      {item.q}
                      <FiChevronRight
                        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-base-content/45 transition group-open:rotate-90"
                        size={18}
                        aria-hidden
                      />
                    </span>
                  </summary>
                  <div className="border-t px-4 pb-4 pt-3" style={{ borderColor: colors.border }}>
                    <p className="leading-7 text-base-content/80">{item.a}</p>
                  </div>
                </details>
              ))}
            </div>
          )}
        </section>

        <section id="contact" className="scroll-mt-24">
          <SupportHelpSection showHelpCenterButton={false} />
        </section>
      </div>
    </AppLayout>
  );
}
