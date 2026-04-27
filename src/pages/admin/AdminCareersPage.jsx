import { useCallback, useMemo, useState } from "react";
import { AdminDataCell, AdminDataRow, AdminDataTable } from "../../components/admin/AdminDataTable";
import AdminApiBanner from "../../components/admin/AdminApiBanner";
import AdminModal from "../../components/admin/AdminModal";
import ThemedSurface from "../../components/ThemedSurface";
import ThemedTextField from "../../components/ThemedTextField";
import { OPEN_ROLES } from "../../data/careersData";
import { useAdminTable } from "../../hooks/useAdminTable";
import { CAREERS_OPEN_ROLES_KEY } from "../../hooks/useCareersRoles";
import { createRow, updateRow } from "../../lib/crudApi";
import { useTheme } from "../../theme/themeContext";
import { textStyles } from "../../theme/typography";
import AdminLayout from "./AdminLayout";

function safeJson(value) {
  if (value == null) return null;
  const s = String(value).trim();
  if (!s) return null;
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}

function splitLines(value) {
  return String(value ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function normalizeJsonValue(value) {
  return JSON.stringify(value ?? null, null, 2);
}

export default function AdminCareersPage() {
  const { colors } = useTheme();
  const settingsApi = useAdminTable("settings");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(/** @type {string | null} */ (null));
  const [modal, setModal] = useState(/** @type {null | { mode: "create" | "edit"; index: number }} */ (null));
  const [draft, setDraft] = useState(/** @type {any} */ (null));

  const rowByKey = useMemo(() => {
    // Admin fetches with `all=1`, so we can have multiple rows per Key.
    // Pick the latest *active* row (highest ID). If all are deleted, pick latest deleted.
    /** @type {Map<string, any>} */
    const m = new Map();
    for (const row of settingsApi.rows) {
      const k = String(row?.Key ?? "");
      if (!k) continue;
      const id = Number(row?.ID ?? row?.id ?? 0) || 0;
      const deleted = Number(row?.Deleted ?? row?.deleted ?? 0) === 1;
      const best = m.get(k);
      if (!best) {
        m.set(k, row);
        continue;
      }
      const bestId = Number(best?.ID ?? best?.id ?? 0) || 0;
      const bestDeleted = Number(best?.Deleted ?? best?.deleted ?? 0) === 1;
      if (bestDeleted && !deleted) {
        m.set(k, row);
        continue;
      }
      if (bestDeleted !== deleted) continue;
      if (id >= bestId) m.set(k, row);
    }
    return m;
  }, [settingsApi.rows]);

  const roles = useMemo(() => {
    const parsed = safeJson(rowByKey.get(CAREERS_OPEN_ROLES_KEY)?.Value);
    return Array.isArray(parsed) ? parsed : OPEN_ROLES;
  }, [rowByKey]);

  const canMutate = !settingsApi.error;

  const upsertRoles = useCallback(
    async (nextRoles) => {
      setSaving(true);
      setError(null);
      try {
        const existing = rowByKey.get(CAREERS_OPEN_ROLES_KEY);
        const body = { Key: CAREERS_OPEN_ROLES_KEY, Value: normalizeJsonValue(nextRoles), Deleted: 0 };
        if (existing?.ID != null) {
          await updateRow("settings", existing.ID, body);
        } else {
          await createRow("settings", body);
        }
        await settingsApi.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Save failed");
      } finally {
        setSaving(false);
      }
    },
    [rowByKey, settingsApi],
  );

  const openCreate = () => {
    setError(null);
    setModal({ mode: "create", index: -1 });
    setDraft({
      id: "",
      title: "",
      team: "",
      location: "",
      type: "",
      summary: "",
      skills: "",
      responsibilities: "",
      requirements: "",
    });
  };

  const openEdit = (index, role) => {
    setError(null);
    setModal({ mode: "edit", index });
    setDraft({
      id: String(role?.id ?? ""),
      title: String(role?.title ?? ""),
      team: String(role?.team ?? ""),
      location: String(role?.location ?? ""),
      type: String(role?.type ?? ""),
      summary: String(role?.summary ?? ""),
      skills: Array.isArray(role?.skills) ? role.skills.join("\n") : "",
      responsibilities: Array.isArray(role?.responsibilities) ? role.responsibilities.join("\n") : "",
      requirements: Array.isArray(role?.requirements) ? role.requirements.join("\n") : "",
    });
  };

  const saveRole = async () => {
    if (!modal) return;
    const role = {
      id: String(draft?.id ?? "").trim(),
      title: String(draft?.title ?? "").trim(),
      team: String(draft?.team ?? "").trim(),
      location: String(draft?.location ?? "").trim(),
      type: String(draft?.type ?? "").trim(),
      summary: String(draft?.summary ?? "").trim(),
      skills: splitLines(draft?.skills),
      responsibilities: splitLines(draft?.responsibilities),
      requirements: splitLines(draft?.requirements),
    };
    if (!role.id) throw new Error("Role id (slug) is required.");
    if (!role.title) throw new Error("Title is required.");
    const duplicate = roles.some((r, i) => i !== modal.index && String(r?.id ?? "") === role.id);
    if (duplicate) throw new Error(`Role id "${role.id}" already exists.`);

    const next = [...roles];
    if (modal.mode === "create") next.unshift(role);
    else next[modal.index] = role;
    await upsertRoles(next);
    setModal(null);
  };

  const deleteRole = async (index) => {
    const next = roles.filter((_, i) => i !== index);
    await upsertRoles(next);
  };

  return (
    <AdminLayout
      title="Careers"
      description="Manage open roles shown on the Careers pages. Backed by `api → settings`."
    >
      {settingsApi.error ? <AdminApiBanner error={settingsApi.error} entityLabel="settings (API)" /> : null}
      {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}

      <ThemedSurface bordered className="p-4 sm:p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold" style={{ ...textStyles.sectionTitle, color: colors.text }}>
            Open roles — API editable
          </h2>
          <button
            type="button"
            className="rounded border px-3 py-1.5 text-sm font-medium"
            style={{ borderColor: colors.primary, color: colors.background, backgroundColor: colors.primary }}
            onClick={openCreate}
            disabled={!canMutate || saving}
          >
            + Add role
          </button>
        </div>
        <p className="mb-3 mt-1" style={{ ...textStyles.bodySm, color: colors.text, opacity: 0.8 }}>
          Setting key: <code className="rounded px-1">{CAREERS_OPEN_ROLES_KEY}</code> — {roles.length} role(s)
        </p>
        <AdminDataTable
          caption={`${roles.length} role(s)`}
          columns={[
            { id: "id", label: "Slug" },
            { id: "t", label: "Title" },
            { id: "team", label: "Team" },
            { id: "loc", label: "Location" },
            { id: "type", label: "Type" },
            { id: "act", label: "" },
          ]}
        >
          {roles.map((row, idx) => (
            <AdminDataRow key={`${row.id}-${idx}`}>
              <AdminDataCell className="max-w-[12rem] break-all font-mono text-xs">{row.id}</AdminDataCell>
              <AdminDataCell className="max-w-xs font-medium">{row.title}</AdminDataCell>
              <AdminDataCell className="text-sm">{row.team}</AdminDataCell>
              <AdminDataCell className="text-sm">{row.location}</AdminDataCell>
              <AdminDataCell className="text-sm">{row.type}</AdminDataCell>
              <AdminDataCell className="whitespace-nowrap">
                <div className="flex flex-col gap-1 sm:flex-row sm:gap-2">
                  <button
                    type="button"
                    className="text-left text-sm underline"
                    style={{ color: colors.primary }}
                    onClick={() => openEdit(idx, row)}
                    disabled={!canMutate || saving}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="text-left text-sm underline opacity-90"
                    style={{ color: colors.text }}
                    onClick={() => deleteRole(idx)}
                    disabled={!canMutate || saving}
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
          if (!saving) setModal(null);
        }}
        title={modal?.mode === "create" ? "New role" : "Edit role"}
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
              onClick={() => saveRole().catch((e) => setError(e instanceof Error ? e.message : "Save failed"))}
              disabled={saving || !canMutate}
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </>
        }
      >
        <div className="grid gap-3">
          <ThemedTextField
            size="sm"
            label="Role id (slug)"
            value={String(draft?.id ?? "")}
            onChange={(e) => setDraft((prev) => ({ ...(prev ?? {}), id: e.target.value }))}
            helperText="Used in the URL, e.g. ecommerce-frontend-developer"
            required
          />
          <ThemedTextField
            size="sm"
            label="Title"
            value={String(draft?.title ?? "")}
            onChange={(e) => setDraft((prev) => ({ ...(prev ?? {}), title: e.target.value }))}
            required
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <ThemedTextField
              size="sm"
              label="Team"
              value={String(draft?.team ?? "")}
              onChange={(e) => setDraft((prev) => ({ ...(prev ?? {}), team: e.target.value }))}
            />
            <ThemedTextField
              size="sm"
              label="Type"
              value={String(draft?.type ?? "")}
              onChange={(e) => setDraft((prev) => ({ ...(prev ?? {}), type: e.target.value }))}
            />
          </div>
          <ThemedTextField
            size="sm"
            label="Location"
            value={String(draft?.location ?? "")}
            onChange={(e) => setDraft((prev) => ({ ...(prev ?? {}), location: e.target.value }))}
          />
          <ThemedTextField
            size="sm"
            label="Summary"
            value={String(draft?.summary ?? "")}
            onChange={(e) => setDraft((prev) => ({ ...(prev ?? {}), summary: e.target.value }))}
            multiline
            rows={3}
          />
          <ThemedTextField
            size="sm"
            label="Skills (one per line)"
            value={String(draft?.skills ?? "")}
            onChange={(e) => setDraft((prev) => ({ ...(prev ?? {}), skills: e.target.value }))}
            multiline
            rows={4}
          />
          <ThemedTextField
            size="sm"
            label="Responsibilities (one per line)"
            value={String(draft?.responsibilities ?? "")}
            onChange={(e) => setDraft((prev) => ({ ...(prev ?? {}), responsibilities: e.target.value }))}
            multiline
            rows={6}
          />
          <ThemedTextField
            size="sm"
            label="Requirements (one per line)"
            value={String(draft?.requirements ?? "")}
            onChange={(e) => setDraft((prev) => ({ ...(prev ?? {}), requirements: e.target.value }))}
            multiline
            rows={6}
          />
        </div>
      </AdminModal>
    </AdminLayout>
  );
}

