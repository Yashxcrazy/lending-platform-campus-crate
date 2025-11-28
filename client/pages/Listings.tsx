import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  MapPin,
  Star,
  Zap,
  ChevronDown,
  Filter,
  X,
} from "lucide-react";

// Mock data
const mockListings = [
  {
    id: "1",
    title: "Advanced Physics Textbook",
    category: "Books",
    price: 50,
    location: "Library",
    rating: 4.8,
    reviews: 12,
    image: "📚",
    owner: "Sarah Kumar",
    isFree: false,
  },
  {
    id: "2",
    title: "Scientific Calculator (Canon)",
    category: "Calculators",
    price: 100,
    location: "Hostel A",
    rating: 5,
    reviews: 8,
    image: "🧮",
    owner: "Raj Patel",
    isFree: false,
  },
  {
    id: "3",
    title: "Oscilloscope",
    category: "Lab Equipment",
    price: 200,
    location: "Engineering Lab",
    rating: 4.6,
    reviews: 5,
    image: "🔬",
    owner: "Prof. Ahmed",
    isFree: false,
  },
  {
    id: "4",
    title: "Cricket Kit (Full Set)",
    category: "Sports Gear",
    price: 150,
    location: "Sports Complex",
    rating: 4.9,
    reviews: 15,
    image: "⚽",
    owner: "Virat Singh",
    isFree: false,
  },
  {
    id: "5",
    title: "French Costume (Complete)",
    category: "Costumes",
    price: 0,
    location: "Drama Club",
    rating: 4.7,
    reviews: 6,
    image: "🎭",
    owner: "Drama Society",
    isFree: true,
  },
  {
    id: "6",
    title: "Laptop (Intel i7, 16GB RAM)",
    category: "Electronics",
    price: 250,
    location: "Hostel B",
    rating: 4.5,
    reviews: 9,
    image: "💻",
    owner: "Priya Sharma",
    isFree: false,
  },
  {
    id: "7",
    title: "Drill Machine & Toolset",
    category: "Tools",
    price: 120,
    location: "Maker Space",
    rating: 4.8,
    reviews: 11,
    image: "🔧",
    owner: "Tech Club",
    isFree: false,
  },
  {
    id: "8",
    title: "Organic Chemistry Kit",
    category: "Lab Equipment",
    price: 80,
    location: "Science Building",
    rating: 4.4,
    reviews: 7,
    image: "🔬",
    owner: "Lab Manager",
    isFree: false,
  },
];

const categories = [
  "All Items",
  "Books",
  "Lab Equipment",
  "Calculators",
  "Sports Gear",
  "Costumes",
  "Electronics",
  "Tools",
];

const locations = ["All Locations", "Library", "Hostel A", "Hostel B", "Engineering Lab", "Sports Complex", "Maker Space", "Science Building"];

export default function Listings() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Items");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [showFilters, setShowFilters] = useState(false);

  const filteredListings = useMemo(() => {
    return mockListings.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.owner.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All Items" || item.category === selectedCategory;

      const matchesLocation =
        selectedLocation === "All Locations" ||
        item.location === selectedLocation;

      const matchesPrice =
        item.price >= priceRange[0] && item.price <= priceRange[1];

      return (
        matchesSearch && matchesCategory && matchesLocation && matchesPrice
      );
    });
  }, [searchQuery, selectedCategory, selectedLocation, priceRange]);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 border-b border-border py-8 md:py-12">
        <div className="container-center max-w-6xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Browse Items</h1>
          <p className="text-muted-foreground">
            Find exactly what you need from {mockListings.length} available items
          </p>
        </div>
      </section>

      <div className="container-center max-w-6xl py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className={`lg:col-span-1 ${showFilters ? "block" : "hidden lg:block"}`}>
            <div className="space-y-6 sticky top-24">
              {/* Search */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Search
                </h3>
                <Input
                  type="text"
                  placeholder="Search items or owners..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Category Filter */}
              <div>
                <h3 className="font-semibold mb-3">Category</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === cat
                          ? "bg-primary text-primary-foreground font-medium"
                          : "hover:bg-muted text-foreground"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location Filter */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Location
                </h3>
                <div className="space-y-2">
                  {locations.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => setSelectedLocation(loc)}
                      className={`block w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                        selectedLocation === loc
                          ? "bg-primary text-primary-foreground font-medium"
                          : "hover:bg-muted text-foreground"
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <h3 className="font-semibold mb-3">Price Range</h3>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], parseInt(e.target.value)])
                    }
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              {(selectedCategory !== "All Items" ||
                selectedLocation !== "All Locations" ||
                searchQuery) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedCategory("All Items");
                    setSelectedLocation("All Locations");
                    setSearchQuery("");
                  }}
                  className="w-full"
                >
                  Clear All Filters
                </Button>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                {showFilters ? "Hide" : "Show"} Filters
              </Button>
              {showFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(false)}
                  className="ml-auto"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">
                Showing {filteredListings.length} item
                {filteredListings.length !== 1 ? "s" : ""}
              </p>
              <select className="px-3 py-1 border border-input rounded-lg text-sm">
                <option>Newest First</option>
                <option>Most Popular</option>
                <option>Highest Rated</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>

            {/* Listings Grid */}
            {filteredListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredListings.map((item) => (
                  <Link
                    key={item.id}
                    to={`/listing/${item.id}`}
                    className="group card-highlight overflow-hidden hover:shadow-lg transition-all"
                  >
                    <div className="relative h-48 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center overflow-hidden">
                      <div className="text-6xl group-hover:scale-110 transition-transform">
                        {item.image}
                      </div>
                      {item.isFree && (
                        <div className="absolute top-3 right-3 bg-secondary text-secondary-foreground text-xs font-bold px-2 py-1 rounded-lg">
                          FREE
                        </div>
                      )}
                    </div>

                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.category}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-secondary text-secondary" />
                          <span className="text-sm font-medium">
                            {item.rating}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ({item.reviews})
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        {item.location}
                      </div>

                      <div className="pt-2 border-t border-border flex items-center justify-between">
                        <div>
                          {item.isFree ? (
                            <p className="font-bold text-secondary text-lg">
                              Free
                            </p>
                          ) : (
                            <p className="font-bold text-lg">
                              ₹{item.price}
                              <span className="text-sm font-normal text-muted-foreground">
                                /day
                              </span>
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            by {item.owner}
                          </p>
                        </div>
                        <Zap className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No items found
                </h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters or search query
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCategory("All Items");
                    setSelectedLocation("All Locations");
                    setSearchQuery("");
                    setPriceRange([0, 500]);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
