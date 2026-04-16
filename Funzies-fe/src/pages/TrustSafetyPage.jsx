import AppLayout from "../components/AppLayout";
import ThemedSurface from "../components/ThemedSurface";

export default function TrustSafetyPage() {
  return (
    <AppLayout
      title="Trust & Safety Center"
      description="Play Fair. Shop Secure. At Funzies Collection, we have built our shop on transparency and security. Here is how we keep the community safe and your data protected."
    >
      <ThemedSurface className="p-6 space-y-6">
        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-base-content">1. Verified Authenticity</h2>
          <p className="leading-7 text-base-content/80">
            We know the pain of &quot;cloned&quot; hardware or fake collectibles.
          </p>
          <ul className="list-disc space-y-2 pl-6 leading-7 text-base-content/80">
            <li>
              <strong className="text-base-content">Official Sources Only:</strong> Every item in our shop is sourced
              directly from authorized manufacturers or licensed distributors.
            </li>
            <li>
              <strong className="text-base-content">No Grey Market:</strong> We do not sell &quot;OEM&quot; or unboxed
              hardware from untracked sources. What you see is the real deal.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-base-content">2. Pro-Level Data Privacy</h2>
          <p className="leading-7 text-base-content/80">
            We treat your personal info like high-level loot, guarded and encrypted.
          </p>
          <ul className="list-disc space-y-2 pl-6 leading-7 text-base-content/80">
            <li>
              <strong className="text-base-content">No Selling Data:</strong> We never sell your email or purchase
              history to third parties. Period.
            </li>
            <li>
              <strong className="text-base-content">PCI Compliance:</strong> We use Stripe/PayPal level security for
              payments, meaning we never store your credit card numbers on our own servers.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-base-content">3. Anti-Bot & Scalper Policy</h2>
          <p className="leading-7 text-base-content/80">
            We want gear in the hands of gamers, not resellers.
          </p>
          <ul className="list-disc space-y-2 pl-6 leading-7 text-base-content/80">
            <li>
              <strong className="text-base-content">Fair Access:</strong> For high-demand drops (like new GPUs or
              limited edition consoles), we use advanced bot-detection and &quot;one per customer&quot; limits to
              ensure everyone gets a fair shot.
            </li>
            <li>
              <strong className="text-base-content">Verification:</strong> Occasionally, we may flag an order for
              manual review if it looks like a bot. It is just us making sure a human is behind the keyboard.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-base-content">4. Reporting &quot;Sus&quot; Activity</h2>
          <p className="leading-7 text-base-content/80">
            Help us keep the shop clean. If you see something that does not look right, like a suspicious link, an
            error, or a potential security vulnerability, please report it to our security team.
          </p>
          <p className="leading-7 text-base-content/80">
            Report Vulnerability:{" "}
            <a className="link link-primary" href="mailto:demo@infofunzies.com.mt">
              demo@infofunzies.com.mt
            </a>
          </p>
          <p className="leading-7 text-base-content/80">
            <strong className="text-base-content">Report a Scam:</strong> If you receive a suspicious email claiming to
            be from us, do not click. Forward it to us immediately.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-base-content">5. Community Safety</h2>
          <p className="leading-7 text-base-content/80">
            Our shop is a &quot;Toxin-Free&quot; zone. We do not tolerate fraudulent reviews or &quot;shill&quot;
            accounts. Every review you see on our site is from a Verified Purchaser.
          </p>
        </section>
      </ThemedSurface>
    </AppLayout>
  );
}
