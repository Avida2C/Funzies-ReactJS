import { Link } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import ThemedSurface from "../components/ThemedSurface";

export default function OrderConfirmedPage() {
  return (
    <AppLayout title="Order Confirmed" description="Your order was placed successfully.">
      <ThemedSurface className="p-8 text-center space-y-3">
        <p className="text-xl font-semibold">Thank you for your order.</p>
        <p className="text-base-content/70">Your order has been placed successfully and is being processed.</p>
        <Link className="btn btn-primary" to="/shop">Continue shopping</Link>
      </ThemedSurface>
    </AppLayout>
  );
}

