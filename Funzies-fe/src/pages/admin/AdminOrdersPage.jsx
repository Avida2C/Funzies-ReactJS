import AdminLayout from "./AdminLayout";

export default function AdminOrdersPage() {
  return (
    <AdminLayout title="Admin Orders" description="Track, filter, and update customer orders.">
      <section className="rounded-lg border p-4">
        <p className="text-sm text-base-content/80">Orders management page scaffold is ready for order status and fulfillment workflows.</p>
      </section>
    </AdminLayout>
  );
}

