import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminDataCell, AdminDataRow, AdminDataTable } from "../../components/admin/AdminDataTable";
import AdminApiBanner from "../../components/admin/AdminApiBanner";
import AdminModal from "../../components/admin/AdminModal";
import ThemedSurface from "../../components/ThemedSurface";
import ThemedSelect from "../../components/ThemedSelect";
import { useAdminTable } from "../../hooks/useAdminTable";
import { createRow, deleteRow, updateRow } from "../../lib/crudApi";
import { allOrderProductLines, formatEurValue } from "../../lib/funziesDataset";
import { useTheme } from "../../theme/themeContext";
import { textStyles } from "../../theme/typography";
import AdminLayout from "./AdminLayout";

function sortByIdDesc(list) {
  return [...list].sort((a, b) => (Number(b.ID) || 0) - (Number(a.ID) || 0));
}

/**
 * @param {number} orderId
 * @param {{ orderid: number, productid: number, quantity: number }[]} lines
 * @param {Map<number, { Price?: number }>} productById
 */
function computeSubtotalEurForOrder(orderId, lines, productById) {
  let s = 0;
  for (const line of lines) {
    if (line.orderid !== orderId) {
      continue;
    }
    const p = productById.get(line.productid);
    if (p) {
      s += (Number(p.Price) || 0) * (Number(line.quantity) || 0);
    }
  }
  return s;
}

/**
 * @param {{ value: string; onChange: (v: string) => void; id: string }} props
 */
function OrderDeletedSelect({ value, onChange, id }) {
  return (
    <ThemedSelect
      id={id}
      className="mb-3"
      size="sm"
      label="Order row state"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="0">Active (not deleted)</option>
      <option value="1">Deleted (soft)</option>
    </ThemedSelect>
  );
}

