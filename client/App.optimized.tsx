import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import Header from './components/Header';
import AdminRoute from './components/AdminRoute';

// Lazy load pages for better performance and code splitting
const Index = lazy(() => import('./pages/Index'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Listings = lazy(() => import('./pages/Listings'));
const ItemDetails = lazy(() => import('./pages/ItemDetails'));
const MyListings = lazy(() => import('./pages/MyListings'));
const MyRentals = lazy(() => import('./pages/MyRentals'));
const Profile = lazy(() => import('./pages/Profile'));
const AccountSettings = lazy(() => import('./pages/AccountSettings'));
const HelpCenter = lazy(() => import('./pages/HelpCenter'));
const Inbox = lazy(() => import('./pages/Inbox'));
const Chat = lazy(() => import('./pages/Chat'));
const ItemContact = lazy(() => import('./pages/ItemContact'));
const LendingReview = lazy(() => import('./pages/LendingReview'));
const Blog = lazy(() => import('./pages/Blog'));
const HowItWorks = lazy(() => import('./pages/HowItWorks'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const Contact = lazy(() => import('./pages/Contact'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/listings" element={<Listings />} />
              <Route path="/items/:id" element={<ItemDetails />} />
              <Route path="/my-listings" element={<MyListings />} />
              <Route path="/my-rentals" element={<MyRentals />} />
              <Route path="/profile/:userId" element={<Profile />} />
              <Route path="/account-settings" element={<AccountSettings />} />
              <Route path="/help" element={<HelpCenter />} />
              <Route path="/inbox" element={<Inbox />} />
              <Route path="/chat/:conversationId" element={<Chat />} />
              <Route path="/items/:itemId/contact" element={<ItemContact />} />
              <Route path="/lending/:requestId/review" element={<LendingReview />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/contact" element={<Contact />} />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Toaster />
      </div>
    </BrowserRouter>
  );
}

export default App;
