import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useMyListings,
  useDeleteListing,
  useUpdateListing,
  useCreateListing,
} from "@/hooks/useAPI";
import { Plus, Edit2, Trash2, Package, Eye, MoreVertical } from "lucide-react";

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

const conditions = ["New", "Like New", "Good", "Fair", "Poor"];

export default function MyListings() {
  const navigate = useNavigate();
  const { data: listingsData, isLoading, error } = useMyListings();
  console.log('🚀 MyListings component IS RENDERING!');
  console.log('📊 Hook data:', { listingsData, isLoading, error });
  console.log('📊 Items array:', listingsData?.items);
  const deleteListing = useDeleteListing();
  const updateListing = useUpdateListing();
  const createListing = useCreateListing();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Electronics",
    condition: "Good",
    dailyRate: 0,
    securityDeposit: 0,
    location: { address: "" },
    images: [],
  });

  const listings = listingsData?.items || listingsData?.data || [];

  const handleCreate = async () => {
    if (!formData.title || !formData.description) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      await createListing.mutateAsync(formData);
      setShowForm(false);
      setFormData({
        title: "",
        description: "",
        category: "Electronics",
        condition: "Good",
        dailyRate: 0,
        securityDeposit: 0,
        location: { address: "" },
        images: [],
      });
      alert("Item listed successfully!");
    } catch (err) {
      alert("Failed to create listing");
    }
  };

  const handleEdit = async (id: string) => {
    try {
      await updateListing.mutateAsync({ id, updates: editData });
      setEditingId(null);
      setEditData({});
      alert("Item updated successfully!");
    } catch (err) {
      alert("Failed to update listing");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteListing.mutateAsync(id);
        alert("Item deleted successfully!");
      } catch (err) {
        alert("Failed to delete listing");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container-center max-w-6xl py-12 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="marvel-title mb-2">My Items</h1>
            <p className="marvel-subtitle">
              Manage items you're lending to students
            </p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="btn-glow-red flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            List New Item
          </Button>
        </div>

        {error && (
          <div className="glass-card border border-red-500/30 bg-red-500/10 p-8 rounded-lg flex items-start gap-4 mb-8">
            <div className="text-red-400 text-2xl flex-shrink-0">⚠️</div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">
                Unable to Load Your Listings
              </h3>
              <p className="text-gray-300 mb-4">
                We're having trouble connecting to the server. Please check your
                internet connection and try again.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="btn-glow-cyan text-sm"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Create/Edit Form */}
        {showForm && (
          <div className="glass-card border border-cyan-400/30 p-8 rounded-lg mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              List a New Item
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Item Title
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., MacBook Pro 14-inch"
                  className="glass-card border-cyan-400/30"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full glass-card border border-cyan-400/30 bg-white/5 text-white p-2 rounded-lg"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="bg-gray-900">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Condition
                </label>
                <select
                  value={formData.condition}
                  onChange={(e) =>
                    setFormData({ ...formData, condition: e.target.value })
                  }
                  className="w-full glass-card border border-cyan-400/30 bg-white/5 text-white p-2 rounded-lg"
                >
                  {conditions.map((cond) => (
                    <option key={cond} value={cond} className="bg-gray-900">
                      {cond}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Location
                </label>
                <Input
                  value={formData.location.address}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: { address: e.target.value },
                    })
                  }
                  placeholder="e.g., Hostel A, Room 101"
                  className="glass-card border-cyan-400/30"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Daily Rate (₹)
                </label>
                <Input
                  type="number"
                  value={formData.dailyRate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dailyRate: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="50"
                  className="glass-card border-cyan-400/30"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Security Deposit (₹)
                </label>
                <Input
                  type="number"
                  value={formData.securityDeposit}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      securityDeposit: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="100"
                  className="glass-card border-cyan-400/30"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-white mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe the item, its condition, and how to use it..."
                  className="w-full glass-card border border-cyan-400/30 bg-white/5 text-white placeholder:text-gray-400 p-3 rounded-lg resize-none"
                  rows={4}
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <Button onClick={handleCreate} className="flex-1 btn-glow-cyan">
                List Item
              </Button>
              <Button
                onClick={() => setShowForm(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Listings Grid */}
        {!error && (
          <>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="text-cyan-400">Loading your items...</div>
              </div>
            ) : listings.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <Package className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">
                  No items yet
                </h3>
                <p className="text-gray-400 mb-6">
                  Start earning by listing items you're not using
                </p>
                <Button
                  onClick={() => setShowForm(true)}
                  className="btn-glow-red"
                >
                  Create Your First Listing
                </Button>
              </div>
            ) : (
              <div className="grid gap-6">
                {listings.map((listing: any) => (
                  <div
                    key={listing.id}
                    className="glass-card overflow-hidden hover:border-cyan-400/50 transition-all"
                  >
                    {editingId === listing.id ? (
                      // Edit Mode
                      <div className="p-6 space-y-4">
                        <Input
                          value={editData.title || listing.title}
                          onChange={(e) =>
                            setEditData({ ...editData, title: e.target.value })
                          }
                          placeholder="Title"
                          className="glass-card border-cyan-400/30"
                        />
                        <textarea
                          value={editData.description || listing.description}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              description: e.target.value,
                            })
                          }
                          placeholder="Description"
                          className="w-full glass-card border border-cyan-400/30 bg-white/5 text-white p-3 rounded-lg"
                          rows={3}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            type="number"
                            value={editData.dailyRate || listing.dailyRate}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                dailyRate: parseInt(e.target.value),
                              })
                            }
                            placeholder="Daily Rate"
                            className="glass-card border-cyan-400/30"
                          />
                          <Input
                            type="number"
                            value={
                              editData.securityDeposit ||
                              listing.securityDeposit ||
                              0
                            }
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                securityDeposit: parseInt(e.target.value),
                              })
                            }
                            placeholder="Security Deposit"
                            className="glass-card border-cyan-400/30"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleEdit(listing.id)}
                            className="flex-1 btn-glow-cyan"
                          >
                            Save
                          </Button>
                          <Button
                            onClick={() => {
                              setEditingId(null);
                              setEditData({});
                            }}
                            variant="outline"
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <div className="p-6 flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-2">
                            {listing.title}
                          </h3>
                          <p className="text-sm text-gray-400 mb-3">
                            {listing.description}
                          </p>
                          <div className="flex gap-4 text-sm">
                            <span className="glass-card px-2 py-1 rounded text-cyan-300">
                              ₹{listing.dailyRate}/day
                            </span>
                            <span className="glass-card px-2 py-1 rounded text-yellow-300">
                              {listing.condition}
                            </span>
                            <span className="text-gray-400">
                              {listing.availability || "Available"}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Link to={`/listing/${listing.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            onClick={() => {
                              setEditingId(listing.id);
                              setEditData(listing);
                            }}
                            variant="outline"
                            size="sm"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleDelete(listing.id)}
                            variant="outline"
                            size="sm"
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
