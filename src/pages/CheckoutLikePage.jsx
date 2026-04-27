import AppLayout from "../components/AppLayout";
import ThemedSurface from "../components/ThemedSurface";
import ThemedTextField from "../components/ThemedTextField";

export default function CheckoutLikePage({ title, description, actionText }) {
  return (
    <AppLayout title={title} description={description}>
      <ThemedSurface className="p-6 space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <ThemedTextField label="Name" placeholder="Jane Doe" />
          <ThemedTextField label="Email" type="email" placeholder="name@email.com" />
          <ThemedTextField className="md:col-span-2" label="Address" placeholder="Street, city, zip code" />
        </div>
        <button type="button" className="btn btn-primary">{actionText}</button>
      </ThemedSurface>
    </AppLayout>
  );
}

