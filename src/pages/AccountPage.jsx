import { useEffect, useMemo, useState } from "react";
import { FiUser } from "react-icons/fi";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { City, Country } from "country-state-city";
import AppLayout from "../components/AppLayout";
import ThemedButton from "../components/ThemedButton";
import ThemedCheckbox from "../components/ThemedCheckbox";
import ThemedTextBox from "../components/ThemedTextBox";
import { textStyles } from "../theme/typography";
import { useTheme } from "../theme/themeContext";
import { getInitialIsAuthenticated, useAuth } from "../lib/authContext";
import { allAddresses, allOrders, allUsers, computeOrderSubtotalEur, formatEurValue, orderStatusById } from "../lib/funziesDataset";
import { createRow, deleteRow, listTable, updateRow } from "../lib/crudApi";
import { InfoCard, ReadOnlyField, SectionHeader } from "./account/AccountSectionPrimitives";
import ProfileOverviewSection from "./account/sections/ProfileOverviewSection";
import AccountSettingsSection from "./account/sections/AccountSettingsSection";
import PreferencesTabSection from "./account/sections/PreferencesTabSection";
import AddressesSection from "./account/sections/AddressesSection";
import OrdersReturnsSection from "./account/sections/OrdersReturnsSection";

/** Slugs for `?tab=` — shareable deep links, e.g. /account?tab=addresses */
const ACCOUNT_TABS = [
  { id: "profile", label: "Profile Overview" },
  { id: "settings", label: "Account Settings" },
  { id: "preferences", label: "Preferences" },
  { id: "addresses", label: "Addresses" },
  { id: "orders", label: "Orders & Returns" },
];

const DEFAULT_ACCOUNT_TAB = "settings";

const COMMUNICATION_GROUPS = [
  { title: "Order Updates", options: ["Email", "SMS", "Push Notifications"] },
  { title: "Promotions & Offers", options: ["Email", "SMS", "Push Notifications"] },
  { title: "Wishlist & Back-in-Stock Alerts", options: ["Email", "Push Notifications"] },
  { title: "Newsletter", options: ["Subscribe to monthly newsletter"] },
  { title: "Account & Security Alerts (required)", options: ["Email", "SMS (optional, toggleable)"] },
];

const SECURITY_2FA_ROWS = [
  { title: "SMS", description: "Receive codes via SMS" },
  { title: "Email", description: "Receive codes via email" },
  { title: "Phone Call", description: "Receive codes through a phone call" },
  { title: "Push Notification", description: "Receive codes via mobile app notifications" },
  { title: "Authenticator App", description: "Use an authenticator app to generate codes" },
  { title: "Backup Codes", description: "Use backup codes for account recovery" },
];

const LINKED_ACCOUNT_ROWS = [
  { title: "Google", description: "Connected to your account" },
  { title: "Apple", description: "Syncing with iCloud" },
  { title: "Microsoft", description: "Accessing OneDrive" },
  { title: "Facebook", description: "Files are up to date" },
  { title: "Download Account Data", description: "GDPR/CCPA" },
];

const ORDER_FILTERS = ["All Orders", "Processing", "Completed", "Returns"];

