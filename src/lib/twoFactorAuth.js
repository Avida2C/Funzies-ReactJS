import { createContext, createElement, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./authContext";

export const TWO_FACTOR_STORAGE_PREFIX = "funzies:account:2fa:";

export const TwoFactorContext = createContext(null);

export function twoFactorStorageKey(email) {
  return `${TWO_FACTOR_STORAGE_PREFIX}${String(email ?? "")
    .trim()
    .toLowerCase()}`;
}

export function createEmptyTwoFactorState() {
  return {
    authenticator: { enabled: false, secret: "" },
    email: { enabled: false },
    passkey: { enabled: false, credentialId: "" },
    backupCodes: { enabled: false, unused: [], used: [] },
    passwordless: false,
  };
}

function randomToken(length = 10) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(length);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < length; i += 1) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

export function generateAuthenticatorSecret() {
  return `FUNZ-${randomToken(4)}-${randomToken(4)}`;
}

export function generateBackupCodes(count = 8) {
  return Array.from({ length: count }, () => `${randomToken(4)}-${randomToken(4)}`);
}

export function generateEmailCode() {
  const n = typeof crypto !== "undefined" && crypto.getRandomValues ? crypto.getRandomValues(new Uint32Array(1))[0] : Date.now();
  return String(n % 1_000_000).padStart(6, "0");
}

/** Demo TOTP: 6-digit code that rotates every 30s from the authenticator secret. */
export function currentAuthenticatorCode(secret) {
  const trimmed = String(secret ?? "").trim();
  if (!trimmed) {
    return "";
  }
  const window = Math.floor(Date.now() / 30_000);
  const seed = `${trimmed}:${window}`;
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return String((hash >>> 0) % 1_000_000).padStart(6, "0");
}

export function secondsUntilNextAuthenticatorCode() {
  return 30 - (Math.floor(Date.now() / 1000) % 30);
}

function normalizeState(raw) {
  const base = createEmptyTwoFactorState();
  if (!raw || typeof raw !== "object") {
    return base;
  }
  return {
    authenticator: {
      enabled: Boolean(raw.authenticator?.enabled),
      secret: typeof raw.authenticator?.secret === "string" ? raw.authenticator.secret : "",
    },
    email: {
      enabled: Boolean(raw.email?.enabled),
    },
    passkey: {
      enabled: Boolean(raw.passkey?.enabled),
      credentialId: typeof raw.passkey?.credentialId === "string" ? raw.passkey.credentialId : "",
    },
    backupCodes: {
      enabled: Boolean(raw.backupCodes?.enabled),
      unused: Array.isArray(raw.backupCodes?.unused) ? raw.backupCodes.unused.map(String) : [],
      used: Array.isArray(raw.backupCodes?.used) ? raw.backupCodes.used.map(String) : [],
    },
    passwordless: Boolean(raw.passwordless),
  };
}

export function readTwoFactorState(email) {
  if (typeof window === "undefined") {
    return createEmptyTwoFactorState();
  }
  try {
    const raw = window.localStorage.getItem(twoFactorStorageKey(email));
    return raw ? normalizeState(JSON.parse(raw)) : createEmptyTwoFactorState();
  } catch {
    return createEmptyTwoFactorState();
  }
}

export function writeTwoFactorState(email, state) {
  if (typeof window === "undefined") {
    return;
  }
  const normalizedEmail = String(email ?? "").trim().toLowerCase();
  if (!normalizedEmail) {
    return;
  }
  try {
    window.localStorage.setItem(twoFactorStorageKey(normalizedEmail), JSON.stringify(normalizeState(state)));
  } catch {
    // ignore
  }
}

export function clearTwoFactorState(email) {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.removeItem(twoFactorStorageKey(email));
  } catch {
    // ignore
  }
}

export function twoFactorMethodsEnabled(state) {
  const s = normalizeState(state);
  return {
    authenticator: s.authenticator.enabled && Boolean(s.authenticator.secret),
    email: s.email.enabled,
    passkey: s.passkey.enabled,
    backupCodes: s.backupCodes.enabled && s.backupCodes.unused.length > 0,
  };
}

export function hasAnyTwoFactor(state) {
  const methods = twoFactorMethodsEnabled(state);
  return methods.authenticator || methods.email || methods.passkey || methods.backupCodes;
}

export function canUsePasswordless(state) {
  const s = normalizeState(state);
  const methods = twoFactorMethodsEnabled(s);
  return Boolean(s.passwordless && (methods.passkey || methods.email));
}

export function verifyTwoFactorChallenge(state, { method, code } = {}) {
  const s = normalizeState(state);
  const trimmed = String(code ?? "").trim().replace(/\s+/g, "").toUpperCase();
  if (method === "authenticator") {
    return trimmed === currentAuthenticatorCode(s.authenticator.secret);
  }
  if (method === "backup") {
    const match = s.backupCodes.unused.find((item) => item.replace(/\s+/g, "").toUpperCase() === trimmed);
    if (!match) {
      return false;
    }
    return { ok: true, consumeBackup: match };
  }
  if (method === "email") {
    return true;
  }
  if (method === "passkey") {
    return s.passkey.enabled;
  }
  return false;
}

export function TwoFactorProvider({ children }) {
  const { email, isAuthenticated } = useAuth();
  const [state, setState] = useState(() => (isAuthenticated ? readTwoFactorState(email) : createEmptyTwoFactorState()));

  useEffect(() => {
    setState(isAuthenticated ? readTwoFactorState(email) : createEmptyTwoFactorState());
  }, [email, isAuthenticated]);

  const persist = (next) => {
    const normalized = normalizeState(next);
    if (normalized.passwordless) {
      const methods = twoFactorMethodsEnabled(normalized);
      if (!methods.passkey && !methods.email) {
        normalized.passwordless = false;
      }
    }
    setState(normalized);
    if (isAuthenticated) {
      writeTwoFactorState(email, normalized);
    }
  };

  const value = useMemo(
    () => ({
      state,
      methods: twoFactorMethodsEnabled(state),
      hasAnyTwoFactor: hasAnyTwoFactor(state),
      passwordless: canUsePasswordless(state),
      persist,
      setState: persist,
    }),
    [email, isAuthenticated, state],
  );

  return createElement(TwoFactorContext.Provider, { value }, children);
}

export function useTwoFactor() {
  const context = useContext(TwoFactorContext);
  if (!context) {
    throw new Error("Two-factor context is not available.");
  }
  return context;
}
