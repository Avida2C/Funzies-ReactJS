import AppLayout from "../components/AppLayout";
import Accordion from "../components/Accordion";
import SupportHelpSection from "../components/SupportHelpSection";
import ThemedSurface from "../components/ThemedSurface";

const PURCHASE_PROTECTION_ITEMS = [
  {
    id: "secure-payment-encryption",
    title: "1. Secure Payment Encryption",
    content: (
      <p className="leading-7 text-base-content/80">
        We use industry-standard SSL encryption to protect your data. Whether you are paying with Credit Card, PayPal, or
        Crypto, your financial details never touch our servers. They are handled by world-class, secure payment processors.
      </p>
    ),
  },
  {
    id: "doa-guarantee",
    title: "2. The \"Dead on Arrival\" (DOA) Guarantee",
    content: (
      <>
        <p className="leading-7 text-base-content/80">
          If your hardware arrives and will not boot, or if your game disc is scratched, we do not play games.
        </p>
        <ul className="list-disc space-y-2 pl-6 leading-7 text-base-content/80">
          <li>
            <strong className="text-base-content">Instant Replacement:</strong> Report a defective item within 48 hours of
            delivery, and we will prioritize a replacement or a full refund.
          </li>
          <li>
            <strong className="text-base-content">Return Shipping:</strong> If the item is defective, we cover the return
            shipping costs.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "anti-fraud-verification",
    title: "3. Anti-Fraud Verification",
    content: (
      <p className="leading-7 text-base-content/80">
        To protect our community, we verify high-value orders. This prevents unauthorized use of your card and ensures that
        limited-edition drops go to real gamers, not bots.
      </p>
    ),
  },
  {
    id: "shipping-insurance",
    title: "4. Shipping Insurance",
    content: (
      <p className="leading-7 text-base-content/80">
        Every high-value order is automatically insured. If the courier loses your package in transit or it is delivered to
        the wrong &quot;biome,&quot; we will open a claim and get you sorted with a replacement or refund immediately.
      </p>
    ),
  },
  {
    id: "digital-key-authenticity",
    title: "5. Digital Key Authenticity",
    content: (
      <p className="leading-7 text-base-content/80">
        Buying digital codes? We only source keys from authorized distributors. No &quot;grey market&quot; risks here. Every
        code is guaranteed to activate, or we will issue a fresh one instantly.
      </p>
    ),
  },
];

export default function PurchaseProtectionPage() {
  return (
    <AppLayout
      title="Purchase Protection"
      description="Your loot is safe with us. At Funzies Collection, we have your back from the moment you click &quot;Order&quot; until your gear is unboxed and powered up."
    >
      <div className="grid gap-6">
        <ThemedSurface className="p-6">
          <Accordion items={PURCHASE_PROTECTION_ITEMS} />
        </ThemedSurface>

        <SupportHelpSection />
      </div>
    </AppLayout>
  );
}
