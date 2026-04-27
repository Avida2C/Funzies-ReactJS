import { useMemo, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { textStyles } from "../../../theme/typography";
import ThemedButton from "../../../components/ThemedButton";
import ThemedTextBox from "../../../components/ThemedTextBox";
import { InfoCard } from "../AccountSectionPrimitives";
import { allOrderProductLines, productById } from "../../../lib/funziesDataset";
import { getProductCardImageUrl } from "../../../lib/productImages";

export default function OrdersReturnsSection({
  colors,
  mutedText,
  orderFilters,
  orderFilter,
  setOrderFilter,
  filteredOrders,
  orderStatusById,
  computeOrderSubtotalEur,
  formatEurValue,
  orderLoading = false,
  orderError = null,
  onCancelOrder = null,
}) {
  const getStatusBadgeStyle = (statusId) => {
    switch (Number(statusId)) {
      case 1: // Order Received
        return { backgroundColor: "#2563eb", color: "#ffffff" };
      case 4: // Processing
        return { backgroundColor: "#f59e0b", color: "#111827" };
      case 7: // Shipped
        return { backgroundColor: "#dc2626", color: "#ffffff" };
      case 8: // Delivered
        return { backgroundColor: "#16a34a", color: "#ffffff" };
      default:
        return { backgroundColor: colors.primary, color: "#ffffff" };
    }
  };

  const [selectedOrderId, setSelectedOrderId] = useState(/** @type {number | null} */ (null));

  const thumbnailsByOrderId = useMemo(() => {
    const linesByOrder = new Map();
    for (const line of allOrderProductLines) {
      const oid = Number(line.orderid);
      if (!linesByOrder.has(oid)) {
        linesByOrder.set(oid, []);
      }
      linesByOrder.get(oid).push(line);
    }

    const out = new Map();
    for (const o of filteredOrders) {
      const oid = Number(o.ID);
      const lines = linesByOrder.get(oid) ?? [];
      const seen = new Set();
      const thumbs = [];
      for (const l of lines) {
        const p = productById.get(l.productid);
        if (!p) continue;
        // Uniqueness should be by product, not by URL (different products can share the same placeholder image).
        if (seen.has(Number(l.productid))) continue;
        seen.add(Number(l.productid));
        const url = getProductCardImageUrl(p);
        if (!url) continue;
        thumbs.push(url);
        if (thumbs.length >= 4) break;
      }
      out.set(oid, thumbs);
    }
    return out;
  }, [filteredOrders]);

  const selectedOrder = useMemo(() => {
    if (!selectedOrderId) return null;
    return filteredOrders.find((o) => Number(o.ID) === selectedOrderId) ?? null;
  }, [filteredOrders, selectedOrderId]);

  const selectedLines = useMemo(() => {
    if (!selectedOrder) return [];
    return allOrderProductLines.filter((l) => Number(l.orderid) === Number(selectedOrder.ID));
  }, [selectedOrder]);

  const lineItems = useMemo(() => {
    const byProductId = new Map();
    for (const l of selectedLines) {
      const p = productById.get(l.productid);
      if (!p) continue;
      const pid = Number(l.productid);
      const qty = Number(l.quantity) || 0;
      const unit = Number(p.Price) || 0;
      const current = byProductId.get(pid);
      if (!current) {
        byProductId.set(pid, {
          productId: pid,
          name: String(p.Name ?? `#${pid}`),
          qty,
          unit,
          total: unit * qty,
        });
        continue;
      }
      current.qty += qty;
      current.total = current.unit * current.qty;
    }
    return Array.from(byProductId.values());
  }, [selectedLines]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          {orderFilters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setOrderFilter(filter)}
              className={`pb-1 ${filter === orderFilter ? "border-b" : ""}`}
              style={{ ...textStyles.body, color: filter === orderFilter ? colors.primary : mutedText, borderColor: colors.primary }}
            >
              {filter}
            </button>
          ))}
        </div>
        <ThemedTextBox
          size="sm"
          className="w-full max-w-[300px]"
          placeholder="Item name / Order ID"
          inputClassName="text-base"
          endAdornment={
            <span className="flex items-center px-3">
              <FiSearch size={18} style={{ color: colors.primary }} />
            </span>
          }
          aria-label="Search orders"
        />
      </div>
      {orderLoading ? <p style={{ ...textStyles.bodySm, color: mutedText }}>Loading…</p> : null}
      {orderError ? <p style={{ ...textStyles.bodySm, color: mutedText }}>API: {orderError}</p> : null}
      {filteredOrders.length === 0 ? (
        <InfoCard>
          <p style={{ ...textStyles.body, color: mutedText }}>No orders yet.</p>
        </InfoCard>
      ) : (
        filteredOrders.map((order) => {
          const st = orderStatusById.get(order.status);
          const statusLabel = st?.Status ?? order.status;
          const subtotal = computeOrderSubtotalEur(order.ID);
          const isCancelled = String(statusLabel).toLowerCase().includes("cancel");
          const statusId = Number(order.status);
          const isShippedOrDelivered = statusId === 7 || statusId === 8;
          const canCancel = Boolean(onCancelOrder) && !isCancelled && !isShippedOrDelivered;
          return (
            <InfoCard key={order.ID} className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <p style={{ ...textStyles.sectionTitle, color: colors.text }}>Order #{order.ID}</p>
                <span
                  className="rounded-box px-3 py-1"
                  style={{ ...textStyles.button, ...getStatusBadgeStyle(order.status) }}
                >
                  {statusLabel}
                </span>
              </div>
              {(() => {
                const thumbs = thumbnailsByOrderId.get(Number(order.ID)) ?? [];
                if (!thumbs.length) return null;
                return (
                  <div className="flex flex-wrap items-center gap-2">
                    {thumbs.map((src, idx) => (
                      <img
                        key={`${order.ID}-${idx}`}
                        src={src}
                        alt=""
                        className="h-12 w-12 rounded border object-cover"
                        style={{ borderColor: colors.border, backgroundColor: colors.panel }}
                        loading="lazy"
                      />
                    ))}
                  </div>
                );
              })()}
              <div className="grid grid-cols-1 gap-3 rounded-box p-3 md:grid-cols-3" style={{ backgroundColor: colors.panel }}>
                <div>
                  <p style={{ ...textStyles.bodySm, color: mutedText }}>Created</p>
                  <p style={{ ...textStyles.body, color: colors.text }}>{order.created}</p>
                </div>
                <div>
                  <p style={{ ...textStyles.bodySm, color: mutedText }}>Updated</p>
                  <p style={{ ...textStyles.body, color: colors.text }}>{order.updated}</p>
                </div>
                <div>
                  <p style={{ ...textStyles.bodySm, color: mutedText }}>Subtotal</p>
                  <p style={{ ...textStyles.sectionTitle, fontSize: "20px", color: colors.text }}>{formatEurValue(subtotal)}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <ThemedButton
                  variant="redOutline"
                  size="sm"
                  onClick={() => setSelectedOrderId(Number(order.ID))}
                >
                  Order details
                </ThemedButton>
                {canCancel ? (
                  <ThemedButton
                    variant="redSolid"
                    size="sm"
                    onClick={() => {
                      if (!window.confirm(`Cancel order #${order.ID}?`)) return;
                      onCancelOrder(Number(order.ID));
                    }}
                  >
                    Cancel order
                  </ThemedButton>
                ) : null}
              </div>
            </InfoCard>
          );
        })
      )}

      {selectedOrder ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close modal backdrop"
            className="absolute inset-0"
            onClick={() => setSelectedOrderId(null)}
            style={{ backgroundColor: "rgba(15, 23, 36, 0.6)" }}
          />
          <section
            className="relative w-full max-w-[720px] rounded-box border p-5 shadow-xl"
            style={{ backgroundColor: colors.background, borderColor: colors.border }}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 style={{ ...textStyles.sectionTitle, color: colors.primary }}>Order #{selectedOrder.ID}</h3>
                <p style={{ ...textStyles.bodySm, color: mutedText }}>
                  Created {selectedOrder.created} · Updated {selectedOrder.updated}
                </p>
              </div>
              <span
                className="rounded-box px-3 py-1"
                style={{ ...textStyles.button, ...getStatusBadgeStyle(selectedOrder.status) }}
              >
                {orderStatusById.get(selectedOrder.status)?.Status ?? selectedOrder.status}
              </span>
            </div>

            <div className="mt-4 space-y-2">
              {lineItems.length === 0 ? (
                <InfoCard>
                  <p style={{ ...textStyles.body, color: mutedText }}>No product lines found for this order.</p>
                </InfoCard>
              ) : (
                lineItems.map((li) => (
                  <div key={li.productId} className="flex items-center justify-between gap-3 rounded border px-3 py-2" style={{ borderColor: colors.border }}>
                    <div className="min-w-0">
                      <p className="truncate" style={{ ...textStyles.body, color: colors.text, fontWeight: 600 }}>{li.name}</p>
                      <p style={{ ...textStyles.bodySm, color: mutedText }}>
                        Qty {li.qty} · Unit {formatEurValue(li.unit)}
                      </p>
                    </div>
                    <p className="whitespace-nowrap" style={{ ...textStyles.body, color: colors.text }}>
                      {formatEurValue(li.total)}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p style={{ ...textStyles.bodySm, color: mutedText }}>Subtotal</p>
                <p style={{ ...textStyles.sectionTitle, color: colors.text }}>{formatEurValue(computeOrderSubtotalEur(selectedOrder.ID))}</p>
              </div>
              <div className="flex gap-2">
                <ThemedButton variant="redOutline" size="md" onClick={() => setSelectedOrderId(null)}>
                  Close
                </ThemedButton>
                {(() => {
                  const statusId = Number(selectedOrder.status);
                  const statusLabel = orderStatusById.get(selectedOrder.status)?.Status ?? selectedOrder.status;
                  const isCancelled = String(statusLabel).toLowerCase().includes("cancel");
                  const isShippedOrDelivered = statusId === 7 || statusId === 8;
                  const canCancel = Boolean(onCancelOrder) && !isCancelled && !isShippedOrDelivered;
                  if (!canCancel) {
                    return null;
                  }
                  return (
                    <ThemedButton
                      variant="redSolid"
                      size="md"
                      onClick={() => {
                        if (!window.confirm(`Cancel order #${selectedOrder.ID}?`)) return;
                        onCancelOrder(Number(selectedOrder.ID));
                      }}
                    >
                      Cancel order
                    </ThemedButton>
                  );
                })()}
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}

