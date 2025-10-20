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
          This year, Outreach is hosting a series of <strong>academically focused panels</strong> to connect students with faculty and researchers. Sessions spotlight current research areas, graduate school pathways, and the core academic skills that help students thrive.
        </p>

        <p className="text-lg text-gray-700 leading-relaxed mb-4">
          <strong>Recent Feature:</strong> We hosted <strong>Dr. Bruce A. Lindvall</strong> (retired after 51 years in higher education at Purdue University, the University of Kansas, Northwestern University, and the College Board) for a practical talk on <strong>applying to U.S. engineering graduate programs</strong>—how to evaluate programs, build a compelling profile, approach applications strategically, and consider funding options.
        </p>

        <p className="text-lg text-gray-700 leading-relaxed mb-4">
          <strong>What’s Ahead:</strong> We’re planning more academic sessions this year, including professors discussing their research areas (with the possibility of <strong>lab tours</strong>) and additional talks focused on academic development. Events will alternate between <strong>in-person and virtual</strong> formats to maximize accessibility.
        </p>

        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          <strong>Coordination &amp; Access:</strong> We’ll coordinate schedules with related organizations (e.g., IEEE, BMES) to avoid conflicts and give students the best chance to attend. For company speakers, resume reviews, and industry Q&amp;A, please see our <strong>Industry</strong> page.
        </p>

        {/* Community & Fundraising */}
        <h2 className="text-2xl font-semibold text-[#00629B] mb-3">Community &amp; Fundraising</h2>
        <div className="mb-8">
          <p className="text-base text-gray-500 font-medium">October 9, 2025</p>
          <h3 className="text-xl font-semibold text-gray-800">Pie-A-Chair Fundraiser</h3>
          <p className="text-lg text-gray-700 leading-relaxed mt-2">
            EMBS held its first-ever fundraiser, <span className="font-semibold">Pie-A-Chair</span>! Friends and foes could pie any of our chair members for just $3—an afternoon packed with laughter, whipped cream, and friendly revenge.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mt-2">
            The event was a huge hit—we even ran out of whipped cream faster than expected! Thank you to all our chair members who volunteered and to everyone who stopped by, donated, and supported our club. Your contributions help us continue hosting fun, engaging, and educational events for our members.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mt-2 italic">
            Keep an eye out for <span className="font-semibold">Pie-A-Chair: Spring Edition</span>—and maybe next time the whipped cream won’t disappear quite so fast.
          </p>
          {/* Optional image grid:
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <img src="/images/pie-a-chair-1.jpg" alt="Pie-A-Chair photo 1" className="w-full h-52 object-cover rounded-xl" />
            <img src="/images/pie-a-chair-2.jpg" alt="Pie-A-Chair photo 2" className="w-full h-52 object-cover rounded-xl" />
            <img src="/images/pie-a-chair-3.jpg" alt="Pie-A-Chair photo 3" className="w-full h-52 object-cover rounded-xl" />
          </div>
          */}
        </div>

        <p className="text-lg text-gray-700 leading-relaxed">
          <strong>More Info:</strong> As details are confirmed, we’ll publish interest forms and matchmaking info so members can indicate areas of interest and be connected with relevant faculty. Visit the <strong>Resources</strong> tab for graduate-school guides, different paths within BME, related UF professors, and curated external faculty opportunities.
        </p>
      </div>
    </div>
  );
}
