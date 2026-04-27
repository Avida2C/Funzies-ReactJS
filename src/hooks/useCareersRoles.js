import { useMemo } from "react";
import { OPEN_ROLES } from "../data/careersData";
import { usePublicSettings } from "./usePublicSettings";

function safeParseJson(value, fallback) {
  if (value == null || value === "") return fallback;
  try {
    const parsed = JSON.parse(String(value));
    return parsed == null ? fallback : parsed;
  } catch {
    return fallback;
  }
}

export const CAREERS_OPEN_ROLES_KEY = "content.careers.open_roles";

export function useCareersRoles() {
  const settings = usePublicSettings([CAREERS_OPEN_ROLES_KEY]);
  const roles = useMemo(
    () => safeParseJson(settings.values[CAREERS_OPEN_ROLES_KEY], OPEN_ROLES),
    [settings.values],
  );

  return {
    roles: Array.isArray(roles) ? roles : OPEN_ROLES,
    loading: settings.loading,
    error: settings.error,
    refresh: settings.refresh,
  };
}

