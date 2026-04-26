import { Link } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import ThemedSurface from "../components/ThemedSurface";
import { activeProducts, price } from "../lib/storeData";

export default function ViewCartPage() {
  const cartItems = activeProducts.slice(0, 3);
  const total = cartItems.reduce((sum, item) => sum + item.Price, 0);

  return (
    <AppLayout title="Cart" description="Overview of selected items in your cart.">
      <ThemedSurface className="p-6 space-y-4">
        {cartItems.map((item) => (
          <div key={item.ID} className="flex items-center justify-between border-b pb-3 last:border-0">
            <div>
              <p className="font-semibold">{item.Name.trim()}</p>
              <p className="text-sm text-base-content/70">Qty: 1</p>
            </div>
            <p className="font-semibold">{price.format(item.Price)}</p>
          </div>
        ))}
        <div className="flex items-center justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-primary">{price.format(total)}</span>
        </div>
        <Link to="/checkout" className="btn btn-primary">Proceed to checkout</Link>
      </ThemedSurface>
    </AppLayout>
  );
}

