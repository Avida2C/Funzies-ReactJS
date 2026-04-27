import { Link } from "react-router-dom";
import { FiHeart, FiShoppingCart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import AppLayout from "../components/AppLayout";
import { useCart } from "../lib/cartContext";
import { useTheme } from "../theme/themeContext";
import { useWishlist } from "../lib/wishlistContext";
import { getProductCardImageUrl } from "../lib/productImages";
import { activeProducts, price } from "../lib/storeData";

function WishlistProductCard({ product, colors, onToggleWishlist }) {
  const { addToCart } = useCart();
  const productImage = getProductCardImageUrl(product);

  return (
    <article className="hover-lift rounded-lg p-3 shadow-sm" style={{ backgroundColor: colors.background }}>
      <Link to={`/product-page/${product.ID}`}>
        <img src={productImage} alt={product.Name} className="h-40 w-full rounded object-cover" loading="lazy" />
      </Link>
      <div className="mt-3 space-y-2">
        <Link to={`/product-page/${product.ID}`}>
          <p className="line-clamp-1 text-[13px]" style={{ color: colors.text }}>
            {product.Name.trim()}
          </p>
        </Link>
        <p className="text-lg font-semibold" style={{ color: colors.primary }}>
          {price.format(product.Price)}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="hover-accent h-9 flex-1 rounded px-2 text-xs font-semibold text-white sm:px-3 sm:text-sm"
            style={{ backgroundColor: colors.success }}
            onClick={() => addToCart(product.ID)}
          >
            <span className="inline-flex items-center gap-1">
              <FiShoppingCart size={12} className="sm:hidden" />
              <FiShoppingCart size={14} className="hidden sm:inline" />
              <span className="whitespace-nowrap">
                <span className="sm:hidden">Add</span>
                <span className="hidden sm:inline">Add to Cart</span>
              </span>
            </span>
          </button>
          <button
            type="button"
            className="hover-icon h-9 w-9 rounded text-white"
            style={{ backgroundColor: colors.primary }}
            aria-label="Remove from wishlist"
            onClick={() => onToggleWishlist(product.ID)}
          >
            <span className="inline-flex items-center justify-center">
              <FaHeart size={15} />
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}

export default function WishlistPage() {
  const { colors } = useTheme();
  const { wishlistProductIds, toggleWishlist } = useWishlist();
  const wishlistProducts = activeProducts.filter((product) => wishlistProductIds.includes(product.ID));

  return (
    <AppLayout title="Wishlist" description="Your hearted items all in one place." contentClassName="space-y-6">
      {wishlistProducts.length === 0 ? (
        <section className="rounded-lg p-6 shadow md:p-8" style={{ backgroundColor: colors.background, color: colors.text }}>
          <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
            <span
              className="inline-flex h-14 w-14 items-center justify-center rounded-full"
              style={{ backgroundColor: `${colors.primary}22`, color: colors.primary }}
            >
              <FiHeart size={24} />
            </span>
            <h2 className="mt-4 text-2xl font-semibold">Your wishlist is empty</h2>
            <p className="mt-2 text-sm opacity-80">
              Heart products you love and they will show up here so you can quickly find them later.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="rounded-full px-3 py-1" style={{ backgroundColor: `${colors.primary}18`, color: colors.primary }}>
                Save favorites
              </span>
              <span className="rounded-full px-3 py-1" style={{ backgroundColor: `${colors.success}22`, color: colors.success }}>
                Compare later
              </span>
              <span className="rounded-full px-3 py-1" style={{ backgroundColor: `${colors.info}22`, color: colors.info }}>
                Buy when ready
              </span>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link to="/shop" className="inline-flex rounded px-4 py-2 text-sm font-semibold text-white" style={{ backgroundColor: colors.primary }}>
                Browse products
              </Link>
              <Link
                to="/shop?category=1"
                className="inline-flex rounded border px-4 py-2 text-sm font-semibold"
                style={{ borderColor: colors.border, color: colors.text }}
              >
                Explore categories
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <section className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {wishlistProducts.map((product) => (
            <WishlistProductCard key={product.ID} product={product} colors={colors} onToggleWishlist={toggleWishlist} />
          ))}
        </section>
      )}
    </AppLayout>
  );
}
