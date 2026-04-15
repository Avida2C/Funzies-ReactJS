import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FiFacebook,
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

function MobileBottomNav() {
  const { colors } = useTheme();
  const location = useLocation();
  const isShopRoute = location.pathname === "/shop";
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
          <Link to="/" className="flex flex-col items-center gap-1 py-2 text-xs" style={navItemStyle(location.pathname === "/")}>
            <FiHome size={16} />
            <span style={textStyles.caption}>Home</span>
          </Link>
        </li>
        <li>
          <Link
            to="/shop?category=1"
            className="flex flex-col items-center gap-1 py-2 text-xs"
            style={navItemStyle(isShopRoute && location.search.includes("category="))}
          >
            <FiList size={16} />
            <span style={textStyles.caption}>Categories</span>
          </Link>
        </li>
        <li>
          <Link
            to="/shop"
            className="flex flex-col items-center gap-1 py-2 text-xs"
            style={navItemStyle(isShopRoute && !location.search.includes("category="))}
          >
            <FiSearch size={16} />
            <span style={textStyles.caption}>Search</span>
          </Link>
        </li>
        <li>
          <Link to="/viewcart" className="flex flex-col items-center gap-1 py-2 text-xs" style={navItemStyle(location.pathname === "/viewcart")}>
            <FiShoppingCart size={16} />
            <span style={textStyles.caption}>Cart</span>
          </Link>
        </li>
        <li>
          <Link to="/account" className="flex flex-col items-center gap-1 py-2 text-xs" style={navItemStyle(location.pathname === "/account")}>
            <FiUser size={16} />
            <span style={textStyles.caption}>Account</span>
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
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
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

      <main className="mx-auto w-full max-w-[1200px] p-4 pb-24 md:p-6" style={{ backgroundColor: colors.panel }}>
        <div className={contentClassName}>
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
        <div className="mx-auto grid w-full max-w-[1200px] gap-6 px-4 py-8 md:grid-cols-2 md:px-6 lg:grid-cols-4">
          <div><h3 className="mb-2 text-lg font-semibold" style={{ color: colors.primary }}>Get to know us</h3><p className="text-sm" style={{ color: colors.text }}>About Us</p></div>
          <div><h3 className="mb-2 text-lg font-semibold" style={{ color: colors.primary }}>Customer service</h3><p className="text-sm" style={{ color: colors.text }}>Shipping Information</p></div>
          <div><h3 className="mb-2 text-lg font-semibold" style={{ color: colors.primary }}>Download the app</h3><p className="text-sm" style={{ color: colors.text }}>Track orders any time</p></div>
          <div>
            <h3 className="mb-2 text-lg font-semibold" style={{ color: colors.primary }}>Connect with Funzies</h3>
            <div className="mt-2 flex items-center gap-3" style={{ color: colors.text }}>
              <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook" className="footer-social-icon inline-flex h-8 w-8 items-center justify-center rounded border" style={{ borderColor: colors.border, "--footer-social-hover": colors.primary }}><FiFacebook size={16} /></a>
              <a href="https://twitter.com/" target="_blank" rel="noreferrer" aria-label="Twitter" className="footer-social-icon inline-flex h-8 w-8 items-center justify-center rounded border" style={{ borderColor: colors.border, "--footer-social-hover": colors.primary }}><FiTwitter size={16} /></a>
              <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram" className="footer-social-icon inline-flex h-8 w-8 items-center justify-center rounded border" style={{ borderColor: colors.border, "--footer-social-hover": colors.primary }}><FiInstagram size={16} /></a>
            </div>
          </div>
        </div>
      </footer>
      <MobileBottomNav />
    </div>
  );
}

