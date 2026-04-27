import AppLayout from "../components/AppLayout";
import Accordion from "../components/Accordion";
import SupportHelpSection from "../components/SupportHelpSection";
import ThemedSurface from "../components/ThemedSurface";
import { usePublicSettings } from "../hooks/usePublicSettings";
import { getContentOverrideText } from "../lib/contentOverrides";

const ACCESSIBILITY_ITEMS = [
  {
    id: "our-commitment",
    title: "Our commitment",
    content: (
      <>
        <p className="leading-7 text-base-content/80">
          We want our storefront to work well for gamers and collectors who use screen readers, voice control,
          keyboard-only navigation, high zoom, or other assistive tools. Accessibility is not a one-time patch; we treat it
          as ongoing work alongside design and engineering.
        </p>
        <p className="leading-7 text-base-content/80">
          <strong className="text-base-content">Conformance goal:</strong> We aim to meet the Web Content Accessibility
          Guidelines (WCAG) 2.1 Level AA for our web experience. We are still improving, so you may occasionally run into
          gaps; when you do, we want to hear from you.
        </p>
      </>
    ),
  },
  {
    id: "what-we-focus-on",
    title: "What we focus on",
    content: (
      <>
        <p className="leading-7 text-base-content/80">To keep the experience fair for every player, we prioritize:</p>
        <ul className="list-disc space-y-2 pl-6 leading-7 text-base-content/80">
          <li>
            <strong className="text-base-content">Readable content:</strong> Clear typography, sensible heading structure, and
            text that does not rely on color alone to convey meaning.
          </li>
          <li>
            <strong className="text-base-content">Keyboard and focus:</strong> Logical tab order, visible focus indicators,
            and interactive controls that can be used without a mouse where technically possible.
          </li>
          <li>
            <strong className="text-base-content">Mobile and zoom:</strong> Layouts that remain usable when you increase text
            size or zoom the page on a phone or tablet.
          </li>
          <li>
            <strong className="text-base-content">Theme choice:</strong> Light and dark modes so you can pick contrast that
            works for your eyes and environment.
          </li>
          <li>
            <strong className="text-base-content">Forms and errors:</strong> Labels tied to inputs and clear feedback when
            something needs your attention (for example, checkout or contact flows).
          </li>
          <li>
            <strong className="text-base-content">Images and media:</strong> Meaningful alternative text for informative
            images where we control the markup; decorative images handled so assistive tech can skip them appropriately.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "how-we-test",
    title: "How we test",
    content: (
      <>
        <p className="leading-7 text-base-content/80">
          We combine automated checks with manual passes using common setups, for example:
        </p>
        <ul className="list-disc space-y-2 pl-6 leading-7 text-base-content/80">
          <li>Keyboard-only navigation through search, cart, and primary flows.</li>
          <li>Screen readers such as NVDA, JAWS, or VoiceOver on recent browser versions.</li>
          <li>Zoom and text-scaling on desktop and mobile viewports.</li>
        </ul>
        <p className="leading-7 text-base-content/80">
          Results can vary by browser, operating system, and assistive technology version. If something fails in your setup,
          the details you send help us reproduce and fix it faster.
        </p>
      </>
    ),
  },
  {
    id: "known-limitations",
    title: "Known limitations",
    content: (
      <p className="leading-7 text-base-content/80">
        Some third-party tools (for example, payment providers, maps, or embedded players) are not fully under our control.
        We choose partners with strong security and usability track records and report accessibility issues to them when we
        find them. If a blocker comes from a third party, we will explain what we can do on our side and escalate where
        possible.
      </p>
    ),
  },
];

export default function AccessibilityPage() {
  const settings = usePublicSettings(["content.page.accessibility"]);
  const override = getContentOverrideText(settings.values["content.page.accessibility"]);

  return (
    <AppLayout
      title="Accessibility"
      description="Everyone deserves a smooth path from browsing to checkout. Here is how Funzies Collection approaches accessibility, what we are improving, and how to reach us if something gets in your way."
    >
      <div className="grid gap-6">
        <ThemedSurface className="p-6">
          {override ? (
            <div className="whitespace-pre-wrap leading-7 text-base-content/80">{override}</div>
          ) : (
            <Accordion items={ACCESSIBILITY_ITEMS} />
          )}
        </ThemedSurface>

        <SupportHelpSection />
      </div>
    </AppLayout>
  );
}
