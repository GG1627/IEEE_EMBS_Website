export default function EventCard({
  eventName,
  location,
  date,
  time,
  description,
}) {
  return (
    <>
      <div className="bg-white rounded-2xl shadow-md p-6 border-l-8 border-[#772583] inline-block text-left">
        <span className="text-sm font-semibold uppercase tracking-wide text-[#772583]">
          {eventName}
        </span>
        <p className="mt-2 text-lg text-gray-800">
          <strong>📍 Location:</strong> {location}
        </p>
        <p className="text-lg text-gray-800">
          <strong>🕒 Date & Time:</strong> {date}: {time}
        </p>
        <p className="mt-3 text-sm text-gray-500 italic">{description}</p>
      </div>
    </>
  );
}
