import { useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Zap } from "lucide-react";

export default function BuySell() {
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-12 px-4">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        </div>

        <div className="container-center max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="page-title mb-4">Buy and Sell Items</h1>
            <p className="page-subtitle max-w-2xl mx-auto">
              Browse items for sale from other students.
            </p>
          </div>

          {/* Search Bar */}
          <div className="flex gap-4 flex-col md:flex-row mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400/50" />
              <Input
                placeholder="Search items for sale..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 py-6 glass-card border-cyan-400/30 bg-white/5 text-white placeholder:text-gray-400"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-glow-cyan flex items-center gap-2"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>
        </div>
      </section>

      {/* Listings Grid */}
      <section className="py-12 px-4">
        <div className="container-center max-w-6xl">
          <div className="text-center py-12 glass-card p-12">
            <Zap className="w-12 h-12 text-cyan-400/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Coming Soon
            </h3>
            <p className="text-gray-400">
              The buy and sell marketplace is under construction.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
