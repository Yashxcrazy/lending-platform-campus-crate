/**
 * API Service for CampusCrate Platform
 * This file provides all the API endpoints and methods for your backend.
 * Replace BASE_URL and API paths with your actual backend server.
 */

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

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
    const response = await fetch(`${BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });
    return response.json();
  },

  login: async (email: string, password: string) => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  logout: async () => {
    const response = await fetch(`${BASE_URL}/auth/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.json();
  },

  verifyEmail: async (token: string) => {
    const response = await fetch(`${BASE_URL}/auth/verify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    return response.json();
  },

  getCurrentUser: async () => {
    const response = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.json();
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
    const params = new URLSearchParams();
    if (category) params.append("category", category);
    if (search) params.append("search", search);
    if (minPrice) params.append("minPrice", minPrice.toString());
    if (maxPrice) params.append("maxPrice", maxPrice.toString());
    params.append("page", page.toString());

    const response = await fetch(`${BASE_URL}/listings?${params}`);
    return response.json();
  },

  getById: async (id: string) => {
    const response = await fetch(`${BASE_URL}/listings/${id}`);
    return response.json();
  },

  create: async (listing: Omit<Listing, "id" | "createdAt" | "updatedAt">) => {
    const response = await fetch(`${BASE_URL}/listings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(listing),
    });
    return response.json();
  },

  update: async (id: string, updates: Partial<Listing>) => {
    const response = await fetch(`${BASE_URL}/listings/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(updates),
    });
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`${BASE_URL}/listings/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.json();
  },

  getMyListings: async () => {
    const response = await fetch(`${BASE_URL}/listings/user/my-listings`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.json();
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
    const response = await fetch(`${BASE_URL}/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(booking),
    });
    return response.json();
  },

  getById: async (id: string) => {
    const response = await fetch(`${BASE_URL}/bookings/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.json();
  },

  getMyRentals: async () => {
    const response = await fetch(`${BASE_URL}/bookings/user/rentals`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.json();
  },

  getMyBookings: async () => {
    const response = await fetch(`${BASE_URL}/bookings/user/bookings`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.json();
  },

  updateStatus: async (id: string, status: Booking["status"]) => {
    const response = await fetch(`${BASE_URL}/bookings/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ status }),
    });
    return response.json();
  },

  cancel: async (id: string) => {
    const response = await fetch(`${BASE_URL}/bookings/${id}/cancel`, {
      method: "POST",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.json();
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
