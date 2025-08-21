import { FaInstagram, FaDiscord, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <>
      <div className="w-full h-12 md:h-16 bg-[#f2f0ef] mt-10 border border-t-1 border-black">
        <div className="max-w-[1600px] h-full mx-auto flex items-center justify-between px-4">
          <h1 className="text-black text-lg font-bold md:text-2xl">UF EMBS</h1>
          {/* Icons */}
          <div className="flex flex-row gap-1 md:gap-2">
            <a
              href="https://www.instagram.com/ieee_embs_uf?utm_source=ig_web_button_share_sheet&igsh=YTR4aGdhMmRibjI3"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:text-[#00629b] transition-colors duration-300 p-2"
            >
              <FaInstagram className="w-5 h-5 md:w-7 md:h-7" />
            </a>
            <a
              href="https://discord.gg/dSeBes8Ywx"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:text-[#00629b] transition-colors duration-300 p-2"
            >
              <FaDiscord className="w-5 h-5 md:w-7 md:h-7" />
            </a>
            <a
              href="https://www.linkedin.com/company/ieee-embs-uf/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:text-[#00629b] transition-colors duration-300 p-2"
            >
              <FaLinkedin className="w-5 h-5 md:w-7 md:h-7" />
            </a>
          </div>
        </div>
      </div>
      <div className="w-full h-10 bg-[#000000]">
        <div className="max-w-[1600px] mx-auto h-full flex items-center px-4">
          <h1 className="text-white text-xs md:text-sm">
            Copyright &copy; 2025 UF Engineering in Medicine and Biology Society
          </h1>
        </div>
      </div>
    </>
  );
}
