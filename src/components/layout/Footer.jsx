import { FaInstagram, FaDiscord, FaLinkedin } from "react-icons/fa";
import PixelBlast from "../ui/PixelBlast";

export default function Footer() {
  return (
    <div className="w-full relative">
      {/* Main footer with rounded top corners */}
      <div className="w-full h-14 md:h-16 relative bg-[#1a1a1a] overflow-hidden">
        {/* PixelBlast Background */}
        <PixelBlast
          variant="circle"
          pixelSize={3}
          color="#B19EEF"
          patternScale={1.8}
          patternDensity={1.2}
          pixelSizeJitter={0.2}
          enableRipples
          rippleSpeed={0.85}
          rippleThickness={0.08}
          rippleIntensityScale={1.0}
          liquid
          liquidStrength={0.16}
          liquidRadius={0.8}
          liquidWobbleSpeed={3}
          speed={0.9}
          edgeFade={0.4}
        />

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-center md:flex-row md:items-center py-4">
          <div className="max-w-[1600px] mx-auto w-full px-4 md:px-6">
            {/* Mobile: Two rows with separator */}
            <div className="md:hidden">
              {/* Top Row - Brand and Social */}
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-white text-lg font-bold drop-shadow-lg">
                  UF EMBS
                </h1>

                {/* Social Icons */}
                <div className="flex flex-row gap-2">
                  <a
                    href="https://www.instagram.com/ieee_embs_uf?utm_source=ig_web_button_share_sheet&igsh=YTR4aGdhMmRibjI3"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-[#B19EEF] transition-colors duration-300 p-1"
                  >
                    <FaInstagram className="w-5 h-5" />
                  </a>
                  <a
                    href="https://discord.gg/dSeBes8Ywx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-[#B19EEF] transition-colors duration-300 p-1"
                  >
                    <FaDiscord className="w-5 h-5" />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/ieee-embs-uf/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-[#B19EEF] transition-colors duration-300 p-1"
                  >
                    <FaLinkedin className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Separator Line */}
              <div className="w-full h-px bg-white/20"></div>

              {/* Bottom Row - Feedback and Copyright */}
              <div className="flex items-center justify-between">
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLSdV7s0CikqzsljR81N9-8HPBrFj2ynmKlK5w8_nd3Lr-iYQmw/viewform"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-[#B19EEF] transition-colors duration-300 text-xs font-medium"
                >
                  Have Feedback?
                </a>

                <h2 className="text-white text-xs font-medium">
                  &copy; 2025 UF EMBS
                </h2>
              </div>
            </div>

            {/* Desktop: Single row */}
            <div className="hidden md:flex items-center justify-between">
              {/* Left side - Brand */}
              <div className="flex items-center gap-4">
                <h1 className="text-white text-xl font-bold drop-shadow-lg">
                  UF EMBS
                </h1>

                {/* Separator */}
                <div className="w-px h-6 bg-white/20"></div>

                {/* Feedback Link */}
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLSdV7s0CikqzsljR81N9-8HPBrFj2ynmKlK5w8_nd3Lr-iYQmw/viewform"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-[#B19EEF] transition-colors duration-300 text-sm font-medium"
                >
                  Have Feedback?
                </a>
              </div>

              {/* Right side - Social and Copyright */}
              <div className="flex items-center gap-4">
                {/* Social Icons */}
                <div className="flex flex-row gap-2">
                  <a
                    href="https://www.instagram.com/ieee_embs_uf?utm_source=ig_web_button_share_sheet&igsh=YTR4aGdhMmRibjI3"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-[#B19EEF] transition-colors duration-300 p-1"
                  >
                    <FaInstagram className="w-6 h-6" />
                  </a>
                  <a
                    href="https://discord.gg/dSeBes8Ywx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-[#B19EEF] transition-colors duration-300 p-1"
                  >
                    <FaDiscord className="w-6 h-6" />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/ieee-embs-uf/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-[#B19EEF] transition-colors duration-300 p-1"
                  >
                    <FaLinkedin className="w-6 h-6" />
                  </a>
                </div>

                {/* Separator */}
                <div className="w-px h-6 bg-white/20"></div>

                {/* Copyright */}
                <h2 className="text-white text-base font-medium">
                  &copy; 2025 UF EMBS
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
