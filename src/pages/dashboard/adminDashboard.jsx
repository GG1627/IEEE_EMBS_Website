import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { supabase } from "../../lib/supabase";
import { useSnackbar } from "../../components/ui/Snackbar";

export default function AdminDashboard() {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventPoints, setEventPoints] = useState("");
  const [eventCode, setEventCode] = useState("");
  const [eventStartTime, setEventStartTime] = useState("");
  const [eventEndTime, setEventEndTime] = useState("");
  const [eventQrcode, setEventQrcode] = useState("");
  const [showQRCode, setShowQRCode] = useState(false);
  const [activeEvents, setActiveEvents] = useState([]);
  const [loadingActiveEvents, setLoadingActiveEvents] = useState(true);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loadingUpcomingEvents, setLoadingUpcomingEvents] = useState(true);

  const { showSnackbar } = useSnackbar();

  // Auto-update QR code when event code changes
  useEffect(() => {
    if (eventCode.trim()) {
      setEventQrcode(eventCode);
      setShowQRCode(true);
    } else {
      setEventQrcode("");
      setShowQRCode(false);
    }
  }, [eventCode]);

  // Fetch active and upcoming events on component mount
  useEffect(() => {
    fetchActiveEvents();
    fetchUpcomingEvents();
  }, []);

  // Function to fetch active events
  const fetchActiveEvents = async () => {
    try {
      setLoadingActiveEvents(true);
      const currentTime = new Date().toISOString();

      const { data, error } = await supabase
        .from("events")
        .select("*")
        .lte("start_time", currentTime)
        .gte("end_time", currentTime)
        .order("start_time", { ascending: false });

      if (error) {
        console.error("Error fetching active events:", error);
        showSnackbar("Error fetching active events", {
          customColor: "#dc2626",
        });
        setActiveEvents([]);
      } else {
        setActiveEvents(data || []);
      }
    } catch (error) {
      console.error("Error fetching active events:", error);
      setActiveEvents([]);
    } finally {
      setLoadingActiveEvents(false);
    }
  };

  // Function to fetch upcoming events
  const fetchUpcomingEvents = async () => {
    try {
      setLoadingUpcomingEvents(true);
      const currentTime = new Date().toISOString();

      const { data, error } = await supabase
        .from("events")
        .select("*")
        .gt("start_time", currentTime)
        .order("start_time", { ascending: true })
        .limit(3);

      if (error) {
        console.error("Error fetching upcoming events:", error);
        showSnackbar("Error fetching upcoming events", {
          customColor: "#dc2626",
        });
        setUpcomingEvents([]);
      } else {
        setUpcomingEvents(data || []);
      }
    } catch (error) {
      console.error("Error fetching upcoming events:", error);
      setUpcomingEvents([]);
    } finally {
      setLoadingUpcomingEvents(false);
    }
  };

  // Function to add event to database
  const addEvent = async (e) => {
    e.preventDefault();

    // Combine date and time into proper timestamp format with timezone
    // Create local date/time and convert to UTC for storage
    const startDateTime = new Date(
      `${eventDate}T${eventStartTime}:00`
    ).toISOString();
    const endDateTime = new Date(
      `${eventDate}T${eventEndTime}:00`
    ).toISOString();

    const { data, error } = await supabase.from("events").insert({
      name: eventName,
      date: eventDate,
      points: eventPoints,
      code: eventCode,
      start_time: startDateTime,
      end_time: endDateTime,
    });

    if (error) {
      console.error("Supabase error:", error);
      showSnackbar("Error adding event", { customColor: "#007377" });
    } else {
      console.log(data);
      showSnackbar("Event added successfully", { customColor: "#007377" });
      setEventName("");
      setEventDate("");
      setEventPoints("");
      setEventCode("");
      setEventStartTime("");
      setEventEndTime("");
      setEventQrcode("");
      setShowQRCode(false);
      // Refresh active and upcoming events after adding a new event
      fetchActiveEvents();
      fetchUpcomingEvents();
    }
  };

  // Function to generate random code
  const generateRandomCode = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    setEventCode(result);
  };

  // Function to download QR code as image
  const downloadQRCode = (eventCode, eventName) => {
    // Create a temporary canvas to render the QR code
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const size = 300; // Larger size for better quality
    canvas.width = size;
    canvas.height = size;

    // Create a temporary SVG element with the QR code
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = `
      <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="white"/>
      </svg>
    `;

    // Use html2canvas alternative - create QR code manually or use the library's canvas method
    // For now, we'll use a simpler approach with the QRCode library that can generate canvas
    import("qrcode")
      .then((QRCode) => {
        QRCode.toCanvas(
          canvas,
          `https://www.ufembs.com/checkin?code=${eventCode}`,
          {
            width: size,
            margin: 2,
            color: {
              dark: "#000000",
              light: "#FFFFFF",
            },
          },
          (error) => {
            if (error) {
              console.error("Error generating QR code:", error);
              showSnackbar("Error generating QR code for download", {
                customColor: "#dc2626",
              });
              return;
            }

            // Convert canvas to blob and download
            canvas.toBlob((blob) => {
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.download = `${eventName || eventCode}_QR_Code.png`;
              link.href = url;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);

              showSnackbar("QR code downloaded successfully", {
                customColor: "#007377",
              });
            }, "image/png");
          }
        );
      })
      .catch(() => {
        // Fallback method using SVG to canvas conversion
        const svgElement = document.querySelector(
          `#qr-${eventCode.replace(/[^a-zA-Z0-9]/g, "")}`
        );
        if (svgElement) {
          const svgData = new XMLSerializer().serializeToString(svgElement);
          const svgBlob = new Blob([svgData], {
            type: "image/svg+xml;charset=utf-8",
          });
          const url = URL.createObjectURL(svgBlob);
          const link = document.createElement("a");
          link.download = `${eventName || eventCode}_QR_Code.svg`;
          link.href = url;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);

          showSnackbar("QR code downloaded as SVG", { customColor: "#007377" });
        } else {
          showSnackbar("Error: Could not find QR code to download", {
            customColor: "#dc2626",
          });
        }
      });
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
        <div className="flex justify-center mt-16">
          <div className="w-full max-w-7xl">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-[#007377] mb-2">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">
                Manage events and track attendance
              </p>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Events */}
              <div className="space-y-8">
                {/* Active Events */}
                <div className="bg-white rounded-xl shadow-lg p-6 h-fit">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-[#007377] flex items-center gap-2">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Active Events
                    </h2>
                    <button
                      onClick={() => {
                        fetchActiveEvents();
                        fetchUpcomingEvents();
                      }}
                      className="text-[#007377] hover:text-[#005c60] transition-colors duration-200 hover:cursor-pointer"
                      title="Refresh events"
                    >
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
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                    </button>
                  </div>

                  {loadingActiveEvents ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#007377]"></div>
                      <span className="ml-3 text-gray-600">
                        Loading active events...
                      </span>
                    </div>
                  ) : activeEvents.length > 0 ? (
                    <div className="space-y-4 max-h-[600px] overflow-y-auto">
                      {activeEvents.map((event) => (
                        <div
                          key={event.id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                        >
                          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                {event.name}
                              </h3>
                              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                                <div className="flex items-center gap-1">
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v9a1 1 0 01-1 1H5a1 1 0 01-1-1V8a1 1 0 011-1h3zM9 5h6"
                                    />
                                  </svg>
                                  <span>
                                    {new Date(event.date).toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                    />
                                  </svg>
                                  <span>{event.points} points</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 8v4l3 3"
                                    />
                                  </svg>
                                  <span>
                                    {new Date(
                                      event.start_time
                                    ).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 8v4l3 3"
                                    />
                                  </svg>
                                  <span>
                                    {new Date(
                                      event.end_time
                                    ).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                </div>
                              </div>
                              <div className="bg-gradient-to-r from-[#007377] to-[#008d92] rounded-lg p-4 text-white">
                                <p className="text-sm font-medium mb-1 opacity-90">
                                  Event Code
                                </p>
                                <p className="text-3xl font-mono font-bold tracking-wider">
                                  {event.code}
                                </p>
                              </div>
                            </div>

                            <div className="flex-shrink-0 flex flex-col items-center">
                              <div className="bg-white p-4 rounded-lg border-2 border-gray-200 shadow-sm">
                                <QRCodeSVG
                                  id={`qr-${event.code.replace(
                                    /[^a-zA-Z0-9]/g,
                                    ""
                                  )}`}
                                  value={`https://www.ufembs.com/checkin?code=${event.code}`}
                                  size={100}
                                  level="H"
                                  className="block"
                                />
                              </div>
                              <p className="mt-2 text-xs text-gray-500 text-center font-medium">
                                Scan to check in
                              </p>
                              <button
                                onClick={() =>
                                  downloadQRCode(event.code, event.name)
                                }
                                className="mt-2 px-3 py-1.5 bg-[#007377] text-white text-xs font-medium rounded-lg hover:bg-[#005c60] focus:outline-none focus:ring-2 focus:ring-[#007377] focus:ring-offset-1 transition-all duration-200 hover:cursor-pointer flex items-center gap-1"
                                title="Download QR code"
                              >
                                <svg
                                  className="w-3 h-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                                  />
                                </svg>
                                Download
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-gray-300 mb-4">
                        <svg
                          className="mx-auto h-16 w-16"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v9a1 1 0 01-1 1H5a1 1 0 01-1-1V8a1 1 0 011-1h3zM9 5h6M9 11h6m-6 4h6"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-xl font-medium mb-2">
                        No active events
                      </p>
                      <p className="text-gray-400">
                        Create an event to start tracking attendance
                      </p>
                    </div>
                  )}
                </div>

                {/* Upcoming Events */}
                <div className="bg-white rounded-xl shadow-lg p-6 h-fit">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-[#007377] flex items-center gap-2">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      Upcoming Events
                    </h2>
                  </div>

                  {loadingUpcomingEvents ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#007377]"></div>
                      <span className="ml-3 text-gray-600">
                        Loading upcoming events...
                      </span>
                    </div>
                  ) : upcomingEvents.length > 0 ? (
                    <div className="space-y-4 max-h-[600px] overflow-y-auto">
                      {upcomingEvents.map((event) => (
                        <div
                          key={event.id}
                          className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
                        >
                          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                            {/* Left Column - Event Details */}
                            <div className="flex-1 space-y-4">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {event.name}
                              </h3>

                              <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                  <svg
                                    className="w-4 h-4 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                  </svg>
                                  <span>
                                    {new Date(event.date).toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <svg
                                    className="w-4 h-4 text-yellow-500"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                  </svg>
                                  <span>{event.points} points</span>
                                </div>
                                <div className="flex items-center gap-2 col-span-2">
                                  <svg
                                    className="w-4 h-4 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                  <span>
                                    {new Date(
                                      event.start_time
                                    ).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}{" "}
                                    -{" "}
                                    {new Date(
                                      event.end_time
                                    ).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                </div>
                              </div>

                              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
                                <p className="text-sm font-medium mb-1 opacity-90">
                                  Event Code
                                </p>
                                <p className="text-2xl font-mono font-bold tracking-wider">
                                  {event.code}
                                </p>
                              </div>

                              <div className="flex justify-center lg:justify-start">
                                <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-full">
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                  Starts in{" "}
                                  {Math.ceil(
                                    (new Date(event.start_time) - new Date()) /
                                      (1000 * 60 * 60 * 24)
                                  )}{" "}
                                  day
                                  {Math.ceil(
                                    (new Date(event.start_time) - new Date()) /
                                      (1000 * 60 * 60 * 24)
                                  ) !== 1
                                    ? "s"
                                    : ""}
                                </span>
                              </div>
                            </div>

                            {/* Right Column - QR Code */}
                            <div className="flex-shrink-0 flex flex-col items-center space-y-3">
                              <div className="bg-white p-3 rounded-lg border-2 border-gray-200 shadow-sm">
                                <QRCodeSVG
                                  id={`qr-upcoming-${event.code.replace(
                                    /[^a-zA-Z0-9]/g,
                                    ""
                                  )}`}
                                  value={`https://www.ufembs.com/checkin?code=${event.code}`}
                                  size={80}
                                  level="H"
                                  className="block"
                                />
                              </div>
                              <p className="text-xs text-gray-500 text-center font-medium">
                                QR Code
                              </p>
                              <button
                                onClick={() =>
                                  downloadQRCode(event.code, event.name)
                                }
                                className="px-3 py-1.5 bg-[#007377] text-white text-xs font-medium rounded-lg hover:bg-[#005c60] focus:outline-none focus:ring-2 focus:ring-[#007377] focus:ring-offset-1 transition-all duration-200 hover:cursor-pointer flex items-center gap-1.5"
                                title="Download QR code"
                              >
                                <svg
                                  className="w-3 h-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                                  />
                                </svg>
                                Download
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-gray-300 mb-4">
                        <svg
                          className="mx-auto h-16 w-16"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-xl font-medium mb-2">
                        No upcoming events
                      </p>
                      <p className="text-gray-400">
                        Create an event to see it here
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Add Event Form */}
              <div className="bg-white rounded-xl shadow-lg p-6 h-fit">
                <h2 className="text-2xl font-bold text-[#007377] mb-6 flex items-center gap-2">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Create New Event
                </h2>

                <form onSubmit={addEvent} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label
                        htmlFor="event-name"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Event Name
                      </label>
                      <input
                        id="event-name"
                        type="text"
                        required
                        value={eventName}
                        onChange={(e) => setEventName(e.target.value)}
                        className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#007377] focus:border-[#007377] transition-colors duration-200"
                        placeholder="Enter event name"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="event-date"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Event Date
                      </label>
                      <input
                        id="event-date"
                        type="date"
                        required
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#007377] focus:border-[#007377] transition-colors duration-200"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="event-points"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Event Points
                      </label>
                      <input
                        id="event-points"
                        type="number"
                        required
                        value={eventPoints}
                        onChange={(e) => setEventPoints(e.target.value)}
                        className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#007377] focus:border-[#007377] transition-colors duration-200"
                        placeholder="Points"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="event-start-time"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Start Time
                      </label>
                      <input
                        id="event-start-time"
                        type="time"
                        required
                        value={eventStartTime}
                        onChange={(e) => setEventStartTime(e.target.value)}
                        className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#007377] focus:border-[#007377] transition-colors duration-200"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="event-end-time"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        End Time
                      </label>
                      <input
                        id="event-end-time"
                        type="time"
                        required
                        value={eventEndTime}
                        onChange={(e) => setEventEndTime(e.target.value)}
                        className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#007377] focus:border-[#007377] transition-colors duration-200"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label
                        htmlFor="event-code"
                        className="block text-sm font-semibold text-gray-700"
                      >
                        Event Code
                      </label>
                      <button
                        type="button"
                        onClick={generateRandomCode}
                        className="bg-[#007377] text-sm text-white px-4 py-2 rounded-lg hover:bg-[#005c60] focus:outline-none focus:ring-2 focus:ring-[#007377] focus:ring-offset-2 transition-all duration-200 hover:cursor-pointer font-medium"
                      >
                        Generate Code
                      </button>
                    </div>
                    <input
                      id="event-code"
                      type="text"
                      required
                      value={eventCode}
                      onChange={(e) => setEventCode(e.target.value)}
                      className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#007377] focus:border-[#007377] transition-colors duration-200 font-mono"
                      placeholder="Enter or generate event code"
                    />
                  </div>

                  {/* QR Code Preview */}
                  <div className="border-t pt-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-4">
                      QR Code Preview
                    </label>
                    {showQRCode && eventQrcode ? (
                      <div className="bg-gray-50 rounded-lg p-6 flex flex-col items-center">
                        <div className="bg-white p-4 rounded-lg border-2 border-gray-200 shadow-sm">
                          <QRCodeSVG
                            id={`qr-preview-${eventQrcode.replace(
                              /[^a-zA-Z0-9]/g,
                              ""
                            )}`}
                            value={`https://www.ufembs.com/checkin?code=${eventQrcode}`}
                            size={120}
                            level="H"
                          />
                        </div>
                        <p className="mt-3 text-sm font-medium text-gray-700">
                          Code:{" "}
                          <span className="font-mono text-[#007377]">
                            {eventQrcode}
                          </span>
                        </p>
                        <p className="mt-1 text-xs text-gray-500 text-center mb-3">
                          Students will scan this to check in
                        </p>
                        <button
                          type="button"
                          onClick={() => downloadQRCode(eventQrcode, eventName)}
                          className="px-4 py-2 bg-[#007377] text-white text-sm font-medium rounded-lg hover:bg-[#005c60] focus:outline-none focus:ring-2 focus:ring-[#007377] focus:ring-offset-2 transition-all duration-200 hover:cursor-pointer flex items-center gap-2"
                          title="Download QR code"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                            />
                          </svg>
                          Download QR Code
                        </button>
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-lg p-8 flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mb-3">
                          <svg
                            className="w-8 h-8 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 16h4.01M12 12V8"
                            />
                          </svg>
                        </div>
                        <p className="text-sm text-gray-500 text-center">
                          QR code will appear when you enter an event code
                        </p>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full px-6 py-4 bg-gradient-to-r from-[#007377] to-[#008d92] text-white font-semibold rounded-lg hover:from-[#005c60] hover:to-[#007377] focus:outline-none focus:ring-2 focus:ring-[#007377] focus:ring-offset-2 transition-all duration-200 hover:cursor-pointer shadow-lg hover:shadow-xl"
                  >
                    Create Event
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
