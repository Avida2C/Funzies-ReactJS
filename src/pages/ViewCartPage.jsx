import { Link } from "react-router-dom";
import { FiX } from "react-icons/fi";
import AppLayout from "../components/AppLayout";
import ThemedSurface from "../components/ThemedSurface";
import { activeProducts, frontProductImage, price, resolveAssetPath } from "../lib/storeData";
import { useCart } from "../lib/cartContext";
import { useTheme } from "../theme/themeContext";

export default function ViewCartPage() {
  const { colors } = useTheme();
  const { cartItemIds, addToCart, decreaseCartItem, setCartItemQuantity, removeFromCart } = useCart();

  const productCounts = cartItemIds.reduce((counts, productId) => {
    counts.set(productId, (counts.get(productId) ?? 0) + 1);
    return counts;
  }, new Map());

  const cartItems = [...productCounts.entries()]
    .map(([productId, quantity]) => {
      const product = activeProducts.find((item) => item.ID === productId);
      if (!product) {
        return null;
      }
      return { product, quantity };
    })
    .filter(Boolean);

  const total = cartItems.reduce((sum, item) => sum + item.product.Price * item.quantity, 0);

  return (
    <AppLayout title="Cart" description="Overview of selected items in your cart.">
      <ThemedSurface className="p-6 space-y-4">
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div key={item.product.ID} className="flex items-center justify-between border-b pb-3 last:border-0">
              <div className="flex items-center gap-3">
                <img
                  src={resolveAssetPath(item.product.Image) || frontProductImage}
                  alt={item.product.Name}
                  className="h-14 w-14 rounded object-cover"
                  loading="lazy"
                />
                <div className="space-y-2">
                  <p className="font-semibold">{item.product.Name.trim()}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-base-content/80">Qty:</span>
                    <button
                      type="button"
                      className="inline-flex h-7 w-7 items-center justify-center rounded border text-sm font-semibold"
                      style={{ borderColor: colors.border, color: colors.text }}
                      onClick={() => decreaseCartItem(item.product.ID)}
                      aria-label={`Decrease quantity for ${item.product.Name.trim()}`}
                    >
                      -
                    </button>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={item.quantity}
                      onChange={(event) => setCartItemQuantity(item.product.ID, event.target.value)}
                      className="h-8 w-16 rounded border px-2 text-sm"
                      style={{ borderColor: colors.border, backgroundColor: colors.background, color: colors.text }}
                      aria-label={`Quantity for ${item.product.Name.trim()}`}
                    />
                    <button
                      type="button"
                      className="inline-flex h-7 w-7 items-center justify-center rounded border text-sm font-semibold"
                      style={{ borderColor: colors.border, color: colors.text }}
                      onClick={() => addToCart(item.product.ID)}
                      aria-label={`Increase quantity for ${item.product.Name.trim()}`}
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className="ml-2 inline-flex h-7 items-center gap-1 rounded px-2 text-xs font-semibold text-white"
                      style={{ backgroundColor: colors.primary }}
                      onClick={() => removeFromCart(item.product.ID)}
                    >
                      <FiX size={12} />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
              <p className="font-semibold">{price.format(item.product.Price * item.quantity)}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-base-content/70">Your cart is empty.</p>
        )}
        <div className="flex items-center justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-primary">{price.format(total)}</span>
        </div>
        <Link to="/checkout" className="btn btn-primary">Proceed to checkout</Link>
      </ThemedSurface>
    </AppLayout>
  );
}

