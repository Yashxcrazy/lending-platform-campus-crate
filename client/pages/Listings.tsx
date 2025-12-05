import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useListings } from "@/hooks/useAPI";
import {
  Search,
  Filter,
  ChevronDown,
  Star,
  MapPin,
  Calendar,
  Zap,
} from "lucide-react";

const categories = [
  { id: "books", name: "Books", emoji: "📚" },
  { id: "lab-equipment", name: "Lab Equipment", emoji: "🔬" },
  { id: "calculators", name: "Calculators", emoji: "🧮" },
  { id: "sports-gear", name: "Sports Gear", emoji: "⚽" },
  { id: "costumes", name: "Costumes", emoji: "🎭" },
  { id: "electronics", name: "Electronics", emoji: "💻" },
  { id: "tools", name: "Tools", emoji: "🔧" },
];

export default function Listings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const { data: listingsData, isLoading, error } = useListings(
    selectedCategory,
    search,
    priceRange[0],
    priceRange[1],
    page
  );

  const listings = listingsData?.data || [];
  const totalPages = listingsData?.totalPages || 1;

  useEffect(() => {
    const newParams = new URLSearchParams();
    if (search) newParams.set("search", search);
    if (selectedCategory) newParams.set("category", selectedCategory);
    setSearchParams(newParams);
  }, [search, selectedCategory, setSearchParams]);

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
            <h1 className="marvel-title mb-4">Browse Available Items</h1>
            <p className="marvel-subtitle max-w-2xl mx-auto">
              Discover thousands of items available for rent from fellow students.
              Save money, help others, and build your reputation.
            </p>
          </div>

          {/* Search Bar */}
          <div className="flex gap-4 flex-col md:flex-row mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400/50" />
              <Input
                placeholder="Search items..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
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

          {/* Filters Panel */}
          {showFilters && (
            <div className="glass-card p-6 mb-8 space-y-6 animate-in fade-in">
              {/* Categories */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  Categories
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(
                          selectedCategory === cat.id ? "" : cat.id
                        );
                        setPage(1);
                      }}
                      className={`p-3 rounded-lg transition-all ${
                        selectedCategory === cat.id
                          ? "neon-border-cyan bg-cyan-400/20"
                          : "glass-card border-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className="text-2xl mb-2">{cat.emoji}</div>
                      <div className="text-sm font-medium text-white">
                        {cat.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  Daily Rate Range
                </h3>
                <div className="space-y-4">
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={priceRange[0]}
                    onChange={(e) => {
                      setPriceRange([Number(e.target.value), priceRange[1]]);
                      setPage(1);
                    }}
                    className="w-full"
                  />
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={priceRange[1]}
                    onChange={(e) => {
                      setPriceRange([priceRange[0], Number(e.target.value)]);
                      setPage(1);
                    }}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Active Filters */}
          {(search || selectedCategory) && (
            <div className="flex flex-wrap gap-2 mb-8">
              {search && (
                <div className="glass-card px-4 py-2 flex items-center gap-2">
                  <span className="text-sm">Search: {search}</span>
                  <button
                    onClick={() => setSearch("")}
                    className="text-cyan-400 hover:text-cyan-300"
                  >
                    ✕
                  </button>
                </div>
              )}
              {selectedCategory && (
                <div className="glass-card px-4 py-2 flex items-center gap-2">
                  <span className="text-sm">
                    Category: {selectedCategory}
                  </span>
                  <button
                    onClick={() => setSelectedCategory("")}
                    className="text-cyan-400 hover:text-cyan-300"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Error State */}
      {error && (
        <section className="py-8 px-4">
          <div className="container-center max-w-6xl">
            <div className="glass-card border border-red-500/30 bg-red-500/10 p-8 rounded-lg flex items-start gap-4">
              <div className="text-red-400 text-2xl flex-shrink-0">⚠️</div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Unable to Load Items
                </h3>
                <p className="text-gray-300 mb-4">
                  We're having trouble connecting to the server. Please check your internet connection and try again.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="btn-glow-cyan text-sm"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Listings Grid */}
      <section className="py-12 px-4">
        <div className="container-center max-w-6xl">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="text-cyan-400 text-lg">Loading items...</div>
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-12 glass-card p-12">
              <Zap className="w-12 h-12 text-cyan-400/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                No items found
              </h3>
              <p className="text-gray-400">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {listings.map((listing: any) => (
                  <Link
                    key={listing.id}
                    to={`/listing/${listing.id}`}
                    className="group"
                  >
                    <div className="glass-card-hover overflow-hidden flex flex-col h-full">
                      {/* Image */}
                      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600/20 to-purple-600/20 aspect-video">
                        {listing.images?.[0] ? (
                          <img
                            src={listing.images[0]}
                            alt={listing.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl">
                            📦
                          </div>
                        )}
                        <div className="absolute top-3 right-3 glass-card px-3 py-1 rounded-full">
                          <span className="text-xs font-semibold text-cyan-300">
                            ₹{listing.dailyRate}/day
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-4 flex flex-col">
                        <h3 className="font-semibold text-white text-lg group-hover:text-cyan-300 transition-colors line-clamp-2 mb-2">
                          {listing.title}
                        </h3>

                        <p className="text-sm text-gray-400 line-clamp-2 mb-4 flex-1">
                          {listing.description}
                        </p>

                        {/* Details */}
                        <div className="space-y-2 mb-4 text-sm">
                          <div className="flex items-center gap-2 text-gray-400">
                            <MapPin className="w-4 h-4 text-cyan-400" />
                            <span>{listing.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-400">
                            <Calendar className="w-4 h-4 text-cyan-400" />
                            <span>Available now</span>
                          </div>
                        </div>

                        {/* Lender Rating */}
                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-sm font-semibold text-white">
                              4.8
                            </span>
                            <span className="text-xs text-gray-400">(12)</span>
                          </div>
                          <Button
                            size="sm"
                            className="btn-glow-cyan"
                            onClick={(e) => {
                              e.preventDefault();
                            }}
                          >
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="btn-glow-blue disabled:opacity-50"
                  >
                    ← Previous
                  </button>
                  <span className="text-white">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="btn-glow-blue disabled:opacity-50"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
