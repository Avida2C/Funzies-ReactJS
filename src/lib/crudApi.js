const apiBase = import.meta.env.VITE_API_BASE;
const origin = apiBase == null || apiBase === "" ? "" : String(apiBase).replace(/\/$/, "");

/**
 * @param {string} path
 */
function toUrl(path) {
  if (!path.startsWith("/")) {
    return `${origin}/api/${path}`;
  }
  if (!origin) {
    return path;
  }
  return `${origin}${path}`;
}

/**
 * @param {string} path
 * @param {RequestInit} [init]
 */
async function requestJson(path, init) {
  const r = await fetch(toUrl(path), {
    ...init,
    headers: { Accept: "application/json", "Content-Type": "application/json", ...init?.headers },
  });
  const text = await r.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }
  }
  if (!r.ok) {
    const err = new Error((data && data.error && data.error.message) || r.statusText);
    err.status = r.status;
    err.body = data;
    throw err;
  }
  return data;
}

/** @returns {Promise<{ name: string, crud: string[], note?: string }>} */
export function getApiInfo() {
  return requestJson("/api");
}

/** @returns {Promise<{ ok: boolean, table: string, data: object[] }>} */
export function listTable(table, query = {}) {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v != null) {
      p.set(k, String(v));
    }
  }
  const q = p.toString();
  return requestJson(q ? `/api/${encodeURIComponent(table)}?${q}` : `/api/${encodeURIComponent(table)}`);
}

/** @returns {Promise<{ ok: boolean, table: string, data: object }>} */
export function getRow(table, id) {
  return requestJson(`/api/${encodeURIComponent(table)}/${id}`);
}

/** @returns {Promise<{ ok: boolean, table: string, data: object }>} */
export function createRow(table, body) {
  return requestJson(`/api/${encodeURIComponent(table)}`, { method: "POST", body: JSON.stringify(body ?? {}) });
}

/** @returns {Promise<{ ok: boolean, table: string, data: object }>} */
export function updateRow(table, id, body) {
  return requestJson(`/api/${encodeURIComponent(table)}/${id}`, { method: "PUT", body: JSON.stringify(body ?? {}) });
}

/**
 * @param {string} table
 * @param {number} id
 * @param {{ hard?: boolean }} [opt]
 * @returns {Promise<{ ok: boolean, table: string, data: object, mode?: string }>}
 */
export function deleteRow(table, id, { hard = false } = {}) {
  const h = hard ? "?hard=1" : "";
  return requestJson(`/api/${encodeURIComponent(table)}/${id}${h}`, { method: "DELETE" });
}

/**
 * Upload a product image to the API (saved under public/assets/img/products). Returns `path` like `img/products/upload-….jpg`.
 * @param {File} file
 * @returns {Promise<{ ok: boolean, path: string, filename: string, url: string }>}
 */
export async function uploadProductImage(file) {
  const form = new FormData();
  form.append("file", file);
  const r = await fetch(toUrl("/api/upload"), {
    method: "POST",
    body: form,
    headers: { Accept: "application/json" },
  });
  const text = await r.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }
  }
  if (!r.ok) {
    const err = new Error((data && data.error && data.error.message) || r.statusText);
    err.status = r.status;
    err.body = data;
    throw err;
  }
  return data;
}
