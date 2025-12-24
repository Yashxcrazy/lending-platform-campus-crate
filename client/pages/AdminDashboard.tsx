import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package, Search, CheckCircle2 } from "lucide-react";
import { BASE_URL, getAuthToken, User, adminAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useCurrentUser } from "@/hooks/useAPI";

const formatDate = (value?: string | Date) => {
  if (!value) return "—";
  const date = typeof value === 'string' ? new Date(value) : value;
  return isNaN(date.getTime()) ? "—" : date.toLocaleString();
};

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
  const { data: currentUser } = useCurrentUser();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'banned' | 'inactive'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'bannedUntil'>('newest');

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
  const [banningFor, setBanningFor] = useState<string | null>(null);
  const [deletingFor, setDeletingFor] = useState<string | null>(null);
  const [verifyingFor, setVerifyingFor] = useState<string | null>(null);
  const [resettingFor, setResettingFor] = useState<string | null>(null);
  // Admin Items state
  const [items, setItems] = useState<any[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [reports, setReports] = useState<any[]>([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);

  // Fetch stats
  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const res: any = await adminAPI.getStats();
      if (res.success && res.stats) {
        setStats(res.stats);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

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
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchAllUsers();
    }
    if (activeTab === 'listings') {
      fetchAdminItems();
    }
    if (activeTab === 'reports') {
      fetchReports();
    }
  }, [activeTab]);

  const fetchAdminItems = async () => {
    setLoadingItems(true);
    try {
      const res: any = await adminAPI.listItems({ page: 1, limit: 50 });
      setItems(res.items || []);
    } catch (err) {
      console.error('Failed to fetch items:', err);
      setItems([]);
    } finally {
      setLoadingItems(false);
    }
  };

  const fetchReports = async () => {
    setLoadingReports(true);
    try {
      const res: any = await adminAPI.getReports({ page: 1, limit: 50 });
      setReports(res.reports || []);
    } catch (err) {
      console.error('Failed to fetch reports:', err);
      setReports([]);
    } finally {
      setLoadingReports(false);
    }
  };

  // Helper to get consistent user ID (supports both MongoDB _id and standard id)
  const getUserId = (user: User): string => {
    return (user as any)._id || user.id;
  };

  const isManager = currentUser?.role === 'manager';
  const canModerate = (role?: string) => isManager || (currentUser?.role === 'admin' && role === 'user');
  const canChangeRoles = isManager;

  // Promote / demote user
  const setRole = async (id: string, role: "admin" | "user" | "manager") => {
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

  const banUser = async (id: string) => {
    setBanningFor(id);
    try {
      await adminAPI.banUser(id, { reason: 'Policy violation' });
      await fetchAllUsers();
      toast({ title: 'User banned', description: 'The user has been banned.' });
    } catch (err) {
      console.error('Failed to ban user:', err);
      toast({ title: 'Error', description: 'Failed to ban user', variant: 'destructive' });
    } finally {
      setBanningFor(null);
    }
  };

  const unbanUser = async (id: string) => {
    setBanningFor(id);
    try {
      await adminAPI.unbanUser(id);
      await fetchAllUsers();
      toast({ title: 'User unbanned', description: 'The user has been unbanned.' });
    } catch (err) {
      console.error('Failed to unban user:', err);
      toast({ title: 'Error', description: 'Failed to unban user', variant: 'destructive' });
    } finally {
      setBanningFor(null);
    }
  };

  const deleteUser = async (id: string) => {
    setDeletingFor(id);
    try {
      await adminAPI.deleteUser(id);
      await fetchAllUsers();
      toast({ title: 'User deleted', description: 'The user has been deleted.' });
    } catch (err) {
      console.error('Failed to delete user:', err);
      toast({ title: 'Error', description: 'Failed to delete user', variant: 'destructive' });
    } finally {
      setDeletingFor(null);
    }
  };

  const verifyUser = async (id: string) => {
    setVerifyingFor(id);
    try {
      await adminAPI.verifyUser(id);
      await fetchAllUsers();
      toast({ title: 'User verified', description: 'Verification updated.' });
    } catch (err) {
      console.error('Failed to verify user:', err);
      toast({ title: 'Error', description: 'Failed to verify user', variant: 'destructive' });
    } finally {
      setVerifyingFor(null);
    }
  };

  const resetPassword = async (id: string) => {
    const newPassword = window.prompt('Enter new password (min 8 chars)');
    if (!newPassword || newPassword.length < 8) return;
    setResettingFor(id);
    try {
      await adminAPI.resetUserPassword(id, newPassword);
      toast({ title: 'Password reset', description: 'User password has been reset.' });
    } catch (err) {
      console.error('Failed to reset password:', err);
      toast({ title: 'Error', description: 'Failed to reset password', variant: 'destructive' });
    } finally {
      setResettingFor(null);
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
                <div className="flex items-center gap-3 w-full max-w-xl justify-end">
                  <div className="relative w-72">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400/50" />
                    <Input
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 py-2 glass-card border-cyan-400/30"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="glass-card border border-white/10 rounded-md px-3 py-2 text-sm text-white bg-white/5"
                  >
                    <option value="all" className="bg-slate-900">All statuses</option>
                    <option value="active" className="bg-slate-900">Active</option>
                    <option value="banned" className="bg-slate-900">Banned</option>
                    <option value="inactive" className="bg-slate-900">Inactive</option>
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="glass-card border border-white/10 rounded-md px-3 py-2 text-sm text-white bg-white/5"
                  >
                    <option value="newest" className="bg-slate-900">Newest</option>
                    <option value="bannedUntil" className="bg-slate-900">Banned until</option>
                  </select>
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
                        <th className="text-left px-4 py-3 text-sm font-semibold text-gray-400">Status</th>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-gray-400">Verification</th>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-gray-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users
                        .filter((u) => {
                          const matchesSearch = `${u.name} ${u.email}`.toLowerCase().includes(searchQuery.toLowerCase());
                          if (!matchesSearch) return false;
                          if (statusFilter === 'banned') return !!u.isBanned;
                          if (statusFilter === 'inactive') return u.isActive === false && !u.isBanned;
                          if (statusFilter === 'active') return u.isActive !== false && !u.isBanned;
                          return true;
                        })
                        .sort((a, b) => {
                          if (sortBy === 'bannedUntil') {
                            const aTime = a.bannedUntil ? new Date(a.bannedUntil).getTime() : 0;
                            const bTime = b.bannedUntil ? new Date(b.bannedUntil).getTime() : 0;
                            return bTime - aTime;
                          }
                          // default newest by createdAt
                          const aTime = (a as any).createdAt ? new Date((a as any).createdAt).getTime() : 0;
                          const bTime = (b as any).createdAt ? new Date((b as any).createdAt).getTime() : 0;
                          return bTime - aTime;
                        })
                        .map((u) => {
                          const userId = getUserId(u);
                          const statusLabel = u.isBanned ? 'Banned' : (u.isActive === false ? 'Inactive' : 'Active');
                          const statusClass = u.isBanned
                            ? 'bg-red-500/10 text-red-400'
                            : u.isActive === false
                              ? 'bg-gray-400/10 text-gray-300'
                              : 'bg-green-400/10 text-green-400';
                          return (
                            <tr key={userId} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                              <td className="px-4 py-3 text-white font-semibold">{u.name}</td>
                              <td className="px-4 py-3 text-gray-400 text-sm">{u.email}</td>
                              <td className="px-4 py-3">
                                <span className={`inline-flex items-center gap-2 px-2 py-1 rounded text-xs font-bold ${u.role === "admin" ? "bg-green-400/10 text-green-400" : u.role === 'manager' ? 'bg-purple-400/10 text-purple-300' : "bg-gray-400/10 text-gray-300"}`}>
                                  {u.role}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`inline-flex items-center gap-2 px-2 py-1 rounded text-xs font-bold ${statusClass}`}>
                                  {statusLabel}
                                </span>
                                {u.isBanned && (
                                  <div className="text-xs text-red-300 mt-1">
                                    {u.banReason || 'Policy violation'}
                                    {u.bannedUntil && ` (until ${formatDate(u.bannedUntil)})`}
                                  </div>
                                )}
                              </td>
                              <td className="px-4 py-3 text-gray-300 text-sm">
                                {u.isVerified ? (
                                  <span className="inline-flex items-center gap-1 text-green-400 font-semibold text-xs">
                                    <CheckCircle2 className="w-4 h-4" /> Verified
                                  </span>
                                ) : (
                                  <span className="text-yellow-300 text-xs">Pending</span>
                                )}
                              </td>
                              <td className="px-4 py-3 flex gap-2 flex-wrap">
                                {canChangeRoles && (
                                  <div className="flex gap-2 flex-wrap">
                                    {u.role === "manager" ? (
                                      <Button
                                        variant="outline"
                                        onClick={() => setRole(userId, "admin")}
                                        disabled={changingRoleFor === userId}
                                      >
                                        {changingRoleFor === userId ? "Updating..." : "Set Admin"}
                                      </Button>
                                    ) : u.role === "admin" ? (
                                      <Button
                                        variant="outline"
                                        onClick={() => setRole(userId, "user")}
                                        disabled={changingRoleFor === userId}
                                      >
                                        {changingRoleFor === userId ? "Updating..." : "Remove Admin"}
                                      </Button>
                                    ) : (
                                      <>
                                        <Button
                                          onClick={() => setRole(userId, "admin")}
                                          disabled={changingRoleFor === userId}
                                        >
                                          {changingRoleFor === userId ? "Updating..." : "Make Admin"}
                                        </Button>
                                        <Button
                                          variant="outline"
                                          onClick={() => setRole(userId, "manager")}
                                          disabled={changingRoleFor === userId}
                                        >
                                          {changingRoleFor === userId ? "Updating..." : "Make Manager"}
                                        </Button>
                                      </>
                                    )}
                                  </div>
                                )}
                                <Button
                                  variant="outline"
                                  onClick={() => verifyUser(userId)}
                                  disabled={verifyingFor === userId || !canModerate(u.role)}
                                >
                                  {verifyingFor === userId ? 'Verifying...' : 'Verify'}
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => resetPassword(userId)}
                                  disabled={resettingFor === userId || !canModerate(u.role)}
                                >
                                  {resettingFor === userId ? 'Resetting...' : 'Reset Password'}
                                </Button>
                                {u.isBanned ? (
                                  <Button
                                    variant="outline"
                                    onClick={() => unbanUser(userId)}
                                    disabled={banningFor === userId || !canModerate(u.role)}
                                  >
                                    {banningFor === userId ? 'Working...' : 'Unban'}
                                  </Button>
                                ) : (
                                  <Button
                                    variant="destructive"
                                    onClick={() => banUser(userId)}
                                    disabled={banningFor === userId || !canModerate(u.role)}
                                  >
                                    {banningFor === userId ? 'Working...' : 'Ban'}
                                  </Button>
                                )}
                                <Button
                                  variant="outline"
                                  onClick={() => deleteUser(userId)}
                                  disabled={deletingFor === userId || !canModerate(u.role)}
                                >
                                  {deletingFor === userId ? 'Deleting...' : 'Delete'}
                                </Button>
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
          <div className="space-y-6">
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold text-white mb-6">Platform Overview</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-cyan-400 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="glass-card p-4 border-cyan-400/20">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-semibold">Total Platform Users</span>
                        <span className="text-2xl font-bold text-cyan-400">{stats.totalUsers}</span>
                      </div>
                    </div>
                    <div className="glass-card p-4 border-blue-400/20">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-semibold">Active Listings</span>
                        <span className="text-2xl font-bold text-blue-400">{stats.totalListings}</span>
                      </div>
                    </div>
                    <div className="glass-card p-4 border-purple-400/20">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-semibold">Total Bookings</span>
                        <span className="text-2xl font-bold text-purple-400">{stats.totalBookings}</span>
                      </div>
                    </div>
                    <div className="glass-card p-4 border-red-400/20">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-semibold">Pending Reports</span>
                        <span className="text-2xl font-bold text-red-400">{stats.reportedItems}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-cyan-400 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => setActiveTab('users')}
                      className="w-full glass-card p-4 text-left hover:bg-white/10 transition-all border-cyan-400/20"
                    >
                      <div className="font-semibold text-white">Manage Users</div>
                      <div className="text-sm text-gray-400">View and moderate platform users</div>
                    </button>
                    <button
                      onClick={() => setActiveTab('listings')}
                      className="w-full glass-card p-4 text-left hover:bg-white/10 transition-all border-blue-400/20"
                    >
                      <div className="font-semibold text-white">Manage Listings</div>
                      <div className="text-sm text-gray-400">Review and moderate item listings</div>
                    </button>
                    <button
                      onClick={() => setActiveTab('reports')}
                      className="w-full glass-card p-4 text-left hover:bg-white/10 transition-all border-red-400/20"
                    >
                      <div className="font-semibold text-white">View Reports</div>
                      <div className="text-sm text-gray-400">{stats.reportedItems} pending reports</div>
                    </button>
                    <button
                      onClick={fetchStats}
                      className="w-full btn-glow-cyan flex items-center justify-center gap-2"
                      disabled={loadingStats}
                    >
                      {loadingStats ? 'Refreshing...' : 'Refresh Stats'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "reports" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Manage Reports</h2>
              <Button onClick={fetchReports} variant="outline">Refresh</Button>
            </div>
            <div className="glass-card p-6">
              {loadingReports ? (
                <div>Loading reports...</div>
              ) : reports.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No reports found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left px-4 py-3 text-sm font-semibold text-gray-400">Reporter</th>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-gray-400">Type</th>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-gray-400">Reason</th>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-gray-400">Status</th>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-gray-400">Date</th>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-gray-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reports.map((report: any) => (
                        <tr key={report._id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                          <td className="px-4 py-3 text-white text-sm">{report.reporter?.name || '—'}</td>
                          <td className="px-4 py-3 text-gray-400 text-sm">
                            {report.reportedItem ? 'Item' : report.reportedUser ? 'User' : '—'}
                          </td>
                          <td className="px-4 py-3 text-gray-400 text-sm">{report.reason}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-2 px-2 py-1 rounded text-xs font-bold ${
                              report.status === 'Pending' ? 'bg-yellow-400/10 text-yellow-400' :
                              report.status === 'Reviewing' ? 'bg-blue-400/10 text-blue-400' :
                              report.status === 'Resolved' ? 'bg-green-400/10 text-green-400' :
                              'bg-gray-400/10 text-gray-300'
                            }`}>
                              {report.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-400 text-sm">
                            {new Date(report.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 flex gap-2">
                            {report.status === 'Pending' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={async () => {
                                    if (confirm('Resolve this report?')) {
                                      await adminAPI.resolveReport(report._id, 'Resolved');
                                      await fetchReports();
                                      toast({ title: 'Report resolved' });
                                    }
                                  }}
                                >
                                  Resolve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={async () => {
                                    if (confirm('Dismiss this report?')) {
                                      await adminAPI.resolveReport(report._id, 'Dismissed');
                                      await fetchReports();
                                      toast({ title: 'Report dismissed' });
                                    }
                                  }}
                                >
                                  Dismiss
                                </Button>
                              </>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={async () => {
                                if (confirm('Delete this report?')) {
                                  await adminAPI.deleteReport(report._id);
                                  await fetchReports();
                                  toast({ title: 'Report deleted' });
                                }
                              }}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "listings" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Manage Listings</h2>
              <Button onClick={fetchAdminItems} variant="outline">Refresh</Button>
            </div>
            <div className="glass-card p-6">
              {loadingItems ? (
                <div>Loading items...</div>
              ) : items.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No items found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left px-4 py-3 text-sm font-semibold text-gray-400">Title</th>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-gray-400">Owner</th>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-gray-400">Status</th>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-gray-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item: any) => (
                        <tr key={item._id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                          <td className="px-4 py-3 text-white font-semibold">{item.title}</td>
                          <td className="px-4 py-3 text-gray-400 text-sm">{item.owner?.name || '—'}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-2 px-2 py-1 rounded text-xs font-bold ${item.isActive ? 'bg-green-400/10 text-green-400' : 'bg-gray-400/10 text-gray-300'}`}>
                              {item.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {item.isActive ? (
                              <Button
                                variant="outline"
                                onClick={async () => {
                                  await adminAPI.deactivateItem(item._id);
                                  await fetchAdminItems();
                                }}
                              >
                                Deactivate
                              </Button>
                            ) : (
                              <span className="text-gray-500 text-sm">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
