import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "../data");
const DATA_FILE = path.join(DATA_DIR, "funziesData.json");
const SEED_FILE = path.join(__dirname, "../../src/data/funziesData.json");

/** @type {string[]} Must match top-level array keys in funziesData.json. Excludes `order_product` (composite, no `ID`). */
export const CRUD_TABLES = [
  "address",
  "brand",
  "category",
  "orderstatus",
  "orders",
  "product",
  "review",
  "reviewstatus",
  "role",
  "settings",
  "user",
  "wishlist",
];

const CRUD = new Set(CRUD_TABLES);

function readFileSync() {
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

function writeFileSync(/** @type {Record<string, unknown>} */ data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2) + "\n", "utf8");
  // Keep the bundled dataset in sync so the storefront (which imports `src/data/funziesData.json`)
  // reflects admin/API changes without a larger async refactor.
  try {
    fs.writeFileSync(SEED_FILE, JSON.stringify(data, null, 2) + "\n", "utf8");
  } catch {
    // If the workspace is read-only or SEED_FILE is missing, the API should still work.
    console.warn(`[funzies-api] Could not sync seed file: ${SEED_FILE}`);
  }
}

/**
 * If no persisted file exists, copy the bundled dataset so the API is usable immediately.
 */
export function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    if (!fs.existsSync(SEED_FILE)) {
      throw new Error(`Cannot seed: missing ${SEED_FILE}`);
    }
    fs.copyFileSync(SEED_FILE, DATA_FILE);
  }
}

export function load() {
  ensureDataFile();
  const data = readFileSync();
  // Ensure newly-added tables exist even if the seed file is older.
  let dirty = false;
  for (const t of CRUD_TABLES) {
    if (!Array.isArray(data[t])) {
      data[t] = [];
      dirty = true;
    }
  }

  // Keep demo orders consistent (predictable sample statuses), even if the API has persisted older values.
  // This matches the "Demo Account" behavior on the login page.
  const DEMO_ORDER_STATUS = new Map([
    [4, 1], // Order Received
    [5, 7], // Shipped
    [7, 4], // Processing
    [8, 8], // Delivered
    [9, 4], // Processing
    [10, 7], // Shipped
    [11, 8], // Delivered
  ]);
  if (Array.isArray(data.orders) && data.orders.length) {
    const DEMO_USER_ID = 1;
    for (let i = 0; i < data.orders.length; i += 1) {
      const o = data.orders[i];
      const id = Number(o?.ID);
      const wantStatus = DEMO_ORDER_STATUS.get(id);
      if (!wantStatus) continue;
      if (Number(o?.status) !== wantStatus || Number(o?.deleted ?? 0) !== 0 || Number(o?.user) !== DEMO_USER_ID) {
        data.orders[i] = { ...o, user: DEMO_USER_ID, status: wantStatus, deleted: 0 };
        dirty = true;
      }
    }
  }

  // Keep demo addresses tied to the demo user row (ID 1 => demo@funzies.com) so admin tables show email.
  if (Array.isArray(data.address) && data.address.length) {
    const DEMO_USER_ID = 1;
    const DEMO_ADDRESS_IDS = new Set([2, 3, 4]);
    for (let i = 0; i < data.address.length; i += 1) {
      const a = data.address[i];
      const id = Number(a?.ID);
      if (!DEMO_ADDRESS_IDS.has(id)) continue;
      if (Number(a?.User) !== DEMO_USER_ID) {
        data.address[i] = { ...a, User: DEMO_USER_ID };
        dirty = true;
      }
    }
  }

  // Seed API-backed reviews if the dataset didn't have any.
  // The app previously used `src/data/productReviews.js` (bundle-only), so the API starts empty unless we create rows.
  if (Array.isArray(data.review) && data.review.length === 0 && Array.isArray(data.product) && data.product.length > 0) {
    const statusRows = Array.isArray(data.reviewstatus) ? data.reviewstatus : [];
    const awaitingRow = statusRows.find(
      (s) => String(s?.Status ?? "").trim().toLowerCase() === "awaiting approval" && Number(s?.Deleted ?? 0) === 0,
    );
    const awaitingId = awaitingRow ? Number(awaitingRow.ID) : 3;
    const approvedRow = statusRows.find(
      (s) => String(s?.Status ?? "").trim().toLowerCase() === "approved" && Number(s?.Deleted ?? 0) === 0,
    );
    const approvedId = approvedRow ? Number(approvedRow.ID) : 1;

    const templates = [
      { User: "boardgamefan", Date: "2024-02-12", Text: "Great quality and exactly as described. Would buy again.", Rating: 5 },
      { User: "toycollector", Date: "2024-01-28", Text: "Nice item, packaging was solid and delivery was quick.", Rating: 4 },
      { User: "malltaShopper", Date: "2023-12-14", Text: "Good value for the price. Kids loved it immediately.", Rating: 4 },
      { User: "retrogeek", Date: "2023-11-09", Text: "Looks great in person. Slightly smaller than expected.", Rating: 4 },
      { User: "karenM", Date: "2023-10-21", Text: "Fast checkout and product arrived in perfect condition.", Rating: 5 },
      { User: "puzzlelover", Date: "2023-09-07", Text: "Fun item and decent build. Would recommend.", Rating: 4 },
    ];

    /** Only seed for non-deleted products. */
    const products = data.product.filter((p) => Number(p?.Deleted ?? 0) === 0);
    const seeded = [];
    let id = 1;
    for (const p of products) {
      const pid = Number(p?.ID);
      if (!pid) continue;
      for (let i = 0; i < 3; i += 1) {
        const t = templates[(pid + i * 2) % templates.length];
        const isAwait = (pid + i) % 11 === 0; // sprinkle some awaiting approvals
        seeded.push({
          ID: id++,
          ProductId: pid,
          StatusId: isAwait ? awaitingId : approvedId,
          Deleted: 0,
          ...t,
        });
      }
    }
    data.review = seeded;
    dirty = true;
  }

  if (dirty) {
    save(data);
  }
  return data;
}

