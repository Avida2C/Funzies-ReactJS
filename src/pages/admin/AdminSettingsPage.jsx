import AdminLayout from "./AdminLayout";

export default function AdminSettingsPage() {
  return (
    <AdminLayout title="Admin Settings" description="Configure store-level settings and admin preferences.">
      <section className="rounded-lg border p-4">
        <p className="text-sm text-base-content/80">Settings page scaffold is ready for payment, shipping, tax, and general store configuration.</p>
      </section>
    </AdminLayout>
  );
}

