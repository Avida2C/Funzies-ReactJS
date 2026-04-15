import AppLayout from "../components/AppLayout";

export default function LegalPage({ title, body }) {
  return (
    <AppLayout title={title} description={`Legal information for ${title.toLowerCase()}.`}>
      <section className="bg-base-100 rounded-box shadow p-6">
        <p className="leading-7 text-base-content/80">{body}</p>
      </section>
    </AppLayout>
  );
}

