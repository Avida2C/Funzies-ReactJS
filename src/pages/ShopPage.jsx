import { Link, useSearchParams } from "react-router-dom";
import { FiBookmark, FiHeart, FiList, FiShoppingCart } from "react-icons/fi";
import { FaBookmark, FaHeart } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import AppLayout from "../components/AppLayout";
import ThemedButton from "../components/ThemedButton";
import { useAuth } from "../lib/authContext";
import { useCart } from "../lib/cartContext";
import {
  defaultSearchName,
  hasSavableShopFilters,
  SORT_LABELS,
  useSavedSearches,
} from "../lib/savedSearchesContext";
import { useTheme } from "../theme/themeContext";
import { useWishlist } from "../lib/wishlistContext";
import { getProductCardImageUrl } from "../lib/productImages";
import { getProductSpecs, productSpecsSearchText, specsMatchFilter } from "../lib/productSpecs";
import {
  activeCategories,
  activeProducts,
  brandsById,
  categoriesById,
  frontBannerImage,
  price,
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

const PRODUCTS_PAGE_SIZE = 10;

function ShopProductCard({ product, colors }) {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const productImage = getProductCardImageUrl(product);
  const wishlisted = isWishlisted(product.ID);
  const specs = getProductSpecs(product);
  return (
    <article className="hover-lift rounded-lg p-2 shadow-sm" style={{ backgroundColor: colors.background }}>
      <Link to={`/product-page/${product.ID}`}><img src={productImage} alt={product.Name} className="h-36 w-full rounded object-cover md:h-40" loading="lazy" /></Link>
      <div className="mt-2 space-y-1">
        <Link to={`/product-page/${product.ID}`}><p className="truncate text-[11px]" style={{ color: colors.text }}>{product.Name.trim()}</p></Link>
        <p className="truncate text-[10px]" style={{ color: colors.text, opacity: 0.75 }}>
          {specs.series}
          {specs.scale && specs.scale !== "—" ? ` · ${specs.scale}` : ""}
        </p>
        <p className="text-base font-semibold" style={{ color: colors.primary }}>{price.format(product.Price)}</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="hover-accent h-8 flex-1 rounded px-2 text-xs font-semibold text-white sm:h-9 sm:px-3 sm:text-sm"
            style={{ backgroundColor: colors.success }}
            onClick={() => addToCart(product.ID)}
          >
            <span className="inline-flex items-center justify-center gap-1 whitespace-nowrap">
              <FiShoppingCart size={12} className="sm:hidden" />
              <FiShoppingCart size={14} className="hidden sm:inline" />
              <span className="sm:hidden">Add</span>
              <span className="hidden sm:inline">Add to Cart</span>
            </span>
          </button>
          <ThemedButton
            type="button"
            variant="redSolid"
            size="sm"
            className="hover-icon h-7 w-7 p-0"
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            onClick={() => toggleWishlist(product.ID)}
          >
            <span className="inline-flex items-center justify-center">
              {wishlisted ? <FaHeart size={13} /> : <FiHeart size={14} />}
            </span>
          </ThemedButton>
        </div>
      </div>
    </article>
  );
}

export default function ShopPage() {
  const { colors } = useTheme();
  const { isAuthenticated } = useAuth();
  const { isSearchSaved, saveSearch, removeMatchingSearch } = useSavedSearches();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
  const [visibleProductsCount, setVisibleProductsCount] = useState(PRODUCTS_PAGE_SIZE);
  const loadMoreTriggerRef = useRef(null);
  const rawCategory = searchParams.get("category");
  const rawQuery = searchParams.get("q") ?? "";
  const selectedSort = searchParams.get("sort") ?? "featured";
  const selectedSeries = (searchParams.get("series") ?? "").trim();
  const selectedScale = (searchParams.get("scale") ?? "").trim();
  const selectedSku = (searchParams.get("sku") ?? "").trim();
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
  const queriedProducts = normalizedQuery
    ? categoryFilteredProducts.filter((product) => {
        const categoryName = categoriesById.get(product.Category)?.Name ?? "";
        const brandName = brandsById.get(product.Brand)?.Name ?? "";
        const specsText = productSpecsSearchText(product);
        const searchableText = `${product.Name} ${product.Description ?? ""} ${categoryName} ${brandName} ${specsText}`.toLowerCase();

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

  const displayedProducts = queriedProducts.filter((product) =>
    specsMatchFilter(product, { series: selectedSeries, scale: selectedScale, sku: selectedSku }),
  );

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

  useEffect(() => {
    setVisibleProductsCount(PRODUCTS_PAGE_SIZE);
  }, [selectedSort, normalizedQuery, selectedCategoryId, selectedSeries, selectedScale, selectedSku]);

  const visibleProducts = sortedProducts.slice(0, visibleProductsCount);
  const hasMoreProducts = visibleProducts.length < sortedProducts.length;

  useEffect(() => {
    if (!hasMoreProducts || !loadMoreTriggerRef.current) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setVisibleProductsCount((previousCount) =>
            Math.min(previousCount + PRODUCTS_PAGE_SIZE, sortedProducts.length),
          );
        }
      },
      { rootMargin: "120px 0px" },
    );

    observer.observe(loadMoreTriggerRef.current);
    return () => observer.disconnect();
  }, [hasMoreProducts, sortedProducts.length]);

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

  const clearSeriesFilter = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("series");
    setSearchParams(params);
  };

  const clearScaleFilter = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("scale");
    setSearchParams(params);
  };

  const clearSkuFilter = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("sku");
    setSearchParams(params);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const hasSearchFilter = normalizedQuery.length > 0;
  const hasCategoryTag = hasCategoryFilter && Boolean(selectedCategoryName);
  const hasSortFilter = selectedSort !== "featured";
  const hasSeriesFilter = selectedSeries.length > 0;
  const hasScaleFilter = selectedScale.length > 0;
  const hasSkuFilter = selectedSku.length > 0;
  const hasAnyFilter = hasSearchFilter || hasCategoryTag || hasSortFilter || hasSeriesFilter || hasScaleFilter || hasSkuFilter;
  const currentFilters = {
    q: rawQuery.trim(),
    category: hasCategoryFilter ? String(selectedCategoryId) : "",
    sort: selectedSort,
    series: selectedSeries,
    scale: selectedScale,
    sku: selectedSku,
  };
  const canSaveCurrentSearch = hasSavableShopFilters(currentFilters);
  const searchIsSaved = isSearchSaved(currentFilters);
  const closeMobileCategories = () => setIsMobileCategoriesOpen(false);

  const handleToggleSaveSearch = () => {
    if (!isAuthenticated) {
      return;
    }
    if (searchIsSaved) {
      removeMatchingSearch(currentFilters);
      return;
    }
    saveSearch({
      ...currentFilters,
      categoryName: selectedCategoryName,
      name: defaultSearchName({
        q: currentFilters.q,
        categoryName: selectedCategoryName,
        sort: currentFilters.sort,
        series: currentFilters.series,
        scale: currentFilters.scale,
        sku: currentFilters.sku,
      }),
    });
  };

  const renderCategoryLinks = (onNavigate) => (
    <ul className="space-y-2">
      {categoriesWithCount.map((category) => {
        const isActive = hasCategoryFilter && category.id === selectedCategoryId;
        const params = new URLSearchParams(searchParams);
        params.delete("q");
        params.set("category", String(category.id));
        const categoryLink = `/shop?${params.toString()}`;
        return (
          <li key={category.id} className="flex items-center justify-between text-sm" style={{ color: colors.text }}>
            <Link
              to={categoryLink}
              className="truncate rounded px-2 py-1 hover:underline"
              style={{ color: isActive ? colors.primary : colors.text, fontWeight: isActive ? 700 : 400 }}
              onClick={onNavigate}
            >
              {category.name}
            </Link>
            <Link
              to={categoryLink}
              className="min-w-[28px] rounded-full px-2 py-0.5 text-center text-xs font-semibold text-white"
              style={{ backgroundColor: colors.primary }}
              onClick={onNavigate}
            >
              {category.count}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <AppLayout title="Shop" showPageHeader={false} contentClassName="space-y-5">
      {isMobileCategoriesOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0"
            style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
            onClick={closeMobileCategories}
            aria-label="Close categories sidebar"
          />
          <aside
            className="absolute left-0 top-0 h-full w-[82%] max-w-[320px] overflow-y-auto p-4 shadow-xl"
            style={{ backgroundColor: colors.background }}
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold" style={{ color: colors.primary }}>Product Categories</h2>
              <button
                type="button"
                className="rounded px-2 py-1 text-sm font-semibold"
                style={{ border: `1px solid ${colors.border}`, color: colors.text }}
                onClick={closeMobileCategories}
              >
                Close
              </button>
            </div>
            {renderCategoryLinks(closeMobileCategories)}
          </aside>
        </div>
      )}
      <Link to="/shop?q=Funko%20Pop" className="block overflow-hidden rounded-lg shadow hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-offset-2" aria-label="Shop Funko Pop">
        <img src={frontBannerImage} alt="Funko Pop banner" className="h-28 w-full object-cover md:h-36" />
      </Link>
      <section className="grid gap-4 lg:grid-cols-[220px,1fr]">
        <aside className="hidden rounded-lg p-4 lg:block" style={{ backgroundColor: colors.background }}>
          <h2 className="mb-3 text-lg font-semibold" style={{ color: colors.primary }}>Product Categories</h2>
          {renderCategoryLinks()}
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
              {hasSeriesFilter && (
                <button
                  type="button"
                  onClick={clearSeriesFilter}
                  className="rounded-full border px-3 py-1 text-xs font-semibold"
                  style={{ borderColor: colors.border, color: colors.text }}
                >
                  Series: {selectedSeries} x
                </button>
              )}
              {hasScaleFilter && (
                <button
                  type="button"
                  onClick={clearScaleFilter}
                  className="rounded-full border px-3 py-1 text-xs font-semibold"
                  style={{ borderColor: colors.border, color: colors.text }}
                >
                  Scale: {selectedScale} x
                </button>
              )}
              {hasSkuFilter && (
                <button
                  type="button"
                  onClick={clearSkuFilter}
                  className="rounded-full border px-3 py-1 text-xs font-semibold"
                  style={{ borderColor: colors.border, color: colors.text }}
                >
                  SKU: {selectedSku} x
                </button>
              )}
              {canSaveCurrentSearch &&
                (isAuthenticated ? (
                  <button
                    type="button"
                    onClick={handleToggleSaveSearch}
                    className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold"
                    style={{
                      borderColor: searchIsSaved ? colors.primary : colors.border,
                      color: searchIsSaved ? colors.primary : colors.text,
                    }}
                    aria-pressed={searchIsSaved}
                  >
                    {searchIsSaved ? <FaBookmark size={12} /> : <FiBookmark size={12} />}
                    {searchIsSaved ? "Saved" : "Save search"}
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold no-underline"
                    style={{ borderColor: colors.border, color: colors.text }}
                  >
                    <FiBookmark size={12} />
                    Save search
                  </Link>
                ))}
              {isAuthenticated ? (
                <Link
                  to="/account?tab=saved-searches"
                  className="text-xs font-semibold no-underline hover:underline"
                  style={{ color: colors.primary }}
                >
                  Saved searches
                </Link>
              ) : null}
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
          <div
            className="flex items-center gap-3 overflow-x-auto rounded-lg p-3 shadow-sm whitespace-nowrap"
            style={{ backgroundColor: colors.background }}
          >
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded text-white lg:hidden"
              style={{ backgroundColor: colors.primary }}
              onClick={() => setIsMobileCategoriesOpen(true)}
              aria-label="Open categories"
            >
              <FiList size={18} />
            </button>
            <p className="text-sm font-medium" style={{ color: colors.text }}>
              {sortedProducts.length} item{sortedProducts.length === 1 ? "" : "s"}
            </p>
            <label className="ml-auto flex items-center gap-2 text-sm" style={{ color: colors.text }}>
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
            <section className="space-y-4">
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
                {visibleProducts.map((product) => <ShopProductCard key={product.ID} product={product} colors={colors} />)}
              </div>
              {hasMoreProducts && (
                <div ref={loadMoreTriggerRef} className="flex justify-center py-2 text-xs" style={{ color: colors.text }}>
                  Loading more products...
                </div>
              )}
            </section>
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

