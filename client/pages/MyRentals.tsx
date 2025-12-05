import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useMyBookings, useCancelBooking } from "@/hooks/useAPI";
import {
  Package,
  Calendar,
  MapPin,
  Star,
  MessageCircle,
  XCircle,
  CheckCircle,
  Clock,
} from "lucide-react";

const statusColors = {
  pending: "text-yellow-400 bg-yellow-400/10",
  confirmed: "text-blue-400 bg-blue-400/10",
  active: "text-green-400 bg-green-400/10",
  completed: "text-cyan-400 bg-cyan-400/10",
  cancelled: "text-red-400 bg-red-400/10",
};

export default function MyRentals() {
  const { data: bookingsData, isLoading, error } = useMyBookings();
  const cancelBookingMutation = useCancelBooking();
  const [filter, setFilter] = useState<string>("all");

  const bookings = bookingsData?.data || [];
  const filteredBookings =
    filter === "all"
      ? bookings
      : bookings.filter((b) => b.status === filter);

  const handleCancel = async (id: string) => {
    if (
      window.confirm("Are you sure you want to cancel this booking?")
    ) {
      await cancelBookingMutation.mutateAsync(id);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container-center max-w-6xl py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="marvel-title mb-2">My Rentals</h1>
          <p className="marvel-subtitle">Manage your active and past rentals</p>
        </div>

        {error && (
          <div className="glass-card border border-red-500/30 bg-red-500/10 p-8 rounded-lg flex items-start gap-4 mb-8">
            <div className="text-red-400 text-2xl flex-shrink-0">⚠️</div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">
                Unable to Load Your Rentals
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
        )}

        {!error && (
        <>
        {/* Filter Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {[
            { id: "all", label: "All" },
            { id: "pending", label: "Pending" },
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
            <div className="text-cyan-400">Loading...</div>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Package className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">
              No bookings found
            </h3>
            <p className="text-gray-400 mb-6">
              Start renting items from fellow students
            </p>
            <Link to="/listings">
              <Button className="btn-glow-cyan">Browse Items</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredBookings.map((booking: any) => (
              <div
                key={booking.id}
                className="glass-card p-6 hover:border-cyan-400/50 transition-all"
              >
                <div className="grid md:grid-cols-4 gap-6 items-start">
                  {/* Item Info */}
                  <div>
                    <h3 className="font-bold text-white mb-2 text-sm text-cyan-400">
                      ITEM
                    </h3>
                    <p className="font-semibold text-white mb-2 line-clamp-2">
                      {booking.listingTitle || "Item Name"}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span>{booking.location || "Location"}</span>
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
                          {new Date(booking.startDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-sm text-gray-400 ml-6">
                        to
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-cyan-400" />
                        <span className="text-white font-semibold">
                          {new Date(booking.endDate).toLocaleDateString()}
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
                      ₹{booking.totalPrice}
                    </div>
                    <div
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        statusColors[booking.status as keyof typeof statusColors] ||
                        statusColors.pending
                      }`}
                    >
                      {booking.status.charAt(0).toUpperCase() +
                        booking.status.slice(1)}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <Link to={`/listing/${booking.listingId}`}>
                      <button className="w-full btn-glow-blue flex items-center justify-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        Contact Lender
                      </button>
                    </Link>

                    {booking.status === "active" && (
                      <>
                        <Link to={`/booking/${booking.id}`}>
                          <button className="w-full btn-glow-cyan">
                            Booking Details
                          </button>
                        </Link>
                        <button
                          onClick={() => handleCancel(booking.id)}
                          disabled={cancelBookingMutation.isPending}
                          className="w-full btn-glow-red flex items-center justify-center gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          Cancel
                        </button>
                      </>
                    )}

                    {booking.status === "completed" && !booking.reviewed && (
                      <Link to={`/booking/${booking.id}/review`}>
                        <button className="w-full btn-glow-cyan">
                          Leave Review
                        </button>
                      </Link>
                    )}
                  </div>
                </div>

                {/* Status Info */}
                <div className="mt-4 pt-4 border-t border-white/10 text-xs text-gray-400">
                  {booking.status === "pending" && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-yellow-400" />
                      Waiting for lender confirmation...
                    </div>
                  )}
                  {booking.status === "confirmed" && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-400" />
                      Ready for handover. Meet the lender at the agreed
                      location.
                    </div>
                  )}
                  {booking.status === "active" && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      Item is with you. Return by{" "}
                      {new Date(booking.endDate).toLocaleDateString()}
                    </div>
                  )}
                  {booking.status === "completed" && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-cyan-400" />
                      Rental completed successfully!
                    </div>
                  )}
                </div>
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