function save(/** @type {Record<string, unknown>} */ data) {
  writeFileSync(data);
}

function nextId(/** @type {{ ID?: number }[]} */ list) {
  if (!list.length) {
    return 1;
  }
  return Math.max(...list.map((r) => Number(r?.ID) || 0), 0) + 1;
}

function nowSqlish() {
  return new Date().toISOString().replace("T", " ").slice(0, 19);
}

/**
 * @param {Record<string, unknown>} row
 * @param {string} _table
 */
function applySoftDelete(row, _table) {
  if (Object.prototype.hasOwnProperty.call(row, "Deleted")) {
    return { ...row, Deleted: 1 };
  }
  if (Object.prototype.hasOwnProperty.call(row, "deleted")) {
    return { ...row, deleted: 1 };
  }
  return null;
}

/**
 * @param {string} table
 * @param {string | undefined} all
 * @param {Record<string, unknown>} data
 */
export function listTable(table, all, data) {
  /** Read-only: composite line rows (no per-line `ID` in the dataset). */
  if (table === "order_product") {
    const list = Array.isArray(data.order_product) ? data.order_product : [];
    return { data: list };
  }
  if (!CRUD.has(table) || !Array.isArray(data[table])) {
    return { error: { code: "NOT_FOUND", message: `Unknown table: ${table}` } };
  }
  const list = data[table];
  const wantAll = all === "1" || all === "true";
  if (wantAll) {
    return { data: list };
  }
  const filtered = list.filter((row) => {
    if (row && Object.prototype.hasOwnProperty.call(row, "Deleted") && row.Deleted !== 0) {
      return false;
    }
    if (row && Object.prototype.hasOwnProperty.call(row, "deleted") && row.deleted !== 0) {
      return false;
    }
    return true;
  });
  return { data: filtered };
}

/**
 * @param {string} table
 * @param {number} id
 * @param {Record<string, unknown>} data
 */
