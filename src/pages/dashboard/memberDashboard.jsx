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

    if (!eventCode || !eventCode.trim()) {
      showSnackbar("Please enter an event code", {
        customColor: "#b00000",
      });
      return;
    }

    if (!user?.id) {
      showSnackbar("Missing user data. Please try logging in again.", {
        customColor: "#b00000",
      });
      return;
    }

    // Use the same check-in logic as QR scanning
    await performCheckIn(eventCode);
  };

  // Handle QR code scan result
  const handleQRScan = async (result) => {
    console.log("QR Scan result:", result); // Debug log

    if (result) {
      // Extract the actual text from the result - handle different result formats
      let scannedText = null;

      if (typeof result === "string") {
        scannedText = result;
      } else if (result.text) {
        scannedText = result.text;
      } else if (result.rawValue) {
        scannedText = result.rawValue;
      } else if (Array.isArray(result) && result.length > 0) {
        scannedText = result[0].text || result[0].rawValue || result[0];
      }

      console.log("Extracted scanned text:", scannedText); // Debug log

      if (scannedText && typeof scannedText === "string") {
        let extractedCode = null;

        try {
          // Try to extract code from URL first
          const url = new URL(scannedText);
          const codeParam = url.searchParams.get("code");

          // Accept URLs from multiple domains (old .com and new .vercel.app)
          const validDomains = [
            "uf-ieee-embs.com",
            "ieee-embs-website.vercel.app",
          ];
          const isValidDomain = validDomains.some((domain) =>
            url.hostname.includes(domain)
          );

          if (codeParam && codeParam.trim() && isValidDomain) {
            extractedCode = codeParam.trim();
          } else if (codeParam && codeParam.trim()) {
            // Accept code even if domain doesn't match (for flexibility)
            extractedCode = codeParam.trim();
          } else {
            // If URL doesn't have a valid code parameter, use the full URL as code
            extractedCode = scannedText.trim();
          }
        } catch (error) {
          // If it's not a URL, use the scanned text directly as the code
          extractedCode = scannedText.trim();
        }

        console.log("Extracted code:", extractedCode); // Debug log

        if (extractedCode) {
          // Close the scanner immediately
          setShowQRScanner(false);

          // Set the event code
          setEventCode(extractedCode);

          // Show scanning success message
          showSnackbar("QR code scanned! Processing check-in...", {
            customColor: "#007377",
          });

          // Automatically trigger check-in
          await performCheckIn(extractedCode);
        } else {
          showSnackbar("Invalid QR code - no code found", {
            customColor: "#b00000",
          });
        }
      } else {
        showSnackbar("Invalid QR code format", {
          customColor: "#b00000",
        });
      }
    }
  };

  // Separate function to handle the actual check-in logic
  const performCheckIn = async (code) => {
    if (!code || !code.trim()) {
      showSnackbar("Invalid event code", {
        customColor: "#b00000",
      });
      return;
    }

    const eventId = await getEventId(code);

    console.log("User ID:", user.id);
    console.log("Event ID:", eventId);
    console.log("Code:", code);

    if (!eventId) {
      // Error already shown in getEventId
      return;
    }

    if (!user?.id) {
      showSnackbar("Missing user data. Please try logging in again.", {
        customColor: "#b00000",
      });
      return;
    }

    try {
      const { data, error } = await supabase.rpc("claim_event", {
        p_member_id: user.id,
        p_event_id: eventId,
        p_code: code,
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
          showSnackbar(
            "Checked in successfully! Points added to your account.",
            {
              customColor: "#007377",
            }
          );
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

  // Handle QR scanner errors
  const handleQRError = (error) => {
    console.error("QR Scanner error:", error);
    showSnackbar("Camera access denied or QR scanner error", {
      customColor: "#b00000",
    });
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-12">
        <div className="justify-center items-center flex-col flex mt-16">
          <div className="w-full max-w-7xl mb-6 sm:mb-8 px-2 sm:px-4 md:px-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#009ca6] mb-2">
              Welcome to Your Dashboard
            </h1>
            <p className="text-gray-600 text-base sm:text-lg md:text-xl">
              Track your points and progress with UF IEEE EMBS!
            </p>
          </div>
          <div className="flex flex-col gap-4 w-full max-w-7xl px-2 sm:px-4 md:px-0 mb-6">
            <div className="flex flex-col gap-4 bg-[#c5ebec] border-2 border-[#87d7db] p-4 sm:p-6 rounded-xl w-full shadow-sm items-start">
              <h1 className="text-[#009ca6] text-xl sm:text-2xl md:text-3xl font-bold uppercase">
                Event Check In
              </h1>
              <p className="text-gray-600 text-base sm:text-lg md:text-xl leading-relaxed">
                Scan the QR code or enter the event code to check in and earn
                points!
              </p>
              <div className="w-full space-y-4">
                <form
                  onSubmit={handleCheckIn}
                  className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
                >
                  <div className="flex-1 sm:min-w-0">
                    <input
                      type="text"
                      placeholder="Enter event code"
                      value={eventCode}
                      onChange={(e) => setEventCode(e.target.value)}
                      className="w-full px-4 py-3 border bg-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#009ca6] focus:border-[#009ca6] border-gray-300 text-base"
                    />
                  </div>
                  <div className="flex gap-3 sm:flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowQRScanner(true)}
                      className="flex-1 sm:flex-none px-4 py-3 bg-[#007377] text-white rounded-lg shadow-sm hover:bg-[#005c60] focus:outline-none focus:ring-2 focus:ring-[#007377] focus:ring-offset-2 hover:cursor-pointer flex items-center justify-center gap-2 font-medium transition-colors duration-200"
                    >
                      <FaQrcode className="text-lg" />
                      <span className="sm:hidden">Scan QR Code</span>
                      <span className="hidden sm:inline">Scan QR</span>
                    </button>
                    <button
                      type="submit"
                      className="flex-1 sm:flex-none px-6 py-3 bg-[#009ca6] text-white rounded-lg shadow-sm hover:bg-[#007377] focus:outline-none focus:ring-2 focus:ring-[#009ca6] focus:ring-offset-2 hover:cursor-pointer font-medium transition-colors duration-200"
                    >
                      Check In
                    </button>
                  </div>
                </form>

                {/* QR Scanner Modal */}
                {showQRScanner && (
                  <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
                      <div className="flex justify-between items-center p-6 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-[#009ca6] rounded-lg">
                            <FaCamera className="text-white text-lg" />
                          </div>
                          <h3 className="text-xl font-bold text-[#009ca6]">
                            Scan QR Code
                          </h3>
                        </div>
                        <button
                          onClick={() => setShowQRScanner(false)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        >
                          <svg
                            className="w-6 h-6 text-gray-500"
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
                        </button>
                      </div>

                      <div className="p-6">
                        <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-4">
                          <Scanner
                            onScan={(result) => handleQRScan(result)}
                            onError={handleQRError}
                            constraints={{ facingMode: "environment" }}
                            styles={{
                              container: {
                                width: "100%",
                                height: "280px",
                                borderRadius: "8px",
                              },
                            }}
                          />
                          {/* Scanning overlay */}
                          <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute inset-0 border-2 border-transparent">
                              <div className="absolute top-4 left-4 w-6 h-6 border-l-4 border-t-4 border-[#009ca6] rounded-tl-lg"></div>
                              <div className="absolute top-4 right-4 w-6 h-6 border-r-4 border-t-4 border-[#009ca6] rounded-tr-lg"></div>
                              <div className="absolute bottom-4 left-4 w-6 h-6 border-l-4 border-b-4 border-[#009ca6] rounded-bl-lg"></div>
                              <div className="absolute bottom-4 right-4 w-6 h-6 border-r-4 border-b-4 border-[#009ca6] rounded-br-lg"></div>
                            </div>
                          </div>
                        </div>

                        <div className="text-center">
                          <p className="text-sm text-gray-600 mb-2">
                            Position the QR code within the frame to scan
                          </p>
                          <p className="text-xs text-gray-500">
                            Make sure you have good lighting and hold your
                            device steady
                          </p>
                        </div>

                        <button
                          onClick={() => setShowQRScanner(false)}
                          className="w-full mt-6 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors duration-200 font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4 sm:gap-6 w-full max-w-7xl px-2 sm:px-4 md:px-0">
            {/* Left column - 2/3 width */}
            <div className="flex flex-col gap-4 w-full md:w-2/3">
              {/* Top row - 2 boxes */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col gap-3 bg-[#c5ebec] border-2 border-[#87d7db] p-4 sm:p-6 rounded-lg w-full sm:w-1/2 min-h-[120px] sm:h-52 items-center sm:items-start justify-center">
                  <h1 className="text-[#009ca6] text-xl sm:text-2xl md:text-3xl font-bold uppercase text-center sm:text-left">
                    Points
                  </h1>
                  <h1 className="text-[#009ca6] text-3xl sm:text-5xl md:text-8xl font-bold leading-none">
                    {userStats.points.toLocaleString()}
                  </h1>
                  <div className="w-full h-1 bg-[#007377] rounded"></div>
                </div>
                <div className="flex flex-col gap-3 bg-[#c5ebec] border-2 border-[#87d7db] p-4 sm:p-6 rounded-lg w-full sm:w-1/2 min-h-[120px] sm:h-52 items-center sm:items-start justify-center">
                  <h1 className="text-[#009ca6] text-xl sm:text-2xl md:text-3xl font-bold uppercase text-center sm:text-left leading-tight">
                    Events Attended
                  </h1>
                  <h1 className="text-[#009ca6] text-3xl sm:text-5xl md:text-8xl font-bold leading-none">
                    {userStats.events_attended}
                  </h1>
                  <div className="w-full h-1 bg-[#007377] rounded"></div>
                </div>
              </div>
              {/* Bottom box - full width of left column */}
              <div className="flex flex-col gap-4 bg-[#c5ebec] border-2 border-[#87d7db] p-4 sm:p-6 rounded-lg w-full min-h-[200px] items-start">
                <h1 className="text-[#009ca6] text-xl sm:text-2xl md:text-3xl font-bold uppercase">
                  Events Attended
                </h1>
                {/* Events in a responsive grid format */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-3 w-full">
                  {sampleEvents.map((event, index) => (
                    <div
                      key={index}
                      className="flex items-center p-2 bg-white/30 rounded-lg hover:bg-white/50 transition-colors duration-200"
                    >
                      <div className="w-2 h-2 bg-[#007377] rounded-full mr-3 flex-shrink-0"></div>
                      <h1 className="text-[#009ca6] text-lg sm:text-xl font-semibold leading-tight">
                        {event}
                      </h1>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column - 1/3 width */}
            <div className="flex flex-col gap-4 w-full md:w-1/3">
              {/* Top box */}
              <div
                className={`flex flex-col gap-4 bg-[#c5ebec] border-2 border-[#87d7db] p-4 sm:p-6 rounded-lg w-full items-start ${
                  selectedCareer ? "h-auto" : "min-h-[200px] md:h-auto"
                }`}
              >
                <h1 className="text-[#009ca6] text-xl sm:text-2xl md:text-3xl font-bold uppercase">
                  Favorite Careers
                </h1>
                <div
                  className={`flex flex-col gap-3 w-full ${
                    !selectedCareer
                      ? "overflow-y-auto max-h-60 md:max-h-none"
                      : ""
                  }`}
                >
                  {favoriteFields.length > 0 ? (
                    favoriteFields.map((career, index) => (
                      <div
                        key={index}
                        className={`flex items-center cursor-pointer hover:bg-[#b3e5e7] rounded-lg p-3 transition-colors duration-200 ${
                          selectedCareer?.name === career.name
                            ? "bg-[#b3e5e7] ring-2 ring-[#007377]/20"
                            : ""
                        }`}
                        onClick={() =>
                          setSelectedCareer(
                            selectedCareer?.name === career.name ? null : career
                          )
                        }
                      >
                        <IoMdHeart className="text-[#007377] text-xl sm:text-2xl mr-3 flex-shrink-0" />
                        <h1 className="text-[#009ca6] text-lg sm:text-xl md:text-2xl font-semibold leading-tight">
                          {career.name}
                        </h1>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <div className="w-16 h-16 bg-white/50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <IoMdHeart className="text-[#007377] text-2xl" />
                      </div>
                      <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                        No favorite careers yet. Visit the Careers page to add
                        some!
                      </p>
                    </div>
                  )}
                </div>

                {/* Career Details Section */}
                {selectedCareer && (
                  <div className="mt-4 bg-white rounded-lg border border-[#87d7db] p-4 sm:p-6 w-full">
                    {selectedCareer.description && (
                      <p className="text-gray-600 text-sm sm:text-base mb-4 leading-relaxed">
                        {selectedCareer.description}
                      </p>
                    )}

                    {selectedCareer.professors &&
                      selectedCareer.professors.length > 0 && (
                        <div className="mb-4">
                          <h3 className="text-[#009ca6] font-semibold mb-3 text-sm sm:text-base">
                            Professors
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedCareer.professors.map((professor, idx) => (
                              <span
                                key={idx}
                                className="bg-[#e4e6ec] text-[#007377] px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium"
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
                          <h3 className="text-[#009ca6] font-semibold mb-3 text-sm sm:text-base">
                            Companies
                          </h3>
                          <div className="grid grid-cols-1 gap-2">
                            {selectedCareer.companies.map((company, idx) => (
                              <div
                                key={idx}
                                className="bg-[#f8f9fa] p-3 rounded-lg text-xs sm:text-sm font-medium text-gray-700"
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
                          <h3 className="text-[#009ca6] font-semibold mb-3 text-sm sm:text-base">
                            Required Skills
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedCareer.skills.map((skill, idx) => (
                              <span
                                key={idx}
                                className="bg-[#007377] text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium"
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
              <div className="flex flex-col gap-4 bg-[#c5ebec] border-2 border-[#87d7db] p-4 sm:p-6 rounded-lg w-full min-h-[120px] md:h-56 items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-[#007377] text-xl font-bold">?</span>
                  </div>
                  <h1 className="text-[#009ca6] text-lg sm:text-xl md:text-2xl font-bold uppercase mb-2">
                    Coming Soon
                  </h1>
                  <p className="text-gray-600 text-sm">
                    More features will be added here
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full max-w-7xl px-2 sm:px-4 md:px-0 mt-8">
            <button
              onClick={handleLogout}
              className="w-full sm:w-auto mx-auto block bg-gradient-to-r from-[#a44da0]/80 to-[#a44da0] text-white px-6 py-3 rounded-lg cursor-pointer hover:from-[#94c956]/80 hover:to-[#94c956]/80 transition-all duration-200 font-medium shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
