import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { INFORMATION_PAGE_DEFAULTS } from "../data/information/defaults";
import { mergeInformationPage } from "./mergeInformationOverride";

export const INFORMATION_CONTENT_STORAGE_KEY = "funzies-information-content-v1";

const InformationContentContext = createContext(null);

function loadStoredOverrides() {
  if (typeof window === "undefined") {
    return {};
  }
  try {
    const raw = window.localStorage.getItem(INFORMATION_CONTENT_STORAGE_KEY);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

export function InformationContentProvider({ children }) {
  const [overrides, setOverrides] = useState(loadStoredOverrides);

  useEffect(() => {
    try {
      window.localStorage.setItem(INFORMATION_CONTENT_STORAGE_KEY, JSON.stringify(overrides));
    } catch {
      /* ignore quota */
    }
  }, [overrides]);

  const getMerged = useCallback(
    (pageId) => {
      const base = INFORMATION_PAGE_DEFAULTS[pageId];
      if (!base) {
        return null;
      }
      return mergeInformationPage(structuredClone(base), overrides[pageId]);
    },
    [overrides],
  );

  const setPageOverride = useCallback((pageId, nextOverride) => {
    setOverrides((current) => {
      if (nextOverride === null || nextOverride === undefined) {
        const { [pageId]: _, ...rest } = current;
        return rest;
      }
      return { ...current, [pageId]: nextOverride };
    });
  }, []);

  const removePageOverride = useCallback((pageId) => {
    setOverrides((current) => {
      const { [pageId]: _, ...rest } = current;
      return rest;
    });
  }, []);

  const exportAllOverrides = useCallback(() => {
    return JSON.stringify(overrides, null, 2);
  }, [overrides]);

  const importAllOverrides = useCallback((jsonString) => {
    const parsed = JSON.parse(jsonString);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      throw new Error("Invalid JSON object.");
    }
    setOverrides(parsed);
  }, []);

  const value = useMemo(
    () => ({
      getMerged,
      setPageOverride,
      removePageOverride,
      exportAllOverrides,
      importAllOverrides,
      hasOverride: (pageId) => Boolean(overrides[pageId]),
    }),
    [getMerged, setPageOverride, removePageOverride, exportAllOverrides, importAllOverrides, overrides],
  );

  return <InformationContentContext.Provider value={value}>{children}</InformationContentContext.Provider>;
}

export function useInformationContent() {
  const ctx = useContext(InformationContentContext);
  if (!ctx) {
    throw new Error("useInformationContent must be used within InformationContentProvider.");
  }
  return ctx;
}
