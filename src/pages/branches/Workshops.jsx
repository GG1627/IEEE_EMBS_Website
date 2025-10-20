import GradientMesh from "../../components/ui/GradientMesh";
import { gradientPresets } from "../../styles/ieeeColors";

export default function Workshops() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <GradientMesh colors={gradientPresets.projects ?? gradientPresets.outreach} />
      <div className="relative z-10 p-6 md:p-12">
        <div className="h-14" />
        <h1 className="text-4xl font-bold text-[#00629B] mb-6">Workshops</h1>

        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          Our technical committees host hands-on workshops that give students practical
          experience applying engineering concepts to the medical field.
        </p>

        {/* Recent Workshops & Events */}
        <h2 className="text-2xl font-semibold text-[#00629B] mb-3">Recent Workshops &amp; Events</h2>

        <div className="mb-6">
          <p className="text-base text-gray-500 font-medium">September 25, 2025</p>
          <h3 className="text-xl font-semibold text-gray-800">Heartbeat Monitor Workshop</h3>
          <p className="text-lg text-gray-700 leading-relaxed mt-2">
            Members built circuits to detect real-time heartbeats using infrared and photodiode
            sensors, op-amps, and filters. We covered core concepts like Ohm’s Law, RC circuits,
            and signal filtering to show how electronics capture biological signals. Participants
            assembled the circuit on breadboards, visualized waveforms in TinkerCAD, and used
            Arduino code to record data—including calculating BPM.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mt-2 italic">
            Thank you to our Tech Lead, Mike, for guiding the session. If you attended, please fill
            out the feedback form in our Discord!
          </p>
        </div>

        <div className="mb-8">
          <p className="text-base text-gray-500 font-medium">October 5, 2025</p>
          <h3 className="text-xl font-semibold text-gray-800">Intro to Programming Workshop</h3>
          <p className="text-lg text-gray-700 leading-relaxed mt-2">
            A beginner-friendly introduction to Python: IDEs, interpreters vs. compilers,
            variables and data types, input/output, operators, loops, and functions. We also
            practiced writing clean, readable code with comments and learned strategies for
            debugging syntax and runtime errors. Participants applied these fundamentals by
            building a Tic-Tac-Toe game.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mt-2 italic">
            Thank you to Devin for leading an engaging session! Slides are available in the
            <span className="font-semibold"> #resources</span> channel on our Discord.
          </p>
        </div>

        <div className="mb-10">
          <p className="text-base text-gray-500 font-medium">October 11, 2025 &middot; 8:00 AM–8:00 PM</p>
          <h3 className="text-xl font-semibold text-gray-800">Design-a-thon (Mental Health &amp; Cancer Awareness)</h3>
          <p className="text-lg text-gray-700 leading-relaxed mt-2">
            A 12-hour, team-based design event held during Mental Health Awareness Week and Cancer
            Awareness Month. Open to all students (no experience required), the day focused on
            meaningful projects addressing challenges in mental health and cancer. Food was
            provided and prizes were awarded, with an open Q&amp;A and showcase to close out the
            event.
          </p>
        </div>

        {/* What's Ahead */}
        <h2 className="text-2xl font-semibold text-[#00629B] mb-3">What’s Ahead</h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          We’re planning additional hands-on workshops throughout the year. Watch our Discord and
          the Resources tab for sign-ups, slides, and materials as they’re posted.
        </p>
      </div>
    </div>
  );
}
