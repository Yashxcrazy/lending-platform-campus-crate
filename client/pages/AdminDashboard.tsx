import { useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BarChart3,
  Users,
  Package,
  AlertTriangle,
  TrendingUp,
  Eye,
  Ban,
  CheckCircle,
  Search,
} from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - replace with actual API calls
  const stats = {
    totalUsers: 1234,
    totalListings: 5678,
    totalBookings: 9012,
    reportedItems: 23,
  };

  const recentReports = [
    {
      id: 1,
      type: "listing",
      title: "Damaged Item Description",
      reporter: "User #1234",
      reason: "Item condition misrepresented",
      status: "pending",
    },
    {
      id: 2,
      type: "user",
      title: "Suspicious User Activity",
      reporter: "System",
      reason: "Multiple cancellations",
      status: "investigating",
    },
    {
      id: 3,
      type: "message",
      title: "Inappropriate Messaging",
      reporter: "User #5678",
      reason: "Harassment",
      status: "resolved",
    },
  ];

  const recentUsers = [
    { id: 1, name: "User #1234", email: "user1234@cse.nitrr.ac.in", status: "active" },
    { id: 2, name: "User #5678", email: "user5678@cse.nitrr.ac.in", status: "suspended" },
    { id: 3, name: "User #9012", email: "user9012@cse.nitrr.ac.in", status: "active" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container-center max-w-6xl py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="marvel-title mb-2">Admin Dashboard</h1>
          <p className="marvel-subtitle">Manage users, listings, and reports</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {[
            {
              label: "Total Users",
              value: stats.totalUsers,
              icon: Users,
              color: "neon-border-cyan bg-cyan-400/10",
            },
            {
              label: "Total Listings",
              value: stats.totalListings,
              icon: Package,
              color: "neon-border-blue bg-blue-400/10",
            },
            {
              label: "Total Bookings",
              value: stats.totalBookings,
              icon: TrendingUp,
              color: "neon-border-red bg-red-400/10",
            },
            {
              label: "Reported Items",
              value: stats.reportedItems,
              icon: AlertTriangle,
              color: "neon-border-purple bg-purple-400/10",
            },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className={`glass-card p-6 ${stat.color}`}>
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

        {/* Content Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {[
            { id: "overview", label: "Overview" },
            { id: "reports", label: "Reports" },
            { id: "users", label: "Users" },
            { id: "listings", label: "Listings" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "neon-border-cyan bg-cyan-400/20"
                  : "glass-card border-white/10 hover:border-white/20"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold text-white mb-6">
                Platform Activity
              </h2>
              <div className="h-64 bg-white/5 rounded-lg flex items-center justify-center text-gray-400">
                Chart placeholder - Connect to backend for analytics
              </div>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === "reports" && (
          <div className="space-y-6">
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400/50" />
                <Input
                  placeholder="Search reports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 py-2 glass-card border-cyan-400/30"
                />
              </div>
            </div>

            <div className="space-y-4">
              {recentReports.map((report) => (
                <div
                  key={report.id}
                  className="glass-card p-4 flex items-center justify-between"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">
                      {report.title}
                    </h3>
                    <p className="text-sm text-gray-400">
                      Reported by {report.reporter} • {report.reason}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        report.status === "pending"
                          ? "bg-yellow-400/10 text-yellow-400"
                          : report.status === "investigating"
                            ? "bg-blue-400/10 text-blue-400"
                            : "bg-green-400/10 text-green-400"
                      }`}
                    >
                      {report.status.charAt(0).toUpperCase() +
                        report.status.slice(1)}
                    </div>
                    <Button className="btn-glow-cyan px-4">Review</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400/50" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 py-2 glass-card border-cyan-400/30"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left px-4 py-3 text-sm font-semibold text-gray-400">
                      User ID
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-gray-400">
                      Email
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-gray-400">
                      Status
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-white/10 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-4 py-3 text-white font-semibold">
                        {user.name}
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-sm">
                        {user.email}
                      </td>
                      <td className="px-4 py-3">
                        <div
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold ${
                            user.status === "active"
                              ? "bg-green-400/10 text-green-400"
                              : "bg-red-400/10 text-red-400"
                          }`}
                        >
                          {user.status === "active" ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            <Ban className="w-3 h-3" />
                          )}
                          {user.status.charAt(0).toUpperCase() +
                            user.status.slice(1)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <button className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold">
                          {user.status === "active" ? "Suspend" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Listings Tab */}
        {activeTab === "listings" && (
          <div className="glass-card p-8 text-center">
            <Package className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">
              Listings Management
            </h3>
            <p className="text-gray-400">
              Connect to backend to manage listings
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
