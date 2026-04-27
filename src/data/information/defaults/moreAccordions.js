export const legalPageDefaults = {
  layoutTitle: "Legal Center",
  layoutDescription:
    "Funzies Collection is operated with transparency and compliance in mind. Below you will find all the documentation regarding our operations, your rights, and our responsibilities.",
  sections: [
    {
      id: "governing-law",
      title: "1. Governing Law",
      html: "<p>Funzies Collection is operated out of [Your City/Country]. By using this site, you agree that any disputes will be handled under the jurisdiction of [Your Local State/Province] courts.</p>",
    },
    {
      id: "intellectual-property",
      title: "2. Intellectual Property (IP)",
      html: '<p>All content on this site, including the "Funzies" brand, logos, custom graphics, and website code, is the property of Funzies Collection or its licensors.</p><p><strong>Third-Party Trademarks:</strong> All game titles, console names (e.g., PlayStation, Xbox, Nintendo), and brand logos are the property of their respective owners and are used here for descriptive purposes only.</p>',
    },
    {
      id: "compliance-regulatory",
      title: "3. Compliance & Regulatory",
      html: "<p>We comply with the following consumer protection standards:</p><ul><li><strong>Data Protection:</strong> Fully compliant with [GDPR / CCPA / Local Privacy Laws].</li><li><strong>E-Commerce Standards:</strong> We adhere to fair trade practices and transparent pricing.</li></ul>",
    },
    {
      id: "legal-directory",
      title: "4. Legal Directory",
      html: '<p>Looking for something specific? Click a document below:</p><ul class="list-none pl-0 space-y-2"><li><a href="/privacy">Privacy Policy &amp; Terms of Use</a> - How we handle your data and the rules for using our site.</li><li><a href="/accessibility">Accessibility Statement</a> - Our commitment to inclusive design.</li><li><a href="/trust-safety">Trust &amp; Safety</a> - Our anti-fraud and authenticity standards.</li></ul>',
    },
    {
      id: "corporate-contact",
      title: "Corporate Contact",
      html: '<p>For official legal inquiries or notices, please contact:</p><p>Funzies Collection Legal Dept.<br/>[Your Business Address]<br/><a href="mailto:legal@funziescollection.com">legal@funziescollection.com</a></p>',
    },
  ],
};

export const accessibilityPageDefaults = {
  layoutTitle: "Accessibility",
  layoutDescription:
    "Everyone deserves a smooth path from browsing to checkout. Here is how Funzies Collection approaches accessibility, what we are improving, and how to reach us if something gets in your way.",
  sections: [
    {
      id: "our-commitment",
      title: "Our commitment",
      html: "<p>We want our storefront to work well for gamers and collectors who use screen readers, voice control, keyboard-only navigation, high zoom, or other assistive tools. Accessibility is not a one-time patch; we treat it as ongoing work alongside design and engineering.</p><p><strong>Conformance goal:</strong> We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA for our web experience. We are still improving, so you may occasionally run into gaps; when you do, we want to hear from you.</p>",
    },
    {
      id: "what-we-focus-on",
      title: "What we focus on",
      html: "<p>To keep the experience fair for every player, we prioritize:</p><ul><li><strong>Readable content:</strong> Clear typography, sensible heading structure, and text that does not rely on color alone to convey meaning.</li><li><strong>Keyboard and focus:</strong> Logical tab order, visible focus indicators, and interactive controls that can be used without a mouse where technically possible.</li><li><strong>Mobile and zoom:</strong> Layouts that remain usable when you increase text size or zoom the page on a phone or tablet.</li><li><strong>Theme choice:</strong> Light and dark modes so you can pick contrast that works for your eyes and environment.</li><li><strong>Forms and errors:</strong> Labels tied to inputs and clear feedback when something needs your attention (for example, checkout or contact flows).</li><li><strong>Images and media:</strong> Meaningful alternative text for informative images where we control the markup; decorative images handled so assistive tech can skip them appropriately.</li></ul>",
    },
    {
      id: "how-we-test",
      title: "How we test",
      html: "<p>We combine automated checks with manual passes using common setups, for example:</p><ul><li>Keyboard-only navigation through search, cart, and primary flows.</li><li>Screen readers such as NVDA, JAWS, or VoiceOver on recent browser versions.</li><li>Zoom and text-scaling on desktop and mobile viewports.</li></ul><p>Results can vary by browser, operating system, and assistive technology version. If something fails in your setup, the details you send help us reproduce and fix it faster.</p>",
    },
    {
      id: "known-limitations",
      title: "Known limitations",
      html: "<p>Some third-party tools (for example, payment providers, maps, or embedded players) are not fully under our control. We choose partners with strong security and usability track records and report accessibility issues to them when we find them. If a blocker comes from a third party, we will explain what we can do on our side and escalate where possible.</p>",
    },
  ],
};

