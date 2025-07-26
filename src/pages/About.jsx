import Footer from "../components/Footer";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="flex-1 py-16 px-6 sm:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto space-y-10 text-gray-800">
          <h1 className="text-4xl font-bold text-center text-[#00629b]">
            About Us
          </h1>

          {/* UF Chapter Purpose */}
          <section>
            <h2 className="text-2xl font-semibold mb-2">Our Purpose at UF</h2>
            <p className="text-lg leading-relaxed">
              The IEEE EMBS chapter at the University of Florida is a student-led organization 
              focused on empowering engineers to innovate at the intersection of healthcare and technology. 
              Our mission is to provide students with the tools, connections, and experiences needed to grow 
              academically, professionally, and personally in the field of biomedical engineering.
              <br /><br />
              We foster a community where students from all backgrounds can access mentorship, industry insights, 
              and hands-on opportunities, regardless of experience level. Through leadership development, research 
              exposure, and interdisciplinary collaboration, we prepare students to make meaningful contributions 
              to society through engineering in medicine.
            </p>
          </section>

          {/* National IEEE EMBS Info */}
          <section>
            <h2 className="text-2xl font-semibold mb-2">About IEEE EMBS</h2>
            <p className="text-lg leading-relaxed">
              The IEEE Engineering in Medicine & Biology Society (EMBS) is the
              world’s largest international society of biomedical engineers,
              with over 11,000 members in 97 countries. EMBS fosters global
              innovation and collaboration in areas like medical imaging,
              wearable tech, neural engineering, and healthcare systems.
            </p>
            <a
              href="https://www.embs.org/"
              className="text-[#00629b] underline hover:text-[#8b2d96] mt-2 inline-block"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit the official EMBS website →
            </a>
          </section>

          {/* What Makes Us Unique */}
          <section>
            <h2 className="text-2xl font-semibold mb-2">
              What Makes Our Chapter Unique
            </h2>
            <p className="text-lg leading-relaxed">
              Our chapter uniquely combines UF’s strengths in engineering and health sciences to support 
              student development in an emerging, interdisciplinary field. We offer workshops, technical 
              projects, guest speakers, and design challenges that give students real-world exposure and a 
              head start in their careers. 
              <br /><br />
              We believe in breaking down barriers to involvement and democratizing access to skills and knowledge 
              that are often reserved for graduate students. Whether you’re exploring the role of AI in diagnostics, 
              learning about wearable biosensors, or just curious about the future of healthcare technology, EMBS is 
              your gateway to grow, connect, and lead.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
