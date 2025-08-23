import GradientMesh from "../../components/ui/GradientMesh";
import { gradientPresets } from "../../styles/ieeeColors";

export default function Workshops() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <GradientMesh colors={gradientPresets.workshops} />
      <div className="relative z-10 p-6 md:p-12">
        <div className="h-14" />
        <h1 className="text-4xl font-bold text-[#00A3AD] mb-6">Workshops</h1>
        <p className="text-lg text-gray-700 leading-relaxed mb-4">
          The technical committees plan to host a variety of <strong>hands-on workshops</strong> designed to give students practical experience applying engineering concepts to the medical field.
        </p>
        <ul className="list-disc ml-6 text-lg text-gray-700 leading-relaxed space-y-2">
          <li><strong>September 11</strong>: Heartbeat Monitor Workshop ~ Students will learn EE terminology, Arduino programming, circuit equations, and component integration while assembling their own monitors.</li>
          <li><strong>October</strong>: Hackathon ~ A 12-hour hackathon themed around cancer detection during Mental Health Week. The event will feature prizes, meals, and possible sponsorship, with the potential to expand into genetic sequencing competitions in the spring.</li>
          <li><strong>Pill Dispenser Workshop</strong>: Students will design and 3D-print components to build pill dispensers, with the possibility of donating them to local care homes.</li>
        </ul>
      </div>
    </div>
  );
}
