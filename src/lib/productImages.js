import { frontProductImage, resolveAssetPath } from "./storeData";

/**
 * Extra gallery paths from a product (API may send `string[]` or a JSON string; legacy none).
 * Does not include the main `Image` field — that is the primary/hero.
 * @param {unknown} raw
 * @returns {string[]}
 */
export function parseProductExtraImages(raw) {
  if (raw == null) {
    return [];
  }
  if (Array.isArray(raw)) {
    return raw.map((p) => String(p).trim()).filter(Boolean);
  }
  if (typeof raw === "string") {
    const t = raw.trim();
    if (!t) {
      return [];
    }
    if (t.startsWith("[")) {
      try {
        const j = JSON.parse(t);
        if (Array.isArray(j)) {
          return j.map((p) => String(p).trim()).filter(Boolean);
        }
      } catch {
        // fall through
      }
    }
    return t.split(/[\n,;]+/).map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

/**
 * Thumbnail for grids (home, shop, cart) — optional smaller asset; falls back to `Image`.
 * @param {object} product
 * @returns {string} Resolved URL
 */
export function getProductCardImageUrl(product) {
  const path = (product.Thumbnail && String(product.Thumbnail).trim()) || product.Image;
  return resolveAssetPath(path) || frontProductImage;
}

/**
 * All gallery URLs: main `Image` first, then `Images` (deduped). At least one URL.
 * @param {object} product
 * @returns {string[]}
 */
export function getProductGalleryImageUrls(product) {
  const main = product.Image && String(product.Image).trim();
  const extra = parseProductExtraImages(product.Images);
  const seen = new Set();
  const out = [];
  for (const p of [main, ...extra]) {
    if (!p) {
      continue;
    }
    if (seen.has(p)) {
      continue;
    }
    seen.add(p);
    const u = resolveAssetPath(p);
    if (u) {
      out.push(u);
    }
  }
  if (!out.length) {
    return [frontProductImage];
  }
  return out;
}

/**
 * @param {object} product
 * @returns {number}
 */
export function getProductExtraImageCount(product) {
  return parseProductExtraImages(product.Images).length;
}
