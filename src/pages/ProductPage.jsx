import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { FiHeart, FiShoppingCart, FiTruck, FiPackage } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import AppLayout from "../components/AppLayout";
import QuantityControl from "../components/QuantityControl";
import ThemedButton from "../components/ThemedButton";
import { useCart } from "../lib/cartContext";
import { useTheme } from "../theme/themeContext";
import { useWishlist } from "../lib/wishlistContext";
import { activeProducts, categoriesById, brandsById, productsById, price } from "../lib/storeData";
import { getProductCardImageUrl, getProductGalleryImageUrls } from "../lib/productImages";
import { getReviewsForProduct, getReviewSummary } from "../data/productReviews";

function ReviewStars({ rating, colors, iconSize = 18 }) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-1" style={{ color: colors.primary }}>
      {Array.from({ length: 5 }).map((_, index) => {
        const isFull = index < fullStars;
        const isHalf = !isFull && halfStar && index === fullStars;
        return (
          <span
            key={`star-${rating}-${index}`}
            aria-label={isHalf ? "half star" : isFull ? "full star" : "empty star"}
            className="leading-none"
            style={{ fontSize: `${iconSize}px` }}
          >
            {isFull ? "★" : isHalf ? "⯨" : "☆"}
          </span>
        );
      })}
    </div>
  );
}

function ShopProductCard({ product, colors, onAddToCart, onToggleWishlist, wishlisted }) {
  const productImage = getProductCardImageUrl(product);
  return (
    <article className="hover-lift rounded-lg p-3 shadow-sm" style={{ backgroundColor: colors.background }}>
      <Link to={`/product-page/${product.ID}`}>
        <img src={productImage} alt={product.Name} className="h-44 w-full rounded object-cover md:h-48" loading="lazy" />
      </Link>
      <div className="mt-3 space-y-3">
        <div className="space-y-1">
          <Link to={`/product-page/${product.ID}`}>
            <p className="truncate text-sm" style={{ color: colors.text }}>{product.Name.trim()}</p>
          </Link>
          <p className="text-lg font-semibold" style={{ color: colors.primary }}>{price.format(product.Price)}</p>
        </div>
        <div className="flex items-center gap-2">
          <ThemedButton
            type="button"
            variant="greenSolid"
            className="h-10 flex-1"
            onClick={() => onAddToCart(product.ID)}
          >
            <span className="inline-flex items-center justify-center gap-1 whitespace-nowrap">
              <FiShoppingCart size={14} className="sm:hidden" />
              <FiShoppingCart size={15} className="hidden sm:inline" />
              <span className="sm:hidden">Add</span>
              <span className="hidden sm:inline">Add to Cart</span>
            </span>
          </ThemedButton>
          <ThemedButton
            type="button"
            variant="redSolid"
            size="sm"
            className="h-10 w-10 p-0"
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            onClick={() => onToggleWishlist(product.ID)}
          >
            {wishlisted ? <FaHeart size={14} /> : <FiHeart size={16} />}
          </ThemedButton>
        </div>
      </div>
    </article>
  );
}