export default function AdminOrdersPage() {
  const { colors } = useTheme();
  const orderRows = useAdminTable("orders");
  const userRows = useAdminTable("user");
  const addressRows = useAdminTable("address");
  const statusRows = useAdminTable("orderstatus");
  const productRows = useAdminTable("product");

  const [modal, setModal] = useState(/** @type {null | "create" | "edit"} */ (null));
  const [editing, setEditing] = useState(/** @type {object | null} */ (null));
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(/** @type {string | null} */ (null));

  const [fUser, setFUser] = useState("2");
  const [fAddress, setFAddress] = useState("24");
  const [fStatus, setFStatus] = useState("1");
  const [fDel, setFDel] = useState("0");

  const userById = useMemo(() => {
    const m = new Map();
    for (const u of userRows.rows) {
      m.set(u.ID, u);
    }
    return m;
  }, [userRows.rows]);

  const productById = useMemo(() => {
    const m = new Map();
    for (const p of productRows.rows) {
      m.set(p.ID, p);
    }
    return m;
  }, [productRows.rows]);

  const orderStatusById = useMemo(() => {
    const m = new Map();
    for (const s of statusRows.rows) {
      m.set(s.ID, s);
    }
    return m;
  }, [statusRows.rows]);

  const activeUsers = useMemo(
    () => userRows.rows.filter((u) => u.Deleted === 0).sort((a, b) => a.ID - b.ID),
    [userRows.rows],
  );

  const activeStatusesAsc = useMemo(
    () => statusRows.rows.filter((s) => s.Deleted === 0).sort((a, b) => a.ID - b.ID),
    [statusRows.rows],
  );

  const allStatusesForForm = useMemo(
    () => [...statusRows.rows].sort((a, b) => a.ID - b.ID),
    [statusRows.rows],
  );

  const addressesForSelectedUser = useMemo(() => {
    const uid = Number.parseInt(fUser, 10);
    if (Number.isNaN(uid)) {
      return [];
    }
    return addressRows.rows
      .filter((a) => a.User === uid && a.Deleted === 0)
      .sort((a, b) => a.ID - b.ID);
  }, [addressRows.rows, fUser]);

  const ordersSorted = useMemo(() => sortByIdDesc(orderRows.rows), [orderRows.rows]);

  const coreListError =
    orderRows.error || userRows.error || addressRows.error || statusRows.error;
  const canMutate = !orderRows.error && !userRows.error && !addressRows.error && !statusRows.error;

  const openCreate = useCallback(() => {
    setFormError(null);
    setEditing(null);
    const u0 = activeUsers[0];
    setFUser(String(u0?.ID ?? ""));
    const uid = u0?.ID;
    const a0 = uid
      ? addressRows.rows
          .filter((a) => a.User === uid && a.Deleted === 0)
          .sort((a, b) => a.ID - b.ID)[0]
      : null;
    setFAddress(String(a0?.ID ?? ""));
    const s0 = activeStatusesAsc[0] ?? allStatusesForForm[0];
    setFStatus(String(s0?.ID ?? "1"));
    setFDel("0");
    setModal("create");
  }, [activeUsers, addressRows.rows, activeStatusesAsc, allStatusesForForm]);

  const openEdit = useCallback(
    (o) => {
      setFormError(null);
      setEditing(o);
      setFUser(String(o.user));
      setFAddress(String(o.address));
      setFStatus(String(o.status));
      setFDel(o.deleted ? "1" : "0");
      setModal("edit");
    },
    [],
  );

  useEffect(() => {
    if (modal == null) {
      return;
    }
    if (addressesForSelectedUser.length === 0) {
      return;
    }
    if (!addressesForSelectedUser.some((a) => String(a.ID) === fAddress)) {
      setFAddress(String(addressesForSelectedUser[0].ID));
    }
  }, [modal, fUser, fAddress, addressesForSelectedUser]);

  const saveOrder = async () => {
    setSaving(true);
    setFormError(null);
    try {
      const user = Number.parseInt(fUser, 10);
      const address = Number.parseInt(fAddress, 10);
      const status = Number.parseInt(fStatus, 10);
      const del = Number.parseInt(fDel, 10) ? 1 : 0;
      if (Number.isNaN(user) || Number.isNaN(address) || Number.isNaN(status)) {
        throw new Error("User, address, and order status are required (numbers).");
      }
      const aRow = addressRows.rows.find((x) => x.ID === address);
      if (aRow && aRow.User !== user) {
        throw new Error("The selected address must belong to the selected user.");
      }
      if (!aRow) {
        throw new Error("Invalid address id.");
      }
      const body = { user, address, status, deleted: del };
      if (modal === "create") {
        await createRow("orders", body);
      } else if (modal === "edit" && editing) {
        await updateRow("orders", editing.ID, body);
      }
      setModal(null);
      await orderRows.refresh();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const removeOrder = async (o) => {
    if (!window.confirm(`Soft-delete order #${o.ID}? You can set it back to active by editing and clearing deleted.`)) {
      return;
    }
    try {
      await deleteRow("orders", o.ID, { hard: false });
      await orderRows.refresh();
    } catch (e) {
      window.alert(e instanceof Error ? e.message : "Delete failed");
    }
  };

  return (
    <AdminLayout
      title="Admin orders"
      description="Create, edit, and remove order rows. Subtotals: bundled `order_product` lines × product price from the API. Run `npm run dev:api` (or `npm run dev:stack`)"
    >
      {coreListError ? <AdminApiBanner error={coreListError} entityLabel="order tables (API)" /> : null}
      {productRows.error ? <AdminApiBanner error={productRows.error} entityLabel="products (subtotals may be incomplete)" /> : null}

      <ThemedSurface bordered className="p-4 sm:p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold" style={{ ...textStyles.sectionTitle, color: colors.text }}>
            Orders
          </h2>
          <button
            type="button"
            className="rounded border px-3 py-1.5 text-sm font-medium"
            style={{ borderColor: colors.primary, color: colors.background, backgroundColor: colors.primary }}
            onClick={openCreate}
            disabled={!canMutate || saving || activeUsers.length === 0}
          >
            + New order
          </button>
        </div>
        <p className="mb-3" style={{ ...textStyles.bodySm, color: colors.text, opacity: 0.8 }}>
          {orderRows.loading
            ? "Loading…"
            : `${ordersSorted.length} order row(s). Subtotals: \`order_product\` from the app bundle × prices from the product list above (API or bundle).`}
        </p>
        <AdminDataTable
          caption={`${ordersSorted.length} order row(s)`}
          columns={[
            { id: "id", label: "ID" },
            { id: "when", label: "Created" },
            { id: "status", label: "Status" },
            { id: "user", label: "User" },
            { id: "addr", label: "Address" },
            { id: "sub", label: "Subtotal" },
            { id: "del", label: "Del" },
            { id: "act", label: "" },
          ]}
        >
          {ordersSorted.map((o) => {
            const st = orderStatusById.get(o.status);
            const u = userById.get(o.user);
            const sub = computeSubtotalEurForOrder(o.ID, allOrderProductLines, productById);
            const addr = addressRows.rows.find((a) => a.ID === o.address);
            return (
              <AdminDataRow key={o.ID}>
                <AdminDataCell className="whitespace-nowrap font-mono text-sm">{o.ID}</AdminDataCell>
                <AdminDataCell className="whitespace-nowrap text-xs sm:text-sm">{o.created}</AdminDataCell>
                <AdminDataCell>{st?.Status ?? o.status}</AdminDataCell>
                <AdminDataCell>
                  {u ? (
                    <span className="line-clamp-2">
                      {u.Email}
                      <span className="ml-1 text-xs opacity-80">(id {u.ID})</span>
                    </span>
                  ) : (
                    o.user
                  )}
                </AdminDataCell>
                <AdminDataCell>
                  {addr ? (
                    <span className="line-clamp-1 text-sm">
                      {o.address} — {addr.City}
                    </span>
                  ) : (
                    o.address
                  )}
                </AdminDataCell>
                <AdminDataCell className="whitespace-nowrap">{formatEurValue(sub)}</AdminDataCell>
                <AdminDataCell className="text-sm">{o.deleted ? "Yes" : "No"}</AdminDataCell>
                <AdminDataCell className="whitespace-nowrap">
                  <div className="flex flex-col gap-1 sm:flex-row sm:gap-2">
                    <button
                      type="button"
                      className="text-left text-sm underline"
                      style={{ color: colors.primary }}
                      onClick={() => openEdit(o)}
                      disabled={!canMutate}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="text-left text-sm underline opacity-90"
                      style={{ color: colors.text }}
                      onClick={() => removeOrder(o)}
                      disabled={!canMutate}
                    >
                      Delete
                    </button>
                  </div>
                </AdminDataCell>
              </AdminDataRow>
            );
          })}
        </AdminDataTable>
      </ThemedSurface>

      <AdminModal
        open={modal != null}
        onClose={() => {
          if (!saving) {
            setModal(null);
          }
        }}
        title={modal === "create" ? "New order" : "Edit order"}
        size="lg"
        footer={
          <>
            <button
              type="button"
              className="rounded border px-3 py-1.5"
              style={{ borderColor: colors.border, color: colors.text, backgroundColor: colors.background }}
              onClick={() => setModal(null)}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded border px-3 py-1.5 font-medium"
              style={{ borderColor: colors.primary, color: colors.background, backgroundColor: colors.primary }}
              onClick={saveOrder}
              disabled={saving}
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </>
        }
      >
        {formError ? <p className="mb-3 text-sm text-red-600 dark:text-red-400">{formError}</p> : null}
        {modal === "edit" && editing ? (
          <p className="mb-3 text-sm" style={{ color: colors.text, opacity: 0.85 }}>
            Order <strong>#{editing.ID}</strong> — created {editing.created} · last updated {editing.updated}
          </p>
        ) : null}
        <ThemedSelect
          className="mb-3"
          size="sm"
          label="User"
          value={fUser}
          onChange={(e) => {
            setFUser(e.target.value);
            setFAddress("");
          }}
          disabled={activeUsers.length === 0}
        >
          {activeUsers.length === 0 ? (
            <option value="">— No users —</option>
          ) : (
            activeUsers.map((u) => (
              <option key={u.ID} value={u.ID}>
                {u.Email} (#{u.ID})
              </option>
            ))
          )}
        </ThemedSelect>
        <ThemedSelect
          className="mb-3"
          size="sm"
          label="Address (for selected user)"
          value={fAddress}
          onChange={(e) => setFAddress(e.target.value)}
          disabled={addressesForSelectedUser.length === 0}
        >
          {addressesForSelectedUser.length === 0 ? (
            <option value="">— No address for this user —</option>
          ) : (
            addressesForSelectedUser.map((a) => (
              <option key={a.ID} value={a.ID}>
                {a.City} — {a.Street} (#{a.ID})
              </option>
            ))
          )}
        </ThemedSelect>
        <ThemedSelect
          className="mb-3"
          size="sm"
          label="Order status"
          value={fStatus}
          onChange={(e) => setFStatus(e.target.value)}
          disabled={allStatusesForForm.length === 0}
        >
          {allStatusesForForm.length === 0 ? (
            <option value="">—</option>
          ) : (
            allStatusesForForm.map((s) => (
              <option key={s.ID} value={s.ID}>
                {s.Status} (#{s.ID}){s.Deleted ? " (deleted in dataset)" : ""}
              </option>
            ))
          )}
        </ThemedSelect>
        <OrderDeletedSelect value={fDel} onChange={setFDel} id="ord-del" />
        <p className="mt-3 text-sm" style={{ color: colors.text, opacity: 0.8 }}>
          Status, user, or address changes update the server <code className="rounded bg-black/5 px-1">updated</code> time. Line
          products/quantities are still edited in <code className="rounded bg-black/5 px-1">order_product</code> in the data
          file (or a future API).
        </p>
      </AdminModal>
    </AdminLayout>
  );
}
