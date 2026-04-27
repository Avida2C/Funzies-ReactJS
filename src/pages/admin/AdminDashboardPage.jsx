import { Link } from "react-router-dom";
import { FiArrowRight, FiBriefcase, FiFileText, FiLayers, FiMessageCircle, FiPackage, FiSettings, FiShoppingCart, FiUser } from "react-icons/fi";
import AdminApiBanner from "../../components/admin/AdminApiBanner";
import AdminQuickAccessCards from "../../components/admin/AdminQuickAccessCards";
import ThemedSurface from "../../components/ThemedSurface";
import { getAdminReviewDisplayStats } from "../../data/productReviews";
import { useAdminTable } from "../../hooks/useAdminTable";
import { CAREERS_OPEN_ROLES_KEY } from "../../hooks/useCareersRoles";
import { getAdminDashboardStats, formatEurValue } from "../../lib/funziesDataset";
import { useTheme } from "../../theme/themeContext";
import { textStyles } from "../../theme/typography";
import AdminLayout from "./AdminLayout";

const CONTENT_OVERRIDE_KEYS = [
  "content.page.return_refund_policy",
  "content.page.shipping_information",
  "content.page.purchase_protection",
  "content.page.legal",
  "content.page.trust_safety",
  "content.page.accessibility",
  "content.page.privacy",
  "content.page.terms",
  "content.page.company_about",
];

const KEY_STORE_CONTACT = "content.company.store_contact";
const KEY_SOCIAL_LINKS = "content.company.social_links";
const KEY_OPENING_HOURS = "content.company.opening_hours";
const KEY_FOOTER_SECURITY = "content.footer.security_certifications";
const KEY_FOOTER_PAYMENTS = "content.footer.payment_methods";

function safeJson(value) {
  if (value == null) return null;
  const s = String(value).trim();
  if (!s) return null;
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}

function pickLatestActiveRowByKey(rows) {
  /** @type {Map<string, any>} */
  const m = new Map();
  for (const row of rows) {
    const k = String(row?.Key ?? "");
    if (!k) continue;
    const id = Number(row?.ID ?? row?.id ?? 0) || 0;
    const deleted = Number(row?.Deleted ?? row?.deleted ?? 0) === 1;
    const best = m.get(k);
    if (!best) {
      m.set(k, row);
      continue;
    }
    const bestId = Number(best?.ID ?? best?.id ?? 0) || 0;
    const bestDeleted = Number(best?.Deleted ?? best?.deleted ?? 0) === 1;
    if (bestDeleted && !deleted) {
      m.set(k, row);
      continue;
    }
    if (bestDeleted !== deleted) continue;
    if (id >= bestId) m.set(k, row);
  }
  return m;
}

const statSections = (stats, review) => {
  return [
    {
      title: "Sales & orders",
      items: [
        { label: "Orders today (active orders)", value: String(stats.ordersToday) },
        { label: "Revenue (all line items, active orders)", value: formatEurValue(stats.revenueEur) },
        { label: "Open orders (not deleted)", value: String(stats.openOrderCount) },
      ],
    },
    {
      title: "Catalog & stock",
      items: [
        { label: "Active product SKUs", value: String(stats.productCount) },
        { label: "Brands in use", value: String(stats.activeBrands) },
        { label: "Categories", value: String(stats.activeCategories) },
        { label: "Low stock (stock < 5)", value: String(stats.lowStock) },
      ],
    },
    {
      title: "People & reviews",
      items: [
        { label: "Active user accounts", value: String(stats.activeUserCount) },
        { label: "New users (last 30 days)", value: String(stats.newUsers) },
        { label: "Review rows (all active products)", value: String(review.totalRows) },
        { label: "Products with custom review copy", value: String(review.customProductCount) },
      ],
    },
  ];
};

const quickLinks = [
  { to: "/admin/products", label: "Products", blurb: "Active SKUs, low stock, pricing", icon: FiPackage },
  { to: "/admin/catalog", label: "Catalog", blurb: "Brands, categories, merchandising", icon: FiLayers },
  { to: "/admin/orders", label: "Orders", blurb: "Revenue, order lines, statuses", icon: FiShoppingCart },
  { to: "/admin/users", label: "Users", blurb: "Sign-ups, roles, accounts", icon: FiUser },
  { to: "/admin/reviews", label: "Reviews", blurb: "Status, template vs custom", icon: FiMessageCircle },
  { to: "/admin/website-content", label: "Website content", blurb: "Company, footer, policy pages", icon: FiFileText },
  { to: "/admin/careers", label: "Careers", blurb: "Open roles shown on site", icon: FiBriefcase },
  { to: "/admin/settings", label: "Data & settings", blurb: "Roles, moderation statuses", icon: FiSettings },
];

