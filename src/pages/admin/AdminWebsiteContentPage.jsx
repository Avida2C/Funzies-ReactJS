import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AdminDataCell, AdminDataRow, AdminDataTable } from "../../components/admin/AdminDataTable";
import AdminApiBanner from "../../components/admin/AdminApiBanner";
import AdminModal from "../../components/admin/AdminModal";
import ThemedSurface from "../../components/ThemedSurface";
import ThemedTextField from "../../components/ThemedTextField";
import {
  COMPANY_OPENING_HOURS,
  COMPANY_SOCIAL_LINKS,
  COMPANY_STORE_CONTACT,
  FOOTER_PAYMENT_METHODS,
  FOOTER_SECURITY_CERTIFICATIONS,
} from "../../data/companyPageData";
import { useAdminTable } from "../../hooks/useAdminTable";
import { createRow, updateRow } from "../../lib/crudApi";
import { useTheme } from "../../theme/themeContext";
import { textStyles } from "../../theme/typography";
import AdminLayout from "./AdminLayout";

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

const DEFAULT_COMPANY_ABOUT = {
  mission:
    'Founded in [Year], Funzies Collection was built by gamers, for gamers. We realized that finding authentic gear, rare collectibles, and reliable hardware should not feel like a "boss fight." Our mission is to provide a curated, high-trust marketplace where every player can find their next favorite piece of loot.',
  why:
    'Because shopping should be fun. We have stripped away the "sus" listings and the bot-dominated drops to create a shop that feels like your favorite local gaming lounge - just on your phone.',
  partners:
    "We work with the biggest names in the industry to ensure that every product we sell is 100% authentic. We are an authorized reseller for major gaming peripherals and lifestyle brands.",
};

function normalizeJsonTextarea(value) {
  const parsed = safeJson(value);
  if (parsed == null) {
    throw new Error('Invalid JSON. Paste a valid JSON object like { "text": "..." }.');
  }
  return JSON.stringify(parsed, null, 2);
}

function normalizeJsonValue(value) {
  return JSON.stringify(value ?? null, null, 2);
}

