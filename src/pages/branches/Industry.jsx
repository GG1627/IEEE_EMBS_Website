import GradientMesh from "../../components/ui/GradientMesh";
import { gradientPresets } from "../../styles/ieeeColors";

export default function Industry() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <GradientMesh colors={gradientPresets.industry} />
      <div className="relative z-10 p-6 md:p-12">
        <div className="h-14" />
        <h1 className="text-4xl font-bold text-[#5B6770] mb-6">Industry</h1>
        <p className="text-lg text-gray-700 leading-relaxed mb-4">
          This year, we will welcome <strong>speakers from leading companies</strong> such as NVIDIA, IBM, and Johnson &amp; Johnson. These sessions will give students the chance to hear about industry trends, explore different career paths, and engage in open Q&amp;A with professionals.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed mb-4">
          To support professional growth, industry guests may also offer <strong>resume reviews</strong> and career guidance. We are exploring the creation of a <strong>resume bank</strong> on our website to share with recruiters who express interest.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed">
          These industry-focused events will complement our technical workshops by connecting students directly with the professionals shaping the future of engineering in medicine.
        </p>
      </div>
    </div>
  );
}