export default function AdminDashboardPage() {
  const { colors } = useTheme();
  const stats = getAdminDashboardStats();
  const review = getAdminReviewDisplayStats();
  const sections = statSections(stats, review);
  const settingsApi = useAdminTable("settings");
  const settingsByKey = pickLatestActiveRowByKey(settingsApi.rows);

  const contentStats = (() => {
    const getArrayLen = (key) => {
      const parsed = safeJson(settingsByKey.get(key)?.Value);
      return Array.isArray(parsed) ? parsed.length : 0;
    };
    const getObjectExists = (key) => {
      const parsed = safeJson(settingsByKey.get(key)?.Value);
      return parsed && typeof parsed === "object" ? 1 : 0;
    };
    const countOverrides = () => {
      let n = 0;
      for (const k of CONTENT_OVERRIDE_KEYS) {
        const row = settingsByKey.get(k);
        if (!row) continue;
        if (Number(row?.Deleted ?? row?.deleted ?? 0) === 1) continue;
        const raw = String(row?.Value ?? "").trim();
        if (!raw) continue;
        const parsed = safeJson(raw);
        if (parsed && typeof parsed === "object" && typeof parsed.text === "string") {
          if (parsed.text.trim()) n += 1;
        } else {
          n += 1;
        }
      }
      return n;
    };

    return {
      footerSecurityCount: getArrayLen(KEY_FOOTER_SECURITY),
      footerPaymentCount: getArrayLen(KEY_FOOTER_PAYMENTS),
      companySocialCount: getArrayLen(KEY_SOCIAL_LINKS),
      companyOpeningHoursCount: getArrayLen(KEY_OPENING_HOURS),
      companyContactConfigured: getObjectExists(KEY_STORE_CONTACT),
      careersRoleCount: getArrayLen(CAREERS_OPEN_ROLES_KEY),
      overridesSetCount: countOverrides(),
    };
  })();

  const statusLine = (() => {
    const parts = Object.entries(review.byStatus);
    if (!parts.length) {
      return null;
    }
    const sorted = parts.sort((a, b) => b[1] - a[1]);
    return sorted.map(([k, n]) => `${k}: ${n}`).join(" · ");
  })();

  return (
    <AdminLayout
      title="Admin dashboard"
      description="Analytics snapshot + content health checks. Commerce stats follow funziesData rules (active records, 30-day window for new users). Review counts follow the same rules as the Reviews table."
    >
      <div className="space-y-8">
        {settingsApi.error ? <AdminApiBanner error={settingsApi.error} entityLabel="settings (API)" /> : null}

        <div>
          <h2
            className="mb-3"
            style={{
              ...textStyles.sectionTitle,
              color: colors.primary,
              fontSize: "0.7rem",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            Quick Access
          </h2>
          <AdminQuickAccessCards items={quickLinks} columnsMobile={3} columnsSm={2} columnsLg={3} />
        </div>

        {statusLine ? (
          <ThemedSurface bordered className="p-4">
            <p className="font-medium" style={{ ...textStyles.bodySm, color: colors.text }}>
              Review status mix (all rows)
            </p>
            <p className="mt-1" style={{ ...textStyles.bodySm, color: colors.text, opacity: 0.85 }}>
              {statusLine}
            </p>
          </ThemedSurface>
        ) : null}

        <div>
          <h2
            className="mb-3"
            style={{
              ...textStyles.sectionTitle,
              color: colors.primary,
              fontSize: "0.7rem",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            Website content (API)
          </h2>
          <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <ThemedSurface bordered className="p-4">
              <p style={{ ...textStyles.bodySm, color: colors.text, opacity: 0.72 }}>Footer security badges</p>
              <p className="mt-1 text-xl font-semibold sm:text-2xl" style={{ color: colors.text }}>
                {settingsApi.loading ? "…" : String(contentStats.footerSecurityCount)}
              </p>
            </ThemedSurface>
            <ThemedSurface bordered className="p-4">
              <p style={{ ...textStyles.bodySm, color: colors.text, opacity: 0.72 }}>Footer payment methods</p>
              <p className="mt-1 text-xl font-semibold sm:text-2xl" style={{ color: colors.text }}>
                {settingsApi.loading ? "…" : String(contentStats.footerPaymentCount)}
              </p>
            </ThemedSurface>
            <ThemedSurface bordered className="p-4">
              <p style={{ ...textStyles.bodySm, color: colors.text, opacity: 0.72 }}>Careers open roles</p>
              <p className="mt-1 text-xl font-semibold sm:text-2xl" style={{ color: colors.text }}>
                {settingsApi.loading ? "…" : String(contentStats.careersRoleCount)}
              </p>
            </ThemedSurface>
            <ThemedSurface bordered className="p-4">
              <p style={{ ...textStyles.bodySm, color: colors.text, opacity: 0.72 }}>Policy/company overrides set</p>
              <p className="mt-1 text-xl font-semibold sm:text-2xl" style={{ color: colors.text }}>
                {settingsApi.loading ? "…" : String(contentStats.overridesSetCount)}
              </p>
            </ThemedSurface>
          </section>
          <p className="mt-2" style={{ ...textStyles.bodySm, color: colors.text, opacity: 0.72 }}>
            Company contact configured:{" "}
            <strong style={{ color: colors.text }}>{settingsApi.loading ? "…" : contentStats.companyContactConfigured ? "Yes" : "No"}</strong>
            {" · "}
            Social links:{" "}
            <strong style={{ color: colors.text }}>{settingsApi.loading ? "…" : String(contentStats.companySocialCount)}</strong>
            {" · "}
            Opening hours rows:{" "}
            <strong style={{ color: colors.text }}>{settingsApi.loading ? "…" : String(contentStats.companyOpeningHoursCount)}</strong>
          </p>
        </div>

        {sections.map((section) => (
          <div key={section.title}>
            <h2
              className="mb-3"
              style={{
                ...textStyles.sectionTitle,
                color: colors.primary,
                fontSize: "0.7rem",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              {section.title}
            </h2>
            <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {section.items.map((item) => (
                <ThemedSurface key={item.label} bordered className="p-4">
                  <p style={{ ...textStyles.bodySm, color: colors.text, opacity: 0.72 }}>{item.label}</p>
                  <p className="mt-1 text-xl font-semibold sm:text-2xl" style={{ color: colors.text }}>
                    {item.value}
                  </p>
                </ThemedSurface>
              ))}
            </section>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
