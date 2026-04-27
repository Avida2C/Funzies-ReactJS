/** Demo admin credentials (replace with server-side auth in production). */
export const ADMIN_DEMO_EMAIL = "demo@funzies.com";
export const ADMIN_DEMO_PASSWORD = "Demo@1234";

export function validateAdminCredentials(email, password) {
  const normalized = typeof email === "string" ? email.trim().toLowerCase() : "";
  return normalized === ADMIN_DEMO_EMAIL.toLowerCase() && password === ADMIN_DEMO_PASSWORD;
}
