import GradientMesh from "../../components/ui/GradientMesh";
import { gradientPresets } from "../../styles/ieeeColors";

export default function Outreach() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <GradientMesh colors={gradientPresets.outreach} />
      <div className="relative z-10 p-6 md:p-12">
        <div className="h-14" />
        <h1 className="text-4xl font-bold text-[#00629B] mb-6">Outreach</h1>

        <p className="text-lg text-gray-700 leading-relaxed mb-4">
          This year, Outreach will host a series of <strong>academic-focused speaker panels</strong> designed to connect students with faculty and researchers. Sessions will highlight current research areas, graduate school pathways, and the academic skills that help students succeed.
        </p>

        <p className="text-lg text-gray-700 leading-relaxed mb-4">
          A featured event will be a special presentation by <strong>Dr. Lindvall</strong>, who recently retired after 51 years serving at Purdue University, the University of Kansas, Northwestern University, and the College Board. He will share practical guidance on <strong>applying to U.S. engineering graduate programs</strong>, including how to evaluate programs, build a compelling profile, and approach applications strategically.
        </p>

        <p className="text-lg text-gray-700 leading-relaxed mb-4">
          We plan to organize <strong>six total academic sessions</strong>, including a panel of <strong>four professors</strong> discussing their research areas—with the possibility of <strong>lab tours</strong>—and additional talks focused on academic development. Events will alternate between <strong>in-person and virtual</strong> formats to maximize accessibility.
        </p>

        <p className="text-lg text-gray-700 leading-relaxed">
          We will coordinate scheduling with related organizations (e.g., IEEE, BMES) to avoid conflicts and give students the best chance to attend. For company speakers, resume reviews, and industry Q&amp;A, please see our <strong>Industry</strong> page.
        </p>
      </div>
    </div>
  );
}
