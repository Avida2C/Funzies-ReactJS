import AppLayout from "../components/AppLayout";
import ThemedSurface from "../components/ThemedSurface";

export default function PrivacyPolicyPage() {
  return (
    <AppLayout
      title="Privacy Policy"
      description="Your Data is Your Loot. At Funzies Collection, we respect your privacy. This policy explains what info we collect, why we need it, and how we keep it safe."
    >
      <ThemedSurface className="p-6 space-y-6">
        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-base-content">1. What Info Do We Collect?</h2>
          <p className="leading-7 text-base-content/80">To get your gear to your door, we collect:</p>
          <ul className="list-disc space-y-2 pl-6 leading-7 text-base-content/80">
            <li>
              <strong className="text-base-content">Identity Data:</strong> Name and username.
            </li>
            <li>
              <strong className="text-base-content">Contact Data:</strong> Email, phone number, and shipping address.
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
          <h2 className="text-xl font-semibold text-base-content">2. How We Use Your Data</h2>
          <p className="leading-7 text-base-content/80">We do not collect data just for fun. We use it to:</p>
          <ul className="list-disc space-y-2 pl-6 leading-7 text-base-content/80">
            <li>Process and ship your orders.</li>
            <li>Send you &quot;Order Shipped&quot; notifications.</li>
            <li>Prevent fraud and bot attacks.</li>
            <li>Send you optional &quot;New Drop&quot; alerts (only if you opt-in).</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-base-content">3. No Selling to Third Parties</h2>
          <p className="leading-7 text-base-content/80">
            We do not sell your personal data. We are not in the business of selling your email to random advertisers.
            We only share info with partners necessary to run the shop (like the courier delivering your package or
            our secure payment gateway).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-base-content">4. Cookies & Tracking</h2>
          <p className="leading-7 text-base-content/80">
            We use cookies to remember what is in your Cart and to keep you logged in. You can &quot;disable&quot;
            cookies in your browser settings, but the site might feel a bit &quot;laggy&quot; or forget your items.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-base-content">5. Your Rights (The &quot;Admin&quot; Controls)</h2>
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
          <h2 className="text-xl font-semibold text-base-content">6. Data Security</h2>
          <p className="leading-7 text-base-content/80">
            We use &quot;End-to-End&quot; encryption (SSL) to protect your data during checkout. Our servers are
            guarded by industry-standard firewalls to keep &quot;invaders&quot; out.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-base-content">Contact our Privacy Officer</h2>
          <p className="leading-7 text-base-content/80">Got questions about your data? Hit us up:</p>
          <p className="leading-7 text-base-content/80">
            Email:{" "}
            <a className="link link-primary" href="mailto:privacy@funziescollection.com">
              privacy@funziescollection.com
            </a>
          </p>
          <p className="leading-7 text-base-content/80">Last Updated: April 2026</p>
        </section>
      </ThemedSurface>
    </AppLayout>
  );
}
