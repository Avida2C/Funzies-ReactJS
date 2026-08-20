import { createContext, createElement, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./authContext";

export const SAVED_SEARCHES_STORAGE_PREFIX = "funzies:account:saved-searches:";
export const SavedSearchesContext = createContext(null);

export const SORT_LABELS = {
  featured: "Featured",
  newest: "Newest",
  "price-desc": "Price: High to Low",
  "price-asc": "Price: Low to High",
  "name-asc": "Name: A to Z",
  "name-desc": "Name: Z to A",
};

export function savedSearchesStorageKey(email) {
  const normalized = String(email ?? "")
    .trim()
    .toLowerCase();
  return `${SAVED_SEARCHES_STORAGE_PREFIX}${normalized || "guest"}`;
}

export function normalizeShopFilters({ q = "", category = "", sort = "featured", series = "", scale = "", sku = "" } = {}) {
  const query = String(q ?? "").trim();
  const categoryId = String(category ?? "").trim();
  const sortId = String(sort ?? "").trim() || "featured";
  return {
    q: query,
    category: categoryId,
    sort: sortId === "featured" ? "featured" : sortId,
    series: String(series ?? "").trim(),
    scale: String(scale ?? "").trim(),
    sku: String(sku ?? "").trim(),
  };
}

export function searchFingerprint(filters) {
  const normalized = normalizeShopFilters(filters);
  return JSON.stringify({
    q: normalized.q.toLowerCase(),
    category: normalized.category,
    sort: normalized.sort === "featured" ? "" : normalized.sort,
    series: normalized.series.toLowerCase(),
    scale: normalized.scale.toLowerCase(),
    sku: normalized.sku.toLowerCase(),
  });
}

export function hasSavableShopFilters(filters) {
  const normalized = normalizeShopFilters(filters);
  return Boolean(
    normalized.q ||
      normalized.category ||
      (normalized.sort && normalized.sort !== "featured") ||
      normalized.series ||
      normalized.scale ||
      normalized.sku,
  );
}

export function buildShopHref(filters) {
  const normalized = normalizeShopFilters(filters);
  const params = new URLSearchParams();
  if (normalized.q) {
    params.set("q", normalized.q);
  }
  if (normalized.category) {
    params.set("category", normalized.category);
  }
  if (normalized.sort && normalized.sort !== "featured") {
    params.set("sort", normalized.sort);
  }
  if (normalized.series) {
    params.set("series", normalized.series);
  }
  if (normalized.scale) {
    params.set("scale", normalized.scale);
  }
  if (normalized.sku) {
    params.set("sku", normalized.sku);
  }
  const query = params.toString();
  return query ? `/shop?${query}` : "/shop";
}

export function defaultSearchName({ q, categoryName, sort, series, scale, sku } = {}) {
  const parts = [];
  if (String(q ?? "").trim()) {
    parts.push(String(q).trim());
  }
  if (String(categoryName ?? "").trim()) {
    parts.push(String(categoryName).trim());
  }
  if (String(series ?? "").trim()) {
    parts.push(String(series).trim());
  }
  if (String(scale ?? "").trim()) {
    parts.push(String(scale).trim());
  }
  if (String(sku ?? "").trim()) {
    parts.push(String(sku).trim());
  }
  if (sort && sort !== "featured") {
    parts.push(SORT_LABELS[sort] ?? sort);
  }
  return parts.join(" · ") || "Shop filters";
}

function createSearchId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `saved-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeSavedSearch(raw) {
  if (!raw || typeof raw !== "object") {
    return null;
  }
  const filters = normalizeShopFilters({
    q: raw.q,
    category: raw.category,
    sort: raw.sort,
    series: raw.series,
    scale: raw.scale,
    sku: raw.sku,
  });
  if (!hasSavableShopFilters(filters)) {
    return null;
  }
  const id = typeof raw.id === "string" && raw.id.trim() ? raw.id.trim() : createSearchId();
  const name = typeof raw.name === "string" && raw.name.trim() ? raw.name.trim() : defaultSearchName(filters);
  const createdAt = Number(raw.createdAt);
  return {
    id,
    name,
    q: filters.q,
    category: filters.category,
    sort: filters.sort,
    series: filters.series,
    scale: filters.scale,
    sku: filters.sku,
    createdAt: Number.isFinite(createdAt) ? createdAt : Date.now(),
  };
}

function demoSeedSearches() {
  const now = Date.now();
  return [
    normalizeSavedSearch({
      id: "demo-funko-pop",
      name: "Funko Pop",
      q: "Funko Pop",
      createdAt: now - 86_400_000 * 3,
    }),
    normalizeSavedSearch({
      id: "demo-figurines-newest",
      name: "Figurines · Newest",
      category: "4",
      sort: "newest",
      createdAt: now - 86_400_000 * 2,
    }),
    normalizeSavedSearch({
      id: "demo-anime-budget",
      name: "Anime · Price: Low to High",
      q: "anime",
      sort: "price-asc",
      createdAt: now - 86_400_000,
    }),
  ].filter(Boolean);
}

export function readSavedSearches(email) {
  const key = savedSearchesStorageKey(email);
  const normalizedEmail = String(email ?? "")
    .trim()
    .toLowerCase();
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(key);
  if (!raw) {
    if (normalizedEmail === "demo@funzies.com") {
      return demoSeedSearches();
    }
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    const seen = new Set();
    const out = [];
    for (const item of parsed) {
      const normalized = normalizeSavedSearch(item);
      if (!normalized) {
        continue;
      }
      const fingerprint = searchFingerprint(normalized);
      if (seen.has(fingerprint)) {
        continue;
      }
      seen.add(fingerprint);
      out.push(normalized);
    }
    return out.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  } catch {
    return [];
  }
}

function writeSavedSearches(email, searches) {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(savedSearchesStorageKey(email), JSON.stringify(searches));
  } catch {
    // ignore quota / private mode
  }
}

export function SavedSearchesProvider({ children }) {
  const { email, isAuthenticated } = useAuth();
  const [savedSearches, setSavedSearches] = useState(() => (isAuthenticated ? readSavedSearches(email) : []));

  useEffect(() => {
    if (!isAuthenticated) {
      setSavedSearches([]);
      return;
    }
    const loaded = readSavedSearches(email);
    setSavedSearches(loaded);
    if (loaded.length > 0 && typeof window !== "undefined" && !window.localStorage.getItem(savedSearchesStorageKey(email))) {
      writeSavedSearches(email, loaded);
    }
  }, [email, isAuthenticated]);

  const persist = (next) => {
    setSavedSearches(next);
    if (isAuthenticated && String(email ?? "").trim()) {
      writeSavedSearches(email, next);
    }
  };

  const value = useMemo(
    () => ({
      savedSearches,
      isSearchSaved: (filters) => {
        if (!hasSavableShopFilters(filters)) {
          return false;
        }
        const fingerprint = searchFingerprint(filters);
        return savedSearches.some((item) => searchFingerprint(item) === fingerprint);
      },
      findSavedSearch: (filters) => {
        const fingerprint = searchFingerprint(filters);
        return savedSearches.find((item) => searchFingerprint(item) === fingerprint) ?? null;
      },
      saveSearch: ({ name, q, category, sort, series, scale, sku, categoryName } = {}) => {
        const filters = normalizeShopFilters({ q, category, sort, series, scale, sku });
        if (!isAuthenticated || !hasSavableShopFilters(filters)) {
          return { ok: false, reason: "invalid" };
        }
        const fingerprint = searchFingerprint(filters);
        if (savedSearches.some((item) => searchFingerprint(item) === fingerprint)) {
          return { ok: true, alreadySaved: true };
        }
        const next = [
          {
            id: createSearchId(),
            name: typeof name === "string" && name.trim() ? name.trim() : defaultSearchName({ ...filters, categoryName }),
            ...filters,
            createdAt: Date.now(),
          },
          ...savedSearches,
        ];
        persist(next);
        return { ok: true };
      },
      removeSearch: (id) => {
        persist(savedSearches.filter((item) => item.id !== id));
      },
      removeMatchingSearch: (filters) => {
        const fingerprint = searchFingerprint(filters);
        persist(savedSearches.filter((item) => searchFingerprint(item) !== fingerprint));
      },
      renameSearch: (id, nextName) => {
        const trimmed = String(nextName ?? "").trim();
        if (!trimmed) {
          return;
        }
        persist(savedSearches.map((item) => (item.id === id ? { ...item, name: trimmed } : item)));
      },
    }),
    [email, isAuthenticated, savedSearches],
  );

  return createElement(SavedSearchesContext.Provider, { value }, children);
}

export function useSavedSearches() {
  const context = useContext(SavedSearchesContext);
  if (!context) {
    throw new Error("Saved searches context is not available.");
  }
  return context;
}
