import AppLayout from "../components/AppLayout";
import ThemedSurface from "../components/ThemedSurface";

export default function CheckoutLikePage({ title, description, actionText }) {
  return (
    <AppLayout title={title} description={description}>
      <ThemedSurface className="p-6 space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="form-control">
            <span className="label-text">Name</span>
            <input className="input input-bordered" placeholder="Jane Doe" />
          </label>
          <label className="form-control">
            <span className="label-text">Email</span>
            <input className="input input-bordered" placeholder="name@email.com" />
          </label>
          <label className="form-control md:col-span-2">
            <span className="label-text">Address</span>
            <input className="input input-bordered" placeholder="Street, city, zip code" />
          </label>
        </div>
        <button type="button" className="btn btn-primary">{actionText}</button>
      </ThemedSurface>
    </AppLayout>
  );
}

