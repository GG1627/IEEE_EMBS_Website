import GradientMesh from "../../components/ui/GradientMesh";
import { gradientPresets } from "../../styles/ieeeColors";

export default function Research() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <GradientMesh colors={gradientPresets.research} />
      <div className="relative z-10 p-6 md:p-12">
        <div className="h-14" />
        <h1 className="text-4xl font-bold text-[#00629B] mb-6">Research</h1>
        <p className="text-lg text-gray-700 leading-relaxed mb-4">
          We will create <strong>research connection opportunities</strong> for students to meet professors who are seeking new undergraduate researchers. These sessions will help members learn about ongoing projects, available roles, and how to get started in a lab.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed">
          As details are confirmed, we will publish <strong>interest forms</strong> and <strong>matchmaking info</strong> so members can indicate areas of interest and be connected with relevant faculty.
        </p>
      </div>
    </div>
  );
}
