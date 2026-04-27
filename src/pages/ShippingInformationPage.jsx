import { Link } from "react-router-dom";
import Accordion from "../components/Accordion";
import AppLayout from "../components/AppLayout";
import SupportHelpSection from "../components/SupportHelpSection";
import ThemedSurface from "../components/ThemedSurface";
import { usePublicSettings } from "../hooks/usePublicSettings";
import { getContentOverrideText } from "../lib/contentOverrides";

const SHIPPING_ACCORDION_ITEMS = [
  {
    id: "order-processing",
    title: "Order processing",
    content: (
      <p className="leading-7 text-base-content/80">
        Most in-stock orders are processed within 1 to 2 business days (Monday through Friday, excluding public holidays).
        Pre-orders and limited drops ship on or shortly after the stated release date. You will receive a confirmation
        email when your order is placed and another when it leaves our warehouse.
      </p>
    ),
  },
  {
    id: "delivery-times-regions",
    title: "Delivery times & regions",
    content: (
      <>
        <p className="leading-7 text-base-content/80">
          Estimated delivery depends on your address, carrier, and whether the item ships from our main hub or a partner
          facility. These ranges are guides only and are not guaranteed:
        </p>
        <ul className="list-disc space-y-2 pl-6 leading-7 text-base-content/80">
          <li>
            <strong className="text-base-content">Domestic (example):</strong> approximately 2 to 5 business days after
            dispatch.
          </li>
          <li>
            <strong className="text-base-content">EU neighbors (example):</strong> approximately 3 to 7 business days after
            dispatch.
          </li>
          <li>
            <strong className="text-base-content">International:</strong> approximately 5 to 14 business days after dispatch,
            subject to customs.
          </li>
        </ul>
        <p className="leading-7 text-base-content/80">
          Rural or remote areas, carrier backlogs, weather, and customs can add time. We will share tracking as soon as your
          package is on the move.
        </p>
      </>
    ),
  },
  {
    id: "carriers-tracking",
    title: "Carriers & tracking",
    content: (
      <p className="leading-7 text-base-content/80">
        We ship with trusted carriers. When your order ships, you will get a tracking link by email. Use that link for the
        most up-to-date delivery estimate. If tracking has not updated for several business days, contact us and we will
        help investigate.
      </p>
    ),
  },
  {
    id: "shipping-costs",
    title: "Shipping costs",
    content: (
      <p className="leading-7 text-base-content/80">
        Shipping fees are calculated at checkout based on destination, weight, dimensions, and service level. Free or
        discounted shipping may apply during promotions; any active offer will be shown before you pay.
      </p>
    ),
  },
  {
    id: "international-duties-taxes",
    title: "International orders, duties & taxes",
    content: (
      <p className="leading-7 text-base-content/80">
        Orders shipped outside your country may be subject to import duties, taxes, or brokerage fees charged by customs or
        the carrier. Those charges are the buyer&apos;s responsibility unless we explicitly state otherwise at checkout. We
        cannot control customs processing times.
      </p>
    ),
  },
  {
    id: "address-accuracy-po-boxes",
    title: "Address accuracy & PO boxes",
    content: (
      <p className="leading-7 text-base-content/80">
        Please double-check your shipping address before submitting your order. Some carriers cannot deliver to P.O. boxes
        for certain products (for example, high-value or oversized items). If we cannot ship to the address you provided, we
        will contact you to arrange an alternative.
      </p>
    ),
  },
  {
    id: "damaged-lost-refused",
    title: "Damaged, lost, or refused delivery",
    content: (
      <>
        <p className="leading-7 text-base-content/80">
          If your package arrives damaged, or if tracking shows delivered but you did not receive it, reach out promptly with
          your order number and photos if applicable. For insured shipments, we will work with you and the carrier to resolve
          the issue. Packages returned to us as undeliverable may be refunded minus shipping and restocking where applicable,
          per our return policy.
        </p>
        <p className="leading-7 text-base-content/80">
          For coverage on high-value orders, see also{" "}
          <Link to="/purchase-protection" className="link link-primary">
            Purchase Protection
          </Link>
          .
        </p>
      </>
    ),
  },
];

export default function ShippingInformationPage() {
  const settings = usePublicSettings(["content.page.shipping_information"]);
  const override = getContentOverrideText(settings.values["content.page.shipping_information"]);

  return (
    <AppLayout
      title="Shipping Information"
      description="From our warehouse to your setup: how we pack, ship, and track your Funzies Collection orders."
    >
      <div className="grid gap-6">
        <ThemedSurface className="p-6">
          {override ? (
            <div className="whitespace-pre-wrap leading-7 text-base-content/80">{override}</div>
          ) : (
            <Accordion items={SHIPPING_ACCORDION_ITEMS} />
          )}
        </ThemedSurface>

        <SupportHelpSection />
      </div>
    </AppLayout>
  );
}
