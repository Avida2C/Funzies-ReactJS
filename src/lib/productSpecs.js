import { brandsById, categoriesById } from "./storeData";

const SCALE_PATTERNS = [
  { re: /\b1\s*[:/]\s*18\b/i, value: "1:18" },
  { re: /\b1\s*[:/]\s*24\b/i, value: "1:24" },
  { re: /\b1\s*[:/]\s*32\b/i, value: "1:32" },
  { re: /\b1\s*[:/]\s*43\b/i, value: "1:43" },
  { re: /\b1\s*[:/]\s*64\b/i, value: "1:64" },
  { re: /\b1\s*[:/]\s*12\b/i, value: "1:12" },
  { re: /\b1\s*[:/]\s*6\b/i, value: "1:6" },
];

function trimField(value) {
  const text = String(value ?? "").trim();
  return text;
}

function blobFor(product) {
  return `${product?.Name ?? ""} ${product?.Description ?? ""}`;
}

function inferScale(product, categoryName, brandName) {
  const blob = blobFor(product);
  for (const { re, value } of SCALE_PATTERNS) {
    if (re.test(blob)) {
      return value;
    }
  }

  const brand = String(brandName ?? "").toLowerCase();
  const category = String(categoryName ?? "").toLowerCase();
  const name = blob.toLowerCase();

  if (brand.includes("funko") || name.includes("funko") || name.includes("pop!")) {
    return "3.75\"";
  }
  if (brand.includes("lego") || name.includes("lego")) {
    return "Minifig";
  }
  if (category.includes("model") || brand.includes("maisto") || brand.includes("burago")) {
    return "1:24";
  }
  if (category.includes("figurine") || brand.includes("banpresto") || brand.includes("bandai")) {
    return "Prize figure";
  }
  if (category.includes("plush")) {
    return "Plush";
  }
  if (category.includes("puzzle")) {
    return "—";
  }
  if (category.includes("board") || category.includes("playing card")) {
    return "—";
  }
  return "—";
}

function inferSeries(product, brandName) {
  const name = String(product?.Name ?? "").trim();
  const brand = String(brandName ?? "").trim();
  const lowerName = name.toLowerCase();
  const lowerBrand = brand.toLowerCase();

  if (lowerName.includes("ticket to ride")) {
    return "Ticket to Ride";
  }
  if (lowerName.includes("petrichor")) {
    return "Petrichor";
  }
  if (lowerName.startsWith("viticulture") || lowerName.includes("tuscany")) {
    return "Viticulture";
  }
  if (lowerBrand.includes("funko")) {
    return "Pop!";
  }
  if (lowerBrand.includes("lego")) {
    return "LEGO";
  }
  if (lowerBrand.includes("maisto") || lowerBrand.includes("burago")) {
    return "Die-cast";
  }
  if (lowerBrand.includes("playmobil")) {
    return "Playmobil";
  }
  if (brand) {
    return brand;
  }
  const beforeColon = name.split(":")[0]?.trim();
  if (beforeColon && beforeColon.length >= 3 && beforeColon.length < name.length) {
    return beforeColon;
  }
  return name || "—";
}

export function formatProductSku(productId) {
  const id = Number(productId);
  if (!Number.isFinite(id) || id < 1) {
    return "";
  }
  return `FZ-${String(id).padStart(5, "0")}`;
}

/**
 * Resolved collectible specs. Stored `SKU` / `Series` / `Scale` win when present;
 * otherwise values are inferred so the catalog is usable without a bulk data rewrite.
 */
export function getProductSpecs(product, extras = {}) {
  const brand = extras.brand ?? brandsById.get(product?.Brand);
  const category = extras.category ?? categoriesById.get(product?.Category);
  const brandName = brand?.Name?.trim() ?? "";
  const categoryName = category?.Name?.trim() ?? "";

  const sku = trimField(product?.SKU) || formatProductSku(product?.ID);
  const series = trimField(product?.Series) || inferSeries(product, brandName);
  const scale = trimField(product?.Scale) || inferScale(product, categoryName, brandName);

  return {
    sku,
    series,
    scale,
    hasCustomSku: Boolean(trimField(product?.SKU)),
    hasCustomSeries: Boolean(trimField(product?.Series)),
    hasCustomScale: Boolean(trimField(product?.Scale)),
  };
}

export function productSpecsSearchText(product, extras = {}) {
  const specs = getProductSpecs(product, extras);
  return `${specs.sku} ${specs.series} ${specs.scale}`;
}

export function specsMatchFilter(product, { series = "", scale = "", sku = "" } = {}, extras = {}) {
  const specs = getProductSpecs(product, extras);
  const wantSeries = String(series ?? "").trim().toLowerCase();
  const wantScale = String(scale ?? "").trim().toLowerCase();
  const wantSku = String(sku ?? "").trim().toLowerCase();
  if (wantSeries && specs.series.toLowerCase() !== wantSeries) {
    return false;
  }
  if (wantScale && specs.scale.toLowerCase() !== wantScale) {
    return false;
  }
  if (wantSku && specs.sku.toLowerCase() !== wantSku) {
    return false;
  }
  return true;
}
