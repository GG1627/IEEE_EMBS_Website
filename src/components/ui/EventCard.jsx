import { LuClock } from "react-icons/lu";
import { LuMapPin } from "react-icons/lu";

export default function EventCard({
  eventName,
  location,
  date,
  time,
  description,
}) {
  // Function to generate Google Calendar URL for the specific date
  const generateCalendarUrl = () => {
    // Parse the date to create a proper calendar URL
    const currentYear = new Date().getFullYear();
    let calendarDate;

    try {
      // Try to parse the date string (e.g., "September 3")
      const parsedDate = new Date(`${date}, ${currentYear}`);
      if (!isNaN(parsedDate.getTime())) {
        // Format as YYYYMMDD for Google Calendar
        const year = parsedDate.getFullYear();
        const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
        const day = String(parsedDate.getDate()).padStart(2, "0");
        calendarDate = `${year}${month}${day}`;
      }
    } catch (error) {
      console.error("Error parsing date:", error);
    }

    // Base calendar URL
    const baseUrl =
      "https://calendar.google.com/calendar/embed?src=41f1ab6a263431af2451ca9507cd60a97d9eefed70ea92a3b22a6fa305346931%40group.calendar.google.com&ctz=America%2FNew_York";

    // If we have a valid date, add it to the URL to navigate to that specific date
    if (calendarDate) {
      return `${baseUrl}&dates=${calendarDate}/${calendarDate}`;
    }

    // Fallback to the basic calendar view
    return baseUrl;
  };

  return (
    <>
      <div
        onClick={() => {
          window.open(generateCalendarUrl(), "_blank");
        }}
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
          description !== "No description available" && (
            <p className="mt-3 text-sm text-gray-500 italic">{description}</p>
          )}
      </div>
    </>
  );
}
