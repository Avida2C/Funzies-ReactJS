/** Store / company details aligned with Figma (Company page + global footer). */

export const COMPANY_STORE_CONTACT = {
  address: "Funzies Collection, 1346, Lynn Avenue, Triq Funk, San Pawl il-Baħar, SPB0011",
  phone: "+35612345678",
  email: "example@email.com",
  /** Used for the embedded map search (Google Maps). */
  mapSearchQuery: "Funzies Collection, Lynn Avenue, Triq Funk, San Pawl il-Baħar SPB0011 Malta",
};

/** Shown in the main site footer “Security certification” row (logo strip). */
export const FOOTER_SECURITY_CERTIFICATIONS = [
  { label: "Trustly secured", src: "https://www.figma.com/api/mcp/asset/2792fe29-8936-4e86-affd-c950b0313414", width: 39 },
  { label: "Visa secured", src: "https://www.figma.com/api/mcp/asset/0f6eee51-5aa9-46cb-b379-9a276c529722", width: 29 },
  { label: "Mastercard identity check", src: "https://www.figma.com/api/mcp/asset/3e2a382b-05c9-42b7-959e-3d10442aa58f", width: 61 },
  { label: "SafeKey", src: "https://www.figma.com/api/mcp/asset/6f115673-864e-4a7a-b2a9-881c27ec303a", width: 61 },
  { label: "Protect buy", src: "https://www.figma.com/api/mcp/asset/19db8e0e-dd8e-4b44-a23a-9fe1505d5cce", width: 39 },
  { label: "JCB secured", src: "https://www.figma.com/api/mcp/asset/4886e1d5-2b8b-404a-bcea-78873307aad2", width: 39 },
  { label: "PCI certified", src: "https://www.figma.com/api/mcp/asset/23fab86c-09dd-4d7c-bf7f-f9e8778c857e", width: 61 },
];

/** Shown in the main site footer “We accept” row (payment icons). */
export const FOOTER_PAYMENT_METHODS = [
  { label: "PayPal", src: "https://www.figma.com/api/mcp/asset/05d48617-45db-4dda-a09e-413793242ef1", width: 38 },
  { label: "Visa", src: "https://www.figma.com/api/mcp/asset/e151541f-be3b-4c94-ac13-c792e201ecb3", width: 38 },
  { label: "Mastercard", src: "https://www.figma.com/api/mcp/asset/bec9bfc6-751f-4bb7-bdd1-1c54afa3fa53", width: 38 },
  { label: "American Express", src: "https://www.figma.com/api/mcp/asset/00edbf29-a405-4fc7-96c7-7eb0348a3620", width: 39 },
  { label: "Discover", src: "https://www.figma.com/api/mcp/asset/49613c20-2376-4e6d-81f5-cd5d7b8841b8", width: 39 },
  { label: "Apple Pay", src: "https://www.figma.com/api/mcp/asset/c6cb4305-4c24-43fa-8235-9e4ef558fa7a", width: 39 },
  { label: "Google Pay", src: "https://www.figma.com/api/mcp/asset/3a600c16-aa87-4dc6-847c-50098e747571", width: 39 },
];

/**
 * Funzies social profiles — used on the Company page and in the main footer “Connect with Funzies”.
 * `id` must match the icon key in the layout (`facebook` | `x` | `instagram`, …).
 */
export const COMPANY_SOCIAL_LINKS = [
  { id: "facebook", name: "Facebook", href: "https://www.facebook.com/" },
  { id: "x", name: "X", href: "https://twitter.com/" },
  { id: "instagram", name: "Instagram", href: "https://www.instagram.com/" },
];

export const COMPANY_OPENING_HOURS = [
  { day: "Monday", hours: "9:00 - 19:00" },
  { day: "Tuesday", hours: "9:00 - 19:00" },
  { day: "Wednesday", hours: "9:00 - 19:00" },
  { day: "Thursday", hours: "9:00 - 19:00" },
  { day: "Friday", hours: "9:00 - 19:00" },
  { day: "Saturday", hours: "10:00 - 16:00" },
  { day: "Sunday", hours: "Closed" },
];
