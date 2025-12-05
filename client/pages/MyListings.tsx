import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useMyListings,
  useDeleteListing,
  useUpdateListing,
} from "@/hooks/useAPI";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  TrendingUp,
  Package,
  AlertCircle,
} from "lucide-react";

export default function MyListings() {
  const { data: listingsData, isLoading, error } = useMyListings();
  const deleteListingMutation = useDeleteListing();
  const updateListingMutation = useUpdateListing();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});

  const listings = listingsData?.data || [];

  const handleEdit = (listing: any) => {
    setEditingId(listing.id);
    setEditData(listing);
  };

  const handleSaveEdit = async () => {
    await updateListingMutation.mutateAsync({
      id: editingId!,
      updates: editData,
    });
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      await deleteListingMutation.mutateAsync(id);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container-center max-w-6xl py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="marvel-title mb-2">My Listings</h1>
            <p className="marvel-subtitle">Manage items you're offering to rent</p>
          </div>
          <Link to="/my-listings/new">
            <Button className="btn-glow-red flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create Listing
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-cyan-400">Loading...</div>
          </div>
        ) : listings.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Package className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">
              No listings yet
            </h3>
            <p className="text-gray-400 mb-6">
              Start earning by listing items you're not using
            </p>
            <Link to="/my-listings/new">
              <Button className="btn-glow-red">Create Your First Listing</Button>
            </Link>
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
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">
                        Title
                      </label>
                      <Input
                        value={editData.title || ""}
                        onChange={(e) =>
                          setEditData({ ...editData, title: e.target.value })
                        }
                        className="glass-card border-cyan-400/30"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">
                        Description
                      </label>
                      <textarea
                        value={editData.description || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            description: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 glass-card border border-cyan-400/30 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        rows={3}
                      />
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-white mb-2">
                          Daily Rate (₹)
                        </label>
                        <Input
                          type="number"
                          value={editData.dailyRate || ""}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              dailyRate: Number(e.target.value),
                            })
                          }
                          className="glass-card border-cyan-400/30"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-white mb-2">
                          Weekly Rate (₹)
                        </label>
                        <Input
                          type="number"
                          value={editData.weeklyRate || ""}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              weeklyRate: Number(e.target.value),
                            })
                          }
                          className="glass-card border-cyan-400/30"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-white mb-2">
                          Monthly Rate (₹)
                        </label>
                        <Input
                          type="number"
                          value={editData.monthlyRate || ""}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              monthlyRate: Number(e.target.value),
                            })
                          }
                          className="glass-card border-cyan-400/30"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={handleSaveEdit}
                        disabled={updateListingMutation.isPending}
                        className="flex-1 btn-glow-cyan"
                      >
                        Save Changes
                      </Button>
                      <Button
                        onClick={() => setEditingId(null)}
                        className="flex-1 btn-glow-blue"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="flex gap-6 p-6">
                    {/* Image */}
                    <div className="w-32 h-32 rounded-lg bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex-shrink-0 overflow-hidden">
                      {listing.images?.[0] ? (
                        <img
                          src={listing.images[0]}
                          alt={listing.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">
                          📦
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-2">
                        {listing.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4">
                        {listing.description}
                      </p>

                      {/* Pricing */}
                      <div className="flex gap-6 mb-4 text-sm">
                        <div>
                          <span className="text-gray-400">Daily: </span>
                          <span className="font-bold text-cyan-300">
                            ₹{listing.dailyRate}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400">Weekly: </span>
                          <span className="font-bold text-cyan-300">
                            ₹{listing.weeklyRate}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400">Monthly: </span>
                          <span className="font-bold text-cyan-300">
                            ₹{listing.monthlyRate}
                          </span>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-cyan-400" />
                          <span className="text-gray-400">
                            {listing.views || 0} views
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-cyan-400" />
                          <span className="text-gray-400">
                            {listing.bookings || 0} bookings
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleEdit(listing)}
                        className="btn-glow-cyan px-4 py-2 flex items-center gap-2 justify-center"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(listing.id)}
                        disabled={deleteListingMutation.isPending}
                        className="btn-glow-red px-4 py-2 flex items-center gap-2 justify-center"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
