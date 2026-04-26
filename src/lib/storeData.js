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

export const frontHeroImage = "https://www.figma.com/api/mcp/asset/d0807e64-7360-4b7b-aae1-c2e9bc6aa3fd";
export const frontProductImage = "https://www.figma.com/api/mcp/asset/c00f60fd-7d43-4e36-acbc-8f9a36e6f44d";
export const frontBannerImage = "https://www.figma.com/api/mcp/asset/26d1804a-96e3-489d-a28e-ec02f9f515ef";
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

