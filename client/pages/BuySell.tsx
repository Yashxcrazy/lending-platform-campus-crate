import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useListings } from "@/hooks/useAPI";
import { Search, Filter, Star, MapPin, Package } from "lucide-react";

export default function BuySell() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);

  const { data: listingsData, isLoading, error } = useListings(
    selectedCategory,
    search,
    0,
    500,
    page
  );

  const listings = listingsData?.data || [];

  const categories = [
    "Electronics",
    "Books",
    "Sports Equipment",
    "Tools",
    "Musical Instruments",
    "Furniture",
    "Appliances",
    "Other",
  ];

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
            <h1 className="page-title mb-4">Buy Items</h1>
            <p className="page-subtitle max-w-2xl mx-auto">
              Browse and purchase items from other students. Great deals, trusted sellers.
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

          {/* Categories */}
          {showFilters && (
            <div className="glass-card p-6 mb-8 animate-in fade-in">
              <h3 className="text-white font-semibold mb-4">Categories</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(selectedCategory === cat ? "" : cat)}
                    className={`px-4 py-2 rounded-lg transition ${
                      selectedCategory === cat
                        ? "bg-cyan-500 text-white"
                        : "bg-white/10 text-gray-300 hover:bg-white/20"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Listings Grid */}
      <section className="py-12 px-4">
        <div className="container-center max-w-6xl">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-400">Loading items...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 glass-card p-8">
              <Package className="w-12 h-12 text-cyan-400/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Unable to Load Items
              </h3>
              <p className="text-gray-400 mb-4">
                We're having trouble connecting to the server. Please try again.
              </p>
              <Button onClick={() => window.location.reload()} className="btn-glow-cyan">
                Retry
              </Button>
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-12 glass-card p-8">
              <Package className="w-12 h-12 text-cyan-400/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                No Items Found
              </h3>
              <p className="text-gray-400">
                Try adjusting your filters or search terms.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing: any) => (
                <Link
                  key={listing._id || listing.id}
                  to={`/item/${listing._id || listing.id}`}
                  className="group glass-card overflow-hidden hover:border-cyan-400/50 transition"
                >
                  {listing.images?.[0] && (
                    <div className="h-48 bg-gray-700 overflow-hidden relative">
                      <img
                        src={listing.images[0]}
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-white font-semibold mb-2 line-clamp-2">
                      {listing.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                      {listing.description}
                    </p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-cyan-400 font-bold">
                        ${listing.price || listing.dailyRate * 30}
                      </span>
                      {listing.owner?.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-gray-300">
                            {listing.owner.rating.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                    {listing.location?.address && (
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">{listing.location.address}</span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
