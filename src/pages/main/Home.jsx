import DesktopBackgroundFiller from "../../assets/images/desktop_background_filler.png";
import DesktopBackgroundDNA from "../../assets/images/desktop_background_dna.png";

import Image0 from "../../assets/grid/img0.jpg";
import Image1 from "../../assets/grid/img1.jpg";
import Image2 from "../../assets/grid/img2.jpg";
import Image3 from "../../assets/grid/img3.jpg";
import Image4 from "../../assets/grid/img4.jpg";
import Image5 from "../../assets/grid/img5.jpg";
import Image6 from "../../assets/grid/img6.jpg";
import Image7 from "../../assets/grid/img7.jpg";
import Image8 from "../../assets/grid/img8.jpg";
import Image9 from "../../assets/grid/img9.jpg";
import Image10 from "../../assets/grid/img10.jpg";
import Image11 from "../../assets/grid/img11.jpg";
import Image12 from "../../assets/grid/img12.jpg";

import { IoIosArrowDown } from "react-icons/io";
import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import EventCard from "../../components/ui/EventCard";
import Footer from "../../components/layout/Footer";
import { Link, useNavigate } from "react-router-dom";
import FlipCard from "../../components/ui/FlipCard";
import ResearchIcon from "../../assets/icons/research.png";
import ProjectsIcon from "../../assets/icons/projects.png";
import OutreachIcon from "../../assets/icons/outreach.png";
import WorkshopsIcon from "../../assets/icons/workshops.png";
import IndustryIcon from "../../assets/icons/industry.png";
import NetworkingIcon from "../../assets/icons/networking.png";
import { useAuth } from "../../pages/auth/AuthContext";
import { useSnackbar } from "../../components/ui/Snackbar";
import { supabase } from "../../lib/supabase";

