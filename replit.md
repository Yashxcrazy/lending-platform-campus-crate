# CampusCrate - Campus Item Rental Platform

## Overview

CampusCrate is a full-stack peer-to-peer rental marketplace designed for college students to lend and borrow items within their campus community. The platform enables students to monetize unused items while helping others access what they need without purchasing. Built with React, Express, and MongoDB, it features a modern dark theme with glassmorphism design inspired by Marvel aesthetics.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18 with TypeScript for type safety
- React Router 6 in SPA mode for client-side routing
- Vite as the build tool and dev server
- TailwindCSS 3 with custom dark theme and glassmorphism effects
- Radix UI components for accessible, pre-built UI primitives
- React Query (TanStack Query) for server state management and caching

**Design System:**
- Marvel-inspired dark theme with purple/cyan neon accents
- Glassmorphism effects using backdrop blur and transparency
- Custom CSS variables for theming defined in `client/global.css`
- Component library built on Radix UI primitives in `client/components/ui/`

**State Management:**
- React Query handles all server state (listings, bookings, users)
- Local state with React hooks for UI interactions
- No global state management library (Redux, Zustand) used

**Routing Structure:**
- SPA routing defined in `client/App.tsx` and `client/main.tsx`
- Routes include: home, listings, item details, dashboard, profile, rentals, chat, reviews
- Placeholder pages exist for incomplete features

### Backend Architecture

**Dual Backend Setup:**
The project has two backend implementations:

1. **Express Server (Primary - `/server`):**
   - Minimal Express setup integrated with Vite dev server
   - Located in `server/index.ts` and `server/routes/`
   - Uses TypeScript and shares types with frontend via `shared/api.ts`
   - Proxied through Vite dev server at `/api` endpoint

2. **Standalone Node Backend (`/backend`):**
   - Separate Express server with MongoDB integration
   - Legacy/alternative implementation using CommonJS
   - Contains complete data models and API routes
   - Runs independently on port 3001

**API Design:**
- RESTful endpoints documented in `BACKEND_API_SPEC.md`
- API base URL configured via `VITE_API_URL` environment variable
- Frontend API client in `client/lib/api.ts` provides typed methods
- React Query hooks in `client/hooks/useAPI.ts` wrap API calls

**Authentication & Security:**
- JWT-based authentication (token stored in localStorage)
- bcrypt for password hashing
- Helmet for security headers
- CORS configured for cross-origin requests
- Rate limiting middleware available

### Data Storage

**Database: MongoDB with Mongoose**

**Core Data Models (`backend/models/`):**

1. **User:** Student profiles with verification, ratings, trust scores
2. **Item:** Rental listings with categories, pricing, availability, location
3. **LendingRequest:** Booking requests with status tracking, dates, pricing
4. **Review:** Two-way ratings between lenders and borrowers
5. **Notification:** User notifications for various events

**Key Schema Decisions:**
- ObjectId references for relationships between collections
- Embedded subdocuments for complex fields (location, categories)
- Enum validation for status fields and categories
- Default values for ratings and trust scores
- Timestamps automatically tracked via Mongoose

### External Dependencies

**Third-Party Services:**

1. **Frontend UI Libraries:**
   - Radix UI: Accessible component primitives (dialogs, dropdowns, etc.)
   - Lucide React: Icon library
   - TailwindCSS: Utility-first CSS framework
   - Class Variance Authority (CVA): Component variant management
   - React Hook Form + Zod: Form validation

2. **Backend Services:**
   - MongoDB: Primary database (connection string via environment variable)
   - Nodemailer: Email notifications (configured but not fully implemented)
   - Express middleware: CORS, helmet, express-validator, rate-limit

3. **Build & Development Tools:**
   - Vite: Frontend build tool and dev server
   - TypeScript: Type checking across frontend and backend
   - Vitest: Testing framework
   - PNPM: Package manager (preferred)

4. **Deployment Platforms:**
   - Vercel: Frontend SPA deployment configured in `vercel.json`
   - Netlify: Alternative deployment with serverless functions in `netlify/functions/`
   - Replit: Development environment support

**Environment Variables Required:**
- `VITE_API_URL`: Backend API base URL
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT signing
- `PORT`: Server port (defaults to 3000)
- `REPLIT_DEV_DOMAIN`: For Replit deployment CORS

**API Integration Pattern:**
The frontend expects a backend implementing the specification in `BACKEND_API_SPEC.md`. The current setup allows flexibility to use either the integrated Express server or a separate backend by configuring the `VITE_API_URL` environment variable. The frontend gracefully handles API errors and shows loading states via React Query.