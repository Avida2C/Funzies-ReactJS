import { Link, useSearchParams } from "react-router-dom";
import { FiHeart, FiShoppingCart } from "react-icons/fi";
import AppLayout from "../components/AppLayout";
import { useTheme } from "../theme/themeContext";
import {
  activeCategories,
  activeProducts,
  brandsById,
  categoriesById,
  frontBannerImage,
  frontProductImage,
  price,
  resolveAssetPath,
} from "../lib/storeData";

function ShopProductCard({ product, colors }) {
  const productImage = resolveAssetPath(product.Image) || frontProductImage;
  return (
    <article className="hover-lift rounded-lg p-2 shadow-sm" style={{ backgroundColor: colors.background }}>
      <Link to={`/product-page/${product.ID}`}><img src={productImage} alt={product.Name} className="h-36 w-full rounded object-cover md:h-40" loading="lazy" /></Link>
      <div className="mt-2 space-y-1">
        <Link to={`/product-page/${product.ID}`}><p className="truncate text-[11px]" style={{ color: colors.text }}>{product.Name.trim()}</p></Link>
        <p className="text-base font-semibold" style={{ color: colors.primary }}>{price.format(product.Price)}</p>
        <div className="flex items-center gap-2">
          <button type="button" className="hover-accent h-7 flex-1 rounded px-2 text-xs font-semibold text-white" style={{ backgroundColor: colors.success }}><span className="inline-flex items-center gap-1"><FiShoppingCart size={12} />Add to Cart</span></button>
          <button type="button" className="hover-icon h-7 w-7 rounded text-white" style={{ backgroundColor: colors.primary }} aria-label="Add to wishlist"><span className="inline-flex items-center justify-center"><FiHeart size={14} /></span></button>
        </div>
      </div>
    </article>
  );
}

export default function ShopPage() {
  const { colors } = useTheme();
  const [searchParams] = useSearchParams();
  const rawCategory = searchParams.get("category");
  const rawQuery = searchParams.get("q") ?? "";
  const normalizedQuery = rawQuery.trim().toLowerCase();
  const selectedCategoryId = rawCategory ? Number.parseInt(rawCategory, 10) : null;

  const categoryCounts = activeProducts.reduce((counts, product) => {
    counts.set(product.Category, (counts.get(product.Category) ?? 0) + 1);
    return counts;
  }, new Map());

  const categoriesWithCount = activeCategories
    .map((category) => ({ id: category.ID, name: category.Name, count: categoryCounts.get(category.ID) ?? 0 }))
    .filter((category) => category.count > 0)
    .sort((a, b) => b.count - a.count);

  const hasCategoryFilter = selectedCategoryId !== null && categoriesWithCount.some((category) => category.id === selectedCategoryId);
  const categoryFilteredProducts = hasCategoryFilter ? activeProducts.filter((product) => product.Category === selectedCategoryId) : activeProducts;

  const displayedProducts = normalizedQuery
    ? categoryFilteredProducts.filter((product) => {
        const categoryName = categoriesById.get(product.Category)?.Name ?? "";
        const brandName = brandsById.get(product.Brand)?.Name ?? "";
        return `${product.Name} ${product.Description ?? ""} ${categoryName} ${brandName}`.toLowerCase().includes(normalizedQuery);
      })
    : categoryFilteredProducts;

  return (
    <AppLayout showPageHeader={false} contentClassName="space-y-5">
      <section className="overflow-hidden rounded-lg shadow"><img src={frontBannerImage} alt="Shop gaming banner" className="h-28 w-full object-cover md:h-36" /></section>
      <section className="grid gap-4 lg:grid-cols-[220px,1fr]">
        <aside className="rounded-lg p-4" style={{ backgroundColor: colors.background }}>
          <h2 className="mb-3 text-lg font-semibold" style={{ color: colors.primary }}>Product Categories</h2>
          <ul className="space-y-2">
            {categoriesWithCount.map((category) => {
              const isActive = hasCategoryFilter && category.id === selectedCategoryId;
              const params = new URLSearchParams(searchParams);
              params.set("category", String(category.id));
              const categoryLink = `/shop?${params.toString()}`;
              return (
                <li key={category.id} className="flex items-center justify-between text-sm" style={{ color: colors.text }}>
                  <Link to={categoryLink} className="truncate rounded px-2 py-1 hover:underline" style={{ color: isActive ? colors.primary : colors.text, fontWeight: isActive ? 700 : 400 }}>{category.name}</Link>
                  <Link to={categoryLink} className="min-w-[28px] rounded-full px-2 py-0.5 text-center text-xs font-semibold text-white" style={{ backgroundColor: colors.primary }}>{category.count}</Link>
                </li>
              );
            })}
          </ul>
        </aside>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {displayedProducts.map((product) => <ShopProductCard key={product.ID} product={product} colors={colors} />)}
        </div>
      </section>
    </AppLayout>
  );
}

