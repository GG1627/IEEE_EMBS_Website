import { useAuth } from "./auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "../components/SnackBar";

export default function Dashboard() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const handleLogout = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        showSnackbar("Error logging out: " + error.message, {
          customColor: "#772583", // Your theme purple
        });
      } else {
        // Custom purple color to match your theme
        showSnackbar("Logged out successfully!", {
          customColor: "#772583", // Your theme purple
        });
        navigate("/");
      }
    } catch (error) {
      showSnackbar("Error logging out. Please try again.", {
        customColor: "#772583", // Your theme purple
      });
    }
  };

  return (
    <>
      <div className="min-h-screen bg-white p-6 md:p-12">
        <div className="justify-center items-center flex-col flex mt-16">
          <h1 className="text-4xl font-bold text-[#00629b]">Dashboard</h1>
          <p className="text-lg text-gray-700 leading-relaxed">
            Welcome to your dashboard!
          </p>
          <button
            onClick={handleLogout}
            className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
