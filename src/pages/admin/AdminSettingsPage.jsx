import { AdminDataCell, AdminDataRow, AdminDataTable } from "../../components/admin/AdminDataTable";
import AdminApiBanner from "../../components/admin/AdminApiBanner";
import AdminModal from "../../components/admin/AdminModal";
import ThemedSurface from "../../components/ThemedSurface";
import ThemedSelect from "../../components/ThemedSelect";
import ThemedTextField from "../../components/ThemedTextField";
import { useAdminTable } from "../../hooks/useAdminTable";
import { createRow, deleteRow, updateRow } from "../../lib/crudApi";
import { useTheme } from "../../theme/themeContext";
import { textStyles } from "../../theme/typography";
import AdminLayout from "./AdminLayout";
import { useCallback, useMemo, useState } from "react";

export default function AdminSettingsPage() {
  const { colors } = useTheme();
  const rolesApi = useAdminTable("role");
  const reviewStatusesApi = useAdminTable("reviewstatus");

  const [modal, setModal] = useState(/** @type {null | { table: "role" | "reviewstatus"; mode: "create" | "edit" }} */ (null));
  const [editing, setEditing] = useState(/** @type {object | null} */ (null));
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(/** @type {string | null} */ (null));

  const [fName, setFName] = useState("");
  const [fDetails, setFDetails] = useState("");
  const [fStatus, setFStatus] = useState("");
  const [fDeleted, setFDeleted] = useState("0");

  const rolesSorted = useMemo(() => [...rolesApi.rows].sort((a, b) => (Number(a.ID) || 0) - (Number(b.ID) || 0)), [rolesApi.rows]);
  const reviewStatusesSorted = useMemo(
    () => [...reviewStatusesApi.rows].sort((a, b) => (Number(a.ID) || 0) - (Number(b.ID) || 0)),
    [reviewStatusesApi.rows],
  );

  const openCreate = useCallback((table) => {
    setFormError(null);
    setEditing(null);
    setFName("");
    setFDetails("");
    setFStatus("");
    setFDeleted("0");
    setModal({ table, mode: "create" });
  }, []);

  const openEdit = useCallback((table, row) => {
    setFormError(null);
    setEditing(row);
    setFDeleted(row.Deleted ? "1" : "0");
    if (table === "role") {
      setFName(String(row.Name ?? ""));
      setFDetails(String(row.Details ?? ""));
    } else if (table === "reviewstatus") {
      setFStatus(String(row.Status ?? ""));
    }
    setModal({ table, mode: "edit" });
  }, []);

  const canMutate = !rolesApi.error && !reviewStatusesApi.error;

  const saveRow = async () => {
    if (!modal) {
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      const del = Number.parseInt(fDeleted, 10) ? 1 : 0;
      if (modal.table === "role") {
        const body = { Name: fName.trim(), Details: fDetails.trim(), Deleted: del };
        if (!body.Name) {
          throw new Error("Role name is required.");
        }
        if (modal.mode === "create") {
          await createRow("role", body);
        } else if (editing) {
          await updateRow("role", editing.ID, body);
        }
        await rolesApi.refresh();
      } else if (modal.table === "reviewstatus") {
        const body = { Status: fStatus.trim(), Deleted: del };
        if (!body.Status) {
          throw new Error("Status text is required.");
        }
        if (modal.mode === "create") {
          await createRow("reviewstatus", body);
        } else if (editing) {
          await updateRow("reviewstatus", editing.ID, body);
        }
        await reviewStatusesApi.refresh();
      }
      setModal(null);
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const removeRow = async (table, row) => {
    const label = table === "role" ? row.Name : row.Status;
    if (!window.confirm(`Delete ${table} #${row.ID} “${label}”?`)) {
      return;
    }
    try {
      await deleteRow(table, row.ID, { hard: table === "role" });
      if (table === "role") {
        await rolesApi.refresh();
      } else if (table === "reviewstatus") {
        await reviewStatusesApi.refresh();
      }
    } catch (e) {
      window.alert(e instanceof Error ? e.message : "Delete failed");
    }
  };

  return (
    <AdminLayout
      title="Admin: data & store settings"
      description="Admin reference data tables. Website copy / Company page content moved to the Website content tab."
    >
      <div className="space-y-3">
        <AdminApiBanner error={rolesApi.error} entityLabel="roles (API)" />
        <AdminApiBanner error={reviewStatusesApi.error} entityLabel="review statuses (API)" />
      </div>

      <ThemedSurface bordered className="p-4 sm:p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold" style={{ ...textStyles.sectionTitle, color: colors.text }}>
            Roles (API)
          </h2>
          <button
            type="button"
            className="rounded border px-3 py-1.5 text-sm font-medium"
            style={{ borderColor: colors.primary, color: colors.background, backgroundColor: colors.primary }}
            onClick={() => openCreate("role")}
            disabled={!!rolesApi.error}
          >
            + Add role
          </button>
        </div>
        <p className="mb-3 mt-1" style={{ ...textStyles.bodySm, color: colors.text, opacity: 0.8 }}>
          <code className="rounded px-1">api → role</code> — {rolesApi.loading ? "…" : rolesSorted.length} row(s)
        </p>
        <AdminDataTable
          caption={`${rolesSorted.length} role row(s)`}
          columns={[
            { id: "id", label: "ID" },
            { id: "n", label: "Name" },
            { id: "d", label: "Details" },
            { id: "del", label: "Deleted" },
            { id: "act", label: "" },
          ]}
        >
          {rolesSorted.map((row) => (
            <AdminDataRow key={row.ID}>
              <AdminDataCell className="font-mono text-sm">{row.ID}</AdminDataCell>
              <AdminDataCell className="max-w-[10rem] font-medium">{row.Name}</AdminDataCell>
              <AdminDataCell className="max-w-md text-xs line-clamp-2">{row.Details}</AdminDataCell>
              <AdminDataCell>{row.Deleted ? "Yes" : "No"}</AdminDataCell>
              <AdminDataCell className="whitespace-nowrap">
                <div className="flex flex-col gap-1 sm:flex-row sm:gap-2">
                  <button
                    type="button"
                    className="text-left text-sm underline"
                    style={{ color: colors.primary }}
                    onClick={() => openEdit("role", row)}
                    disabled={!!rolesApi.error}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="text-left text-sm underline opacity-90"
                    style={{ color: colors.text }}
                    onClick={() => removeRow("role", row)}
                    disabled={!!rolesApi.error}
                  >
                    Delete
                  </button>
                </div>
              </AdminDataCell>
            </AdminDataRow>
          ))}
        </AdminDataTable>
      </ThemedSurface>

      <ThemedSurface bordered className="p-4 sm:p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold" style={{ ...textStyles.sectionTitle, color: colors.text }}>
            Review moderation statuses (API)
          </h2>
          <button
            type="button"
            className="rounded border px-3 py-1.5 text-sm font-medium"
            style={{ borderColor: colors.primary, color: colors.background, backgroundColor: colors.primary }}
            onClick={() => openCreate("reviewstatus")}
            disabled={!!reviewStatusesApi.error}
          >
            + Add status
          </button>
        </div>
        <p className="mb-3 mt-1" style={{ ...textStyles.bodySm, color: colors.text, opacity: 0.8 }}>
          <code className="rounded px-1">api → reviewstatus</code> — {reviewStatusesApi.loading ? "…" : reviewStatusesSorted.length} row(s)
        </p>
        <AdminDataTable
          caption={`${reviewStatusesSorted.length} status row(s)`}
          columns={[
            { id: "id", label: "ID" },
            { id: "s", label: "Status" },
            { id: "del", label: "Deleted" },
            { id: "act", label: "" },
          ]}
        >
          {reviewStatusesSorted.map((row) => (
            <AdminDataRow key={row.ID}>
              <AdminDataCell className="font-mono text-sm">{row.ID}</AdminDataCell>
              <AdminDataCell className="max-w-md">{row.Status}</AdminDataCell>
              <AdminDataCell>{row.Deleted ? "Yes" : "No"}</AdminDataCell>
              <AdminDataCell className="whitespace-nowrap">
                <div className="flex flex-col gap-1 sm:flex-row sm:gap-2">
                  <button
                    type="button"
                    className="text-left text-sm underline"
                    style={{ color: colors.primary }}
                    onClick={() => openEdit("reviewstatus", row)}
                    disabled={!!reviewStatusesApi.error}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="text-left text-sm underline opacity-90"
                    style={{ color: colors.text }}
                    onClick={() => removeRow("reviewstatus", row)}
                    disabled={!!reviewStatusesApi.error}
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
        open={modal != null}
        onClose={() => {
          if (!saving) {
            setModal(null);
          }
        }}
        title={
          modal?.mode === "create"
            ? modal.table === "role"
              ? "New role"
              : modal.table === "reviewstatus"
                ? "New review status"
                : "New row"
            : modal?.table === "role"
              ? "Edit role"
              : modal?.table === "reviewstatus"
                ? "Edit review status"
                : "Edit row"
        }
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
              onClick={saveRow}
              disabled={saving || !canMutate}
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </>
        }
      >
        {formError ? <p className="mb-3 text-sm text-red-600 dark:text-red-400">{formError}</p> : null}
        {modal?.table === "role" ? (
          <>
            <ThemedTextField className="mb-3" size="sm" label="Role name" value={fName} onChange={(e) => setFName(e.target.value)} required />
            <ThemedTextField
              className="mb-3"
              size="sm"
              label="Details"
              value={fDetails}
              onChange={(e) => setFDetails(e.target.value)}
              multiline
              rows={4}
            />
          </>
        ) : null}
        {modal?.table === "reviewstatus" ? (
          <ThemedTextField className="mb-3" size="sm" label="Status label" value={fStatus} onChange={(e) => setFStatus(e.target.value)} required />
        ) : null}
        <ThemedSelect className="mb-0" size="sm" label="Deleted" value={fDeleted} onChange={(e) => setFDeleted(e.target.value)}>
          <option value="0">Active</option>
          <option value="1">Deleted</option>
        </ThemedSelect>
      </AdminModal>
    </AdminLayout>
  );
}
