import { LuClock } from "react-icons/lu";
import { LuMapPin } from "react-icons/lu";

export default function EventCard({
  eventName,
  location,
  date,
  time,
  description,
  onCardClick,
}) {
  return (
    <>
      <div
        onClick={onCardClick}
        className="bg-white rounded-2xl shadow-md p-6 border-l-8 border-[#772583] inline-block text-left hover:scale-105 transition-all duration-300 hover:cursor-pointer overflow-hidden"
      >
        <span className="text-sm font-semibold uppercase tracking-wide text-[#772583]">
          {eventName}
        </span>
        <p className="mt-2 text-lg text-gray-800">
          <strong>
            <LuMapPin className="inline-block mr-2 text-[#9C1E96]" /> Location:{" "}
          </strong>
          {location}
        </p>
        <p className="text-lg text-gray-800">
          <strong>
            <LuClock className="inline-block mr-2 text-[#9C1E96]" /> Date &
            Time:{" "}
          </strong>
          {date}: {time}
        </p>
        {description &&
          description.trim() &&
          description !== "No description available" &&
          !description.trim().startsWith("<a") && (
            <div className="mt-3">
              <p
                className="text-sm text-gray-500 italic"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  lineHeight: "1.4",
                  maxHeight: "2.8em",
                }}
              >
                {description}
              </p>
              {description.length > 100 && (
                <p className="text-xs text-[#772583] font-medium mt-1 hover:text-[#9C1E96] transition-colors duration-200">
                  ...see more
                </p>
              )}
            </div>
          )}
      </div>
    </>
  );
}
