import { reviewStatusById } from "../lib/funziesDataset";
import { activeProducts } from "../lib/storeData";

/** Default: matches `funziesData.json` → `reviewstatus` id 1 (Approved). */
const DEFAULT_REVIEW_STATUS_ID = 1;

function reviewStatusLabel(statusId) {
  const id = Number(statusId) || DEFAULT_REVIEW_STATUS_ID;
  const row = reviewStatusById.get(id);
  return row?.Status ?? (id ? `Status #${id}` : "Unknown");
}

const REVIEW_TEMPLATES = [
  {
    user: "boardgamefan",
    date: "12 Feb 2024",
    text: "Great quality and exactly as described. Would buy again.",
    rating: 5,
  },
  {
    user: "toycollector",
    date: "28 Jan 2024",
    text: "Nice item, packaging was solid and delivery was quick.",
    rating: 4.5,
  },
  {
    user: "malltaShopper",
    date: "14 Dec 2023",
    text: "Good value for the price. Kids loved it immediately.",
    rating: 4,
  },
  {
    user: "retrogeek",
    date: "9 Nov 2023",
    text: "Looks great in person. Slightly smaller than expected.",
    rating: 4,
  },
  {
    user: "karenM",
    date: "21 Oct 2023",
    text: "Fast checkout and product arrived in perfect condition.",
    rating: 5,
  },
  {
    user: "puzzlelover",
    date: "7 Sep 2023",
    text: "Fun item and decent build. Would recommend.",
    rating: 4.5,
  },
];

const PRODUCT_REVIEW_OVERRIDES = {
  1: [
    {
      user: "starwatcher",
      date: "17 Nov 2023",
      text: "Astra has great replay value and the art is beautiful.",
      rating: 5,
      statusId: 1,
    },
    {
      user: "meeplegal",
      date: "13 Jan 2024",
      text: "Rules took one round to click, then everyone enjoyed it.",
      rating: 4.5,
      statusId: 3,
    },
  ],
  20: [
    {
      user: "creeperSafe",
      date: "2 Dec 2023",
      text: "Perfect for family game night. Easy to teach younger kids.",
      rating: 5,
    },
    {
      user: "blockbuilder",
      date: "10 Oct 2023",
      text: "Theme is spot on for Minecraft fans.",
      rating: 4.5,
    },
  ],
  80: [
    {
      user: "animejigsaw",
      date: "19 Dec 2023",
      text: "Colors are vibrant and pieces fit very well.",
      rating: 4.5,
    },
    {
      user: "narutofan92",
      date: "3 Jan 2024",
      text: "Really fun puzzle, framed it after finishing.",
      rating: 5,
    },
  ],
};

function createReviewId(productId, index) {
  return `product-${productId}-review-${index + 1}`;
}

function buildTemplateReviews(productId, count = 3) {
  const seed = Number(productId) || 0;
  return Array.from({ length: count }).map((_, index) => {
    const templateIndex = (seed + index * 2) % REVIEW_TEMPLATES.length;
    const template = REVIEW_TEMPLATES[templateIndex];
    return {
      id: createReviewId(productId, index),
      ...template,
    };
  });
}

export function getReviewsForProduct(productId) {
  const reviews = PRODUCT_REVIEW_OVERRIDES[productId] ?? buildTemplateReviews(productId);
  return reviews.map((review, index) => {
    const statusId = review.statusId != null ? Number(review.statusId) : DEFAULT_REVIEW_STATUS_ID;
    return {
      ...review,
      id: review.id ?? createReviewId(productId, index),
      statusId,
      status: reviewStatusLabel(statusId),
    };
  });
}

export function getReviewSummary(reviews) {
  if (!reviews.length) {
    return { totalReviews: 0, averageRating: 0 };
  }

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  return {
    totalReviews: reviews.length,
    averageRating: Number((totalRating / reviews.length).toFixed(1)),
  };
}

/** @returns {number} */
export function getReviewTemplateCount() {
  return REVIEW_TEMPLATES.length;
}

/** @returns { { productId: number; reviewCount: number }[] } */
export function getProductReviewOverrideRows() {
  return Object.entries(PRODUCT_REVIEW_OVERRIDES).map(([productId, reviews]) => ({
    productId: Number(productId),
    reviewCount: Array.isArray(reviews) ? reviews.length : 0,
  }));
}

/** @returns {number[]} Product IDs that use custom review text instead of the rotating template pool. */
export function getOverrideProductIds() {
  return Object.keys(PRODUCT_REVIEW_OVERRIDES).map((k) => Number(k));
}

const overrideIdSet = new Set(getOverrideProductIds());

/**
 * Counts for the admin reviews table / dashboard (all active product SKUs × their reviews).
 * @returns {{ totalRows: number, customProductCount: number, templateProductCount: number, byStatus: Record<string, number> }}
 */
export function getAdminReviewDisplayStats() {
  const byStatus = Object.create(null);
  let totalRows = 0;
  let customProductCount = 0;
  for (const p of activeProducts) {
    if (overrideIdSet.has(p.ID)) {
      customProductCount += 1;
    }
    const list = getReviewsForProduct(p.ID);
    for (const r of list) {
      totalRows += 1;
      const label = r.status || "Unknown";
      byStatus[label] = (byStatus[label] || 0) + 1;
    }
  }
  return {
    totalRows,
    customProductCount,
    templateProductCount: activeProducts.length - customProductCount,
    byStatus,
  };
}
