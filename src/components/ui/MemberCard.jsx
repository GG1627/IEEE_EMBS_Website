import defaultAvatar from "../../assets/default-avatar.png";
import { FaLinkedin } from "react-icons/fa";

export default function MemberCard({ name, position, linkedin, imgURL }) {
  return (
    <div className="relative group">
      <div className="bg-white/30 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border border-gray-100 hover:scale-104">
        <div className="p-4">
          <div className="w-48 h-48 mx-auto mb-4 relative group">
            <div className="absolute inset-0 rounded-full"></div>
            <img
              src={imgURL || defaultAvatar}
              alt={`${name} - ${position}`}
              className="w-full h-full object-cover rounded-full ring-1 ring-gray-100"
              decoding="async"
            />
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-[18px] text-gray-800 transition-colors duration-300 group-hover:text-[#772583]">
              {name}
            </h3>
            <p className="text-gray-600 mt-1">{position}</p>
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center mt-3 text-blue-600 hover:text-blue-700 transition-transform duration-300 hover:scale-110"
            >
              <FaLinkedin className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
