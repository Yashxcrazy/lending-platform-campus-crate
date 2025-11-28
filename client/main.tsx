import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import type { Root } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Listings from "./pages/Listings";
import Placeholder from "./pages/Placeholder";

const queryClient = new QueryClient();

const App = () => (
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
          <Route
            path="/listing/:id"
            element={
              <Placeholder
                title="Item Details"
                description="View the full listing details, photos, ratings, and booking information for this item."
                icon="🔍"
              />
            }
          />
          <Route
            path="/dashboard"
            element={
              <Placeholder
                title="Your Dashboard"
                description="Manage your listings, view bookings, and track your rental activity."
                icon="📊"
              />
            }
          />
          <Route
            path="/profile"
            element={
              <Placeholder
                title="Your Profile"
                description="View and edit your profile, ratings, reviews, and account settings."
                icon="👤"
              />
            }
          />
          <Route
            path="/my-rentals"
            element={
              <Placeholder
                title="My Rentals"
                description="View all your active rentals, rental history, and manage returns."
                icon="📦"
              />
            }
          />
          <Route
            path="/my-listings"
            element={
              <Placeholder
                title="My Listings"
                description="Create, edit, and manage the items you're offering to rent."
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
            path="/verify-email"
            element={
              <Placeholder
                title="Verify Your Email"
                description="Check your college email for a verification link to complete your signup."
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
          <Route
            path="/admin"
            element={
              <Placeholder
                title="Admin Dashboard"
                description="Manage users, review reports, and configure platform settings."
                icon="⚙️"
              />
            }
          />
          <Route
            path="/chat/:userId"
            element={
              <Placeholder
                title="Messages"
                description="Communicate with other users about rentals and questions."
                icon="💬"
              />
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

const container = document.getElementById("root");
if (container) {
  const storedRoot = (container as any)._reactRoot as Root | undefined;
  if (storedRoot) {
    storedRoot.render(<App />);
  } else {
    const newRoot = createRoot(container);
    (container as any)._reactRoot = newRoot;
    newRoot.render(<App />);
  }
}
