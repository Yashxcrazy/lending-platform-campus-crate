import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCurrentUser, useUpdateProfile, useUserReviews } from "@/hooks/useAPI";
import {
  Star,
  Mail,
  MapPin,
  Phone,
  Edit2,
  Save,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function Profile() {
  const { data: user } = useCurrentUser();
  const { data: reviewsData } = useUserReviews(user?.id || "");
  const updateProfileMutation = useUpdateProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: (user as any)?.phone || "",
    address: (user as any)?.address || "",
  });

  // Sync form fields when user data loads
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: (user as any)?.phone || "",
        address: (user as any)?.address || "",
      });
    }
  }, [user]);

  const reviews = reviewsData?.data || [];

  const handleSave = async () => {
    await updateProfileMutation.mutateAsync(formData);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container-center max-w-6xl py-8 px-4">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Card */}
            <div className="glass-card p-8">
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-4xl">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white">
                      {user?.name || "User Name"}
                    </h1>
                    <div className="flex items-center gap-2 mt-2">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      <span className="font-bold text-white">
                        {user?.rating != null ? user.rating.toFixed(1) : "—"}
                      </span>
                      <span className="text-gray-400">
                        ({user?.reviewCount ?? 0} reviews)
                      </span>
                    </div>
                    <p className="text-gray-400 mt-2">
                      Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="btn-glow-cyan flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </button>
              </div>

              {/* Edit Form */}
              {isEditing ? (
                <div className="space-y-6 border-t border-white/10 pt-6">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Full Name
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="glass-card border-cyan-400/30"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Email
                    </label>
                    <Input
                      value={formData.email}
                      disabled
                      className="glass-card border-cyan-400/30 opacity-50"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Email cannot be changed
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Phone (Optional)
                    </label>
                    <Input
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="+91 1234567890"
                      className="glass-card border-cyan-400/30"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Address (Optional)
                    </label>
                    <Input
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      placeholder="Your location on campus"
                      className="glass-card border-cyan-400/30"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleSave}
                      disabled={updateProfileMutation.isPending}
                      className="flex-1 btn-glow-cyan flex items-center justify-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </Button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex-1 btn-glow-blue flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6 border-t border-white/10 pt-6">
                  <div>
                    <h3 className="text-sm font-semibold text-cyan-400 mb-2">
                      EMAIL
                    </h3>
                    <div className="flex items-center gap-2 text-white min-w-0">
                      <Mail className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                      <span className="truncate">{user?.email}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-cyan-400 mb-2">
                      PHONE
                    </h3>
                    <div className="flex items-center gap-2 text-white min-w-0">
                      <Phone className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                      <span className="truncate">{(user as any)?.phone || "Not provided"}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Reviews Section */}
            <div className="glass-card p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Reviews</h2>

              {reviews.length === 0 ? (
                <div className="text-center py-12">
                  <Star className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">
                    No reviews yet. Complete a rental to get your first review!
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review: any) => (
                    <div
                      key={review.id}
                      className="glass-card p-4 border-cyan-400/30"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex gap-1 mb-1">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i <= review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-600"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-sm text-gray-400">
                            User #{review.fromUserId?.slice(0, 8)}
                          </p>
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-white">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Verification Status */}
            <div className="glass-card p-6 border-green-400/30">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                Verification Status
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Email</span>
                  <span className={`font-semibold ${user?.isVerified ? 'text-green-400' : 'text-yellow-300'}`}>
                    {user?.isVerified ? '✓ Verified' : '⚠ Pending'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Identity</span>
                  <span className="text-gray-400 font-semibold">Not provided</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Payment Method</span>
                  <span className="text-yellow-400 font-semibold">
                    ⚠ Pending
                  </span>
                </div>
              </div>
            </div>

            {/* Account Settings Link */}
            <div className="glass-card p-6">
              <h3 className="font-bold text-white mb-4">Account Settings</h3>
              <a href="/settings" className="btn-glow-cyan inline-block px-4 py-2 rounded">
                Manage Account Settings
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
