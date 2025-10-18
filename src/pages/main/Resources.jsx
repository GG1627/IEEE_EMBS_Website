import { useState, useEffect } from "react";
import Footer from "../../components/layout/Footer";
import { IoMdHeart } from "react-icons/io";
import { IoMdHeartEmpty } from "react-icons/io";
import {
  FaLinkedin,
  FaGithub,
  FaReddit,
  FaWikipediaW,
  FaBlog,
} from "react-icons/fa";
import {
  MdScience,
  MdDescription,
  MdArticle,
  MdSchool,
  MdWeb,
  MdCode,
} from "react-icons/md";
import { SiArxiv } from "react-icons/si";
import { useAuth } from "../auth/AuthContext";
import { supabase } from "../../lib/supabase";
import { useSnackbar } from "../../components/ui/Snackbar";
import { careerFields } from "../../data/careerFields";
import GradientMesh from "../../components/ui/GradientMesh";
import { gradientPresets } from "../../styles/ieeeColors";
import SlidingGallery from "../../components/ui/SlidingGallery";

export default function Resources() {
  const [selectedField, setSelectedField] = useState(null);
  const [favoriteFields, setFavoriteFields] = useState([]);
  const { user } = useAuth();
  const { showSnackbar } = useSnackbar();

  // fetch the user's favorite careers from supabase
  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    const { data, error } = await supabase
      .from("favorite_careers")
      .select("career_name")
      .eq("user_id", user.id);

    if (data) {
      setFavoriteFields(data.map((item) => item.career_name));
    }
  };

  const toggleFavorite = async (careerName) => {
    if (!user) {
      showSnackbar("Log in to begin favoriting!", {
        customColor: "#b00000",
      });
      return;
    }

    const isFavorited = favoriteFields.includes(careerName);

    if (isFavorited) {
      // Remove from favorites
      const { error } = await supabase
        .from("favorite_careers")
        .delete()
        .eq("user_id", user.id)
        .eq("career_name", careerName);

      if (!error) {
        setFavoriteFields((prev) => prev.filter((name) => name !== careerName));
      }
    } else {
      // Add to favorites
      const { error } = await supabase
        .from("favorite_careers")
        .insert([{ user_id: user.id, career_name: careerName }]);

      if (!error) {
        setFavoriteFields((prev) => [...prev, careerName]);
      }
    }
  };

  const handleFieldClick = (index) => {
    setSelectedField(index);
  };

  // Helper function to get margin class for a section
  const getMarginClass = (sectionName) => {
    const sectionsInColumn = careerFields[selectedField]?.sectionsInColumn;
    if (!sectionsInColumn) return "mb-10";

    const sectionConfig = sectionsInColumn.find((item) => {
      if (typeof item === "string") return item === sectionName;
      if (typeof item === "object") return item.section === sectionName;
      return false;
    });

    if (
      typeof sectionConfig === "object" &&
      sectionConfig.marginBottom !== undefined
    ) {
      return `mb-${sectionConfig.marginBottom}`;
    }

    return "mb-10";
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Full Screen Mesh Gradient Background */}
      <div className="absolute inset-0">
        <GradientMesh
          colors={gradientPresets.designathon}
          baseGradient="linear-gradient(to bottom, #faf9fb, #ffffff, #f9fafb)"
        />
      </div>

      {/* Hero Section - Apple-inspired */}
      <section className="relative pt-20 pb-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-gray-900 tracking-tight mb-6">
              Career Fields
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 font-light leading-relaxed mb-8">
              Discover your path in biomedical engineering
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <span>{careerFields.length} specializations</span>
              <span>•</span>
              <span>Explore opportunities</span>
            </div>
          </div>
        </div>
      </section>

      {/* Career Fields Buttons - Enhanced pill design with glow effects */}
      <section className="flex-1 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Career Fields Buttons */}
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            {careerFields.map((field, index) => (
              <button
                key={index}
                className={`px-6 py-3 rounded-full font-medium text-sm tracking-wide transition-all duration-300 hover:cursor-pointer relative group ${
                  selectedField === index
                    ? "bg-white/20 backdrop-blur-md text-[#00629b] shadow-xl shadow-[#00629b]/20 border-2 border-[#00629b] scale-105"
                    : "bg-white/90 backdrop-blur-sm text-gray-700 border border-gray-200 hover:bg-white hover:text-[#00629b] hover:shadow-lg hover:shadow-[#00629b]/20 hover:border-[#00629b]/30 hover:scale-105"
                }`}
                onClick={() => handleFieldClick(index)}
              >
                {field.name}
                {/* Glassy glow effect for selected state */}
                {selectedField === index && (
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#00629b]/10 to-white/10 blur-lg -z-10"></div>
                )}
                {/* Glow effect for hover */}
                <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-[#00629b]/10 to-[#772583]/10 blur-sm -z-10"></div>
              </button>
            ))}
          </div>

          {/* Sliding Gallery - Shows when nothing is selected */}
          {selectedField === null && (
            <div className="w-full h-[350px] mt-8 mb-8">
              <SlidingGallery onFieldSelect={handleFieldClick} />
            </div>
          )}
        </div>
      </section>

      {/* Detailed Career View - Sleek Modal */}
      {selectedField !== null && careerFields[selectedField] && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-7xl w-full max-h-[95vh] overflow-hidden shadow-2xl border border-gray-200">
            {/* Modal Header */}
            <div className="relative p-8 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
              <button
                onClick={() => setSelectedField(null)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-200 hover:scale-105"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <div className="flex items-start justify-between pr-16">
                <div className="flex-1">
                  <h2 className="text-4xl font-light text-gray-900 mb-4">
                    {careerFields[selectedField].name}
                  </h2>
                  {careerFields[selectedField].description && (
                    <p className="text-xl text-gray-600 font-light leading-relaxed max-w-3xl">
                      {careerFields[selectedField].description}
                    </p>
                  )}
                </div>
                <button
                  onClick={() =>
                    toggleFavorite(careerFields[selectedField].name)
                  }
                  className="text-3xl hover:scale-110 transition-transform duration-200 ml-6"
                >
                  {favoriteFields.includes(careerFields[selectedField].name) ? (
                    <IoMdHeart className="text-red-500" />
                  ) : (
                    <IoMdHeartEmpty className="text-gray-300 hover:text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Modal Content with Image */}
            <div className="p-8 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Image */}
                {careerFields[selectedField].image && (
                  <div className="lg:col-span-1">
                    <div className="sticky top-8">
                      <div className="overflow-hidden rounded-2xl shadow-lg">
                        <img
                          src={careerFields[selectedField].image}
                          alt={careerFields[selectedField].name}
                          className="w-full h-auto object-contain hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Right Column - Content */}
                <div
                  className={`space-y-8 ${
                    careerFields[selectedField].image
                      ? "lg:col-span-2"
                      : "lg:col-span-3"
                  }`}
                >
                  {/* Professors Section */}
                  <div
                    className={`grid gap-8 ${
                      careerFields[selectedField].uf_research_professors &&
                      careerFields[selectedField].uf_teaching_professors
                        ? "grid-cols-1 md:grid-cols-2"
                        : "grid-cols-1"
                    }`}
                  >
                    {/* UF Research Professors */}
                    {careerFields[selectedField].uf_research_professors && (
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
                        <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          UF Research Professors
                        </h3>
                        <div className="space-y-3">
                          {careerFields[
                            selectedField
                          ].uf_research_professors.map((professor, index) => {
                            const professorName =
                              typeof professor === "string"
                                ? professor
                                : professor.name;
                            const professorData =
                              typeof professor === "object" ? professor : null;

                            return (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-white/70 rounded-xl hover:bg-white transition-colors duration-200"
                              >
                                <span className="font-medium text-gray-900 text-sm">
                                  {professorName}
                                </span>
                                {professorData && (
                                  <div className="flex gap-2">
                                    <a
                                      href={professorData.linkedin}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-gray-400 hover:text-blue-600 transition-colors"
                                    >
                                      <FaLinkedin size={16} />
                                    </a>
                                    <a
                                      href={professorData.lab}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                      <MdScience size={16} />
                                    </a>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* UF Teaching Professors */}
                    {careerFields[selectedField].uf_teaching_professors && (
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
                        <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                          UF Teaching Professors
                        </h3>
                        <div className="space-y-3">
                          {careerFields[
                            selectedField
                          ].uf_teaching_professors.map((professor, index) => {
                            const professorName =
                              typeof professor === "string"
                                ? professor
                                : professor.name;
                            const professorData =
                              typeof professor === "object" ? professor : null;

                            return (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-white/70 rounded-xl hover:bg-white transition-colors duration-200"
                              >
                                <span className="font-medium text-gray-900 text-sm">
                                  {professorName}
                                </span>
                                {professorData && (
                                  <div className="flex gap-2">
                                    <a
                                      href={professorData.linkedin}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-gray-400 hover:text-blue-600 transition-colors"
                                    >
                                      <FaLinkedin size={16} />
                                    </a>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* External Professors */}
                  {careerFields[selectedField].external_professors && (
                    <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-2xl border border-purple-100">
                      <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                        External Professors
                      </h3>
                      <div className="space-y-3">
                        {careerFields[selectedField].external_professors.map(
                          (professor, index) => {
                            const professorName =
                              typeof professor === "string"
                                ? professor
                                : professor.name;
                            const professorData =
                              typeof professor === "object" ? professor : null;

                            return (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-white/70 rounded-xl hover:bg-white transition-colors duration-200"
                              >
                                <span className="font-medium text-gray-900 text-sm">
                                  {professorName}
                                </span>
                                {professorData && (
                                  <div className="flex gap-2">
                                    <a
                                      href={professorData.linkedin}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-gray-400 hover:text-blue-600 transition-colors"
                                    >
                                      <FaLinkedin size={16} />
                                    </a>
                                    <a
                                      href={professorData.lab}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                      <MdScience size={16} />
                                    </a>
                                  </div>
                                )}
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  )}

                  {/* Skills and Companies Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Skills */}
                    {careerFields[selectedField].skills && (
                      <div className="bg-gradient-to-br from-slate-50 to-gray-50 p-6 rounded-2xl border border-slate-100">
                        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                          <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
                          Relevant Skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {careerFields[selectedField].skills.map(
                            (skill, index) => (
                              <span
                                key={index}
                                className="px-3 py-1.5 bg-slate-600 text-white rounded-full text-xs font-medium hover:bg-slate-700 transition-colors duration-200"
                              >
                                {skill}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {/* Companies */}
                    {careerFields[selectedField].companies && (
                      <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-6 rounded-2xl border border-teal-100">
                        <h3 className="text-lg font-semibold text-teal-900 mb-4 flex items-center gap-2">
                          <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                          Companies
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                          {careerFields[selectedField].companies.map(
                            (company, index) => (
                              <div
                                key={index}
                                className="p-2 bg-white/70 rounded-lg hover:bg-white transition-colors duration-200"
                              >
                                <span className="text-gray-900 font-medium text-xs">
                                  {company}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Classes */}
                  {careerFields[selectedField].classes &&
                    careerFields[selectedField].classes.length > 0 && (
                      <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-2xl border border-pink-100">
                        <h3 className="text-lg font-semibold text-pink-900 mb-4 flex items-center gap-2">
                          <div className="w-2 h-2 bg-pink-600 rounded-full"></div>
                          Related UF Courses
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {careerFields[selectedField].classes.map(
                            (classItem, index) => (
                              <div
                                key={index}
                                className="p-3 bg-white/70 rounded-xl hover:bg-white transition-colors duration-200"
                              >
                                <span className="text-gray-900 font-medium text-sm">
                                  {classItem}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {/* Project Ideas */}
                  {careerFields[selectedField].projectIdeas &&
                    careerFields[selectedField].projectIdeas.length > 0 && (
                      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-2xl border border-indigo-100">
                        <h3 className="text-lg font-semibold text-indigo-900 mb-4 flex items-center gap-2">
                          <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                          Project Ideas
                        </h3>
                        <div className="space-y-4">
                          {careerFields[selectedField].projectIdeas.map(
                            (project, index) => {
                              // Handle both string and object formats
                              const projectText =
                                typeof project === "string"
                                  ? project
                                  : project.text;
                              const projectLinks =
                                typeof project === "object"
                                  ? project.links
                                  : null;

                              return (
                                <div
                                  key={index}
                                  className="p-4 bg-white/70 rounded-xl hover:bg-white transition-colors duration-200"
                                >
                                  <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
                                    <div className="flex-1">
                                      <p className="text-gray-700 leading-relaxed text-sm mb-3">
                                        {projectText}
                                      </p>
                                      {projectLinks &&
                                        projectLinks.length > 0 && (
                                          <div>
                                            <p className="text-xs font-medium text-indigo-600 mb-2">
                                              Helpful Resources:
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                              {projectLinks.map(
                                                (link, linkIndex) => (
                                                  <a
                                                    key={linkIndex}
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg text-xs font-medium transition-colors duration-200"
                                                  >
                                                    {link.type === "github" ? (
                                                      <FaGithub size={12} />
                                                    ) : link.type ===
                                                      "documentation" ? (
                                                      <MdDescription
                                                        size={12}
                                                      />
                                                    ) : link.type ===
                                                      "tutorial" ? (
                                                      <MdSchool size={12} />
                                                    ) : link.type ===
                                                      "article" ? (
                                                      <MdArticle size={12} />
                                                    ) : link.type ===
                                                      "arxiv" ? (
                                                      <SiArxiv size={12} />
                                                    ) : link.type ===
                                                      "wikipedia" ? (
                                                      <FaWikipediaW size={12} />
                                                    ) : link.type ===
                                                      "reddit" ? (
                                                      <FaReddit size={12} />
                                                    ) : link.type === "blog" ? (
                                                      <FaBlog size={12} />
                                                    ) : link.type ===
                                                      "website" ? (
                                                      <MdWeb size={12} />
                                                    ) : (
                                                      <MdCode size={12} />
                                                    )}
                                                    {link.type === "github"
                                                      ? "GitHub"
                                                      : link.type ===
                                                        "documentation"
                                                      ? "Documentation"
                                                      : link.type === "tutorial"
                                                      ? "Tutorial"
                                                      : link.type === "article"
                                                      ? "Article"
                                                      : link.type === "arxiv"
                                                      ? "arXiv"
                                                      : link.type ===
                                                        "wikipedia"
                                                      ? "Wikipedia"
                                                      : link.type === "reddit"
                                                      ? "Reddit"
                                                      : link.type === "blog"
                                                      ? "Blog"
                                                      : link.type === "website"
                                                      ? "Website"
                                                      : "Resource"}
                                                  </a>
                                                )
                                              )}
                                            </div>
                                          </div>
                                        )}
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
