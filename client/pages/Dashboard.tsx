import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useMyBookings, useMyRentals } from "@/hooks/useAPI";
import {
  BarChart3,
  TrendingUp,
  Package,
  Star,
  Clock,
  AlertCircle,
  ArrowRight,
  Plus,
} from "lucide-react";

export default function Dashboard() {
  const { data: bookingsData } = useMyBookings();
  const { data: rentalsData } = useMyRentals();

  const bookings = bookingsData?.data || [];
  const rentals = rentalsData?.data || [];

  const activeBookings = bookings.filter((b) => b.status === "active").length;
  const activeRentals = rentals.filter((r) => r.status === "active").length;
  const totalEarnings = rentals.reduce((sum, r) => sum + (r.totalPrice || 0), 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 px-4">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        </div>

        <div className="container-center max-w-6xl">
          <div className="mb-12">
            <h1 className="marvel-title mb-2">Your Dashboard</h1>
            <p className="marvel-subtitle">
              Manage your rentals, listings, and track your activity
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {[
              {
                label: "Active Rentals",
                value: activeRentals,
                icon: Package,
                color: "cyan",
              },
              {
                label: "Active Bookings",
                value: activeBookings,
                icon: Clock,
                color: "blue",
              },
              {
                label: "Total Earnings",
                value: `₹${totalEarnings}`,
                icon: TrendingUp,
                color: "red",
              },
              {
                label: "Rating",
                value: "4.8",
                icon: Star,
                color: "purple",
              },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              const colorMap = {
                cyan: "neon-border-cyan bg-cyan-400/10",
                blue: "neon-border-blue bg-blue-400/10",
                red: "neon-border-red bg-red-400/10",
                purple: "neon-border-purple bg-purple-400/10",
              };
              return (
                <div key={idx} className={`glass-card p-6 ${colorMap[stat.color as keyof typeof colorMap]}`}>
                  <div className="flex items-start justify-between mb-4">
                    <Icon className="w-5 h-5 text-white/60" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="container-center max-w-6xl px-4 pb-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Link to="/my-listings/new">
                  <button className="w-full btn-glow-red flex items-center justify-center gap-2">
                    <Plus className="w-5 h-5" />
                    List New Item
                  </button>
                </Link>
                <Link to="/listings">
                  <button className="w-full btn-glow-cyan flex items-center justify-center gap-2">
                    Browse Items
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Your Bookings</h2>
                <Link
                  to="/my-rentals"
                  className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold"
                >
                  View All
                </Link>
              </div>

              {bookings.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No bookings yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.slice(0, 3).map((booking: any) => (
                    <div
                      key={booking.id}
                      className="glass-card p-4 flex items-center justify-between"
                    >
                      <div>
                        <h4 className="font-semibold text-white">
                          Item Booking
                        </h4>
                        <p className="text-sm text-gray-400">
                          {new Date(booking.startDate).toLocaleDateString()} -{" "}
                          {new Date(booking.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-cyan-300">
                          ₹{booking.totalPrice}
                        </div>
                        <div className={`text-xs font-semibold ${
                          booking.status === "active"
                            ? "text-green-400"
                            : "text-yellow-400"
                        }`}>
                          {booking.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Rentals */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Your Rentals</h2>
                <Link
                  to="/my-listings"
                  className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold"
                >
                  View All
                </Link>
              </div>

              {rentals.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">You haven't listed any items</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {rentals.slice(0, 3).map((rental: any) => (
                    <div
                      key={rental.id}
                      className="glass-card p-4 flex items-center justify-between"
                    >
                      <div>
                        <h4 className="font-semibold text-white">
                          {rental.title}
                        </h4>
                        <p className="text-sm text-gray-400">
                          {rental.bookingCount || 0} bookings
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-cyan-300">
                          ₹{rental.monthlyRate}/month
                        </div>
                        <div className="text-xs text-green-400 font-semibold">
                          Active
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="glass-card p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                  U
                </div>
                <h3 className="text-lg font-bold text-white">User Name</h3>
                <p className="text-sm text-gray-400 mt-1">
                  Member since Jan 2024
                </p>
              </div>

              <div className="border-t border-white/10 pt-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-white font-semibold">4.8 rating</span>
                  <span className="text-gray-400 text-sm">(47 reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-cyan-400" />
                  <span className="text-gray-400 text-sm">
                    Email verified ✓
                  </span>
                </div>
              </div>

              <Link to="/profile">
                <Button className="w-full mt-4 btn-glow-cyan">
                  View Profile
                </Button>
              </Link>
            </div>

            {/* Safety Tips */}
            <div className="glass-card p-6 border-cyan-400/30">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Safety Tips
              </h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>✓ Always meet in public campus locations</li>
                <li>✓ Check item condition before payment</li>
                <li>✓ Take photos of the item</li>
                <li>✓ Keep message records for proof</li>
              </ul>
            </div>

            {/* Support */}
            <div className="glass-card p-6">
              <h3 className="font-bold text-white mb-3">Need Help?</h3>
              <p className="text-sm text-gray-400 mb-4">
                Check our help center or contact support.
              </p>
              <Button className="w-full btn-glow-blue">Contact Support</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
