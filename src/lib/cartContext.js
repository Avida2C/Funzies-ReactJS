import { createContext, useContext } from "react";

export const CART_STORAGE_KEY = "funzies-cart-item-ids";
export const GUEST_CART_STORAGE_KEY = "funzies-guest-cart";
export const GUEST_CART_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours
export const CartContext = createContext(null);

function sanitizeIds(value) {
  if (!Array.isArray(value)) return [];
  return value.filter((v) => Number.isInteger(v));
}

export function getPersistedCartItemIds() {
  if (typeof window === "undefined") {
    return [];
  }

  const saved = window.localStorage.getItem(CART_STORAGE_KEY);
  if (!saved) {
    return [];
  }

  try {
    return sanitizeIds(JSON.parse(saved));
  } catch {
    return [];
  }
}

export function getGuestCartItemIds(now = Date.now()) {
  if (typeof window === "undefined") {
    return [];
  }

  const saved = window.localStorage.getItem(GUEST_CART_STORAGE_KEY);
  if (!saved) return [];

  try {
    const parsed = JSON.parse(saved);
    const updatedAt = Number(parsed?.updatedAt ?? 0);
    const items = sanitizeIds(parsed?.items);
    if (!updatedAt || now - updatedAt > GUEST_CART_TTL_MS) {
      window.localStorage.removeItem(GUEST_CART_STORAGE_KEY);
      return [];
    }
    return items;
  } catch {
    window.localStorage.removeItem(GUEST_CART_STORAGE_KEY);
    return [];
  }
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("Cart context is not available.");
  }

  return context;
}
