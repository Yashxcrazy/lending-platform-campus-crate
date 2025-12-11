import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listingsAPI,
  bookingsAPI,
  messagesAPI,
  usersAPI,
  authAPI,
  reviewsAPI,
  Listing,
  Booking,
  User,
  Message,
  Review,
} from "@/lib/api";

// ============================================================================
// Listings Hooks
// ============================================================================

export const useListings = (
  category?: string,
  search?: string,
  minPrice?: number,
  maxPrice?: number,
  page: number = 1,
) => {
  return useQuery({
    queryKey: ["listings", category, search, minPrice, maxPrice, page],
    queryFn: () =>
      listingsAPI.getAll(category, search, minPrice, maxPrice, page),
    retry: 1,
    retryDelay: 1000,
  });
};

export const useListing = (id: string) => {
  return useQuery({
    queryKey: ["listing", id],
    queryFn: () => listingsAPI.getById(id),
    retry: 1,
    retryDelay: 1000,
  });
};

export const useMyListings = () => {
  return useQuery({
    queryKey: ["myListings"],
    queryFn: () => listingsAPI.getMyListings(),
    retry: 1,
    retryDelay: 1000,
  });
};

export const useCreateListing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (listing: Omit<Listing, "id" | "createdAt" | "updatedAt">) =>
      listingsAPI.create(listing),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myListings"], refetchType: 'active' });
      queryClient.invalidateQueries({ queryKey: ["listings"], refetchType: 'active' });
    },
  });
};

export const useUpdateListing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Listing> }) =>
      listingsAPI.update(id, updates),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["listing", id], refetchType: 'active' });
      queryClient.invalidateQueries({ queryKey: ["myListings"], refetchType: 'active' });
      queryClient.invalidateQueries({ queryKey: ["listings"], refetchType: 'active' });
    },
  });
};

export const useDeleteListing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => listingsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myListings"], refetchType: 'active' });
      queryClient.invalidateQueries({ queryKey: ["listings"], refetchType: 'active' });
    },
  });
};

// ============================================================================
// Users Hooks
// ============================================================================

export const useUser = (userId: string) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => usersAPI.getProfile(userId),
    retry: 1,
    retryDelay: 1000,
  });
};

export const useUserReviews = (userId: string) => {
  return useQuery({
    queryKey: ["userReviews", userId],
    queryFn: () => usersAPI.getReviews(userId),
    retry: 1,
    retryDelay: 1000,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updates: Partial<User>) => usersAPI.updateProfile(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"], refetchType: 'active' });
    },
  });
};

// ============================================================================
// Bookings Hooks
// ============================================================================

export const useBooking = (id: string) => {
  return useQuery({
    queryKey: ["booking", id],
    queryFn: () => bookingsAPI.getById(id),
    retry: 1,
    retryDelay: 1000,
  });
};

export const useMyRentals = () => {
  return useQuery({
    queryKey: ["myRentals"],
    queryFn: () => bookingsAPI.getMyRentals(),
    retry: 1,
    retryDelay: 1000,
  });
};

export const useMyBookings = () => {
  return useQuery({
    queryKey: ["myBookings"],
    queryFn: () => bookingsAPI.getMyBookings(),
    retry: 1,
    retryDelay: 1000,
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (booking: Omit<Booking, "id" | "createdAt" | "updatedAt">) =>
      bookingsAPI.create(booking),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myBookings"], refetchType: 'active' });
      queryClient.invalidateQueries({ queryKey: ["myRentals"], refetchType: 'active' });
    },
  });
};

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Booking["status"] }) =>
      bookingsAPI.updateStatus(id, status),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["booking", id], refetchType: 'active' });
      queryClient.invalidateQueries({ queryKey: ["myBookings"], refetchType: 'active' });
      queryClient.invalidateQueries({ queryKey: ["myRentals"], refetchType: 'active' });
    },
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bookingsAPI.cancel(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["booking", id], refetchType: 'active' });
      queryClient.invalidateQueries({ queryKey: ["myBookings"], refetchType: 'active' });
      queryClient.invalidateQueries({ queryKey: ["myRentals"], refetchType: 'active' });
    },
  });
};

// ============================================================================
// Messages Hooks
// ============================================================================

export const useMessages = (bookingId: string) => {
  return useQuery({
    queryKey: ["messages", bookingId],
    queryFn: () => messagesAPI.getForBooking(bookingId),
    refetchInterval: 2000,
    retry: 1,
    retryDelay: 1000,
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      bookingId,
      content,
    }: {
      bookingId: string;
      content: string;
    }) => messagesAPI.send(bookingId, content),
    onSuccess: (_, { bookingId }) => {
      queryClient.invalidateQueries({ queryKey: ["messages", bookingId], refetchType: 'active' });
    },
  });
};

// ============================================================================
// Reviews Hooks
// ============================================================================

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (review: Omit<Review, "id" | "createdAt">) =>
      reviewsAPI.create(review),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userReviews"], refetchType: 'active' });
      queryClient.invalidateQueries({ queryKey: ["user"], refetchType: 'active' });
    },
  });
};

// ============================================================================
// Auth Hooks
// ============================================================================

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: () => authAPI.getCurrentUser(),
    retry: 1,
    retryDelay: 1000,
  });
};
