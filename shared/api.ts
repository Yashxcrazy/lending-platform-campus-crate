/**
 * Shared code between client and server
 * Useful to share types between client and server
 */

export interface DemoResponse {
  message: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: "student" | "admin" | "super_admin";
  emailVerified: boolean;
  profilePhoto?: string;
  course?: string;
  year?: string;
  rating: number;
  itemsListed: number;
  completedRentals: number;
  cancellationRate: number;
  createdAt: string;
}

export interface ItemListing {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  category: string;
  images: string[];
  pricePerDay?: number;
  pricePerWeek?: number;
  isFree: boolean;
  availabilityStart: string;
  availabilityEnd: string;
  location: string;
  securityDeposit?: number;
  condition: string;
  rating: number;
  reviews: number;
  createdAt: string;
  updatedAt: string;
}

export interface BookingRequest {
  id: string;
  itemId: string;
  borrowerId: string;
  lenderId: string;
  startDate: string;
  endDate: string;
  status: "pending" | "accepted" | "declined" | "completed" | "cancelled";
  totalPrice: number;
  securityDeposit: number;
  handoverLocation: string;
  handoverTime: string;
  returnLocation: string;
  returnTime: string;
  pickupPhotos: string[];
  returnPhotos: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  bookingId: string;
  fromUserId: string;
  toUserId: string;
  itemId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

export interface ListingsResponse {
  success: boolean;
  data: ItemListing[];
  total: number;
  page: number;
}

export interface BookingResponse {
  success: boolean;
  data?: BookingRequest;
  message: string;
}
