export default function About() {
  return (
    <div className="min-h-screen bg-white py-16 px-6 sm:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto space-y-10 text-gray-800">
        <h1 className="text-4xl font-bold text-center text-[#00629b]">About Us</h1>

        {/* UF Chapter Purpose */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">Our Purpose at UF</h2>
          <p className="text-lg leading-relaxed">
            The University of Florida IEEE EMBS chapter is dedicated to uniting students interested in biomedical engineering,
            healthcare innovation, and interdisciplinary collaboration. We aim to provide a platform for learning, research,
            and community outreach at the intersection of engineering and medicine.
          </p>
        </section>

        {/* National IEEE EMBS Info */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">About IEEE EMBS</h2>
          <p className="text-lg leading-relaxed">
            The IEEE Engineering in Medicine & Biology Society (EMBS) is the world’s largest international society of biomedical engineers,
            with over 11,000 members in 97 countries. EMBS fosters global innovation and collaboration in areas like medical imaging,
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
          <h2 className="text-2xl font-semibold mb-2">What Makes Our Chapter Unique</h2>
          <p className="text-lg leading-relaxed">
            Our chapter combines the strengths of a top-ranked engineering program with UF’s robust health sciences network. We host hands-on workshops,
            speaker events with industry professionals, collaborative design challenges, and opportunities to explore research and clinical applications.
            Whether you're an engineer, a pre-med, or just curious — there's a place for you here.
          </p>
        </section>
      </div>
    </div>
  );
}
