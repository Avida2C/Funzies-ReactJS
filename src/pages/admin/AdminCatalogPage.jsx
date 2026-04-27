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
import { resolveAssetPath } from "../../lib/storeData";
import AdminLayout from "./AdminLayout";

function sortById(list) {
  return [...list].sort((a, b) => (Number(a.ID) || 0) - (Number(b.ID) || 0));
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
      label="Status"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="0">Active (not deleted)</option>
      <option value="1">Deleted</option>
    </ThemedSelect>
  );
}

export default function AdminCatalogPage() {
  const { colors } = useTheme();
  const cat = useAdminTable("category");
  const br = useAdminTable("brand");

  const [catModal, setCatModal] = useState(/** @type {null | "create" | "edit"} */ (null));
  const [brandModal, setBrandModal] = useState(/** @type {null | "create" | "edit"} */ (null));
  const [editingCat, setEditingCat] = useState(/** @type {object | null} */ (null));
  const [editingBrand, setEditingBrand] = useState(/** @type {object | null} */ (null));
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(/** @type {string | null} */ (null));

  const categoriesSorted = useMemo(() => sortById(cat.rows), [cat.rows]);
  const brandsSorted = useMemo(() => sortById(br.rows), [br.rows]);

  const [catName, setCatName] = useState("");
  const [catDetails, setCatDetails] = useState("");
  const [catDel, setCatDel] = useState("0");

  const [brandName, setBrandName] = useState("");
  const [brandDetails, setBrandDetails] = useState("");
  const [brandImage, setBrandImage] = useState("");
  const [brandDel, setBrandDel] = useState("0");

  const openCreateCategory = useCallback(() => {
    setFormError(null);
    setEditingCat(null);
    setCatName("");
    setCatDetails("");
    setCatDel("0");
    setCatModal("create");
  }, []);

  const openEditCategory = useCallback((row) => {
    setFormError(null);
    setEditingCat(row);
    setCatName(String(row.Name ?? ""));
    setCatDetails(String(row.Details ?? ""));
    setCatDel(row.Deleted ? "1" : "0");
    setCatModal("edit");
  }, []);

  const openCreateBrand = useCallback(() => {
    setFormError(null);
    setEditingBrand(null);
    setBrandName("");
    setBrandDetails("");
    setBrandImage("");
    setBrandDel("0");
    setBrandModal("create");
  }, []);

  const openEditBrand = useCallback((row) => {
    setFormError(null);
    setEditingBrand(row);
    setBrandName(String(row.Name ?? ""));
    setBrandDetails(String(row.Details ?? ""));
    setBrandImage(String(row.Image ?? ""));
    setBrandDel(row.Deleted ? "1" : "0");
    setBrandModal("edit");
  }, []);

  const saveCategory = async () => {
    setSaving(true);
    setFormError(null);
    try {
      const body = {
        Name: catName.trim(),
        Details: catDetails.trim(),
        Deleted: Number.parseInt(catDel, 10) || 0,
      };
      if (!body.Name) {
        throw new Error("Name is required");
      }
      if (catModal === "create") {
        await createRow("category", body);
      } else if (catModal === "edit" && editingCat) {
        await updateRow("category", editingCat.ID, body);
      }
      setCatModal(null);
      await cat.refresh();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const saveBrand = async () => {
    setSaving(true);
    setFormError(null);
    try {
      const body = {
        Name: brandName.trim(),
        Details: brandDetails.trim(),
        Image: brandImage.trim() || undefined,
        Deleted: Number.parseInt(brandDel, 10) || 0,
      };
      if (!body.Name) {
        throw new Error("Name is required");
      }
      if (brandModal === "create") {
        await createRow("brand", body);
      } else if (brandModal === "edit" && editingBrand) {
        await updateRow("brand", editingBrand.ID, body);
      }
      setBrandModal(null);
      await br.refresh();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const removeCategory = async (row) => {
    if (!window.confirm(`Delete category #${row.ID} “${row.Name}”? (soft-delete if the API supports it)`)) {
      return;
    }
    try {
      await deleteRow("category", row.ID, { hard: false });
      await cat.refresh();
    } catch (e) {
      window.alert(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const removeBrand = async (row) => {
    if (!window.confirm(`Delete brand #${row.ID} “${row.Name}”?`)) {
      return;
    }
    try {
      await deleteRow("brand", row.ID, { hard: false });
      await br.refresh();
    } catch (e) {
      window.alert(e instanceof Error ? e.message : "Delete failed");
    }
  };

  return (
    <AdminLayout
      title="Catalog: categories & brands"
      description="Create, edit, and delete through the local Funzies data API. Changes are saved to `server/data/funziesData.json` (run `npm run dev:api` or `npm run dev:stack`)."
    >
      <div className="space-y-3">
        <AdminApiBanner error={cat.error} entityLabel="categories (API)" />
        <AdminApiBanner error={br.error} entityLabel="brands (API)" />
      </div>

      <ThemedSurface bordered className="p-4 sm:p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold" style={{ ...textStyles.sectionTitle, color: colors.text }}>
            Categories
          </h2>
          <button
            type="button"
            className="rounded border px-3 py-1.5 text-sm font-medium"
            style={{ borderColor: colors.primary, color: colors.background, backgroundColor: colors.primary }}
            onClick={openCreateCategory}
            disabled={!!cat.error || cat.loading}
          >
            + Add category
          </button>
        </div>
        <p className="mb-3" style={{ ...textStyles.bodySm, color: colors.text, opacity: 0.8 }}>
          <code className="rounded px-1">api → category</code> — {cat.loading ? "…" : categoriesSorted.length} row(s)
        </p>
        {cat.loading && !cat.rows.length ? (
          <p style={{ ...textStyles.body, color: colors.text, opacity: 0.8 }}>Loading…</p>
        ) : null}
        <AdminDataTable
          caption={`${categoriesSorted.length} category row(s)`}
          columns={[
            { id: "id", label: "ID" },
            { id: "name", label: "Name" },
            { id: "details", label: "Details" },
            { id: "del", label: "Deleted" },
            { id: "act", label: "" },
          ]}
        >
          {categoriesSorted.map((row) => (
            <AdminDataRow key={row.ID}>
              <AdminDataCell className="whitespace-nowrap font-mono text-sm">{row.ID}</AdminDataCell>
              <AdminDataCell className="max-w-[10rem] sm:max-w-xs">{row.Name?.trim()}</AdminDataCell>
              <AdminDataCell className="text-xs text-opacity-90 line-clamp-2" style={{ color: colors.text }}>
                {row.Details}
              </AdminDataCell>
              <AdminDataCell>{row.Deleted ? "Yes" : "No"}</AdminDataCell>
              <AdminDataCell className="whitespace-nowrap">
                <div className="flex flex-col gap-1 sm:flex-row sm:gap-2">
                  <button
                    type="button"
                    className="text-sm underline"
                    style={{ color: colors.primary }}
                    onClick={() => openEditCategory(row)}
                    disabled={!!cat.error}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="text-sm underline opacity-90"
                    style={{ color: colors.text }}
                    onClick={() => removeCategory(row)}
                    disabled={!!cat.error}
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
            Brands
          </h2>
          <button
            type="button"
            className="rounded border px-3 py-1.5 text-sm font-medium"
            style={{ borderColor: colors.primary, color: colors.background, backgroundColor: colors.primary }}
            onClick={openCreateBrand}
            disabled={!!br.error || br.loading}
          >
            + Add brand
          </button>
        </div>
        <p className="mb-3" style={{ ...textStyles.bodySm, color: colors.text, opacity: 0.8 }}>
          <code className="rounded px-1">api → brand</code> — {br.loading ? "…" : brandsSorted.length} row(s)
        </p>
        {br.loading && !br.rows.length ? (
          <p style={{ ...textStyles.body, color: colors.text, opacity: 0.8 }}>Loading…</p>
        ) : null}
        <AdminDataTable
          caption={`${brandsSorted.length} brand row(s)`}
          columns={[
            { id: "id", label: "ID" },
            { id: "name", label: "Name" },
            { id: "img", label: "Image" },
            { id: "del", label: "Deleted" },
            { id: "act", label: "" },
          ]}
        >
          {brandsSorted.map((row) => (
            <AdminDataRow key={row.ID}>
              <AdminDataCell className="whitespace-nowrap font-mono text-sm">{row.ID}</AdminDataCell>
              <AdminDataCell className="max-w-[8rem] sm:max-w-xs font-medium">{row.Name?.trim()}</AdminDataCell>
              <AdminDataCell>
                {row.Image ? (
                  <span className="inline-flex max-w-full flex-col gap-1">
                    <img
                      src={resolveAssetPath(row.Image)}
                      alt=""
                      className="h-8 w-8 max-w-full rounded object-contain"
                    />
                    <code className="line-clamp-1 break-all text-xs opacity-80">{row.Image}</code>
                  </span>
                ) : (
                  "—"
                )}
              </AdminDataCell>
              <AdminDataCell>{row.Deleted ? "Yes" : "No"}</AdminDataCell>
              <AdminDataCell className="whitespace-nowrap">
                <div className="flex flex-col gap-1 sm:flex-row sm:gap-2">
                  <button
                    type="button"
                    className="text-sm underline"
                    style={{ color: colors.primary }}
                    onClick={() => openEditBrand(row)}
                    disabled={!!br.error}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="text-sm underline opacity-90"
                    style={{ color: colors.text }}
                    onClick={() => removeBrand(row)}
                    disabled={!!br.error}
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
        open={catModal != null}
        onClose={() => {
          if (!saving) {
            setCatModal(null);
          }
        }}
        title={catModal === "create" ? "New category" : "Edit category"}
        size="lg"
        footer={
          <>
            <button
              type="button"
              className="rounded border px-3 py-1.5"
              style={{ borderColor: colors.border, color: colors.text, backgroundColor: colors.background }}
              onClick={() => setCatModal(null)}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded border px-3 py-1.5 font-medium"
              style={{ borderColor: colors.primary, color: colors.background, backgroundColor: colors.primary }}
              onClick={saveCategory}
              disabled={saving}
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </>
        }
      >
        {formError && catModal ? <p className="mb-3 text-sm text-red-600 dark:text-red-400">{formError}</p> : null}
        <ThemedTextField
          className="mb-3"
          size="sm"
          label="Name"
          value={catName}
          onChange={(e) => setCatName(e.target.value)}
          required
        />
        <ThemedTextField
          className="mb-3"
          size="sm"
          label="Details"
          value={catDetails}
          onChange={(e) => setCatDetails(e.target.value)}
          multiline
          rows={4}
        />
        <DeletedSelect value={catDel} onChange={setCatDel} id="cat-del" />
      </AdminModal>

      <AdminModal
        open={brandModal != null}
        onClose={() => {
          if (!saving) {
            setBrandModal(null);
          }
        }}
        title={brandModal === "create" ? "New brand" : "Edit brand"}
        size="lg"
        footer={
          <>
            <button
              type="button"
              className="rounded border px-3 py-1.5"
              style={{ borderColor: colors.border, color: colors.text, backgroundColor: colors.background }}
              onClick={() => setBrandModal(null)}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded border px-3 py-1.5 font-medium"
              style={{ borderColor: colors.primary, color: colors.background, backgroundColor: colors.primary }}
              onClick={saveBrand}
              disabled={saving}
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </>
        }
      >
        {formError && brandModal ? <p className="mb-3 text-sm text-red-600 dark:text-red-400">{formError}</p> : null}
        <ThemedTextField
          className="mb-3"
          size="sm"
          label="Name"
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
          required
        />
        <ThemedTextField
          className="mb-3"
          size="sm"
          label="Details"
          value={brandDetails}
          onChange={(e) => setBrandDetails(e.target.value)}
          multiline
          rows={3}
        />
        <ThemedTextField
          className="mb-3"
          size="sm"
          label="Image path"
          value={brandImage}
          onChange={(e) => setBrandImage(e.target.value)}
          placeholder="e.g. img/brands/….png"
        />
        <DeletedSelect value={brandDel} onChange={setBrandDel} id="brand-del" />
      </AdminModal>
    </AdminLayout>
  );
}
