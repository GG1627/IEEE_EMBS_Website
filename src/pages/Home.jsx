import Background from "../assets/images/background.jpg";
import { IoIosArrowDown } from "react-icons/io";
import { gsap } from "gsap";
import { useEffect, useRef } from "react";

export default function Home() {
  const iconRef = useRef(null);

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
      <div className="min-h-screen bg-white pt-16 relative">
        {/* Background */}
        <div className="relative">
          <img src={Background} alt="Background" className="w-screen h-auto" />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#00629b]/70 to-[#772583]/70"></div>
          {/* Content */}
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-10">
            <div className="max-w-3xl mx-auto relative z-10 flex flex-col gap-4">
              <h1 className="text-7xl font-bold text-white text-center">
                IEEE Engineering in Medicine & Biology Society
              </h1>
              <h2 className="text-2xl font-bold text-white text-center">
                University of Florida Chapter
              </h2>
              <h2 className="text-white text-center">
                “Bridging innovation, AI, and human health, we empower students
                to explore the frontiers of biomedical technology through
                collaboration, research, and real-world impact.”
              </h2>
              <div className="flex flex-row gap-4 justify-center">
                <button className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-[20px] w-36 border border-white/30 hover:bg-white/30 transition-all duration-300">
                  Learn More
                </button>
                <button className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-[20px] w-36 border border-white/30 hover:bg-white/30 transition-all duration-300">
                  Join Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Down Icon */}
        <div className="absolute w-full justify-center flex mt-8 flex-col items-center">
          <span className="text-gray-700 text-sm">Scroll Down</span>
          <IoIosArrowDown ref={iconRef} className="text-black text-4xl" />
        </div>

        {/* Upcoming Events */}
        <div className="max-w-7xl mx-auto"></div>
      </div>
    </>
  );
}
