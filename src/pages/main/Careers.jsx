import { useState, useEffect } from "react";
import Footer from "../../components/layout/Footer";
import { IoMdHeart } from "react-icons/io";
import { IoMdHeartEmpty } from "react-icons/io";
import { useAuth } from "../auth/AuthContext";
import { supabase } from "../../lib/supabase";
import { useSnackbar } from "../../components/ui/Snackbar";
import { careerFields } from "../../data/careerFields";

export default function Careers() {
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
      <div className="min-h-screen flex flex-col bg-white">
        <div className="flex-1 py-12 px-2 md:px-0">
          <div className="container mx-auto max-w-7xl">
            <h1 className="text-4xl font-bold text-center mb-12 mt-8 text-gray-800">
              Careers
            </h1>
            <h2 className="text-2xl font-bold text-center mb-12 mt-8 text-gray-800">
              Explore all the wonderful fields of engineering in medicine and
              biology!
            </h2>

            {/* Fields */}
            <div className="flex flex-wrap gap-4 justify-center">
              {careerFields.map((field, index) => (
                <div
                  key={index}
                  className={`border px-4 py-2 rounded-lg shadow-sm hover:shadow-md hover:cursor-pointer hover:scale-105 transition-all duration-300 ${
                    selectedField === index
                      ? "bg-[#007dae] border-[#007dae] text-white"
                      : "bg-[#e4e6ec] border-[#97bdd7] text-[#007dae]"
                  }`}
                  onClick={() => handleFieldClick(index)}
                >
                  <h3 className="text-lg font-semibold whitespace-nowrap">
                    {field.name}
                  </h3>
                </div>
              ))}
            </div>

            {/* Career Information */}
            {selectedField !== null && careerFields[selectedField] && (
              <div className="mt-12 max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 relative">
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
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-[#007dae] mb-3">
                      {careerFields[selectedField].name}
                    </h2>
                    {careerFields[selectedField].description && (
                      <p className="text-gray-600 text-lg">
                        {careerFields[selectedField].description}
                      </p>
                    )}
                  </div>

                  {/* Professors Section */}
                  {careerFields[selectedField].professors && (
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">
                        Professors
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {careerFields[selectedField].professors.map(
                          (professor, index) => (
                            <span
                              key={index}
                              className="bg-[#e4e6ec] text-[#007dae] px-3 py-1 rounded-full text-sm font-medium"
                            >
                              {professor}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Companies Section */}
                  {careerFields[selectedField].companies && (
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">
                        Companies
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {careerFields[selectedField].companies.map(
                          (company, index) => (
                            <div
                              key={index}
                              className="bg-[#f8f9fa] p-3 rounded-lg border border-gray-200"
                            >
                              {company}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Skills Section */}
                  {careerFields[selectedField].skills && (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">
                        Relevant Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {careerFields[selectedField].skills.map(
                          (skill, index) => (
                            <span
                              key={index}
                              className="bg-[#007dae] text-white px-3 py-1 rounded-full text-sm font-medium"
                            >
                              {skill}
                            </span>
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
