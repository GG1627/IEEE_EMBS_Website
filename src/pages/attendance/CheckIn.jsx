import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function CheckIn() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // function to check in the user
  async function handleLogin(e) {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      const { data, error } = await supabase
        // Check if the user exists in the members table
        .from("members")
        .select("email")
        .eq("email", email);

      console.log("Query result:", { data, error });

      if (error) {
        console.log("Database error:", error);
      } else if (data.length > 0) {
        // User exists
        console.log("Yay welcome back!");
        navigate("/");
      } else {
        // User doesn't exist, redirect to register page
        navigate("/attendance/register", { state: { email: email } });
      }
    } catch (error) {
      console.log("Error: ", error.message);
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
                Check in to get your points!!!
              </h2>
            </div>

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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your @ufl email"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? "Checking..." : "Check In"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
