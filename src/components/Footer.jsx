import { FaInstagram, FaDiscord, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <>
      <div className="w-full h-20 md:h-30 bg-[#97bdd7]">
        <div className="max-w-7xl mx-auto flex justify-center items-center">
          <div className="flex flex-col -space-y-1 md:space-y-0">
            <h1 className="text-black text-lg md:text-2xl font-bold text-center">
              EMBS
            </h1>
            <h2 className="text-black text-xs md:text-lg text-center">
              University of Florida IEEE Engineering in Medicine and Biology
              Society
            </h2>
            {/* Icons */}
            <div className="flex flex-row justify-center">
              <a
                href="https://www.instagram.com/ieee_embs_uf?utm_source=ig_web_button_share_sheet&igsh=YTR4aGdhMmRibjI3"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:text-[#202020] transition-colors duration-300 p-2"
              >
                <FaInstagram className="w-3 h-3 md:w-5 md:h-5" />
              </a>
              <a
                href="https://discord.gg/ieee_embs_uf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:text-[#202020] transition-colors duration-300 p-2"
              >
                <FaDiscord className="w-3 h-3 md:w-5 md:h-5" />
              </a>
              <a
                href="https://www.linkedin.com/company/ieee-embs-uf/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:text-[#202020] transition-colors duration-300 p-2"
              >
                <FaLinkedin className="w-3 h-3 md:w-5 md:h-5" />
              </a>
            </div>
            <h1 className="text-black text-xs md:text-sm text-center">
              &copy; 2025 UF IEEE EMBS. All rights reserved. Made with 💜
            </h1>
          </div>
        </div>
      </div>
    </>
  );
}
