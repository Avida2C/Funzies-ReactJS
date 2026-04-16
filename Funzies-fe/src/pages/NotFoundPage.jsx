import { Link } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import ThemedSurface from "../components/ThemedSurface";

export default function NotFoundPage() {
  return (
    <AppLayout title="404" description="The requested page was not found.">
      <ThemedSurface className="p-8 text-center">
        <p className="text-lg mb-4">This route does not exist in the app.</p>
        <Link className="btn btn-primary" to="/">Back to home</Link>
      </ThemedSurface>
    </AppLayout>
  );
}

