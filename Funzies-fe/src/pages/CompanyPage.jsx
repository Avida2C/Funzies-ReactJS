import { Link } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import ThemedSurface from "../components/ThemedSurface";

export default function CompanyPage() {
  return (
    <AppLayout
      title="Company"
      description="Funzies Collection: Leveling Up the Shopping Experience."
    >
      <div className="grid gap-6">
        <ThemedSurface className="p-6 space-y-3">
          <h2 className="text-2xl font-semibold text-base-content">Funzies Collection: Leveling Up the Shopping Experience.</h2>
          <p className="leading-7 text-base-content/80">
            This page is the official identity card of Funzies Collection - where gamer culture and trusted commerce meet.
          </p>
        </ThemedSurface>

        <ThemedSurface className="p-6 space-y-3">
          <h2 className="text-xl font-semibold text-base-content">Our Mission</h2>
          <p className="leading-7 text-base-content/80">
            Founded in [Year], Funzies Collection was built by gamers, for gamers. We realized that finding authentic gear,
            rare collectibles, and reliable hardware should not feel like a &quot;boss fight.&quot; Our mission is to provide
            a curated, high-trust marketplace where every player can find their next favorite piece of loot.
          </p>
        </ThemedSurface>

        <ThemedSurface className="p-6 space-y-3">
          <h2 className="text-xl font-semibold text-base-content">Why &quot;Funzies&quot;?</h2>
          <p className="leading-7 text-base-content/80">
            Because shopping should be fun. We have stripped away the &quot;sus&quot; listings and the bot-dominated drops
            to create a shop that feels like your favorite local gaming lounge - just on your phone.
          </p>
        </ThemedSurface>

        <ThemedSurface className="p-6 space-y-4">
          <h2 className="text-xl font-semibold text-base-content">Our Partners</h2>
          <p className="leading-7 text-base-content/80">
            We work with the biggest names in the industry to ensure that every product we sell is 100% authentic. We are an
            authorized reseller for major gaming peripherals and lifestyle brands.
          </p>
        </ThemedSurface>

        <ThemedSurface className="p-6 space-y-4">
          <h2 className="text-xl font-semibold text-base-content">Join the Party</h2>
          <p className="leading-7 text-base-content/80">
            Interested in working with us or becoming a partner?
          </p>
          <ul className="list-disc space-y-2 pl-6 leading-7 text-base-content/80">
            <li>
              <strong className="text-base-content">Careers:</strong> View our open &quot;quests&quot; at{" "}
              <Link className="link link-primary" to="/careers">
                Careers Page
              </Link>
              .
            </li>
            <li>
              <strong className="text-base-content">Partnerships:</strong> Reach out to{" "}
              <a className="link link-primary" href="mailto:partners@funziescollection.com">
                partners@funziescollection.com
              </a>
              .
            </li>
          </ul>
        </ThemedSurface>

        <ThemedSurface className="p-6 space-y-4 order-last md:order-none">
          <h2 className="text-xl font-semibold text-base-content">Official Company Details</h2>
          <p className="leading-7 text-base-content/80">
            For partners, vendors, and legal inquiries, here are our registered business details:
          </p>
          <ul className="space-y-2 leading-7 text-base-content/80">
            <li>
              <strong className="text-base-content">Legal Entity Name:</strong> Funzies Collection LLC (or Ltd.)
            </li>
            <li>
              <strong className="text-base-content">Registered Office:</strong> [Insert Street Address, City, Zip Code]
            </li>
            <li>
              <strong className="text-base-content">Company Registration Number:</strong> [Insert Number]
            </li>
            <li>
              <strong className="text-base-content">Tax/VAT Identification:</strong> [Insert Number]
            </li>
            <li>
              <strong className="text-base-content">Contact Email:</strong>{" "}
              <a className="link link-primary" href="mailto:corporate@funziescollection.com">
                corporate@funziescollection.com
              </a>
            </li>
          </ul>
        </ThemedSurface>
      </div>
    </AppLayout>
  );
}
