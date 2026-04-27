import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  FiFacebook,
  FiHeart,
  FiHome,
  FiInstagram,
  FiList,
  FiSearch,
  FiShoppingCart,
  FiTwitter,
  FiUser,
} from "react-icons/fi";
import { LuLightbulb, LuLightbulbOff } from "react-icons/lu";
import { SiX } from "react-icons/si";
import { textStyles } from "../theme/typography";
import { logoDarkMode, logoLightMode } from "../lib/storeData";
import { useTheme } from "../theme/themeContext";
import {
  COMPANY_SOCIAL_LINKS,
  FOOTER_PAYMENT_METHODS,
  FOOTER_SECURITY_CERTIFICATIONS,
} from "../data/companyPageData";
import { useCart } from "../lib/cartContext";
import { useAuth } from "../lib/authContext";
import { usePublicSettings } from "../hooks/usePublicSettings";
import ThemedTextField from "./ThemedTextField";

/** Scroll padding so the page clears the fixed `MobileBottomNav` (matches its height incl. safe area). */
const MOBILE_BOTTOM_NAV_SCROLL_PADDING =
  "max(4.5rem, calc(env(safe-area-inset-bottom, 0px) + 4rem))";

const DEFAULT_DOCUMENT_TITLE = "Funzies Collection";

const FOOTER_LINK_COLUMNS = [
  {
    title: "Company",
    titleTo: "/company",
    showFooterLogo: true,
    items: [{ label: "Careers", to: "/careers" }],
  },
  {
    title: "Help Center",
    titleTo: "/help-center",
    items: [
      { label: "Return & Refund Policy", to: "/return-refund-policy" },
      { label: "Shipping Information", to: "/shipping-information" },
      { label: "Purchase Protection", to: "/purchase-protection" },
    ],
  },
  {
    title: "Legal",
    titleTo: "/legal",
    items: [
      { label: "Trust & Safety", to: "/trust-safety" },
      { label: "Accessibility", to: "/accessibility" },
    ],
  },
];

const FOOTER_SOCIAL_ICONS = {
  facebook: FiFacebook,
  x: SiX,
  instagram: FiInstagram,
  twitter: FiTwitter,
};

function safeParseJson(value, fallback) {
  if (value == null || value === "") return fallback;
  try {
    const parsed = JSON.parse(String(value));
    return parsed == null ? fallback : parsed;
  } catch {
    return fallback;
  }
}

