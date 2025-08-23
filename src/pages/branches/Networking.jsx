import GradientMesh from "../../components/ui/GradientMesh";
import { gradientPresets } from "../../styles/ieeeColors";

export default function Networking() {
  return (
    <div className="relative min-h-screen overflow-hidden">{/* remove bg-white */}
      <GradientMesh colors={gradientPresets.networking} />
      <div className="relative z-10 p-6 md:p-12">
        <div className="h-14" />
        <h1 className="text-4xl font-bold text-[#772583] mb-6">Networking</h1>
        <p className="text-lg text-gray-700 leading-relaxed">
          This year, the chapter aims to strengthen its community through opportunities for faculty and peer mentorship. These efforts will help students build meaningful connections with professors, graduate students, and upperclassmen, fostering guidance both academically and professionally. In addition, many of our outreach and workshop events will naturally include networking elements, such as industry Q&amp;A sessions, resume review opportunities, and collaborations with other student organizations like IEEE and BMES.
        </p>
      </div>
    </div>
  );
}
