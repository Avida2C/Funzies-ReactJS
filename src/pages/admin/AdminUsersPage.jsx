import { useCallback, useMemo, useState } from "react";
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

function sortById(list) {
  return [...list].sort((a, b) => (Number(a.ID) || 0) - (Number(b.ID) || 0));
}

function nowSqlish() {
  return new Date().toISOString().replace("T", " ").slice(0, 19);
}

/**
 * @param {{ value: string; onChange: (v: string) => void; id: string }} props
 */
function DeletedSelect({ value, onChange, id }) {
  return (
    <ThemedSelect
      id={id}
      className="mb-3"
      size="sm"
      label="Account state"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="0">Active (not deleted)</option>
      <option value="1">Deleted (soft)</option>
    </ThemedSelect>
  );
}

/**
 * @param {{ value: string; onChange: (v: string) => void; id: string }} props
 */
function VerifiedSelect({ value, onChange, id }) {
  return (
    <ThemedSelect
      id={id}
      className="mb-3"
      size="sm"
      label="Verified"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="1">Yes</option>
      <option value="0">No</option>
    </ThemedSelect>
  );
}

export default function AdminUsersPage() {
  const { colors } = useTheme();
  const users = useAdminTable("user");
  const roles = useAdminTable("role");
  const addresses = useAdminTable("address");
  const orders = useAdminTable("orders");

  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(/** @type {null | "create" | "edit"} */ (null));
  const [editing, setEditing] = useState(/** @type {object | null} */ (null));
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(/** @type {string | null} */ (null));

  const [fEmail, setFEmail] = useState("");
  const [fName, setFName] = useState("");
  const [fSurname, setFSurname] = useState("");
  const [fPhone, setFPhone] = useState("");
  const [fRole, setFRole] = useState("2");
  const [fJoined, setFJoined] = useState(nowSqlish());
  const [fVerified, setFVerified] = useState("1");
  const [fDeleted, setFDeleted] = useState("0");

  const rolesSorted = useMemo(() => sortById(roles.rows), [roles.rows]);
  const usersSorted = useMemo(() => sortById(users.rows), [users.rows]);

  const roleById = useMemo(() => {
    const m = new Map();
    for (const r of roles.rows) {
      m.set(r.ID, r);
    }
    return m;
  }, [roles.rows]);

  const userById = useMemo(() => {
    const m = new Map();
    for (const u of users.rows) {
      m.set(u.ID, u);
    }
    return m;
  }, [users.rows]);

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return usersSorted;
    }
    return usersSorted.filter((u) => {
      const id = String(u.ID);
      const em = String(u.Email ?? "").toLowerCase();
      const full = `${u.Name ?? ""} ${u.Surname ?? ""}`.trim().toLowerCase();
      return id.includes(q) || em.includes(q) || full.includes(q);
    });
  }, [query, usersSorted]);

  const listError = users.error || roles.error;
  const canMutate = !users.error && !roles.error;

  const openCreate = useCallback(() => {
    setFormError(null);
    setEditing(null);
    setFEmail("");
    setFName("");
    setFSurname("");
    setFPhone("");
    const r0 = rolesSorted.find((r) => !r.Deleted) || rolesSorted[0];
    setFRole(String(r0?.ID ?? "2"));
    setFJoined(nowSqlish());
    setFVerified("1");
    setFDeleted("0");
    setModal("create");
  }, [rolesSorted]);

  const openEdit = useCallback((u) => {
    setFormError(null);
    setEditing(u);
    setFEmail(String(u.Email ?? ""));
    setFName(String(u.Name ?? ""));
    setFSurname(String(u.Surname ?? ""));
    setFPhone(String(u.ContactNumber ?? ""));
    setFRole(String(u.Role ?? "2"));
    setFJoined(String(u.Joined ?? nowSqlish()));
    setFVerified(String(Number(u.Verified) ? 1 : 0));
    setFDeleted(String(Number(u.Deleted) ? 1 : 0));
    setModal("edit");
  }, []);

  const saveUser = async () => {
    setSaving(true);
    setFormError(null);
    try {
      const role = Number.parseInt(fRole, 10);
      const verified = Number.parseInt(fVerified, 10) ? 1 : 0;
      const deleted = Number.parseInt(fDeleted, 10) ? 1 : 0;
      if (!fEmail.trim()) {
        throw new Error("Email is required.");
      }
      if (!fName.trim() || !fSurname.trim()) {
        throw new Error("Name and surname are required.");
      }
      if (Number.isNaN(role)) {
        throw new Error("Role is required.");
      }
      const body = {
        Email: fEmail.trim(),
        Name: fName.trim(),
        Surname: fSurname.trim(),
        ContactNumber: fPhone.trim(),
        Role: role,
        Joined: fJoined.trim() || nowSqlish(),
        Verified: verified,
        Deleted: deleted,
      };
      if (modal === "create") {
        await createRow("user", body);
      } else if (modal === "edit" && editing) {
        await updateRow("user", editing.ID, body);
      }
      setModal(null);
      await users.refresh();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const removeUser = async (u) => {
    if (!window.confirm(`Permanently delete user #${u.ID} (${u.Email})? This also deletes their addresses.`)) {
      return;
    }
    try {
      await deleteRow("user", u.ID, { hard: true });
      await users.refresh();
      await addresses.refresh();
    } catch (e) {
      window.alert(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const addressesSorted = useMemo(() => sortById(addresses.rows), [addresses.rows]);
  const ordersSorted = useMemo(() => sortById(orders.rows), [orders.rows]);

  return (
    <AdminLayout
      title="Admin Users"
      description="Create, edit, and soft-delete users via the local Funzies API (`user` table). Passwords aren’t managed here."
    >
      {listError ? <AdminApiBanner error={listError} entityLabel="users/roles (API)" /> : null}

      <ThemedSurface bordered className="p-4 sm:p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold" style={{ ...textStyles.sectionTitle, color: colors.text }}>
            Users
          </h2>
          <button
            type="button"
            className="rounded border px-3 py-1.5 text-sm font-medium"
            style={{ borderColor: colors.primary, color: colors.background, backgroundColor: colors.primary }}
            onClick={openCreate}
            disabled={!canMutate}
          >
            + Add user
          </button>
        </div>
        <ThemedTextField
          className="max-w-md"
          size="sm"
          label="Filter by email, name, or ID"
          placeholder="e.g. nadine or #2"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
        />
        <p className="mt-2" style={{ ...textStyles.bodySm, color: colors.text, opacity: 0.8 }}>
          {users.loading ? "Loading users…" : `Showing ${filteredUsers.length} of ${usersSorted.length} row(s) (API).`}
        </p>

        <AdminDataTable
          caption="User accounts (API)"
          columns={[
            { id: "id", label: "ID" },
            { id: "email", label: "Email" },
            { id: "name", label: "Name" },
            { id: "role", label: "Role" },
            { id: "ver", label: "Verified" },
            { id: "join", label: "Joined" },
            { id: "del", label: "Deleted" },
            { id: "act", label: "" },
          ]}
        >
          {filteredUsers.map((u) => {
            const r = roleById.get(u.Role);
            return (
              <AdminDataRow key={u.ID}>
                <AdminDataCell className="whitespace-nowrap font-mono text-sm">{u.ID}</AdminDataCell>
                <AdminDataCell className="max-w-[10rem] break-all sm:max-w-xs">{u.Email}</AdminDataCell>
                <AdminDataCell>
                  {u.Name} {u.Surname}
                </AdminDataCell>
                <AdminDataCell className="text-sm">
                  {r ? (
                    <>
                      {r.Name}
                      <span className="ml-1 text-xs opacity-75">(id {u.Role})</span>
                    </>
                  ) : (
                    u.Role
                  )}
                </AdminDataCell>
                <AdminDataCell>{Number(u.Verified) ? "Yes" : "No"}</AdminDataCell>
                <AdminDataCell className="whitespace-nowrap text-xs sm:text-sm">{u.Joined}</AdminDataCell>
                <AdminDataCell>{Number(u.Deleted) ? "Yes" : "No"}</AdminDataCell>
                <AdminDataCell className="whitespace-nowrap">
                  <div className="flex flex-col gap-1 sm:flex-row sm:gap-2">
                    <button
                      type="button"
                      className="text-left text-sm underline"
                      style={{ color: colors.primary }}
                      onClick={() => openEdit(u)}
                      disabled={!canMutate}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="text-left text-sm underline opacity-90"
                      style={{ color: colors.text }}
                      onClick={() => removeUser(u)}
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

      <ThemedSurface bordered className="p-4 sm:p-5">
        <h2 className="text-lg font-semibold" style={{ ...textStyles.sectionTitle, color: colors.text }}>
          Addresses (API, read-only here)
        </h2>
        <p className="mb-3 mt-1" style={{ ...textStyles.bodySm, color: colors.text, opacity: 0.8 }}>
          <code className="rounded px-1">api → address</code> — {addresses.loading ? "…" : addressesSorted.length} row(s)
        </p>
        <AdminDataTable
          caption="Ship-to / bill-to records"
          columns={[
            { id: "id", label: "ID" },
            { id: "user", label: "User" },
            { id: "city", label: "City" },
            { id: "street", label: "Street" },
            { id: "def", label: "Default" },
            { id: "del", label: "Deleted" },
          ]}
        >
          {addressesSorted.map((a) => {
            const u = userById.get(a.User);
            return (
              <AdminDataRow key={a.ID}>
                <AdminDataCell className="whitespace-nowrap font-mono text-sm">{a.ID}</AdminDataCell>
                <AdminDataCell>
                  {u ? (
                    <span className="line-clamp-1 text-sm">
                      {u.Email} <span className="text-xs opacity-80">(user {a.User})</span>
                    </span>
                  ) : (
                    a.User
                  )}
                </AdminDataCell>
                <AdminDataCell className="max-w-[6rem] truncate sm:max-w-xs">{a.City}</AdminDataCell>
                <AdminDataCell className="max-w-xs text-xs sm:text-sm">{a.Street}</AdminDataCell>
                <AdminDataCell>{a.Def ? "Yes" : "No"}</AdminDataCell>
                <AdminDataCell>{a.Deleted ? "Yes" : "No"}</AdminDataCell>
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
        title={modal === "create" ? "New user" : "Edit user"}
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
              onClick={saveUser}
              disabled={saving || !canMutate}
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </>
        }
      >
        {formError ? <p className="mb-3 text-sm text-red-600 dark:text-red-400">{formError}</p> : null}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold" style={{ ...textStyles.sectionTitle, color: colors.primary }}>
            Account Settings
          </h3>

          <div className="grid gap-3 md:grid-cols-2">
            <ThemedTextField label="Email" value={fEmail} onChange={(e) => setFEmail(e.target.value)} />
            <ThemedTextField label="Joined" value={fJoined} onChange={(e) => setFJoined(e.target.value)} />
            <ThemedTextField label="First name" value={fName} onChange={(e) => setFName(e.target.value)} />
            <ThemedTextField label="Last name" value={fSurname} onChange={(e) => setFSurname(e.target.value)} />
            <ThemedTextField label="Phone" value={fPhone} onChange={(e) => setFPhone(e.target.value)} />
            <ThemedSelect
              label="Role"
              value={String(fRole ?? "")}
              onChange={(e) => setFRole(e.target.value)}
              options={[
                { value: "", label: "Select role" },
                ...rolesSorted.map((r) => ({ value: String(r.ID), label: String(r.Role ?? r.ID) })),
              ]}
            />
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <VerifiedSelect value={String(fVerified ?? "0")} onChange={setFVerified} id="admin-user-verified" />
            <DeletedSelect value={String(fDeleted ?? "0")} onChange={setFDeleted} id="admin-user-deleted" />
          </div>
        </section>
        <p className="mt-2 text-sm" style={{ color: colors.text, opacity: 0.75 }}>
          Passwords are stored in the dataset but are intentionally not editable from this UI.
        </p>
      </AdminModal>
    </AdminLayout>
  );
}
