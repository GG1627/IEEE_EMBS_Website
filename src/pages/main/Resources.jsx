import { useState, useEffect } from "react";
import Footer from "../../components/layout/Footer";
import { IoMdHeart } from "react-icons/io";
import { IoMdHeartEmpty } from "react-icons/io";
import { FaLinkedin } from "react-icons/fa";
import { MdScience } from "react-icons/md";
import { useAuth } from "../auth/AuthContext";
import { supabase } from "../../lib/supabase";
import { useSnackbar } from "../../components/ui/Snackbar";
import { careerFields } from "../../data/careerFields";
import GradientMesh from "../../components/ui/GradientMesh";
import { gradientPresets } from "../../styles/ieeeColors";
import DomeGallery from "../../components/ui/DomeGallery";

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

  // Replace all instances of 'fields' with 'careerFields'
  const handleFieldClick = (index) => {
    setSelectedField(index);
  };

  return (
    <>
      <div className="min-h-screen flex flex-col pt-16 relative overflow-hidden bg-white">
        <div className="flex-1 pt-12 px-2 md:px-0">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#00629b] to-[#009ca6] bg-clip-text text-transparent">
                Career Fields
              </h1>
              <h2 className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Discover exciting career paths in biomedical engineering and
                connect with professors, companies, and skills in each field!
              </h2>
            </div>

            {/* Fields */}
            <div className="flex flex-wrap gap-3 justify-center mb-8">
              {careerFields.map((field, index) => (
                <div
                  key={index}
                  className={`px-6 py-3 rounded-full shadow-sm hover:shadow-lg hover:cursor-pointer hover:scale-105 transition-all duration-300 border-2 ${
                    selectedField === index
                      ? "bg-gradient-to-r from-[#00629b] to-[#009ca6] border-transparent text-white shadow-lg"
                      : "bg-white border-[#e0e7ff] text-[#00629b] hover:border-[#009ca6] hover:bg-gradient-to-r hover:from-[#f0f9ff] hover:to-[#ecfeff]"
                  }`}
                  onClick={() => handleFieldClick(index)}
                >
                  <h3 className="text-lg font-semibold whitespace-nowrap">
                    {field.name}
                  </h3>
                </div>
              ))}
            </div>

            {/* Dome Gallery */}
            {selectedField == null && (
              <div className="mt-6 h-[650px] w-full">
                <DomeGallery
                  overlayBlurColor="transparent"
                  grayscale={false}
                  autoRotate={true}
                  autoRotateSpeed={0.1}
                  disableInteractions={true}
                />
              </div>
            )}

            {/* Career Information */}
            {selectedField !== null && careerFields[selectedField] && (
              <div className="mt-8 max-w-5xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 relative backdrop-blur-sm">
                  {/* heart icon */}
                  <button
                    onClick={() =>
                      toggleFavorite(careerFields[selectedField].name)
                    }
                    className="absolute top-8 right-8 text-3xl hover:scale-110 transition-transform hover:cursor-pointer"
                  >
                    {favoriteFields.includes(
                      careerFields[selectedField].name
                    ) ? (
                      <IoMdHeart className="text-red-500" />
                    ) : (
                      <IoMdHeartEmpty className="text-gray-400" />
                    )}
                  </button>
                  {/* Header */}
                  <div className="mb-10">
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-[#00629b] to-[#009ca6] bg-clip-text text-transparent mb-4">
                      {careerFields[selectedField].name}
                    </h2>
                    {careerFields[selectedField].description && (
                      <p className="text-gray-600 text-lg leading-relaxed max-w-3xl">
                        {careerFields[selectedField].description}
                      </p>
                    )}
                  </div>

                  {/* UF Research Professors Section */}
                  {careerFields[selectedField].uf_research_professors && (
                    <div className="mb-8">
                      <h3 className="text-2xl font-bold text-[#00629b] mb-4 flex items-center gap-2">
                        <div className="w-1 h-6 bg-gradient-to-b from-[#00629b] to-[#009ca6] rounded-full"></div>
                        UF Research Professors
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {careerFields[selectedField].uf_research_professors.map(
                          (professor, index) => {
                            // Handle both string and object formats for backward compatibility
                            const professorName =
                              typeof professor === "string"
                                ? professor
                                : professor.name;
                            const professorData =
                              typeof professor === "object" ? professor : null;

                            return (
                              <div
                                key={index}
                                className="flex items-center gap-2 bg-gradient-to-r from-[#f0f9ff] to-[#ecfeff] text-[#00629b] px-5 py-3 rounded-full text-sm font-medium border border-[#e0f2fe] hover:shadow-md transition-all duration-200"
                              >
                                <span>{professorName}</span>
                                {professorData && (
                                  <div className="flex gap-1 ml-2">
                                    <a
                                      href={professorData.linkedin}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="bg-[#0077b5] text-white p-1.5 rounded-full hover:bg-[#005885] transition-colors flex items-center justify-center"
                                      title="LinkedIn Profile"
                                    >
                                      <FaLinkedin size={12} />
                                    </a>
                                    <a
                                      href={professorData.lab}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="bg-gradient-to-r from-[#00629b] to-[#009ca6] text-white p-1.5 rounded-full hover:shadow-md transition-all duration-200 flex items-center justify-center"
                                      title="Lab Website"
                                    >
                                      <MdScience size={12} />
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

                  {/* UF Teaching Professors Section */}
                  {careerFields[selectedField].uf_teaching_professors && (
                    <div className="mb-8">
                      <h3 className="text-2xl font-bold text-[#00629b] mb-4 flex items-center gap-2">
                        <div className="w-1 h-6 bg-gradient-to-b from-[#00629b] to-[#009ca6] rounded-full"></div>
                        UF Teaching Professors
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {careerFields[selectedField].uf_teaching_professors.map(
                          (professor, index) => {
                            // Handle both string and object formats for backward compatibility
                            const professorName =
                              typeof professor === "string"
                                ? professor
                                : professor.name;
                            const professorData =
                              typeof professor === "object" ? professor : null;

                            return (
                              <div
                                key={index}
                                className="flex items-center gap-2 bg-gradient-to-r from-[#f0f9ff] to-[#ecfeff] text-[#00629b] px-5 py-3 rounded-full text-sm font-medium border border-[#e0f2fe] hover:shadow-md transition-all duration-200"
                              >
                                <span>{professorName}</span>
                                {professorData && (
                                  <div className="flex gap-1 ml-2">
                                    <a
                                      href={professorData.linkedin}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="bg-[#0077b5] text-white p-1.5 rounded-full hover:bg-[#005885] transition-colors flex items-center justify-center"
                                      title="LinkedIn Profile"
                                    >
                                      <FaLinkedin size={12} />
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

                  {/* External Professors Section */}
                  {careerFields[selectedField].external_professors && (
                    <div className="mb-8">
                      <h3 className="text-2xl font-bold text-[#00629b] mb-4 flex items-center gap-2">
                        <div className="w-1 h-6 bg-gradient-to-b from-[#00629b] to-[#009ca6] rounded-full"></div>
                        External Professors
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {careerFields[selectedField].external_professors.map(
                          (professor, index) => {
                            // Handle both string and object formats for backward compatibility
                            const professorName =
                              typeof professor === "string"
                                ? professor
                                : professor.name;
                            const professorData =
                              typeof professor === "object" ? professor : null;

                            return (
                              <div
                                key={index}
                                className="flex items-center gap-2 bg-[#e4e6ec] text-[#007dae] px-4 py-2 rounded-full text-sm font-medium"
                              >
                                <span>{professorName}</span>
                                {professorData && (
                                  <div className="flex gap-1 ml-2">
                                    <a
                                      href={professorData.linkedin}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="bg-[#0077b5] text-white p-1.5 rounded-full hover:bg-[#005885] transition-colors flex items-center justify-center"
                                      title="LinkedIn Profile"
                                    >
                                      <FaLinkedin size={12} />
                                    </a>
                                    <a
                                      href={professorData.lab}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="bg-[#007dae] text-white p-1.5 rounded-full hover:bg-[#005a8a] transition-colors flex items-center justify-center"
                                      title="Lab Website"
                                    >
                                      <MdScience size={12} />
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

                  {/* Companies Section */}
                  {careerFields[selectedField].companies && (
                    <div className="mb-8">
                      <h3 className="text-2xl font-bold text-[#00629b] mb-4 flex items-center gap-2">
                        <div className="w-1 h-6 bg-gradient-to-b from-[#00629b] to-[#009ca6] rounded-full"></div>
                        Companies
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {careerFields[selectedField].companies.map(
                          (company, index) => (
                            <div
                              key={index}
                              className="bg-gradient-to-r from-[#f0f9ff] to-[#ecfeff] p-4 rounded-xl border border-[#e0f2fe] hover:shadow-md transition-all duration-200"
                            >
                              <span className="text-[#00629b] font-medium">
                                {company}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Skills Section */}
                  {careerFields[selectedField].skills && (
                    <div className="mb-8">
                      <h3 className="text-2xl font-bold text-[#00629b] mb-4 flex items-center gap-2">
                        <div className="w-1 h-6 bg-gradient-to-b from-[#00629b] to-[#009ca6] rounded-full"></div>
                        Relevant Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {careerFields[selectedField].skills.map(
                          (skill, index) => (
                            <span
                              key={index}
                              className="bg-gradient-to-r from-[#00629b] to-[#009ca6] text-white px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200"
                            >
                              {skill}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Classes Section */}
                  {careerFields[selectedField].classes &&
                    careerFields[selectedField].classes.length > 0 && (
                      <div className="mb-8">
                        <h3 className="text-2xl font-bold text-[#00629b] mb-4 flex items-center gap-2">
                          <div className="w-1 h-6 bg-gradient-to-b from-[#00629b] to-[#009ca6] rounded-full"></div>
                          Related UF Courses
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {careerFields[selectedField].classes.map(
                            (classItem, index) => (
                              <div
                                key={index}
                                className="bg-gradient-to-r from-[#f0f9ff] to-[#ecfeff] p-3 rounded-lg border border-[#e0f2fe] hover:shadow-md transition-all duration-200"
                              >
                                <span className="text-[#00629b] font-medium text-sm">
                                  {classItem}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {/* Project Ideas Section */}
                  {careerFields[selectedField].projectIdeas &&
                    careerFields[selectedField].projectIdeas.length > 0 && (
                      <div className="mb-8">
                        <h3 className="text-2xl font-bold text-[#00629b] mb-4 flex items-center gap-2">
                          <div className="w-1 h-6 bg-gradient-to-b from-[#00629b] to-[#009ca6] rounded-full"></div>
                          Project Ideas
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {careerFields[selectedField].projectIdeas.map(
                            (project, index) => (
                              <div
                                key={index}
                                className="bg-gradient-to-br from-[#f0f9ff] to-[#ecfeff] p-5 rounded-xl border border-[#e0f2fe] hover:shadow-lg transition-all duration-200"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="flex-shrink-0 w-2 h-2 bg-gradient-to-r from-[#00629b] to-[#009ca6] rounded-full mt-2"></div>
                                  <p className="text-[#00629b] text-sm leading-relaxed font-medium">
                                    {project}
                                  </p>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