export const shippingPageDefaults = {
  layoutTitle: "Shipping Information",
  layoutDescription: "From our warehouse to your setup: how we pack, ship, and track your Funzies Collection orders.",
  sections: [
    {
      id: "order-processing",
      title: "Order processing",
      html: "<p>Most in-stock orders are processed within 1 to 2 business days (Monday through Friday, excluding public holidays). Pre-orders and limited drops ship on or shortly after the stated release date. You will receive a confirmation email when your order is placed and another when it leaves our warehouse.</p>",
    },
    {
      id: "delivery-times-regions",
      title: "Delivery times & regions",
      html: "<p>Estimated delivery depends on your address, carrier, and whether the item ships from our main hub or a partner facility. These ranges are guides only and are not guaranteed:</p><ul><li><strong>Domestic (example):</strong> approximately 2 to 5 business days after dispatch.</li><li><strong>EU neighbors (example):</strong> approximately 3 to 7 business days after dispatch.</li><li><strong>International:</strong> approximately 5 to 14 business days after dispatch, subject to customs.</li></ul><p>Rural or remote areas, carrier backlogs, weather, and customs can add time. We will share tracking as soon as your package is on the move.</p>",
    },
    {
      id: "carriers-tracking",
      title: "Carriers & tracking",
      html: "<p>We ship with trusted carriers. When your order ships, you will get a tracking link by email. Use that link for the most up-to-date delivery estimate. If tracking has not updated for several business days, contact us and we will help investigate.</p>",
    },
    {
      id: "shipping-costs",
      title: "Shipping costs",
      html: "<p>Shipping fees are calculated at checkout based on destination, weight, dimensions, and service level. Free or discounted shipping may apply during promotions; any active offer will be shown before you pay.</p>",
    },
    {
      id: "international-duties-taxes",
      title: "International orders, duties & taxes",
      html: "<p>Orders shipped outside your country may be subject to import duties, taxes, or brokerage fees charged by customs or the carrier. Those charges are the buyer's responsibility unless we explicitly state otherwise at checkout. We cannot control customs processing times.</p>",
    },
    {
      id: "address-accuracy-po-boxes",
      title: "Address accuracy & PO boxes",
      html: "<p>Please double-check your shipping address before submitting your order. Some carriers cannot deliver to P.O. boxes for certain products (for example, high-value or oversized items). If we cannot ship to the address you provided, we will contact you to arrange an alternative.</p>",
    },
    {
      id: "damaged-lost-refused",
      title: "Damaged, lost, or refused delivery",
      html: "<p>If your package arrives damaged, or if tracking shows delivered but you did not receive it, reach out promptly with your order number and photos if applicable. For insured shipments, we will work with you and the carrier to resolve the issue. Packages returned to us as undeliverable may be refunded minus shipping and restocking where applicable, per our return policy.</p><p>For coverage on high-value orders, see also <a href=\"/purchase-protection\">Purchase Protection</a>.</p>",
    },
  ],
};

