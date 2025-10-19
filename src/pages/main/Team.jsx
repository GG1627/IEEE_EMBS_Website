import MemberCard from "../../components/ui/MemberCard";
import GradientMesh from "../../components/ui/GradientMesh";
import Footer from "../../components/layout/Footer";
import { gradientPresets } from "../../styles/ieeeColors";

import {
  executiveBoard,
  techLeads,
  webTeam,
  communicationsOutreach,
  advisors,
} from "../../data/members";

export default function Team() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Full Screen Mesh Gradient Background */}
      <div className="absolute inset-0 overflow-hidden">
        <GradientMesh
          colors={gradientPresets.designathon}
          baseGradient="linear-gradient(to bottom, #ebd6ff, #ffffff, #f9fafb)"
        />
      </div>

      {/* Hero Section - Apple-inspired */}
      <section className="relative pt-20 pb-10 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-gray-900 tracking-tight mb-2">
              Our Team
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 font-light leading-relaxed mb-2">
              The minds and hearts behind UF EMBS
            </p>
          </div>
        </div>
      </section>

      {/* Team Content */}
      <div className="flex-1 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Executive Board Section */}
          <section className="mb-16">
            <div className="text-center mb-6">
              <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-2">
                Executive Board
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our leadership team driving innovation and excellence
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              {executiveBoard.map((member, index) => (
                <div key={index} className="w-64">
                  <MemberCard
                    name={member.name}
                    position={member.position}
                    linkedin={member.linkedin}
                    imgURL={member.imgURL}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Tech Leads Section */}
          <section className="mb-16">
            <div className="text-center mb-6">
              <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-2">
                Tech Leads
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Technical experts leading our innovation initiatives
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              {techLeads.map((member, index) => (
                <div key={index} className="w-64">
                  <MemberCard
                    name={member.name}
                    position={member.position}
                    linkedin={member.linkedin}
                    imgURL={member.imgURL}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Web Team Section */}
          <section className="mb-16">
            <div className="text-center mb-6">
              <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-2">
                Web Team
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Building the digital experience for our community
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              {webTeam.map((member, index) => (
                <div key={index} className="w-64">
                  <MemberCard
                    name={member.name}
                    position={member.position}
                    linkedin={member.linkedin}
                    imgURL={member.imgURL}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Communications & Outreach Section */}
          <section className="mb-16">
            <div className="text-center mb-6">
              <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-2">
                Communications & Outreach
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Connecting our community and spreading our mission
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              {communicationsOutreach.map((member, index) => (
                <div key={index} className="w-64">
                  <MemberCard
                    name={member.name}
                    position={member.position}
                    linkedin={member.linkedin}
                    imgURL={member.imgURL}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Advisors Section */}
          <section className="mb-16">
            <div className="text-center mb-6">
              <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-2">
                Advisors
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Guiding our vision with expertise and wisdom
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              {advisors.map((member, index) => (
                <div key={index} className="w-64">
                  <MemberCard
                    name={member.name}
                    position={member.position}
                    linkedin={member.linkedin}
                    imgURL={member.imgURL}
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
