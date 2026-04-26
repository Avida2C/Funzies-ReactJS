import { createContext, useContext } from "react";

export const WISHLIST_STORAGE_KEY = "funzies-wishlist-product-ids";
export const WishlistContext = createContext(null);

export function getInitialWishlistIds() {
  if (typeof window === "undefined") {
    return [];
  }

  const saved = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
  if (!saved) {
    return [];
  }

  try {
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((value) => Number.isInteger(value));
  } catch {
    return [];
  }
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error("Wishlist context is not available.");
  }

  return context;
}
