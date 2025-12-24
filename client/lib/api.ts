/**
 * API Service for CampusCrate Platform
 * This file provides all the API endpoints and methods for your backend.
 * Uses centralized fetcher for consistent error handling and authentication.
 */

import { get, post, put, del, ApiError, BASE_URL, auth } from './fetcher';

export { BASE_URL, ApiError };

// ============================================================================
// Types
// ============================================================================

export interface Listing {
  id: string;
  title: string;
  description: string;
  category: string;
  dailyRate: number;
  weeklyRate?: number; // derived from dailyRate on the client
  monthlyRate?: number; // derived from dailyRate on the client
  securityDeposit?: number;
  images: string[];
  condition: string;
  availability?: string;
  bookingCount?: number;
  location:
    | string
    | {
        address?: string;
        campus?: string;
        coordinates?: { lat?: number; lng?: number };
      };
  lenderId?: string; // set by server from auth token
  owner?: string; // backend uses owner/ownerId
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role?: "admin" | "user" | "manager";
  profileImage?: string;
  rating: number;
  reviewCount: number;
  createdAt: string;
  isActive?: boolean;
  isBanned?: boolean;
  bannedUntil?: string;
  banReason?: string;
  lastActive?: string;
  isVerified?: boolean;
}

export interface Booking {
  id: string;
  listingId: string;
  borrowerId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: "pending" | "confirmed" | "active" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  bookingId: string;
  senderId: string;
  senderAnonymousId: string;
  content: string;
  createdAt: string;
}

