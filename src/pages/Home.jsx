import Background from "../assets/images/background.jpg";
import BackgroundMobile from "../assets/images/mobile_background.jpg";
import { IoIosArrowDown } from "react-icons/io";
import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import EventCard from "../components/EventCard";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const iconRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    gsap.to(iconRef.current, {
      y: 10,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
      duration: 1,
    });
  }, []);

  return (
    <>
      {/* Hero Section */}
      <div className="min-h-screen bg-[#f2f0ef] pt-16 relative">
        {/* Background */}
        <div className="relative">
          <img
            src={Background}
            alt="Background"
            className="hidden md:block w-screen h-auto"
          />
          <img
            src={BackgroundMobile}
            alt="Background"
            className="block md:hidden w-screen h-auto"
          />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#00629b]/70 to-[#772583]/70"></div>
          {/* Content */}
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-10">
            <div className="max-w-4xl md:max-w-3xl mx-auto relative z-10 flex flex-col gap-1.5 md:gap-4 p-2 md:p-0">
              <h1 className="text-[1.5rem] md:text-7xl font-bold text-white text-center">
                IEEE Engineering in Medicine & Biology Society
              </h1>
              <h2 className="text-md md:text-3xl font-semibold md:font-bold text-white text-center">
                University of Florida Chapter
              </h2>
              <h2 className="text-xs md:text-lg text-white md:text-white text-center">
                “Bridging innovation, AI, and human health, we empower students
                to explore the frontiers of biomedical technology through
                collaboration, research, and real-world impact.”
              </h2>
              <div className="flex flex-row gap-2 md:gap-4 justify-center">
                <button className="bg-white/20 backdrop-blur-md text-xs md:text-lg text-white py-1 md:px-4 md:py-2 rounded-[20px] w-25 md:w-36 border border-white/30 hover:bg-white/30 transition-all duration-300">
                  Learn More
                </button>
                <button
                  onClick={() => navigate("/attendance/checkin")}
                  className="bg-white/20 backdrop-blur-md text-xs md:text-lg text-white py-1 md:px-4 md:py-2 rounded-[20px] w-25 md:w-36 border border-white/30 hover:bg-white/30 transition-all duration-300 cursor-pointer"
                >
                  Check In
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Down Icon */}
        <div className="w-full justify-center flex mt-8 flex-col items-center mb-4">
          <span className="text-gray-700 text-sm">Scroll Down</span>
          <IoIosArrowDown ref={iconRef} className="text-black text-4xl" />
        </div>

        {/* Upcoming Events */}
        <div className="max-w-7xl mx-auto p-4 md:p-0">
          <h1 className="text-4xl font-bold text-center mb-4">
            Upcoming Events
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <EventCard
              eventName="First GBM 🎉"
              location="Reitz Union Roof Top"
              date="August 23"
              time="6:00 PM - 7:00 PM"
              description="Come meet the board, learn about our mission, and hear what we have planned!"
            />
            <EventCard
              eventName="First GBM 🎉"
              location="Marston Pool"
              date="August 24"
              time="10:00 AM - 11:00 AM"
              description="Come meet the board, learn about our mission, and hear what we have planned!"
            />
            <EventCard
              eventName="First GBM 🎉"
              location="DJ Lagways House"
              date="August 25"
              time="6:00 PM - 7:00 PM"
              description="Come meet the board, learn about our mission, and hear what we have planned!"
            />
          </div>
        </div>

        {/* Branches */}
        <div className="w-full mt-16">
          <h1 className="text-4xl font-bold text-center mb-4">Branches</h1>
          <div className="flex flex-col">
            <div className="flex h-35 md:h-100 flex-row">
              <div className="w-1/2 bg-[#5d9cc3]"></div>
              <div className="w-1/2 bg-[#5d9cc3]/10 flex items-center justify-center">
                <h1 className="text-lg text-center">Image Here</h1>
              </div>
            </div>
            <div className="flex flex-row h-35 md:h-100">
              <div className="w-1/2 bg-[#b17cb3]/10 flex items-center justify-center">
                <h1 className="text-lg text-center">Image Here</h1>
              </div>
              <div className="w-1/2 bg-[#b17cb3]"></div>
            </div>
            <div className="flex flex-row h-35 md:h-100">
              <div className="w-1/2 bg-[#5d9cc3]"></div>
              <div className="w-1/2 bg-[#5d9cc3]/10 flex items-center justify-center">
                <h1 className="text-lg text-center">Image Here</h1>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
