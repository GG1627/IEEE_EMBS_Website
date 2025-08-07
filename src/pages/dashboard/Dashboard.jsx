import { useAuth } from "../../pages/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "../../components/ui/Snackbar";
import { IoMdHeart } from "react-icons/io";
import { careerFields } from "../../data/careerFields";
import { supabase } from "../../lib/supabase";
import { useEffect, useState } from "react";

const sampleEvents = [
  "Workshop",
  "Conference",
  "Networking Session",
  "Skill-Building Event",
  "Career Fair Prep",
  "Webinar",
  "Hackathon",
  "Industry Talk",
];

const sampleCareers = [
  "Medical Imaging",
  "Signal Processing",
  "Medical Devices",
  "Neuroengineering",
  "AI & ML",
];

export default function Dashboard() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [favoriteFields, setFavoriteFields] = useState([]);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [userStats, setUserStats] = useState({ points: 0, eventsAttended: 0 });

  useEffect(() => {
    if (user) {
      fetchUserStats();
      fetchFavoriteFields();
    }
  }, [user]);

  const fetchUserStats = async () => {
    try {
      const { data, error } = await supabase
        .from("members")
        .select("points, events_attended")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;

      if (data) {
        setUserStats({
          points: data.points || 0,
          events_attended: data.events_attended || 0,
        });
      }
    } catch (error) {
      showSnackbar("Error fetching user stats: " + error.message, {
        customColor: "#b00000",
      });
    }
  };

  const fetchFavoriteFields = async () => {
    try {
      const { data, error } = await supabase
        .from("favorite_careers")
        .select("career_name")
        .eq("user_id", user.id);

      if (error) throw error;

      if (data) {
        const favoritesWithInfo = data
          .map((favorite) =>
            careerFields.find((field) => field.name === favorite.career_name)
          )
          .filter(Boolean);

        setFavoriteFields(favoritesWithInfo);
      }
    } catch (error) {
      showSnackbar("Error fetching favorite careers: " + error.message, {
        customColor: "#b00000",
      });
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        showSnackbar("Error logging out: " + error.message, {
          customColor: "#b00000",
        });
      } else {
        showSnackbar("Logged out successfully!", {
          customColor: "#009623",
        });
        navigate("/");
      }
    } catch (error) {
      showSnackbar("Error logging out. Please try again.", {
        customColor: "#b00000",
      });
    }
  };

  return (
    <>
      <div className="min-h-screen bg-white p-6 md:p-12">
        <div className="justify-center items-center flex-col flex mt-16">
          <div className="w-full max-w-7xl mb-8 px-4 md:px-0">
            <h1 className="text-2xl md:text-3xl font-bold text-[#009ca6] mb-2">
              Welcome to Your Dashboard
            </h1>
            <p className="text-gray-600 text-base md:text-lg">
              Track your points and progress with UF IEEE EMBS!
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-4 w-full max-w-7xl px-4 md:px-0">
            {/* Left column - 2/3 width */}
            <div className="flex flex-col gap-4 w-full md:w-2/3">
              {/* Top row - 2 boxes */}
              <div className="flex flex-row gap-4">
                <div className="flex flex-col gap-4 bg-[#c5ebec] border-2 border-[#87d7db] p-4 rounded-md w-1/2 h-34 md:h-52 items-center md:items-start">
                  <h1 className="text-[#009ca6] text-lg md:text-3xl font-bold uppercase text-center">
                    Points
                  </h1>
                  <h1 className="text-[#009ca6] text-[1.4rem] md:text-8xl font-bold">
                    {userStats.points.toLocaleString()}
                  </h1>
                  <div className="w-full h-1 bg-[#007377]"></div>
                </div>
                <div className="flex flex-col gap-2 md:gap-4 bg-[#c5ebec] border-2 border-[#87d7db] p-4 rounded-md w-1/2 h-34 md:h-52 items-center md:items-start">
                  <h1 className="text-[#009ca6] text-lg md:text-3xl font-bold uppercase text-center leading-none -mt-[0.4rem]">
                    Events Attended
                  </h1>
                  <h1 className="text-[#009ca6] text-[1.4rem] md:text-8xl font-bold mt-[0.38rem]">
                    {userStats.events_attended}
                  </h1>
                  <div className="w-full h-1 bg-[#007377] mt-2"></div>
                </div>
              </div>
              {/* Bottom box - full width of left column */}
              <div className="flex flex-col gap-4 bg-[#c5ebec] border-2 border-[#87d7db] p-4 rounded-md w-full h-90 items-start">
                <h1 className="text-[#009ca6] text-xl md:text-3xl font-bold uppercase">
                  Events
                </h1>
                {/* Events in a multi-column format with 6 events per column */}
                <div className="flex flex-col md:flex-row gap-4 w-full">
                  {Array.from({
                    length: Math.ceil(sampleEvents.length / 6),
                  }).map((_, colIndex) => (
                    <div key={colIndex} className="flex flex-col gap-2 flex-1">
                      {sampleEvents
                        .slice(colIndex * 6, (colIndex + 1) * 6)
                        .map((event, index) => (
                          <div key={index} className="mb-2 flex items-center">
                            <span className="text-[#009ca6] text-xl md:text-2xl mr-2">
                              •
                            </span>
                            <h1 className="text-[#009ca6] text-xl md:text-2xl font-semibold">
                              {event}
                            </h1>
                          </div>
                        ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column - 1/3 width */}
            <div className="flex flex-col gap-4 w-full md:w-1/3">
              {/* Top box */}
              <div
                className={`flex flex-col gap-4 bg-[#c5ebec] border-2 border-[#87d7db] p-4 rounded-md w-full items-start ${
                  selectedCareer ? "h-auto" : "h-90"
                }`}
              >
                <h1 className="text-[#009ca6] text-xl md:text-3xl font-bold uppercase">
                  Favorite Careers
                </h1>
                <div
                  className={`flex flex-col gap-2 w-full ${
                    !selectedCareer ? "overflow-y-auto" : ""
                  }`}
                >
                  {favoriteFields.length > 0 ? (
                    favoriteFields.map((career, index) => (
                      <div
                        key={index}
                        className={`flex items-center cursor-pointer hover:bg-[#b3e5e7] rounded-md p-2 transition-colors ${
                          selectedCareer?.name === career.name
                            ? "bg-[#b3e5e7]"
                            : ""
                        }`}
                        onClick={() =>
                          setSelectedCareer(
                            selectedCareer?.name === career.name ? null : career
                          )
                        }
                      >
                        <IoMdHeart className="text-[#007377] text-xl md:text-2xl mr-2" />
                        <h1 className="text-[#009ca6] text-xl md:text-2xl font-semibold">
                          {career.name}
                        </h1>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600 text-center text-lg py-4">
                      No favorite careers yet. Visit the Careers page to add
                      some!
                    </p>
                  )}
                </div>

                {/* Career Details Section */}
                {selectedCareer && (
                  <div className="mt-4 bg-white rounded-lg border border-[#87d7db] p-4 w-full">
                    {selectedCareer.description && (
                      <p className="text-gray-600 text-base mb-4">
                        {selectedCareer.description}
                      </p>
                    )}

                    {selectedCareer.professors &&
                      selectedCareer.professors.length > 0 && (
                        <div className="mb-4">
                          <h3 className="text-[#009ca6] font-semibold mb-2">
                            Professors
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedCareer.professors.map((professor, idx) => (
                              <span
                                key={idx}
                                className="bg-[#e4e6ec] text-[#007377] px-3 py-1 rounded-full text-sm"
                              >
                                {professor}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                    {selectedCareer.companies &&
                      selectedCareer.companies.length > 0 && (
                        <div className="mb-4">
                          <h3 className="text-[#009ca6] font-semibold mb-2">
                            Companies
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {selectedCareer.companies.map((company, idx) => (
                              <div
                                key={idx}
                                className="bg-[#f8f9fa] p-2 rounded-md text-sm"
                              >
                                {company}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {selectedCareer.skills &&
                      selectedCareer.skills.length > 0 && (
                        <div>
                          <h3 className="text-[#009ca6] font-semibold mb-2">
                            Required Skills
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedCareer.skills.map((skill, idx) => (
                              <span
                                key={idx}
                                className="bg-[#007377] text-white px-3 py-1 rounded-full text-sm"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                )}
              </div>
              {/* Bottom box */}
              <div className="flex flex-col gap-4 bg-[#c5ebec] border-2 border-[#87d7db] p-4 rounded-md w-full h-40 md:h-52 items-start">
                <h1 className="text-[#009ca6] text-xl md:text-3xl font-bold uppercase">
                  N/A
                </h1>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer mt-8 hover:bg-blue-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
