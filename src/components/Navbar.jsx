import { FaInstagram, FaDiscord, FaLinkedin } from "react-icons/fa6";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <h1 className="text-white text-xl sm:text-2xl font-bold">
                  Logo
                </h1>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className="text-white hover:text-[#772583] hover:underline underline-offset-4 decoration-2 transition-all duration-300 font-medium"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="text-white hover:text-[#772583] hover:underline underline-offset-4 decoration-2 transition-all duration-300 font-medium"
              >
                About
              </Link>
              <Link
                to="/events"
                className="text-white hover:text-[#772583] hover:underline underline-offset-4 decoration-2 transition-all duration-300 font-medium"
              >
                Events
              </Link>
              <Link
                to="/team"
                className="text-white hover:text-[#772583] hover:underline underline-offset-4 decoration-2 transition-all duration-300 font-medium"
              >
                Team
              </Link>
            </div>

            {/* Social Media Icons */}
            <div className="hidden sm:flex items-center space-x-4">
              <a
                href="https://www.instagram.com/ieee_embs_uf?utm_source=ig_web_button_share_sheet&igsh=YTR4aGdhMmRibjI3"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#00629b] transition-colors duration-300 p-2"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
              <a
                href="https://discord.gg/ieee_embs_uf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#00629b] transition-colors duration-300 p-2"
              >
                <FaDiscord className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/company/ieee-embs-uf/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#00629b] transition-colors duration-300 p-2"
              >
                <FaLinkedin className="w-5 h-5" />
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button className="text-white hover:text-[#772583] transition-colors duration-300 p-2">
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
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
