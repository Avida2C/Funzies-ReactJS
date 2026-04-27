import data from "../data/funziesData.json";

export const price = new Intl.NumberFormat("en-MT", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
});

export const activeProducts = data.product.filter((item) => item.Deleted === 0);
export const activeCategories = data.category.filter((item) => item.Deleted === 0);
export const activeBrands = data.brand.filter((item) => item.Deleted === 0);

export const productsById = new Map(activeProducts.map((product) => [product.ID, product]));
export const categoriesById = new Map(activeCategories.map((category) => [category.ID, category]));
export const brandsById = new Map(activeBrands.map((brand) => [brand.ID, brand]));

// Use local public/ assets for stability (Figma MCP asset URLs can expire or require auth).
export const frontHeroImage = "/assets/img/LegoBanner.png";
export const frontProductImage = "/assets/img/comingsoon.jpg";
export const frontBannerImage = "/assets/img/FunkoBanner.png";
export const maistoBannerImage = "/assets/img/MaistoBanner.png";
export const logoLightMode = "/assets/img/logo/logo-lightmode.svg";
export const logoDarkMode = "/assets/img/logo/logo-darkmode.svg";

export function resolveAssetPath(path) {
  if (!path) {
    return "";
  }
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("/")) {
    return path;
  }
  return `/assets/${path}`;
}

