// components/ui/FlipCard.jsx
import React from "react";

export default function FlipCard({ imageSrc, name, summary, onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer w-[300px] h-[280px] [perspective:1000px]"
    >
      <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] hover:[transform:rotateY(180deg)]">
        {/* Front Face */}
        <div className="absolute inset-0 backface-hidden bg-white border shadow-md rounded-xl flex flex-col items-center justify-center p-4">
          <img
            src={imageSrc}
            alt={name}
            className="h-32 w-32 object-contain mb-4"
          />
          <h3 className="text-lg font-bold text-[#00629b] text-center">{name}</h3>
        </div>

        {/* Back Face */}
        <div className="absolute inset-0 backface-hidden transform rotate-y-180 bg-gray-100 border shadow-md rounded-xl flex flex-col justify-center items-center text-center p-4">
          <p className="text-sm text-gray-700 mb-4">{summary}</p>
          <p className="text-xs text-gray-500">Click to learn more →</p>
        </div>
      </div>
    </div>
  );
}
