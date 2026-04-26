import AppLayout from "../components/AppLayout";
import ThemedSurface from "../components/ThemedSurface";

export default function PolicyCenterPage() {
  return (
    <AppLayout
      title="Policy Center"
      description="This page combines our Privacy Policy and Terms of Use into one place for easier reading."
    >
      <ThemedSurface className="p-6 space-y-8">
        <section id="privacy" className="space-y-6">
          <h2 className="text-2xl font-semibold text-base-content">Privacy Policy</h2>

          <section className="space-y-2">
            <h3 className="text-xl font-semibold text-base-content">1. What Info Do We Collect?</h3>
            <p className="leading-7 text-base-content/80">To get your gear to your door, we collect:</p>
            <ul className="list-disc space-y-2 pl-6 leading-7 text-base-content/80">
              <li>
                <strong className="text-base-content">Identity Data:</strong> Name and username.
              </li>
              <li>
                <strong className="text-base-content">Contact Data:</strong> Email, phone number, and shipping
                address.
              </li>
              <li>
                <strong className="text-base-content">Transaction Data:</strong> Details about the products you have
                bought (but never your full credit card number. Our secure payment processors handle that).
              </li>
              <li>
                <strong className="text-base-content">Technical Data:</strong> Your IP address and device type to make
                sure our mobile site looks &quot;GG&quot; on your specific phone.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-xl font-semibold text-base-content">2. How We Use Your Data</h3>
            <p className="leading-7 text-base-content/80">We do not collect data just for fun. We use it to:</p>
            <ul className="list-disc space-y-2 pl-6 leading-7 text-base-content/80">
              <li>Process and ship your orders.</li>
              <li>Send you &quot;Order Shipped&quot; notifications.</li>
              <li>Prevent fraud and bot attacks.</li>
              <li>Send you optional &quot;New Drop&quot; alerts (only if you opt-in).</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-xl font-semibold text-base-content">3. No Selling to Third Parties</h3>
            <p className="leading-7 text-base-content/80">
              We do not sell your personal data. We are not in the business of selling your email to random
              advertisers. We only share info with partners necessary to run the shop (like the courier delivering your
              package or our secure payment gateway).
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-xl font-semibold text-base-content">4. Cookies & Tracking</h3>
            <p className="leading-7 text-base-content/80">
              We use cookies to remember what is in your Cart and to keep you logged in. You can &quot;disable&quot;
              cookies in your browser settings, but the site might feel a bit &quot;laggy&quot; or forget your items.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-xl font-semibold text-base-content">5. Your Rights (The &quot;Admin&quot; Controls)</h3>
            <p className="leading-7 text-base-content/80">You have control over your data. At any time, you can:</p>
            <ul className="list-disc space-y-2 pl-6 leading-7 text-base-content/80">
              <li>
                <strong className="text-base-content">Access:</strong> Ask for a copy of the data we have on you.
              </li>
              <li>
                <strong className="text-base-content">Delete:</strong> Request that we &quot;delete your character&quot;
                (wipe your account data).
              </li>
              <li>
                <strong className="text-base-content">Unsubscribe:</strong> Opt-out of marketing emails with one click.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-xl font-semibold text-base-content">6. Data Security</h3>
            <p className="leading-7 text-base-content/80">
              We use &quot;End-to-End&quot; encryption (SSL) to protect your data during checkout. Our servers are
              guarded by industry-standard firewalls to keep &quot;invaders&quot; out.
            </p>
            <p className="leading-7 text-base-content/80">
              Privacy questions:{" "}
              <a className="link link-primary" href="mailto:privacy@funziescollection.com">
                privacy@funziescollection.com
              </a>
            </p>
            <p className="leading-7 text-base-content/80">Last Updated: April 2026</p>
          </section>
        </section>

        <section id="terms" className="space-y-6 border-t border-base-300 pt-8">
          <h2 className="text-2xl font-semibold text-base-content">Terms of Use</h2>

          <section className="space-y-2">
            <h3 className="text-xl font-semibold text-base-content">1. Account Security</h3>
            <p className="leading-7 text-base-content/80">
              To buy certain loot, you might need to create an account.
            </p>
            <ul className="list-disc space-y-2 pl-6 leading-7 text-base-content/80">
              <li>You are responsible for keeping your password a secret.</li>
              <li>If your account is &quot;compromised,&quot; let us know immediately.</li>
              <li>We reserve the right to &quot;ban&quot; or suspend accounts that engage in fraudulent activity.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-xl font-semibold text-base-content">2. Fair Play (Anti-Bot Policy)</h3>
            <p className="leading-7 text-base-content/80">We want a fair experience for all gamers.</p>
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
            <h3 className="text-xl font-semibold text-base-content">3. Product Pricing & Errors</h3>
            <p className="leading-7 text-base-content/80">
              We try to be 100% accurate, but sometimes &quot;glitches&quot; happen.
            </p>
            <ul className="list-disc space-y-2 pl-6 leading-7 text-base-content/80">
              <li>
                If an item is listed at an incorrect price due to a typo or system error, we have the right to cancel
                the order and refund you.
              </li>
              <li>Product colors and images may vary slightly depending on your mobile screen settings.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-xl font-semibold text-base-content">4. Intellectual Property</h3>
            <p className="leading-7 text-base-content/80">
              Everything you see here, the logos, the &quot;Funzies&quot; name, the code, and the custom graphics,
              belongs to us or our partners.
            </p>
            <p className="leading-7 text-base-content/80">
              Do not &quot;ninja&quot; our assets for your own commercial use without permission.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-xl font-semibold text-base-content">5. Digital Content</h3>
            <p className="leading-7 text-base-content/80">If you purchase digital codes or downloadable content:</p>
            <ul className="list-disc space-y-2 pl-6 leading-7 text-base-content/80">
              <li>These items are usually &quot;Single-Use&quot; and tied to your specific account or platform.</li>
              <li>
                Once a digital code is &quot;revealed&quot; or sent, it is generally non-refundable (see our Refund
                Policy for details).
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-xl font-semibold text-base-content">6. User-Generated Content</h3>
            <p className="leading-7 text-base-content/80">
              If you post a review or upload a photo of your setup:
            </p>
            <ul className="list-disc space-y-2 pl-6 leading-7 text-base-content/80">
              <li>Keep it &quot;GG&quot; (Good Game). No hate speech, toxicity, or spam.</li>
              <li>By posting, you give us permission to show off your content on our site/socials.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-xl font-semibold text-base-content">7. Changes to the Rules</h3>
            <p className="leading-7 text-base-content/80">
              We may update these terms as we &quot;level up&quot; our shop. We will post the &quot;Patch Notes&quot;
              (updates) right here.
            </p>
            <p className="leading-7 text-base-content/80">
              Questions:{" "}
              <a className="link link-primary" href="mailto:legal@funziescollection.com">
                legal@funziescollection.com
              </a>
            </p>
          </section>
        </section>
      </ThemedSurface>
    </AppLayout>
  );
}
