import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useSnackbar } from "../../components/ui/Snackbar";
import { useAuth } from "../auth/AuthContext";

export default function CheckInPage() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const code = searchParams.get("code");

  useEffect(() => {
    if (!code) {
      showSnackbar("No event code found in URL.", { customColor: "#b00000" });
      navigate("/");
      return;
    }

    const checkIn = async () => {
      try {
        if (!user) {
          // Not logged in → redirect to login page with redirect URL
          navigate(
            `/auth/login?redirect=${encodeURIComponent(
              `/checkin?code=${code}`
            )}`
          );
          return;
        }

        // Get event details with additional validation
        const { data: event, error: eventError } = await supabase
          .from("events")
          .select("id, name, start_time, end_time, points")
          .eq("code", code)
          .single();

        if (eventError) {
          console.error("Event lookup error:", eventError);
          showSnackbar("Invalid event code", { customColor: "#b00000" });
          navigate("/dashboard");
          return;
        }

        if (!event) {
          showSnackbar("Event not found", { customColor: "#b00000" });
          navigate("/dashboard");
          return;
        }

        // Check if event is currently active
        const now = new Date();
        const startTime = new Date(event.start_time);
        const endTime = new Date(event.end_time);

        if (now < startTime) {
          showSnackbar("Event has not started yet", { customColor: "#b00000" });
          navigate("/dashboard");
          return;
        }

        if (now > endTime) {
          showSnackbar("Event has already ended", { customColor: "#b00000" });
          navigate("/dashboard");
          return;
        }

        // Call RPC to claim points
        const { data, error } = await supabase.rpc("claim_event", {
          p_member_id: user.id,
          p_event_id: event.id,
          p_code: code,
        });

        if (error) {
          console.error("Check-in error:", error);
          showSnackbar(error.message || "Check-in failed", {
            customColor: "#b00000",
          });
        } else {
          showSnackbar(
            `Successfully checked in to ${event.name}! +${event.points} points`,
            { customColor: "#007377" }
          );
        }

        // Always redirect to dashboard after processing
        navigate("/dashboard");
      } catch (err) {
        console.error("Unexpected check-in error:", err);
        showSnackbar("An unexpected error occurred during check-in", {
          customColor: "#b00000",
        });
        navigate("/dashboard");
      }
    };

    checkIn();
  }, [user, code, navigate, showSnackbar]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007377] mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-[#007377] mb-2">
          Processing Check-in
        </h2>
        <p className="text-gray-600">
          Please wait while we verify your event code...
        </p>
      </div>
    </div>
  );
}
