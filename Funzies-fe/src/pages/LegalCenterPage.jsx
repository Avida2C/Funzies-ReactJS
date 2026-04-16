import { Link } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import ThemedSurface from "../components/ThemedSurface";

export default function LegalCenterPage() {
  return (
    <AppLayout
      title="Legal Center"
      description="Funzies Collection is operated with transparency and compliance in mind. Below you will find all the documentation regarding our operations, your rights, and our responsibilities."
    >
      <ThemedSurface className="p-6 space-y-6">
        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-base-content">1. Governing Law</h2>
          <p className="leading-7 text-base-content/80">
            Funzies Collection is operated out of [Your City/Country]. By using this site, you agree that any disputes
            will be handled under the jurisdiction of [Your Local State/Province] courts.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-base-content">2. Intellectual Property (IP)</h2>
          <p className="leading-7 text-base-content/80">
            All content on this site, including the &quot;Funzies&quot; brand, logos, custom graphics, and website
            code, is the property of Funzies Collection or its licensors.
          </p>
          <p className="leading-7 text-base-content/80">
            <strong className="text-base-content">Third-Party Trademarks:</strong> All game titles, console names
            (e.g., PlayStation, Xbox, Nintendo), and brand logos are the property of their respective owners and are
            used here for descriptive purposes only.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-base-content">3. Compliance & Regulatory</h2>
          <p className="leading-7 text-base-content/80">
            We comply with the following consumer protection standards:
          </p>
          <ul className="list-disc space-y-2 pl-6 leading-7 text-base-content/80">
            <li>
              <strong className="text-base-content">Data Protection:</strong> Fully compliant with [GDPR / CCPA /
              Local Privacy Laws].
            </li>
            <li>
              <strong className="text-base-content">E-Commerce Standards:</strong> We adhere to fair trade practices
              and transparent pricing.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-base-content">4. Legal Directory</h2>
          <p className="leading-7 text-base-content/80">Looking for something specific? Click a document below:</p>
          <ul className="space-y-2 leading-7 text-base-content/80">
            <li>
              <Link className="link link-primary" to="/privacy">
                Privacy Policy & Terms of Use
              </Link>{" "}
              - How we handle your data and the rules for using our site.
            </li>
            <li>
              <Link className="link link-primary" to="/accessibility">
                Accessibility Statement
              </Link>{" "}
              - Our commitment to inclusive design.
            </li>
            <li>
              <Link className="link link-primary" to="/trust-safety">
                Trust & Safety
              </Link>{" "}
              - Our anti-fraud and authenticity standards.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-base-content">Corporate Contact</h2>
          <p className="leading-7 text-base-content/80">For official legal inquiries or notices, please contact:</p>
          <p className="leading-7 text-base-content/80">
            Funzies Collection Legal Dept.
            <br />
            [Your Business Address]
            <br />
            <a className="link link-primary" href="mailto:legal@funziescollection.com">
              legal@funziescollection.com
            </a>
          </p>
        </section>
      </ThemedSurface>
    </AppLayout>
  );
}
