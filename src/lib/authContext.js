import { createContext, useContext } from "react";

export const AUTH_STORAGE_KEY = "funzies-auth-state";
export const AUTH_PROFILE_STORAGE_KEY = "funzies-auth-profile";
export const ADMIN_AUTH_STORAGE_KEY = "funzies-admin-auth";
export const AuthContext = createContext(null);

export function getInitialIsAuthenticated() {
  if (typeof window === "undefined") {
    return true;
  }

  const saved = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (saved === "guest") {
    return false;
  }
  if (saved === "signed-in") {
    return true;
  }

  return true;
}

export function getInitialAuthProfile() {
  if (typeof window === "undefined") {
    return { displayName: "Nadine", email: "" };
  }

  const saved = window.localStorage.getItem(AUTH_PROFILE_STORAGE_KEY);
  if (!saved) {
    return { displayName: "Nadine", email: "" };
  }

  try {
    const parsed = JSON.parse(saved);
    return {
      displayName: typeof parsed?.displayName === "string" && parsed.displayName.trim() ? parsed.displayName : "Nadine",
      email: typeof parsed?.email === "string" ? parsed.email : "",
    };
  } catch {
    return { displayName: "Nadine", email: "" };
  }
}

export function getInitialIsAdminAuthenticated() {
  if (typeof window === "undefined") {
    return false;
  }
  return window.localStorage.getItem(ADMIN_AUTH_STORAGE_KEY) === "signed-in";
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("Auth context is not available.");
  }

  return context;
}
