import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import multer from "multer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.join(__dirname, "../..");
const UPLOAD_DIR = path.join(PROJECT_ROOT, "public/assets/img/products");

function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    ensureUploadDir();
    cb(null, UPLOAD_DIR);
  },
  filename(_req, file, cb) {
    const ext =
      path.extname(file.originalname).toLowerCase() ||
      (String(file.mimetype).includes("png")
        ? ".png"
        : String(file.mimetype).includes("webp")
          ? ".webp"
          : String(file.mimetype).includes("gif")
            ? ".gif"
            : ".jpg");
    const name = `upload-${Date.now()}-${crypto.randomBytes(4).toString("hex")}${ext}`;
    cb(null, name);
  },
});

function fileFilter(_req, file, cb) {
  if (/^image\/(jpeg|pjpeg|png|gif|webp)$/i.test(String(file.mimetype || ""))) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, GIF, and WebP images are allowed"), false);
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 6 * 1024 * 1024 },
});

/**
 * POST /api/upload — multipart field name `file`. Returns `path` as `img/products/...` for the dataset.
 * @param {import("express").Express} app
 */
export function registerProductImageUpload(app) {
  app.post("/api/upload", (req, res) => {
    upload.single("file")(req, res, (err) => {
      if (err) {
        if (err.message === "Only JPEG, PNG, GIF, and WebP images are allowed" || (err.name === "MulterError" && err.code === "LIMIT_FILE_SIZE")) {
          return res
            .status(400)
            .json({ ok: false, error: { code: "BAD_REQUEST", message: err.message } });
        }
        return res.status(500).json({ ok: false, error: { code: "UPLOAD_FAILED", message: err.message || "Upload failed" } });
      }
      if (!req.file) {
        return res.status(400).json({ ok: false, error: { code: "BAD_REQUEST", message: "No file" } });
      }
      const rel = `img/products/${req.file.filename}`;
      return res.json({
        ok: true,
        path: rel,
        filename: req.file.filename,
        url: `/assets/${rel}`,
      });
    });
  });
}
