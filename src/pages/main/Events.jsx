import Footer from "../../components/layout/Footer";
import GradientMesh from "../../components/ui/GradientMesh";
import { gradientPresets } from "../../styles/ieeeColors";

export default function Events() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Full Screen Mesh Gradient Background */}
      <div className="absolute inset-0 overflow-hidden">
        <GradientMesh
          colors={gradientPresets.tech}
          baseGradient="linear-gradient(to bottom, #b0f7ff, #f0f9ff, #f0f9ff)"
        />
      </div>
      <div className="flex-1 pt-16 relative z-10">
        {/* <h1 className="text-3xl font-bold mb-4">Upcoming Events</h1> */}

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
