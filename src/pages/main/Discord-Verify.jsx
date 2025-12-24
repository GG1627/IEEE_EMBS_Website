import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Turnstile } from "@marsidev/react-turnstile";
import { supabase } from "../../lib/supabase";
import { useSnackbar } from "../../components/ui/Snackbar";

export default function DiscordVerify() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [captchaToken, setCaptchaToken] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null); // 'success', 'error', null
  const [errorMessage, setErrorMessage] = useState("");
  const turnstileRef = useRef(null);
  const { showSnackbar } = useSnackbar();

  // Check if token exists in URL
  useEffect(() => {
    if (!token) {
      setVerificationStatus("error");
      setErrorMessage("Missing verification token. Please use the link provided by the Discord bot.");
    }
  }, [token]);

  const handleCaptchaSuccess = (token) => {
    setCaptchaToken(token);
  };

  const handleCaptchaError = () => {
    setCaptchaToken(null);
    showSnackbar("CAPTCHA verification failed. Please try again.", { severity: "error" });
  };

  const handleVerify = async () => {
    if (!token) {
      setErrorMessage("Missing verification token.");
      setVerificationStatus("error");
      return;
    }

    if (!captchaToken) {
      showSnackbar("Please complete the CAPTCHA verification.", { severity: "warning" });
      return;
    }

    setIsVerifying(true);
    setErrorMessage("");

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!supabaseUrl) {
        throw new Error("Supabase URL not configured");
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/discord-captcha-verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          verification_token: token,
          captcha_token: captchaToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Verification failed");
      }

      if (data.success) {
        setVerificationStatus("success");
        showSnackbar("Verification successful! Return to Discord to see the server.", {
          severity: "success",
        });
      } else {
        throw new Error(data.error || "Verification failed");
      }
    } catch (error) {
      console.error("Verification error:", error);
      setVerificationStatus("error");
      setErrorMessage(
        error.message || "An error occurred during verification. Please contact an officer for assistance."
      );
      showSnackbar(error.message || "Verification failed. Please try again.", {
        severity: "error",
      });
      // Reset CAPTCHA on error
      if (turnstileRef.current) {
        turnstileRef.current.reset();
      }
      setCaptchaToken(null);
    } finally {
      setIsVerifying(false);
    }
  };

  // Success state
  if (verificationStatus === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-12 h-12 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Verification Successful!</h1>
            <p className="text-gray-600">
              You've been successfully verified. Return to Discord and you should now see the full
              server.
            </p>
          </div>
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              If you don't see the server channels, try refreshing Discord or contact an officer.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state (no token or verification failed)
  if (verificationStatus === "error" || !token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-12 h-12 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Verification Failed</h1>
            <p className="text-gray-600 mb-4">{errorMessage || "An error occurred during verification."}</p>
          </div>
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Please contact an officer in Discord if you continue to experience issues.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Main verification form
  const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

  if (!turnstileSiteKey) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Configuration Error</h1>
          <p className="text-gray-600">
            CAPTCHA is not properly configured. Please contact the site administrator.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-purple-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Discord Verification</h1>
          <p className="text-gray-600">
            Complete the CAPTCHA below to verify your Discord account
          </p>
        </div>

        <div className="space-y-6">
          {/* CAPTCHA Widget */}
          <div className="flex justify-center">
            <Turnstile
              ref={turnstileRef}
              siteKey={turnstileSiteKey}
              onSuccess={handleCaptchaSuccess}
              onError={handleCaptchaError}
              onExpire={() => {
                setCaptchaToken(null);
                showSnackbar("CAPTCHA expired. Please complete it again.", {
                  severity: "warning",
                });
              }}
              options={{
                theme: "light",
                size: "normal",
              }}
            />
          </div>

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            disabled={!captchaToken || isVerifying}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
              captchaToken && !isVerifying
                ? "bg-purple-600 hover:bg-purple-700 shadow-lg hover:shadow-xl"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {isVerifying ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Verifying...
              </span>
            ) : (
              "Verify Discord Account"
            )}
          </button>

          {/* Info Text */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              This verification link expires in 15 minutes. If you encounter any issues, please
              contact an officer in Discord.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
