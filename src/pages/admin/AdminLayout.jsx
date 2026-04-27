import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { LuLightbulb, LuLightbulbOff } from "react-icons/lu";
import { FiExternalLink, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { useAuth } from "../../lib/authContext";
import { useTheme } from "../../theme/themeContext";
import { textStyles } from "../../theme/typography";
import { logoDarkMode, logoLightMode } from "../../lib/storeData";
import ThemedSurface from "../../components/ThemedSurface";

const DEFAULT_ADMIN_DOCUMENT_TITLE = "Funzies Collection";

const adminLinks = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/catalog", label: "Catalog" },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/reviews", label: "Reviews" },
  { to: "/admin/website-content", label: "Website content" },
  { to: "/admin/careers", label: "Careers" },
  { to: "/admin/settings", label: "Data & settings" },
];

export default function AdminLayout({ title, description, children, contentClassName = "space-y-6" }) {
  const { colors, mode, toggleTheme } = useTheme();
  const { signOutAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const pageTitleText = typeof title === "string" ? title.trim() : "";
  const pageDescriptionText = typeof description === "string" ? description.trim() : "";

  useEffect(() => {
    document.title = pageTitleText
      ? `${pageTitleText} | ${DEFAULT_ADMIN_DOCUMENT_TITLE}`
      : `Admin | ${DEFAULT_ADMIN_DOCUMENT_TITLE}`;
  }, [pageTitleText]);

  const handleSignOut = () => {
    signOutAdmin();
    navigate("/admin/login", { replace: true });
  };

  const closeMobileNav = () => setMobileNavOpen(false);

  useEffect(() => {
    closeMobileNav();
  }, [pageTitleText]);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") closeMobileNav();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileNavOpen]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <header className="border-b" style={{ borderColor: colors.border, backgroundColor: colors.background }}>
        <div className="mx-auto flex w-full max-w-[1200px] flex-wrap items-center justify-between gap-3 px-4 py-3 md:flex-nowrap">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <button
              type="button"
              className="hover-accent inline-flex h-10 w-10 items-center justify-center rounded border md:hidden"
              style={{ borderColor: colors.border, color: colors.text, backgroundColor: colors.panel }}
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open navigation menu"
            >
              <FiMenu size={18} aria-hidden />
            </button>
            <Link to="/" className="inline-flex shrink-0 items-center leading-none" aria-label="Funzies Collection home">
              <img src={mode === "dark" ? logoDarkMode : logoLightMode} alt="Funzies Collection" className="h-10 w-auto" />
            </Link>
            <span
              className="hidden rounded border px-2.5 py-1 sm:inline-flex"
              style={{ ...textStyles.caption, borderColor: colors.border, color: colors.primary, backgroundColor: colors.panel }}
            >
              Admin
            </span>
          </div>
          <div className="flex h-9 w-full items-stretch justify-end gap-2 sm:w-auto">
            <Link
              to="/"
              className="hover-accent inline-flex h-full min-w-0 flex-1 items-center justify-center gap-1.5 rounded border px-3 sm:flex-initial"
              style={{ borderColor: colors.border, color: colors.text, backgroundColor: colors.panel, ...textStyles.button }}
            >
              <span className="truncate">Back to store</span>
              <FiExternalLink size={14} className="shrink-0" aria-hidden />
            </Link>
            <button
              type="button"
              className="hover-accent inline-flex h-full items-center rounded border px-3"
              onClick={toggleTheme}
              style={{ borderColor: colors.border, color: colors.text, backgroundColor: colors.panel }}
            >
              <span className="inline-flex items-center gap-1" style={textStyles.button}>
                {mode === "dark" ? <LuLightbulbOff size={14} /> : <LuLightbulb size={14} />}
                {mode === "dark" ? "Light" : "Dark"}
              </span>
            </button>
            <button
              type="button"
              className="hover-accent inline-flex h-full items-center gap-1.5 rounded border px-3"
              onClick={handleSignOut}
              style={{ borderColor: colors.border, color: colors.text, backgroundColor: colors.panel, ...textStyles.button }}
            >
              <FiLogOut size={14} aria-hidden />
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Mobile navigation drawer */}
      {mobileNavOpen ? (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Admin navigation">
          <button
            type="button"
            className="absolute inset-0"
            style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
            onClick={closeMobileNav}
            aria-label="Close navigation menu"
          />
          <div
            className="absolute left-0 top-0 h-full w-[82vw] max-w-[320px] border-r"
            style={{ borderColor: colors.border, backgroundColor: colors.panel }}
          >
            <div className="flex items-center justify-between gap-2 border-b p-4" style={{ borderColor: colors.border }}>
              <p className="font-semibold" style={{ ...textStyles.body, color: colors.text }}>
                Navigation
              </p>
              <button
                type="button"
                className="hover-accent inline-flex h-9 w-9 items-center justify-center rounded border"
                style={{ borderColor: colors.border, color: colors.text, backgroundColor: colors.background }}
                onClick={closeMobileNav}
                aria-label="Close navigation menu"
              >
                <FiX size={18} aria-hidden />
              </button>
            </div>
            <div className="p-4">
              <nav className="flex flex-col gap-2" aria-label="Admin">
                {adminLinks.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={closeMobileNav}
                    className={({ isActive }) =>
                      `rounded-box border px-3 py-2 transition-colors ${isActive ? "font-semibold" : "font-medium opacity-90 hover:opacity-100"}`
                    }
                    style={({ isActive }) => ({
                      ...textStyles.bodySm,
                      borderColor: isActive ? colors.primary : colors.border,
                      color: isActive ? colors.primary : colors.text,
                      backgroundColor: isActive ? colors.background : "transparent",
                    })}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        </div>
      ) : null}

      <main
        className="mx-auto w-full max-w-[1200px] p-4 pb-6 md:px-6 md:pt-6 md:pb-6"
        style={{ backgroundColor: colors.panel }}
      >
        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-[minmax(0,220px)_1fr] lg:grid-cols-[minmax(0,240px)_1fr]">
          <aside className="hidden h-fit space-y-2 md:block">
            <ThemedSurface bordered className="p-4">
              <p className="mb-3" style={{ ...textStyles.sectionTitle, color: colors.primary }}>
                Navigation
              </p>
              <nav className="flex flex-col gap-2" aria-label="Admin">
                {adminLinks.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `rounded-box border px-3 py-2 transition-colors ${isActive ? "font-semibold" : "font-medium opacity-90 hover:opacity-100"}`
                    }
                    style={({ isActive }) => ({
                      ...textStyles.bodySm,
                      borderColor: isActive ? colors.primary : colors.border,
                      color: isActive ? colors.primary : colors.text,
                      backgroundColor: isActive ? colors.background : "transparent",
                    })}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </ThemedSurface>
          </aside>

          <div className={`min-w-0 ${contentClassName}`}>
            {pageTitleText && (
              <ThemedSurface className="p-5">
                <h1 className="text-xl font-bold sm:text-2xl" style={{ ...textStyles.title, color: colors.text }}>
                  {pageTitleText}
                </h1>
                {pageDescriptionText ? (
                  <p className="mt-2" style={{ ...textStyles.body, color: colors.text }}>
                    {pageDescriptionText}
                  </p>
                ) : null}
              </ThemedSurface>
            )}
            {children}
          </div>
        </div>
      </main>

      <footer className="border-t" style={{ borderColor: colors.border, backgroundColor: colors.background }}>
        <div
          className="mx-auto flex w-full max-w-[1200px] flex-col items-start justify-between gap-2 px-4 py-6 sm:flex-row sm:items-center md:px-6"
          style={{ ...textStyles.bodySm, color: colors.text }}
        >
          <span>© Funzies Collection. Admin area.</span>
          <Link to="/" className="font-semibold underline hover:opacity-90" style={{ color: colors.primary }}>
            Return to storefront
          </Link>
        </div>
      </footer>
    </div>
  );
}
