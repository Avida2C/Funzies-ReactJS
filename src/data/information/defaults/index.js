import { companyPageDefaults, helpCenterPageDefaults, contactPageDefaults } from "./companyHelpContact.js";
import {
  accessibilityPageDefaults,
  legalPageDefaults,
  purchaseProtectionPageDefaults,
  returnRefundPageDefaults,
  shippingPageDefaults,
  trustSafetyPageDefaults,
} from "./moreAccordions.js";
import { policyPageDefaults } from "./policyTerms.js";

export { policyPageDefaults } from "./policyTerms.js";
export {
  companyPageDefaults,
  helpCenterPageDefaults,
  contactPageDefaults,
} from "./companyHelpContact.js";
export * from "./moreAccordions.js";

/** Central defaults for all editable information pages (shipped in bundle). */
export const INFORMATION_PAGE_DEFAULTS = {
  policy: policyPageDefaults,
  company: companyPageDefaults,
  legal: legalPageDefaults,
  accessibility: accessibilityPageDefaults,
  "help-center": helpCenterPageDefaults,
  contact: contactPageDefaults,
  shipping: shippingPageDefaults,
  "return-refund": returnRefundPageDefaults,
  "purchase-protection": purchaseProtectionPageDefaults,
  "trust-safety": trustSafetyPageDefaults,
};
