/**
 * API Service for CampusCrate Platform
 * This file provides all the API endpoints and methods for your backend.
 * Replace BASE_URL and API paths with your actual backend server.
 */

export const BASE_URL = import.meta.env.VITE_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app') 
    ? 'https://campus-crate-backend.onrender.com/api' 
    : '/api');

// Error handler utility
const handleApiError = (error: any, operationName: string) => {
  console.error(`❌ API call failed (${operationName}):`, error?.message || error);
  if (error instanceof TypeError && error.message.includes('fetch')) {
    console.error('   Network error - backend may be unreachable');
  }
};

// Health check utility - call on app startup
export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const healthUrl = BASE_URL.replace('/api', '') + '/health';
    console.log('🏥 Checking backend health at:', healthUrl);
    
    const response = await fetch(healthUrl, {
      method: 'GET',
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend is healthy:', data.message || 'OK');
      return true;
    } else {
      console.warn('⚠️  Backend responded but returned:', response.status);
      return false;
    }
  } catch (error) {
    console.error('❌ Backend health check failed:', error instanceof Error ? error.message : error);
    console.error('   Make sure VITE_API_URL is set correctly and backend is running');
    console.error('   Current API URL:', BASE_URL);
    return false;
  }
};

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
  role?: "admin" | "user";
  profileImage?: string;
  rating: number;
  reviewCount: number;
  createdAt: string;
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
  signup: async (email: string, password: string, name: string) => {
    try {
      console.log('🔐 Attempting signup at:', `${BASE_URL}/auth/register`);
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Signup failed:', response.status, errorData);
        throw new Error(errorData.message || errorData.error || `HTTP ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Signup successful');
      return data;
    } catch (error) {
      handleApiError(error, "signup");
      
      // Return user-friendly error message
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return {
          success: false,
          error: "Cannot connect to backend. Please check your network connection and ensure the backend server is running.",
        };
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : "Signup failed. Please try again.",
      };
    }
  },

  login: async (email: string, password: string) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      handleApiError(error, "login");
      return {
        success: false,
        error: "Backend not available. Check connection.",
      };
    }
  },

  logout: async () => {
    try {
      const response = await fetch(`${BASE_URL}/auth/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      handleApiError(error, "logout");
      return { success: true };
    }
  },

  verifyEmail: async (token: string) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      handleApiError(error, "verifyEmail");
      return { success: false, error: "Email verification failed" };
    }
  },

  getCurrentUser: async () => {
    try {
  const response = await fetch(`${BASE_URL}/items?owner=me`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      handleApiError(error, "getCurrentUser");
      return null;
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
      if (minPrice) params.append("minDailyRate", minPrice.toString());
      if (maxPrice) params.append("maxDailyRate", maxPrice.toString());
      params.append("page", page.toString());

      const response = await fetch(`${BASE_URL}/items?${params}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();

      return {
        data: Array.isArray(data.items) ? data.items.map(transformItem) : [],
        totalPages: data.totalPages || 1,
        totalCount: data.totalCount || 0,
      };
    } catch (error) {
      handleApiError(error, "getAll");
      throw error;
    }
  },

  getById: async (id: string) => {
    try {
      const response = await fetch(`${BASE_URL}/items/${id}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const item = await response.json();
      return transformItem(item);
    } catch (error) {
      handleApiError(error, `getById(${id})`);
      throw error;
    }
  },

  create: async (listing: Omit<Listing, "id" | "createdAt" | "updatedAt">) => {
    try {
      const response = await fetch(`${BASE_URL}/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(listing),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      handleApiError(error, "create");
      return { success: false, error: "Failed to create listing" };
    }
  },

  update: async (id: string, updates: Partial<Listing>) => {
    try {
      const response = await fetch(`${BASE_URL}/items/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      handleApiError(error, `update(${id})`);
      return { success: false, error: "Failed to update listing" };
    }
  },

  delete: async (id: string) => {
    try {
      const response = await fetch(`${BASE_URL}/items/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      handleApiError(error, `delete(${id})`);
      return { success: false, error: "Failed to delete listing" };
    }
  },

  getMyListings: async () => {
    try {
      const response = await fetch(`${BASE_URL}/items?owner=me`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      handleApiError(error, "getMyListings");
      throw error;
    }
  },
};

// ============================================================================
// Users API
// ============================================================================

export const usersAPI = {
  getProfile: async (userId: string) => {
    const response = await fetch(`${BASE_URL}/users/${userId}`);
    return response.json();
  },

  updateProfile: async (updates: Partial<User>) => {
    const response = await fetch(`${BASE_URL}/users/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(updates),
    });
    return response.json();
  },

  getReviews: async (userId: string) => {
    const response = await fetch(`${BASE_URL}/users/${userId}/reviews`);
    return response.json();
  },
};

// ============================================================================
// Bookings API
// ============================================================================

export const bookingsAPI = {
  create: async (booking: Omit<Booking, "id" | "createdAt" | "updatedAt">) => {
    try {
      const response = await fetch(`${BASE_URL}/lending/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(booking),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      handleApiError(error, "create booking");
      return { success: false, error: "Failed to create booking" };
    }
  },

  getById: async (id: string) => {
    try {
      const response = await fetch(`${BASE_URL}/lending/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      handleApiError(error, `getBooking(${id})`);
      return null;
    }
  },

  getMyRentals: async () => {
    try {
      const response = await fetch(`${BASE_URL}/lending/my-requests`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      handleApiError(error, "getMyRentals");
      throw error;
    }
  },

  getMyBookings: async () => {
    try {
      const response = await fetch(`${BASE_URL}/lending/my-requests`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      handleApiError(error, "getMyBookings");
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
      const response = await fetch(`${BASE_URL}/lending/${id}/${endpoint}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      handleApiError(error, `updateStatus(${id})`);
      return { success: false, error: "Failed to update booking status" };
    }
  },

  cancel: async (id: string) => {
    try {
      const response = await fetch(`${BASE_URL}/lending/${id}/reject`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      handleApiError(error, `cancel(${id})`);
      return { success: false, error: "Failed to cancel booking" };
    }
  },
};

// ============================================================================
// Anonymous Messaging API
// ============================================================================

export const messagesAPI = {
  getForBooking: async (bookingId: string) => {
    const response = await fetch(`${BASE_URL}/lending/${bookingId}/messages`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.json();
  },

  send: async (bookingId: string, content: string) => {
    const response = await fetch(`${BASE_URL}/lending/${bookingId}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ bookingId, content }),
    });
    return response.json();
  },
};

// ============================================================================
// Reviews API
// ============================================================================

export const reviewsAPI = {
  create: async (review: Omit<Review, "id" | "createdAt">) => {
    const response = await fetch(`${BASE_URL}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(review),
    });
    return response.json();
  },

  getForUser: async (userId: string) => {
    const response = await fetch(`${BASE_URL}/reviews/user/${userId}`);
    return response.json();
  },
};

// ============================================================================
// Helper function to set token
// ============================================================================

export const setAuthToken = (token: string) => {
  localStorage.setItem("token", token);
};

export const getAuthToken = () => {
  return localStorage.getItem("token");
};

export const clearAuthToken = () => {
  localStorage.removeItem("token");
};
