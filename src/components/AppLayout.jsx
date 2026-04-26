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
import { LuLightbulb, LuLightbulbOff } from "react-icons/lu";
import { textStyles } from "../theme/typography";
import { logoDarkMode, logoLightMode } from "../lib/storeData";
import { useTheme } from "../theme/themeContext";

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
      { label: "Privacy Policy & Terms of Use", to: "/privacy" },
      { label: "Trust & Safety", to: "/trust-safety" },
      { label: "Accessibility", to: "/accessibility" },
    ],
  },
];

function MobileBottomNav() {
  const { colors } = useTheme();
  const location = useLocation();
  const isShopRoute = location.pathname === "/shop";
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
            <FiShoppingCart size={16} />
            <span className={navLabelClassName} style={textStyles.caption}>Cart</span>
          </Link>
        </li>
        <li>
          <Link to="/account" className={navLinkClassName} style={navItemStyle(location.pathname === "/account")}>
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
  const location = useLocation();
  const navigate = useNavigate();
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
        <div className="mx-auto grid w-full max-w-[1200px] grid-cols-[auto,1fr,auto] items-center gap-3 px-4 py-3">
          <Link to="/" className="inline-flex items-center leading-none" aria-label="Funzies Collection home">
            <img src={mode === "dark" ? logoDarkMode : logoLightMode} alt="Funzies Collection" className="h-8 w-auto md:h-10" />
          </Link>
          <div className="hidden px-2 md:block">
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
            <Link to="/account" className="hover-accent inline-flex h-full items-center rounded px-3 text-xs font-semibold" style={{ border: `1px solid ${colors.border}`, color: colors.text }}>
              <span className="inline-flex items-center gap-1" style={textStyles.button}>
                <FiUser size={14} />
                Hello, Nadine
              </span>
            </Link>
            <Link to="/viewcart" className="hover-accent inline-flex h-full items-center rounded px-3 text-xs font-semibold" style={{ border: `1px solid ${colors.primary}`, color: colors.primary }}>
              <span className="inline-flex items-center gap-1" style={textStyles.button}>
                <FiShoppingCart size={14} />
                Cart (0)
              </span>
            </Link>
          </div>
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
          <section className="grid gap-8 lg:grid-cols-4">
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
            className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t pt-4 text-sm"
            style={{ borderColor: colors.primary, color: colors.text }}
          >
            <span>© Funzies Collection 2023. All Rights Reserved.</span>
          </section>
        </div>
      </footer>
      <MobileBottomNav />
    </div>
  );
}

