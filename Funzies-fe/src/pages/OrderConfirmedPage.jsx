import { Link } from "react-router-dom";
import AppLayout from "../components/AppLayout";

export default function OrderConfirmedPage() {
  return (
    <AppLayout title="Order Confirmed" description="Your order was placed successfully.">
      <section className="bg-base-100 rounded-box shadow p-8 text-center space-y-3">
        <p className="text-xl font-semibold">Thank you for your order.</p>
        <p className="text-base-content/70">Your order has been placed successfully and is being processed.</p>
        <Link className="btn btn-primary" to="/shop">Continue shopping</Link>
      </section>
    </AppLayout>
  );
}

