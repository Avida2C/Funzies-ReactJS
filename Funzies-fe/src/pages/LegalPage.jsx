import AppLayout from "../components/AppLayout";
import ThemedSurface from "../components/ThemedSurface";

export default function LegalPage({ title, body }) {
  return (
    <AppLayout title={title} description={`Legal information for ${title.toLowerCase()}.`}>
      <ThemedSurface className="p-6">
        <p className="leading-7 text-base-content/80">{body}</p>
      </ThemedSurface>
    </AppLayout>
  );
}