export function getById(table, id, data) {
  if (!CRUD.has(table) || !Array.isArray(data[table])) {
    return { error: { code: "NOT_FOUND", message: `Unknown table: ${table}` } };
  }
  const row = data[table].find((r) => Number(r?.ID) === id);
  if (!row) {
    return { error: { code: "NOT_FOUND", message: `No ${table} with ID ${id}` } };
  }
  return { data: row };
}

/**
 * @param {string} table
 * @param {object} body
 * @param {Record<string, unknown>} data
 */
export function createRow(table, body, data) {
  if (!CRUD.has(table) || !Array.isArray(data[table])) {
    return { error: { code: "NOT_FOUND", message: `Unknown table: ${table}` } };
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: { code: "BAD_REQUEST", message: "JSON body must be an object" } };
  }
  const list = data[table];
  const id = nextId(list);
  const base = { ...body, ID: id };
  let row = base;
  if (table === "product" && (base.DateAdded == null || base.DateAdded === "")) {
    row = { ...row, DateAdded: nowSqlish() };
  }
  if (table === "orders" && (base.created == null || base.updated == null)) {
    const t = nowSqlish();
    row = { ...row, created: base.created ?? t, updated: t };
    if (base.deleted == null) {
      row = { ...row, deleted: 0 };
    }
  }
  list.push(row);
  data[table] = list;
  save(data);
  return { data: row, status: 201 };
}

/**
 * @param {string} table
 * @param {number} id
 * @param {object} body
 * @param {Record<string, unknown>} data
 */
export function updateRow(table, id, body, data) {
  if (!CRUD.has(table) || !Array.isArray(data[table])) {
    return { error: { code: "NOT_FOUND", message: `Unknown table: ${table}` } };
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: { code: "BAD_REQUEST", message: "JSON body must be an object" } };
  }
  const list = data[table];
  const idx = list.findIndex((r) => Number(r?.ID) === id);
  if (idx === -1) {
    return { error: { code: "NOT_FOUND", message: `No ${table} with ID ${id}` } };
  }
  const { ID: _i, id: _low, ...rest } = body;
  let merged = { ...list[idx], ...rest, ID: id };
  if (
    table === "orders" &&
    (rest.created != null ||
      rest.status != null ||
      rest.user != null ||
      rest.address != null ||
      rest.deleted != null)
  ) {
    merged = { ...merged, updated: nowSqlish() };
  }
  list[idx] = merged;
  data[table] = list;
  save(data);
  return { data: merged };
}

/**
 * @param {string} table
 * @param {number} id
 * @param {Record<string, unknown>} data
 * @param {{ hard?: boolean }} options
 */
export function deleteRow(table, id, data, options = {}) {
  if (!CRUD.has(table) || !Array.isArray(data[table])) {
    return { error: { code: "NOT_FOUND", message: `Unknown table: ${table}` } };
  }
  const list = data[table];
  const idx = list.findIndex((r) => Number(r?.ID) === id);
  if (idx === -1) {
    return { error: { code: "NOT_FOUND", message: `No ${table} with ID ${id}` } };
  }

  // Cascading hard-delete for users: remove the user and their related rows.
  // This matches the admin expectation that deleting a user is permanent.
  if (table === "user") {
    const uid = id;
    // Remove any addresses belonging to this user.
    if (Array.isArray(data.address)) {
      data.address = data.address.filter((a) => Number(a?.User) !== uid);
    }
    // Remove wishlist rows for this user.
    if (Array.isArray(data.wishlist)) {
      data.wishlist = data.wishlist.filter((w) => Number(w?.user) !== uid);
    }
    // Always hard-delete the user row.
    list.splice(idx, 1);
    data[table] = list;
    save(data);
    return { data: { id, removed: true, cascaded: true }, mode: "hard" };
  }
  const current = list[idx];
  if (!options.hard) {
    const soft = applySoftDelete(current, table);
    if (soft) {
      list[idx] = soft;
      data[table] = list;
      save(data);
      return { data: soft, mode: "soft" };
    }
  }
  list.splice(idx, 1);
  data[table] = list;
  save(data);
  return { data: { id, removed: true }, mode: "hard" };
}
