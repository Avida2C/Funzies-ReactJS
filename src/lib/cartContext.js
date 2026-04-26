import { createContext, useContext } from "react";
import { activeProducts } from "./storeData";

export const CART_STORAGE_KEY = "funzies-cart-item-ids";
export const CartContext = createContext(null);

export function getInitialCartItemIds() {
  if (typeof window === "undefined") {
    return [];
  }

  const saved = window.localStorage.getItem(CART_STORAGE_KEY);
  if (!saved) {
    return activeProducts.slice(0, 3).map((product) => product.ID);
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

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("Cart context is not available.");
  }

  return context;
}
