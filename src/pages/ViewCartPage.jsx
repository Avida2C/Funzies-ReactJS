import { Link } from "react-router-dom";
import { FiArrowRight, FiTrash2, FiX } from "react-icons/fi";
import AppLayout from "../components/AppLayout";
import QuantityControl from "../components/QuantityControl";
import ThemedSurface from "../components/ThemedSurface";
import { activeProducts, frontProductImage, price, resolveAssetPath } from "../lib/storeData";
import { useCart } from "../lib/cartContext";
import { useTheme } from "../theme/themeContext";

export default function ViewCartPage() {
  const { colors } = useTheme();
  const { cartItemIds, addToCart, decreaseCartItem, setCartItemQuantity, removeFromCart, clearCart } = useCart();

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
            <div key={item.product.ID} className="flex items-start justify-between border-b pb-3 last:border-0">
              <div className="flex items-center gap-3">
                <img
                  src={resolveAssetPath(item.product.Image) || frontProductImage}
                  alt={item.product.Name}
                  className="h-14 w-14 rounded object-cover"
                  loading="lazy"
                />
                <div className="space-y-2">
                  <Link
                    to={`/product-page/${item.product.ID}`}
                    className="font-semibold hover:underline"
                    style={{ color: colors.text }}
                  >
                    {item.product.Name.trim()}
                  </Link>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-base-content/80">Qty:</span>
                    <QuantityControl
                      value={item.quantity}
                      colors={colors}
                      onDecrease={() => decreaseCartItem(item.product.ID)}
                      onIncrease={() => addToCart(item.product.ID)}
                      onChange={(nextValue) => setCartItemQuantity(item.product.ID, nextValue)}
                      decrementAriaLabel={`Decrease quantity for ${item.product.Name.trim()}`}
                      incrementAriaLabel={`Increase quantity for ${item.product.Name.trim()}`}
                      inputAriaLabel={`Quantity for ${item.product.Name.trim()}`}
                    />
                  </div>
                </div>
              </div>
              <div className="ml-3 flex flex-col items-end gap-2">
                <p className="font-semibold">{price.format(item.product.Price * item.quantity)}</p>
                <button
                  type="button"
                  className="inline-flex h-7 items-center gap-1 rounded px-2 text-xs font-semibold text-white"
                  style={{ backgroundColor: colors.primary }}
                  onClick={() => removeFromCart(item.product.ID)}
                >
                  <FiX size={12} />
                  Remove
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-base-content/70">Your cart is empty.</p>
        )}
        <div className="flex justify-end text-lg font-bold">
          <span style={{ color: colors.text }}>
            Total: <span style={{ color: colors.primary }}>{price.format(total)}</span>
          </span>
        </div>
        {cartItems.length > 0 && (
          <div className="flex flex-wrap justify-end gap-2">
            <button
              type="button"
              className="inline-flex h-9 items-center justify-center gap-1 rounded px-3 text-xs font-semibold"
              style={{ border: `1px solid ${colors.border}`, color: colors.text }}
              onClick={clearCart}
            >
              <FiTrash2 size={12} />
              Clear Cart
            </button>
            <Link
              to="/checkout"
              className="hover-accent inline-flex h-9 items-center justify-center gap-1 rounded px-3 text-xs font-semibold"
              style={{ border: `1px solid ${colors.primary}`, color: colors.primary }}
            >
              <span className="inline-flex items-center gap-1 pl-1">
                Proceed to Checkout
                <FiArrowRight size={12} />
              </span>
            </Link>
          </div>
        )}
      </ThemedSurface>
    </AppLayout>
  );
}

