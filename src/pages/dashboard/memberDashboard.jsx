import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "../../components/ui/Snackbar";
import { IoMdHeart } from "react-icons/io";
import { FaQrcode, FaCamera } from "react-icons/fa";
import { careerFields } from "../../data/careerFields";
import { supabase } from "../../lib/supabase";
import { useEffect, useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";

const sampleEvents = [
  "Workshop",
  "Conference",
  "Networking Session",
  "Skill-Building Event",
  "Career Fair Prep",
  "Webinar",
  "Hackathon",
  "Industry Talk",
];

export default function MemberDashboard() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [favoriteFields, setFavoriteFields] = useState([]);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [userStats, setUserStats] = useState({ points: 0, eventsAttended: 0 });
  const [eventCode, setEventCode] = useState("");
  const [eventId, setEventId] = useState("");
  const [showQRScanner, setShowQRScanner] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserStats();
      fetchFavoriteFields();
    }
  }, [user]);

  const fetchUserStats = async () => {
    try {
      const { data, error } = await supabase
        .from("members")
        .select("points, events_attended")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;

      if (data) {
        setUserStats({
          points: data.points || 0,
          events_attended: data.events_attended || 0,
        });
      }
    } catch (error) {
      showSnackbar("Error fetching user stats: " + error.message, {
        customColor: "#b00000",
      });
    }
  };

  const fetchFavoriteFields = async () => {
    try {
      const { data, error } = await supabase
        .from("favorite_careers")
        .select("career_name")
        .eq("user_id", user.id);

      if (error) throw error;

      if (data) {
        const favoritesWithInfo = data
          .map((favorite) =>
            careerFields.find((field) => field.name === favorite.career_name)
          )
          .filter(Boolean);

        setFavoriteFields(favoritesWithInfo);
      }
    } catch (error) {
      showSnackbar("Error fetching favorite careers: " + error.message, {
        customColor: "#b00000",
      });
    }
  };

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

  // get the event id from supabase
  const getEventId = async (code) => {
    console.log("Looking for event with code:", code);

    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("id, points, name, end_time")
      .eq("code", code)
      .single();

    console.log("Event query result:", { event, eventError });

    if (eventError) {
      console.error("Event query error:", eventError);
      showSnackbar("Error finding event: " + eventError.message, {
        customColor: "#b00000",
      });
      return null;
    }

    if (!event) {
      showSnackbar("No event found with that code", {
        customColor: "#b00000",
      });
      return null;
    }

    // Check if event is still active -- remove logging when done
    const now = new Date();
    const endTime = new Date(event.end_time);

    console.log("Time comparison:", {
      now: now.toISOString(),
      endTime: endTime.toISOString(),
      isExpired: endTime < now,
    });

    console.log("Found valid event:", event);
    return event.id;
  };

  const handleCheckIn = async (e) => {
    e.preventDefault();

    const eventId = await getEventId(eventCode);

    console.log("User ID:", user.id);
    console.log("Event ID:", eventId);
    console.log("Code:", eventCode);

    if (!eventId) {
      // Error already shown in getEventId
      return;
    }

    if (!user?.id || !eventCode) {
      showSnackbar("Missing user data. Please try logging in again.", {
        customColor: "#b00000",
      });
      return;
    }

    if (!eventCode.trim()) {
      showSnackbar("Please enter an event code", {
        customColor: "#b00000",
      });
      return;
    }

    // Debug: Check what the database function will see
    const { data: debugEvent } = await supabase
      .from("events")
      .select("*")
      .eq("id", eventId)
      .eq("code", eventCode)
      .single();

    try {
      const { data, error } = await supabase.rpc("claim_event", {
        p_member_id: user.id,
        p_event_id: eventId,
        p_code: eventCode,
      });

      console.log("RPC Response:", { data, error });

      if (error) {
        console.error("Supabase RPC error:", error);
        showSnackbar("Error checking in: " + error.message, {
          customColor: "#b00000",
        });
      } else {
        console.log("Function returned:", data);

        // Check the return value from the function
        if (data === "Points claimed successfully!") {
          showSnackbar("Checked in successfully!", {
            customColor: "#007377",
          });
          setEventCode(""); // Clear the input after successful check-in
          // Refresh user stats
          fetchUserStats();
        } else {
          // Function returned an error message
          showSnackbar(data || "Check-in failed", {
            customColor: "#b00000",
          });
        }
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      showSnackbar("Unexpected error occurred", {
        customColor: "#b00000",
      });
    }
  };

  // Handle QR code scan result
  const handleQRScan = (result) => {
    if (result) {
      // Extract the actual text from the result
      const scannedText = result.text || result.rawValue || result;

      if (scannedText) {
        try {
          // Extract code from URL or use result directly
          const url = new URL(scannedText);
          const codeParam = url.searchParams.get("code");
          if (codeParam) {
            setEventCode(codeParam);
            setShowQRScanner(false);
            showSnackbar("QR code scanned successfully!", {
              customColor: "#007377",
            });
          } else {
            showSnackbar("Invalid QR code format", { customColor: "#b00000" });
          }
        } catch (error) {
          // If it's not a URL, try to use it as a direct code
          setEventCode(scannedText);
          setShowQRScanner(false);
          showSnackbar("QR code scanned successfully!", {
            customColor: "#007377",
          });
        }
      }
    }
  };

  // Handle QR scanner errors
  const handleQRError = (error) => {
    console.error("QR Scanner error:", error);
    showSnackbar("Camera access denied or QR scanner error", {
      customColor: "#b00000",
    });
  };

  return (
    <>
      <div className="min-h-screen bg-white p-6 md:p-12">
        <div className="justify-center items-center flex-col flex mt-16">
          <div className="w-full max-w-7xl mb-8 px-4 md:px-0">
            <h1 className="text-2xl md:text-3xl font-bold text-[#009ca6] mb-2">
              Welcome to Your Dashboard
            </h1>
            <p className="text-gray-600 text-base md:text-lg">
              Track your points and progress with UF IEEE EMBS!
            </p>
          </div>
          <div className="flex flex-col gap-4 w-full max-w-7xl px-4 md:px-0 mb-4">
            <div className="flex flex-col gap-4 bg-[#c5ebec] border-2 border-[#87d7db] p-4 rounded-md w-full h-45 items-start">
              <h1 className="text-[#009ca6] text-xl md:text-3xl font-bold uppercase">
                Event Check in
              </h1>
              <p className="text-gray-600 text-base md:text-lg">
                Scan the QR code or enter the event code to check in and earn
                points!
              </p>
              <div className="w-full space-y-4">
                <form
                  onSubmit={handleCheckIn}
                  className="flex flex-row gap-4 w-1/2"
                >
                  <input
                    type="text"
                    placeholder="Enter event code"
                    value={eventCode}
                    onChange={(e) => setEventCode(e.target.value)}
                    className="flex-1 px-3 py-2 border bg-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-[#009ca6] focus:border-[#009ca6] border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowQRScanner(true)}
                    className="px-3 py-2 bg-[#007377] text-white rounded-md shadow-sm hover:bg-[#005c60] focus:outline-none focus:ring-[#007377] focus:border-[#007377] border-gray-300 hover:cursor-pointer flex items-center gap-2"
                  >
                    <FaQrcode />
                    Scan QR
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#009ca6] text-white rounded-md shadow-sm hover:bg-[#007377] focus:outline-none focus:ring-[#009ca6] focus:border-[#009ca6] border-gray-300 hover:cursor-pointer"
                  >
                    Check in
                  </button>
                </form>

                {/* QR Scanner Modal */}
                {showQRScanner && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-[#009ca6]">
                          Scan QR Code
                        </h3>
                        <button
                          onClick={() => setShowQRScanner(false)}
                          className="text-gray-500 hover:text-gray-700 text-xl"
                        >
                          ×
                        </button>
                      </div>
                      <div className="relative">
                        <Scanner
                          onScan={(result) => handleQRScan(result)}
                          onError={handleQRError}
                          constraints={{ facingMode: "environment" }}
                          styles={{
                            container: { width: "100%", height: "300px" },
                          }}
                        />
                      </div>
                      <p className="text-sm text-gray-600 mt-4 text-center">
                        Position the QR code within the camera view to scan
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4 w-full max-w-7xl px-4 md:px-0">
            {/* Left column - 2/3 width */}
            <div className="flex flex-col gap-4 w-full md:w-2/3">
              {/* Top row - 2 boxes */}
              <div className="flex flex-row gap-4">
                <div className="flex flex-col gap-4 bg-[#c5ebec] border-2 border-[#87d7db] p-4 rounded-md w-1/2 h-34 md:h-52 items-center md:items-start">
                  <h1 className="text-[#009ca6] text-lg md:text-3xl font-bold uppercase text-center">
                    Points
                  </h1>
                  <h1 className="text-[#009ca6] text-[1.4rem] md:text-8xl font-bold">
                    {userStats.points.toLocaleString()}
                  </h1>
                  <div className="w-full h-1 bg-[#007377]"></div>
                </div>
                <div className="flex flex-col gap-2 md:gap-4 bg-[#c5ebec] border-2 border-[#87d7db] p-4 rounded-md w-1/2 h-34 md:h-52 items-center md:items-start">
                  <h1 className="text-[#009ca6] text-lg md:text-3xl font-bold uppercase text-center leading-none -mt-[0.4rem]">
                    Events Attended
                  </h1>
                  <h1 className="text-[#009ca6] text-[1.4rem] md:text-8xl font-bold mt-[0.38rem]">
                    {userStats.events_attended}
                  </h1>
                  <div className="w-full h-1 bg-[#007377] mt-2"></div>
                </div>
              </div>
              {/* Bottom box - full width of left column */}
              <div className="flex flex-col gap-4 bg-[#c5ebec] border-2 border-[#87d7db] p-4 rounded-md w-full h-90 items-start">
                <h1 className="text-[#009ca6] text-xl md:text-3xl font-bold uppercase">
                  Events
                </h1>
                {/* Events in a multi-column format with 6 events per column */}
                <div className="flex flex-col md:flex-row gap-4 w-full">
                  {Array.from({
                    length: Math.ceil(sampleEvents.length / 6),
                  }).map((_, colIndex) => (
                    <div key={colIndex} className="flex flex-col gap-2 flex-1">
                      {sampleEvents
                        .slice(colIndex * 6, (colIndex + 1) * 6)
                        .map((event, index) => (
                          <div key={index} className="mb-2 flex items-center">
                            <span className="text-[#009ca6] text-xl md:text-2xl mr-2">
                              •
                            </span>
                            <h1 className="text-[#009ca6] text-xl md:text-2xl font-semibold">
                              {event}
                            </h1>
                          </div>
                        ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column - 1/3 width */}
            <div className="flex flex-col gap-4 w-full md:w-1/3">
              {/* Top box */}
              <div
                className={`flex flex-col gap-4 bg-[#c5ebec] border-2 border-[#87d7db] p-4 rounded-md w-full items-start ${
                  selectedCareer ? "h-auto" : "h-90"
                }`}
              >
                <h1 className="text-[#009ca6] text-xl md:text-3xl font-bold uppercase">
                  Favorite Careers
                </h1>
                <div
                  className={`flex flex-col gap-2 w-full ${
                    !selectedCareer ? "overflow-y-auto" : ""
                  }`}
                >
                  {favoriteFields.length > 0 ? (
                    favoriteFields.map((career, index) => (
                      <div
                        key={index}
                        className={`flex items-center cursor-pointer hover:bg-[#b3e5e7] rounded-md p-2 transition-colors ${
                          selectedCareer?.name === career.name
                            ? "bg-[#b3e5e7]"
                            : ""
                        }`}
                        onClick={() =>
                          setSelectedCareer(
                            selectedCareer?.name === career.name ? null : career
                          )
                        }
                      >
                        <IoMdHeart className="text-[#007377] text-xl md:text-2xl mr-2" />
                        <h1 className="text-[#009ca6] text-xl md:text-2xl font-semibold">
                          {career.name}
                        </h1>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600 text-center text-lg py-4">
                      No favorite careers yet. Visit the Careers page to add
                      some!
                    </p>
                  )}
                </div>

                {/* Career Details Section */}
                {selectedCareer && (
                  <div className="mt-4 bg-white rounded-lg border border-[#87d7db] p-4 w-full">
                    {selectedCareer.description && (
                      <p className="text-gray-600 text-base mb-4">
                        {selectedCareer.description}
                      </p>
                    )}

                    {selectedCareer.professors &&
                      selectedCareer.professors.length > 0 && (
                        <div className="mb-4">
                          <h3 className="text-[#009ca6] font-semibold mb-2">
                            Professors
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedCareer.professors.map((professor, idx) => (
                              <span
                                key={idx}
                                className="bg-[#e4e6ec] text-[#007377] px-3 py-1 rounded-full text-sm"
                              >
                                {professor}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                    {selectedCareer.companies &&
                      selectedCareer.companies.length > 0 && (
                        <div className="mb-4">
                          <h3 className="text-[#009ca6] font-semibold mb-2">
                            Companies
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {selectedCareer.companies.map((company, idx) => (
                              <div
                                key={idx}
                                className="bg-[#f8f9fa] p-2 rounded-md text-sm"
                              >
                                {company}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {selectedCareer.skills &&
                      selectedCareer.skills.length > 0 && (
                        <div>
                          <h3 className="text-[#009ca6] font-semibold mb-2">
                            Required Skills
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedCareer.skills.map((skill, idx) => (
                              <span
                                key={idx}
                                className="bg-[#007377] text-white px-3 py-1 rounded-full text-sm"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                )}
              </div>
              {/* Bottom box */}
              <div className="flex flex-col gap-4 bg-[#c5ebec] border-2 border-[#87d7db] p-4 rounded-md w-full h-40 md:h-52 items-start">
                <h1 className="text-[#009ca6] text-xl md:text-3xl font-bold uppercase">
                  N/A
                </h1>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer mt-8 hover:bg-blue-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
