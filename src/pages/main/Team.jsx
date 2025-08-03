import TiltedCard from "../../components/ui/TiltedCard";
import defaultAvatar from "../../assets/default-avatar.png";
import Veronica from "../../assets/members/Veronica.jpg";
import Christian from "../../assets/members/Christian2.jpg";
import Viola from "../../assets/members/Viola.png";
import Krish from "../../assets/members/Krish.png";
import Gael from "../../assets/members/Gael.jpg";
import Clea from "../../assets/members/Clea.jpg";
import Michael from "../../assets/members/Michael.jpg";
import Lincy from "../../assets/members/Lincy.jpg";
import Fabiana from "../../assets/members/Fabiana.png";
import May from "../../assets/members/DrMay.jpg";
import Devin from "../../assets/members/Devin.jpg";
import Matthew from "../../assets/members/Matthew.png";
import Katherine from "../../assets/members/Katherine.jpg";

import Footer from "../../components/layout/Footer";

// Next Step:
// 1. Add a hover effect where if you hover over the member card, it will show a popup with more information about the member

export default function Team() {
  // Sample team data - you can replace with real data later
  const executiveBoard = [
    {
      name: "Veronica Ramos Rodriguez",
      position: "President",
      linkedin: "https://www.linkedin.com/in/veronicasramos/",
      imgURL: Veronica,
    },
    {
      name: "Christian Gomez",
      position: "Vice President",
      linkedin: "https://www.linkedin.com/in/christian-gomez-8b4bb92b8/",
      imgURL: Christian,
    },
    {
      name: "Viola Szalkai",
      position: "Secretary",
      linkedin: "https://www.linkedin.com/in/viola-szalkai-2421912b9/",
      imgURL: Viola,
    },
    {
      name: "Krish Patel",
      position: "Treasurer",
      linkedin: "https://www.linkedin.com/in/krish-patel-connect/",
      imgURL: Krish,
    },
  ];

  const techLeads = [
    {
      name: "Matthew Valenti",
      position: "BME Tech Lead",
      linkedin: "https://www.linkedin.com/in/matthew-valenti-a46960297/",
      imgURL: Matthew,
    },
    {
      name: "Michael Vladimirsky",
      position: "EE Tech Lead",
      linkedin: "https://www.linkedin.com/in/michaelvladimirsky/",
      imgURL: Michael,
    },
    {
      name: "Devin Wylde",
      position: "CS Tech Lead",
      linkedin: "https://www.linkedin.com/in/devinwylde/",
      imgURL: Devin,
    },
  ];

  const webTeam = [
    {
      name: "Lincy Phipps",
      position: "Webmaster",
      linkedin: "https://www.linkedin.com/in/rosalinda-nancy-lincy-phipps040/",
      imgURL: Lincy,
    },
    {
      name: "Gael Garcia",
      position: "Webmaster",
      linkedin: "https://www.linkedin.com/in/gael-garcia1627/",
      imgURL: Gael,
    },
  ];

  const communicationsOutreach = [
    {
      name: "Katherine Phy",
      position: "Fundraising Lead",
      linkedin: "https://www.linkedin.com/in/katherine-phy-66a0a4297/",
      imgURL: Katherine,
    },
    {
      name: "Fabiana Mastantuono",
      position: "Outreach Coordinator",
      linkedin: "https://www.linkedin.com/in/fabiana-mastantuono/",
      imgURL: Fabiana,
    },
    {
      name: "Clea Judilla",
      position: "Social Media Manager",
      linkedin: "https://www.linkedin.com/in/cleajudilla/",
      imgURL: Clea,
    },
  ];

  const advisors = [
    {
      name: "Dr. May Mansy",
      position: "BME Advisor",
      linkedin: "https://www.linkedin.com/in/maymansy/",
      imgURL: May,
    },
  ];

  return (
    <>
      <div className="min-h-screen flex flex-col bg-gray-50 pt-16">
        <div className="flex-1 py-12">
          <div className="container mx-auto max-w-7xl">
            <h1 className="text-4xl font-bold text-center mb-12 mt-8 text-gray-800">
              Meet the Team
            </h1>

            <h1 className="text-3xl font-bold text-center mb-4 mt-8 text-gray-800">
              Executive Board
            </h1>
            <div className="w-full flex flex-wrap justify-center gap-24 max-w-[1400px] mx-auto">
              {/* Grid container with 4 cards per row, full width, centered */}
              {executiveBoard.map((member, index) => (
                <div key={index} className="max-w-[320px]">
                  <TiltedCard
                    memberCardMode={true}
                    imageSrc={member.imgURL || defaultAvatar}
                    altText={`${member.name} - ${member.position}`}
                    memberName={member.name}
                    memberPosition={member.position}
                    memberLinkedIn={member.linkedin}
                    containerHeight="280px"
                    containerWidth="220px"
                    imageHeight="280px"
                    imageWidth="220px"
                    rotateAmplitude={8}
                    scaleOnHover={1.03}
                    showMobileWarning={false}
                    showTooltip={false}
                  />
                </div>
              ))}
            </div>

            <h1 className="text-3xl font-bold text-center mb-4 mt-16 text-gray-800">
              Tech Leads
            </h1>
            <div className="w-full flex flex-wrap justify-center gap-24 max-w-[1400px] mx-auto">
              {/* Grid container with 4 cards per row, full width, centered */}
              {techLeads.map((member, index) => (
                <div key={index} className="max-w-[320px]">
                  <TiltedCard
                    memberCardMode={true}
                    imageSrc={member.imgURL || defaultAvatar}
                    altText={`${member.name} - ${member.position}`}
                    memberName={member.name}
                    memberPosition={member.position}
                    memberLinkedIn={member.linkedin}
                    containerHeight="280px"
                    containerWidth="220px"
                    imageHeight="280px"
                    imageWidth="220px"
                    rotateAmplitude={8}
                    scaleOnHover={1.03}
                    showMobileWarning={false}
                    showTooltip={false}
                  />
                </div>
              ))}
            </div>

            <h1 className="text-3xl font-bold text-center mb-4 mt-16 text-gray-800">
              Web Team
            </h1>
            <div className="w-full flex flex-wrap justify-center gap-24 max-w-[1400px] mx-auto">
              {/* Grid container with 4 cards per row, full width, centered */}
              {webTeam.map((member, index) => (
                <div key={index} className="max-w-[320px]">
                  <TiltedCard
                    memberCardMode={true}
                    imageSrc={member.imgURL || defaultAvatar}
                    altText={`${member.name} - ${member.position}`}
                    memberName={member.name}
                    memberPosition={member.position}
                    memberLinkedIn={member.linkedin}
                    containerHeight="280px"
                    containerWidth="220px"
                    imageHeight="280px"
                    imageWidth="220px"
                    rotateAmplitude={8}
                    scaleOnHover={1.03}
                    showMobileWarning={false}
                    showTooltip={false}
                  />
                </div>
              ))}
            </div>

            <h1 className="text-3xl font-bold text-center mb-4 mt-16 text-gray-800">
              Communications & Outreach
            </h1>
            <div className="w-full flex flex-wrap justify-center gap-24 max-w-[1400px] mx-auto">
              {/* Grid container with 4 cards per row, full width, centered */}
              {communicationsOutreach.map((member, index) => (
                <div key={index} className="max-w-[320px]">
                  <TiltedCard
                    memberCardMode={true}
                    imageSrc={member.imgURL || defaultAvatar}
                    altText={`${member.name} - ${member.position}`}
                    memberName={member.name}
                    memberPosition={member.position}
                    memberLinkedIn={member.linkedin}
                    containerHeight="280px"
                    containerWidth="220px"
                    imageHeight="280px"
                    imageWidth="220px"
                    rotateAmplitude={8}
                    scaleOnHover={1.03}
                    showMobileWarning={false}
                    showTooltip={false}
                  />
                </div>
              ))}
            </div>

            <h1 className="text-3xl font-bold text-center mb-4 mt-16 text-gray-800">
              Advisors
            </h1>
            <div className="w-full flex flex-wrap justify-center gap-24 max-w-[1400px] mx-auto">
              {/* Grid container with 4 cards per row, full width, centered */}
              {advisors.map((member, index) => (
                <div key={index} className="max-w-[320px]">
                  <TiltedCard
                    memberCardMode={true}
                    imageSrc={member.imgURL || defaultAvatar}
                    altText={`${member.name} - ${member.position}`}
                    memberName={member.name}
                    memberPosition={member.position}
                    memberLinkedIn={member.linkedin}
                    containerHeight="280px"
                    containerWidth="220px"
                    imageHeight="280px"
                    imageWidth="220px"
                    rotateAmplitude={8}
                    scaleOnHover={1.03}
                    showMobileWarning={false}
                    showTooltip={false}
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