export const returnRefundPageDefaults = {
  layoutTitle: "Return & Refund Policy",
  layoutDescription:
    "We want you to love what you buy. If something is not right, this policy explains when you can return an item, how to start a request, and how refunds are processed. For defective or high-value orders, also see Purchase Protection.",
  sections: [
    {
      id: "eligibility",
      title: "Eligibility",
      html: "<p>You may request a return for eligible products within <strong>30 days</strong> of delivery, unless a different window is stated on the product page (for example, final sale or limited drops). Items must be:</p><ul><li>Unused, unopened, or in original condition where applicable.</li><li>In original packaging with all accessories, manuals, and labels included.</li><li>Accompanied by proof of purchase (order number or receipt).</li></ul>",
    },
    {
      id: "non-returnable",
      title: "Non-returnable items",
      html: "<p>Some products cannot be returned for hygiene, licensing, or fraud-prevention reasons, including when marked final sale. Examples may include:</p><ul><li>Opened software, digital codes, or downloadable content once delivered or revealed.</li><li>Earbuds, in-ear monitors, or similar items if hygiene seals are broken (where required by law).</li><li>Collectibles or limited editions sold as &quot;as-is&quot; on the product page.</li><li>Gift cards or store credit.</li></ul><p>If you are unsure, contact support before opening the product.</p>",
    },
    {
      id: "start-return",
      title: "How to start a return",
      html: "<ol class=\"list-decimal pl-6 space-y-2\"><li>Contact us through <a href=\"/contact\">Contact</a> or the <a href=\"/help-center\">Help Center</a> with your order number and reason for return.</li><li>Wait for a return authorization and instructions (including the return address and any RMA reference).</li><li>Pack the item securely. We are not responsible for damage caused by inadequate return packaging.</li><li>Ship the item using a trackable method unless we provide a prepaid label.</li></ol>",
    },
    {
      id: "shipping-restocking",
      title: "Return shipping & restocking",
      html: '<p>Unless the return is due to our error or a defective product covered under <a href="/purchase-protection">Purchase Protection</a>, you may be responsible for return shipping costs. A restocking fee may apply to certain categories (for example, large freight items) if disclosed at checkout or on the product page.</p>',
    },
    {
      id: "refunds",
      title: "Refunds",
      html: "<p>After we receive and inspect your return, we will notify you of approval or rejection. If approved, refunds are issued to the original payment method when possible. Processing times vary by bank or card issuer; please allow several business days after we issue the refund for it to appear on your statement.</p><p>Original shipping charges are generally non-refundable unless we sent the wrong item or the product was defective or not as described.</p>",
    },
    {
      id: "exchanges",
      title: "Exchanges",
      html: "<p>Exchanges depend on stock availability. In many cases we will process a return and place a new order for the item you want. If you need a different size or variant, contact support and we will outline the fastest option.</p>",
    },
    {
      id: "damaged-incorrect",
      title: "Damaged or incorrect items",
      html: '<p>If your order arrives damaged or is not what you ordered, contact us right away with photos and your order number. We will prioritize a replacement, exchange, or refund in line with our policies and <a href="/purchase-protection">Purchase Protection</a>.</p>',
    },
    {
      id: "warranty-support",
      title: "Warranty & manufacturer support",
      html: "<p>Some hardware includes a manufacturer warranty. After our return window, defects may need to go through the manufacturer's process. We can help point you to the right channel when applicable.</p>",
    },
  ],
};

