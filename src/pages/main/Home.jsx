import DesktopBackgroundFiller from "../../assets/images/desktop_background_filler.png";
import DesktopBackgroundDNA from "../../assets/images/desktop_background_dna.png";
import MobileBackgroundFiller from "../../assets/images/mobile_background_filler.png";
import MobileBackgroundDNA from "../../assets/images/mobile_background_dna.png";

import Image0 from "../../assets/grid/img0.avif";
import Image1 from "../../assets/grid/img1.avif";
import Image2 from "../../assets/grid/img2.avif";
import Image3 from "../../assets/grid/img3.avif";
import Image4 from "../../assets/grid/img4.avif";
import Image5 from "../../assets/grid/img5.avif";
import Image6 from "../../assets/grid/img6.avif";
import Image7 from "../../assets/grid/img7.avif";
import Image8 from "../../assets/grid/img8.avif";
import Image9 from "../../assets/grid/img9.avif";
import Image10 from "../../assets/grid/img10.avif";
import Image11 from "../../assets/grid/img11.avif";
import Image12 from "../../assets/grid/img12.avif";

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
import { useState } from "react";
import { slidingText } from "../../data/slidingText";
import ParticlesBg from "../../components/ui/ParticlesBG";
import { LuDna } from "react-icons/lu";

