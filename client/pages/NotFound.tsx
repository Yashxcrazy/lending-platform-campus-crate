import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4">
        <div className="text-center max-w-md space-y-8">
          <div>
            <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
            <h2 className="text-3xl font-bold text-foreground">
              Page Not Found
            </h2>
            <p className="text-muted-foreground mt-2">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
            <Link to="/listings">
              <Button>Browse Items</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
