import Footer from "../../components/layout/Footer";
import { Link } from "react-router-dom";

export default function Events() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 pt-16">
        {/* <h1 className="text-3xl font-bold mb-4">Upcoming Events</h1> */}

        {/* RSVP Button */}
        <div className="text-center mb-0 mt-4">
          <Link to="/design-a-thon-rsvp">
            <button className="relative bg-[#772583] hover:bg-[#9C1E96] text-white px-8 py-3 rounded-3xl text-lg shadow-[0_0_20px_rgba(119,37,131,0.6)] hover:shadow-[0_0_40px_rgba(119,37,131,0.8)] hover:cursor-pointer transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-300 overflow-hidden">
              {/* Glowing border animation */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse opacity-80"></div>
              <div className="absolute inset-0 rounded-3xl border-2 border-white/50 hover:border-white/90 transition-colors duration-300 shadow-[0_0_15px_rgba(255,255,255,0.3)]"></div>
              <span className="relative z-10">RSVP for Design-a-thon!</span>
            </button>
          </Link>
        </div>

        <div className="p-4 max-w-[1600px] mx-auto">
          <div className="overflow-hidden rounded shadow-lg">
            <iframe
              src="https://calendar.google.com/calendar/embed?src=41f1ab6a263431af2451ca9507cd60a97d9eefed70ea92a3b22a6fa305346931%40group.calendar.google.com&ctz=America%2FNew_York"
              style={{ border: 0 }}
              width="100%"
              height="700"
              frameBorder="0"
              scrolling="no"
              title="UF EMBS Calendar"
            ></iframe>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
