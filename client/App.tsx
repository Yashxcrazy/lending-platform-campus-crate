import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Listings from "./pages/Listings";
import ItemDetails from "./pages/ItemDetails";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import MyListings from "./pages/MyListings";
import MyRentals from "./pages/MyRentals";
import Chat from "./pages/Chat";
import LendingReview from "./pages/LendingReview";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "@/components/AdminRoute";
import Placeholder from "./pages/Placeholder";

const queryClient = new QueryClient();

export const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/listing/:id" element={<ItemDetails />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-rentals" element={<MyRentals />} />
          <Route path="/my-listings" element={<MyListings />} />
          <Route path="/lending/:id/chat" element={<Chat />} />
          <Route path="/lending/:id/review" element={<LendingReview />} />
          <Route
            path="/my-listings/new"
            element={
              <Placeholder
                title="Create New Listing"
                description="Add a new item you want to rent out to fellow students."
                icon="📝"
              />
            }
          />
          <Route
            path="/booking/:id"
            element={
              <Placeholder
                title="Booking Details"
                description="View your booking details, handover information, and rental timeline."
                icon="📅"
              />
            }
          />
          <Route
            path="/booking/:id/review"
            element={
              <Placeholder
                title="Leave Review"
                description="Share your experience with the lender or borrower."
                icon="⭐"
              />
            }
          />
          <Route
            path="/verify-email"
            element={
              <Placeholder
                title="Verify Your Email"
                description="Check your CSE NITRR college email for a verification link to complete your signup."
                icon="✉️"
              />
            }
          />
          <Route
            path="/forgot-password"
            element={
              <Placeholder
                title="Reset Password"
                description="Enter your email to receive password reset instructions."
                icon="🔐"
              />
            }
          />
          <Route
            path="/how-it-works"
            element={
              <Placeholder
                title="How It Works"
                description="Learn about the borrowing and lending process on CampusCrate."
                icon="❓"
              />
            }
          />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);
