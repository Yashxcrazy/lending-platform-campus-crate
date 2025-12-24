import { Link } from "react-router-dom";
import { Menu, X, LogOut, Home, Package, User, Settings } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { User as UserType } from "@/lib/api";

interface HeaderProps {
  isLoggedIn?: boolean;
  userName?: string;
}

export function Header({ isLoggedIn, userName }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isUserLoggedIn =
    isLoggedIn || !!localStorage.getItem("user");
  
  // Parse stored user safely
  let storedUser: Partial<UserType> = {};
  try {
    storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  } catch (e) {
    storedUser = {};
  }
  
  const userNameDisplay = userName || storedUser?.name || "User";
  // Note: This is UI-only admin check from localStorage for showing/hiding the link.
  // The AdminRoute component provides the actual security by validating via /api/auth/me.
  // Users could modify localStorage, but they'll be redirected by AdminRoute if not admin.
  const isAdminUser = storedUser?.role === "admin" || storedUser?.role === "manager";

  return (
    <header className="glass-card border-b border-cyan-400/20 sticky top-0 z-50 rounded-none">
      <nav className="container-center flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-xl md:text-2xl text-white hover:text-cyan-400 transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center text-white font-bold">
            📦
          </div>
          <span className="hidden sm:inline bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent">
            CampusCrate
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className="text-gray-300 hover:text-cyan-300 transition-colors font-medium"
          >
            Home
          </Link>
          <Link
            to="/listings"
            className="text-gray-300 hover:text-cyan-300 transition-colors font-medium"
          >
            Browse Items
          </Link>
          <Link
            to="/how-it-works"
            className="text-gray-300 hover:text-cyan-300 transition-colors font-medium"
          >
            How It Works
          </Link>
          {isUserLoggedIn && (
            <Link
              to="/dashboard"
              className="text-gray-300 hover:text-cyan-300 transition-colors font-medium"
            >
              Dashboard
            </Link>
          )}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {isUserLoggedIn ? (
            <>
              <Link to="/my-listings">
                <button className="btn-glow-blue px-3 py-1 text-sm">
                  My Listings
                </button>
              </Link>
              <Link to="/my-rentals">
                <button className="btn-glow-cyan px-3 py-1 text-sm">
                  My Rentals
                </button>
              </Link>
              <div className="relative group">
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg glass-card border-cyan-400/30 hover:border-cyan-400 transition-all text-white">
                  <User className="w-4 h-4" />
                  {userNameDisplay.split(" ")[0]}
                </button>
                <div className="absolute right-0 mt-0 w-48 rounded-lg glass-card border-cyan-400/30 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-3 text-white hover:bg-white/10 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                  {isAdminUser && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-2 px-4 py-3 text-white hover:bg-white/10 transition-colors border-t border-white/10"
                    >
                      <Settings className="w-4 h-4" />
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      localStorage.removeItem("user");
                      window.location.href = "/";
                    }}
                    className="w-full flex items-center gap-2 px-4 py-3 text-red-400 hover:bg-red-400/10 transition-colors border-t border-white/10"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="btn-glow-blue px-4 py-2">Sign In</button>
              </Link>
              <Link to="/signup">
                <button className="btn-glow-red px-4 py-2">Get Started</button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
        >
          {isMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-cyan-400/20 glass-card rounded-none">
          <div className="container-center py-4 flex flex-col gap-4">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-2 py-2 text-gray-300 hover:text-cyan-300"
            >
              <Home className="w-5 h-5" />
              Home
            </Link>
            <Link
              to="/listings"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-2 py-2 text-gray-300 hover:text-cyan-300"
            >
              <Package className="w-5 h-5" />
              Browse Items
            </Link>
            <Link
              to="/how-it-works"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-2 py-2 text-gray-300 hover:text-cyan-300"
            >
              ❓ How It Works
            </Link>

            {isUserLoggedIn && (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 py-2 text-gray-300 hover:text-cyan-300"
                >
                  📊 Dashboard
                </Link>
                <Link
                  to="/my-listings"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 py-2 text-gray-300 hover:text-cyan-300"
                >
                  📝 My Listings
                </Link>
                <Link
                  to="/my-rentals"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 py-2 text-gray-300 hover:text-cyan-300"
                >
                  📦 My Rentals
                </Link>
              </>
            )}

            <div className="border-t border-cyan-400/20 pt-4 flex flex-col gap-2">
              {isUserLoggedIn ? (
                <>
                  <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                    <button className="w-full btn-glow-cyan flex items-center justify-center gap-2">
                      <User className="w-4 h-4" />
                      Profile
                    </button>
                  </Link>
                  {isAdminUser && (
                    <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
                      <button className="w-full btn-glow-blue flex items-center justify-center gap-2">
                        <Settings className="w-4 h-4" />
                        Admin
                      </button>
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      localStorage.removeItem("user");
                      setIsMenuOpen(false);
                      window.location.href = "/";
                    }}
                    className="w-full btn-glow-red flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <button className="w-full btn-glow-blue">Sign In</button>
                  </Link>
                  <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                    <button className="w-full btn-glow-red">Get Started</button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
