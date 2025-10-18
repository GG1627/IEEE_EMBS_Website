import { useEffect, useRef, useState } from "react";
import { careerFields } from "../../data/careerFields";

export default function SlidingGallery({ onFieldSelect }) {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    if (isHovered) return; // Pause on hover

    const interval = setInterval(() => {
      setScrollPosition((prev) => prev - 1); // Continuous scroll to the left
    }, 20); // Smooth animation

    return () => clearInterval(interval);
  }, [isHovered]);

  // Duplicate the images for seamless looping
  const duplicatedImages = [...careerFields, ...careerFields];

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden rounded-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Images container */}
      <div
        className="flex h-full items-center"
        style={{
          transform: `translateX(${scrollPosition}px)`,
          width: `${duplicatedImages.length * 300}px`, // Each image is 300px wide
        }}
      >
        {duplicatedImages.map((field, index) => (
          <div
            key={`${field.name}-${index}`}
            className="flex-shrink-0 mx-2 relative group cursor-pointer"
            style={{ width: "200px", height: "300px" }}
            onClick={() =>
              onFieldSelect && onFieldSelect(index % careerFields.length)
            }
          >
            {/* Image container */}
            <div className="relative w-full h-full rounded-xl overflow-hidden shadow-lg">
              {/* Background image */}
              <div
                className="absolute inset-0 bg-contain bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url(${field.image})` }}
              >
                {/* Dark overlay - same size as image */}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/60 transition-all duration-300"></div>
              </div>

              {/* Content overlay - hidden by default, shown on hover */}
              <div className="absolute inset-0 flex flex-col justify-center items-center text-white z-20 p-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-2 tracking-tight">
                    {field.name}
                  </h3>
                  <p className="text-sm opacity-90 leading-relaxed">
                    {field.description}
                  </p>
                </div>
              </div>

              {/* Hover effect border */}
              <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-white/50 transition-all duration-300"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
