import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import {
  ArrowRight,
  CheckCircle2,
  Shield,
  Users,
  Zap,
  TrendingUp,
  Smartphone,
  Lock,
  Smile,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Quick Discovery",
    description: "Find the items you need in seconds. Filter by category, price, location, and availability.",
  },
  {
    icon: Shield,
    title: "Safe & Verified",
    description: "College email verification, ratings system, and secure handover process for peace of mind.",
  },
  {
    icon: Users,
    title: "Build Community",
    description: "Rate lenders and borrowers, earn trust, and help fellow students save money.",
  },
  {
    icon: TrendingUp,
    title: "Earn Extra",
    description: "List items you're not using and earn money or barter with other students.",
  },
  {
    icon: Lock,
    title: "Transparent Pricing",
    description: "Clear daily/weekly rates with optional security deposits. No hidden charges.",
  },
  {
    icon: Smartphone,
    title: "Easy Handover",
    description: "Meet at campus locations, confirm with photos, and track everything in-app.",
  },
];

const steps = [
  {
    number: "1",
    title: "Sign Up with College Email",
    description: "Create an account and verify your college email to join our verified community.",
  },
  {
    number: "2",
    title: "Browse or List Items",
    description: "Find items you need or list items you want to share. Add photos, prices, and availability.",
  },
  {
    number: "3",
    title: "Request & Confirm",
    description: "Send a booking request, agree on dates and handover details. Both parties confirm.",
  },
  {
    number: "4",
    title: "Handover with Confidence",
    description: "Meet at a safe campus location, check condition, take photos, and you're done!",
  },
  {
    number: "5",
    title: "Return & Rate",
    description: "Return the item in agreed condition. Rate each other and build your reputation.",
  },
];

const categories = [
  { name: "Books", emoji: "📚" },
  { name: "Lab Equipment", emoji: "🔬" },
  { name: "Calculators", emoji: "🧮" },
  { name: "Sports Gear", emoji: "⚽" },
  { name: "Costumes", emoji: "🎭" },
  { name: "Electronics", emoji: "💻" },
  { name: "Tools", emoji: "🔧" },
  { name: "More", emoji: "📦" },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-white to-secondary/10 py-16 md:py-28">
        <div className="container-center max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 md:space-y-8">
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
                  Borrow, Lend, Save
                  <span className="block text-primary mt-2">Together</span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mt-4 leading-relaxed">
                  Stop buying what you'll use once. Rent lab equipment, books, calculators, costumes, and more from fellow students on campus.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/signup">
                  <Button size="lg" className="w-full sm:w-auto">
                    Start for Free <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/listings">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Browse Items
                  </Button>
                </Link>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0" />
                  <span>NITRR email verified only</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0" />
                  <span>Secure handover process</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0" />
                  <span>Rating & review system</span>
                </div>
              </div>
            </div>

            <div className="relative hidden md:block">
              <div className="relative bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl p-8 h-96 flex items-center justify-center border border-primary/20">
                <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent rounded-2xl" />
                <div className="relative text-center">
                  <div className="text-6xl mb-4">📦</div>
                  <h3 className="text-2xl font-bold text-foreground">Student-Powered</h3>
                  <p className="text-muted-foreground mt-2">Community sharing made easy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 md:py-16 border-b border-border">
        <div className="container-center max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">What Can You Borrow?</h2>
          <p className="text-center text-muted-foreground mb-10">
            Browse popular categories or explore more
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link key={cat.name} to={`/listings?category=${cat.name.toLowerCase()}`}>
                <button className="w-full p-6 bg-muted/50 hover:bg-muted rounded-xl transition-all flex flex-col items-center gap-3 hover:shadow-md">
                  <span className="text-4xl">{cat.emoji}</span>
                  <span className="font-semibold text-foreground text-sm">{cat.name}</span>
                </button>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container-center max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Why ShareHub?</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            We make borrowing and lending safe, easy, and affordable for the entire campus community.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-xl border border-border bg-white hover:shadow-lg hover:border-primary/20 transition-all"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container-center max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Five simple steps to start borrowing or sharing items with your campus community.
          </p>

          <div className="space-y-6 md:space-y-8">
            {steps.map((step, idx) => (
              <div key={idx} className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary text-primary-foreground font-bold text-lg">
                    {step.number}
                  </div>
                </div>
                <div className="pt-1">
                  <h3 className="text-lg md:text-xl font-semibold mb-2 text-foreground">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 md:py-24">
        <div className="container-center max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">Trust is Everything</h2>
              <p className="text-lg text-muted-foreground">
                We've built trust into every feature, from verified college accounts to transparent ratings.
              </p>

              <div className="space-y-4">
                {[
                  "Verified NITRR email accounts only",
                  "Transparent user ratings and reviews",
                  "Secure handover process with photo confirmation",
                  "Clear, non-refundable rental terms",
                  "Admin review system for reported items/users",
                  "Optional 2-step verification for added security",
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative hidden md:block">
              <div className="bg-gradient-to-br from-secondary/20 to-primary/20 rounded-2xl p-8 h-96 flex items-center justify-center border border-secondary/20">
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/5 to-transparent rounded-2xl" />
                <div className="relative text-center">
                  <Smile className="w-24 h-24 text-secondary/60 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-foreground">Safe & Secure</h3>
                  <p className="text-muted-foreground mt-2">For everyone in our community</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary/10 to-secondary/10 border-t border-border">
        <div className="container-center max-w-4xl text-center space-y-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Ready to Save Money & Help Others?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join hundreds of students already borrowing and lending on campus. It takes less than a minute to get started.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="px-8">
                Get Started Free <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/listings">
              <Button variant="outline" size="lg" className="px-8">
                Browse First
              </Button>
            </Link>
          </div>

          <p className="text-sm text-muted-foreground">
            No credit card required. Verified NITRR email addresses only.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-foreground-contrast py-12 border-t border-border bg-white text-muted-foreground border-t">
        <div className="container-center max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link to="/" className="hover:text-primary transition-colors">Contact</Link></li>
                <li><Link to="/" className="hover:text-primary transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/listings" className="hover:text-primary transition-colors">Browse Items</Link></li>
                <li><Link to="/how-it-works" className="hover:text-primary transition-colors">How It Works</Link></li>
                <li><Link to="/" className="hover:text-primary transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="hover:text-primary transition-colors">Help Center</Link></li>
                <li><Link to="/" className="hover:text-primary transition-colors">Safety Tips</Link></li>
                <li><Link to="/" className="hover:text-primary transition-colors">Report Issue</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link to="/" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                <li><Link to="/" className="hover:text-primary transition-colors">Prohibited Items</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 font-bold text-foreground mb-4 md:mb-0">
              <span className="text-primary text-2xl">📦</span>
              ShareHub
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 ShareHub. All rights reserved. Built for students, by students.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
