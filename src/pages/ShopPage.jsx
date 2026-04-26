import { Link, useSearchParams } from "react-router-dom";
import { FiHeart, FiShoppingCart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import AppLayout from "../components/AppLayout";
import { useCart } from "../lib/cartContext";
import { useTheme } from "../theme/themeContext";
import { useWishlist } from "../lib/wishlistContext";
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

const POPULAR_TAG_KEYWORDS = {
  anime: [
    "anime",
    "naruto",
    "one piece",
    "demon slayer",
    "dragon ball",
    "jujutsu kaisen",
    "chainsaw man",
    "death note",
    "sailor moon",
    "bleach",
    "my hero academia",
    "pokemon",
    "pikachu",
    "pancham",
    "squirtle",
    "jigglypuff",
    "scorbunny",
    "pichu",
    "plush",
    "squishme",
    "q posket",
    "sofvimates",
    "ichibansho",
    "banpresto",
  ],
  "funko pop": [
    "funko",
    "funko pop",
    "pop!",
    "pop vinyl",
    "vinyl figure",
  ],
};

const SORT_LABELS = {
  featured: "Featured",
  newest: "Newest",
  "price-desc": "Price: High to Low",
  "price-asc": "Price: Low to High",
  "name-asc": "Name: A to Z",
  "name-desc": "Name: Z to A",
};

function ShopProductCard({ product, colors }) {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const productImage = resolveAssetPath(product.Image) || frontProductImage;
  const wishlisted = isWishlisted(product.ID);
  return (
    <article className="hover-lift rounded-lg p-2 shadow-sm" style={{ backgroundColor: colors.background }}>
      <Link to={`/product-page/${product.ID}`}><img src={productImage} alt={product.Name} className="h-36 w-full rounded object-cover md:h-40" loading="lazy" /></Link>
      <div className="mt-2 space-y-1">
        <Link to={`/product-page/${product.ID}`}><p className="truncate text-[11px]" style={{ color: colors.text }}>{product.Name.trim()}</p></Link>
        <p className="text-base font-semibold" style={{ color: colors.primary }}>{price.format(product.Price)}</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="hover-accent h-7 flex-1 rounded px-2 text-xs font-semibold text-white"
            style={{ backgroundColor: colors.success }}
            onClick={() => addToCart(product.ID)}
          >
            <span className="inline-flex items-center gap-1"><FiShoppingCart size={12} />Add to Cart</span>
          </button>
          <button
            type="button"
            className="hover-icon h-7 w-7 rounded text-white"
            style={{ backgroundColor: colors.primary }}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            onClick={() => toggleWishlist(product.ID)}
          >
            <span className="inline-flex items-center justify-center">
              {wishlisted ? <FaHeart size={13} /> : <FiHeart size={14} />}
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}

export default function ShopPage() {
  const { colors } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const rawCategory = searchParams.get("category");
  const rawQuery = searchParams.get("q") ?? "";
  const selectedSort = searchParams.get("sort") ?? "featured";
  const normalizedQuery = rawQuery.trim().toLowerCase();
  const selectedCategoryId = rawCategory ? Number.parseInt(rawCategory, 10) : null;
  const selectedCategoryName = categoriesById.get(selectedCategoryId)?.Name ?? null;

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

  const animeKeywords = POPULAR_TAG_KEYWORDS.anime;
  const funkoPopKeywords = POPULAR_TAG_KEYWORDS["funko pop"];
  const displayedProducts = normalizedQuery
    ? categoryFilteredProducts.filter((product) => {
        const categoryName = categoriesById.get(product.Category)?.Name ?? "";
        const brandName = brandsById.get(product.Brand)?.Name ?? "";
        const searchableText = `${product.Name} ${product.Description ?? ""} ${categoryName} ${brandName}`.toLowerCase();

        if (normalizedQuery === "anime") {
          if (funkoPopKeywords.some((keyword) => searchableText.includes(keyword))) {
            return false;
          }
          return animeKeywords.some((keyword) => searchableText.includes(keyword));
        }

        if (normalizedQuery === "funko pop") {
          return funkoPopKeywords.some((keyword) => searchableText.includes(keyword));
        }

        return searchableText.includes(normalizedQuery);
      })
    : categoryFilteredProducts;

  const sortedProducts = [...displayedProducts].sort((leftProduct, rightProduct) => {
    if (selectedSort === "price-desc") {
      return rightProduct.Price - leftProduct.Price;
    }
    if (selectedSort === "price-asc") {
      return leftProduct.Price - rightProduct.Price;
    }
    if (selectedSort === "name-asc") {
      return leftProduct.Name.trim().localeCompare(rightProduct.Name.trim(), undefined, {
        sensitivity: "base",
        numeric: true,
      });
    }
    if (selectedSort === "name-desc") {
      return rightProduct.Name.trim().localeCompare(leftProduct.Name.trim(), undefined, {
        sensitivity: "base",
        numeric: true,
      });
    }
    if (selectedSort === "newest") {
      return rightProduct.ID - leftProduct.ID;
    }
    return 0;
  });

  const handleSortChange = (event) => {
    const nextSort = event.target.value;
    const params = new URLSearchParams(searchParams);
    if (nextSort === "featured") {
      params.delete("sort");
    } else {
      params.set("sort", nextSort);
    }
    setSearchParams(params);
  };

  const clearSearchFilter = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("q");
    setSearchParams(params);
  };

  const clearCategoryFilter = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("category");
    setSearchParams(params);
  };

  const clearSortFilter = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("sort");
    setSearchParams(params);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const hasSearchFilter = normalizedQuery.length > 0;
  const hasCategoryTag = hasCategoryFilter && Boolean(selectedCategoryName);
  const hasSortFilter = selectedSort !== "featured";
  const hasAnyFilter = hasSearchFilter || hasCategoryTag || hasSortFilter;

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
              params.delete("q");
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
        <div className="space-y-3">
          {hasAnyFilter && (
            <section className="flex flex-wrap items-center gap-2 rounded-lg p-3 shadow-sm" style={{ backgroundColor: colors.background }}>
              {hasSearchFilter && (
                <button
                  type="button"
                  onClick={clearSearchFilter}
                  className="rounded-full border px-3 py-1 text-xs font-semibold"
                  style={{ borderColor: colors.border, color: colors.text }}
                >
                  Search: {rawQuery.trim()} x
                </button>
              )}
              {hasCategoryTag && (
                <button
                  type="button"
                  onClick={clearCategoryFilter}
                  className="rounded-full border px-3 py-1 text-xs font-semibold"
                  style={{ borderColor: colors.border, color: colors.text }}
                >
                  Category: {selectedCategoryName} x
                </button>
              )}
              {hasSortFilter && (
                <button
                  type="button"
                  onClick={clearSortFilter}
                  className="rounded-full border px-3 py-1 text-xs font-semibold"
                  style={{ borderColor: colors.border, color: colors.text }}
                >
                  Sort: {SORT_LABELS[selectedSort] ?? selectedSort} x
                </button>
              )}
              <button
                type="button"
                onClick={clearAllFilters}
                className="ml-auto rounded px-3 py-1 text-xs font-semibold text-white"
                style={{ backgroundColor: colors.primary }}
              >
                Clear all
              </button>
            </section>
          )}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg p-3 shadow-sm" style={{ backgroundColor: colors.background }}>
            <p className="text-sm font-medium" style={{ color: colors.text }}>
              {sortedProducts.length} item{sortedProducts.length === 1 ? "" : "s"}
            </p>
            <label className="flex items-center gap-2 text-sm" style={{ color: colors.text }}>
              <span>Sort by</span>
              <select
                value={selectedSort}
                onChange={handleSortChange}
                className="rounded border px-2 py-1 text-sm"
                style={{ borderColor: colors.border, backgroundColor: colors.panel, color: colors.text }}
                aria-label="Sort products"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </label>
          </div>
          {sortedProducts.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {sortedProducts.map((product) => <ShopProductCard key={product.ID} product={product} colors={colors} />)}
            </div>
          ) : (
            <section
              className="flex min-h-[280px] flex-col items-center justify-center rounded-lg p-6 text-center shadow-sm"
              style={{ backgroundColor: colors.background, color: colors.text }}
            >
              <h3 className="text-lg font-semibold">No products found</h3>
              <p className="mt-2 text-sm opacity-80">
                {normalizedQuery
                  ? `No results match "${rawQuery.trim()}". Try a different keyword or clear filters.`
                  : "No items are available in this selection right now."}
              </p>
            </section>
          )}
        </div>
      </section>
    </AppLayout>
  );
}

