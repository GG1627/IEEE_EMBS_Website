import GradientMesh from "../../components/ui/GradientMesh";
import { gradientPresets } from "../../styles/ieeeColors";

export default function Industry() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <GradientMesh colors={gradientPresets.industry ?? gradientPresets.outreach} />
      <div className="relative z-10 p-6 md:p-12">
        <div className="h-14" />
        <h1 className="text-4xl font-bold text-[#00629B] mb-6">Industry</h1>

        <p className="text-lg text-gray-700 leading-relaxed mb-4">
          Our Industry series connects students with professionals from leading companies.
          We’ve already kicked off the semester with IBM and Johnson &amp; Johnson, and are
          planning additional talks with organizations such as NVIDIA. These sessions help
          students understand industry trends, explore different career paths, and engage
          in open Q&amp;A.
        </p>

        <p className="text-lg text-gray-700 leading-relaxed mb-4">
          <strong>Recent Feature — IBM (Sept 15, 2025):</strong> We hosted{" "}
          <strong>Dr. Raquel Norel</strong>, Staff Research Scientist at IBM, for a
          hybrid talk on digital health technologies that apply AI, mathematics, and
          signal processing to biomedical problems. Dr. Norel highlighted speech-based
          biomarkers for early detection and monitoring of conditions including ALS,
          Parkinson’s disease, schizophrenia, and depression. A Q&amp;A followed, giving
          students a chance to ask about her research and career path. The session
          recording is available in our <strong>Discord</strong>. Huge thanks to
          Dr. Norel, IBM, and our Outreach Coordinator, <strong>Fabiana</strong>, for
          organizing this event.
        </p>

        <p className="text-lg text-gray-700 leading-relaxed mb-4">
          <strong>Recent Feature — Johnson &amp; Johnson (Oct 16, 2025):</strong> We hosted{" "}
          <strong>Anahita Kyani</strong>, Director of Neuroscience, Data Science &amp; Digital
          Health at Johnson &amp; Johnson, for a Zoom session on innovation in digital health and AI
          across healthcare and pharmaceuticals. With 20+ years of experience, she shared insights
          on translating data science into clinical impact, navigating careers at the intersection
          of AI and medicine, and trends shaping the future of the field. The Zoom link was shared
          day-of, followed by an open Q&amp;A.
        </p>

        <p className="text-lg text-gray-700 leading-relaxed mb-4">
          <strong>Professional Growth:</strong> Industry guests may also offer
          résumé reviews and career guidance. We’re exploring a résumé bank to
          share with interested recruiters.
        </p>

        <p className="text-lg text-gray-700 leading-relaxed">
          These industry-focused events complement our technical workshops by connecting
          students directly with the professionals shaping the future of engineering in
          medicine.
        </p>
      </div>
    </div>
  );
}
