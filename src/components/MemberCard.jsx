import defaultAvatar from "../assets/default-avatar.png";
import { FaLinkedin } from "react-icons/fa";

export default function MemberCard({ name, position, image, linkedin }) {
  return (
    <>
      <div className="bg-gray-50 hover:bg-white rounded-xl border border-gray-200 hover:border-[#772583] shadow-sm hover:shadow-lg p-6 transition-all duration-300 transform hover:scale-105">
        <div className="flex flex-col items-center text-center">
          <img
            src={image || defaultAvatar}
            alt={name}
            className="w-20 h-20 rounded-full object-cover mb-4 border-2 border-gray-200"
          />
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            {name || "Member Name"}
          </h3>
          <p className="text-sm text-gray-600 mb-3">{position || "Position"}</p>

          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00629b] hover:text-[#772583] transition-colors duration-300 p-2 rounded-full hover:bg-gray-100"
            >
              <FaLinkedin className="w-5 h-5" />
            </a>
          )}
        </div>
      </div>
    </>
  );
}
