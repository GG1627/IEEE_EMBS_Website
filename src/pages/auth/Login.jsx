import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { supabase } from "../../lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { directLogin } = useAuth();

  async function handleLogin(e) {
    e.preventDefault();
    if (loading) {
      return;
    }

    // check if email is valid UF email
    if (!email.toLowerCase().endsWith("@ufl.edu")) {
      setMessage("Error: Please use your @ufl.edu email address");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // First, check if the user exists in the members table
      const { data: existingMember, error: checkError } = await supabase
        .from("members")
        .select("*")
        .eq("email", email.toLowerCase())
        .single();

      if (checkError && checkError.code !== "PGRST116") {
        // PGRST116 is "not found"
        setMessage("Error: " + checkError.message);
        return;
      }

      // If user doesn't exist in members table, redirect to registration
      if (!existingMember) {
        setMessage(
          "Email not found in our database. Redirecting to registration..."
        );
        setTimeout(() => {
          navigate("/auth/register", { state: { email: email } });
        }, 1750);
        return;
      }

      // If user exists, proceed with normal login
      const { data, error: signInError } = await directLogin(email);

      if (signInError) {
        // If user doesn't exist in members table, redirect to registration
        if (signInError.message === "Email not found in members database") {
          setMessage(
            "Email not found in our database. Redirecting to registration..."
          );
          setTimeout(() => {
            navigate("/auth/register", { state: { email: email } });
          }, 2250);
          return;
        }
        setMessage("Error: " + signInError.message);
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
                Login to UF EMBS
              </h2>
              <p className="mt-2 text-center text-gray-600">
                Enter your email to log in instantly
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

            <form onSubmit={handleLogin} className="space-y-6 max-w-md mx-auto">
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

              <button
                type="submit"
                disabled={
                  loading ||
                  (email && !email.toLowerCase().endsWith("@ufl.edu"))
                }
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#96529a] hover:bg-[#772583] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 hover:cursor-pointer"
              >
                {loading ? "Checking membership..." : "Send Link"}
              </button>
            </form>

            <p className="text-center text-gray-600 ">
              Don't have an account?
              <span
                onClick={() => navigate("/auth/register")}
                className="text-[#772583] cursor-pointer ml-1 hover:underline"
              >
                Register
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
