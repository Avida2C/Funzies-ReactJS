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
    },
    {
      user: "meeplegal",
      date: "13 Jan 2024",
      text: "Rules took one round to click, then everyone enjoyed it.",
      rating: 4.5,
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
  return reviews.map((review, index) => ({
    ...review,
    id: review.id ?? createReviewId(productId, index),
  }));
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
