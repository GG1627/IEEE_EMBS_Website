import MemberCard from "../../components/ui/MemberCard";
import GradientMesh from "../../components/ui/GradientMesh";
import Footer from "../../components/layout/Footer";

import {
  executiveBoard,
  techLeads,
  webTeam,
  communicationsOutreach,
  advisors,
} from "../../data/members";

export default function Team() {
  return (
    <>
      <div className="min-h-screen flex flex-col pt-16 relative overflow-hidden">
        <GradientMesh />
        <div className="flex-1 py-12 px-2 md:px-0 relative z-10">
          <div className="container mx-auto max-w-7xl">
            <h1 className="text-4xl font-bold text-center mb-0 mt-0 text-gray-800">
              The Minds and Hearts Behind UF IEEE EMBS
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto text-center mt-2">
              Passionate about technology and medicine, our leadership team
              works to inspire, connect, and empower the next generation of
              biomedical engineers.
            </p>

            <h1 className="text-3xl font-bold text-center mb-4 mt-8 text-gray-800">
              Executive Board
            </h1>
            <div className="w-full flex flex-wrap justify-center gap-20 max-w-[1400px] mx-auto">
              {/* Grid container with 4 cards per row, full width, centered */}
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

            <h1 className="text-3xl font-bold text-center mb-4 mt-20 text-gray-800">
              Tech Leads
            </h1>
            <div className="w-full flex flex-wrap justify-center gap-20 max-w-[1400px] mx-auto">
              {/* Grid container with 4 cards per row, full width, centered */}
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

            <h1 className="text-3xl font-bold text-center mb-4 mt-20 text-gray-800">
              Web Team
            </h1>
            <div className="w-full flex flex-wrap justify-center gap-20 max-w-[1400px] mx-auto">
              {/* Grid container with 4 cards per row, full width, centered */}
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

            <h1 className="text-3xl font-bold text-center mb-4 mt-20 text-gray-800">
              Communications & Outreach
            </h1>
            <div className="w-full flex flex-wrap justify-center gap-20 max-w-[1400px] mx-auto">
              {/* Grid container with 4 cards per row, full width, centered */}
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

            <h1 className="text-3xl font-bold text-center mb-4 mt-20 text-gray-800">
              Advisors
            </h1>
            <div className="w-full flex flex-wrap justify-center gap-20 max-w-[1400px] mx-auto">
              {/* Grid container with 4 cards per row, full width, centered */}
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
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
