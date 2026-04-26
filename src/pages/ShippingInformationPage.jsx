import { Link } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import SupportHelpSection from "../components/SupportHelpSection";
import ThemedSurface from "../components/ThemedSurface";

export default function ShippingInformationPage() {
  return (
    <AppLayout
      title="Shipping Information"
      description="From our warehouse to your setup: how we pack, ship, and track your Funzies Collection orders."
    >
      <div className="grid gap-6">
        <ThemedSurface className="p-6 space-y-3">
          <h2 className="text-xl font-semibold text-base-content">Order processing</h2>
          <p className="leading-7 text-base-content/80">
            Most in-stock orders are processed within 1 to 2 business days (Monday through Friday, excluding public
            holidays). Pre-orders and limited drops ship on or shortly after the stated release date. You will receive a
            confirmation email when your order is placed and another when it leaves our warehouse.
          </p>
        </ThemedSurface>

        <ThemedSurface className="p-6 space-y-3">
          <h2 className="text-xl font-semibold text-base-content">Delivery times &amp; regions</h2>
          <p className="leading-7 text-base-content/80">
            Estimated delivery depends on your address, carrier, and whether the item ships from our main hub or a
            partner facility. These ranges are guides only and are not guaranteed:
          </p>
          <ul className="list-disc space-y-2 pl-6 leading-7 text-base-content/80">
            <li>
              <strong className="text-base-content">Domestic (example):</strong> approximately 2 to 5 business days after
              dispatch.
            </li>
            <li>
              <strong className="text-base-content">EU neighbors (example):</strong> approximately 3 to 7 business days
              after dispatch.
            </li>
            <li>
              <strong className="text-base-content">International:</strong> approximately 5 to 14 business days after
              dispatch, subject to customs.
            </li>
          </ul>
          <p className="leading-7 text-base-content/80">
            Rural or remote areas, carrier backlogs, weather, and customs can add time. We will share tracking as soon
            as your package is on the move.
          </p>
        </ThemedSurface>

        <ThemedSurface className="p-6 space-y-3">
          <h2 className="text-xl font-semibold text-base-content">Carriers &amp; tracking</h2>
          <p className="leading-7 text-base-content/80">
            We ship with trusted carriers. When your order ships, you will get a tracking link by email. Use that link
            for the most up-to-date delivery estimate. If tracking has not updated for several business days, contact us
            and we will help investigate.
          </p>
        </ThemedSurface>

        <ThemedSurface className="p-6 space-y-3">
          <h2 className="text-xl font-semibold text-base-content">Shipping costs</h2>
          <p className="leading-7 text-base-content/80">
            Shipping fees are calculated at checkout based on destination, weight, dimensions, and service level. Free
            or discounted shipping may apply during promotions; any active offer will be shown before you pay.
          </p>
        </ThemedSurface>

        <ThemedSurface className="p-6 space-y-3">
          <h2 className="text-xl font-semibold text-base-content">International orders, duties &amp; taxes</h2>
          <p className="leading-7 text-base-content/80">
            Orders shipped outside your country may be subject to import duties, taxes, or brokerage fees charged by
            customs or the carrier. Those charges are the buyer&apos;s responsibility unless we explicitly state
            otherwise at checkout. We cannot control customs processing times.
          </p>
        </ThemedSurface>

        <ThemedSurface className="p-6 space-y-3">
          <h2 className="text-xl font-semibold text-base-content">Address accuracy &amp; PO boxes</h2>
          <p className="leading-7 text-base-content/80">
            Please double-check your shipping address before submitting your order. Some carriers cannot deliver to P.O.
            boxes for certain products (for example, high-value or oversized items). If we cannot ship to the address you
            provided, we will contact you to arrange an alternative.
          </p>
        </ThemedSurface>

        <ThemedSurface className="p-6 space-y-3">
          <h2 className="text-xl font-semibold text-base-content">Damaged, lost, or refused delivery</h2>
          <p className="leading-7 text-base-content/80">
            If your package arrives damaged, or if tracking shows delivered but you did not receive it, reach out
            promptly with your order number and photos if applicable. For insured shipments, we will work with you and
            the carrier to resolve the issue. Packages returned to us as undeliverable may be refunded minus shipping
            and restocking where applicable, per our return policy.
          </p>
          <p className="leading-7 text-base-content/80">
            For coverage on high-value orders, see also{" "}
            <Link to="/purchase-protection" className="link link-primary">
              Purchase Protection
            </Link>
            .
          </p>
        </ThemedSurface>

        <SupportHelpSection />
      </div>
    </AppLayout>
  );
}
