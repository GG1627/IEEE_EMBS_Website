import { FaHeartbeat, FaUserFriends, FaMicroscope } from "react-icons/fa";
import labImage from "../../assets/images/recognition-scientists-lab2x.jpg";
import Footer from "../../components/layout/Footer";

export default function About() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 px-6 md:px-16 py-18 space-y-20">
        {/* Section 1: Our Purpose at UF */}
        <section className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-bold text-[#00629b] mb-4">
              Our Purpose at UF
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              The EMBS chapter at the University of Florida is a student-led
              organization focused on empowering engineers to innovate at the
              intersection of healthcare and technology. Our mission is to
              provide students with the tools, connections, and experiences
              needed to grow academically, professionally, and personally in the
              field of biomedical engineering.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              We foster a community where students from all backgrounds can
              access mentorship, industry insights, and hands-on opportunities.
              Through leadership development, research exposure, and
              interdisciplinary collaboration, we prepare students to make
              meaningful contributions to society through engineering in
              medicine.
            </p>
          </div>
          <figure className="flex flex-col items-center">
            <img
              src={labImage}
              alt="Biomedical Innovation"
              className="rounded-lg w-full h-auto object-cover"
            />
            <figcaption className="text-sm text-gray-500 mt-2 text-center">
              Image from{" "}
              <a
                href="https://www.embs.org/awards/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-[#00629b]"
              >
                IEEE EMBS Awards
              </a>
            </figcaption>
          </figure>
        </section>

        {/* Section 2: What is IEEE EMBS */}
        <section className="bg-[#f4f4f4] p-8 rounded-xl shadow-inner">
          <h2 className="text-3xl font-bold text-[#772583] mb-4">
            About IEEE EMBS
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-4">
            The IEEE Engineering in Medicine & Biology Society (EMBS) is the
            world’s largest international society of biomedical engineers, with
            over 11,000 members in 97 countries. EMBS fosters global innovation
            and collaboration in areas like medical imaging, wearable tech,
            neural engineering, and healthcare systems.
          </p>
          <a
            href="https://www.embs.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#00629b] font-semibold hover:underline"
          >
            Visit the official EMBS website →
          </a>
        </section>

        {/* Section 3: What Makes Our Chapter Unique */}
        <section>
          <h2 className="text-3xl font-bold text-[#00b4d8] mb-6">
            What Makes Our Chapter Unique
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#f4f4f4] p-6 rounded-xl shadow-md">
              <FaMicroscope className="text-3xl text-[#00629b] mb-3" />
              <h3 className="text-xl font-semibold text-[#00629b] mb-2">
                Interdisciplinary Projects
              </h3>
              <p className="text-gray-700">
                Workshops, technical projects, and design challenges across
                engineering and health sciences.
              </p>
            </div>
            <div className="bg-[#f4f4f4] p-6 rounded-xl shadow-md">
              <FaUserFriends className="text-3xl text-[#772583] mb-3" />
              <h3 className="text-xl font-semibold text-[#772583] mb-2">
                Inclusive Community
              </h3>
              <p className="text-gray-700">
                Open to students of all levels and backgrounds - no prior
                experience required.
              </p>
            </div>
            <div className="bg-[#f4f4f4] p-6 rounded-xl shadow-md">
              <FaHeartbeat className="text-3xl text-[#00b4d8] mb-3" />
              <h3 className="text-xl font-semibold text-[#00b4d8] mb-2">
                Healthcare Innovation
              </h3>
              <p className="text-gray-700">
                Explore topics like AI in diagnostics, wearable biosensors, and
                the future of medtech.
              </p>
            </div>
          </div>
        </section>

        {/* Optional: CTA Section */}
        <section className="bg-[#00629b] text-white p-8 rounded-xl text-center">
          <h2 className="text-2xl font-bold mb-3">Ready to Join?</h2>
          <p className="text-lg mb-4">
            Get involved, make connections, and start building your future in
            biomedical engineering with us.
          </p>
          <a
            href="/contact"
            className="inline-block bg-white text-[#00629b] px-5 py-2 rounded-full font-semibold hover:bg-gray-100 transition"
          >
            Contact Us
          </a>
        </section>
      </div>
      <Footer />
    </div>
  );
}
