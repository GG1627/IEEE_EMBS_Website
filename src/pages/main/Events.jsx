import Footer from "../../components/layout/Footer";

export default function Events() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 py-16">
        <h1 className="text-3xl font-bold mb-4">Upcoming Events</h1>
        <div className="p-4">
          <div className="overflow-hidden rounded shadow-lg">
            <iframe
              src="https://calendar.google.com/calendar/embed?src=41f1ab6a263431af2451ca9507cd60a97d9eefed70ea92a3b22a6fa305346931%40group.calendar.google.com&ctz=America%2FNew_York"
              style={{ border: 0 }}
              width="100%"
              height="600"
              frameBorder="0"
              scrolling="no"
              title="IEEE EMBS Calendar"
            ></iframe>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