function toNumberOr(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function splitLines(value) {
  return String(value ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

const CONTENT_EDITORS = [
  { key: "content.page.return_refund_policy", label: "Return & Refund Policy override", to: "/return-refund-policy" },
  { key: "content.page.shipping_information", label: "Shipping Information override", to: "/shipping-information" },
  { key: "content.page.purchase_protection", label: "Purchase Protection override", to: "/purchase-protection" },
  { key: "content.page.legal", label: "Legal Center override", to: "/legal" },
  { key: "content.page.trust_safety", label: "Trust & Safety override", to: "/trust-safety" },
  { key: "content.page.accessibility", label: "Accessibility override", to: "/accessibility" },
  { key: "content.page.privacy", label: "Privacy Policy override", to: "/privacy#privacy" },
  { key: "content.page.terms", label: "Terms of Use override", to: "/terms#terms" },
];

const KEY_COMPANY_ABOUT = "content.page.company_about";
const KEY_STORE_CONTACT = "content.company.store_contact";
const KEY_SOCIAL_LINKS = "content.company.social_links";
const KEY_OPENING_HOURS = "content.company.opening_hours";
const KEY_FOOTER_SECURITY = "content.footer.security_certifications";
const KEY_FOOTER_PAYMENTS = "content.footer.payment_methods";

export default function AdminWebsiteContentPage() {
  const { colors } = useTheme();
  const settingsApi = useAdminTable("settings");

  const [savingKey, setSavingKey] = useState(/** @type {string | null} */ (null));
  const [saveError, setSaveError] = useState(/** @type {Record<string, string>} */ ({}));
  const [draftByKey, setDraftByKey] = useState(/** @type {Record<string, string>} */ ({}));

  const [listModal, setListModal] = useState(
    /** @type {null | { key: string; mode: "create" | "edit"; index: number }} */ (null),
  );
  const [listDraft, setListDraft] = useState(/** @type {any} */ (null));
  const [contactDraft, setContactDraft] = useState(/** @type {any} */ (null));

  const rowByKey = useMemo(() => {
    // Admin fetches with `all=1`, so we can have multiple rows per Key.
    // Pick the latest *active* row (highest ID). If all are deleted, pick latest deleted.
    /** @type {Map<string, any>} */
    const m = new Map();
    for (const row of settingsApi.rows) {
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
      // Prefer active over deleted.
      if (bestDeleted && !deleted) {
        m.set(k, row);
        continue;
      }
      if (bestDeleted !== deleted) {
        continue;
      }
      if (id >= bestId) {
        m.set(k, row);
      }
    }
    return m;
  }, [settingsApi.rows]);

  const getDraft = (key) => {
    if (Object.prototype.hasOwnProperty.call(draftByKey, key)) return draftByKey[key];
    const existing = rowByKey.get(key);
    const value = existing?.Value == null ? "" : String(existing.Value);
    if (value.trim()) return value;
    return JSON.stringify({ text: "" }, null, 2);
  };

  const getDraftWithDefault = (key, defaultJson) => {
    if (Object.prototype.hasOwnProperty.call(draftByKey, key)) return draftByKey[key];
    const existing = rowByKey.get(key);
    const value = existing?.Value == null ? "" : String(existing.Value);
    if (value.trim()) return value;
    return String(defaultJson ?? "").trim() || JSON.stringify({ text: "" }, null, 2);
  };

  const setDraft = (key, value) => {
    setDraftByKey((prev) => ({ ...prev, [key]: value }));
  };

  const upsertJsonSetting = useCallback(
    async (key, value) => {
      setSavingKey(key);
      setSaveError((prev) => ({ ...prev, [key]: "" }));
      try {
        const normalized = normalizeJsonValue(value);
        const existing = rowByKey.get(key);
        const body = { Key: key, Value: normalized, Deleted: 0 };
        if (existing?.ID != null) {
          await updateRow("settings", existing.ID, body);
        } else {
          await createRow("settings", body);
        }
        await settingsApi.refresh();
        setDraftByKey((prev) => ({ ...prev, [key]: normalized }));
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Save failed";
        setSaveError((prev) => ({ ...prev, [key]: msg }));
      } finally {
        setSavingKey(null);
      }
    },
    [rowByKey, settingsApi],
  );

  const clearContactDraft = useCallback(() => setContactDraft(null), []);

  const getArraySetting = useCallback(
    (key, fallback) => {
      const row = rowByKey.get(key);
      const parsed = safeJson(row?.Value);
      if (Array.isArray(parsed)) return parsed;
      return fallback;
    },
    [rowByKey],
  );

  const footerSecurityList = useMemo(
    () => getArraySetting(KEY_FOOTER_SECURITY, FOOTER_SECURITY_CERTIFICATIONS),
    [getArraySetting],
  );
  const footerPaymentList = useMemo(
    () => getArraySetting(KEY_FOOTER_PAYMENTS, FOOTER_PAYMENT_METHODS),
    [getArraySetting],
  );
  const socialLinksList = useMemo(() => getArraySetting(KEY_SOCIAL_LINKS, COMPANY_SOCIAL_LINKS), [getArraySetting]);
  const openingHoursList = useMemo(() => getArraySetting(KEY_OPENING_HOURS, COMPANY_OPENING_HOURS), [getArraySetting]);

  const storeContactValue = useMemo(() => {
    const parsed = safeJson(rowByKey.get(KEY_STORE_CONTACT)?.Value);
    return parsed && typeof parsed === "object" ? parsed : COMPANY_STORE_CONTACT;
  }, [rowByKey]);

  const storeContactForm = useMemo(() => {
    if (contactDraft != null) return contactDraft;
    return {
      address: String(storeContactValue?.address ?? ""),
      phone: String(storeContactValue?.phone ?? ""),
      email: String(storeContactValue?.email ?? ""),
      mapSearchQuery: String(storeContactValue?.mapSearchQuery ?? ""),
    };
  }, [contactDraft, storeContactValue]);

  const openCreateListItem = useCallback((key) => {
    setListModal({ key, mode: "create", index: -1 });
    if (key === KEY_SOCIAL_LINKS) {
      setListDraft({ id: "facebook", name: "", href: "" });
    } else if (key === KEY_OPENING_HOURS) {
      setListDraft({ day: "", hours: "" });
    } else {
      setListDraft({ label: "", src: "", width: 39 });
    }
  }, []);

  const openEditListItem = useCallback(
    (key, index, item) => {
      setListModal({ key, mode: "edit", index });
      setListDraft(JSON.parse(JSON.stringify(item ?? null)));
    },
    [],
  );

  const saveListItem = useCallback(async () => {
    if (!listModal) return;
    const { key, mode, index } = listModal;
    const current =
      key === KEY_FOOTER_PAYMENTS
          ? footerPaymentList
          : key === KEY_FOOTER_SECURITY
            ? footerSecurityList
            : key === KEY_SOCIAL_LINKS
              ? socialLinksList
              : openingHoursList;

    const next = [...current];
    if (key === KEY_SOCIAL_LINKS) {
      const item = {
        id: String(listDraft?.id ?? "").trim(),
        name: String(listDraft?.name ?? "").trim(),
        href: String(listDraft?.href ?? "").trim(),
      };
      if (!item.id) throw new Error("Social id is required (facebook/x/instagram).");
      if (!item.name) throw new Error("Social name is required.");
      if (!item.href) throw new Error("Social URL is required.");
      if (mode === "create") next.push(item);
      else next[index] = item;
    } else if (key === KEY_OPENING_HOURS) {
      const item = {
        day: String(listDraft?.day ?? "").trim(),
        hours: String(listDraft?.hours ?? "").trim(),
      };
      if (!item.day) throw new Error("Day is required.");
      if (!item.hours) throw new Error("Hours is required.");
      if (mode === "create") next.push(item);
      else next[index] = item;
    } else {
      const item = {
        label: String(listDraft?.label ?? "").trim(),
        src: String(listDraft?.src ?? "").trim(),
        width: Math.max(1, Math.round(toNumberOr(listDraft?.width, 39))),
      };
      if (!item.label) throw new Error("Label is required.");
      if (!item.src) throw new Error("Image URL is required.");
      if (mode === "create") next.push(item);
      else next[index] = item;
    }

    await upsertJsonSetting(key, next);
    setListModal(null);
  }, [listModal, listDraft, footerPaymentList, footerSecurityList, socialLinksList, openingHoursList, upsertJsonSetting]);

  const deleteListItem = useCallback(
    async (key, index) => {
      const current =
        key === KEY_FOOTER_PAYMENTS
            ? footerPaymentList
            : key === KEY_FOOTER_SECURITY
              ? footerSecurityList
              : key === KEY_SOCIAL_LINKS
                ? socialLinksList
                : openingHoursList;
      const next = current.filter((_, i) => i !== index);
      await upsertJsonSetting(key, next);
    },
    [footerPaymentList, footerSecurityList, socialLinksList, openingHoursList, upsertJsonSetting],
  );

  const upsertSetting = useCallback(
    async (key) => {
      setSavingKey(key);
      setSaveError((prev) => ({ ...prev, [key]: "" }));
      try {
        const normalized = normalizeJsonTextarea(getDraft(key));
        const existing = rowByKey.get(key);
        const body = { Key: key, Value: normalized, Deleted: 0 };
        if (existing?.ID != null) {
          await updateRow("settings", existing.ID, body);
        } else {
          await createRow("settings", body);
        }
        await settingsApi.refresh();
        setDraftByKey((prev) => ({ ...prev, [key]: normalized }));
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Save failed";
        setSaveError((prev) => ({ ...prev, [key]: msg }));
      } finally {
        setSavingKey(null);
      }
    },
    [rowByKey, settingsApi],
  );

  const companyAboutJson = useMemo(() => JSON.stringify(DEFAULT_COMPANY_ABOUT, null, 2), []);

  return (
    <AdminLayout
      title="Website content"
      description="Update website copy and static content. Policy pages support JSON overrides via `api → settings`."
    >
      {settingsApi.error ? <AdminApiBanner error={settingsApi.error} entityLabel="settings (API)" /> : null}

      <ThemedSurface bordered className="p-4 sm:p-5">
        <h2 className="text-lg font-semibold" style={{ ...textStyles.sectionTitle, color: colors.text }}>
          Page overrides (JSON in API)
        </h2>
        <p className="mt-1" style={{ ...textStyles.bodySm, color: colors.text, opacity: 0.8 }}>
          Each editor saves JSON like <code className="rounded px-1">{`{ "text": "..." }`}</code>. If the JSON is empty, the
          page falls back to the built-in accordion content.
        </p>

        <div className="mt-4 grid gap-4">
          {CONTENT_EDITORS.map((item) => (
            <ThemedSurface key={item.key} bordered className="p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold" style={{ ...textStyles.body, color: colors.text }}>
                    {item.label}
                  </p>
                  <p style={{ ...textStyles.bodySm, color: colors.text, opacity: 0.75 }}>
                    Setting key: <code className="rounded px-1">{item.key}</code>
                  </p>
                </div>
                <Link to={item.to} target="_blank" rel="noreferrer" className="underline" style={{ color: colors.primary }}>
                  Open page
                </Link>
              </div>

              {saveError[item.key] ? (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{saveError[item.key]}</p>
              ) : null}

              <ThemedTextField
                className="mt-3"
                size="sm"
                label="JSON"
                multiline
                rows={8}
                value={getDraft(item.key)}
                onChange={(e) => setDraft(item.key, e.target.value)}
                helperText='Tip: keep everything inside { "text": "..." }.'
              />

              <div className="mt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  className="rounded border px-3 py-1.5 text-sm font-medium"
                  style={{ borderColor: colors.primary, color: colors.background, backgroundColor: colors.primary }}
                  onClick={() => upsertSetting(item.key)}
                  disabled={!!settingsApi.error || savingKey === item.key}
                >
                  {savingKey === item.key ? "Saving…" : "Save"}
                </button>
              </div>
            </ThemedSurface>
          ))}
        </div>
      </ThemedSurface>

      <ThemedSurface bordered className="p-4 sm:p-5">
        <h2 className="text-lg font-semibold" style={{ ...textStyles.sectionTitle, color: colors.text }}>
          Company + footer content (JSON in API)
        </h2>
        <p className="mt-1" style={{ ...textStyles.bodySm, color: colors.text, opacity: 0.8 }}>
          These keys already drive the Company page and site footer. Paste JSON and click Save.
        </p>

        <div className="mt-4 grid gap-4">
          {[
            {
              key: KEY_COMPANY_ABOUT,
              label: "Company: about copy (mission / why / partners) JSON",
              to: "/company",
              defaultJson: companyAboutJson,
            },
          ].map((item) => (
            <ThemedSurface key={item.key} bordered className="p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold" style={{ ...textStyles.body, color: colors.text }}>
                    {item.label}
                  </p>
                  <p style={{ ...textStyles.bodySm, color: colors.text, opacity: 0.75 }}>
                    Setting key: <code className="rounded px-1">{item.key}</code>
                  </p>
                </div>
                <Link to={item.to} target="_blank" rel="noreferrer" className="underline" style={{ color: colors.primary }}>
                  Open page
                </Link>
              </div>

              {saveError[item.key] ? (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{saveError[item.key]}</p>
              ) : null}

              <ThemedTextField
                className="mt-3"
                size="sm"
                label="JSON"
                multiline
                rows={8}
                value={getDraftWithDefault(item.key, item.defaultJson)}
                onChange={(e) => setDraft(item.key, e.target.value)}
              />

              <div className="mt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  className="rounded border px-3 py-1.5 text-sm font-medium"
                  style={{ borderColor: colors.primary, color: colors.background, backgroundColor: colors.primary }}
                  onClick={() => upsertSetting(item.key)}
                  disabled={!!settingsApi.error || savingKey === item.key}
                >
                  {savingKey === item.key ? "Saving…" : "Save"}
                </button>
              </div>
            </ThemedSurface>
          ))}
        </div>
      </ThemedSurface>

      <ThemedSurface bordered className="p-4 sm:p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold" style={{ ...textStyles.sectionTitle, color: colors.text }}>
            Store address & contact details — API editable
          </h2>
          <button
            type="button"
            className="rounded border px-3 py-1.5 text-sm font-medium"
            style={{ borderColor: colors.primary, color: colors.background, backgroundColor: colors.primary }}
            onClick={async () => {
              await upsertJsonSetting(KEY_STORE_CONTACT, storeContactForm);
              clearContactDraft();
            }}
            disabled={!!settingsApi.error || savingKey === KEY_STORE_CONTACT}
          >
            {savingKey === KEY_STORE_CONTACT ? "Saving…" : "Save"}
          </button>
        </div>
        <p className="mt-1" style={{ ...textStyles.bodySm, color: colors.text, opacity: 0.8 }}>
          Stored in <code className="rounded px-1">api → settings</code> key <code className="rounded px-1">{KEY_STORE_CONTACT}</code>.
        </p>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <ThemedTextField
            size="sm"
            label="Address"
            value={storeContactForm.address}
            onChange={(e) => setContactDraft((prev) => ({ ...(prev ?? storeContactForm), address: e.target.value }))}
            multiline
            rows={3}
          />
          <ThemedTextField
            size="sm"
            label="Map search query"
            value={storeContactForm.mapSearchQuery}
            onChange={(e) => setContactDraft((prev) => ({ ...(prev ?? storeContactForm), mapSearchQuery: e.target.value }))}
            multiline
            rows={3}
          />
          <ThemedTextField
            size="sm"
            label="Phone"
            value={storeContactForm.phone}
            onChange={(e) => setContactDraft((prev) => ({ ...(prev ?? storeContactForm), phone: e.target.value }))}
          />
          <ThemedTextField
            size="sm"
            label="Email"
            value={storeContactForm.email}
            onChange={(e) => setContactDraft((prev) => ({ ...(prev ?? storeContactForm), email: e.target.value }))}
          />
        </div>
      </ThemedSurface>

      <ThemedSurface bordered className="p-4 sm:p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold" style={{ ...textStyles.sectionTitle, color: colors.text }}>
            Funzies socials — API editable
          </h2>
          <button
            type="button"
            className="rounded border px-3 py-1.5 text-sm font-medium"
            style={{ borderColor: colors.primary, color: colors.background, backgroundColor: colors.primary }}
            onClick={() => openCreateListItem(KEY_SOCIAL_LINKS)}
            disabled={!!settingsApi.error}
          >
            + Add social
          </button>
        </div>
        <AdminDataTable
          caption={`${socialLinksList.length} link(s)`}
          columns={[
            { id: "id", label: "Id" },
            { id: "n", label: "Name" },
            { id: "h", label: "URL" },
            { id: "act", label: "" },
          ]}
        >
          {socialLinksList.map((row, idx) => (
            <AdminDataRow key={`${row.id}-${idx}`}>
              <AdminDataCell className="whitespace-nowrap font-mono text-sm">{row.id}</AdminDataCell>
              <AdminDataCell className="font-medium">{row.name}</AdminDataCell>
              <AdminDataCell className="max-w-md break-all text-sm">{row.href}</AdminDataCell>
              <AdminDataCell className="whitespace-nowrap">
                <div className="flex flex-col gap-1 sm:flex-row sm:gap-2">
                  <button
                    type="button"
                    className="text-left text-sm underline"
                    style={{ color: colors.primary }}
                    onClick={() => openEditListItem(KEY_SOCIAL_LINKS, idx, row)}
                    disabled={!!settingsApi.error}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="text-left text-sm underline opacity-90"
                    style={{ color: colors.text }}
                    onClick={() => deleteListItem(KEY_SOCIAL_LINKS, idx)}
                    disabled={!!settingsApi.error}
                  >
                    Delete
                  </button>
                </div>
              </AdminDataCell>
            </AdminDataRow>
          ))}
        </AdminDataTable>
      </ThemedSurface>

      <ThemedSurface bordered className="p-4 sm:p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold" style={{ ...textStyles.sectionTitle, color: colors.text }}>
            Opening hours — API editable
          </h2>
          <button
            type="button"
            className="rounded border px-3 py-1.5 text-sm font-medium"
            style={{ borderColor: colors.primary, color: colors.background, backgroundColor: colors.primary }}
            onClick={() => openCreateListItem(KEY_OPENING_HOURS)}
            disabled={!!settingsApi.error}
          >
            + Add day
          </button>
        </div>
        <AdminDataTable
          caption={`${openingHoursList.length} row(s)`}
          columns={[
            { id: "d", label: "Day" },
            { id: "h", label: "Hours" },
            { id: "act", label: "" },
          ]}
        >
          {openingHoursList.map((row, idx) => (
            <AdminDataRow key={`${row.day}-${idx}`}>
              <AdminDataCell className="font-medium">{row.day}</AdminDataCell>
              <AdminDataCell className="text-sm">{row.hours}</AdminDataCell>
              <AdminDataCell className="whitespace-nowrap">
                <div className="flex flex-col gap-1 sm:flex-row sm:gap-2">
                  <button
                    type="button"
                    className="text-left text-sm underline"
                    style={{ color: colors.primary }}
                    onClick={() => openEditListItem(KEY_OPENING_HOURS, idx, row)}
                    disabled={!!settingsApi.error}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="text-left text-sm underline opacity-90"
                    style={{ color: colors.text }}
                    onClick={() => deleteListItem(KEY_OPENING_HOURS, idx)}
                    disabled={!!settingsApi.error}
                  >
                    Delete
                  </button>
                </div>
              </AdminDataCell>
            </AdminDataRow>
          ))}
        </AdminDataTable>
      </ThemedSurface>

      <ThemedSurface bordered className="p-4 sm:p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold" style={{ ...textStyles.sectionTitle, color: colors.text }}>
            Security certifications (footer) — API editable
          </h2>
          <button
            type="button"
            className="rounded border px-3 py-1.5 text-sm font-medium"
            style={{ borderColor: colors.primary, color: colors.background, backgroundColor: colors.primary }}
            onClick={() => openCreateListItem(KEY_FOOTER_SECURITY)}
            disabled={!!settingsApi.error}
          >
            + Add badge
          </button>
        </div>
        <AdminDataTable
          caption={`${footerSecurityList.length} badge(s)`}
          columns={[
            { id: "preview", label: "Preview" },
            { id: "label", label: "Label" },
            { id: "w", label: "Width (px)" },
            { id: "src", label: "Image URL" },
            { id: "act", label: "" },
          ]}
        >
          {footerSecurityList.map((row, idx) => (
            <AdminDataRow key={`${row.label}-${idx}`}>
              <AdminDataCell>
                <img
                  src={row.src}
                  alt=""
                  className="h-[25px] max-w-[40px] object-contain"
                  style={{ width: `${Math.min(row.width, 40)}px` }}
                  loading="lazy"
                />
              </AdminDataCell>
              <AdminDataCell className="text-sm font-medium">{row.label}</AdminDataCell>
              <AdminDataCell className="whitespace-nowrap font-mono text-sm">{row.width}</AdminDataCell>
              <AdminDataCell className="max-w-xs break-all font-mono text-xs sm:max-w-md">{row.src}</AdminDataCell>
              <AdminDataCell className="whitespace-nowrap">
                <div className="flex flex-col gap-1 sm:flex-row sm:gap-2">
                  <button
                    type="button"
                    className="text-left text-sm underline"
                    style={{ color: colors.primary }}
                    onClick={() => openEditListItem(KEY_FOOTER_SECURITY, idx, row)}
                    disabled={!!settingsApi.error}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="text-left text-sm underline opacity-90"
                    style={{ color: colors.text }}
                    onClick={() => deleteListItem(KEY_FOOTER_SECURITY, idx)}
                    disabled={!!settingsApi.error}
                  >
                    Delete
                  </button>
                </div>
              </AdminDataCell>
            </AdminDataRow>
          ))}
        </AdminDataTable>
      </ThemedSurface>

      <ThemedSurface bordered className="p-4 sm:p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold" style={{ ...textStyles.sectionTitle, color: colors.text }}>
            Payment methods (footer) — API editable
          </h2>
          <button
            type="button"
            className="rounded border px-3 py-1.5 text-sm font-medium"
            style={{ borderColor: colors.primary, color: colors.background, backgroundColor: colors.primary }}
            onClick={() => openCreateListItem(KEY_FOOTER_PAYMENTS)}
            disabled={!!settingsApi.error}
          >
            + Add method
          </button>
        </div>
        <AdminDataTable
          caption={`${footerPaymentList.length} method(s)`}
          columns={[
            { id: "preview", label: "Preview" },
            { id: "label", label: "Label" },
            { id: "w", label: "Width (px)" },
            { id: "src", label: "Image URL" },
            { id: "act", label: "" },
          ]}
        >
          {footerPaymentList.map((row, idx) => (
            <AdminDataRow key={`${row.label}-${idx}`}>
              <AdminDataCell>
                <img
                  src={row.src}
                  alt=""
                  className="h-[26px] max-w-[40px] object-contain"
                  style={{ width: `${Math.min(row.width, 40)}px` }}
                  loading="lazy"
                />
              </AdminDataCell>
              <AdminDataCell className="text-sm font-medium">{row.label}</AdminDataCell>
              <AdminDataCell className="whitespace-nowrap font-mono text-sm">{row.width}</AdminDataCell>
              <AdminDataCell className="max-w-xs break-all font-mono text-xs sm:max-w-md">{row.src}</AdminDataCell>
              <AdminDataCell className="whitespace-nowrap">
                <div className="flex flex-col gap-1 sm:flex-row sm:gap-2">
                  <button
                    type="button"
                    className="text-left text-sm underline"
                    style={{ color: colors.primary }}
                    onClick={() => openEditListItem(KEY_FOOTER_PAYMENTS, idx, row)}
                    disabled={!!settingsApi.error}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="text-left text-sm underline opacity-90"
                    style={{ color: colors.text }}
                    onClick={() => deleteListItem(KEY_FOOTER_PAYMENTS, idx)}
                    disabled={!!settingsApi.error}
                  >
                    Delete
                  </button>
                </div>
              </AdminDataCell>
            </AdminDataRow>
          ))}
        </AdminDataTable>
      </ThemedSurface>

      {/* Removed read-only default JSON blocks; now editable above via API-backed controls. */}

      {/* Removed read-only footer/careers tables; now editable above via API-backed lists. */}

      <AdminModal
        open={listModal != null}
        onClose={() => {
          if (!savingKey) setListModal(null);
        }}
        title={listModal?.mode === "create" ? "New item" : "Edit item"}
        size="lg"
        footer={
          <>
            <button
              type="button"
              className="rounded border px-3 py-1.5"
              style={{ borderColor: colors.border, color: colors.text, backgroundColor: colors.background }}
              onClick={() => setListModal(null)}
              disabled={!!savingKey}
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded border px-3 py-1.5 font-medium"
              style={{ borderColor: colors.primary, color: colors.background, backgroundColor: colors.primary }}
              onClick={() => saveListItem().catch((e) => window.alert(e instanceof Error ? e.message : "Save failed"))}
              disabled={!!savingKey || !!settingsApi.error}
            >
              {savingKey ? "Saving…" : "Save"}
            </button>
          </>
        }
      >
        {listModal?.key === KEY_SOCIAL_LINKS ? (
          <div className="grid gap-3">
            <ThemedTextField
              size="sm"
              label="Id"
              value={String(listDraft?.id ?? "")}
              onChange={(e) => setListDraft((prev) => ({ ...(prev ?? {}), id: e.target.value }))}
              helperText="Must be facebook, x, or instagram unless you add icons in the layout."
              required
            />
            <ThemedTextField
              size="sm"
              label="Name"
              value={String(listDraft?.name ?? "")}
              onChange={(e) => setListDraft((prev) => ({ ...(prev ?? {}), name: e.target.value }))}
              required
            />
            <ThemedTextField
              size="sm"
              label="URL"
              value={String(listDraft?.href ?? "")}
              onChange={(e) => setListDraft((prev) => ({ ...(prev ?? {}), href: e.target.value }))}
              required
            />
          </div>
        ) : listModal?.key === KEY_OPENING_HOURS ? (
          <div className="grid gap-3">
            <ThemedTextField
              size="sm"
              label="Day"
              value={String(listDraft?.day ?? "")}
              onChange={(e) => setListDraft((prev) => ({ ...(prev ?? {}), day: e.target.value }))}
              required
            />
            <ThemedTextField
              size="sm"
              label="Hours"
              value={String(listDraft?.hours ?? "")}
              onChange={(e) => setListDraft((prev) => ({ ...(prev ?? {}), hours: e.target.value }))}
              helperText='Examples: "9:00 - 19:00" or "Closed"'
              required
            />
          </div>
        ) : (
          <div className="grid gap-3">
            <ThemedTextField
              size="sm"
              label="Label"
              value={String(listDraft?.label ?? "")}
              onChange={(e) => setListDraft((prev) => ({ ...(prev ?? {}), label: e.target.value }))}
              required
            />
            <ThemedTextField
              size="sm"
              label="Image URL"
              value={String(listDraft?.src ?? "")}
              onChange={(e) => setListDraft((prev) => ({ ...(prev ?? {}), src: e.target.value }))}
              required
            />
            <ThemedTextField
              size="sm"
              type="number"
              label="Width (px)"
              value={String(listDraft?.width ?? 39)}
              onChange={(e) => setListDraft((prev) => ({ ...(prev ?? {}), width: e.target.value }))}
              min={1}
              step={1}
            />
          </div>
        )}
      </AdminModal>
    </AdminLayout>
  );
}

