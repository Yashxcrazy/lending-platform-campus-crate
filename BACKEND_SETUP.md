# Backend Setup Instructions

## Overview

The CampusCrate backend needs to implement the API endpoints specified in `BACKEND_API_SPEC.md`. This guide helps you get started.

## Environment Setup

### 1. Configure Frontend to Connect to Backend

Create or update your `.env` file in the project root:

```env
VITE_API_URL=http://localhost:3001/api
```

For production, replace with your actual backend URL:

```env
VITE_API_URL=https://your-backend-domain.com/api
```

### 2. Backend Technology Stack

The project includes Express.js set up in the `server/` folder. You can use this or any backend technology you prefer.

## Running the Development Server

### Option 1: Run Frontend Only (Connect External Backend)

If you have a backend running elsewhere:

```bash
pnpm run dev
```

The frontend dev server runs on `http://localhost:8080` (or the port shown in terminal).

### Option 2: Run Full Stack

If running a local backend:

```bash
# Terminal 1: Frontend
pnpm run dev

# Terminal 2: Backend (if using Express in server/ folder)
# Start your backend server on port 3001
```

## API Integration Checklist

Your backend must implement these endpoints (see `BACKEND_API_SPEC.md` for full details):

### Authentication

- [ ] `POST /auth/signup`
- [ ] `POST /auth/login`
- [ ] `POST /auth/logout`
- [ ] `POST /auth/verify-email`
- [ ] `GET /auth/me`

### Listings

- [ ] `GET /listings` (with filtering)
- [ ] `GET /listings/:id`
- [ ] `POST /listings`
- [ ] `PUT /listings/:id`
- [ ] `DELETE /listings/:id`
- [ ] `GET /listings/user/my-listings`

### Users

- [ ] `GET /users/:userId`
- [ ] `PUT /users/profile`
- [ ] `GET /users/:userId/reviews`

### Bookings

- [ ] `POST /bookings`
- [ ] `GET /bookings/:id`
- [ ] `GET /bookings/user/rentals`
- [ ] `GET /bookings/user/bookings`
- [ ] `PUT /bookings/:id/status`
- [ ] `POST /bookings/:id/cancel`

### Messages

- [ ] `GET /messages/booking/:bookingId`
- [ ] `POST /messages`

### Reviews

- [ ] `POST /reviews`
- [ ] `GET /reviews/user/:userId`

## Database Considerations

You'll need a database to store:

- Users (authentication, profiles)
- Listings (items available for rental)
- Bookings (rental transactions)
- Messages (communication between users)
- Reviews (ratings and feedback)

### Recommended Options:

- **PostgreSQL** (via Neon or Supabase)
- **MongoDB** (Atlas or self-hosted)
- **MySQL/MariaDB**
- **SQLite** (for development only)

## Authentication

Implement JWT-based authentication:

1. Generate JWT tokens on login
2. Verify tokens on protected endpoints
3. Include `Authorization: Bearer {token}` header in requests

## CORS Configuration

Ensure your backend allows requests from your frontend:

```javascript
const cors = require("cors");

app.use(
  cors({
    origin: ["http://localhost:8080", "https://your-frontend-domain.com"],
    credentials: true,
  }),
);
```

## Testing Endpoints

Use tools like:

- **Postman** - GUI for testing endpoints
- **Insomnia** - Similar to Postman
- **cURL** - Command-line HTTP client
- **Thunder Client** - VS Code extension

Example using cURL:

```bash
# Test ping endpoint
curl http://localhost:3001/api/ping

# Get listings
curl http://localhost:3001/api/listings

# Create listing (requires auth)
curl -X POST http://localhost:3001/api/listings \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Book","description":"...","category":"books",...}'
```

## Troubleshooting

### Frontend shows "Failed to fetch"

- Ensure `VITE_API_URL` is set correctly in `.env`
- Verify backend is running on the correct port
- Check CORS configuration on backend
- Look at browser console for detailed error messages

### Backend port conflicts

- If port 3001 is busy, run backend on a different port and update `VITE_API_URL`

### Token issues

- Ensure JWT tokens are properly signed and verified
- Check token expiration
- Verify `Authorization` header format: `Bearer {token}`

## Next Steps

1. Choose your backend technology and database
2. Implement the API endpoints from `BACKEND_API_SPEC.md`
3. Set up authentication with JWT
4. Update `VITE_API_URL` in `.env`
5. Test endpoints with Postman/Insomnia
6. Connect frontend and verify data flows correctly

For detailed endpoint specifications, see `BACKEND_API_SPEC.md`.
