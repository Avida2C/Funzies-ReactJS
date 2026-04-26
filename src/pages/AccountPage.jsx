import { useMemo, useState } from "react";
import { FiEdit2, FiEyeOff, FiPlus, FiSearch, FiTrash2, FiUser } from "react-icons/fi";
import { BsFillStarFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { City, Country } from "country-state-city";
import AppLayout from "../components/AppLayout";
import { textStyles } from "../theme/typography";
import { useTheme } from "../theme/themeContext";
import { useAuth } from "../lib/authContext";

const ACCOUNT_TABS = [
  "Profile Overview",
  "Account Settings",
  "Security & Privacy",
  "Communication Settings",
  "Addresses",
  "Payment Methods",
  "Orders & Returns",
];

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

const ORDERS = [
  {
    id: "#5563111",
    date: "Sep 17, 2025",
    items: "1 Items",
    total: "$10.99",
    status: "Processing",
    statusColor: "#facc15",
    actions: ["View Order Details", "Edit Order", "Cancel Order"],
    thumbnailUrls: ["https://www.figma.com/api/mcp/asset/2453e7dc-e615-405e-988f-1be79c7cb75d"],
  },
  {
    id: "#223111",
    date: "Dec 29, 2023",
    items: "3 Items",
    total: "$14.99",
    status: "Cancelled",
    statusColor: "#ff4e4e",
    actions: ["View Order Details"],
    thumbnailUrls: [
      "https://www.figma.com/api/mcp/asset/2453e7dc-e615-405e-988f-1be79c7cb75d",
      "https://www.figma.com/api/mcp/asset/b8d90f1a-82ab-45e7-9f22-9131532f8cb3",
      "https://www.figma.com/api/mcp/asset/b8d90f1a-82ab-45e7-9f22-9131532f8cb3",
    ],
  },
  {
    id: "#220111",
    date: "Jan 04, 2023",
    items: "5 Items",
    total: "$100.99",
    status: "Complete",
    statusColor: "#16a34a",
    actions: ["View Order Details"],
    thumbnailUrls: [
      "https://www.figma.com/api/mcp/asset/2453e7dc-e615-405e-988f-1be79c7cb75d",
      "https://www.figma.com/api/mcp/asset/b8d90f1a-82ab-45e7-9f22-9131532f8cb3",
      "https://www.figma.com/api/mcp/asset/b8d90f1a-82ab-45e7-9f22-9131532f8cb3",
      "https://www.figma.com/api/mcp/asset/b8d90f1a-82ab-45e7-9f22-9131532f8cb3",
      "https://www.figma.com/api/mcp/asset/b8d90f1a-82ab-45e7-9f22-9131532f8cb3",
    ],
  },
  {
    id: "#113111",
    date: "Dec 29, 2022",
    items: "4 Items",
    total: "$33.99",
    status: "Complete",
    statusColor: "#16a34a",
    actions: ["View Order Details"],
    thumbnailUrls: [
      "https://www.figma.com/api/mcp/asset/2453e7dc-e615-405e-988f-1be79c7cb75d",
      "https://www.figma.com/api/mcp/asset/2453e7dc-e615-405e-988f-1be79c7cb75d",
      "https://www.figma.com/api/mcp/asset/b8d90f1a-82ab-45e7-9f22-9131532f8cb3",
      "https://www.figma.com/api/mcp/asset/b8d90f1a-82ab-45e7-9f22-9131532f8cb3",
    ],
  },
];

const ORDER_FILTERS = ["All Orders", "Processing", "Completed", "Returns"];

function ReadOnlyField({ label, value, rightIcon, className = "" }) {
  const { colors } = useTheme();
  return (
    <div className={`space-y-2 ${className}`.trim()}>
      <p style={{ ...textStyles.body, color: colors.text }}>{label}</p>
      <div className="flex min-h-10 items-center justify-between border px-3 py-2" style={{ borderColor: colors.primary, backgroundColor: colors.white }}>
        <span style={{ ...textStyles.body, color: "#1f2a36" }}>{value}</span>
        {rightIcon}
      </div>
    </div>
  );
}

function SectionHeader({ children }) {
  const { colors } = useTheme();
  return (
    <h2 style={{ ...textStyles.sectionTitle, color: colors.primary }}>
      {children}
    </h2>
  );
}

function ActionLink({ children, icon = null, onClick = undefined }) {
  const { colors } = useTheme();
  return (
    <button type="button" onClick={onClick} className="inline-flex items-center gap-2" style={{ ...textStyles.body, color: colors.primary }}>
      {icon}
      {children}
    </button>
  );
}

function InfoCard({ children, className = "" }) {
  const { colors } = useTheme();
  return (
    <div
      className={`rounded-box p-4 shadow ${className}`.trim()}
      style={{ backgroundColor: colors.background }}
    >
      {children}
    </div>
  );
}

export default function AccountPage() {
  const { colors, mode } = useTheme();
  const mutedText = colors.muted ?? (mode === "dark" ? "#94a3b8" : "#8896b2");
  const { displayName, email, signOut } = useAuth();
  const navigate = useNavigate();
  const isDemoAccount = email.trim().toLowerCase() === "demo@funzies.com" || displayName === "Demo Account";
  const [activeTab, setActiveTab] = useState("Account Settings");
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
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    streetAddress1: "",
    streetAddress2: "",
    countryCode: "US",
    city: "",
    postCode: "",
  });

  const profile = isDemoAccount
    ? {
      firstName: "Demo",
      lastName: "Account",
      fullName: "Demo Account",
      emailMasked: "demo@funzies.com",
      joinedOn: "2026-04-26",
      shippingAddress: "Demo Account\n1001 Collector Ave.\nDemo City,\nCalifornia 90001",
      otherAddress: "Demo Account\n202 Sample Street\nTestville,\nCalifornia 90002",
      phone: "001 *** *** 9999",
    }
    : {
      firstName: "Nadine",
      lastName: "Customer",
      fullName: "Nadine Customer",
      emailMasked: email || "na*******@email.com",
      joinedOn: "2023-12-16",
      shippingAddress: "Nadine Customer\n2972\nWestheimer Rd. Santa Ana,\nIllinois 85486",
      otherAddress: "Nadine Customer\n1234\nCedar St. Brooksville,\nFlorida 34601",
      phone: "001 *** *** 1122",
    };

  const handleSignOut = () => {
    signOut();
    navigate("/login", { replace: true });
  };

  const openAddressModal = () => {
    setAddressForm({
      fullName: profile.fullName,
      streetAddress1: profile.shippingAddress.split("\n")[1] ?? "",
      streetAddress2: "",
      countryCode: "US",
      city: isDemoAccount ? "Demo City" : "Santa Ana",
      postCode: isDemoAccount ? "90001" : "85486",
    });
    setIsAddressModalOpen(true);
  };

  const closeModals = () => {
    setIsAddressModalOpen(false);
  };

  const countries = useMemo(() => Country.getAllCountries(), []);
  const cities = useMemo(() => {
    return City.getCitiesOfCountry(addressForm.countryCode);
  }, [addressForm.countryCode]);
  const hasCityOptions = cities.length > 0;

  const renderSidebar = () => (
    <aside className="flex self-start flex-col justify-between lg:sticky lg:top-6">
      <nav>
        <ul className="space-y-2">
          {ACCOUNT_TABS.map((tab) => (
            <li key={tab}>
              <button
                type="button"
                onClick={() => setActiveTab(tab)}
                className="w-full px-1 py-1.5 text-left"
                style={{ ...textStyles.body, color: tab === activeTab ? colors.primary : mutedText }}
              >
                {tab}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-6 border-t pt-3" style={{ borderColor: colors.primary }}>
        <div className="flex items-center gap-2.5">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded border" style={{ borderColor: colors.border, color: colors.text, backgroundColor: colors.panel }}>
            <FiUser size={14} />
          </span>
          <div>
            <p style={{ ...textStyles.button, color: colors.text }}>{`Hello, ${displayName}`}</p>
            <button type="button" onClick={handleSignOut} style={{ ...textStyles.bodySm, color: colors.primary }}>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </aside>
  );

  const renderOverview = () => (
    <div className="space-y-8">
      <InfoCard className="max-w-[640px]">
        <div className="flex items-start gap-3">
          <BsFillStarFill size={26} color="#facc15" />
          <div className="space-y-6">
            <div>
              <p style={{ ...textStyles.sectionTitle, color: colors.text }}>Premium Member</p>
              <p style={{ ...textStyles.body, color: colors.text }}>1,245 Loyalty Points</p>
              <p style={{ ...textStyles.body, color: colors.primary }}>View Rewards</p>
            </div>
            <div>
              <p style={{ ...textStyles.body, color: colors.text, fontWeight: 600 }}>Joined On</p>
              <p style={{ ...textStyles.body, color: colors.text }}>{profile.joinedOn}</p>
            </div>
          </div>
        </div>
      </InfoCard>

      <section className="space-y-3">
        <h2 style={{ ...textStyles.sectionTitle, color: colors.text }}>Default Shipping Address</h2>
        <InfoCard className="w-full max-w-[280px]">
          <p style={{ ...textStyles.body, color: colors.text, whiteSpace: "pre-line" }}>{profile.shippingAddress}</p>
        </InfoCard>
      </section>

      <section className="space-y-3">
        <h2 style={{ ...textStyles.sectionTitle, color: colors.text }}>Default Payment Method</h2>
        <InfoCard className="w-full max-w-[280px] space-y-3">
          <div className="flex items-center justify-between">
            <span style={{ ...textStyles.body, color: colors.text }}>Credit Card</span>
            <strong style={{ ...textStyles.sectionTitle, color: "#2563eb" }}>VISA</strong>
          </div>
          <p style={{ ...textStyles.body, color: colors.text }}>•••• •••• •••• 4321</p>
          <div className="flex items-center justify-between">
            <span style={{ ...textStyles.body, color: colors.text }}>{profile.fullName}</span>
            <span style={{ ...textStyles.body, color: colors.text }}>Expires 12/20</span>
          </div>
        </InfoCard>
      </section>
    </div>
  );

  const renderAccountSettings = () => (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionHeader>Personal Information</SectionHeader>
        <div className="grid gap-4 md:grid-cols-2">
          <ReadOnlyField label="First Name" value={profile.firstName} />
          <ReadOnlyField label="Last Name" value={profile.lastName} />
          <ReadOnlyField label="Date of Birth" value="03/10/1988" />
          <ReadOnlyField label="Gender" value="Male" />
          <ReadOnlyField label="Language Preference" value="English" />
          <ReadOnlyField label="TimeZone" value="GM+2" />
        </div>
        <ReadOnlyField label="Contact Number" value={profile.phone} />
        <ActionLink icon={<FiEdit2 size={18} />}>Edit Personal Information</ActionLink>
      </section>

      <section className="space-y-4">
        <SectionHeader>Email Address Management</SectionHeader>
        <ReadOnlyField label="Email Address" value={profile.emailMasked} />
        <ActionLink icon={<FiEdit2 size={18} />}>Edit Email Address</ActionLink>
      </section>

      <section className="space-y-4">
        <SectionHeader>Password Management</SectionHeader>
        <p style={{ ...textStyles.body, color: mutedText }}>Last changed on: 2025-06-01</p>
        <ReadOnlyField label="Current Password" value="*******************" rightIcon={<FiEyeOff size={16} style={{ color: mutedText }} />} />
        <ReadOnlyField label="New Password" value="*******************" rightIcon={<FiEyeOff size={16} style={{ color: mutedText }} />} />
        <ReadOnlyField label="Confirm New Password" value="*******************" rightIcon={<FiEyeOff size={16} style={{ color: mutedText }} />} />
        <ActionLink icon={<FiEdit2 size={18} />}>Change Password</ActionLink>
      </section>
    </div>
  );

  const renderCommunication = () => (
    <section className="space-y-6">
      <div>
        <SectionHeader>Communication Preferences</SectionHeader>
        <p style={{ ...textStyles.body, color: colors.text }}>Choose how you&apos;d like to hear from us.</p>
      </div>
      {COMMUNICATION_GROUPS.map((group) => (
        <div key={group.title} className="space-y-2">
          <h3 style={{ ...textStyles.body, color: colors.text, fontWeight: 600 }}>{group.title}</h3>
          {group.options.map((option) => {
            const key = `${group.title}-${option}`;
            return (
              <label key={key} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={Boolean(communication[key])}
                  onChange={() => setCommunication((current) => ({ ...current, [key]: !current[key] }))}
                  className="h-5 w-5 rounded border bg-transparent accent-red-500"
                />
                <span style={{ ...textStyles.body, color: colors.text }}>{option}</span>
              </label>
            );
          })}
        </div>
      ))}
      <button type="button" className="rounded-box px-6 py-2" style={{ ...textStyles.sectionTitle, backgroundColor: colors.primary, color: colors.white }}>
        Save Preferences
      </button>
    </section>
  );

  const renderSecurity = () => (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionHeader>Two-Factor Authentication (2FA)</SectionHeader>
        {SECURITY_2FA_ROWS.map((row) => (
          <div key={row.title} className="flex items-start justify-between gap-4">
            <div>
              <p style={{ ...textStyles.body, color: colors.text, fontWeight: 600 }}>{row.title}</p>
              <p style={{ ...textStyles.body, color: mutedText }}>{row.description}</p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={Boolean(securityToggles[row.title])}
                onChange={() => setSecurityToggles((current) => ({ ...current, [row.title]: !current[row.title] }))}
              />
              <div
                className="h-9 w-[72px] rounded-full after:absolute after:start-[3px] after:top-[3px] after:h-7 after:w-7 after:rounded-full after:transition-all after:content-[''] peer-checked:after:translate-x-[36px]"
                style={{
                  backgroundColor: securityToggles[row.title] ? colors.primary : "#9db2d2",
                }}
              />
            </label>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <SectionHeader>Linked Accounts</SectionHeader>
        {LINKED_ACCOUNT_ROWS.map((row) => (
          <div key={row.title} className="flex items-start justify-between gap-4">
            <div>
              <p style={{ ...textStyles.body, color: colors.text, fontWeight: 600 }}>{row.title}</p>
              <p style={{ ...textStyles.body, color: mutedText }}>{row.description}</p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={Boolean(linkedAccounts[row.title])}
                onChange={() => setLinkedAccounts((current) => ({ ...current, [row.title]: !current[row.title] }))}
              />
              <div
                className="h-9 w-[72px] rounded-full after:absolute after:start-[3px] after:top-[3px] after:h-7 after:w-7 after:rounded-full after:transition-all after:content-[''] peer-checked:after:translate-x-[36px]"
                style={{
                  backgroundColor: linkedAccounts[row.title] ? colors.primary : "#9db2d2",
                }}
              />
            </label>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <SectionHeader>Deactivate or Delete Account</SectionHeader>
        <button type="button" className="w-full rounded-box px-4 py-2" style={{ ...textStyles.sectionTitle, backgroundColor: colors.primary, color: colors.white }}>
          Download Account Data (GDPR/CCPA)
        </button>
        <button type="button" className="w-full rounded-box px-4 py-2" style={{ ...textStyles.sectionTitle, backgroundColor: colors.primary, color: colors.white }}>
          Deactivate or Delete Account
        </button>
      </section>
    </div>
  );

  const renderAddresses = () => {
    const addressCardStyle = { color: colors.text };
    return (
      <div className="space-y-8">
        <section className="space-y-3">
          <h2 style={{ ...textStyles.sectionTitle, color: colors.text }}>Default Shipping Address</h2>
          <InfoCard className="max-w-[280px]">
            <p style={{ ...textStyles.body, ...addressCardStyle, whiteSpace: "pre-line" }}>{profile.shippingAddress}</p>
          </InfoCard>
          <div className="flex items-center gap-6">
            <ActionLink icon={<FiEdit2 size={18} />}>Edit Address</ActionLink>
            <ActionLink icon={<FiTrash2 size={18} />}>Delete Address</ActionLink>
          </div>
        </section>

        <section className="space-y-3">
          <h2 style={{ ...textStyles.sectionTitle, color: colors.text }}>Other Shipping Addresses</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2].map((idx) => (
              <div key={idx}>
                <InfoCard className="max-w-[280px]">
                  <p style={{ ...textStyles.body, ...addressCardStyle, whiteSpace: "pre-line" }}>{profile.otherAddress}</p>
                </InfoCard>
                <div className="mt-1 flex items-center gap-6">
                  <ActionLink icon={<FiEdit2 size={18} />}>Edit Address</ActionLink>
                  <ActionLink icon={<FiTrash2 size={18} />}>Delete Address</ActionLink>
                </div>
              </div>
            ))}
          </div>
          <button type="button" className="inline-flex items-center gap-2 rounded-box px-5 py-2" style={{ ...textStyles.sectionTitle, backgroundColor: "#16a34a", color: colors.white }}>
            <FiPlus size={24} />
            New Address
          </button>
        </section>
      </div>
    );
  };

  const renderPaymentMethods = () => (
    <div className="space-y-8">
      <section className="space-y-3">
        <h2 style={{ ...textStyles.sectionTitle, color: colors.text }}>Default Payment Method</h2>
        <InfoCard className="max-w-[280px] space-y-3">
          <div className="flex items-center justify-between">
            <span style={{ ...textStyles.body, color: colors.text }}>Credit Card</span>
            <strong style={{ ...textStyles.sectionTitle, color: "#2563eb" }}>VISA</strong>
          </div>
          <p style={{ ...textStyles.body, color: colors.text }}>•••• •••• •••• 4321</p>
          <div className="flex items-center justify-between">
            <span style={{ ...textStyles.body, color: colors.text }}>{profile.fullName}</span>
            <span style={{ ...textStyles.body, color: colors.text }}>Expires 12/20</span>
          </div>
        </InfoCard>
        <ActionLink icon={<FiTrash2 size={18} />}>Remove Payment Method</ActionLink>
      </section>

      <section className="space-y-3">
        <h2 style={{ ...textStyles.sectionTitle, color: colors.text }}>Other Payment Methods</h2>
        <button type="button" className="inline-flex items-center gap-2 rounded-box px-5 py-2" style={{ ...textStyles.sectionTitle, backgroundColor: "#16a34a", color: colors.white }}>
          <FiPlus size={24} />
          New Payment Method
        </button>
      </section>
    </div>
  );

  const filteredOrders = ORDERS.filter((order) => {
    if (orderFilter === "All Orders") return true;
    if (orderFilter === "Completed") return order.status === "Complete";
    return order.status === orderFilter;
  });

  const renderOrders = () => (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          {ORDER_FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setOrderFilter(filter)}
              className={`pb-1 ${filter === orderFilter ? "border-b" : ""}`}
              style={{ ...textStyles.body, color: filter === orderFilter ? colors.primary : mutedText, borderColor: colors.primary }}
            >
              {filter}
            </button>
          ))}
        </div>
        <label className="flex h-10 w-full max-w-[300px] items-center justify-between rounded-box border px-3" style={{ borderColor: colors.primary, backgroundColor: colors.white }}>
          <input type="text" placeholder="Item name / Order ID" className="w-full bg-transparent outline-none" style={{ ...textStyles.body, color: "#1f2a36" }} />
          <FiSearch size={18} style={{ color: colors.primary }} />
        </label>
      </div>
      {filteredOrders.map((order) => (
        <InfoCard key={order.id} className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {order.thumbnailUrls?.map((url, index) => (
                <div key={`${order.id}-thumb-${index}`} className="h-[56px] w-[56px] overflow-hidden rounded-sm" style={{ backgroundColor: "#d9d9d9" }}>
                  <img src={url} alt={`${order.id} item ${index + 1}`} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
            <span className="rounded-box px-3 py-1" style={{ ...textStyles.button, backgroundColor: order.statusColor, color: "#ffffff" }}>
              {order.status}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3 rounded-box p-3 md:grid-cols-3" style={{ backgroundColor: colors.panel }}>
            <div>
              <p style={{ ...textStyles.bodySm, color: mutedText }}>Order ID</p>
              <p style={{ ...textStyles.sectionTitle, fontSize: "20px", color: colors.text }}>{order.id}</p>
            </div>
            <div>
              <p style={{ ...textStyles.bodySm, color: mutedText }}>Order Date</p>
              <p style={{ ...textStyles.sectionTitle, fontSize: "20px", color: colors.text }}>{order.date}</p>
            </div>
            <div>
              <p style={{ ...textStyles.bodySm, color: mutedText }}>{order.items}</p>
              <p style={{ ...textStyles.sectionTitle, fontSize: "20px", color: colors.text }}>{order.total}</p>
            </div>
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            {order.actions.map((action) => (
              <button
                key={`${order.id}-${action}`}
                type="button"
                className="rounded-box border px-3 py-1"
                style={{
                  ...textStyles.body,
                  fontWeight: 600,
                  borderColor: action === "View Order Details" ? colors.primary : "transparent",
                  backgroundColor: action === "Edit Order" ? "#2563eb" : action === "Cancel Order" ? colors.primary : "transparent",
                  color: action === "View Order Details" ? colors.text : "#ffffff",
                }}
              >
                {action}
              </button>
            ))}
          </div>
        </InfoCard>
      ))}
    </div>
  );

  const renderActiveContent = () => {
    if (activeTab === "Profile Overview") return renderOverview();
    if (activeTab === "Account Settings") return renderAccountSettings();
    if (activeTab === "Security & Privacy") return renderSecurity();
    if (activeTab === "Communication Settings") return renderCommunication();
    if (activeTab === "Addresses") return renderAddresses();
    if (activeTab === "Payment Methods") return renderPaymentMethods();
    return renderOrders();
  };

  return (
    <AppLayout title="Account" description="Manage account details, communication, security, orders, and payment settings." showPageHeader={false} contentClassName="">
      <section className="w-full rounded-box p-5 md:p-6" style={{ backgroundColor: colors.panel }}>
        <header className="border-b pb-4" style={{ borderColor: colors.primary }}>
          <h1 style={{ ...textStyles.title, color: colors.text }}>{activeTab}</h1>
        </header>

        <div className="mt-6 grid gap-6 lg:grid-cols-[220px_1fr]">
          {renderSidebar()}
          <div>{renderActiveContent()}</div>
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
              <h3 style={{ ...textStyles.sectionTitle, color: colors.primary }}>Edit Address</h3>
              <div className="mt-4 space-y-3">
                <label className="block space-y-1">
                  <span style={{ ...textStyles.body, color: colors.text }}>Full Name</span>
                  <input
                    value={addressForm.fullName}
                    onChange={(event) => setAddressForm((current) => ({ ...current, fullName: event.target.value }))}
                    className="w-full rounded border px-3 py-2 outline-none"
                    style={{ borderColor: colors.primary, backgroundColor: colors.white, color: "#1f2a36" }}
                  />
                </label>
                <label className="block space-y-1">
                  <span style={{ ...textStyles.body, color: colors.text }}>Street Address 1</span>
                  <input
                    value={addressForm.streetAddress1}
                    onChange={(event) => setAddressForm((current) => ({ ...current, streetAddress1: event.target.value }))}
                    className="w-full rounded border px-3 py-2 outline-none"
                    style={{ borderColor: colors.primary, backgroundColor: colors.white, color: "#1f2a36" }}
                  />
                </label>
                <label className="block space-y-1">
                  <span style={{ ...textStyles.body, color: colors.text }}>Street Address 2 (Optional)</span>
                  <input
                    value={addressForm.streetAddress2}
                    onChange={(event) => setAddressForm((current) => ({ ...current, streetAddress2: event.target.value }))}
                    className="w-full rounded border px-3 py-2 outline-none"
                    style={{ borderColor: colors.primary, backgroundColor: colors.white, color: "#1f2a36" }}
                  />
                </label>
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
                        {cities.map((cityOption) => (
                          <option key={`${cityOption.countryCode}-${cityOption.stateCode}-${cityOption.name}`} value={cityOption.name}>
                            {cityOption.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        value={addressForm.city}
                        onChange={(event) => setAddressForm((current) => ({ ...current, city: event.target.value }))}
                        placeholder="Enter city"
                        className="w-full rounded border px-3 py-2 outline-none"
                        style={{ borderColor: colors.primary, backgroundColor: colors.white, color: "#1f2a36" }}
                      />
                    )}
                  </label>
                  <label className="block space-y-1">
                    <span style={{ ...textStyles.body, color: colors.text }}>Post Code</span>
                    <input
                      value={addressForm.postCode}
                      onChange={(event) => setAddressForm((current) => ({ ...current, postCode: event.target.value }))}
                      className="w-full rounded border px-3 py-2 outline-none"
                      style={{ borderColor: colors.primary, backgroundColor: colors.white, color: "#1f2a36" }}
                    />
                  </label>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block space-y-1">
                    <span style={{ ...textStyles.body, color: colors.text }}>Country</span>
                    <select
                      value={addressForm.countryCode}
                      onChange={(event) =>
                        setAddressForm((current) => ({
                          ...current,
                          countryCode: event.target.value,
                          city: "",
                        }))
                      }
                      className="w-full rounded border px-3 py-2 outline-none"
                      style={{ borderColor: colors.primary, backgroundColor: colors.white, color: "#1f2a36" }}
                    >
                      {countries.map((country) => (
                        <option key={country.isoCode} value={country.isoCode}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
              <div className="mt-5 flex justify-end gap-2">
                <button type="button" className="rounded border px-4 py-2" onClick={closeModals} style={{ ...textStyles.body, borderColor: colors.border, color: colors.text }}>
                  Cancel
                </button>
                <button type="button" className="rounded px-4 py-2 text-white" onClick={closeModals} style={{ ...textStyles.body, backgroundColor: colors.primary }}>
                  Save Address
                </button>
              </div>
            </section>
          )}

        </div>
      )}
    </AppLayout>
  );
}
