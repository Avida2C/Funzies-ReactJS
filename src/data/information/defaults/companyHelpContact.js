export const companyPageDefaults = {
  layoutTitle: "Company",
  layoutDescription: "Our story, how to team up with us, and where to find the store.",
  aboutHeading: "About Funzies",
  aboutSections: [
    {
      id: "mission",
      title: "Our mission",
      html: "<p>Founded in [Year], Funzies Collection was built by gamers, for gamers. We realized that finding authentic gear, rare collectibles, and reliable hardware should not feel like a &quot;boss fight.&quot; Our mission is to provide a curated, high-trust marketplace where every player can find their next favorite piece of loot.</p>",
    },
    {
      id: "why",
      title: "Why &quot;Funzies&quot;?",
      html: "<p>Because shopping should be fun. We have stripped away the &quot;sus&quot; listings and the bot-dominated drops to create a shop that feels like your favorite local gaming lounge - just on your phone.</p>",
    },
    {
      id: "partners",
      title: "Our partners",
      html: "<p>We work with the biggest names in the industry to ensure that every product we sell is 100% authentic. We are an authorized reseller for major gaming peripherals and lifestyle brands.</p>",
    },
  ],
  join: {
    title: "Join the party",
    lead: "Build with us, or bring a partnership idea.",
    bodyHtml:
      "<p>Browse open roles on the careers page, or use the contact form for hiring questions, wholesale, and collaborations—we route partnership topics straight to the right team.</p><p>Prefer email only for deals? <a href=\"mailto:partners@funziescollection.com\">partners@funziescollection.com</a></p>",
  },
};

export const helpCenterPageDefaults = {
  layoutTitle: "Help Center",
  layoutDescription: "Find answers fast, browse popular topics, and reach out only when you need a human.",
  hero: {
    kicker: "Self-serve first",
    title: "Search the knowledge base",
    lead: 'Type a keyword like "tracking", "return", or "password" to filter FAQs instantly.',
  },
  popularTipHtml:
    '<p><strong>Tip:</strong> If your question is about privacy or terms, start at <a href="/privacy">Privacy &amp; Terms</a> or the <a href="/legal">Legal center</a>.</p>',
  faqIntro: "Answers to the questions we see the most.",
  faqEmpty:
    "No matches yet. Try a shorter keyword, browse Popular topics above, or contact us below and include your order number for a faster reply.",
  faqs: [
    {
      id: "faq-1",
      q: "Where is my order?",
      a: "Check your email for a shipping confirmation with tracking. Delivery estimates depend on your region and carrier. For full details, open Shipping & delivery.",
      tags: "tracking, ship, delivery, order status",
    },
    {
      id: "faq-2",
      q: "Can I change my shipping address after I place an order?",
      a: "If your order has not shipped yet, contact us as soon as possible with your order number. Once a package is dispatched, the carrier may need to handle redirects.",
      tags: "address, change, shipping",
    },
    {
      id: "faq-3",
      q: "How do returns work?",
      a: "Most eligible items can be returned within the policy window if they meet condition and proof-of-purchase requirements. Start by reading Returns & refunds, then contact us for return authorization and next steps.",
      tags: "return, refund, exchange",
    },
    {
      id: "faq-4",
      q: "What if my item arrives damaged or defective?",
      a: "Reach out right away with your order number and photos if possible. We prioritize replacements and refunds for verified issues, including guidance in Purchase protection.",
      tags: "damaged, defect, doa, broken",
    },
    {
      id: "faq-5",
      q: "Are products authentic?",
      a: "We focus on curated, trustworthy inventory and authorized sourcing where applicable. If you have a specific authenticity question, include the product link when you contact support.",
      tags: "authentic, fake, real, warranty",
    },
    {
      id: "faq-6",
      q: "How do I reset my password?",
      a: "Use the Forgot password flow to request a secure reset link. If you do not receive an email, check spam filters and try again with the exact address on your account.",
      tags: "password, login, account, email",
    },
    {
      id: "faq-7",
      q: "Do you ship internationally?",
      a: "We may ship to select regions depending on product restrictions and carrier coverage. International orders can include duties and taxes assessed by customs. See Shipping & delivery for the full picture.",
      tags: "international, customs, duty, tax",
    },
    {
      id: "faq-8",
      q: "Who do I contact for accessibility help?",
      a: "Visit our Accessibility page for commitments and contact options. We aim to respond quickly to accessibility feedback.",
      tags: "accessibility, a11y, screen reader",
    },
  ],
};

export const contactPageDefaults = {
  layoutTitle: "Contact",
  layoutDescription:
    "We are here for orders, returns, and product questions. Many answers are instant in the Help Center.",
  responseTitle: "Response times",
  responseHtml:
    "<p>We typically reply within <strong>1 business day</strong> for general support. Order issues with a valid order number are prioritized.</p>",
  beforeYouWriteTitle: "Before you write",
  beforeYouWriteIntro: "These pages solve most questions without waiting on a reply.",
  directEmailTitle: "Direct email",
  directEmailIntro: "Prefer email? Use the form for the fastest routing, or reach out directly:",
  directEmailListHtml: `<ul class="space-y-2 text-sm">
<li><strong>Support:</strong> <a href="mailto:demo@infofunzies.com.mt">demo@infofunzies.com.mt</a></li>
<li><strong>Corporate:</strong> <a href="mailto:corporate@funziescollection.com">corporate@funziescollection.com</a></li>
<li><strong>Partnerships:</strong> <a href="mailto:partners@funziescollection.com">partners@funziescollection.com</a></li>
</ul>`,
  directEmailFooterHtml:
    '<p class="text-sm">Accessibility feedback: <a href="/accessibility">Accessibility</a>.</p>',
};
