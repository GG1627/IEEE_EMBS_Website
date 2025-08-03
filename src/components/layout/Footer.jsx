import { FaInstagram, FaDiscord, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <>
      <div className="w-full h-16 bg-[#c5ebec] mt-10">
        <div className="max-w-7xl h-full mx-auto flex items-center justify-between">
          <h1 className="text-black text-sm font-bold md:text-2xl">UF EMBS</h1>
          {/* Icons */}
          <div className="flex flex-row gap-2">
            <a
              href="https://www.instagram.com/ieee_embs_uf?utm_source=ig_web_button_share_sheet&igsh=YTR4aGdhMmRibjI3"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:text-[#202020] transition-colors duration-300 p-2"
            >
              <FaInstagram className="w-3 h-3 md:w-7 md:h-7" />
            </a>
            <a
              href="https://discord.gg/ieee_embs_uf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:text-[#202020] transition-colors duration-300 p-2"
            >
              <FaDiscord className="w-3 h-3 md:w-7 md:h-7" />
            </a>
            <a
              href="https://www.linkedin.com/company/ieee-embs-uf/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:text-[#202020] transition-colors duration-300 p-2"
            >
              <FaLinkedin className="w-3 h-3 md:w-7 md:h-7" />
            </a>
          </div>
        </div>
      </div>
      <div className="w-full h-10 bg-[#000000]">
        <div className="max-w-7xl mx-auto h-full flex items-center">
          <h1 className="text-white text-xs md:text-sm">
            Copyright &copy; 2025 UF IEEE Engineering in Medicine and Biology
            Society
          </h1>
        </div>
      </div>
    </>
  );
}
