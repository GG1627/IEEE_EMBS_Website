import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { signUp } = useAuth();

  // auto fill the email input field
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  async function handleSignUp(e) {
    e.preventDefault();
    if (loading) return;

    // Validate email domain
    if (!email.toLowerCase().endsWith("@ufl.edu")) {
      setMessage("Error: Please use your @ufl.edu email address");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const { data, error } = await signUp(email, firstName, lastName);

      if (error) {
        setMessage("Error: " + error.message);
      } else {
        setMessage(
          "Check your email for the link! You will be automatically logged in after clicking the link. Make sure to check your spam/junk folder."
        );
      }
    } catch (error) {
      setMessage("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-7xl w-full space-y-8 p-8">
            <div>
              <h2 className="text-center text-3xl font-bold text-gray-900">
                Register your account with UF EMBS
              </h2>
              <p className="mt-2 text-center text-gray-600">
                We'll send you a link to verify your email
              </p>
            </div>

            {message && (
              <div
                className={`max-w-md mx-auto p-4 rounded-md ${
                  message.includes("Error")
                    ? "bg-red-50 text-red-700 border border-red-200"
                    : "bg-green-50 text-green-700 border border-green-200"
                }`}
              >
                {message}
              </div>
            )}

            <form
              onSubmit={handleSignUp}
              className="space-y-6 max-w-md mx-auto"
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                    email && !email.toLowerCase().endsWith("@ufl.edu")
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter your @ufl.edu email"
                />
                {email && !email.toLowerCase().endsWith("@ufl.edu") && (
                  <p className="mt-1 text-sm text-red-600">
                    Please use your @ufl.edu email address
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your first name"
                />
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your last name"
                />
              </div>

              <button
                type="submit"
                disabled={
                  loading ||
                  (email && !email.toLowerCase().endsWith("@ufl.edu"))
                }
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#96529a] hover:bg-[#772583] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 hover:cursor-pointer"
              >
                {loading ? "Sending link..." : "Send Link"}
              </button>
            </form>

            <p className="text-center text-gray-600 ">
              Already have an account?
              <span
                onClick={() => navigate("/auth/login")}
                className="text-[#772583] cursor-pointer ml-1 hover:underline"
              >
                Login
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
