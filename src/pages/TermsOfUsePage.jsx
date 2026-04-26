import AppLayout from "../components/AppLayout";
import ThemedSurface from "../components/ThemedSurface";

export default function TermsOfUsePage() {
  return (
    <AppLayout
      title="Terms of Use"
      description="Welcome to Funzies Collection. By using our site, you are agreeing to the rules below. Think of this as our &quot;End User License Agreement&quot; (EULA) for shopping."
    >
      <ThemedSurface className="p-6 space-y-6">
        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-base-content">1. Account Security</h2>
          <p className="leading-7 text-base-content/80">
            To buy certain loot, you might need to create an account.
          </p>
          <ul className="list-disc space-y-2 pl-6 leading-7 text-base-content/80">
            <li>You are responsible for keeping your password a secret.</li>
            <li>If your account is &quot;compromised,&quot; let us know immediately.</li>
            <li>
              We reserve the right to &quot;ban&quot; or suspend accounts that engage in fraudulent activity.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-base-content">2. Fair Play (Anti-Bot Policy)</h2>
          <p className="leading-7 text-base-content/80">
            We want a fair experience for all gamers.
          </p>
          <ul className="list-disc space-y-2 pl-6 leading-7 text-base-content/80">
            <li>
              The use of automated scripts, bots, or scrapers to purchase limited-edition items is strictly
              prohibited.
            </li>
            <li>
              We reserve the right to cancel any orders that we suspect were placed by bots or for the purpose of
              unauthorized resale.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-base-content">3. Product Pricing & Errors</h2>
          <p className="leading-7 text-base-content/80">
            We try to be 100% accurate, but sometimes &quot;glitches&quot; happen.
          </p>
          <ul className="list-disc space-y-2 pl-6 leading-7 text-base-content/80">
            <li>
              If an item is listed at an incorrect price due to a typo or system error, we have the right to cancel
              the order and refund you.
            </li>
            <li>
              Product colors and images may vary slightly depending on your mobile screen settings.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-base-content">4. Intellectual Property</h2>
          <p className="leading-7 text-base-content/80">
            Everything you see here, the logos, the &quot;Funzies&quot; name, the code, and the custom graphics,
            belongs to us or our partners.
          </p>
          <p className="leading-7 text-base-content/80">
            Do not &quot;ninja&quot; our assets for your own commercial use without permission.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-base-content">5. Digital Content</h2>
          <p className="leading-7 text-base-content/80">
            If you purchase digital codes or downloadable content:
          </p>
          <ul className="list-disc space-y-2 pl-6 leading-7 text-base-content/80">
            <li>
              These items are usually &quot;Single-Use&quot; and tied to your specific account or platform.
            </li>
            <li>
              Once a digital code is &quot;revealed&quot; or sent, it is generally non-refundable (see our Refund
              Policy for details).
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-base-content">6. User-Generated Content</h2>
          <p className="leading-7 text-base-content/80">
            If you post a review or upload a photo of your setup:
          </p>
          <ul className="list-disc space-y-2 pl-6 leading-7 text-base-content/80">
            <li>Keep it &quot;GG&quot; (Good Game). No hate speech, toxicity, or spam.</li>
            <li>
              By posting, you give us permission to show off your content on our site/socials.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-base-content">7. Changes to the Rules</h2>
          <p className="leading-7 text-base-content/80">
            We may update these terms as we &quot;level up&quot; our shop. We will post the &quot;Patch Notes&quot;
            (updates) right here.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-base-content">Questions?</h2>
          <p className="leading-7 text-base-content/80">
            If you have questions about these terms, reach out at{" "}
            <a className="link link-primary" href="mailto:legal@funziescollection.com">
              legal@funziescollection.com
            </a>
            .
          </p>
        </section>
      </ThemedSurface>
    </AppLayout>
  );
}
