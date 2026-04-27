import { Link } from "react-router-dom";
import Accordion from "../components/Accordion";
import AppLayout from "../components/AppLayout";
import SupportHelpSection from "../components/SupportHelpSection";
import ThemedSurface from "../components/ThemedSurface";
import { usePublicSettings } from "../hooks/usePublicSettings";
import { getContentOverrideText } from "../lib/contentOverrides";

const RETURN_REFUND_ACCORDION_ITEMS = [
  {
    id: "eligibility",
    title: "Eligibility",
    content: (
      <>
        <p className="leading-7 text-base-content/80">
          You may request a return for eligible products within <strong className="text-base-content">30 days</strong> of
          delivery, unless a different window is stated on the product page (for example, final sale or limited drops).
          Items must be:
        </p>
        <ul className="list-disc space-y-2 pl-6 leading-7 text-base-content/80">
          <li>Unused, unopened, or in original condition where applicable.</li>
          <li>In original packaging with all accessories, manuals, and labels included.</li>
          <li>Accompanied by proof of purchase (order number or receipt).</li>
        </ul>
      </>
    ),
  },
  {
    id: "non-returnable",
    title: "Non-returnable items",
    content: (
      <>
        <p className="leading-7 text-base-content/80">
          Some products cannot be returned for hygiene, licensing, or fraud-prevention reasons, including when marked final
          sale. Examples may include:
        </p>
        <ul className="list-disc space-y-2 pl-6 leading-7 text-base-content/80">
          <li>Opened software, digital codes, or downloadable content once delivered or revealed.</li>
          <li>Earbuds, in-ear monitors, or similar items if hygiene seals are broken (where required by law).</li>
          <li>Collectibles or limited editions sold as &quot;as-is&quot; on the product page.</li>
          <li>Gift cards or store credit.</li>
        </ul>
        <p className="leading-7 text-base-content/80">If you are unsure, contact support before opening the product.</p>
      </>
    ),
  },
  {
    id: "start-return",
    title: "How to start a return",
    content: (
      <ol className="list-decimal space-y-2 pl-6 leading-7 text-base-content/80">
        <li>
          Contact us through{" "}
          <Link to="/contact" className="link link-primary">
            Contact
          </Link>{" "}
          or the{" "}
          <Link to="/help-center" className="link link-primary">
            Help Center
          </Link>{" "}
          with your order number and reason for return.
        </li>
        <li>Wait for a return authorization and instructions (including the return address and any RMA reference).</li>
        <li>Pack the item securely. We are not responsible for damage caused by inadequate return packaging.</li>
        <li>Ship the item using a trackable method unless we provide a prepaid label.</li>
      </ol>
    ),
  },
  {
    id: "shipping-restocking",
    title: "Return shipping & restocking",
    content: (
      <p className="leading-7 text-base-content/80">
        Unless the return is due to our error or a defective product covered under{" "}
        <Link to="/purchase-protection" className="link link-primary">
          Purchase Protection
        </Link>
        , you may be responsible for return shipping costs. A restocking fee may apply to certain categories (for example,
        large freight items) if disclosed at checkout or on the product page.
      </p>
    ),
  },
  {
    id: "refunds",
    title: "Refunds",
    content: (
      <>
        <p className="leading-7 text-base-content/80">
          After we receive and inspect your return, we will notify you of approval or rejection. If approved, refunds are
          issued to the original payment method when possible. Processing times vary by bank or card issuer; please allow
          several business days after we issue the refund for it to appear on your statement.
        </p>
        <p className="leading-7 text-base-content/80">
          Original shipping charges are generally non-refundable unless we sent the wrong item or the product was defective
          or not as described.
        </p>
      </>
    ),
  },
  {
    id: "exchanges",
    title: "Exchanges",
    content: (
      <p className="leading-7 text-base-content/80">
        Exchanges depend on stock availability. In many cases we will process a return and place a new order for the item
        you want. If you need a different size or variant, contact support and we will outline the fastest option.
      </p>
    ),
  },
  {
    id: "damaged-incorrect",
    title: "Damaged or incorrect items",
    content: (
      <p className="leading-7 text-base-content/80">
        If your order arrives damaged or is not what you ordered, contact us right away with photos and your order number.
        We will prioritize a replacement, exchange, or refund in line with our policies and{" "}
        <Link to="/purchase-protection" className="link link-primary">
          Purchase Protection
        </Link>
        .
      </p>
    ),
  },
  {
    id: "warranty-support",
    title: "Warranty & manufacturer support",
    content: (
      <p className="leading-7 text-base-content/80">
        Some hardware includes a manufacturer warranty. After our return window, defects may need to go through the
        manufacturer&apos;s process. We can help point you to the right channel when applicable.
      </p>
    ),
  },
];

export default function ReturnRefundPolicyPage() {
  const settings = usePublicSettings(["content.page.return_refund_policy"]);
  const override = getContentOverrideText(settings.values["content.page.return_refund_policy"]);

  return (
    <AppLayout
      title="Return & Refund Policy"
      description="We want you to love what you buy. If something is not right, this policy explains when you can return an item, how to start a request, and how refunds are processed. For defective or high-value orders, also see Purchase Protection."
    >
      <div className="grid gap-6">
        <ThemedSurface className="p-6">
          {override ? (
            <div className="whitespace-pre-wrap leading-7 text-base-content/80">{override}</div>
          ) : (
            <Accordion items={RETURN_REFUND_ACCORDION_ITEMS} />
          )}
        </ThemedSurface>

        <SupportHelpSection />
      </div>
    </AppLayout>
  );
}
