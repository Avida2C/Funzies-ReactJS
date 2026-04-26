import AdminLayout from "./AdminLayout";

export default function AdminProductsPage() {
  return (
    <AdminLayout title="Admin Products" description="Manage product listings, stock levels, and pricing.">
      <section className="rounded-lg border p-4">
        <p className="text-sm text-base-content/80">Products management panel scaffold is ready. Connect this page to product CRUD APIs next.</p>
      </section>
    </AdminLayout>
  );
}