export interface Review {
  id: string;
  bookingId: string;
  fromUserId: string;
  toUserId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// ============================================================================
// Auth API
// ============================================================================

export const authAPI = {
  signup: async (email: string, password: string, name: string, additionalData?: { phone?: string; campus?: string; studentId?: string }) => {
    try {
      return await post('/auth/register', { email, password, name, ...additionalData }, { skipAuth: true });
    } catch (error) {
      return {
        success: false,
        error: error instanceof ApiError ? error.message : "Backend not available. Check connection.",
      };
    }
  },

  login: async (email: string, password: string) => {
    try {
      return await post('/auth/login', { email, password }, { skipAuth: true });
    } catch (error) {
      if (error instanceof ApiError) {
        return {
          success: false,
          error: error.message,
          code: (error.data as any)?.code,
          until: (error.data as any)?.until,
          reason: (error.data as any)?.reason,
        };
      }
      return {
        success: false,
        error: "Backend not available. Check connection.",
      };
    }
  },

  logout: async () => {
    try {
      return await post('/auth/logout');
    } catch (error) {
      return { success: true };
    }
  },

  verifyEmail: async (token: string) => {
    try {
      return await post('/auth/verify-email', { token }, { skipAuth: true });
    } catch (error) {
      return { success: false, error: "Email verification failed" };
    }
  },

  getCurrentUser: async () => {
    try {
      return await get('/auth/me');
    } catch (error) {
      return null;
    }
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    try {
      return await post('/auth/change-password', { currentPassword, newPassword });
    } catch (error) {
      return { success: false, error: error instanceof ApiError ? error.message : 'Failed to change password' };
    }
  },
};

// ============================================================================
// Listings API
// ============================================================================

// Helper function to transform backend item to frontend listing
const transformItem = (item: any) => ({
  id: item._id || item.id,
  title: item.title,
  description: item.description,
  category: item.category,
  dailyRate: item.dailyRate,
  weeklyRate: item.dailyRate * 6, // Calculate from daily rate
  monthlyRate: item.dailyRate * 25, // Calculate from daily rate
  images: item.images || [],
  condition: item.condition,
  availability: item.availability,
  bookingCount: item.bookingCount,
  location:
    typeof item.location === "string"
      ? item.location
      : item.location?.address || "",
  lenderId: item.owner || item.ownerId,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
});

export const listingsAPI = {
  getAll: async (
    category?: string,
    search?: string,
    minPrice?: number,
    maxPrice?: number,
    page: number = 1,
  ) => {
    try {
      const params = new URLSearchParams();
      if (category) params.append("category", category);
      if (search) params.append("search", search);
      if (minPrice) params.append("minPrice", minPrice.toString());
      if (maxPrice) params.append("maxPrice", maxPrice.toString());
      params.append("page", page.toString());

      const data = await get(`/items?${params}`);

      return {
        data: Array.isArray(data.items) ? data.items.map(transformItem) : [],
        totalPages: data.totalPages || 1,
        totalCount: data.totalCount || 0,
      };
    } catch (error) {
      throw error;
    }
  },

  getById: async (id: string) => {
    try {
      const item = await get(`/items/${id}`);
      return transformItem(item);
    } catch (error) {
      throw error;
    }
  },

  create: async (listing: Omit<Listing, "id" | "createdAt" | "updatedAt">) => {
    try {
      return await post('/items', listing);
    } catch (error) {
      return { success: false, error: error instanceof ApiError ? error.message : "Failed to create listing" };
    }
  },

  update: async (id: string, updates: Partial<Listing>) => {
    try {
      return await put(`/items/${id}`, updates);
    } catch (error) {
      return { success: false, error: error instanceof ApiError ? error.message : "Failed to update listing" };
    }
  },

  delete: async (id: string) => {
    try {
      return await del(`/items/${id}`);
    } catch (error) {
      return { success: false, error: error instanceof ApiError ? error.message : "Failed to delete listing" };
    }
  },

  getMyListings: async () => {
    try {
      const data = await get('/items?owner=me&includeBookingCount=true');
      return {
        items: Array.isArray(data.items) ? data.items.map(transformItem) : [],
        data: Array.isArray(data.items) ? data.items.map(transformItem) : [],
        totalPages: data.totalPages || 1,
        totalCount: data.totalCount || 0,
      };
    } catch (error) {
      throw error;
    }
  },
};

// ============================================================================
// Users API
// ============================================================================

export const usersAPI = {
  getProfile: async (userId: string) => {
    return await get(`/users/${userId}`);
  },

  updateProfile: async (updates: Partial<User>) => {
    return await put('/users/profile', updates);
  },

  getReviews: async (userId: string) => {
    return await get(`/reviews/user/${userId}`);
  },

  getPreferences: async () => {
    try {
      return await get('/users/preferences');
    } catch (error) {
      throw error;
    }
  },

  updatePreferences: async (preferences: {
    notificationPreferences?: { email?: boolean; sms?: boolean };
    privacyPreferences?: { showEmail?: boolean; showPhone?: boolean };
  }) => {
    try {
      return await put('/users/preferences', preferences);
    } catch (error) {
      return { success: false, error: error instanceof ApiError ? error.message : 'Failed to update preferences' };
    }
  },

  deleteMe: async (password: string) => {
    try {
      return await post('/users/me/delete', { password });
    } catch (error) {
      return { success: false, error: error instanceof ApiError ? error.message : 'Failed to delete account' };
    }
  },
};

// ============================================================================
// Bookings API
// ============================================================================

export const bookingsAPI = {
  create: async (booking: Omit<Booking, "id" | "createdAt" | "updatedAt">) => {
    try {
      // Transform frontend booking format to backend lending request format
      const requestData = {
        itemId: booking.listingId,
        startDate: booking.startDate,
        endDate: booking.endDate,
        message: "" // Optional message field
      };
      
      return await post('/lending/request', requestData);
    } catch (error) {
      return { success: false, error: error instanceof ApiError ? error.message : "Failed to create booking" };
    }
  },

  getById: async (id: string) => {
    try {
      return await get(`/lending/${id}`);
    } catch (error) {
      return null;
    }
  },

  getMyRentals: async () => {
    try {
      const data = await get('/lending/my-rentals');
      return {
        data: Array.isArray(data?.data)
          ? data.data.map((r: any) => ({
              ...r,
              id: r._id || r.id,
              itemTitle: r.item?.title || r.itemTitle,
            }))
          : [],
      };
    } catch (error) {
      throw error;
    }
  },

  getMyBookings: async () => {
    try {
      const data = await get('/lending/my-requests?type=borrowing');
      return {
        data: Array.isArray(data?.data)
          ? data.data.map((r: any) => ({
              ...r,
              id: r._id || r.id,
              itemTitle: r.item?.title || r.itemTitle,
            }))
          : [],
      };
    } catch (error) {
      throw error;
    }
  },

  updateStatus: async (id: string, status: Booking["status"]) => {
    try {
      const endpoint =
        status === "confirmed" || status === "active"
          ? `accept`
          : status === "completed"
            ? `complete`
            : `reject`;
      return await post(`/lending/${id}/${endpoint}`, { status });
    } catch (error) {
      return { success: false, error: error instanceof ApiError ? error.message : "Failed to update booking status" };
    }
  },

  cancel: async (id: string, reason?: string) => {
    try {
      return await post(`/lending/${id}/reject`, { reason });
    } catch (error) {
      return { success: false, error: error instanceof ApiError ? error.message : "Failed to cancel booking" };
    }
  },
};

// ============================================================================
// Anonymous Messaging API
// ============================================================================

export const messagesAPI = {
  getForBooking: async (bookingId: string) => {
    return await get(`/lending/${bookingId}/messages`);
  },

  send: async (bookingId: string, content: string) => {
    return await post(`/lending/${bookingId}/messages`, { bookingId, content });
  },
};

// ============================================================================
// Reviews API
// ============================================================================

export const reviewsAPI = {
  create: async (review: Omit<Review, "id" | "createdAt">) => {
    return await post('/reviews', review);
  },

  getForUser: async (userId: string) => {
    return await get(`/reviews/user/${userId}`);
  },
};

// ============================================================================
// Reports API
// ============================================================================

export const reportsAPI = {
  create: async (report: { reportedItem?: string; reportedUser?: string; reason: string; description: string }) => {
    try {
      return await post('/reports', report);
    } catch (error) {
      return { success: false, error: error instanceof ApiError ? error.message : "Failed to create report" };
    }
  },

  getMyReports: async () => {
    try {
      return await get('/reports/my-reports');
    } catch (error) {
      return { success: false, error: error instanceof ApiError ? error.message : "Failed to fetch reports" };
    }
  },
};

// ============================================================================
// Helper functions - delegated to fetcher
// ============================================================================

export const setAuthToken = auth.setToken;
export const getAuthToken = auth.getToken;
export const clearAuthToken = auth.clearToken;

// ============================================================================
// Admin API
// ============================================================================

export const adminAPI = {
  getStats: async () => {
    try {
      return await get('/admin/stats');
    } catch (error) {
      return { success: false, error: error instanceof ApiError ? error.message : "Failed to fetch stats" };
    }
  },

  getUsers: async () => {
    try {
      return await get('/admin/users');
    } catch (error) {
      return { success: false, error: error instanceof ApiError ? error.message : "Failed to fetch users" };
    }
  },

  updateUserRole: async (userId: string, role: "user" | "admin" | "manager") => {
    try {
      return await put(`/admin/users/${userId}/role`, { role });
    } catch (error) {
      return { success: false, error: error instanceof ApiError ? error.message : "Failed to update user role" };
    }
  },

  verifyUser: async (userId: string) => {
    try {
      return await put(`/admin/users/${userId}/verify`);
    } catch (error) {
      return { success: false, error: error instanceof ApiError ? error.message : 'Failed to verify user' };
    }
  },

  resetUserPassword: async (userId: string, newPassword: string) => {
    try {
      return await put(`/admin/users/${userId}/reset-password`, { newPassword });
    } catch (error) {
      return { success: false, error: error instanceof ApiError ? error.message : 'Failed to reset password' };
    }
  },

  deactivateUser: async (userId: string) => {
    try {
      return await put(`/admin/users/${userId}/deactivate`);
    } catch (error) {
      return { success: false, error: error instanceof ApiError ? error.message : 'Failed to deactivate user' };
    }
  },

  banUser: async (userId: string, data?: { reason?: string; until?: string | Date }) => {
    try {
      return await put(`/admin/users/${userId}/ban`, data || {});
    } catch (error) {
      return { success: false, error: error instanceof ApiError ? error.message : 'Failed to ban user' };
    }
  },

  unbanUser: async (userId: string) => {
    try {
      return await put(`/admin/users/${userId}/unban`);
    } catch (error) {
      return { success: false, error: error instanceof ApiError ? error.message : 'Failed to unban user' };
    }
  },

  deleteUser: async (userId: string) => {
    try {
      return await del(`/admin/users/${userId}`);
    } catch (error) {
      return { success: false, error: error instanceof ApiError ? error.message : 'Failed to delete user' };
    }
  },

  listItems: async (params?: { isActive?: boolean; page?: number; limit?: number }) => {
    try {
      const search = new URLSearchParams();
      if (typeof params?.isActive !== 'undefined') search.append('isActive', String(params.isActive));
      if (params?.page) search.append('page', String(params.page));
      if (params?.limit) search.append('limit', String(params.limit));
      const suffix = search.toString() ? `?${search}` : '';
      return await get(`/admin/items${suffix}`);
    } catch (error) {
      return { success: false, error: error instanceof ApiError ? error.message : 'Failed to fetch items' };
    }
  },

  deactivateItem: async (itemId: string) => {
    try {
      return await put(`/admin/items/${itemId}/deactivate`);
    } catch (error) {
      return { success: false, error: error instanceof ApiError ? error.message : 'Failed to deactivate item' };
    }
  },

  deleteReview: async (reviewId: string) => {
    try {
      return await del(`/admin/reviews/${reviewId}`);
    } catch (error) {
      return { success: false, error: error instanceof ApiError ? error.message : 'Failed to delete review' };
    }
  },

  getReports: async (params?: { status?: string; page?: number; limit?: number }) => {
    try {
      const search = new URLSearchParams();
      if (params?.status) search.append('status', params.status);
      if (params?.page) search.append('page', String(params.page));
      if (params?.limit) search.append('limit', String(params.limit));
      const suffix = search.toString() ? `?${search}` : '';
      return await get(`/admin/reports${suffix}`);
    } catch (error) {
      return { success: false, error: error instanceof ApiError ? error.message : 'Failed to fetch reports' };
    }
  },

  resolveReport: async (reportId: string, status: 'Resolved' | 'Dismissed', adminNotes?: string) => {
    try {
      return await put(`/admin/reports/${reportId}/resolve`, { status, adminNotes });
    } catch (error) {
      return { success: false, error: error instanceof ApiError ? error.message : 'Failed to resolve report' };
    }
  },

  deleteReport: async (reportId: string) => {
    try {
      return await del(`/admin/reports/${reportId}`);
    } catch (error) {
      return { success: false, error: error instanceof ApiError ? error.message : 'Failed to delete report' };
    }
  },
};
