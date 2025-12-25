import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useListing,
  useCreateBooking,
  useSubmitVerification,
  useVerificationStatus,
  useCurrentUser,
} from "@/hooks/useAPI";
import {
  Star,
  MapPin,
  Calendar,
  Heart,
  Share2,
  AlertCircle,
  CheckCircle,
  Clock,
  User,
  Shield,
  TrendingUp,
  ArrowLeft,
} from "lucide-react";

export default function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState("");
  const [requestLoading, setRequestLoading] = useState(false);

  const submitVerification = useSubmitVerification();
  const { data: verificationData } = useVerificationStatus();
  const { data: currentUser } = useCurrentUser();

  let storedUser: any = {};
  try {
    storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  } catch (err) {
    storedUser = {};
  }

  const verificationStatus = verificationData?.request?.status;
  const isVerified = Boolean(
    currentUser?.isVerified || storedUser?.isVerified || verificationStatus === "approved"
  );

  const { data: listing, isLoading, error } = useListing(id!);
  const createBookingMutation = useCreateBooking();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-cyan-400 text-lg">Loading item details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container-center py-20">
          <div className="glass-card border border-red-500/30 bg-red-500/10 p-8 rounded-lg max-w-md mx-auto">
            <div className="text-red-400 text-4xl text-center mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              Unable to Load Item
            </h2>
            <p className="text-gray-300 mb-6 text-center">
              We're having trouble connecting to the server. Please check your
              internet connection and try again.
            </p>
            <div className="flex gap-4">
              <Button
                onClick={() => window.location.reload()}
                className="flex-1 btn-glow-cyan"
              >
                Retry
              </Button>
              <Button
                onClick={() => navigate("/listings")}
                variant="outline"
                className="flex-1"
              >
                Back to Listings
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container-center py-20 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Item not found</h1>
          <Button onClick={() => navigate("/listings")}>
            Back to Listings
          </Button>
        </div>
      </div>
    );
  }

  const handleRequestItem = async () => {
    if (!isVerified) {
      alert("Please verify your account to send a borrowing request.");
      return;
    }

    if (!startDate || !endDate) {
      alert("Please select both start and end dates");
      return;
    }

    if (new Date(startDate) >= new Date(endDate)) {
      alert("End date must be after start date");
      return;
    }

    setRequestLoading(true);
    try {
      const days = Math.ceil(
        (new Date(endDate).getTime() - new Date(startDate).getTime()) /
          (1000 * 60 * 60 * 24),
      );
      const totalCost = days * listing.dailyRate;

      await createBookingMutation.mutateAsync({
        item: id!,
        startDate,
        endDate,
        message,
        totalCost,
        securityDeposit: totalCost * 0.2, // 20% security deposit
        status: "Pending",
      });

      setShowRequestForm(false);
      setStartDate("");
      setEndDate("");
      setMessage("");
      alert("Request sent! Wait for lender confirmation.");
      navigate("/my-rentals");
    } catch (error) {
      console.error("Failed to create request:", error);
      alert("Failed to send request. Please try again.");
    } finally {
      setRequestLoading(false);
    }
  };

  const handleSendVerificationRequest = async () => {
    const note = window.prompt("Add details for verification (optional)", "");
    try {
      await submitVerification.mutateAsync(note || "");
      alert("Verification request sent to admins. You'll be notified once reviewed.");
    } catch (err) {
      alert("Failed to send verification request. Please try again.");
    }
  };

  const calculatePrice = () => {
    if (!startDate || !endDate) return 0;
    const days = Math.ceil(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) /
        (1000 * 60 * 60 * 24),
    );
    return days * listing.dailyRate;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container-center max-w-6xl py-8 px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate("/listings")}
          className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Listings
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images & Details */}
          <div className="lg:col-span-2">
            {/* Main Image */}
            <div className="glass-card overflow-hidden rounded-lg mb-6 aspect-video bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center">
              {listing.images?.[0] ? (
                <img
                  src={listing.images[0]}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-6xl">📦</div>
              )}
            </div>

            {/* Thumbnails */}
            {listing.images && listing.images.length > 1 && (
              <div className="flex gap-4 mb-8">
                {listing.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`${listing.title} ${idx}`}
                    className="w-20 h-20 object-cover rounded cursor-pointer hover:opacity-75"
                  />
                ))}
              </div>
            )}

            {/* Item Details */}
            <div className="space-y-6">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                      {listing.title}
                    </h1>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="glass-card px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-300">
                        {listing.category}
                      </span>
                      <span className="glass-card px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-300">
                        {listing.condition}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setLiked(!liked)}
                      className={`p-3 rounded-lg transition-all ${
                        liked
                          ? "bg-red-500/20 text-red-400"
                          : "glass-card text-gray-400"
                      }`}
                    >
                      <Heart
                        className={`w-5 h-5 ${liked ? "fill-current" : ""}`}
                      />
                    </button>
                    <button className="p-3 glass-card rounded-lg text-gray-400 hover:text-cyan-400">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-xl font-semibold text-white mb-3">
                  Description
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  {listing.description}
                </p>
              </div>

              {/* Item Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">Location</span>
                  </div>
                  <p className="text-white font-semibold">{listing.location}</p>
                </div>
                <div className="glass-card p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Availability</span>
                  </div>
                  <p className="text-white font-semibold">Available Now</p>
                </div>
              </div>

              {/* Pricing Info */}
              <div className="grid grid-cols-3 gap-4">
                <div className="glass-card p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-cyan-300 mb-1">
                    ₹{listing.dailyRate}
                  </div>
                  <div className="text-xs text-gray-400">Per Day</div>
                </div>
                <div className="glass-card p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-cyan-300 mb-1">
                    ₹{listing.weeklyRate}
                  </div>
                  <div className="text-xs text-gray-400">Per Week</div>
                </div>
                <div className="glass-card p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-cyan-300 mb-1">
                    ₹{listing.monthlyRate}
                  </div>
                  <div className="text-xs text-gray-400">Per Month</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Request Form & Lender Info */}
          <div className="space-y-6">
            {/* Lending Request Card */}
            <div className="glass-card border border-cyan-400/30 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-white mb-6">
                Request to Borrow
              </h2>

              {!isVerified && (
                <div className="mb-4 glass-card bg-yellow-400/10 border border-yellow-400/30 text-yellow-200 text-sm p-3 rounded">
                  {verificationStatus
                    ? `Verification status: ${verificationStatus}`
                    : "You are not verified yet. Submit a verification request to continue."}
                  <div className="mt-2 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleSendVerificationRequest}
                      disabled={submitVerification.isPending}
                    >
                      {submitVerification.isPending ? "Sending..." : "Send Verification Request"}
                    </Button>
                  </div>
                </div>
              )}

              {!showRequestForm ? (
                <Button
                  onClick={() => setShowRequestForm(true)}
                  disabled={!isVerified}
                  className="w-full btn-glow-cyan py-6"
                >
                  {isVerified ? "Send Request" : "Verify to Request"}
                </Button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Start Date
                    </label>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="glass-card border-cyan-400/30 bg-white/5"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      End Date
                    </label>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="glass-card border-cyan-400/30 bg-white/5"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Message to Lender (Optional)
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Why do you need this item?"
                      className="w-full glass-card border-cyan-400/30 bg-white/5 text-white placeholder:text-gray-400 p-3 rounded-lg resize-none"
                      rows={3}
                    />
                  </div>

                  {startDate && endDate && (
                    <div className="glass-card bg-cyan-400/10 border border-cyan-400/30 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-gray-400">Rental Duration:</span>
                        <span className="text-white font-semibold">
                          {Math.ceil(
                            (new Date(endDate).getTime() -
                              new Date(startDate).getTime()) /
                              (1000 * 60 * 60 * 24),
                          )}{" "}
                          days
                        </span>
                      </div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-gray-400">Rental Cost:</span>
                        <span className="text-cyan-300 font-semibold">
                          ₹{calculatePrice()}
                        </span>
                      </div>
                      <div className="border-t border-cyan-400/20 pt-3 flex justify-between items-center">
                        <span className="text-gray-400">
                          Security Deposit (20%):
                        </span>
                        <span className="text-cyan-300 font-semibold">
                          ₹{Math.round(calculatePrice() * 0.2)}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      onClick={handleRequestItem}
                      disabled={requestLoading || !startDate || !endDate || !isVerified}
                      className="flex-1 btn-glow-cyan"
                    >
                      {requestLoading ? "Sending..." : isVerified ? "Send Request" : "Verify to Request"}
                    </Button>
                    <Button
                      onClick={() => setShowRequestForm(false)}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Lender Info Card */}
            <div className="glass-card border border-cyan-400/30 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-4">
                About the Lender
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-400/20 flex items-center justify-center">
                    <User className="w-8 h-8 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">Campus Lender</p>
                    <p className="text-sm text-gray-400">Joined 3 months ago</p>
                  </div>
                </div>

                {/* Rating */}
                <div className="glass-card bg-white/5 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <span className="text-white font-semibold">4.8</span>
                  </div>
                  <p className="text-xs text-gray-400">45 reviews</p>
                </div>

                {/* Stats */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm">Verified Profile</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-sm">23 Items Listed</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span className="text-sm">Trust Score: 92/100</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Safe Renting Info */}
            <div className="glass-card border border-yellow-400/30 bg-yellow-400/10 p-4 rounded-lg">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white mb-1">
                    Safe Renting Tips
                  </h4>
                  <p className="text-sm text-gray-300">
                    Meet in public places, inspect items before finalizing, and
                    use anonymous chat.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
