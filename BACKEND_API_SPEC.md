# CampusCrate Backend API Specification

This document outlines the API endpoints and data structures required for the CampusCrate backend. Implement these endpoints to connect your backend to the frontend.

## Base URL Configuration

Set the `VITE_API_URL` environment variable in your `.env` file:

```env
VITE_API_URL=http://localhost:3001/api
```

Or for production:

```env
VITE_API_URL=https://your-backend-domain.com/api
```

---

## Data Types

### Listing

```typescript
{
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
```

### User

```typescript
{
  id: string;
  email: string;
  name: string;
  profileImage?: string;
  rating: number;
  reviewCount: number;
  createdAt: string;
}
```

### Booking

```typescript
{
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
```

### Message

```typescript
{
  id: string;
  bookingId: string;
  senderId: string;
  senderAnonymousId: string;
  content: string;
  createdAt: string;
}
```

### Review

```typescript
{
  id: string;
  bookingId: string;
  fromUserId: string;
  toUserId: string;
  rating: number;
  comment: string;
  createdAt: string;
}
```

---

## Authentication Endpoints

### POST `/auth/signup`

Create a new user account.

**Request:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**

```json
{
  "success": true,
  "token": "jwt-token",
  "user": {
    /* User object */
  }
}
```

---

### POST `/auth/login`

Authenticate a user.

