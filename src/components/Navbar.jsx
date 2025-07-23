import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import EMBSLogo from "../assets/logos/EMBS.svg";
import UFLogo from "../assets/logos/UF.svg";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // helper function to check active path for link styling
  const linkClass = (path) => {
    if (path === "/") {
      return location.pathname === "/"
        ? "text-[#772583] underline underline-offset-4 decoration-2 font-medium transition-all duration-300"
        : "text-black hover:text-[#772583] hover:underline underline-offset-4 decoration-2 font-medium transition-all duration-300";
    }
    return location.pathname.startsWith(path)
      ? "text-[#772583] underline underline-offset-4 decoration-2 font-medium transition-all duration-300"
      : "text-black hover:text-[#772583] hover:underline underline-offset-4 decoration-2 font-medium transition-all duration-300";
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logos */}

            <div className="flex-shrink-0 flex items-center flex-row">
              <Link to="/" className="flex items-center">
                <img src={EMBSLogo} alt="UF Logo" className="w-50 h-50" />
              </Link>
              <div className="mx-4 h-8 w-px bg-gray-400"></div>
              <img src={UFLogo} alt="UF Logo" className="w-50 h-50" />
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-end space-x-12">
              <Link to="/" className={linkClass("/")}>
                Home
              </Link>
              <Link to="/about" className={linkClass("/about")}>
                About
              </Link>
              <Link to="/events" className={linkClass("/events")}>
                Events
              </Link>
              <Link to="/team" className={linkClass("/team")}>
                Team
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white hover:text-[#772583] transition-colors duration-300 p-2"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={
                      isMobileMenuOpen
                        ? "M6 18L18 6M6 6l12 12"
                        : "M4 6h16M4 12h16M4 18h16"
                    }
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-black border-t border-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white hover:text-[#772583] block px-3 py-2 font-medium transition-colors duration-300"
              >
                Home
              </Link>
              <Link
                to="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white hover:text-[#772583] block px-3 py-2 font-medium transition-colors duration-300"
              >
                About
              </Link>
              <Link
                to="/events"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white hover:text-[#772583] block px-3 py-2 font-medium transition-colors duration-300"
              >
                Events
              </Link>
              <Link
                to="/team"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white hover:text-[#772583] block px-3 py-2 font-medium transition-colors duration-300"
              >
                Team
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