export default function Home() {
  const iconRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [userRole, setUserRole] = useState("member");

  const itemsTwice = [...slidingText, ...slidingText]; // duplicate for seamless loop

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

  // Simplified authentication result handling
  useEffect(() => {
    // Check for authentication errors in the URL hash
    const urlHash = window.location.hash.substring(1);
    const hashParams = new URLSearchParams(urlHash);
    const errorCode = hashParams.get("error_code");
    const errorDescription = hashParams.get("error_description");

    if (errorCode) {
      console.error("🚨 Authentication error:", errorCode, errorDescription);
      let errorMessage = "Authentication failed. ";
      if (errorCode === "otp_expired") {
        errorMessage += "The login link has expired. Please request a new one.";
      } else if (errorCode === "access_denied") {
        errorMessage += "Access was denied. Please try again.";
      } else {
        errorMessage += errorDescription || "Please try again.";
      }
      showSnackbar(errorMessage, "error", 10000);
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    if (user) {
      // Show welcome message for new login
      const hasShownWelcome = sessionStorage.getItem("welcome_shown");
      if (!hasShownWelcome) {
        showSnackbar(`Welcome ${user.user_metadata?.first_name || "User"}!`, {
          customColor: "#772583",
        });
        sessionStorage.setItem("welcome_shown", "true");
      }

      // Clean up URL parameters
      if (window.location.search || window.location.hash) {
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      }
    }
  }, [user, showSnackbar]);

  // Fetch user role from database
  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        try {
          console.log("👤 Fetching user role for:", user.email);
          const { data, error } = await supabase
            .from("members")
            .select("role, national_member")
            .eq("user_id", user.id)
            .single();

          if (error) {
            console.error("❌ Error fetching user role:", error);
            setUserRole("member"); // Default to member on error
          } else {
            console.log("✅ User role fetched:", data?.role || "member");
            console.log(
              "✅ User national member status fetched:",
              data?.national_member
            );
            setUserRole(data?.role || "member");

            // Only show snackbar if national_member is specifically null (not set) AND user is a member (not admin)
            if (
              data?.national_member === null &&
              (data?.role === "member" || !data?.role)
            ) {
              showSnackbar(
                "Please update your National Member status in the Dashboard",
                {
                  customColor: "#ff9800",
                }
              );
            }
          }
        } catch (error) {
          console.error("❌ Exception fetching user role:", error);
          setUserRole("member"); // Default to member on error
        }
      } else {
        setUserRole("member"); // Reset to default when no user
      }
    };

    fetchUserRole();
  }, [user]);

  //

  return (
    <>
      {/* Desktop Hero Section */}
      <div className="hidden md:block relative">
        {/* Full-width background extensions - desktop only */}
        <div className="absolute inset-0 h-[100dvh] bg-[#1A1A1A]" />
        <div
          className="absolute top-0 bottom-0 right-0 bg-[#D9D9D9] h-[100dvh]"
          style={{ left: "60%" }}
        />

        {/* Centered content container */}
        <div className="relative min-h-[100dvh] max-w-[1600px] mx-auto overflow-hidden bg-[#1A1A1A]">
          {/* Right half overlay - positioned relative to container */}
          <div className="absolute inset-y-0 right-0 w-[46.5%] bg-[#D9D9D9] z-0" />

          {/* Large Circle with Particles */}
          <div className="absolute top-1/2 left-1/2 -translate-y-1/2 z-20">
            <div className="w-[100vh] h-[100vh] rounded-full bg-transparent relative overflow-hidden">
              <ParticlesBg id="particles-desktop" />
            </div>
          </div>

          {/* Centered DNA with filler behind */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            <img
              src={DesktopBackgroundFiller}
              alt="Background Filler"
              loading="eager"
              decoding="async"
              fetchPriority="high"
              className="absolute left-1/2 top-1/2 -translate-x-[30%] -translate-y-1/2 h-screen w-auto z-10 opacity-100"
            />
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <img
                src={DesktopBackgroundDNA}
                alt="DNA"
                loading="eager"
                decoding="async"
                fetchPriority="high"
                className="h-screen w-auto"
              />
            </div>
          </div>

          {/* Desktop Text Content */}
          <div className="absolute left-6 top-1/2 -translate-y-1/2 z-30 w-[48%] lg:w-[44%] xl:w-[40%] 2xl:w-[38%] h-[70vh] p-2 rounded-xl overflow-x-hidden overflow-y-auto">
            <div className="flex flex-col h-full justify-center gap-4 lg:gap-5">
              <h1 className="font-bold text-left text-[#B17CB3] mb-3 leading-[1.08] tracking-tight text-[clamp(2rem,3.8vw,4rem)]">
                Engineering in Medicine &amp; Biology Society
              </h1>
              <h2 className="font-bold text-left text-[#97BDD7] mb-3 leading-tight text-[clamp(1.25rem,2.2vw,2.5rem)]">
                University of Florida Chapter
              </h2>
              <p className="text-left text-[clamp(1rem,1.4vw,1.5rem)] text-white/95 max-w-[65ch]">
                "Bridging innovation, AI, and human health, we empower students
                to explore the frontiers of biomedical technology through
                collaboration, research, and real-world impact."
              </p>
              <div className="flex flex-row flex-wrap items-center justify-start gap-4 mt-6 pl-20">
                <button className="bg-[#ffffff] text-black px-6 py-2.5 rounded-3xl text-[clamp(1rem,1.2vw,1.25rem)] shadow-[0_0_14px_rgba(255,255,255,0.85)] hover:shadow-[0_0_28px_rgba(255,255,255,0.85)] hover:cursor-pointer transition-shadow duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 min-w-[140px] text-center">
                  <Link className="no-underline" to="/about">
                    Learn More
                  </Link>
                </button>
                {user ? (
                  <button className="bg-[#ffffff] text-black px-6 py-2.5 rounded-3xl text-[clamp(1rem,1.2vw,1.25rem)] shadow-[0_0_14px_rgba(255,255,255,0.85)] hover:shadow-[0_0_28px_rgba(255,255,255,0.85)] hover:cursor-pointer transition-shadow duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 min-w-[140px] text-center">
                    <Link
                      className="no-underline"
                      to={
                        userRole === "admin" ? "/admin-dashboard" : "/dashboard"
                      }
                    >
                      Dashboard
                    </Link>
                  </button>
                ) : (
                  <button className="bg-[#ffffff] text-black px-6 py-2.5 rounded-3xl text-[clamp(1rem,1.2vw,1.25rem)] shadow-[0_0_14px_rgba(255,255,255,0.85)] hover:shadow-[0_0_28px_rgba(255,255,255,0.85)] hover:cursor-pointer transition-shadow duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 min-w-[140px] text-center">
                    <Link className="no-underline" to="/auth/login">
                      Login
                    </Link>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Image Grid */}
          <div className="absolute -right-0 top-20 bottom-0 my-auto z-30 w-[50%] h-[80vh]">
            {/* Inner grid */}
            <div className="h-full w-full grid grid-cols-[41fr_39fr_103fr] gap-[0.25rem] p-2">
              {/* Column 1 */}
              <div className="flex flex-col gap-1 h-[56%] mt-[65%] items-end">
                {/* <div className="bg-[#b0b0b0] rounded-lg h-[20%] w-[70%]" /> */}
                <div className="bg-[#b0b0b0] rounded-lg h-[20%] w-[70%]">
                  <img
                    src={Image0}
                    alt="Image Grid"
                    className="h-full w-full object-cover rounded-lg opacity-60 hover:opacity-100 transition-opacity duration-300"
                    decoding="async"
                  />
                </div>
                <div className="bg-[#b0b0b0] rounded-lg h-[35%] w-full">
                  <img
                    src={Image1}
                    alt="Image Grid"
                    className="h-full w-full object-cover rounded-lg opacity-60 hover:opacity-100 transition-opacity duration-300"
                    decoding="async"
                  />
                </div>
                <div className="bg-[#b0b0b0] rounded-lg h-[30%] w-[85%]">
                  <img
                    src={Image3}
                    alt="Image Grid"
                    className="h-full w-full object-cover rounded-lg opacity-60 hover:opacity-100 transition-opacity duration-300"
                    decoding="async"
                  />
                </div>
              </div>
              {/* Column 2 */}
              <div className="flex flex-col gap-1 h-[78%] mt-[20%] items-end">
                <div className="bg-[#b0b0b0] rounded-lg h-[25%] w-full">
                  <img
                    src={Image2}
                    alt="Image Grid"
                    className="h-full w-full object-cover rounded-lg opacity-60 hover:opacity-100 transition-opacity duration-300"
                    decoding="async"
                  />
                </div>
                <div className="bg-[#b0b0b0] rounded-lg h-[40%] w-full">
                  <img
                    src={Image4}
                    alt="Image Grid"
                    className="h-full w-full object-cover rounded-lg opacity-60 hover:opacity-100 transition-opacity duration-300"
                    decoding="async"
                  />
                </div>
                <div className="bg-[#b0b0b0] rounded-lg h-[30%] w-full">
                  <img
                    src={Image5}
                    alt="Image Grid"
                    className="h-full w-full object-cover rounded-lg opacity-60 hover:opacity-100 transition-opacity duration-300"
                    decoding="async"
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
                      className="h-full w-full object-cover rounded-lg opacity-60 hover:opacity-100 transition-opacity duration-300"
                      decoding="async"
                    />
                  </div>
                  <div className="bg-[#b0b0b0] rounded-lg h-[80%] w-[60%] self-end">
                    <img
                      src={Image7}
                      alt="Image Grid"
                      className="h-full w-full object-cover rounded-lg opacity-60 hover:opacity-100 transition-opacity duration-300"
                      decoding="async"
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
                        className="h-full w-full object-cover rounded-lg opacity-60 hover:opacity-100 transition-opacity duration-300"
                        decoding="async"
                      />
                    </div>
                    <div className="flex flex-row gap-1 h-[30%] w-full">
                      <div className="bg-[#b0b0b0] rounded-lg h-full w-[47%]">
                        <img
                          src={Image10}
                          alt="Image Grid"
                          className="h-full w-full object-cover rounded-lg opacity-60 hover:opacity-100 transition-opacity duration-300"
                          decoding="async"
                        />
                      </div>
                      <div className="bg-[#b0b0b0] rounded-lg h-[85%] w-[53%]">
                        <img
                          src={Image12}
                          alt="Image Grid"
                          className="h-full w-full object-cover rounded-lg opacity-60 hover:opacity-100 transition-opacity duration-300"
                          decoding="async"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 h-[70%] w-[47%]">
                    <div className="bg-[#b0b0b0] rounded-lg h-[60%] w-full">
                      <img
                        src={Image9}
                        alt="Image Grid"
                        className="h-full w-full object-cover rounded-lg opacity-60 hover:opacity-100 transition-opacity duration-300"
                        decoding="async"
                      />
                    </div>
                    <div className="bg-[#b0b0b0] rounded-lg h-[35%] w-[80%]">
                      <img
                        src={Image11}
                        alt="Image Grid"
                        className="h-full w-full object-cover rounded-lg opacity-60 hover:opacity-100 transition-opacity duration-300"
                        decoding="async"
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

      {/* Mobile Hero Section */}
      <div className="md:hidden relative min-h-[100dvh] bg-[#1A1A1A] overflow-hidden">
        <div
          className="absolute left-0 right-0 bg-[#D9D9D9]"
          style={{
            top: "-5%",
            height: "clamp(25dvh, 35vh, 40dvh)",
            left: "0%",
          }}
        />

        <div
          className="absolute left-1/2 -translate-x-1/2 z-10 pointer-events-none w-screen"
          style={{ top: "clamp(15%, 25vh, 35%)" }}
        >
          {/* Filler positioned relative to this container */}
          <img
            src={MobileBackgroundFiller}
            alt="Background Filler"
            loading="eager"
            decoding="async"
            fetchPriority="high"
            className="absolute left-1/2 -translate-x-1/2 -translate-y-[15%] h-auto w-screen z-10 opacity-100"
          />
          {/* DNA positioned relative to this container */}
          <img
            src={MobileBackgroundDNA}
            alt="DNA"
            loading="eager"
            decoding="async"
            fetchPriority="high"
            className="absolute left-1/2 -translate-x-1/2 -translate-y-[8%] h-auto w-screen z-20"
          />
        </div>

        {/* Particle Circle - Above background images */}
        <div className="absolute -top-[5%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
          <div
            className="rounded-full bg-transparent relative overflow-hidden"
            style={{ width: "min(120vh, 180vw)", height: "min(120vh, 180vw)" }}
          >
            <div className="absolute inset-0 w-full h-full">
              <ParticlesBg id="particles-mobile" particleCount={250} />
            </div>
          </div>
        </div>

        {/* Mobile Image Grid - Positioned over particle circle */}
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-[35] w-[90vw] h-[90vw] max-w-[500px] max-h-[500px]">
          {/* Inner grid - scaled for mobile */}
          <div className="h-full w-full grid grid-cols-[41fr_39fr_103fr] gap-[0.15rem] p-1">
            {/* Column 1 */}
            <div className="flex flex-col gap-[0.15rem] h-[56%] mt-[65%] items-end">
              <div className="bg-[#b0b0b0] rounded-lg h-[20%] w-[70%]">
                <img
                  src={Image0}
                  alt="Image Grid"
                  className="h-full w-full object-cover rounded-lg opacity-60 hover:opacity-100 transition-opacity duration-300"
                  decoding="async"
                />
              </div>
              <div className="bg-[#b0b0b0] rounded-lg h-[35%] w-full">
                <img
                  src={Image1}
                  alt="Image Grid"
                  className="h-full w-full object-cover rounded-lg opacity-60 hover:opacity-100 transition-opacity duration-300"
                  decoding="async"
                />
              </div>
              <div className="bg-[#b0b0b0] rounded-lg h-[30%] w-[85%]">
                <img
                  src={Image3}
                  alt="Image Grid"
                  className="h-full w-full object-cover rounded-lg opacity-60 hover:opacity-100 transition-opacity duration-300"
                  decoding="async"
                />
              </div>
            </div>
            {/* Column 2 */}
            <div className="flex flex-col gap-[0.15rem] h-[78%] mt-[20%] items-end">
              <div className="bg-[#b0b0b0] rounded-lg h-[25%] w-full">
                <img
                  src={Image2}
                  alt="Image Grid"
                  className="h-full w-full object-cover rounded-lg opacity-60 hover:opacity-100 transition-opacity duration-300"
                  decoding="async"
                />
              </div>
              <div className="bg-[#b0b0b0] rounded-lg h-[40%] w-full">
                <img
                  src={Image4}
                  alt="Image Grid"
                  className="h-full w-full object-cover rounded-lg opacity-60 hover:opacity-100 transition-opacity duration-300"
                  decoding="async"
                />
              </div>
              <div className="bg-[#b0b0b0] rounded-lg h-[30%] w-full">
                <img
                  src={Image5}
                  alt="Image Grid"
                  className="h-full w-full object-cover rounded-lg opacity-60 hover:opacity-100 transition-opacity duration-300"
                  decoding="async"
                />
              </div>
            </div>
            {/* Column 3 */}
            <div className="flex flex-col gap-[0.15rem] h-full items-start">
              {/* Row 1 */}
              <div className="flex flex-row gap-[0.15rem] h-[35%] w-[85%]">
                <div className="bg-[#b0b0b0] rounded-lg h-full w-[40%]">
                  <img
                    src={Image6}
                    alt="Image Grid"
                    className="h-full w-full object-cover rounded-lg opacity-60 hover:opacity-100 transition-opacity duration-300"
                    decoding="async"
                  />
                </div>
                <div className="bg-[#b0b0b0] rounded-lg h-[80%] w-[60%] self-end">
                  <img
                    src={Image7}
                    alt="Image Grid"
                    className="h-full w-full object-cover rounded-lg opacity-60 hover:opacity-100 transition-opacity duration-300"
                    decoding="async"
                  />
                </div>
              </div>
              {/* Row 2 */}
              <div className="flex flex-row h-[70%] gap-[0.15rem] w-full">
                <div className="flex flex-col gap-[0.15rem] h-full w-[53%]">
                  <div className="bg-[#b0b0b0] rounded-lg h-[50%] w-full">
                    <img
                      src={Image8}
                      alt="Image Grid"
                      className="h-full w-full object-cover rounded-lg opacity-60 hover:opacity-100 transition-opacity duration-300"
                      decoding="async"
                    />
                  </div>
                  <div className="flex flex-row gap-[0.15rem] h-[30%] w-full">
                    <div className="bg-[#b0b0b0] rounded-lg h-full w-[47%]">
                      <img
                        src={Image10}
                        alt="Image Grid"
                        className="h-full w-full object-cover rounded-lg opacity-60 hover:opacity-100 transition-opacity duration-300"
                        decoding="async"
                      />
                    </div>
                    <div className="bg-[#b0b0b0] rounded-lg h-[85%] w-[53%]">
                      <img
                        src={Image12}
                        alt="Image Grid"
                        className="h-full w-full object-cover rounded-lg opacity-60 hover:opacity-100 transition-opacity duration-300"
                        decoding="async"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-[0.15rem] h-[70%] w-[47%]">
                  <div className="bg-[#b0b0b0] rounded-lg h-[60%] w-full">
                    <img
                      src={Image9}
                      alt="Image Grid"
                      className="h-full w-full object-cover rounded-lg opacity-60 hover:opacity-100 transition-opacity duration-300"
                      decoding="async"
                    />
                  </div>
                  <div className="bg-[#b0b0b0] rounded-lg h-[35%] w-[80%]">
                    <img
                      src={Image11}
                      alt="Image Grid"
                      className="h-full w-full object-cover rounded-lg opacity-60 hover:opacity-100 transition-opacity duration-300"
                      decoding="async"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Text Content - Positioned below DNA */}
        <div
          className="absolute left-0 right-0 z-30 px-6"
          style={{ top: "clamp(45%, 52vh, 65%)" }}
        >
          <div className="text-center">
            <h1 className="font-bold text-[#B17CB3] mb-4 text-[clamp(1.2rem,6.5vw,2.25rem)] leading-tight">
              Engineering in Medicine & Biology Society
            </h1>
            <h2 className="font-bold text-[#97BDD7] mb-4 text-[clamp(0.9rem,4.8vw,1.5rem)] leading-tight">
              University of Florida Chapter
            </h2>
            <p className="text-white/95 mb-6 text-[clamp(0.8rem,3.8vw,1.05rem)] leading-relaxed">
              "Bridging innovation, AI, and human health, we empower students to
              explore the frontiers of biomedical technology through
              collaboration, research, and real-world impact."
            </p>
            <div className="flex flex-row gap-3 items-center justify-center">
              <button className="bg-[#ffffff] text-black px-5 py-2.5 rounded-3xl text-[clamp(0.75rem,3.5vw,0.9rem)] shadow-[0_0_14px_rgba(255,255,255,0.85)] hover:shadow-[0_0_28px_rgba(255,255,255,0.85)] transition-shadow duration-300">
                <Link className="no-underline" to="/about">
                  Learn More
                </Link>
              </button>
              {user ? (
                <button className="bg-[#ffffff] text-black px-5 py-2.5 rounded-3xl text-[clamp(0.75rem,3.5vw,0.9rem)] shadow-[0_0_14px_rgba(255,255,255,0.85)] hover:shadow-[0_0_28px_rgba(255,255,255,0.85)] transition-shadow duration-300">
                  <Link
                    className="no-underline"
                    to={
                      userRole === "admin" ? "/admin-dashboard" : "/dashboard"
                    }
                  >
                    Dashboard
                  </Link>
                </button>
              ) : (
                <button className="bg-[#ffffff] text-black px-9 py-2.5 rounded-3xl text-[clamp(0.75rem,3.5vw,0.9rem)] shadow-[0_0_14px_rgba(255,255,255,0.85)] hover:shadow-[0_0_28px_rgba(255,255,255,0.85)] transition-shadow duration-300">
                  <Link className="no-underline" to="/auth/login">
                    Login
                  </Link>
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full justify-center flex mt-0 flex-col items-center mb-4">
          <IoIosArrowDown ref={iconRef} className="text-white text-4xl" />
        </div>
      </div>

      {/* Cool Sliding Content Banner */}
      <div className="w-full bg-[#1A1A1A] py-4 overflow-hidden relative">
        {/* Left gradient overlay */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 z-10 bg-gradient-to-r from-[#1A1A1A] via-[#1A1A1A]/80 to-transparent" />
        {/* Right gradient overlay */}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 z-10 bg-gradient-to-l from-[#1A1A1A] via-[#1A1A1A]/80 to-transparent" />
        <div
          className="
          inline-flex items-center gap-6 whitespace-nowrap
          animate-[move-left_28s_linear_infinite]
          motion-reduce:animate-none
        "
        >
          {itemsTwice.map((text, i) => (
            <span key={i} className="inline-flex items-center">
              <span className="text-[#5a5a5a] font-semibold text-xl md:text-4xl leading-tight">
                {text}
              </span>
              <LuDna className="text-[#5a5a5a] text-xl md:text-4xl ml-6" />
            </span>
          ))}
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
              eventName="Pie-A-Chair"
              location="Turlington Plaza"
              date="September 24"
              time="10:40 AM - 3:00 PM"
              description={
                <>
                  Pie a board member and learn more about what we do!
                  <br />1 Pie: $3
                </>
              }
            />
            <EventCard
              eventName="Resume Workshop"
              location="TBA"
              date="September 25"
              time="5:30 PM - 6:30 PM"
              description="Learn how to write a resume that stands out and get yours reviewed!"
            />
            <EventCard
              eventName="Heartbeat Monitor Workshop"
              location="MAT 0002"
              date="September 26"
              time="6:30 - 8:30PM"
              description="Beginner friendly workshop on building a heartbeat monitor!"
            />
          </div>
        </div>

        {/* Branches Section */}
        <div className="w-full mt-16 px-4 md:px-0">
          <h1 className="text-4xl font-bold text-center mb-8">Our Branches</h1>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                name: "RESEARCH",
                icon: ResearchIcon,
                page: "/research",
                summary: "Conducting hands-on biomedical investigations.",
              },
              {
                name: "PROJECTS",
                icon: ProjectsIcon,
                page: "/projects",
                summary:
                  "Collaborative engineering teams solving real-world problems.",
              },
              {
                name: "OUTREACH",
                icon: OutreachIcon,
                page: "/outreach",
                summary:
                  "Connecting with the community through STEM initiatives.",
              },
              {
                name: "WORKSHOPS",
                icon: WorkshopsIcon,
                page: "/workshops",
                summary:
                  "Skill-building events on hardware, software, and more.",
              },
              {
                name: "INDUSTRY",
                icon: IndustryIcon,
                page: "/industry",
                summary: "Professional development and career exploration.",
              },
              {
                name: "NETWORKING",
                icon: NetworkingIcon,
                page: "/networking",
                summary:
                  "Building lasting relationships with peers and mentors.",
              },
            ].map(({ name, icon, page, summary }) => (
              <div key={name} className="flex justify-center">
                <FlipCard
                  name={name.toUpperCase()} // ✅ force uppercase
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
