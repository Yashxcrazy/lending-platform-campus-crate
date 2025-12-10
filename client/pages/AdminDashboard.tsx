import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package, Search } from "lucide-react";
import { BASE_URL, getAuthToken, User } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

/**
 * AdminDashboard (real data)
 * - Fetches users from GET ${BASE_URL}/admin/users (admin-only)
 * - Promotes / demotes users via PUT ${BASE_URL}/admin/users/:id/role
 *
 * Replace the old mock-data AdminDashboard with this file.
 * Backend endpoints must exist and be protected by auth + isAdmin middleware.
 */

export default function AdminDashboard() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");

  // Stats (optional backend endpoints can populate these)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalListings: 0,
    totalBookings: 0,
    reportedItems: 0,
  });

  // Real data
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [changingRoleFor, setChangingRoleFor] = useState<string | null>(null);

  // Fetch users (admin-only endpoint)
  const fetchAllUsers = async () => {
    setLoadingUsers(true);
    try {
      const token = getAuthToken();
      const res = await fetch(`${BASE_URL}/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        console.error("Failed to fetch users:", await res.text());
        setUsers([]);
        return;
      }
      const payload = await res.json();
      setUsers(payload.users || []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
    // Optionally fetch stats if your backend exposes endpoints
  }, []);

  // Helper to get consistent user ID (supports both MongoDB _id and standard id)
  const getUserId = (user: User): string => {
    return (user as any)._id || user.id;
  };

  // Promote / demote user
  const setRole = async (id: string, role: "admin" | "user") => {
    setChangingRoleFor(id);
    try {
      const token = getAuthToken();
      const res = await fetch(`${BASE_URL}/admin/users/${id}/role`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) {
        const txt = await res.text();
        console.error("Failed to change role:", txt);
        toast({
          title: "Error",
          description: "Failed to change role: " + (txt || res.status),
          variant: "destructive",
        });
        return;
      }
      await fetchAllUsers();
      toast({
        title: "Success",
        description: `User role updated to ${role}`,
      });
    } catch (err) {
      console.error("Failed to change role:", err);
      toast({
        title: "Error",
        description: "Failed to change role",
        variant: "destructive",
      });
    } finally {
      setChangingRoleFor(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container-center max-w-6xl py-8 px-4">
        <div className="mb-8">
          <h1 className="marvel-title mb-2">Admin Dashboard</h1>
          <p className="marvel-subtitle">Manage users, listings, and reports</p>
        </div>

        {/* Stats Grid (kept simple) */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {[
            { label: "Total Users", value: stats.totalUsers },
            { label: "Total Listings", value: stats.totalListings },
            { label: "Total Bookings", value: stats.totalBookings },
            { label: "Reported Items", value: stats.reportedItems },
          ].map((stat, idx) => (
            <div key={idx} className="glass-card p-6 neon-border-cyan bg-cyan-400/10">
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
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
                activeTab === tab.id ? "neon-border-cyan bg-cyan-400/20" : "glass-card border-white/10 hover:border-white/20"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Manage Admins panel (under Users tab) */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Manage Admins</h2>
                <div className="w-80">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400/50" />
                    <Input
                      placeholder="Filter users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 py-2 glass-card border-cyan-400/30"
                    />
                  </div>
                </div>
              </div>

              {loadingUsers ? (
                <div>Loading users...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left px-4 py-3 text-sm font-semibold text-gray-400">Name</th>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-gray-400">Email</th>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-gray-400">Role</th>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-gray-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users
                        .filter((u) => {
                          if (!searchQuery) return true;
                          return `${u.name} ${u.email}`.toLowerCase().includes(searchQuery.toLowerCase());
                        })
                        .map((u) => {
                          const userId = getUserId(u);
                          return (
                            <tr key={userId} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                              <td className="px-4 py-3 text-white font-semibold">{u.name}</td>
                              <td className="px-4 py-3 text-gray-400 text-sm">{u.email}</td>
                              <td className="px-4 py-3">
                                <span className={`inline-flex items-center gap-2 px-2 py-1 rounded text-xs font-bold ${u.role === "admin" ? "bg-green-400/10 text-green-400" : "bg-gray-400/10 text-gray-300"}`}>
                                  {u.role}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                {u.role === "admin" ? (
                                  <Button
                                    variant="outline"
                                    onClick={() => setRole(userId, "user")}
                                    disabled={changingRoleFor === userId}
                                  >
                                    {changingRoleFor === userId ? "Updating..." : "Remove Admin"}
                                  </Button>
                                ) : (
                                  <Button
                                    onClick={() => setRole(userId, "admin")}
                                    disabled={changingRoleFor === userId}
                                  >
                                    {changingRoleFor === userId ? "Updating..." : "Make Admin"}
                                  </Button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Placeholder views for other tabs */}
        {activeTab === "overview" && (
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white">Overview</h2>
            <p className="text-gray-400">Platform overview and charts (implement backend analytics endpoints to populate)</p>
          </div>
        )}

        {activeTab === "reports" && (
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white">Reports</h2>
            <p className="text-gray-400">Reports - implement GET ${BASE_URL}/admin/reports (optional)</p>
          </div>
        )}

        {activeTab === "listings" && (
          <div className="glass-card p-8 text-center">
            <Package className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Listings Management</h3>
            <p className="text-gray-400">Connect to backend to manage listings</p>
          </div>
        )}
      </div>
    </div>
  );
}
