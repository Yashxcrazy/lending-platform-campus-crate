/**
 * API Service for CampusCrate Platform
 * This file provides all the API endpoints and methods for your backend.
 * Replace BASE_URL and API paths with your actual backend server.
 */

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === "true" || !import.meta.env.VITE_API_URL;

// Mock data for development without backend
const MOCK_LISTINGS: Listing[] = [
  {
    id: "1",
    title: "Python Textbook - Data Structures",
    description: "Comprehensive guide to data structures and algorithms. Great condition, barely used.",
    category: "books",
    dailyRate: 50,
    weeklyRate: 250,
    monthlyRate: 800,
    images: [],
    condition: "excellent",
    location: "Central Library",
    lenderId: "user-1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Oscilloscope - Digital Multimeter",
    description: "Digital oscilloscope perfect for electronics lab. Fully functional.",
    category: "lab-equipment",
    dailyRate: 200,
    weeklyRate: 1000,
    monthlyRate: 3000,
    images: [],
    condition: "good",
    location: "Physics Lab",
    lenderId: "user-2",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Scientific Calculator - Casio FX-991",
    description: "Advanced scientific calculator with programming functions.",
    category: "calculators",
    dailyRate: 30,
    weeklyRate: 150,
    monthlyRate: 500,
    images: [],
    condition: "excellent",
    location: "Student Center",
    lenderId: "user-3",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Error handler utility
const handleApiError = (error: any, operationName: string) => {
  console.warn(`API call failed (${operationName}):`, error?.message || error);
  if (USE_MOCK_DATA) {
    console.log(`Using mock data for: ${operationName}`);
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
  weeklyRate: number;
  monthlyRate: number;
  images: string[];
  condition: string;
  location: string;
  lenderId: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
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
      const response = await fetch(`${BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      handleApiError(error, "signup");
      return { success: false, error: "Backend not available. Check connection." };
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
      return { success: false, error: "Backend not available. Check connection." };
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
      const response = await fetch(`${BASE_URL}/auth/me`, {
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

export const listingsAPI = {
  getAll: async (
    category?: string,
    search?: string,
    minPrice?: number,
    maxPrice?: number,
    page: number = 1,
  ) => {
    if (USE_MOCK_DATA) {
      console.log("Using mock data for getAll listings");
      return {
        data: MOCK_LISTINGS,
        totalPages: 1,
        totalCount: MOCK_LISTINGS.length,
      };
    }

    try {
      const params = new URLSearchParams();
      if (category) params.append("category", category);
      if (search) params.append("search", search);
      if (minPrice) params.append("minPrice", minPrice.toString());
      if (maxPrice) params.append("maxPrice", maxPrice.toString());
      params.append("page", page.toString());

      const response = await fetch(`${BASE_URL}/listings?${params}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      handleApiError(error, "getAll");
      // Return mock data if API fails
      return {
        data: MOCK_LISTINGS,
        totalPages: 1,
        totalCount: MOCK_LISTINGS.length,
      };
    }
  },

  getById: async (id: string) => {
    if (USE_MOCK_DATA) {
      console.log(`Using mock data for getById listing ${id}`);
      return MOCK_LISTINGS.find(l => l.id === id) || MOCK_LISTINGS[0] || null;
    }

    try {
      const response = await fetch(`${BASE_URL}/listings/${id}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      handleApiError(error, `getById(${id})`);
      // Return mock listing if API fails
      return MOCK_LISTINGS.find(l => l.id === id) || MOCK_LISTINGS[0] || null;
    }
  },

  create: async (listing: Omit<Listing, "id" | "createdAt" | "updatedAt">) => {
    try {
      const response = await fetch(`${BASE_URL}/listings`, {
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
      const response = await fetch(`${BASE_URL}/listings/${id}`, {
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
      const response = await fetch(`${BASE_URL}/listings/${id}`, {
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
    if (USE_MOCK_DATA) {
      console.log("Using mock data for getMyListings");
      return { data: MOCK_LISTINGS };
    }

    try {
      const response = await fetch(`${BASE_URL}/listings/user/my-listings`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      handleApiError(error, "getMyListings");
      return { data: MOCK_LISTINGS };
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
      const response = await fetch(`${BASE_URL}/bookings`, {
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
      const response = await fetch(`${BASE_URL}/bookings/${id}`, {
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
    if (USE_MOCK_DATA) {
      console.log("Using mock data for getMyRentals");
      return { data: [] };
    }

    try {
      const response = await fetch(`${BASE_URL}/bookings/user/rentals`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      handleApiError(error, "getMyRentals");
      return { data: [] };
    }
  },

  getMyBookings: async () => {
    if (USE_MOCK_DATA) {
      console.log("Using mock data for getMyBookings");
      return { data: [] };
    }

    try {
      const response = await fetch(`${BASE_URL}/bookings/user/bookings`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      handleApiError(error, "getMyBookings");
      return { data: [] };
    }
  },

  updateStatus: async (id: string, status: Booking["status"]) => {
    try {
      const response = await fetch(`${BASE_URL}/bookings/${id}/status`, {
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
      const response = await fetch(`${BASE_URL}/bookings/${id}/cancel`, {
        method: "POST",
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
    const response = await fetch(`${BASE_URL}/messages/booking/${bookingId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.json();
  },

  send: async (bookingId: string, content: string) => {
    const response = await fetch(`${BASE_URL}/messages`, {
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
