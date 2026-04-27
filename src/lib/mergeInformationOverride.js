/** Array fields we replace whole-list when the override has them (not merge item-by-item). */
const MERGE_WHOLE_ARRAYS = new Set([
  "sections",
  "faqs",
  "aboutSections",
  "privacy",
  "terms",
]);

const ARRAY_KEYS = new Set(["sections", "faqs", "aboutSections"]);

/**
 * Merges stored editor overrides on top of shipped defaults. Arrays like `sections` / `faqs` replace
 * the default list when the override object includes that key.
 */
export function mergeInformationPage(defaults, override) {
  if (override == null) {
    return typeof structuredClone === "function" ? structuredClone(defaults) : { ...defaults };
  }
  if (typeof override !== "object" || Array.isArray(override)) {
    return typeof structuredClone === "function" ? structuredClone(defaults) : { ...defaults };
  }
  if (Object.keys(override).length === 0) {
    return typeof structuredClone === "function" ? structuredClone(defaults) : { ...defaults };
  }
  if (!defaults || typeof defaults !== "object" || Array.isArray(defaults)) {
    return { ...override };
  }

  const out = { ...defaults };

  for (const key of Object.keys(override)) {
    const oVal = override[key];
    const dVal = defaults[key];

    if (oVal === undefined) {
      continue;
    }

    if (key === "privacy" || key === "terms") {
      if (oVal && typeof oVal === "object" && Array.isArray(oVal.sections)) {
        out[key] = dVal && typeof dVal === "object" ? { ...dVal, ...oVal, sections: oVal.sections } : oVal;
      } else if (oVal && typeof oVal === "object") {
        out[key] = mergeInformationPage(dVal && typeof dVal === "object" ? dVal : {}, oVal);
      } else {
        out[key] = oVal;
      }
      continue;
    }

    if (ARRAY_KEYS.has(key) && Array.isArray(dVal) && Array.isArray(oVal)) {
      out[key] = oVal;
      continue;
    }

    if (MERGE_WHOLE_ARRAYS.has(key) && Array.isArray(oVal)) {
      out[key] = oVal;
      continue;
    }

    if (oVal !== null && typeof oVal === "object" && !Array.isArray(oVal) && dVal && typeof dVal === "object" && !Array.isArray(dVal)) {
      out[key] = mergeInformationPage(dVal, oVal);
      continue;
    }

    out[key] = oVal;
  }

  return out;
}
