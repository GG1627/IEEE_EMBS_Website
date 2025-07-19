// Notes:
// 1. Need to upgrade spline account to remove the watermark thingy
// 2. Just basic design, can be changed later

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <div className="min-h-screen bg-white pt-16 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 h-[calc(100vh-4rem)]">
            {/* Left Column - Text Content */}
            <div className="relative z-10 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-8">
              <div className="text-center lg:text-left">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
                  IEEE Engineering in Medicine & Biology Society
                </h1>
                <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-semibold text-gray-600 mt-4">
                  University of Florida Chapter
                </h2>
                <p className="text-md sm:text-lg lg:text-xl text-gray-500 mt-2">
                  "Insert Mission Statement/Quote"
                </p>
                <p className="text-lg sm:text-xl lg:text-2xl text-gray-500 mt-6 leading-relaxed">
                  Join us in advancing healthcare through innovative biomedical
                  engineering solutions
                </p>
              </div>

              {/* Call to Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-8">
                <button className="bg-gradient-to-r from-[#772583] to-[#00629b] hover:from-[#8b2d96] hover:to-[#0073b7] text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
                  Join Now
                </button>
                <button className="border-2 border-gray-400 text-gray-700 hover:bg-gray-100 hover:border-gray-500 px-8 py-3 rounded-lg font-semibold transition-all duration-300">
                  Learn More
                </button>
              </div>
              {/* Upcoming Events Section */}
              <div className="bg-[#f9f9f9] py-12 px-4 sm:px-6 lg:px-8 mt-12">
                <div className="max-w-4xl mx-auto text-center">
                  <h2 className="text-3xl sm:text-4xl font-bold text-[#00629b] mb-6">
                    📣 Upcoming Events
                  </h2>

                  {/* Event Card */}
                  <div className="bg-white rounded-2xl shadow-md p-6 border-l-8 border-[#772583] inline-block text-left">
                    <span className="text-sm font-semibold uppercase tracking-wide text-[#772583]">
                      First GBM 🎉
                    </span>
                    <p className="mt-2 text-lg text-gray-800">
                      <strong>📍 Location:</strong> TBD
                    </p>
                    <p className="text-lg text-gray-800">
                      <strong>🕒 Date & Time:</strong> TBD
                    </p>
                    <p className="mt-3 text-sm text-gray-500 italic">
                      Come meet the board, learn about our mission, and hear what we have planned!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - 3D Component Full Height */}
            <div className="relative h-full">
              <iframe
                src="https://my.spline.design/dnaparticles-rAmMRwjux8zJpb5ObHwDVji6/"
                frameBorder="0"
                width="100%"
                height="100%"
                className="w-full h-full"
                title="DNA Particles Animation"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