export default function ProductPage() {
  const { colors } = useTheme();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const navigate = useNavigate();
  const params = useParams();
  const product = productsById.get(Number(params.productId));
  if (!product) return <Navigate to="/404" replace />;

  const category = categoriesById.get(product.Category);
  const brand = brandsById.get(product.Brand);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(3);

  const relatedProducts = activeProducts.filter((item) => item.ID !== product.ID).slice(0, 4);
  const galleryImages = useMemo(() => getProductGalleryImageUrls(product), [product]);
  useEffect(() => {
    setSelectedImageIndex(0);
  }, [product.ID]);
  const wishlisted = isWishlisted(product.ID);
  const productReviews = useMemo(() => getReviewsForProduct(product.ID), [product.ID]);
  const { totalReviews, averageRating } = useMemo(
    () => getReviewSummary(productReviews),
    [productReviews],
  );
  const hasStock = product.Stock > 0;

  const handleAddToCart = (productId, itemCount = 1) => {
    Array.from({ length: itemCount }).forEach(() => addToCart(productId));
  };
  const decreaseQuantity = () => {
    setQuantity((current) => Math.max(1, current - 1));
  };
  const increaseQuantity = () => {
    setQuantity((current) => Math.min(99, current + 1));
  };
  const handleQuantityChange = (value) => {
    const parsed = Number.parseInt(String(value), 10);
    if (Number.isNaN(parsed)) {
      setQuantity(1);
      return;
    }
    setQuantity(Math.max(1, Math.min(99, parsed)));
  };

  return (
    <AppLayout title={product.Name.trim()} showPageHeader={false} contentClassName="space-y-8">
      <section className="text-sm" style={{ color: colors.text }}>
        <Link to="/" className="hover:underline" style={{ color: colors.text }}>Home</Link>&nbsp;&gt;&nbsp;
        <Link to={`/shop?category=${product.Category}`} className="hover:underline" style={{ color: colors.text }}>{category?.Name ?? "Category"}</Link>&nbsp;&gt;&nbsp;
        <span style={{ color: colors.primary }}>{product.Name.trim()}</span>
      </section>
      <section className="grid gap-6 lg:grid-cols-[1.1fr,1fr] lg:items-stretch">
        <div className="grid gap-2 md:grid-cols-[56px,1fr] lg:h-full">
          <div className="order-2 flex gap-2 overflow-x-auto pb-1 md:order-1 md:flex-col md:overflow-visible">
            {galleryImages.map((image, index) => (
              <button
                key={`thumb-${index}-${image}`}
                type="button"
                aria-label={`View image ${index + 1}`}
                className="h-12 w-12 shrink-0 overflow-hidden rounded border"
                onClick={() => setSelectedImageIndex(index)}
                style={{
                  borderColor: selectedImageIndex === index ? colors.primary : colors.border,
                  backgroundColor: colors.background,
                }}
              >
                <img src={image} alt={`${product.Name} thumbnail ${index + 1}`} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
          <img
            src={galleryImages[selectedImageIndex]}
            alt={product.Name}
            className="order-1 h-[360px] w-full rounded object-cover md:h-[420px] lg:h-full"
          />
        </div>
        <div className="space-y-4">
          <div className="border-b pb-4" style={{ borderColor: colors.border }}>
            <h1 className="text-3xl font-semibold" style={{ color: colors.text }}>{product.Name.trim()}</h1>
            <p className="mt-2 text-4xl font-semibold" style={{ color: colors.primary }}>{price.format(product.Price)}</p>
            <p className="mt-3 text-sm leading-6" style={{ color: colors.text }}>{product.Description}</p>
            <p className="mt-3 text-sm" style={{ color: colors.success }}>
              {hasStock ? `${product.Stock} In Stock` : "Out of Stock"}
            </p>
            <div className="mt-3 flex items-center gap-3 text-sm">
              <span style={{ color: colors.text }}>Quantity</span>
              <QuantityControl
                value={quantity}
                colors={colors}
                onDecrease={decreaseQuantity}
                onIncrease={increaseQuantity}
                onChange={handleQuantityChange}
                decrementAriaLabel={`Decrease quantity for ${product.Name.trim()}`}
                incrementAriaLabel={`Increase quantity for ${product.Name.trim()}`}
                inputAriaLabel={`Quantity for ${product.Name.trim()}`}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemedButton
              type="button"
              variant="greenSolid"
              className="h-10 px-4"
              onClick={() => handleAddToCart(product.ID, quantity)}
            >
              <span className="inline-flex items-center gap-1">
                <FiShoppingCart size={16} />
                Add to Cart
              </span>
            </ThemedButton>
            <ThemedButton
              type="button"
              variant="redSolid"
              size="sm"
              className="h-10 w-10 p-0"
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              onClick={() => toggleWishlist(product.ID)}
            >
              {wishlisted ? <FaHeart size={16} /> : <FiHeart size={18} />}
            </ThemedButton>
          </div>
          <div className="space-y-3 rounded p-3" style={{ backgroundColor: colors.background }}>
            <div className="flex items-start gap-3">
              <FiPackage size={20} style={{ color: colors.primary }} />
              <div className="text-sm">
                <p className="font-semibold" style={{ color: colors.text }}>Pick Up from Store</p>
                <p style={{ color: colors.text }}>Free to Pick Up</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FiTruck size={20} style={{ color: colors.primary }} />
              <div className="text-sm">
                <p className="font-semibold" style={{ color: colors.text }}>Free Delivery</p>
                <p style={{ color: colors.text }}>All Over Malta and Gozo when spending over €50</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded p-3" style={{ backgroundColor: colors.background }}>
              <span style={{ color: colors.text }}>Category</span>
              <p className="font-semibold">{category?.Name ?? "Unknown"}</p>
            </div>
            <div className="rounded p-3" style={{ backgroundColor: colors.background }}>
              <span style={{ color: colors.text }}>Brand</span>
              <p className="font-semibold">{brand?.Name ?? "Unknown"}</p>
            </div>
          </div>
        </div>
      </section>
      <section className="space-y-4 lg:max-w-[600px]">
        <div className="flex flex-wrap items-center gap-2 text-xl" style={{ color: colors.text }}>
          <span>{totalReviews} Reviews</span>
          <span>|</span>
          <span>{averageRating}</span>
          <ReviewStars rating={averageRating} colors={colors} iconSize={20} />
        </div>
        <div className="space-y-3">
          {productReviews.map((review) => (
            <article
              key={review.id}
              className="rounded p-3 shadow-sm"
              style={{ backgroundColor: colors.background }}
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-sm" style={{ color: colors.text }}>
                  <span className="font-semibold">{review.user}</span> on {review.date}
                </p>
                <ReviewStars rating={review.rating} colors={colors} />
              </div>
              <p className="text-sm leading-6" style={{ color: colors.text }}>{review.text}</p>
            </article>
          ))}
        </div>
        <ThemedButton
          type="button"
          variant="greenSolid"
          className="w-full"
          onClick={() => navigate(`/product-page/${product.ID}/reviews`)}
        >
          See All Reviews
        </ThemedButton>
      </section>
      <section className="space-y-4">
        <div className="border-b pb-3" style={{ borderColor: colors.primary }}>
          <h2 className="text-4xl font-semibold" style={{ color: colors.text }}>More to Love</h2>
        </div>
      </section>
      <section>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {relatedProducts.map((item) => (
            <ShopProductCard
              key={item.ID}
              product={item}
              colors={colors}
              onAddToCart={handleAddToCart}
              onToggleWishlist={toggleWishlist}
              wishlisted={isWishlisted(item.ID)}
            />
          ))}
        </div>
      </section>
    </AppLayout>
  );
}

