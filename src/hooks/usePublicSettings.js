import { useCallback, useEffect, useMemo, useState } from "react";
import { listTable } from "../lib/crudApi";

const PUBLIC_SETTINGS_CACHE_KEY = "funzies-public-settings-cache-v1";

function loadCache() {
  try {
    const raw = window.localStorage.getItem(PUBLIC_SETTINGS_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    if (!parsed.values || typeof parsed.values !== "object") return null;
    return parsed.values;
  } catch {
    return null;
  }
}

function saveCache(values) {
  try {
    window.localStorage.setItem(
      PUBLIC_SETTINGS_CACHE_KEY,
      JSON.stringify({ updatedAt: Date.now(), values: values ?? {} }),
    );
  } catch {
    // ignore quota / private mode issues
  }
}

/**
 * Fetch public settings from the API `settings` table.
 * Values are returned as plain strings (may contain JSON).
 *
 * @param {string[]} keys
 */
export function usePublicSettings(keys = []) {
  // `keys` is commonly passed as an inline array literal, which changes identity every render.
  // Build a stable signature based on contents so downstream memoization doesn't thrash.
  const keySig = useMemo(() => {
    const arr = Array.isArray(keys) ? keys : [];
    const normalized = arr.filter(Boolean).map((k) => String(k)).sort();
    // Unique after sort for stable signature and stable iteration order.
    const unique = normalized.filter((k, i) => i === 0 || k !== normalized[i - 1]);
    return JSON.stringify(unique);
  }, [keys]);

  const normalizedKeys = useMemo(() => JSON.parse(keySig), [keySig]);
  const keySet = useMemo(() => new Set(normalizedKeys), [keySig]);

  const [values, setValues] = useState(() => {
    const cached = loadCache();
    if (!cached) return /** @type {Record<string, string>} */ ({});
    /** @type {Record<string, string>} */
    const seeded = {};
    for (const k of normalizedKeys) {
      if (Object.prototype.hasOwnProperty.call(cached, k)) {
        seeded[k] = String(cached[k] ?? "");
      }
    }
    return seeded;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(/** @type {string | null} */ (null));

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Public consumers should only need active rows (no `all=1`).
      const r = await listTable("settings");
      const rows = Array.isArray(r?.data) ? r.data : [];
      /** @type {Record<string, string>} */
      const next = {};
      /** @type {Record<string, number>} */
      const bestIdByKey = {};
      for (const row of rows) {
        if (Number(row?.Deleted ?? row?.deleted) === 1) continue;
        const k = String(row?.Key ?? "");
        if (!k || !keySet.has(k)) continue;
        const id = Number(row?.ID ?? row?.id ?? 0) || 0;
        const best = bestIdByKey[k] ?? -1;
        if (id < best) continue;
        bestIdByKey[k] = id;
        next[k] = row?.Value == null ? "" : String(row.Value);
      }
      setValues(next);
      // Merge into local cache so first paint uses last-known values.
      const cached = loadCache() || {};
      saveCache({ ...cached, ...next });
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e));
      setError(err.message);
      // Keep last-known values to avoid flicker.
    } finally {
      setLoading(false);
    }
  }, [keySet]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const onFocus = () => refresh();
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        refresh();
      }
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
    const interval = window.setInterval(() => {
      // Keep lightweight content in sync with admin edits.
      refresh();
    }, 15000);

    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
      window.clearInterval(interval);
    };
  }, [refresh]);

  return { values, loading, error, refresh };
}

