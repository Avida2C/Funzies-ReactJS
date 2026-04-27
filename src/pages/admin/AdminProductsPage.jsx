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
import { formatEurValue } from "../../lib/funziesDataset";
import { useTheme } from "../../theme/themeContext";
import { textStyles } from "../../theme/typography";
import { getProductCardImageUrl, getProductExtraImageCount, parseProductExtraImages } from "../../lib/productImages";
import AdminImageUploadButton from "../../components/admin/AdminImageUploadButton";
import AdminLayout from "./AdminLayout";

function sortById(list) {
  return [...list].sort((a, b) => (Number(a.ID) || 0) - (Number(b.ID) || 0));
}

/**
 * @param {{ value: string; onChange: (v: string) => void; id: string }} props
 */
function StatusSelect({ value, onChange, id }) {
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

export default function AdminProductsPage() {
  const { colors } = useTheme();
  const prods = useAdminTable("product");
  const cats = useAdminTable("category");
  const brands = useAdminTable("brand");

  const [query, setQuery] = useState("");
  const [showDeleted, setShowDeleted] = useState(false);
  const [modal, setModal] = useState(/** @type {null | "create" | "edit"} */ (null));
  const [editing, setEditing] = useState(/** @type {object | null} */ (null));
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(/** @type {string | null} */ (null));

  const [fName, setFName] = useState("");
  const [fDesc, setFDesc] = useState("");
  const [fCat, setFCat] = useState("1");
  const [fBrand, setFBrand] = useState("1");
  const [fPrice, setFPrice] = useState("0");
  const [fStock, setFStock] = useState("0");
  const [fImage, setFImage] = useState("");
  const [fThumb, setFThumb] = useState("");
  const [fImagesExtra, setFImagesExtra] = useState("");
  const [fDel, setFDel] = useState("0");

  const productsSorted = useMemo(() => sortById(prods.rows), [prods.rows]);
  const catOptions = useMemo(() => sortById(cats.rows), [cats.rows]);
  const brandOptions = useMemo(() => sortById(brands.rows), [brands.rows]);

  const categoryById = useMemo(() => {
    const m = new Map();
    for (const c of cats.rows) {
      m.set(c.ID, c);
    }
    return m;
  }, [cats.rows]);
  const brandById = useMemo(() => {
    const m = new Map();
    for (const b of brands.rows) {
      m.set(b.ID, b);
    }
    return m;
  }, [brands.rows]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = showDeleted ? productsSorted : productsSorted.filter((p) => !p.Deleted);
    if (!q) {
      return base;
    }
    return base.filter((p) => {
      const name = p.Name?.toLowerCase() ?? "";
      const id = String(p.ID);
      return name.includes(q) || id.includes(q);
    });
  }, [query, productsSorted, showDeleted]);

  const openCreate = useCallback(() => {
    setFormError(null);
    setEditing(null);
    setFName("");
    setFDesc("");
    const c0 = catOptions.find((c) => !c.Deleted) || catOptions[0];
    const b0 = brandOptions.find((b) => !b.Deleted) || brandOptions[0];
    setFCat(String(c0?.ID ?? 1));
    setFBrand(String(b0?.ID ?? 1));
    setFPrice("0");
    setFStock("0");
    setFImage("");
    setFThumb("");
    setFImagesExtra("");
    setFDel("0");
    setModal("create");
  }, [catOptions, brandOptions]);

  const openEdit = useCallback((p) => {
    setFormError(null);
    setEditing(p);
    setFName(String(p.Name ?? ""));
    setFDesc(String(p.Description ?? ""));
    setFCat(String(p.Category ?? ""));
    setFBrand(String(p.Brand ?? ""));
    setFPrice(String(p.Price ?? 0));
    setFStock(String(p.Stock ?? 0));
    setFImage(String(p.Image ?? ""));
    setFThumb(p.Thumbnail != null ? String(p.Thumbnail) : "");
    setFImagesExtra(parseProductExtraImages(p.Images).join("\n"));
    setFDel(p.Deleted ? "1" : "0");
    setModal("edit");
  }, []);

  const saveProduct = async () => {
    setSaving(true);
    setFormError(null);
    try {
      const priceN = Number.parseFloat(fPrice);
      const stockN = Number.parseInt(fStock, 10);
      const catN = Number.parseInt(fCat, 10);
      const brandN = Number.parseInt(fBrand, 10);
      if (!fName.trim()) {
        throw new Error("Name is required");
      }
      if (Number.isNaN(priceN) || priceN < 0) {
        throw new Error("Price must be a non-negative number");
      }
      if (Number.isNaN(stockN) || stockN < 0) {
        throw new Error("Stock must be a non-negative integer");
      }
      if (Number.isNaN(catN) || Number.isNaN(brandN)) {
        throw new Error("Category and brand must be selected");
      }
      const extraPaths = fImagesExtra
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
      const mainImg = fImage.trim() || "img/products/comingsoon.jpg";
      const body = {
        Name: fName.trim(),
        Description: fDesc.trim(),
        Category: catN,
        Brand: brandN,
        Price: priceN,
        Stock: stockN,
        Image: mainImg,
        Deleted: Number.parseInt(fDel, 10) || 0,
        Images: extraPaths,
      };
      if (fThumb.trim()) {
        body.Thumbnail = fThumb.trim();
      } else if (modal === "edit") {
        body.Thumbnail = null;
      }
      if (modal === "create") {
        await createRow("product", body);
      } else if (modal === "edit" && editing) {
        await updateRow("product", editing.ID, body);
      }
      setModal(null);
      await prods.refresh();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const removeProduct = async (p) => {
    if (!window.confirm(`Delete product #${p.ID} “${p.Name}”? (soft-delete: marked as deleted in the API)`)) {
      return;
    }
    try {
      await deleteRow("product", p.ID, { hard: false });
      await prods.refresh();
    } catch (e) {
      window.alert(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const listError = prods.error || cats.error || brands.error;
  const canMutate = !prods.error && !cats.error && !brands.error;

  return (
    <AdminLayout
      title="Admin Products"
      description="Optional `Thumbnail` (grid/cart) and `Images` (extra gallery photos after the main `Image` hero). The bundled storefront reads `src/data/funziesData.json` unless you connect it to the API. Run `npm run dev:api` or `npm run dev:stack`."
    >
      {listError ? <AdminApiBanner error={listError} entityLabel="product data" /> : null}

      <ThemedSurface bordered className="p-4 sm:p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p style={{ ...textStyles.body, color: colors.text, opacity: 0.9 }}>Create, update, and remove product rows. </p>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="rounded border px-3 py-1.5 text-sm font-medium"
              style={{
                borderColor: colors.border,
                color: showDeleted ? colors.background : colors.text,
                backgroundColor: showDeleted ? colors.text : colors.background,
              }}
              onClick={() => setShowDeleted((v) => !v)}
              disabled={!canMutate}
              title="Toggle deleted rows in the table"
            >
              {showDeleted ? "Hide deleted" : "Show deleted"}
            </button>
            <button
              type="button"
              className="rounded border px-3 py-1.5 text-sm font-medium"
              style={{ borderColor: colors.primary, color: colors.background, backgroundColor: colors.primary }}
              onClick={openCreate}
              disabled={!canMutate}
            >
              + Add product
            </button>
          </div>
        </div>
        <ThemedTextField
          className="max-w-md"
          size="sm"
          label="Filter by name or ID"
          placeholder="e.g. Ticket or 42"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
        />
        <p className="mt-2" style={{ ...textStyles.bodySm, color: colors.text, opacity: 0.8 }}>
          {prods.loading ? "Loading products…" : `Showing ${filtered.length} of ${productsSorted.length} (API).`}
        </p>
      </ThemedSurface>

      <AdminDataTable
        caption={`${filtered.length} product row(s)`}
        columns={[
          { id: "id", label: "ID" },
          { id: "img", label: "Photo" },
          { id: "name", label: "Name" },
          { id: "cat", label: "Category" },
          { id: "brand", label: "Brand" },
          { id: "price", label: "Price" },
          { id: "stock", label: "Stock" },
          { id: "del", label: "Del" },
          { id: "act", label: "" },
        ]}
      >
        {filtered.map((p) => {
          const category = categoryById.get(p.Category);
          const brand = brandById.get(p.Brand);
          return (
            <AdminDataRow key={p.ID}>
              <AdminDataCell className="whitespace-nowrap font-mono text-sm">{p.ID}</AdminDataCell>
              <AdminDataCell className="w-[4.5rem]">
                <div className="relative inline-block">
                  <img
                    src={getProductCardImageUrl(p)}
                    alt=""
                    className="h-10 w-10 rounded object-cover"
                    loading="lazy"
                  />
                  {getProductExtraImageCount(p) > 0 ? (
                    <span
                      className="absolute -right-1.5 -top-1.5 min-w-[1.1rem] rounded px-0.5 text-center text-[9px] font-bold leading-tight"
                      style={{ backgroundColor: colors.primary, color: colors.background }}
                      title={`+${getProductExtraImageCount(p)} gallery image(s) after main image`}
                    >
                      +{getProductExtraImageCount(p)}
                    </span>
                  ) : null}
                </div>
              </AdminDataCell>
              <AdminDataCell>
                <Link
                  to={`/product-page/${p.ID}`}
                  className="font-medium underline"
                  style={{ color: colors.primary }}
                  target="_blank"
                  rel="noreferrer"
                >
                  {p.Name?.trim() ?? p.Name}
                </Link>
              </AdminDataCell>
              <AdminDataCell className="max-w-[6rem] truncate text-sm sm:max-w-[10rem]">
                {category?.Name?.trim() ?? p.Category}
              </AdminDataCell>
              <AdminDataCell className="max-w-[6rem] truncate text-sm sm:max-w-[10rem]">
                {brand?.Name?.trim() ?? p.Brand}
              </AdminDataCell>
              <AdminDataCell className="whitespace-nowrap">{formatEurValue(p.Price)}</AdminDataCell>
              <AdminDataCell className="text-right sm:text-left">{p.Stock}</AdminDataCell>
              <AdminDataCell className="text-sm">{p.Deleted ? "Yes" : "No"}</AdminDataCell>
              <AdminDataCell className="whitespace-nowrap">
                <div className="flex flex-col gap-1 sm:flex-row sm:gap-2">
                  <button
                    type="button"
                    className="text-left text-sm underline"
                    style={{ color: colors.primary }}
                    onClick={() => openEdit(p)}
                    disabled={!canMutate}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="text-left text-sm underline opacity-90"
                    style={{ color: colors.text }}
                    onClick={() => removeProduct(p)}
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

      <AdminModal
        open={modal != null}
        onClose={() => {
          if (!saving) {
            setModal(null);
          }
        }}
        title={modal === "create" ? "New product" : "Edit product"}
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
              onClick={saveProduct}
              disabled={saving}
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
          label="Name"
          value={fName}
          onChange={(e) => setFName(e.target.value)}
          required
        />
        <ThemedTextField
          className="mb-3"
          size="sm"
          label="Description"
          value={fDesc}
          onChange={(e) => setFDesc(e.target.value)}
          multiline
          rows={3}
        />
        <div className="mb-3 grid min-w-0 gap-3 sm:grid-cols-2">
          <div>
            <ThemedSelect
              className="mb-0"
              size="sm"
              label="Category"
              value={fCat}
              onChange={(e) => setFCat(e.target.value)}
              disabled={catOptions.length === 0}
            >
              {catOptions.length === 0 ? (
                <option value="">— No categories —</option>
              ) : (
                catOptions.map((c) => (
                  <option key={c.ID} value={c.ID}>
                    {c.Name?.trim() ?? c.ID} (#{c.ID}){c.Deleted ? " — deleted" : ""}
                  </option>
                ))
              )}
            </ThemedSelect>
            {catOptions.length === 0 && (
              <p className="mt-1 text-xs" style={{ color: colors.text, opacity: 0.75 }}>
                No categories in API. Add one under Catalog.
              </p>
            )}
          </div>
          <div>
            <ThemedSelect
              className="mb-0"
              size="sm"
              label="Brand"
              value={fBrand}
              onChange={(e) => setFBrand(e.target.value)}
              disabled={brandOptions.length === 0}
            >
              {brandOptions.length === 0 ? (
                <option value="">— No brands —</option>
              ) : (
                brandOptions.map((b) => (
                  <option key={b.ID} value={b.ID}>
                    {b.Name?.trim() ?? b.ID} (#{b.ID}){b.Deleted ? " — deleted" : ""}
                  </option>
                ))
              )}
            </ThemedSelect>
            {brandOptions.length === 0 && (
              <p className="mt-1 text-xs" style={{ color: colors.text, opacity: 0.75 }}>
                No brands in API. Add one under Catalog.
              </p>
            )}
          </div>
        </div>
        <div className="mb-3 grid gap-3 sm:grid-cols-2">
          <ThemedTextField
            size="sm"
            type="number"
            label="Price (EUR)"
            value={fPrice}
            onChange={(e) => setFPrice(e.target.value)}
            min={0}
            step="0.01"
            inputClassName="font-mono"
          />
          <ThemedTextField
            size="sm"
            type="number"
            label="Stock"
            value={fStock}
            onChange={(e) => setFStock(e.target.value)}
            min={0}
            inputClassName="font-mono"
          />
        </div>
        <div className="mb-3">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <p className="text-base font-medium" style={{ color: colors.text }}>
              Main image (hero) path
            </p>
            <AdminImageUploadButton onUploaded={setFImage} disabled={!canMutate || saving}>
              Upload
            </AdminImageUploadButton>
          </div>
          <ThemedTextField
            size="sm"
            value={fImage}
            onChange={(e) => setFImage(e.target.value)}
            placeholder="e.g. img/products/….jpg (or use Upload; placeholder if empty on create)"
            helperText="Saves to public/assets/img/products/ on the dev API."
          />
        </div>
        <div className="mb-3">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <p className="text-base font-medium" style={{ color: colors.text }}>
              Thumbnail (optional, for home / shop / cart)
            </p>
            <AdminImageUploadButton onUploaded={setFThumb} disabled={!canMutate || saving}>
              Upload
            </AdminImageUploadButton>
          </div>
          <ThemedTextField
            size="sm"
            value={fThumb}
            onChange={(e) => setFThumb(e.target.value)}
            placeholder="Smaller or square asset; if empty, main image is used in grids"
          />
        </div>
        <div className="mb-3">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <p className="text-base font-medium" style={{ color: colors.text }}>
              Extra gallery images
            </p>
            <AdminImageUploadButton
              onUploaded={(p) => setFImagesExtra((prev) => `${(prev + "\n" + p).trim()}\n`)}
              disabled={!canMutate || saving}
            >
              Add photo
            </AdminImageUploadButton>
          </div>
          <ThemedTextField
            size="sm"
            value={fImagesExtra}
            onChange={(e) => setFImagesExtra(e.target.value)}
            multiline
            rows={4}
            placeholder="One path per line — or use Add photo to append a line after each upload"
          />
        </div>
        <StatusSelect value={fDel} onChange={setFDel} id="p-del" />
      </AdminModal>
    </AdminLayout>
  );
}