export default function AccountPage() {
  const { colors, mode } = useTheme();
  const mutedText = colors.muted ?? (mode === "dark" ? "#94a3b8" : "#475569");
  const accentText = colors.primary;
  const { displayName, email, signOut, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const prefsStorageKey = useMemo(() => `funzies:account:prefs:${email.trim().toLowerCase() || "guest"}`, [email]);
  const [prefLanguage, setPrefLanguage] = useState(() => {
    try {
      const raw = window.localStorage.getItem(prefsStorageKey);
      const j = raw ? JSON.parse(raw) : null;
      return typeof j?.language === "string" && j.language.trim() ? j.language : "English";
    } catch {
      return "English";
    }
  });
  const [prefTimeZone, setPrefTimeZone] = useState(() => {
    try {
      const raw = window.localStorage.getItem(prefsStorageKey);
      const j = raw ? JSON.parse(raw) : null;
      return typeof j?.timeZone === "string" && j.timeZone.trim() ? j.timeZone : "GMT+2";
    } catch {
      return "GMT+2";
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(prefsStorageKey, JSON.stringify({ language: prefLanguage, timeZone: prefTimeZone }));
    } catch {
      // ignore
    }
  }, [prefsStorageKey, prefLanguage, prefTimeZone]);
  const userRow = useMemo(() => {
    const normalized = email.trim().toLowerCase();
    if (!normalized) {
      return null;
    }
    return allUsers.find((u) => String(u.Email ?? "").trim().toLowerCase() === normalized) ?? null;
  }, [email]);

  // Demo data note: the bundled dataset has orders/addresses tied to user #2, but may not include that user row.
  // For authenticated sessions without a matching user row, fall back to user #2 so the account UX is populated.
  const signedIn = typeof isAuthenticated === "boolean" ? isAuthenticated : getInitialIsAuthenticated();
  const normalizedEmail = email.trim().toLowerCase();
  const isDemoAccountEmail = normalizedEmail === "demo@funzies.com";
  const isDemoAccountProfile = String(displayName ?? "")
    .trim()
    .toLowerCase()
    .includes("demo");
  const isDemoAccount = isDemoAccountEmail || isDemoAccountProfile;
  const userId = userRow ? Number(userRow.ID) : signedIn ? 1 : null;

  const [addressRows, setAddressRows] = useState(/** @type {any[]} */ ([]));
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressError, setAddressError] = useState(/** @type {string | null} */ (null));

  const refreshAddresses = async () => {
    if (!userId) {
      setAddressRows([]);
      return;
    }
    setAddressLoading(true);
    setAddressError(null);
    try {
      const r = await listTable("address", { all: 1 });
      const all = Array.isArray(r.data) ? r.data : [];
      setAddressRows(all.filter((a) => Number(a.User) === userId && Number(a.Deleted ?? 0) === 0));
    } catch (e) {
      // Fallback to bundled dataset if API isn't running.
      setAddressError(e instanceof Error ? e.message : "Could not load addresses");
      setAddressRows(allAddresses.filter((a) => Number(a.User) === userId && Number(a.Deleted ?? 0) === 0));
    } finally {
      setAddressLoading(false);
    }
  };

  useEffect(() => {
    refreshAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    refreshOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const userAddresses = useMemo(
    () =>
      [...addressRows].sort(
        (a, b) => (Number(b.Def) || 0) - (Number(a.Def) || 0) || (Number(a.ID) || 0) - (Number(b.ID) || 0),
      ),
    [addressRows],
  );

  const defaultAddress = userAddresses.find((a) => Number(a.Def) === 1) ?? userAddresses[0] ?? null;

  const userOrders = useMemo(() => {
    if (!userId) {
      return [];
    }
    return allOrders
      .filter((o) => Number(o.user) === userId && Number(o.deleted ?? 0) === 0)
      .slice()
      .sort((a, b) => (Number(b.ID) || 0) - (Number(a.ID) || 0));
  }, [userId]);

  const [orderRows, setOrderRows] = useState(/** @type {any[]} */ ([]));
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState(/** @type {string | null} */ (null));

  const refreshOrders = async () => {
    if (!userId) {
      setOrderRows([]);
      return;
    }
    setOrderLoading(true);
    setOrderError(null);
    try {
      const r = await listTable("orders", { all: 1 });
      const all = Array.isArray(r.data) ? r.data : [];
      const mine = all
        .filter((o) => Number(o.user) === userId && Number(o.deleted ?? 0) === 0)
        .slice()
        .sort((a, b) => (Number(b.ID) || 0) - (Number(a.ID) || 0));
      // Demo UX: if API is running but has no rows yet, fall back to the bundled dataset.
      setOrderRows(mine.length ? mine : userOrders);
    } catch (e) {
      setOrderError(e instanceof Error ? e.message : "Could not load orders");
      setOrderRows(userOrders);
    } finally {
      setOrderLoading(false);
    }
  };

  const activeTabId = useMemo(() => {
    const raw = searchParams.get("tab");
    if (ACCOUNT_TABS.some((t) => t.id === raw)) {
      return raw;
    }
    return DEFAULT_ACCOUNT_TAB;
  }, [searchParams]);

  const activeTabLabel = ACCOUNT_TABS.find((t) => t.id === activeTabId)?.label ?? "Account";
  const [orderFilter, setOrderFilter] = useState("All Orders");
  const [communication, setCommunication] = useState({
    "Order Updates-Email": false,
    "Order Updates-SMS": false,
    "Order Updates-Push Notifications": false,
    "Promotions & Offers-Email": false,
    "Promotions & Offers-SMS": false,
    "Promotions & Offers-Push Notifications": false,
    "Wishlist & Back-in-Stock Alerts-Email": false,
    "Wishlist & Back-in-Stock Alerts-Push Notifications": false,
    "Newsletter-Subscribe to monthly newsletter": false,
    "Account & Security Alerts (required)-Email": true,
    "Account & Security Alerts (required)-SMS (optional, toggleable)": false,
  });
  const [securityToggles, setSecurityToggles] = useState(
    SECURITY_2FA_ROWS.reduce((acc, row) => ({ ...acc, [row.title]: false }), {}),
  );
  const [linkedAccounts, setLinkedAccounts] = useState(
    LINKED_ACCOUNT_ROWS.reduce((acc, row) => ({ ...acc, [row.title]: true }), {}),
  );
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressModalMode, setAddressModalMode] = useState(/** @type {"create" | "edit"} */ ("create"));
  const [editingAddress, setEditingAddress] = useState(/** @type {any | null} */ (null));
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    streetAddress1: "",
    streetAddress2: "",
    countryCode: "MT",
    city: "",
    postCode: "",
  });
  const [addressIsDefault, setAddressIsDefault] = useState(true);
  const [addressSaving, setAddressSaving] = useState(false);
  const [addressFormError, setAddressFormError] = useState(/** @type {string | null} */ (null));

  const profile = useMemo(() => {
    const fallbackName = displayName?.trim() || "Customer";
    const firstName = userRow?.Name ? String(userRow.Name) : fallbackName.split(" ")[0] || "Customer";
    const lastName =
      userRow?.Surname ? String(userRow.Surname) : fallbackName.split(" ").slice(1).join(" ").trim() || "—";
    const fullName = [firstName, lastName].filter((x) => x && x !== "—").join(" ").trim() || fallbackName;
    return {
      firstName,
      lastName,
      fullName,
      emailMasked: email || "—",
      joinedOn: userRow?.Joined ? String(userRow.Joined) : "—",
      phone: userRow?.ContactNumber ? String(userRow.ContactNumber) : "—",
    };
  }, [displayName, email, userRow]);

  const formatAddressBlock = (a) => {
    if (!a) {
      return "";
    }
    const nameLine = [a.Name, a.Surname].filter(Boolean).join(" ").trim() || profile.fullName;
    const line2 = String(a.Street ?? "").trim();
    const line3 = [a.City, a.ZipCode].filter(Boolean).join(" ").trim();
    const line4 = String(a.Region ?? "").trim();
    return [nameLine, line2, line3, line4].filter(Boolean).join("\n");
  };

  const handleSignOut = () => {
    signOut();
    navigate("/login", { replace: true });
  };

  const openCreateAddressModal = () => {
    setAddressModalMode("create");
    setEditingAddress(null);
    setAddressFormError(null);
    setAddressForm({
      fullName: profile.fullName,
      streetAddress1: "",
      streetAddress2: "",
      countryCode: "MT",
      city: "",
      postCode: "",
    });
    setAddressIsDefault(userAddresses.length === 0);
    setIsAddressModalOpen(true);
  };

  const openEditAddressModal = (row) => {
    setAddressModalMode("edit");
    setEditingAddress(row);
    setAddressFormError(null);
    const fullName = [row.Name, row.Surname].filter(Boolean).join(" ").trim() || profile.fullName;
    const streetParts = String(row.Street ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    setAddressForm({
      fullName,
      streetAddress1: streetParts[0] ?? "",
      streetAddress2: streetParts.slice(1).join(", "),
      countryCode: "MT",
      city: String(row.City ?? ""),
      postCode: String(row.ZipCode ?? ""),
    });
    setAddressIsDefault(Number(row.Def) === 1);
    setIsAddressModalOpen(true);
  };

  const closeModals = () => {
    setIsAddressModalOpen(false);
  };

  const countries = useMemo(() => {
    const mt = Country.getCountryByCode("MT");
    return mt ? [mt] : [];
  }, []);
  const cities = useMemo(() => {
    return City.getCitiesOfCountry(addressForm.countryCode);
  }, [addressForm.countryCode]);
  const hasCityOptions = cities.length > 0;

  const renderSidebar = () => (
    <aside className="flex self-start flex-col justify-between lg:sticky lg:top-6">
      <nav aria-label="Account sections">
        <ul className="space-y-2">
          {ACCOUNT_TABS.map((tab) => {
            const to = tab.id === DEFAULT_ACCOUNT_TAB ? "/account" : `/account?tab=${tab.id}`;
            const isActive = tab.id === activeTabId;
            return (
              <li key={tab.id}>
                <Link
                  to={to}
                  className="block w-full px-1 py-1.5 text-left hover:underline"
                  style={{ ...textStyles.body, color: isActive ? accentText : mutedText, fontWeight: isActive ? 600 : 400 }}
                  aria-current={isActive ? "page" : undefined}
                  id={`account-nav-${tab.id}`}
                >
                  {tab.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="mt-6 border-t pt-3" style={{ borderColor: colors.primary }}>
        <div className="flex items-start gap-3">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded border" style={{ borderColor: colors.border, color: colors.text, backgroundColor: colors.panel }}>
            <FiUser size={14} />
          </span>
          <div className="min-w-0">
            <p style={{ ...textStyles.button, color: colors.text }}>{`Hello, ${displayName}`}</p>
            <ThemedButton
              type="button"
              onClick={handleSignOut}
              variant="redOutline"
              size="sm"
              className="mt-2"
              style={{ ...textStyles.bodySm }}
            >
              Sign Out
            </ThemedButton>
          </div>
        </div>
      </div>
    </aside>
  );

  const renderPaymentMethods = () => (
    <div className="space-y-8">
      <section className="space-y-3">
        <h2 style={{ ...textStyles.sectionTitle, color: colors.text }}>Payment Methods</h2>
        <InfoCard className="max-w-[520px]">
          <p style={{ ...textStyles.body, color: mutedText }}>
            For safety, payment methods are never stored in Funzies. Payment details are collected at checkout and handled by a secure payment processor.
          </p>
        </InfoCard>
      </section>
    </div>
  );

  const filteredOrders = useMemo(() => {
    if (orderFilter === "All Orders") {
      return orderRows;
    }
    const want = orderFilter === "Completed" ? "Complete" : orderFilter;
    return orderRows.filter((o) => {
      const st = orderStatusById.get(o.status);
      const label = String(st?.Status ?? "");
      const normalized = label.toLowerCase();
      if (orderFilter === "Completed") {
        // Completed = delivered (and any status that contains "complete" for legacy labels).
        return Number(o.status) === 8 || normalized.includes("complete");
      }
      return normalized.includes(want.toLowerCase());
    });
  }, [orderFilter, orderRows]);

  const renderActiveContent = () => {
    switch (activeTabId) {
      case "profile":
        return (
          <ProfileOverviewSection
            colors={colors}
            mutedText={mutedText}
            profile={profile}
            defaultAddress={defaultAddress}
            formatAddressBlock={formatAddressBlock}
          />
        );
      case "settings":
        return <AccountSettingsSection mutedText={mutedText} profile={profile} />;
      case "preferences":
        return (
          <PreferencesTabSection
            colors={colors}
            mutedText={mutedText}
            language={prefLanguage}
            setLanguage={setPrefLanguage}
            timeZone={prefTimeZone}
            setTimeZone={setPrefTimeZone}
            communicationGroups={COMMUNICATION_GROUPS}
            communication={communication}
            setCommunication={setCommunication}
            securityToggles={securityToggles}
            setSecurityToggles={setSecurityToggles}
            linkedAccounts={linkedAccounts}
            setLinkedAccounts={setLinkedAccounts}
            security2faRows={SECURITY_2FA_ROWS}
            linkedAccountRows={LINKED_ACCOUNT_ROWS}
          />
        );
      case "addresses":
        return (
          <AddressesSection
            colors={colors}
            mutedText={mutedText}
            defaultAddress={defaultAddress}
            userAddresses={userAddresses}
            formatAddressBlock={formatAddressBlock}
            openCreateAddressModal={openCreateAddressModal}
            openEditAddressModal={openEditAddressModal}
            refreshAddresses={refreshAddresses}
            addressLoading={addressLoading}
            addressError={addressError}
            userId={userId}
            deleteRow={deleteRow}
          />
        );
      case "payment":
        return renderPaymentMethods();
      case "orders":
        return (
          <OrdersReturnsSection
            colors={colors}
            mutedText={mutedText}
            orderFilters={ORDER_FILTERS}
            orderFilter={orderFilter}
            setOrderFilter={setOrderFilter}
            filteredOrders={filteredOrders}
            orderStatusById={orderStatusById}
            computeOrderSubtotalEur={computeOrderSubtotalEur}
            formatEurValue={formatEurValue}
            orderLoading={orderLoading}
            orderError={orderError}
            onCancelOrder={async (orderId) => {
              try {
                await updateRow("orders", orderId, { status: 3 });
                await refreshOrders();
              } catch (e) {
                window.alert(e instanceof Error ? e.message : "Cancel order failed");
              }
            }}
          />
        );
      default:
        return <AccountSettingsSection mutedText={mutedText} profile={profile} />;
    }
  };

  return (
    <AppLayout title="Account" description="Manage account details, communication, security, orders, and payment settings." showPageHeader={false} contentClassName="">
      <section className="w-full rounded-box p-5 md:p-6" style={{ backgroundColor: colors.panel }}>
        <header className="border-b pb-4" style={{ borderColor: colors.primary }}>
          <h1 id={`account-tab-${activeTabId}`} style={{ ...textStyles.title, color: colors.text }}>
            {activeTabLabel}
          </h1>
        </header>

        <div className="mt-6 grid gap-6 lg:grid-cols-[220px_1fr]">
          {renderSidebar()}
          <div id={`account-panel-${activeTabId}`}>
            {renderActiveContent()}
          </div>
        </div>
      </section>

      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close modal backdrop"
            className="absolute inset-0"
            onClick={closeModals}
            style={{ backgroundColor: "rgba(15, 23, 36, 0.6)" }}
          />

          {isAddressModalOpen && (
            <section
              className="relative w-full max-w-[520px] rounded-box border p-5 shadow-xl"
              style={{ backgroundColor: colors.background, borderColor: colors.border }}
            >
              <h3 style={{ ...textStyles.sectionTitle, color: colors.primary }}>
                {addressModalMode === "create" ? "New Address" : "Edit Address"}
              </h3>
              <div className="mt-4 space-y-3">
                {addressFormError ? (
                  <p className="rounded border px-3 py-2 text-sm" style={{ borderColor: "rgba(239, 68, 68, 0.45)", color: "#b91c1c", backgroundColor: "rgba(239, 68, 68, 0.08)" }}>
                    {addressFormError}
                  </p>
                ) : null}
                <ThemedTextBox
                  label="Full Name"
                  value={addressForm.fullName}
                  onChange={(event) => setAddressForm((current) => ({ ...current, fullName: event.target.value }))}
                />
                <ThemedTextBox
                  label="Street Address 1"
                  value={addressForm.streetAddress1}
                  onChange={(event) => setAddressForm((current) => ({ ...current, streetAddress1: event.target.value }))}
                />
                <ThemedTextBox
                  label="Street Address 2 (Optional)"
                  value={addressForm.streetAddress2}
                  onChange={(event) => setAddressForm((current) => ({ ...current, streetAddress2: event.target.value }))}
                />
                <ThemedCheckbox
                  checked={addressIsDefault}
                  onChange={(e) => setAddressIsDefault(e.target.checked)}
                  label="Set as default"
                  labelClassName="text-base"
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block space-y-1">
                    <span style={{ ...textStyles.body, color: colors.text }}>Country</span>
                    <select
                      value={addressForm.countryCode}
                      onChange={() => {}}
                      disabled
                      className="w-full rounded border px-3 py-2 outline-none"
                      style={{ borderColor: colors.primary, backgroundColor: colors.white, color: "#1f2a36", opacity: 0.9 }}
                    >
                      {countries.map((country) => (
                        <option key={country.isoCode} value={country.isoCode}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block space-y-1">
                    <span style={{ ...textStyles.body, color: colors.text }}>City</span>
                    {hasCityOptions ? (
                      <select
                        value={addressForm.city}
                        onChange={(event) => setAddressForm((current) => ({ ...current, city: event.target.value }))}
                        className="w-full rounded border px-3 py-2 outline-none"
                        style={{ borderColor: colors.primary, backgroundColor: colors.white, color: "#1f2a36" }}
                      >
                        <option value="">Select city</option>
                        {addressForm.city &&
                        !cities.some((c) => String(c?.name ?? "").trim().toLowerCase() === addressForm.city.trim().toLowerCase()) ? (
                          <option value={addressForm.city}>{addressForm.city}</option>
                        ) : null}
                        {cities.map((cityOption) => (
                          <option key={`${cityOption.countryCode}-${cityOption.stateCode}-${cityOption.name}`} value={cityOption.name}>
                            {cityOption.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <ThemedTextBox
                        label=""
                        value={addressForm.city}
                        onChange={(event) => setAddressForm((current) => ({ ...current, city: event.target.value }))}
                        placeholder="Enter city"
                      />
                    )}
                  </label>
                  <label className="block space-y-1">
                    <span style={{ ...textStyles.body, color: colors.text }}>Post Code</span>
                    <ThemedTextBox
                      label=""
                      value={addressForm.postCode}
                      onChange={(event) => setAddressForm((current) => ({ ...current, postCode: event.target.value }))}
                      className="w-full"
                    />
                  </label>
                </div>
              </div>
              <div className="mt-5 flex justify-end gap-2">
                <ThemedButton type="button" variant="redOutline" size="md" onClick={closeModals} style={{ ...textStyles.body }}>
                  Cancel
                </ThemedButton>
                <ThemedButton
                  type="button"
                  variant="redSolid"
                  size="md"
                  disabled={addressSaving || !userId}
                  onClick={async () => {
                    if (!userId) return;
                    setAddressSaving(true);
                    setAddressFormError(null);
                    try {
                      const fullName = addressForm.fullName.trim() || profile.fullName;
                      const parts = fullName.split(" ").filter(Boolean);
                      const Name = parts[0] ?? "Customer";
                      const Surname = parts.slice(1).join(" ") || "";
                      const Street = [addressForm.streetAddress1, addressForm.streetAddress2].map((s) => s.trim()).filter(Boolean).join(", ");
                      const City = addressForm.city.trim();
                      const ZipCode = addressForm.postCode.trim();
                      const country = Country.getCountryByCode(addressForm.countryCode);
                      const Region = country?.name ?? "";

                      if (!Street || !City || !ZipCode) {
                        throw new Error("Street, City, and Post Code are required.");
                      }

                      const body = {
                        Street,
                        City,
                        ZipCode,
                        Region,
                        User: userId,
                        Def: addressIsDefault ? 1 : 0,
                        Deleted: 0,
                        Name,
                        Surname,
                        Mobile: "",
                      };

                      if (addressModalMode === "create") {
                        await createRow("address", body);
                      } else if (editingAddress) {
                        await updateRow("address", editingAddress.ID, body);
                      }

                      // Ensure only one default address.
                      if (addressIsDefault) {
                        const r = await listTable("address", { all: 1 });
                        const all = Array.isArray(r.data) ? r.data : [];
                        const mine = all.filter((a) => Number(a.User) === userId && Number(a.Deleted ?? 0) === 0);
                        const newest = mine.slice().sort((a, b) => (Number(b.ID) || 0) - (Number(a.ID) || 0))[0];
                        for (const a of mine) {
                          if (newest && a.ID !== newest.ID && Number(a.Def) === 1) {
                            await updateRow("address", a.ID, { Def: 0 });
                          }
                        }
                      }

                      await refreshAddresses();
                      closeModals();
                    } catch (e) {
                      setAddressFormError(e instanceof Error ? e.message : "Save failed");
                    } finally {
                      setAddressSaving(false);
                    }
                  }}
                  style={{ ...textStyles.body, opacity: addressSaving || !userId ? 0.7 : 1 }}
                >
                  {addressSaving ? "Saving…" : "Save Address"}
                </ThemedButton>
              </div>
            </section>
          )}

        </div>
      )}

    </AppLayout>
  );
}
