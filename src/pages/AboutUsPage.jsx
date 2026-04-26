import AppLayout from "../components/AppLayout";
import ThemedSurface from "../components/ThemedSurface";

export default function AboutUsPage() {
  return (
    <AppLayout
      title="About Funzies Collection"
      description="Built by Gamers. For the Community."
    >
      <div className="grid gap-6">
        <ThemedSurface className="p-6 space-y-3">
          <h2 className="text-xl font-semibold text-base-content">The &quot;Spawn Point&quot;</h2>
          <p className="leading-7 text-base-content/80">
            Funzies Collection did not start in a boardroom; it started in a Discord call. We were tired of
            &quot;out of stock&quot; notifications, overpriced scalpers, and shops that did not know the difference between a
            membrane and a mechanical keyboard. We decided to build the shop we wanted to buy from.
          </p>
        </ThemedSurface>

        <ThemedSurface className="p-6 space-y-3">
          <h2 className="text-xl font-semibold text-base-content">Our &quot;Main Quest&quot;</h2>
          <p className="leading-7 text-base-content/80">
            Our goal is simple: Zero Friction. Zero &quot;Sus.&quot; We curate the best tech, apparel, and collectibles so
            you can skip the research and get straight to the gameplay. If it is on our site, it has been vetted by
            someone who actually plays.
          </p>
        </ThemedSurface>

        <ThemedSurface className="p-6 space-y-4">
          <h2 className="text-xl font-semibold text-base-content">The Funzies Code</h2>
          <ul className="list-disc space-y-2 pl-6 leading-7 text-base-content/80">
            <li>
              <strong className="text-base-content">Authenticity First:</strong> No clones, no fakes, no &quot;grey market&quot; nonsense.
            </li>
            <li>
              <strong className="text-base-content">Player Support:</strong> Our support team does not use scripts. If you have a
              problem, you are talking to a human who knows their way around a PC and a console.
            </li>
            <li>
              <strong className="text-base-content">Community Driven:</strong> We do not just sell gear; we are part of the scene.
              A portion of our proceeds goes back into supporting indie devs and local grassroots tournaments.
            </li>
          </ul>
        </ThemedSurface>

        <ThemedSurface className="p-6 space-y-4">
          <h2 className="text-xl font-semibold text-base-content">Why Trust Us?</h2>
          <p className="leading-7 text-base-content/80">
            We know that buying gear online requires a leap of faith. That is why we have implemented:
          </p>
          <ul className="list-disc space-y-2 pl-6 leading-7 text-base-content/80">
            <li>
              <strong className="text-base-content">Verified Tech:</strong> Every hardware line is tested for compatibility and performance.
            </li>
            <li>
              <strong className="text-base-content">Secure Loot:</strong> From our warehouse to your door, your package is tracked and insured.
            </li>
            <li>
              <strong className="text-base-content">Transparent Pricing:</strong> No hidden &quot;boss-fight&quot; fees at checkout.
            </li>
          </ul>
        </ThemedSurface>

        <ThemedSurface className="p-6 space-y-4">
          <h2 className="text-xl font-semibold text-base-content">Let&apos;s Connect</h2>
          <p className="leading-7 text-base-content/80">
            Want to see what we&apos;re playing? Or maybe you have a suggestion for the next drop?
          </p>
          <ul className="space-y-2 leading-7 text-base-content/80">
            <li>
              <strong className="text-base-content">Follow the Journey:</strong> Social Media Links
            </li>
            <li>
              <strong className="text-base-content">Join the Guild:</strong> Newsletter Signup
            </li>
          </ul>
        </ThemedSurface>
      </div>
    </AppLayout>
  );
}
