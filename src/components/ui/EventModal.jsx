import { LuClock, LuMapPin, LuX } from "react-icons/lu";
import { Modal } from "@mui/material";

export default function EventModal({
  isOpen,
  onClose,
  eventName,
  location,
  date,
  time,
  description,
}) {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="event-modal-title"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        "& .MuiBackdrop-root": {
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        },
      }}
    >
      <div
        className="relative rounded-3xl overflow-hidden outline-none max-w-2xl w-[90%] max-h-[90vh] overflow-y-auto"
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.5), 0 40px 100px rgba(255, 255, 255, 0.5)",
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 p-2 rounded-xl transition-all duration-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#772583] focus:ring-offset-2"
          aria-label="Close modal"
        >
          <LuX className="w-5 h-5 text-gray-600 hover:text-gray-900" />
        </button>

        {/* Content Container */}
        <div className="p-8">
          {/* Event Name */}
          <div className="mb-8 pr-12">
            <h2
              id="event-modal-title"
              className="text-3xl font-semibold text-gray-900 tracking-tight leading-tight mb-3"
            >
              {eventName}
            </h2>
            <div
              className="h-0.5 rounded-full transition-all duration-500"
              style={{
                background: "linear-gradient(90deg, #772583 0%, #9C1E96 100%)",
                width: "32px",
              }}
            />
          </div>

          {/* Event Details */}
          <div className="space-y-6 mb-8">
            {/* Location */}
            <div className="flex items-start gap-4">
              <div
                className="flex-shrink-0 p-2.5 rounded-xl transition-all duration-300"
                style={{
                  background: "rgba(119, 37, 131, 0.08)",
                }}
              >
                <LuMapPin className="text-[#772583] text-lg" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                  Location
                </p>
                <p className="text-gray-900 text-base font-medium leading-snug">
                  {location}
                </p>
              </div>
            </div>

            {/* Date & Time */}
            <div className="flex items-start gap-4">
              <div
                className="flex-shrink-0 p-2.5 rounded-xl transition-all duration-300"
                style={{
                  background: "rgba(119, 37, 131, 0.08)",
                }}
              >
                <LuClock className="text-[#772583] text-lg" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                  Date & Time
                </p>
                <p className="text-gray-900 text-base font-medium leading-snug">
                  {date}
                </p>
                <p className="text-gray-600 text-sm mt-0.5 font-normal">
                  {time}
                </p>
              </div>
            </div>
          </div>

          {/* Full Description */}
          {description &&
            description.trim() &&
            description !== "No description available" &&
            !description.trim().startsWith("<a") && (
              <div className="pt-6 border-t border-gray-200">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Description
                </p>
                <p
                  className="text-sm text-gray-700 leading-relaxed font-normal whitespace-pre-wrap"
                  style={{
                    lineHeight: "1.6",
                  }}
                >
                  {description}
                </p>
              </div>
            )}
        </div>
      </div>
    </Modal>
  );
}
