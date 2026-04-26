import AdminLayout from "./AdminLayout";

export default function AdminDashboardPage() {
  return (
    <AdminLayout title="Admin Dashboard" description="Quick overview of store performance and activity.">
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-lg border p-4"><p className="text-sm text-base-content/70">Orders Today</p><p className="mt-1 text-2xl font-semibold">24</p></article>
        <article className="rounded-lg border p-4"><p className="text-sm text-base-content/70">Revenue</p><p className="mt-1 text-2xl font-semibold">EUR 2,930</p></article>
        <article className="rounded-lg border p-4"><p className="text-sm text-base-content/70">New Users</p><p className="mt-1 text-2xl font-semibold">12</p></article>
        <article className="rounded-lg border p-4"><p className="text-sm text-base-content/70">Low Stock</p><p className="mt-1 text-2xl font-semibold">7</p></article>
      </section>
    </AdminLayout>
  );
}

