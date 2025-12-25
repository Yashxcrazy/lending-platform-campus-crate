import { useState } from "react";
import {
  useMyRentals,
  useMyBookings,
  useUpdateBookingStatus,
  useSubmitVerification,
  useVerificationStatus,
  useCurrentUser,
} from "@/hooks/useAPI";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  Package,
  MapPin,
  Calendar,
  User,
  CheckCircle,
  Clock,
  XCircle,
  MessageSquare,
} from "lucide-react";
import { Link } from "react-router-dom";

const statusColors = {
  Pending: "bg-yellow-400/20 text-yellow-300 border border-yellow-400/30",
  Accepted: "bg-blue-400/20 text-blue-300 border border-blue-400/30",
  Active: "bg-green-400/20 text-green-300 border border-green-400/30",
  Completed: "bg-gray-400/20 text-gray-300 border border-gray-400/30",
  Rejected: "bg-red-400/20 text-red-300 border border-red-400/30",
  Cancelled: "bg-red-400/20 text-red-300 border border-red-400/30",
};

const statusIcons = {
  Pending: Clock,
  Accepted: CheckCircle,
  Active: CheckCircle,
  Completed: CheckCircle,
  Rejected: XCircle,
  Cancelled: XCircle,
};

export default function MyRentals() {
  const [filter, setFilter] = useState("all");
  const {
    data: rentalsData,
    isLoading: rentalsLoading,
    error: rentalsError,
  } = useMyRentals();
  const {
    data: bookingsData,
    isLoading: bookingsLoading,
    error: bookingsError,
  } = useMyBookings();
  const submitVerification = useSubmitVerification();
  const { data: verificationData } = useVerificationStatus();
  const { data: currentUser } = useCurrentUser();
  const updateStatus = useUpdateBookingStatus();

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

  const [activeTab, setActiveTab] = useState<"rentals" | "bookings">("rentals");

  const error = activeTab === "rentals" ? rentalsError : bookingsError;
  const isLoading = activeTab === "rentals" ? rentalsLoading : bookingsLoading;
  const data = activeTab === "rentals" ? rentalsData : bookingsData;

  const requests = data?.data || [];

  const filteredRequests = requests.filter((request: any) => {
    if (filter === "all") return true;
    return request.status?.toLowerCase() === filter.toLowerCase();
  });

  const ensureVerified = () => {
    if (!isVerified) {
      const wants = window.confirm(
        "You are not verified. Send a verification request now?"
      );
      if (wants) {
        handleSendVerificationRequest();
      }
      return false;
    }
    return true;
  };

  const handleSendVerificationRequest = async () => {
    const note = window.prompt("Add details for verification (optional)", "");
    try {
      await submitVerification.mutateAsync(note || "");
      alert("Verification request sent to admins.");
    } catch (err) {
      alert("Failed to send verification request.");
    }
  };

  const handleAccept = async (id: string) => {
    if (!ensureVerified()) return;
    if (window.confirm("Accept this request?")) {
      try {
        await updateStatus.mutateAsync({ id, status: "Accepted" });
        alert("Request accepted!");
      } catch (err) {
        alert("Failed to accept request");
      }
    }
  };

  const handleReject = async (id: string) => {
    if (!ensureVerified()) return;
    if (window.confirm("Reject this request?")) {
      try {
        await updateStatus.mutateAsync({ id, status: "Rejected" });
        alert("Request rejected!");
      } catch (err) {
        alert("Failed to reject request");
      }
    }
  };

  const handleComplete = async (id: string) => {
    if (!ensureVerified()) return;
    if (window.confirm("Mark as complete? You can leave a review after.")) {
      try {
        await updateStatus.mutateAsync({ id, status: "Completed" });
        alert("Marked as complete!");
      } catch (err) {
        alert("Failed to complete rental");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container-center max-w-6xl py-12 px-4">
        <div>
          <h1 className="marvel-title mb-2">My Rentals</h1>
          <p className="marvel-subtitle">Manage your active and past rentals</p>
        </div>

        {!isVerified && (
          <div className="glass-card border border-yellow-400/30 bg-yellow-400/10 p-4 rounded-lg text-yellow-200 text-sm mt-4">
            {verificationStatus
              ? `Verification status: ${verificationStatus}`
              : "Verify your account to accept requests, complete rentals, or use chat."}
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

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-cyan-400/20">
          <button
            onClick={() => setActiveTab("rentals")}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === "rentals"
                ? "text-cyan-300 border-b-2 border-cyan-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Items I've Lent
          </button>
          <button
            onClick={() => setActiveTab("bookings")}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === "bookings"
                ? "text-cyan-300 border-b-2 border-cyan-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Items I'm Borrowing
          </button>
        </div>

        {error && (
          <div className="glass-card border border-red-500/30 bg-red-500/10 p-8 rounded-lg flex items-start gap-4 mb-8">
            <div className="text-red-400 text-2xl flex-shrink-0">⚠️</div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">
                Unable to Load Your Rentals
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

        {!error && (
          <>
            {/* Filter Tabs */}
            <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
              {[
                { id: "all", label: "All" },
                { id: "pending", label: "Pending" },
                { id: "accepted", label: "Accepted" },
                { id: "active", label: "Active" },
                { id: "completed", label: "Completed" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`px-6 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                    filter === tab.id
                      ? "neon-border-cyan bg-cyan-400/20"
                      : "glass-card border-white/10 hover:border-white/20"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="text-cyan-400">Loading rentals...</div>
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <Package className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">
                  {activeTab === "rentals"
                    ? "No active loans"
                    : "No active bookings"}
                </h3>
                <p className="text-gray-400 mb-6">
                  {activeTab === "rentals"
                    ? "Browse items to borrow"
                    : "Manage your current borrowings"}
                </p>
                <Link to="/listings">
                  <Button className="btn-glow-cyan">Browse Items</Button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredRequests.map((request: any) => {
                  const StatusIcon =
                    statusIcons[request.status as keyof typeof statusIcons] ||
                    Clock;

                  return (
                    <div
                      key={request.id}
                      className="glass-card p-6 hover:border-cyan-400/50 transition-all"
                    >
                      <div className="grid md:grid-cols-4 gap-6 items-start">
                        {/* Item Info */}
                        <div>
                          <h3 className="font-bold text-white mb-2 text-sm text-cyan-400">
                            ITEM
                          </h3>
                          <p className="font-semibold text-white mb-2 line-clamp-2">
                            {request.itemTitle ||
                              request.item?.title ||
                              "Item Name"}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <MapPin className="w-4 h-4" />
                            <span>
                              {request.location ||
                                request.item?.location ||
                                "Location"}
                            </span>
                          </div>
                        </div>

                        {/* Dates */}
                        <div>
                          <h3 className="font-bold text-white mb-2 text-sm text-cyan-400">
                            RENTAL PERIOD
                          </h3>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-cyan-400" />
                              <span className="text-white font-semibold">
                                {new Date(
                                  request.startDate,
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="text-sm text-gray-400 ml-6">to</div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-cyan-400" />
                              <span className="text-white font-semibold">
                                {new Date(request.endDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Price & Status */}
                        <div>
                          <h3 className="font-bold text-white mb-2 text-sm text-cyan-400">
                            PRICE & STATUS
                          </h3>
                          <div className="text-3xl font-bold text-cyan-300 mb-3">
                            ₹{request.totalCost || 0}
                          </div>
                          <div
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${
                              statusColors[
                                request.status as keyof typeof statusColors
                              ] || statusColors.Pending
                            }`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {request.status || "Pending"}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2">
                          {activeTab === "rentals" && (
                            <>
                              {request.status === "Pending" && (
                                <>
                                  <Button
                                    onClick={() => handleAccept(request.id)}
                                    disabled={!isVerified}
                                    className="btn-glow-cyan text-sm"
                                  >
                                    Accept
                                  </Button>
                                  <Button
                                    onClick={() => handleReject(request.id)}
                                    variant="outline"
                                    disabled={!isVerified}
                                    className="text-sm text-red-400"
                                  >
                                    Reject
                                  </Button>
                                </>
                              )}
                              {request.status === "Active" && (
                                <>
                                  <Button
                                    onClick={() => handleComplete(request.id)}
                                      disabled={!isVerified}
                                    className="btn-glow-cyan text-sm"
                                  >
                                    Complete
                                  </Button>
                                  <Link
                                    to={isVerified ? `/lending/${request.id}/chat` : "#"}
                                    onClick={(e) => {
                                      if (!isVerified) {
                                        e.preventDefault();
                                        ensureVerified();
                                      }
                                    }}
                                  >
                                    <Button
                                      variant="outline"
                                      disabled={!isVerified}
                                      className="w-full text-sm flex items-center gap-2 justify-center"
                                    >
                                      <MessageSquare className="w-4 h-4" />
                                      Message
                                    </Button>
                                  </Link>
                                </>
                              )}
                              {request.status === "Completed" && (
                                <Link to={`/lending/${request.id}/review`}>
                                  <Button className="w-full btn-glow-red text-sm">
                                    Leave Review
                                  </Button>
                                </Link>
                              )}
                            </>
                          )}

                          {activeTab === "bookings" && (
                            <>
                              {request.status === "Active" && (
                                <Link to={`/lending/${request.id}/chat`}>
                                  <Button className="w-full btn-glow-cyan text-sm flex items-center gap-2 justify-center">
                                    <MessageSquare className="w-4 h-4" />
                                    Contact Lender
                                  </Button>
                                </Link>
                              )}
                              {request.status === "Completed" && (
                                <Link to={`/lending/${request.id}/review`}>
                                  <Button className="w-full btn-glow-red text-sm">
                                    Leave Review
                                  </Button>
                                </Link>
                              )}
                            </>
                          )}

                          {request.message && (
                            <div className="mt-3 p-3 glass-card rounded bg-white/5 text-xs">
                              <p className="text-gray-400 mb-1">Message:</p>
                              <p className="text-white">{request.message}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