function MobileBottomNav() {
  const { colors } = useTheme();
  const { cartCount } = useCart();
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const isShopRoute = location.pathname === "/shop";
  const accountRoute = isAuthenticated ? "/account" : "/login";
  // ~120% sizing vs previous: taller bar + slightly larger labels/icons for easier tapping.
  const navLinkClassName = "flex h-[68px] flex-col items-center justify-center gap-1.5 px-1 text-sm";
  const navLabelClassName = "whitespace-nowrap leading-none";
  const navItemStyle = (isActive) => ({
    color: isActive ? colors.primary : colors.text,
    fontWeight: isActive ? 700 : 500,
  });

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t backdrop-blur"
      style={{ borderColor: colors.border, backgroundColor: `${colors.panel}f2` }}
    >
      <ul className="mx-auto grid max-w-[1200px] grid-cols-5">
        <li>
          <Link to="/" className={navLinkClassName} style={navItemStyle(location.pathname === "/")}>
            <FiHome size={19} />
            <span className={navLabelClassName} style={textStyles.caption}>Home</span>
          </Link>
        </li>
        <li>
          <Link
            to="/shop"
            className={navLinkClassName}
            style={navItemStyle(isShopRoute)}
          >
            <FiList size={19} />
            <span className={navLabelClassName} style={textStyles.caption}>Categories</span>
          </Link>
        </li>
        <li>
          <Link to="/wishlist" className={navLinkClassName} style={navItemStyle(location.pathname === "/wishlist")}>
            <FiHeart size={19} />
            <span className={navLabelClassName} style={textStyles.caption}>Wishlist</span>
          </Link>
        </li>
        <li>
          <Link to="/viewcart" className={navLinkClassName} style={navItemStyle(location.pathname === "/viewcart")}>
            <span className="relative inline-flex">
              <FiShoppingCart size={19} />
              {cartCount > 0 && (
                <span
                  className="absolute -right-2 -top-2 inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] leading-none text-white"
                  style={{ backgroundColor: "#ef4444" }}
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </span>
            <span className={navLabelClassName} style={textStyles.caption}>Cart</span>
          </Link>
        </li>
        <li>
          <Link to={accountRoute} className={navLinkClassName} style={navItemStyle(location.pathname === accountRoute)}>
            <FiUser size={19} />
            <span className={navLabelClassName} style={textStyles.caption}>Account</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default function AppLayout({ title, description, children, showPageHeader = true, contentClassName = "space-y-6" }) {
  const { colors, mode, toggleTheme } = useTheme();
  const { cartCount } = useCart();
  const { isAuthenticated, displayName } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const accountRoute = isAuthenticated ? "/account" : "/login";
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") ?? "");

  const publicContent = usePublicSettings([
    "content.company.social_links",
    "content.footer.security_certifications",
    "content.footer.payment_methods",
  ]);
  const footerSocialLinks = useMemo(
    () => safeParseJson(publicContent.values["content.company.social_links"], COMPANY_SOCIAL_LINKS),
    [publicContent.values],
  );
  const footerSecurityCerts = useMemo(
    () => safeParseJson(publicContent.values["content.footer.security_certifications"], FOOTER_SECURITY_CERTIFICATIONS),
    [publicContent.values],
  );
  const footerPaymentMethods = useMemo(
    () => safeParseJson(publicContent.values["content.footer.payment_methods"], FOOTER_PAYMENT_METHODS),
    [publicContent.values],
  );

  const pageTitleText = typeof title === "string" ? title.trim() : "";
  const pageDescriptionText = typeof description === "string" ? description.trim() : "";
  const shouldRenderPageHeader = showPageHeader && (pageTitleText || pageDescriptionText);

  useEffect(() => {
    document.title = pageTitleText ? `${pageTitleText} | ${DEFAULT_DOCUMENT_TITLE}` : DEFAULT_DOCUMENT_TITLE;
  }, [pageTitleText]);

  useEffect(() => {
    setSearchTerm(searchParams.get("q") ?? "");
  }, [location.pathname, searchParams]);

  const submitSearch = (event) => {
    event.preventDefault();
    const trimmed = searchTerm.trim();
    const params = new URLSearchParams();
    if (trimmed) {
      params.set("q", trimmed);
    }
    navigate(trimmed ? `/shop?${params.toString()}` : "/shop");
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: colors.background, paddingBottom: MOBILE_BOTTOM_NAV_SCROLL_PADDING }}
    >
      <header className="border-b" style={{ borderColor: colors.border, backgroundColor: colors.background }}>
        <div className="mx-auto hidden w-full max-w-[1200px] grid-cols-[auto,1fr,auto] items-center gap-3 px-4 py-3 md:grid">
          <Link to="/" className="inline-flex items-center leading-none" aria-label="Funzies Collection home">
            <img src={mode === "dark" ? logoDarkMode : logoLightMode} alt="Funzies Collection" className="h-10 w-auto" />
          </Link>
          <div className="px-2">
            <form onSubmit={submitSearch} className="w-full">
              <ThemedTextField
                size="sm"
                className="w-full"
                placeholder="Search products"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                aria-label="Search products"
                endAdornment={
                  <button
                    type="submit"
                    className="flex h-full items-center px-3 text-sm"
                    style={{ color: colors.primary }}
                    aria-label="Search"
                  >
                    <FiSearch size={16} />
                  </button>
                }
              />
            </form>
          </div>
          <div className="flex h-9 items-stretch gap-2">
            <button
              type="button"
              className="hover-accent inline-flex h-full items-center rounded border px-3 text-xs"
              onClick={toggleTheme}
              style={{ borderColor: colors.border, color: colors.text, backgroundColor: colors.panel }}
            >
              <span className="inline-flex items-center gap-1" style={textStyles.button}>
                {mode === "dark" ? <LuLightbulbOff size={14} /> : <LuLightbulb size={14} />}
                {mode === "dark" ? "Light" : "Dark"}
              </span>
            </button>
            <Link to={accountRoute} className="hover-accent inline-flex h-full items-center rounded px-3 text-xs font-semibold" style={{ border: `1px solid ${colors.border}`, color: colors.text }}>
              <span className="inline-flex items-center gap-1" style={textStyles.button}>
                <FiUser size={14} />
                {`Hello, ${displayName}`}
              </span>
            </Link>
            <Link to="/viewcart" className="hover-accent inline-flex h-full items-center rounded px-3 text-xs font-semibold" style={{ border: `1px solid ${colors.primary}`, color: colors.primary }}>
              <span className="inline-flex items-center gap-1.5" style={textStyles.button}>
                <span className="relative inline-flex h-[14px] w-[14px] items-center justify-center">
                  <FiShoppingCart size={14} />
                  {cartCount > 0 && (
                    <span
                      className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border"
                      style={{ backgroundColor: "#ef4444", borderColor: colors.background }}
                    />
                  )}
                </span>
                Cart
              </span>
            </Link>
          </div>
        </div>
        <div className="mx-auto w-full max-w-[1200px] px-4 py-3 md:hidden">
          <form onSubmit={submitSearch} className="w-full">
            <ThemedTextField
              size="sm"
              className="w-full"
              placeholder="Search products"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              aria-label="Search products"
              endAdornment={
                <button
                  type="submit"
                  className="flex h-full items-center px-3 text-sm"
                  style={{ color: colors.primary }}
                  aria-label="Search"
                >
                  <FiSearch size={16} />
                </button>
              }
            />
          </form>
        </div>
      </header>

      <main
        className="mx-auto w-full max-w-[1200px] p-4 pb-6 md:px-6 md:pt-6 md:pb-6"
        style={{ backgroundColor: colors.panel }}
      >
        <div className={`${contentClassName} [&_p]:max-w-[70ch] [&_li]:max-w-[70ch]`}>
          {shouldRenderPageHeader && (
            <section className="rounded-box p-5 shadow" style={{ backgroundColor: colors.background }}>
              {pageTitleText ? (
                <h1 className="text-3xl font-bold" style={{ ...textStyles.title, color: colors.text }}>
                  {pageTitleText}
                </h1>
              ) : null}
              {pageDescriptionText ? (
                <p className="mt-2" style={{ ...textStyles.body, color: colors.text }}>
                  {pageDescriptionText}
                </p>
              ) : null}
            </section>
          )}
          {children}
        </div>
      </main>

      <footer className="border-t" style={{ borderColor: colors.border, backgroundColor: colors.background }}>
        <div className="mx-auto w-full max-w-[1200px] px-4 py-8 md:px-6">
          <section className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {FOOTER_LINK_COLUMNS.map((column) => (
              <div key={column.title}>
                {column.showFooterLogo && (
                  <Link
                    to="/"
                    className="mb-4 inline-flex items-center leading-none"
                    aria-label="Funzies Collection home"
                  >
                    <img
                      src={mode === "dark" ? logoDarkMode : logoLightMode}
                      alt="Funzies Collection"
                      className="h-10 w-auto"
                    />
                  </Link>
                )}
                <h3 className="mb-1 text-lg font-semibold">
                  <Link to={column.titleTo} className="hover:underline" style={{ color: colors.primary }}>
                    {column.title}
                  </Link>
                </h3>
                <ul className="space-y-1">
                  {column.items.map((item) => (
                    <li key={`${column.title}-${item.label}`} className="text-sm">
                      <Link to={item.to} className="hover:underline" style={{ color: colors.text }}>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <h3 className="mb-2 text-lg font-semibold" style={{ color: colors.primary }}>Connect with Funzies</h3>
              <div className="mt-2 flex flex-wrap items-center gap-3" style={{ color: colors.text }}>
                {footerSocialLinks.map((s) => {
                  const Icon = FOOTER_SOCIAL_ICONS[s.id] ?? FOOTER_SOCIAL_ICONS.facebook;
                  return (
                    <a
                      key={s.id}
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={s.name}
                      className="footer-social-icon inline-flex h-8 w-8 items-center justify-center rounded border"
                      style={{ borderColor: colors.border, "--footer-social-hover": colors.primary }}
                    >
                      <Icon size={16} aria-hidden />
                    </a>
                  );
                })}
              </div>
            </div>
          </section>

          <section
            className="mt-8 grid gap-6 px-1 md:grid-cols-2"
          >
            <div>
              <h4 className="mb-2 text-xl font-semibold" style={{ color: colors.primary }}>Security certification</h4>
              <div className="flex flex-wrap items-center gap-2">
                {footerSecurityCerts.map((item) => (
                  <img
                    key={item.label}
                    src={item.src}
                    alt={item.label}
                    className="h-[25px] object-contain"
                    style={{ width: `${item.width}px` }}
                  />
                ))}
              </div>
            </div>
            <div>
              <h4 className="mb-2 text-xl font-semibold" style={{ color: colors.primary }}>We accept</h4>
              <div className="flex flex-wrap items-center gap-2">
                {footerPaymentMethods.map((item) => (
                  <img
                    key={item.label}
                    src={item.src}
                    alt={item.label}
                    className="h-[26px] object-contain"
                    style={{ width: `${item.width}px` }}
                  />
                ))}
              </div>
            </div>
          </section>

          <section
            className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t pt-4 text-sm"
            style={{ borderColor: colors.primary, color: colors.text }}
          >
            <span>© Funzies Collection 2023. All Rights Reserved.</span>
            <Link to="/privacy" className="underline" style={{ color: colors.text }}>
              Privacy Policy & Terms of Use
            </Link>
          </section>
        </div>
      </footer>
      <MobileBottomNav />
    </div>
  );
}

