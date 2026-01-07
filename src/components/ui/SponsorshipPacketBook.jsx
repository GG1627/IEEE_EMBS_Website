import { useRef, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import Page1 from '../../assets/sponsorship_packet/Page1.jpg';
import Page2 from '../../assets/sponsorship_packet/Page2.jpg';
import Page3 from '../../assets/sponsorship_packet/Page3.jpg';
import Page4 from '../../assets/sponsorship_packet/Page4.jpg';
import Page5 from '../../assets/sponsorship_packet/Page5.jpg';
import Page6 from '../../assets/sponsorship_packet/Page6.jpg';
import Page7 from '../../assets/sponsorship_packet/Page7.jpg';

export default function SponsorshipPacketBook() {
  const bookRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 7;

  const nextPage = () => {
    if (bookRef.current && currentPage < totalPages - 1) {
      bookRef.current.pageFlip().flipNext();
    }
  };

  const prevPage = () => {
    if (bookRef.current && currentPage > 0) {
      bookRef.current.pageFlip().flipPrev();
    }
  };

  const onPageFlip = (e) => {
    setCurrentPage(e.data);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center overflow-hidden">
      <HTMLFlipBook
        ref={bookRef}
        width={520}
        height={680}
        size="fixed"
        minWidth={420}
        maxWidth={620}
        minHeight={570}
        maxHeight={780}
        showCover={false}
        showShadow={false}
        maxShadowOpacity={0}
        flippingTime={800}
        onFlip={onPageFlip}
        clickEventForward="bottom"
        clickEventBackward="bottom"
        useMouseEvents={true}
        style={{ cursor: 'pointer' }}
      >
        <div><img src={Page1} alt="Cover - Page 1" className="w-full h-full object-contain" /></div>
        <div><img src={Page2} alt="Page 2" className="w-full h-full object-contain" /></div>
        <div><img src={Page3} alt="Page 3" className="w-full h-full object-contain" /></div>
        <div><img src={Page4} alt="Page 4" className="w-full h-full object-contain" /></div>
        <div><img src={Page5} alt="Page 5" className="w-full h-full object-contain" /></div>
        <div><img src={Page6} alt="Page 6" className="w-full h-full object-contain" /></div>
        <div><img src={Page7} alt="Page 7" className="w-full h-full object-contain" /></div>
      </HTMLFlipBook>

      {/* Navigation Arrows and Download Button */}
      <div className="relative flex items-center justify-center w-full mt-4">
        <div className="flex gap-4">
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className={`p-3 rounded-full transition-colors duration-200 ${
              currentPage === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#772583] text-white hover:bg-[#5a1c62]"
            }`}
            aria-label="Previous page"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages - 1}
            className={`p-3 rounded-full transition-colors duration-200 ${
              currentPage === totalPages - 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#772583] text-white hover:bg-[#5a1c62]"
            }`}
            aria-label="Next page"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        <a
          href="/Sponsorship_Packet.pdf"
          download="IEEE_EMBS_Sponsorship_Packet.pdf"
          className="mr-4 md:mr-0 absolute right-0 inline-flex items-center gap-1.5 px-3 py-2 bg-[#772583] text-white rounded-md text-sm font-medium hover:bg-[#5a1c62] transition-colors duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download
        </a>
      </div>
    </div>
  );
}