export default function Home() {
  const iconRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSnackbar } = useSnackbar();

  // Preload critical hero images and warm the cache ASAP
  useEffect(() => {
    const urlsToPreload = [DesktopBackgroundFiller, DesktopBackgroundDNA];

    urlsToPreload.forEach((url) => {
      if (!document.querySelector(`link[rel="preload"][href="${url}"]`)) {
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "image";
        link.href = url;
        link.setAttribute("fetchpriority", "high");
        document.head.appendChild(link);
      }

      // Warm the cache via JS image prefetch as a fallback
      const img = new Image();
      img.decoding = "async";
      try {
        // Some browsers support this; if not, it is safely ignored
        // @ts-ignore
        img.fetchPriority = "high";
      } catch (_) {
        /* no-op */
      }
      img.src = url;
    });
  }, []);

  useEffect(() => {
    gsap.to(iconRef.current, {
      y: 10,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
      duration: 1,
    });
  }, []);

  // Check for successful authentication (vibe coded with cursor lol ^-^)
  useEffect(() => {
    if (user) {
      // Check if this is a fresh login (not just page refresh)
      const hasShownWelcome = sessionStorage.getItem("welcome_shown");
      const urlParams = new URLSearchParams(window.location.search);

      // Check for various Supabase auth success indicators
      const accessToken = urlParams.get("access_token");
      const refreshToken = urlParams.get("refresh_token");
      const type = urlParams.get("type");
      const tokenHash = window.location.hash;

      // Detect if this is a fresh login from magic link
      const isFromMagicLink =
        type === "magiclink" ||
        accessToken ||
        refreshToken ||
        tokenHash.includes("access_token") ||
        (user && !hasShownWelcome && window.location.pathname === "/");

      if (isFromMagicLink && !hasShownWelcome) {
        // Ensure user is in members table
        const ensureUserInMembersTable = async () => {
          try {
            // Check if user already exists in members table
            const { data: existingMember, error: checkError } = await supabase
              .from("members")
              .select("*")
              .eq("email", user.email)
              .single();

            if (checkError && checkError.code !== "PGRST116") {
              // PGRST116 is "not found"
              console.error("❌ Error checking member:", checkError);
              return;
            }

            // If user doesn't exist in members table, add them
            if (!existingMember) {
              const memberData = {
                email: user.email,
                first_name: user.user_metadata?.first_name || "",
                last_name: user.user_metadata?.last_name || "",
                points: 0,
                events_attended: 0,
                user_id: user.id,
              };

              const { data: insertData, error: insertError } = await supabase
                .from("members")
                .insert([memberData]);

              if (insertError) {
                console.error(
                  "❌ Error adding user to members table (backup):",
                  insertError
                );
              } else {
                console.log(
                  "✅ User successfully added to members table (backup)!"
                );
              }
            } else {
              console.log("✅ User already exists in members table");
            }
          } catch (error) {
            console.error(
              "❌ Exception ensuring user in members table:",
              error
            );
          }
        };

        // Run the check
        ensureUserInMembersTable();

        // Show welcome message for new login
        showSnackbar(`Welcome ${user.user_metadata?.first_name || "User"}!`, {
          customColor: "#772583",
        });

        // Mark that we've shown the welcome message
        sessionStorage.setItem("welcome_shown", "true");

        // Clean up URL parameters
        if (window.location.search || window.location.hash) {
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
        }
      }
    } else {
      // Clear the welcome flag when user logs out
      sessionStorage.removeItem("welcome_shown");
    }
  }, [user, showSnackbar]);

  // No hero CTA buttons for now per new design

  return (
    <>
      {/* Hero Section */}
      <div className="relative">
        {/* Full-width background extensions - only for hero */}
        <div className="absolute inset-0 h-[100dvh] bg-[#1A1A1A]" />
        <div
          className="absolute top-0 bottom-0 right-0 bg-[#D9D9D9] hidden md:block h-[100dvh]"
          style={{ left: "60%" }}
        />

        {/* Centered content container */}
        <div className="relative min-h-[100dvh] max-w-[1600px] mx-auto overflow-hidden bg-[#1A1A1A]">
          {/* Right half overlay (desktop only) - positioned relative to container */}
          <div className="absolute inset-y-0 right-0 hidden md:block md:w-[46.5%] bg-[#D9D9D9] z-0" />

          {/* Centered DNA with filler behind */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            {/* Filler and DNA sized to viewport height on desktop */}
            <img
              src={DesktopBackgroundFiller}
              alt="Background Filler"
              loading="eager"
              decoding="async"
              fetchPriority="high"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:-translate-x-[30%] block h-auto md:h-screen md:w-auto z-10 opacity-100"
            />
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <img
                src={DesktopBackgroundDNA}
                alt="DNA"
                loading="eager"
                decoding="async"
                fetchPriority="high"
                className="block h-auto md:h-screen md:w-auto"
              />
            </div>
          </div>

          {/* Desktop Text Content */}
          <div className="hidden md:block absolute left-6 top-1/2 -translate-y-1/2 z-30 md:w-[48%] lg:w-[44%] xl:w-[40%] 2xl:w-[38%] h-[70vh] p-2 rounded-xl overflow-x-hidden overflow-y-auto">
            <div className="flex flex-col h-full justify-center gap-3 md:gap-4 lg:gap-5">
              <h1 className="font-bold text-left text-[#B17CB3] mb-2 md:mb-3 leading-[1.08] tracking-tight text-[clamp(2rem,3.8vw,4rem)]">
                IEEE Engineering in Medicine &amp; Biology Society
              </h1>
              <h2 className="font-bold text-left text-[#97BDD7] mb-2 md:mb-3 leading-tight text-[clamp(1.25rem,2.2vw,2.5rem)]">
                University of Florida Chapter
              </h2>
              <p className="text-left text-[clamp(1rem,1.4vw,1.5rem)] text-white/95 max-w-[65ch]">
                "Bridging innovation, AI, and human health, we empower students
                to explore the frontiers of biomedical technology through
                collaboration, research, and real-world impact."
              </p>
              <div className="flex flex-row flex-wrap items-center justify-start gap-3 md:gap-4 mt-4 md:mt-6 pl-20">
                <button className="bg-[#ffffff] text-black px-5 md:px-6 py-2.5 rounded-3xl text-[clamp(1rem,1.2vw,1.25rem)] shadow-[0_0_14px_rgba(255,255,255,0.85)] hover:shadow-[0_0_28px_rgba(255,255,255,0.85)] hover:cursor-pointer transition-shadow duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80">
                  Learn More
                </button>
                {user ? (
                  <button className="bg-[#ffffff] text-black px-5 md:px-6 py-2.5 rounded-3xl text-[clamp(1rem,1.2vw,1.25rem)] shadow-[0_0_14px_rgba(255,255,255,0.85)] hover:shadow-[0_0_28px_rgba(255,255,255,0.85)] hover:cursor-pointer transition-shadow duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80">
                    <Link className="no-underline" to="/dashboard">
                      Dashboard
                    </Link>
                  </button>
                ) : (
                  <button className="bg-[#ffffff] text-black px-5 md:px-6 py-2.5 rounded-3xl text-[clamp(1rem,1.2vw,1.25rem)] shadow-[0_0_14px_rgba(255,255,255,0.85)] hover:shadow-[0_0_28px_rgba(255,255,255,0.85)] hover:cursor-pointer transition-shadow duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80">
                    <Link className="no-underline" to="/login">
                      Login
                    </Link>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Text Content */}
          <div className="md:hidden absolute inset-x-0 bottom-16 z-30 px-6">
            <div className="flex flex-col items-center text-center gap-4">
              <h1 className="font-bold text-[#B17CB3] leading-tight text-2xl sm:text-3xl">
                IEEE Engineering in Medicine &amp; Biology Society
              </h1>
              <h2 className="font-bold text-[#97BDD7] leading-tight text-lg sm:text-xl">
                University of Florida Chapter
              </h2>
              <p className="text-white/95 text-sm sm:text-base max-w-[90%]">
                "Bridging innovation, AI, and human health, we empower students
                to explore the frontiers of biomedical technology through
                collaboration, research, and real-world impact."
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-3 mt-4">
                <button className="bg-[#ffffff] text-black px-5 py-2.5 rounded-3xl text-sm shadow-[0_0_14px_rgba(255,255,255,0.85)] hover:shadow-[0_0_28px_rgba(255,255,255,0.85)] transition-shadow duration-300">
                  Learn More
                </button>
                {user ? (
                  <button className="bg-[#ffffff] text-black px-5 py-2.5 rounded-3xl text-sm shadow-[0_0_14px_rgba(255,255,255,0.85)] hover:shadow-[0_0_28px_rgba(255,255,255,0.85)] transition-shadow duration-300">
                    <Link className="no-underline" to="/dashboard">
                      Dashboard
                    </Link>
                  </button>
                ) : (
                  <button className="bg-[#ffffff] text-black px-5 py-2.5 rounded-3xl text-sm shadow-[0_0_14px_rgba(255,255,255,0.85)] hover:shadow-[0_0_28px_rgba(255,255,255,0.85)] transition-shadow duration-300">
                    <Link className="no-underline" to="/login">
                      Login
                    </Link>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Image Grid */}
          <div className="hidden md:block absolute -right-0 top-20 bottom-0 my-auto z-30 w-[50%] h-[80vh]">
            {/* Inner grid */}
            <div className="h-full w-full grid grid-cols-[41fr_39fr_103fr] gap-[0.25rem] p-2">
              {/* Column 1 */}
              <div className="flex flex-col gap-1 h-[56%] mt-[65%] items-end">
                {/* <div className="bg-[#b0b0b0] rounded-lg h-[20%] w-[70%]" /> */}
                <div className="bg-[#b0b0b0] rounded-lg h-[20%] w-[70%]">
                  <img
                    src={Image0}
                    alt="Image Grid"
                    className="h-full w-full object-cover rounded-lg"
                  />
                </div>
                <div className="bg-[#b0b0b0] rounded-lg h-[35%] w-full">
                  <img
                    src={Image1}
                    alt="Image Grid"
                    className="h-full w-full object-cover rounded-lg"
                  />
                </div>
                <div className="bg-[#b0b0b0] rounded-lg h-[30%] w-[85%]">
                  <img
                    src={Image3}
                    alt="Image Grid"
                    className="h-full w-full object-cover rounded-lg"
                  />
                </div>
              </div>
              {/* Column 2 */}
              <div className="flex flex-col gap-1 h-[78%] mt-[20%] items-end">
                <div className="bg-[#b0b0b0] rounded-lg h-[25%] w-full">
                  <img
                    src={Image2}
                    alt="Image Grid"
                    className="h-full w-full object-cover rounded-lg"
                  />
                </div>
                <div className="bg-[#b0b0b0] rounded-lg h-[40%] w-full">
                  <img
                    src={Image4}
                    alt="Image Grid"
                    className="h-full w-full object-cover rounded-lg"
                  />
                </div>
                <div className="bg-[#b0b0b0] rounded-lg h-[30%] w-full">
                  <img
                    src={Image5}
                    alt="Image Grid"
                    className="h-full w-full object-cover rounded-lg"
                  />
                </div>
              </div>
              {/* Column 3 */}
              <div className="flex flex-col gap-1 h-full items-start">
                {/* Row 1 */}
                <div className="flex flex-row gap-1 h-[35%] w-[85%]">
                  <div className="bg-[#b0b0b0] rounded-lg h-full w-[40%]">
                    <img
                      src={Image6}
                      alt="Image Grid"
                      className="h-full w-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="bg-[#b0b0b0] rounded-lg h-[80%] w-[60%] self-end">
                    <img
                      src={Image7}
                      alt="Image Grid"
                      className="h-full w-full object-cover rounded-lg"
                    />
                  </div>
                </div>
                {/* Row 2 */}
                <div className="flex flex-row h-[70%] gap-1 w-full">
                  <div className="flex flex-col gap-1 h-full w-[53%]">
                    <div className="bg-[#b0b0b0] rounded-lg h-[50%] w-full">
                      <img
                        src={Image8}
                        alt="Image Grid"
                        className="h-full w-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex flex-row gap-1 h-[30%] w-full">
                      <div className="bg-[#b0b0b0] rounded-lg h-full w-[47%]">
                        <img
                          src={Image10}
                          alt="Image Grid"
                          className="h-full w-full object-cover rounded-lg"
                        />
                      </div>
                      <div className="bg-[#b0b0b0] rounded-lg h-[85%] w-[53%]">
                        <img
                          src={Image12}
                          alt="Image Grid"
                          className="h-full w-full object-cover rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 h-[70%] w-[47%]">
                    <div className="bg-[#b0b0b0] rounded-lg h-[60%] w-full">
                      <img
                        src={Image9}
                        alt="Image Grid"
                        className="h-full w-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="bg-[#b0b0b0] rounded-lg h-[35%] w-[80%]">
                      <img
                        src={Image11}
                        alt="Image Grid"
                        className="h-full w-full object-cover rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Scroll Down Icon */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full justify-center flex mt-0 flex-col items-center mb-2">
            <IoIosArrowDown ref={iconRef} className="text-white text-4xl" />
          </div>
        </div>
      </div>

      {/* Rest of page content */}
      <div className="bg-[#ffffff]">
        {/* Upcoming Events */}
        <div className="max-w-7xl mx-auto p-4 md:p-0 mt-16">
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

        {/* Branches Section */}
        <div className="w-full mt-16 px-4 md:px-0">
          <h1 className="text-4xl font-bold text-center mb-8">Our Branches</h1>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                name: "Research",
                icon: ResearchIcon,
                page: "/research",
                summary: "Conducting hands-on biomedical investigations.",
              },
              {
                name: "Projects",
                icon: ProjectsIcon,
                page: "/projects",
                summary:
                  "Collaborative engineering teams solving real-world problems.",
              },
              {
                name: "Outreach",
                icon: OutreachIcon,
                page: "/outreach",
                summary:
                  "Connecting with the community through STEM initiatives.",
              },
              {
                name: "Workshops",
                icon: WorkshopsIcon,
                page: "/workshops",
                summary:
                  "Skill-building events on hardware, software, and more.",
              },
              {
                name: "Industry",
                icon: IndustryIcon,
                page: "/industry",
                summary: "Professional development and career exploration.",
              },
              {
                name: "Networking",
                icon: NetworkingIcon,
                page: "/networking",
                summary:
                  "Building lasting relationships with peers and mentors.",
              },
            ].map(({ name, icon, page, summary }) => (
              <div key={name} className="flex justify-center">
                <FlipCard
                  name={name}
                  imageSrc={icon}
                  summary={summary}
                  onClick={() => navigate(page)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
