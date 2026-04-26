import { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import { useTheme } from "../theme/themeContext";
import { categoriesById, productsById } from "../lib/storeData";
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

function getRatingBucket(rating) {
  const rounded = Math.round(rating);
  return Math.max(1, Math.min(5, rounded));
}

export default function ProductReviewsPage() {
  const { colors } = useTheme();
  const params = useParams();
  const productId = Number(params.productId);
  const product = productsById.get(productId);
  if (!product) return <Navigate to="/404" replace />;

  const category = categoriesById.get(product.Category);
  const productReviews = getReviewsForProduct(product.ID);
  const { totalReviews, averageRating } = getReviewSummary(productReviews);
  const [selectedRating, setSelectedRating] = useState(null);

  const ratingBreakdown = useMemo(() => {
    const counts = new Map([
      [5, 0],
      [4, 0],
      [3, 0],
      [2, 0],
      [1, 0],
    ]);

    productReviews.forEach((review) => {
      const bucket = getRatingBucket(review.rating);
      counts.set(bucket, (counts.get(bucket) ?? 0) + 1);
    });

    return [5, 4, 3, 2, 1].map((rating) => ({
      rating,
      count: counts.get(rating) ?? 0,
      percentage: totalReviews > 0 ? Math.round(((counts.get(rating) ?? 0) / totalReviews) * 100) : 0,
    }));
  }, [productReviews, totalReviews]);

  const filteredReviews = useMemo(() => {
    if (selectedRating === null) {
      return productReviews;
    }
    return productReviews.filter((review) => getRatingBucket(review.rating) === selectedRating);
  }, [productReviews, selectedRating]);

  return (
    <AppLayout title={`${product.Name.trim()} · Reviews`} showPageHeader={false} contentClassName="space-y-8">
      <section className="text-sm" style={{ color: colors.text }}>
        <Link to="/" className="hover:underline" style={{ color: colors.text }}>Home</Link>&nbsp;&gt;&nbsp;
        <Link to={`/shop?category=${product.Category}`} className="hover:underline" style={{ color: colors.text }}>{category?.Name ?? "Category"}</Link>&nbsp;&gt;&nbsp;
        <Link to={`/product-page/${product.ID}`} className="hover:underline" style={{ color: colors.text }}>{product.Name.trim()}</Link>&nbsp;&gt;&nbsp;
        <span style={{ color: colors.primary }}>Reviews</span>
      </section>

      <section className="space-y-4 lg:max-w-[600px]">
        <div className="flex flex-wrap items-center gap-2 text-xl" style={{ color: colors.text }}>
          <span>All Reviews for {product.Name.trim()}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-lg" style={{ color: colors.text }}>
          <span>{totalReviews} Reviews</span>
          <span>|</span>
          <span>{averageRating}</span>
          <ReviewStars rating={averageRating} colors={colors} iconSize={20} />
        </div>
        <div className="overflow-hidden rounded border" style={{ borderColor: colors.border }}>
          <table className="w-full text-left text-sm">
            <thead style={{ backgroundColor: colors.background }}>
              <tr>
                <th className="px-3 py-2 font-semibold" style={{ color: colors.text }}>Stars</th>
                <th className="px-3 py-2 font-semibold" style={{ color: colors.text }}>Distribution</th>
                <th className="px-3 py-2 font-semibold" style={{ color: colors.text }}>Count</th>
              </tr>
            </thead>
            <tbody>
              {ratingBreakdown.map((row) => (
                <tr
                  key={row.rating}
                  className="cursor-pointer border-t transition-colors"
                  style={{
                    borderColor: colors.border,
                    backgroundColor: selectedRating === row.rating ? colors.background : "transparent",
                  }}
                  onClick={() => setSelectedRating((current) => (current === row.rating ? null : row.rating))}
                >
                  <td className="px-3 py-2" style={{ color: colors.text }}>{row.rating}★</td>
                  <td className="px-3 py-2">
                    <div className="h-2 w-full overflow-hidden rounded" style={{ backgroundColor: colors.border }}>
                      <div
                        className="h-full"
                        style={{ width: `${row.percentage}%`, backgroundColor: colors.primary }}
                      />
                    </div>
                  </td>
                  <td className="px-3 py-2" style={{ color: colors.text }}>{row.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm" style={{ color: colors.text }}>
          {selectedRating === null
            ? "Click a star row to filter reviews."
            : `Showing ${selectedRating}★ reviews (${filteredReviews.length}). Click again to reset.`}
        </p>
        <div className="space-y-3">
          {filteredReviews.map((review) => (
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
          {filteredReviews.length === 0 ? (
            <p className="rounded p-3 text-sm" style={{ backgroundColor: colors.background, color: colors.text }}>
              No reviews found for the selected rating.
            </p>
          ) : null}
        </div>
      </section>
    </AppLayout>
  );
}
