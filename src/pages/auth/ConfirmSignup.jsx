import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FaCheck } from "react-icons/fa6";
import { FaXmark } from "react-icons/fa6";

export default function ConfirmSignup() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [confirmationUrl, setConfirmationUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = searchParams.get("confirmation_url");
    if (url) {
      setConfirmationUrl(url);
    } else {
      // If no confirmation URL, redirect to login
      setTimeout(() => {
        navigate("/auth/login");
      }, 3000);
    }
    setLoading(false);
  }, [searchParams, navigate]);

  const handleConfirmSignup = () => {
    if (confirmationUrl) {
      // Redirect to the actual Supabase confirmation URL
      window.location.href = confirmationUrl;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#96529a] mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900">Loading...</h2>
        </div>
      </div>
    );
  }

  if (!confirmationUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            <div className="bg-red-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <FaXmark className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Invalid Confirmation Link
            </h2>
            <p className="text-gray-600 mb-6">
              This confirmation link is invalid or has expired. You'll be
              redirected to the login page.
            </p>
            <button
              onClick={() => navigate("/auth/login")}
              className="w-full bg-[#96529a] hover:bg-[#772583] text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <div className="bg-green-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <FaCheck className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Confirm Your Signup
          </h2>
          <p className="text-gray-600 mb-6">
            Welcome to UF EMBS! Click the button below to complete your account
            setup and log in.
          </p>
          <button
            onClick={handleConfirmSignup}
            className="w-full bg-[#96529a] hover:bg-[#772583] text-white font-medium py-3 px-4 rounded-md transition-colors mb-4 hover:cursor-pointer"
          >
            Complete Signup & Login
          </button>
          <p className="text-xs text-gray-500">
            This will securely confirm your email address and log you into your
            account.
          </p>
        </div>
      </div>
    </div>
  );
}
