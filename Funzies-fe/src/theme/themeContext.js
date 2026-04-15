import { createContext, useContext } from "react";

export const THEME_STORAGE_KEY = "funzies-theme-mode";
export const ThemeContext = createContext(null);

export function getInitialThemeMode() {
  if (typeof window === "undefined") {
    return "light";
  }

  const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (saved === "light" || saved === "dark") {
    return saved;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("Theme context is not available.");
  }

  return context;
}

