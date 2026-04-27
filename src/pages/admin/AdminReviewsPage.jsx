import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AdminDataCell, AdminDataRow, AdminDataTable } from "../../components/admin/AdminDataTable";
import AdminApiBanner from "../../components/admin/AdminApiBanner";
import AdminModal from "../../components/admin/AdminModal";
import ThemedSurface from "../../components/ThemedSurface";
import ThemedSelect from "../../components/ThemedSelect";
import ThemedTextField from "../../components/ThemedTextField";
import { useAdminTable } from "../../hooks/useAdminTable";
import { createRow, deleteRow, updateRow } from "../../lib/crudApi";
import { activeProducts } from "../../lib/storeData";
import { useTheme } from "../../theme/themeContext";
import { textStyles } from "../../theme/typography";
import AdminLayout from "./AdminLayout";

function nowSqlish() {
  return new Date().toISOString().replace("T", " ").slice(0, 19);
}

function sortByIdDesc(list) {
  return [...list].sort((a, b) => (Number(b.ID) || 0) - (Number(a.ID) || 0));
}

export default function AdminReviewsPage() {
  const { colors } = useTheme();
  const [query, setQuery] = useState("");
  const statuses = useAdminTable("reviewstatus");
  const reviews = useAdminTable("review");

  const [stModal, setStModal] = useState(/** @type {null | "create" | "edit"} */ (null));
  const [editingSt, setEditingSt] = useState(/** @type {object | null} */ (null));
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(/** @type {string | null} */ (null));
  const [fStatus, setFStatus] = useState("");
  const [fDeleted, setFDeleted] = useState("0");

  const [revModal, setRevModal] = useState(/** @type {null | "edit"} */ (null));
  const [editingRev, setEditingRev] = useState(/** @type {object | null} */ (null));
  const [revError, setRevError] = useState(/** @type {string | null} */ (null));

  const [rProductId, setRProductId] = useState("");
  const [rUser, setRUser] = useState("");
  const [rDate, setRDate] = useState(nowSqlish().slice(0, 10));
  const [rRating, setRRating] = useState("5");
  const [rText, setRText] = useState("");
  const [rStatusId, setRStatusId] = useState("1");
  const [rDeleted, setRDeleted] = useState("0");

  const productById = useMemo(() => {
    const m = new Map();
    for (const p of activeProducts) {
      m.set(p.ID, p);
    }
    return m;
  }, []);

  const statusById = useMemo(() => {
    const m = new Map();
    for (const s of statuses.rows) {
      m.set(s.ID, s);
    }
    return m;
  }, [statuses.rows]);

  const awaitingApprovalStatusId = useMemo(() => {
    const target = "awaiting approval";
    const row = statuses.rows.find((s) => String(s.Status ?? "").trim().toLowerCase() === target);
    return row ? Number(row.ID) : null;
  }, [statuses.rows]);

  const reviewsSorted = useMemo(() => sortByIdDesc(reviews.rows), [reviews.rows]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = !q
      ? reviewsSorted
      : reviewsSorted.filter((r) => {
          const pid = String(r.ProductId ?? r.productId ?? "");
          const u = String(r.User ?? r.user ?? "").toLowerCase();
          const txt = String(r.Text ?? r.text ?? "").toLowerCase();
          const stId = String(r.StatusId ?? r.statusId ?? "");
          const stLabel = String(statusById.get(Number(stId))?.Status ?? "").toLowerCase();
          const pName = String(productById.get(Number(pid))?.Name ?? "").toLowerCase();
          return pid === q || pid.includes(q) || u.includes(q) || txt.includes(q) || stId === q || stLabel.includes(q) || pName.includes(q);
        });

    // Put "Awaiting Approval" at the top, then the rest by newest ID.
    return [...list].sort((a, b) => {
      const aSid = Number(a.StatusId ?? a.statusId);
      const bSid = Number(b.StatusId ?? b.statusId);
      const aIsAwait = awaitingApprovalStatusId != null && aSid === awaitingApprovalStatusId;
      const bIsAwait = awaitingApprovalStatusId != null && bSid === awaitingApprovalStatusId;
      if (aIsAwait !== bIsAwait) {
        return aIsAwait ? -1 : 1;
      }
      return (Number(b.ID) || 0) - (Number(a.ID) || 0);
    });
  }, [query, reviewsSorted, awaitingApprovalStatusId, statusById, productById]);

  const statusesSorted = useMemo(
    () => [...statuses.rows].sort((a, b) => (Number(a.ID) || 0) - (Number(b.ID) || 0)),
    [statuses.rows],
  );
  const canMutate = !statuses.error && !reviews.error;

  const openCreateStatus = useCallback(() => {
    setFormError(null);
    setEditingSt(null);
    setFStatus("");
    setFDeleted("0");
    setStModal("create");
  }, []);

  const openEditStatus = useCallback((row) => {
    setFormError(null);
    setEditingSt(row);
    setFStatus(String(row.Status ?? ""));
    setFDeleted(row.Deleted ? "1" : "0");
    setStModal("edit");
  }, []);

  const saveStatus = async () => {
    setSaving(true);
    setFormError(null);
    try {
      const body = {
        Status: fStatus.trim(),
        Deleted: Number.parseInt(fDeleted, 10) || 0,
      };
      if (!body.Status) {
        throw new Error("Status text is required.");
      }
      if (stModal === "create") {
        await createRow("reviewstatus", body);
      } else if (stModal === "edit" && editingSt) {
        await updateRow("reviewstatus", editingSt.ID, body);
      }
      setStModal(null);
      await statuses.refresh();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const removeStatus = async (row) => {
    if (!window.confirm(`Delete review status #${row.ID} “${row.Status}”?`)) {
      return;
    }
    try {
      await deleteRow("reviewstatus", row.ID, { hard: false });
      await statuses.refresh();
    } catch (e) {
      window.alert(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const openEditReview = useCallback((row) => {
    setRevError(null);
    setEditingRev(row);
    setRProductId(String(row.ProductId ?? row.productId ?? ""));
    setRUser(String(row.User ?? row.user ?? ""));
    setRDate(String(row.Date ?? row.date ?? nowSqlish().slice(0, 10)).slice(0, 10));
    setRRating(String(row.Rating ?? row.rating ?? "5"));
    setRText(String(row.Text ?? row.text ?? ""));
    setRStatusId(String(row.StatusId ?? row.statusId ?? "1"));
    setRDeleted(String(Number(row.Deleted ?? row.deleted) ? 1 : 0));
    setRevModal("edit");
  }, []);

  const saveReview = async () => {
    setSaving(true);
    setRevError(null);
    try {
      if (!editingRev) {
        throw new Error("Select a review to edit first.");
      }
      const productId = Number.parseInt(rProductId, 10);
      const rating = Number.parseInt(rRating, 10);
      const statusId = Number.parseInt(rStatusId, 10);
      const deleted = Number.parseInt(rDeleted, 10) ? 1 : 0;
      if (Number.isNaN(productId) || productId < 1) {
        throw new Error("Product ID must be a positive integer.");
      }
      if (!rUser.trim()) {
        throw new Error("Reviewer name is required.");
      }
      if (!rText.trim()) {
        throw new Error("Review text is required.");
      }
      if (Number.isNaN(rating) || rating < 1 || rating > 5) {
        throw new Error("Rating must be an integer from 1 to 5.");
      }
      if (Number.isNaN(statusId) || statusId < 1) {
        throw new Error("Status is required.");
      }
      const body = {
        ProductId: productId,
        User: rUser.trim(),
        Date: rDate.trim() || nowSqlish().slice(0, 10),
        Rating: rating,
        Text: rText.trim(),
        StatusId: statusId,
        Deleted: deleted,
      };
      await updateRow("review", editingRev.ID, body);
      setRevModal(null);
      await reviews.refresh();
    } catch (e) {
      setRevError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const removeReview = async (row) => {
    if (!window.confirm(`Soft-delete review #${row.ID}?`)) {
      return;
    }
    try {
      await deleteRow("review", row.ID, { hard: false });
      await reviews.refresh();
    } catch (e) {
      window.alert(e instanceof Error ? e.message : "Delete failed");
    }
  };

  return (
    <AdminLayout
      title="Product reviews"
      description="Manage reviews through the local Funzies API (`review`). “Awaiting Approval” is pinned to the top."
    >
      {statuses.error ? <AdminApiBanner error={statuses.error} entityLabel="review statuses (API)" /> : null}
      {reviews.error ? <AdminApiBanner error={reviews.error} entityLabel="reviews (API)" /> : null}

      <ThemedSurface bordered className="p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p style={{ ...textStyles.body, color: colors.text, opacity: 0.9 }}>
            Edit and soft-delete review rows in the API.
          </p>
        </div>
        <ThemedTextField
          className="mt-4 max-w-md"
          size="sm"
          label="Filter"
          placeholder="Product ID, product name, reviewer, status, or review text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
        />
        <p className="mt-2" style={{ ...textStyles.bodySm, color: colors.text, opacity: 0.75 }}>
          {reviews.loading ? "Loading…" : `Showing ${filtered.length} of ${reviewsSorted.length} row(s) (API).`}
        </p>
      </ThemedSurface>

      <AdminDataTable
        caption="Reviews (API; “Awaiting Approval” pinned to top)"
        columns={[
          { id: "id", label: "ID" },
          { id: "pid", label: "Product" },
          { id: "status", label: "Status" },
          { id: "user", label: "User" },
          { id: "date", label: "Date" },
          { id: "rating", label: "Rating" },
          { id: "text", label: "Review" },
          { id: "del", label: "Del" },
          { id: "act", label: "" },
        ]}
      >
        {filtered.map((row) => {
          const pid = Number(row.ProductId ?? row.productId);
          const p = productById.get(pid);
          const statusId = Number(row.StatusId ?? row.statusId);
          const st = statusById.get(statusId);
          return (
            <AdminDataRow key={row.ID}>
              <AdminDataCell className="whitespace-nowrap font-mono text-sm align-top">{row.ID}</AdminDataCell>
              <AdminDataCell className="align-top">
              <Link
                to={`/product-page/${pid}`}
                className="font-mono text-sm font-medium underline"
                style={{ color: colors.primary }}
                target="_blank"
                rel="noreferrer"
              >
                #{pid}
              </Link>
              <div
                className="mt-0.5 max-w-[8rem] truncate text-xs sm:max-w-[12rem]"
                style={{ color: colors.text }}
                title={p?.Name}
              >
                {p?.Name ?? "—"}
              </div>
            </AdminDataCell>
            <AdminDataCell className="align-top" title={`statusId: ${statusId}`}>
              <span className="whitespace-nowrap text-sm font-medium" style={{ color: colors.text }}>
                {st?.Status ?? statusId}
              </span>
              <span className="mt-0.5 block font-mono text-xs opacity-80">ID {statusId}</span>
            </AdminDataCell>
            <AdminDataCell className="align-top text-sm font-medium">{row.User ?? row.user}</AdminDataCell>
            <AdminDataCell className="whitespace-nowrap align-top text-xs sm:text-sm">{row.Date ?? row.date}</AdminDataCell>
            <AdminDataCell className="whitespace-nowrap align-top font-mono text-sm">{row.Rating ?? row.rating}</AdminDataCell>
            <AdminDataCell className="align-top text-sm leading-relaxed" style={{ color: colors.text }}>
              {row.Text ?? row.text}
            </AdminDataCell>
            <AdminDataCell className="align-top text-sm">{Number(row.Deleted ?? row.deleted) ? "Yes" : "No"}</AdminDataCell>
            <AdminDataCell className="whitespace-nowrap align-top">
              <div className="flex flex-col gap-1 sm:flex-row sm:gap-2">
                <button
                  type="button"
                  className="text-left text-sm underline"
                  style={{ color: colors.primary }}
                  onClick={() => openEditReview(row)}
                  disabled={!canMutate}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="text-left text-sm underline opacity-90"
                  style={{ color: colors.text }}
                  onClick={() => removeReview(row)}
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

      <ThemedSurface bordered className="p-4 sm:p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold" style={{ ...textStyles.sectionTitle, color: colors.text }}>
            Review statuses (API)
          </h2>
          <button
            type="button"
            className="rounded border px-3 py-1.5 text-sm font-medium"
            style={{ borderColor: colors.primary, color: colors.background, backgroundColor: colors.primary }}
            onClick={openCreateStatus}
            disabled={!canMutate}
          >
            + Add status
          </button>
        </div>
        <p className="mb-3 mt-1" style={{ ...textStyles.bodySm, color: colors.text, opacity: 0.8 }}>
          <code className="rounded px-1">api → reviewstatus</code> — {statuses.loading ? "…" : statusesSorted.length} row(s)
        </p>
        <AdminDataTable
          caption={`${statusesSorted.length} status row(s)`}
          columns={[
            { id: "id", label: "ID" },
            { id: "s", label: "Status" },
            { id: "del", label: "Deleted" },
            { id: "act", label: "" },
          ]}
        >
          {statusesSorted.map((row) => (
            <AdminDataRow key={row.ID}>
              <AdminDataCell className="whitespace-nowrap font-mono text-sm">{row.ID}</AdminDataCell>
              <AdminDataCell className="max-w-md">{row.Status}</AdminDataCell>
              <AdminDataCell>{row.Deleted ? "Yes" : "No"}</AdminDataCell>
              <AdminDataCell className="whitespace-nowrap">
                <div className="flex flex-col gap-1 sm:flex-row sm:gap-2">
                  <button
                    type="button"
                    className="text-left text-sm underline"
                    style={{ color: colors.primary }}
                    onClick={() => openEditStatus(row)}
                    disabled={!canMutate}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="text-left text-sm underline opacity-90"
                    style={{ color: colors.text }}
                    onClick={() => removeStatus(row)}
                    disabled={!canMutate}
                  >
                    Delete
                  </button>
                </div>
              </AdminDataCell>
            </AdminDataRow>
          ))}
        </AdminDataTable>
      </ThemedSurface>

      <AdminModal
        open={stModal != null}
        onClose={() => {
          if (!saving) {
            setStModal(null);
          }
        }}
        title={stModal === "create" ? "New review status" : "Edit review status"}
        size="lg"
        footer={
          <>
            <button
              type="button"
              className="rounded border px-3 py-1.5"
              style={{ borderColor: colors.border, color: colors.text, backgroundColor: colors.background }}
              onClick={() => setStModal(null)}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded border px-3 py-1.5 font-medium"
              style={{ borderColor: colors.primary, color: colors.background, backgroundColor: colors.primary }}
              onClick={saveStatus}
              disabled={saving || !canMutate}
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </>
        }
      >
        {formError ? <p className="mb-3 text-sm text-red-600 dark:text-red-400">{formError}</p> : null}
        <ThemedTextField
          className="mb-3"
          size="sm"
          label="Status label"
          value={fStatus}
          onChange={(e) => setFStatus(e.target.value)}
          required
        />
        <ThemedSelect className="mb-3" size="sm" label="Deleted" value={fDeleted} onChange={(e) => setFDeleted(e.target.value)}>
          <option value="0">Active</option>
          <option value="1">Deleted</option>
        </ThemedSelect>
        <p className="mt-2 text-sm" style={{ color: colors.text, opacity: 0.75 }}>
          Note: the review rows above are bundled template/custom copy (from <code className="rounded bg-black/5 px-1">src/data/productReviews.js</code>).
          This table controls the moderation status reference list in the API dataset.
        </p>
      </AdminModal>

      <AdminModal
        open={revModal != null}
        onClose={() => {
          if (!saving) {
            setRevModal(null);
          }
        }}
        title="Edit review"
        size="lg"
        footer={
          <>
            <button
              type="button"
              className="rounded border px-3 py-1.5"
              style={{ borderColor: colors.border, color: colors.text, backgroundColor: colors.background }}
              onClick={() => setRevModal(null)}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded border px-3 py-1.5 font-medium"
              style={{ borderColor: colors.primary, color: colors.background, backgroundColor: colors.primary }}
              onClick={saveReview}
              disabled={saving || !canMutate}
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </>
        }
      >
        {revError ? <p className="mb-3 text-sm text-red-600 dark:text-red-400">{revError}</p> : null}
        <div className="mb-3 grid gap-3 sm:grid-cols-2">
          <ThemedTextField
            size="sm"
            label="Product ID"
            value={rProductId}
            onChange={(e) => setRProductId(e.target.value)}
            inputClassName="font-mono"
            placeholder="e.g. 97"
            required
          />
          <ThemedSelect size="sm" label="Status" value={rStatusId} onChange={(e) => setRStatusId(e.target.value)}>
            {statusesSorted.length === 0 ? <option value="1">Approved (#1)</option> : null}
            {statusesSorted.map((s) => (
              <option key={s.ID} value={s.ID}>
                {s.Status} (#{s.ID}){s.Deleted ? " — deleted" : ""}
              </option>
            ))}
          </ThemedSelect>
        </div>
        <div className="mb-3 grid gap-3 sm:grid-cols-2">
          <ThemedTextField size="sm" label="Reviewer" value={rUser} onChange={(e) => setRUser(e.target.value)} required />
          <ThemedTextField
            size="sm"
            label="Date"
            value={rDate}
            onChange={(e) => setRDate(e.target.value)}
            inputClassName="font-mono"
            placeholder="YYYY-MM-DD"
          />
        </div>
        <div className="mb-3 grid gap-3 sm:grid-cols-2">
          <ThemedTextField
            size="sm"
            type="number"
            label="Rating (1-5)"
            value={rRating}
            onChange={(e) => setRRating(e.target.value)}
            min={1}
            max={5}
            step={1}
            inputClassName="font-mono"
            required
          />
          <ThemedSelect size="sm" label="Deleted" value={rDeleted} onChange={(e) => setRDeleted(e.target.value)}>
            <option value="0">Active</option>
            <option value="1">Deleted</option>
          </ThemedSelect>
        </div>
        <ThemedTextField
          className="mb-0"
          size="sm"
          label="Review text"
          value={rText}
          onChange={(e) => setRText(e.target.value)}
          multiline
          rows={4}
          required
        />
      </AdminModal>
    </AdminLayout>
  );
}
