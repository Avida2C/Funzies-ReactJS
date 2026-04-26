export const OPEN_ROLES = [
  {
    id: "community-events-manager",
    title: "Community & Events Manager",
    team: "Marketing",
    location: "Hybrid - Valletta",
    type: "Full-time",
    summary:
      "Own our community calendar, launch seasonal drops, and run local tournament partnerships that keep Funzies plugged into the scene.",
    skills: ["Discord strategy", "Event production", "Creator partnerships"],
    responsibilities: [
      "Plan and execute quarterly online and in-person community events.",
      "Partner with creators, local clubs, and tournament organizers.",
      "Coordinate campaign calendars with product launches and seasonal drops.",
      "Track engagement metrics and propose ways to grow retention.",
    ],
    requirements: [
      "2+ years in community, social, or events roles.",
      "Strong communication and stakeholder management skills.",
      "Comfortable with Discord, content tools, and campaign planning.",
      "A genuine passion for gaming culture and communities.",
    ],
  },
  {
    id: "ecommerce-frontend-developer",
    title: "E-Commerce Frontend Developer",
    team: "Product & Engineering",
    location: "Remote - EU timezones",
    type: "Full-time",
    summary:
      "Build fast storefront experiences, improve conversion on mobile, and ship features that make checkout feel like a speedrun.",
    skills: ["React", "Performance optimization", "A/B experiments"],
    responsibilities: [
      "Develop and maintain customer-facing pages and feature flows.",
      "Optimize Lighthouse scores and mobile performance budgets.",
      "Collaborate with design on reusable UI patterns and components.",
      "Implement and evaluate experiments that improve conversion.",
    ],
    requirements: [
      "3+ years of frontend engineering experience.",
      "Strong React fundamentals and practical CSS/Tailwind skills.",
      "Experience with analytics, experimentation, and performance tooling.",
      "Comfortable shipping in a fast, iterative product environment.",
    ],
  },
  {
    id: "gaming-hardware-curator",
    title: "Gaming Hardware Curator",
    team: "Merchandising",
    location: "On-site - Distribution Hub",
    type: "Contract",
    summary:
      "Test incoming gear, validate compatibility claims, and curate weekly picks so players can buy with confidence.",
    skills: ["PC build knowledge", "QA mindset", "Vendor coordination"],
    responsibilities: [
      "Evaluate incoming peripherals and hardware for quality standards.",
      "Run compatibility checks across common PC and console setups.",
      "Curate weekly feature picks with clear buyer guidance.",
      "Partner with vendors to resolve product data and spec gaps.",
    ],
    requirements: [
      "Hands-on experience with gaming hardware and peripherals.",
      "Attention to detail and strong product quality instincts.",
      "Ability to document findings clearly for non-technical teams.",
      "Comfortable working cross-functionally with operations and support.",
    ],
  },
];

export const CAREER_PERKS = [
  "Remote-friendly culture with async-first workflows",
  "Monthly gaming allowance and launch-day product credits",
  "Learning budget for certifications, conferences, and workshops",
  "Wellness support and flexible time-off policy",
];

export function getRoleById(roleId) {
  return OPEN_ROLES.find((role) => role.id === roleId);
}
