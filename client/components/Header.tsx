import { Link } from "react-router-dom";
import { Menu, X, LogOut, Home, Package, User } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  isLoggedIn?: boolean;
  userName?: string;
}

export function Header({ isLoggedIn, userName }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b border-border bg-white sticky top-0 z-50">
      <nav className="container-center flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl md:text-2xl text-primary">
          <Package className="w-6 h-6 md:w-8 md:h-8" />
          <span className="hidden sm:inline">ShareHub</span>
          <span className="sm:hidden">SH</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-foreground hover:text-primary transition-colors font-medium">
            Home
          </Link>
          <Link to="/listings" className="text-foreground hover:text-primary transition-colors font-medium">
            Browse Items
          </Link>
          <Link to="/how-it-works" className="text-foreground hover:text-primary transition-colors font-medium">
            How It Works
          </Link>
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <Link to="/dashboard">
                <Button variant="outline" size="sm">
                  Dashboard
                </Button>
              </Link>
              <Link to="/profile">
                <Button variant="outline" size="sm">
                  {userName}
                </Button>
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem("user");
                  window.location.href = "/";
                }}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5 text-muted-foreground" />
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
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
        <div className="md:hidden border-t border-border bg-white">
          <div className="container-center py-4 flex flex-col gap-4">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-2 py-2 text-foreground hover:text-primary"
            >
              <Home className="w-5 h-5" />
              Home
            </Link>
            <Link
              to="/listings"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-2 py-2 text-foreground hover:text-primary"
            >
              <Package className="w-5 h-5" />
              Browse Items
            </Link>
            <Link
              to="/how-it-works"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-2 py-2 text-foreground hover:text-primary"
            >
              Home
              How It Works
            </Link>

            <div className="border-t border-border pt-4 flex flex-col gap-2">
              {isLoggedIn ? (
                <>
                  <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Dashboard
                    </Button>
                  </Link>
                  <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Profile
                    </Button>
                  </Link>
                  <button
                    onClick={() => {
                      localStorage.removeItem("user");
                      window.location.href = "/";
                    }}
                    className="w-full py-2 px-4 border border-destructive text-destructive rounded-lg hover:bg-destructive hover:text-destructive-foreground transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full">Get Started</Button>
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
