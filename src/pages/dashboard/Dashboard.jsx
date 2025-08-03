import { useAuth } from "../../pages/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "../../components/ui/Snackbar";

export default function Dashboard() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const handleLogout = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        showSnackbar("Error logging out: " + error.message, {
          customColor: "#b00000",
        });
      } else {
        showSnackbar("Logged out successfully!", {
          customColor: "#009623",
        });
        navigate("/");
      }
    } catch (error) {
      showSnackbar("Error logging out. Please try again.", {
        customColor: "#b00000",
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