export const purchaseProtectionPageDefaults = {
  layoutTitle: "Purchase Protection",
  layoutDescription:
    'Your loot is safe with us. At Funzies Collection, we have your back from the moment you click "Order" until your gear is unboxed and powered up.',
  sections: [
    {
      id: "secure-payment-encryption",
      title: "1. Secure Payment Encryption",
      html: "<p>We use industry-standard SSL encryption to protect your data. Whether you are paying with Credit Card, PayPal, or Crypto, your financial details never touch our servers. They are handled by world-class, secure payment processors.</p>",
    },
    {
      id: "doa-guarantee",
      title: "2. The &quot;Dead on Arrival&quot; (DOA) Guarantee",
      html: "<p>If your hardware arrives and will not boot, or if your game disc is scratched, we do not play games.</p><ul><li><strong>Instant Replacement:</strong> Report a defective item within 48 hours of delivery, and we will prioritize a replacement or a full refund.</li><li><strong>Return Shipping:</strong> If the item is defective, we cover the return shipping costs.</li></ul>",
    },
    {
      id: "anti-fraud-verification",
      title: "3. Anti-Fraud Verification",
      html: "<p>To protect our community, we verify high-value orders. This prevents unauthorized use of your card and ensures that limited-edition drops go to real gamers, not bots.</p>",
    },
    {
      id: "shipping-insurance",
      title: "4. Shipping Insurance",
      html: '<p>Every high-value order is automatically insured. If the courier loses your package in transit or it is delivered to the wrong "biome," we will open a claim and get you sorted with a replacement or refund immediately.</p>',
    },
    {
      id: "digital-key-authenticity",
      title: "5. Digital Key Authenticity",
      html: "<p>Buying digital codes? We only source keys from authorized distributors. No &quot;grey market&quot; risks here. Every code is guaranteed to activate, or we will issue a fresh one instantly.</p>",
    },
  ],
};

export const trustSafetyPageDefaults = {
  layoutTitle: "Trust & Safety Center",
  layoutDescription:
    "Play Fair. Shop Secure. At Funzies Collection, we have built our shop on transparency and security. Here is how we keep the community safe and your data protected.",
  sections: [
    {
      id: "verified-authenticity",
      title: "1. Verified Authenticity",
      html: "<p>We know the pain of &quot;cloned&quot; hardware or fake collectibles.</p><ul><li><strong>Official Sources Only:</strong> Every item in our shop is sourced directly from authorized manufacturers or licensed distributors.</li><li><strong>No Grey Market:</strong> We do not sell &quot;OEM&quot; or unboxed hardware from untracked sources. What you see is the real deal.</li></ul>",
    },
    {
      id: "pro-level-data-privacy",
      title: "2. Pro-Level Data Privacy",
      html: "<p>We treat your personal info like high-level loot, guarded and encrypted.</p><ul><li><strong>No Selling Data:</strong> We never sell your email or purchase history to third parties. Period.</li><li><strong>PCI Compliance:</strong> We use Stripe/PayPal level security for payments, meaning we never store your credit card numbers on our own servers.</li></ul>",
    },
    {
      id: "anti-bot-scalper-policy",
      title: "3. Anti-Bot & Scalper Policy",
      html: "<p>We want gear in the hands of gamers, not resellers.</p><ul><li><strong>Fair Access:</strong> For high-demand drops (like new GPUs or limited edition consoles), we use advanced bot-detection and &quot;one per customer&quot; limits to ensure everyone gets a fair shot.</li><li><strong>Verification:</strong> Occasionally, we may flag an order for manual review if it looks like a bot. It is just us making sure a human is behind the keyboard.</li></ul>",
    },
    {
      id: "reporting-sus-activity",
      title: "4. Reporting &quot;Sus&quot; Activity",
      html: "<p>Help us keep the shop clean. If you see something that does not look right, like a suspicious link, an error, or a potential security vulnerability, please report it to our security team.</p><p>Report Vulnerability: <a href=\"mailto:demo@infofunzies.com.mt\">demo@infofunzies.com.mt</a></p><p><strong>Report a Scam:</strong> If you receive a suspicious email claiming to be from us, do not click. Forward it to us immediately.</p>",
    },
    {
      id: "community-safety",
      title: "5. Community Safety",
      html: '<p>Our shop is a "Toxin-Free" zone. We do not tolerate fraudulent reviews or "shill" accounts. Every review you see on our site is from a Verified Purchaser.</p>',
    },
  ],
};
