import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../theme/themeContext";

const DEFAULT_ADMIN_DOCUMENT_TITLE = "Funzies Collection";

const adminLinks = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/settings", label: "Settings" },
];

export default function AdminLayout({ title, description, children }) {
  const { colors } = useTheme();

  useEffect(() => {
    const pageLabel = typeof title === "string" ? title.trim() : "";
    document.title = pageLabel ? `${pageLabel} | ${DEFAULT_ADMIN_DOCUMENT_TITLE}` : `Admin | ${DEFAULT_ADMIN_DOCUMENT_TITLE}`;
  }, [title]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <div className="mx-auto grid w-full max-w-[1200px] gap-4 p-4 md:grid-cols-[240px,1fr] md:p-6">
        <aside className="rounded-lg border p-4" style={{ borderColor: colors.border, backgroundColor: colors.panel }}>
          <p className="mb-4 text-lg font-semibold" style={{ color: colors.primary }}>
            Admin
          </p>
          <nav className="space-y-2">
            {adminLinks.map((item) => (
              <Link key={item.to} to={item.to} className="block rounded px-3 py-2 text-sm hover:opacity-90" style={{ color: colors.text, border: `1px solid ${colors.border}` }}>
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="space-y-4">
          <section className="rounded-lg border p-5" style={{ borderColor: colors.border, backgroundColor: colors.panel }}>
            <h1 className="text-2xl font-bold" style={{ color: colors.text }}>{title}</h1>
            <p className="mt-2 text-sm" style={{ color: colors.text }}>{description}</p>
          </section>
          {children}
        </main>
      </div>
    </div>
  );
}

