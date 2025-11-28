import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { MessageSquare, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface PlaceholderProps {
  title: string;
  description: string;
  icon?: string;
}

export default function Placeholder({ title, description, icon = "📄" }: PlaceholderProps) {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4">
        <div className="text-center max-w-md space-y-8">
          <div className="text-6xl">{icon}</div>

          <div>
            <h1 className="text-3xl font-bold text-foreground">{title}</h1>
            <p className="text-muted-foreground mt-2">{description}</p>
          </div>

          <div className="bg-muted/50 border border-border rounded-lg p-6 text-left">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              To build this page:
            </h3>
            <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
              <li>Tell us what features you need on this page</li>
              <li>Share any design preferences or requirements</li>
              <li>We'll build it for you automatically</li>
            </ol>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/">
              <Button variant="outline" className="w-full sm:w-auto">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <Link to="/listings">
              <Button className="w-full sm:w-auto">Browse Items</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
