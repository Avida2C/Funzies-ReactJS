import cors from "cors";
import express from "express";
import { createRow, CRUD_TABLES, deleteRow, getById, listTable, load, updateRow } from "./lib/store.mjs";
import { registerProductImageUpload } from "./lib/productUpload.mjs";

const PORT = Number.parseInt(process.env.PORT ?? "3001", 10) || 3001;

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "funzies-api" });
});

app.get("/api", (_req, res) => {
  res.json({
    name: "Funzies data API",
    crud: CRUD_TABLES,
    note: "Rows with Deleted/deleted are soft-removed by default. Use ?hard=1 on DELETE to remove a row. Use ?all=1 on GET list to include soft-deleted. POST /api/upload (field `file`) saves an image to public/assets/img/products/ and returns `path` for product fields.",
  });
});

registerProductImageUpload(app);

function idParam(raw) {
  const id = Number.parseInt(String(raw), 10);
  if (Number.isNaN(id) || id < 1) {
    return { error: "ID must be a positive integer" };
  }
  return { id };
}

app.get("/api/:table", (req, res) => {
  const { table } = req.params;
  const data = load();
  const result = listTable(table, req.query.all, data);
  if (result.error) {
    return res.status(404).json(result);
  }
  return res.json({ ok: true, table, ...result });
});

app.get("/api/:table/:id", (req, res) => {
  const { table, id: raw } = req.params;
  const parsed = idParam(raw);
  if (parsed.error) {
    return res.status(400).json({ ok: false, error: { code: "BAD_REQUEST", message: parsed.error } });
  }
  const data = load();
  const result = getById(table, parsed.id, data);
  if (result.error) {
    return res.status(404).json({ ok: false, ...result });
  }
  return res.json({ ok: true, table, ...result });
});

app.post("/api/:table", (req, res) => {
  const { table } = req.params;
  const data = load();
  const result = createRow(table, req.body, data);
  if (result.error) {
    const st = result.error.code === "NOT_FOUND" ? 404 : 400;
    return res.status(st).json({ ok: false, ...result });
  }
  return res.status(201).json({ ok: true, table, ...result });
});

app.put("/api/:table/:id", (req, res) => {
  const { table, id: raw } = req.params;
  const parsed = idParam(raw);
  if (parsed.error) {
    return res.status(400).json({ ok: false, error: { code: "BAD_REQUEST", message: parsed.error } });
  }
  const data = load();
  const result = updateRow(table, parsed.id, req.body, data);
  if (result.error) {
    const st = result.error.code === "NOT_FOUND" ? 404 : 400;
    return res.status(st).json({ ok: false, ...result });
  }
  return res.json({ ok: true, table, ...result });
});

app.delete("/api/:table/:id", (req, res) => {
  const { table, id: raw } = req.params;
  const parsed = idParam(raw);
  if (parsed.error) {
    return res.status(400).json({ ok: false, error: { code: "BAD_REQUEST", message: parsed.error } });
  }
  const hard = req.query.hard === "1" || req.query.hard === "true";
  const data = load();
  const result = deleteRow(table, parsed.id, data, { hard });
  if (result.error) {
    return res.status(404).json({ ok: false, ...result });
  }
  return res.json({ ok: true, table, ...result });
});

app.use((_req, res) => {
  res.status(404).json({ ok: false, error: { code: "NOT_FOUND", message: "Not found" } });
});

app.listen(PORT, () => {
  console.log(`[funzies-api] http://localhost:${PORT}  (GET /api for help)`);
});
