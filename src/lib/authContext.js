import { createContext, useContext } from "react";

export const AUTH_STORAGE_KEY = "funzies-auth-state";
export const AUTH_PROFILE_STORAGE_KEY = "funzies-auth-profile";
export const ADMIN_AUTH_STORAGE_KEY = "funzies-admin-auth";
export const AuthContext = createContext(null);

export function getInitialIsAuthenticated() {
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw == null) return false;
    const parsed = JSON.parse(raw);
    return Boolean(parsed);
  } catch {
    return false;
  }
}

export function getInitialAuthProfile() {
  try {
    const raw = window.localStorage.getItem(AUTH_PROFILE_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return {
      displayName: typeof parsed?.displayName === "string" ? parsed.displayName : "",
      email: typeof parsed?.email === "string" ? parsed.email : "",
    };
  } catch {
    return { displayName: "", email: "" };
  }
}

export function getInitialIsAdminAuthenticated() {
  try {
    const raw = window.localStorage.getItem(ADMIN_AUTH_STORAGE_KEY);
    if (raw == null) return false;
    const parsed = JSON.parse(raw);
    return Boolean(parsed);
  } catch {
    return false;
  }
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("Auth context is not available.");
  }

  return context;
}
