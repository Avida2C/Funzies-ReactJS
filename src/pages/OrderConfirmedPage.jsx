import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import ThemedSurface from "../components/ThemedSurface";
import { price, resolveAssetPath, frontProductImage } from "../lib/storeData";
import { useTheme } from "../theme/themeContext";
import { useCart } from "../lib/cartContext";
import ThemedButton from "../components/ThemedButton";

export default function OrderConfirmedPage() {
  const location = useLocation();
  const { colors } = useTheme();
  const { clearCart } = useCart();
  
  const order = location.state?.order;

  useEffect(() => {
    if (order) {
      clearCart();
    }
  }, [order, clearCart]);

  const safeOrder = order && typeof order === "object" ? order : null;
  const safeCustomer = safeOrder?.customer && typeof safeOrder.customer === "object" ? safeOrder.customer : null;
  const items = Array.isArray(safeOrder?.cartItems) ? safeOrder.cartItems : [];

  const totals = useMemo(() => {
    if (!safeOrder) {
      return { subtotal: 0, shipping: 0, tax: 0, total: 0 };
    }
    return {
      subtotal: Number(safeOrder.subtotal) || 0,
      shipping: Number(safeOrder.shipping) || 0,
      tax: Number(safeOrder.tax) || 0,
      total: Number(safeOrder.total) || 0,
    };
  }, [safeOrder]);

  const hardNavigate = (to) => {
    // replace() drops the current history entry so Back cannot return to /order-confirmed
    window.location.replace(to);
  };

  return (
    <AppLayout title="Order Confirmed" description="Your order was placed successfully." showPageHeader={false}>
      <div className="mx-auto w-full max-w-6xl space-y-6 py-10">
        <ThemedSurface className="p-6 md:p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold md:text-3xl" style={{ color: colors.text }}>
                Your Order has been Confirmed!
              </h1>
              <p className="text-base-content/70">
                {safeOrder
                  ? "Thank you for your order. We’ll email you a confirmation and keep you updated as it ships."
                  : "Your confirmation details aren’t available on this page."}
              </p>
              {safeOrder ? (
                <p className="text-sm text-base-content/60">
                  Order ID <span className="font-semibold text-base-content">{safeOrder.orderId}</span>
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <ThemedButton
                type="button"
                onClick={() => hardNavigate("/account")}
                variant="primary"
                size="md"
                className="min-h-11"
              >
                Go to account
              </ThemedButton>
              <ThemedButton
                type="button"
                onClick={() => hardNavigate("/shop")}
                variant="outline"
                size="md"
                className="min-h-11"
              >
                Continue shopping
              </ThemedButton>
            </div>
          </div>
        </ThemedSurface>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
          <ThemedSurface className="p-6 md:p-8">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-semibold" style={{ color: colors.text }}>
                Delivery details
              </h2>
              <p className="text-sm text-base-content/60">
                Review where your order is heading and how we can reach you.
              </p>
            </div>
            {safeCustomer ? (
              <div className="mt-5 space-y-4">
                <div className="rounded-box border border-base-300 p-4" style={{ backgroundColor: colors.panel }}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-base-content/60">Full name</p>
                      <p className="text-base-content">{safeCustomer.name || "—"}</p>
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <p className="text-xs font-semibold text-base-content/60">Address</p>
                      <p className="text-base-content whitespace-pre-line">
                        {[
                          safeCustomer.address,
                          [safeCustomer.city, safeCustomer.zip].filter(Boolean).join(" "),
                          safeCustomer.country,
                        ]
                          .filter((line) => typeof line === "string" && line.trim())
                          .join("\n") || "—"}
                      </p>
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <p className="text-xs font-semibold text-base-content/60">Phone</p>
                      <p className="text-base-content">{safeCustomer.phone || "—"}</p>
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <p className="text-xs font-semibold text-base-content/60">Email</p>
                      <p className="text-base-content break-words">{safeCustomer.email || "—"}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <ThemedButton
                    type="button"
                    onClick={() => hardNavigate("/contact")}
                    variant="outline"
                    size="md"
                    className="min-h-11"
                  >
                    Need help? Contact support
                  </ThemedButton>
                  <ThemedButton
                    type="button"
                    onClick={() => hardNavigate("/shop")}
                    variant="primary"
                    size="md"
                    className="min-h-11"
                  >
                    Shop more
                  </ThemedButton>
                </div>
              </div>
            ) : (
              <p className="mt-3 text-base-content/70">No delivery details available.</p>
            )}
          </ThemedSurface>

          <ThemedSurface className="space-y-4 p-6 md:p-8">
            <h2 className="text-xl font-semibold text-center" style={{ color: colors.text }}>
              Order Summary
            </h2>

            {safeOrder ? (
              <div className="rounded-box p-4" style={{ backgroundColor: colors.panel }}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-base-content/60">Order ID</p>
                    <p className="font-semibold text-base-content">{safeOrder.orderId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-base-content/60">Order Date</p>
                    <p className="font-semibold text-base-content">{safeOrder.date}</p>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
              {items.length > 0 ? (
                items.map((item, idx) => (
                  <div key={`${item?.id ?? "item"}-${idx}`} className="flex gap-3 rounded-box p-3" style={{ backgroundColor: colors.panel }}>
                    <img
                      src={resolveAssetPath(item?.image) || frontProductImage}
                      alt={item?.name || "Item"}
                      className="h-14 w-14 rounded object-cover bg-white"
                      loading="lazy"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="truncate text-sm text-base-content">{item?.name || "Item"}</p>
                        <p className="shrink-0 text-sm font-semibold text-base-content">x{item?.quantity ?? 1}</p>
                      </div>
                      <p className="mt-1 text-sm font-semibold" style={{ color: colors.primary }}>
                        {price.format(Number(item?.price) || 0)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-base-content/70">No items to show.</p>
              )}
            </div>

            {safeOrder ? (
              <div className="border-t border-base-300 pt-4">
                <div className="space-y-2 text-sm text-base-content/80">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium text-base-content">{price.format(totals.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-medium text-base-content">{price.format(totals.shipping)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span className="font-medium text-base-content">{price.format(totals.tax)}</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t pt-3" style={{ borderColor: colors.primary }}>
                  <span className="font-semibold text-base-content">Order Total</span>
                  <span className="text-lg font-bold" style={{ color: colors.primary }}>
                    {price.format(totals.total)}
                  </span>
                </div>
              </div>
            ) : null}
          </ThemedSurface>
        </div>
      </div>
    </AppLayout>
  );
}
