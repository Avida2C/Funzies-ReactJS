import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
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
import { BsCartFill } from "react-icons/bs";
import { LuLightbulb, LuLightbulbOff } from "react-icons/lu";
import { textStyles } from "../theme/typography";
import { logoDarkMode, logoLightMode } from "../lib/storeData";
import { useTheme } from "../theme/themeContext";
import { useCart } from "../lib/cartContext";
import { useAuth } from "../lib/authContext";

/** Scroll padding so the page clears the fixed `MobileBottomNav` (matches its row: py-2 + icon + labels + border). */
const MOBILE_BOTTOM_NAV_SCROLL_PADDING =
  "max(3.75rem, calc(env(safe-area-inset-bottom, 0px) + 3.25rem))";

const FOOTER_LINK_COLUMNS = [
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
    title: "Company",
    titleTo: "/company",
    items: [
      { label: "About Us", to: "/about-us" },
      { label: "Careers", to: "/careers" },
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

const FOOTER_SECURITY_CERTIFICATIONS = [
  { label: "Trustly secured", src: "https://www.figma.com/api/mcp/asset/2792fe29-8936-4e86-affd-c950b0313414", width: 39 },
  { label: "Visa secured", src: "https://www.figma.com/api/mcp/asset/0f6eee51-5aa9-46cb-b379-9a276c529722", width: 29 },
  { label: "Mastercard identity check", src: "https://www.figma.com/api/mcp/asset/3e2a382b-05c9-42b7-959e-3d10442aa58f", width: 61 },
  { label: "SafeKey", src: "https://www.figma.com/api/mcp/asset/6f115673-864e-4a7a-b2a9-881c27ec303a", width: 61 },
  { label: "Protect buy", src: "https://www.figma.com/api/mcp/asset/19db8e0e-dd8e-4b44-a23a-9fe1505d5cce", width: 39 },
  { label: "JCB secured", src: "https://www.figma.com/api/mcp/asset/4886e1d5-2b8b-404a-bcea-78873307aad2", width: 39 },
  { label: "PCI certified", src: "https://www.figma.com/api/mcp/asset/23fab86c-09dd-4d7c-bf7f-f9e8778c857e", width: 61 },
];

const FOOTER_PAYMENT_METHODS = [
  { label: "PayPal", src: "https://www.figma.com/api/mcp/asset/05d48617-45db-4dda-a09e-413793242ef1", width: 38 },
  { label: "Visa", src: "https://www.figma.com/api/mcp/asset/e151541f-be3b-4c94-ac13-c792e201ecb3", width: 38 },
  { label: "Mastercard", src: "https://www.figma.com/api/mcp/asset/bec9bfc6-751f-4bb7-bdd1-1c54afa3fa53", width: 38 },
  { label: "American Express", src: "https://www.figma.com/api/mcp/asset/00edbf29-a405-4fc7-96c7-7eb0348a3620", width: 39 },
  { label: "Discover", src: "https://www.figma.com/api/mcp/asset/49613c20-2376-4e6d-81f5-cd5d7b8841b8", width: 39 },
  { label: "Apple Pay", src: "https://www.figma.com/api/mcp/asset/c6cb4305-4c24-43fa-8235-9e4ef558fa7a", width: 39 },
  { label: "Google Pay", src: "https://www.figma.com/api/mcp/asset/3a600c16-aa87-4dc6-847c-50098e747571", width: 39 },
];

function MobileBottomNav() {
  const { colors } = useTheme();
  const { cartCount } = useCart();
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const isShopRoute = location.pathname === "/shop";
  const accountRoute = isAuthenticated ? "/account" : "/login";
  const navLinkClassName = "flex h-[56px] flex-col items-center justify-center gap-1 px-1 text-xs";
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
            <FiHome size={16} />
            <span className={navLabelClassName} style={textStyles.caption}>Home</span>
          </Link>
        </li>
        <li>
          <Link
            to="/shop"
            className={navLinkClassName}
            style={navItemStyle(isShopRoute)}
          >
            <FiList size={16} />
            <span className={navLabelClassName} style={textStyles.caption}>Categories</span>
          </Link>
        </li>
        <li>
          <Link to="/wishlist" className={navLinkClassName} style={navItemStyle(location.pathname === "/wishlist")}>
            <FiHeart size={16} />
            <span className={navLabelClassName} style={textStyles.caption}>Wishlist</span>
          </Link>
        </li>
        <li>
          <Link to="/viewcart" className={navLinkClassName} style={navItemStyle(location.pathname === "/viewcart")}>
            <span className="relative inline-flex">
              {cartCount > 0 ? <BsCartFill size={16} /> : <FiShoppingCart size={16} />}
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
            <FiUser size={16} />
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
  const searchTextColor = mode === "dark" ? "#1f2a36" : colors.text;
  const searchPlaceholderColor = mode === "dark" ? "#6b7280" : "#9ca3af";

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
            <form onSubmit={submitSearch} className="flex h-9 w-full items-center overflow-hidden rounded border" style={{ borderColor: colors.primary, backgroundColor: colors.white }}>
              <input
                type="text"
                placeholder="Search products"
                className="top-search-input h-full w-full bg-transparent px-3 text-sm outline-none"
                style={{ color: searchTextColor, caretColor: searchTextColor }}
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
              <style>{`.top-search-input::placeholder { color: ${searchPlaceholderColor}; opacity: 1; }`}</style>
              <button type="submit" className="px-3 text-sm" style={{ color: colors.primary }} aria-label="Search">
                <FiSearch size={16} />
              </button>
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
          <form
            onSubmit={submitSearch}
            className="flex h-9 w-full items-center overflow-hidden rounded border"
            style={{ borderColor: colors.primary, backgroundColor: colors.white }}
          >
            <input
              type="text"
              placeholder="Search products"
              className="top-search-input h-full w-full bg-transparent px-3 text-sm outline-none"
              style={{ color: searchTextColor, caretColor: searchTextColor }}
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            <style>{`.top-search-input::placeholder { color: ${searchPlaceholderColor}; opacity: 1; }`}</style>
            <button type="submit" className="px-3 text-sm" style={{ color: colors.primary }} aria-label="Search">
              <FiSearch size={16} />
            </button>
          </form>
        </div>
      </header>

      <main
        className="mx-auto w-full max-w-[1200px] p-4 pb-6 md:px-6 md:pt-6 md:pb-6"
        style={{ backgroundColor: colors.panel }}
      >
        <div className={`${contentClassName} [&_p]:max-w-[70ch] [&_li]:max-w-[70ch]`}>
          {showPageHeader && (
            <section className="rounded-box p-5 shadow" style={{ backgroundColor: colors.background }}>
              <h1 className="text-3xl font-bold" style={{ ...textStyles.title, color: colors.text }}>{title}</h1>
              <p className="mt-2" style={{ ...textStyles.body, color: colors.text }}>{description}</p>
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
                <h3 className="mb-3 text-lg font-semibold">
                  <Link to={column.titleTo} className="hover:underline" style={{ color: colors.primary }}>
                    {column.title}
                  </Link>
                </h3>
                <ul className="space-y-2">
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
              <div className="mt-2 flex items-center gap-3" style={{ color: colors.text }}>
                <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook" className="footer-social-icon inline-flex h-8 w-8 items-center justify-center rounded border" style={{ borderColor: colors.border, "--footer-social-hover": colors.primary }}><FiFacebook size={16} /></a>
                <a href="https://twitter.com/" target="_blank" rel="noreferrer" aria-label="Twitter" className="footer-social-icon inline-flex h-8 w-8 items-center justify-center rounded border" style={{ borderColor: colors.border, "--footer-social-hover": colors.primary }}><FiTwitter size={16} /></a>
                <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram" className="footer-social-icon inline-flex h-8 w-8 items-center justify-center rounded border" style={{ borderColor: colors.border, "--footer-social-hover": colors.primary }}><FiInstagram size={16} /></a>
              </div>
            </div>
          </section>

          <section
            className="mt-8 grid gap-6 px-1 md:grid-cols-2"
          >
            <div>
              <h4 className="mb-2 text-xl font-semibold" style={{ color: colors.primary }}>Security certification</h4>
              <div className="flex flex-wrap items-center gap-2">
                {FOOTER_SECURITY_CERTIFICATIONS.map((item) => (
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
                {FOOTER_PAYMENT_METHODS.map((item) => (
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

