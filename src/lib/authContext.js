import { createContext, useContext } from "react";

export const AUTH_STORAGE_KEY = "funzies-auth-state";
export const AUTH_PROFILE_STORAGE_KEY = "funzies-auth-profile";
export const ADMIN_AUTH_STORAGE_KEY = "funzies-admin-auth";
export const AuthContext = createContext(null);

export function getInitialIsAuthenticated() {
  // Always start logged out.
  // Auth is demo-only and should not persist across sessions/devices.
  return false;
}

export function getInitialAuthProfile() {
  // Auth is explicit: no default identity, no persisted profile.
  return { displayName: "", email: "" };
}

export function getInitialIsAdminAuthenticated() {
  // Always start logged out.
  return false;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("Auth context is not available.");
  }

  return context;
}