**Request:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "token": "jwt-token",
  "user": {
    /* User object */
  }
}
```

---

### POST `/auth/logout`

Logout the current user (requires Bearer token).

**Headers:**

```
Authorization: Bearer {token}
```

**Response:**

```json
{
  "success": true
}
```

---

### POST `/auth/verify-email`

Verify user's email address.

**Request:**

```json
{
  "token": "verification-token"
}
```

**Response:**

```json
{
  "success": true
}
```

---

### GET `/auth/me`

Get current user's profile (requires Bearer token).

**Headers:**

```
Authorization: Bearer {token}
```

**Response:**

```json
{
  "id": "user-id",
  "email": "user@example.com",
  "name": "John Doe",
  "rating": 4.5,
  "reviewCount": 12,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

---

## Listings Endpoints

### GET `/listings`

Get all listings with optional filtering.

**Query Parameters:**

- `category` (optional): Filter by category
- `search` (optional): Search term
- `minPrice` (optional): Minimum daily rate
- `maxPrice` (optional): Maximum daily rate
- `page` (optional, default: 1): Page number

**Response:**

```json
{
  "data": [
    {
      /* Listing objects */
    }
  ],
  "totalPages": 5,
  "totalCount": 42
}
```

---

### GET `/listings/:id`

Get a single listing by ID.

**Response:**

```json
{
  "id": "listing-1",
  "title": "Python Textbook"
  /* ... rest of Listing object ... */
}
```

---

### POST `/listings`

Create a new listing (requires Bearer token).

**Headers:**

```
Authorization: Bearer {token}
```

**Request:**

```json
{
  "title": "Python Textbook",
  "description": "Great condition...",
  "category": "books",
  "dailyRate": 50,
  "weeklyRate": 250,
  "monthlyRate": 800,
  "images": [],
  "condition": "excellent",
  "location": "Central Library"
}
```

**Response:**

```json
{
  "success": true,
  "listing": {
    /* Created Listing object */
  }
}
```

---

### PUT `/listings/:id`

Update a listing (requires Bearer token).

**Headers:**

```
Authorization: Bearer {token}
```

**Request:** (partial Listing object)

```json
{
  "title": "Updated Title",
  "description": "Updated description"
}
```

**Response:**

```json
{
  "success": true,
  "listing": {
    /* Updated Listing object */
  }
}
```

---

### DELETE `/listings/:id`

Delete a listing (requires Bearer token).

**Headers:**

```
Authorization: Bearer {token}
```

**Response:**

```json
{
  "success": true
}
```

---

### GET `/listings/user/my-listings`

Get current user's listings (requires Bearer token).

**Headers:**

```
Authorization: Bearer {token}
```

**Response:**

```json
{
  "data": [
    {
      /* Listing objects */
    }
  ]
}
```

---

## Users Endpoints

### GET `/users/:userId`

Get a user's profile.

**Response:**

```json
{
  "id": "user-id",
  "email": "user@example.com",
  "name": "John Doe",
  "profileImage": "url",
  "rating": 4.5,
  "reviewCount": 12,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

---

### PUT `/users/profile`

Update current user's profile (requires Bearer token).

**Headers:**

```
Authorization: Bearer {token}
```

**Request:** (partial User object)

```json
{
  "name": "Jane Doe",
  "profileImage": "url"
}
```

**Response:**

```json
{
  "success": true,
  "user": {
    /* Updated User object */
  }
}
```

---

### GET `/users/:userId/reviews`

Get reviews for a user.

**Response:**

```json
{
  "data": [
    {
      /* Review objects */
    }
  ]
}
```

---

## Bookings Endpoints

### POST `/bookings`

Create a new booking (requires Bearer token).

**Headers:**

```
Authorization: Bearer {token}
```

**Request:**

```json
{
  "listingId": "listing-1",
  "startDate": "2024-01-15T00:00:00Z",
  "endDate": "2024-01-20T00:00:00Z",
  "totalPrice": 250
}
```

**Response:**

```json
{
  "success": true,
  "booking": {
    /* Created Booking object */
  }
}
```

---

### GET `/bookings/:id`

Get a booking by ID (requires Bearer token).

**Headers:**

```
Authorization: Bearer {token}
```

**Response:**

```json
{
  "id": "booking-1",
  "listingId": "listing-1"
  /* ... rest of Booking object ... */
}
```

---

### GET `/bookings/user/rentals`

Get current user's rentals (listings they own that are booked) (requires Bearer token).

**Headers:**

```
Authorization: Bearer {token}
```

**Response:**

```json
{
  "data": [
    {
      /* Booking objects */
    }
  ]
}
```

---

### GET `/bookings/user/bookings`

Get current user's bookings (items they've rented) (requires Bearer token).

**Headers:**

```
Authorization: Bearer {token}
```

**Response:**

```json
{
  "data": [
    {
      /* Booking objects */
    }
  ]
}
```

---

### PUT `/bookings/:id/status`

Update booking status (requires Bearer token).

**Headers:**

```
Authorization: Bearer {token}
```

**Request:**

```json
{
  "status": "confirmed"
}
```

**Response:**

```json
{
  "success": true,
  "booking": {
    /* Updated Booking object */
  }
}
```

---

### POST `/bookings/:id/cancel`

Cancel a booking (requires Bearer token).

**Headers:**

```
Authorization: Bearer {token}
```

**Response:**

```json
{
  "success": true
}
```

---

## Messages Endpoints

### GET `/messages/booking/:bookingId`

Get all messages for a booking (requires Bearer token).

**Headers:**

```
Authorization: Bearer {token}
```

**Response:**

```json
{
  "data": [
    {
      /* Message objects */
    }
  ]
}
```

---

### POST `/messages`

Send a message for a booking (requires Bearer token).

**Headers:**

```
Authorization: Bearer {token}
```

**Request:**

```json
{
  "bookingId": "booking-1",
  "content": "When can I pick it up?"
}
```

**Response:**

```json
{
  "success": true,
  "message": {
    /* Created Message object */
  }
}
```

---

## Reviews Endpoints

### POST `/reviews`

Create a review (requires Bearer token).

**Headers:**

```
Authorization: Bearer {token}
```

**Request:**

```json
{
  "bookingId": "booking-1",
  "toUserId": "user-2",
  "rating": 5,
  "comment": "Great experience!"
}
```

**Response:**

```json
{
  "success": true,
  "review": {
    /* Created Review object */
  }
}
```

---

### GET `/reviews/user/:userId`

Get all reviews for a user.

**Response:**

```json
{
  "data": [
    {
      /* Review objects */
    }
  ]
}
```

---

## Error Handling

All endpoints should return appropriate HTTP status codes:

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

Error response format:

```json
{
  "success": false,
  "error": "Error message"
}
```

---

## Authentication

Use JWT (JSON Web Tokens) for authentication. Include the token in the `Authorization` header:

```
Authorization: Bearer {token}
```

---

## CORS

Ensure CORS is configured to allow requests from your frontend URL.
