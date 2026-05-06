import { useCallback, useEffect, useState } from "react";
import { listTable } from "../lib/crudApi";

/**
 * Load and refetch a CRUD table from the Funzies API (uses `?all=1` so admin sees soft-deleted rows).
 * @param {string} table
 */
export function useAdminTable(table) {
  const [rows, setRows] = useState(/** @type {object[]} */ ([]));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(/** @type {string | null} */ (null));

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await listTable(table, { all: 1 });
      setRows(Array.isArray(r.data) ? r.data : []);
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e));
      setError(err.message);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [table]);

  // useEffect(() => {
  //   refresh();
  // }, [refresh]);

  return { rows, setRows, loading, error, refresh, setError };
}
