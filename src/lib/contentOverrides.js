/**
 * Settings values are stored as plain text. For content overrides we accept either:
 * - Plain string (legacy)
 * - JSON like { "text": "..." }
 *
 * @param {unknown} raw
 * @returns {string}
 */
export function getContentOverrideText(raw) {
  const s = raw == null ? "" : String(raw);
  const trimmed = s.trim();
  if (!trimmed) return "";
  try {
    const parsed = JSON.parse(trimmed);
    if (parsed && typeof parsed === "object") {
      if (typeof parsed.text === "string") return parsed.text.trim();
      if (typeof parsed.content === "string") return parsed.content.trim();
      if (typeof parsed.value === "string") return parsed.value.trim();
    }
  } catch {
    // Not JSON; treat as plain text.
  }
  return trimmed;
}

