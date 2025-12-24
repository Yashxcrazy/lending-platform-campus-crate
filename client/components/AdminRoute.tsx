import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { BASE_URL, getAuthToken } from "@/lib/api";

/**
 * AdminRoute: checks user role via /api/auth/me and blocks access for non-admins.
 * Wrap admin pages with:
 *   <AdminRoute><AdminDashboard/></AdminRoute>
 *
 * This is a UI guard only; the backend must enforce admin-only access as well.
 */
export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          if (mounted) setIsAdmin(false);
          return;
        }
        const res = await fetch(`${BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          if (mounted) setIsAdmin(false);
          return;
        }
        const payload = await res.json();
        // payload.user may hold the user or payload itself depending on your /auth/me shape
        const user = payload.user || payload;
        if (mounted) setIsAdmin(user?.role === "admin" || user?.role === "manager");
      } catch (err) {
        if (mounted) setIsAdmin(false);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!isAdmin) return <Navigate to="/" replace />;
  return <>{children}</>;
}
