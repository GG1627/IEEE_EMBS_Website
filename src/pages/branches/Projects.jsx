import GradientMesh from "../../components/ui/GradientMesh";
import { gradientPresets } from "../../styles/ieeeColors";

export default function Projects() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <GradientMesh colors={gradientPresets.projects} />
      <div className="relative z-10 p-6 md:p-12">
        <div className="h-14" />
        <h1 className="text-4xl font-bold text-[#772583] mb-6">Projects</h1>
        <p className="text-lg text-gray-700 leading-relaxed mb-4">
          We plan to launch <strong>design teams</strong> that will work on interdisciplinary problems at the intersection of medicine and engineering. Teams will meet regularly, set milestones, and present progress at showcase events.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed">
          We will also open a <strong>project idea submission</strong> channel so members can propose concepts to be evaluated and, if selected, executed by a dedicated team in the future.
        </p>
      </div>
    </div>
  );
}
