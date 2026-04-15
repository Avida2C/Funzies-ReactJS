import { Link } from "react-router-dom";
import AppLayout from "../components/AppLayout";

export default function NotFoundPage() {
  return (
    <AppLayout title="404" description="The requested page was not found.">
      <section className="bg-base-100 rounded-box shadow p-8 text-center">
        <p className="text-lg mb-4">This route does not exist in the app.</p>
        <Link className="btn btn-primary" to="/">Back to home</Link>
      </section>
    </AppLayout>
  );
}

