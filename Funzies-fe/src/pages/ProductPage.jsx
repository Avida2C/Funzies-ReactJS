import { Link, Navigate, useParams } from "react-router-dom";
import { FiHeart, FiShoppingCart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import AppLayout from "../components/AppLayout";
import { useTheme } from "../theme/themeContext";
import { useWishlist } from "../lib/wishlistContext";
import {
  activeProducts,
  categoriesById,
  brandsById,
  productsById,
  frontProductImage,
  resolveAssetPath,
  price,
} from "../lib/storeData";

function ShopProductCard({ product, colors }) {
  const productImage = resolveAssetPath(product.Image) || frontProductImage;
  return (
    <article className="hover-lift rounded-lg p-2 shadow-sm" style={{ backgroundColor: colors.background }}>
      <Link to={`/product-page/${product.ID}`}><img src={productImage} alt={product.Name} className="h-36 w-full rounded object-cover md:h-40" loading="lazy" /></Link>
      <div className="mt-2 space-y-1">
        <Link to={`/product-page/${product.ID}`}><p className="truncate text-[11px]" style={{ color: colors.text }}>{product.Name.trim()}</p></Link>
        <p className="text-base font-semibold" style={{ color: colors.primary }}>{price.format(product.Price)}</p>
      </div>
    </article>
  );
}

export default function ProductPage() {
  const { colors } = useTheme();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const params = useParams();
  const product = productsById.get(Number(params.productId));
  if (!product) return <Navigate to="/404" replace />;

  const category = categoriesById.get(product.Category);
  const brand = brandsById.get(product.Brand);
  const productImage = resolveAssetPath(product.Image) || frontProductImage;
  const relatedProducts = activeProducts.filter((item) => item.ID !== product.ID).slice(0, 8);
  const wishlisted = isWishlisted(product.ID);

  return (
    <AppLayout showPageHeader={false} contentClassName="space-y-6">
      <section className="text-sm" style={{ color: colors.text }}>
        <Link to="/" className="hover:underline" style={{ color: colors.text }}>Home</Link>&nbsp;&gt;&nbsp;
        <Link to={`/shop?category=${product.Category}`} className="hover:underline" style={{ color: colors.text }}>{category?.Name ?? "Category"}</Link>&nbsp;&gt;&nbsp;
        <span style={{ color: colors.primary }}>{product.Name.trim()}</span>
      </section>
      <section className="grid gap-5 lg:grid-cols-[1.1fr,1fr]">
        <img src={productImage} alt={product.Name} className="h-[360px] w-full rounded object-cover md:h-[420px]" />
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold" style={{ color: colors.text }}>{product.Name.trim()}</h1>
          <p className="text-4xl font-semibold" style={{ color: colors.primary }}>{price.format(product.Price)}</p>
          <p className="text-sm leading-6" style={{ color: colors.text }}>{product.Description}</p>
          <p className="text-sm" style={{ color: colors.success }}>In Stock ({product.Stock})</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded p-3" style={{ backgroundColor: colors.background }}><span style={{ color: colors.text }}>Category</span><p className="font-semibold">{category?.Name ?? "Unknown"}</p></div>
            <div className="rounded p-3" style={{ backgroundColor: colors.background }}><span style={{ color: colors.text }}>Brand</span><p className="font-semibold">{brand?.Name ?? "Unknown"}</p></div>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" className="btn text-white" style={{ backgroundColor: colors.success }}><span className="inline-flex items-center gap-1"><FiShoppingCart size={16} />Add to Cart</span></button>
            <button
              type="button"
              className="btn text-white"
              style={{ backgroundColor: colors.primary }}
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              onClick={() => toggleWishlist(product.ID)}
            >
              {wishlisted ? <FaHeart size={16} /> : <FiHeart size={18} />}
            </button>
          </div>
        </div>
      </section>
      <section className="space-y-3">
        <h2 className="text-3xl" style={{ color: colors.text }}>More to Love</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{relatedProducts.map((item) => <ShopProductCard key={item.ID} product={item} colors={colors} />)}</div>
      </section>
    </AppLayout>
  );
}

