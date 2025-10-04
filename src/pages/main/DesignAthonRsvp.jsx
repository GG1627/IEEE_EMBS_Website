import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { useAuth } from "../auth/AuthContext";
import { supabase } from "../../lib/supabase";
import Footer from "../../components/layout/Footer";
import { gradientPresets } from "../../styles/ieeeColors";
import GradientMesh from "../../components/ui/GradientMesh";

export default function DesignAthonRsvp() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    major: "",
    allergies: "",
    friends: "",
    skills: "",
    attendanceStatus: "",
  });

  // Auto-fill name and email from user profile
  useEffect(() => {
    if (user) {
      const fullName = `${user.user_metadata?.first_name || ""} ${
        user.user_metadata?.last_name || ""
      }`.trim();
      setFormData((prev) => ({
        ...prev,
        name: fullName,
        email: user.email || "",
      }));
    }
  }, [user]);

  // Check if user has already submitted an RSVP
  useEffect(() => {
    const checkExistingSubmission = async () => {
      if (!user) {
        setIsCheckingSubmission(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("hackathon_interest")
          .select("id")
          .eq("user_id", user.id)
          .single();

        if (error && error.code !== "PGRST116") {
          // PGRST116 = no rows found
          console.error("Error checking existing submission:", error);
        } else if (data) {
          setHasSubmitted(true);
        }
      } catch (error) {
        console.error("Error checking existing submission:", error);
      } finally {
        setIsCheckingSubmission(false);
      }
    };

    checkExistingSubmission();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle positive numbers only for friends field
    if (name === "friends" && value !== "") {
      const numValue = parseInt(value);
      if (numValue < 0 || isNaN(numValue)) {
        return; // Don't update if negative or not a number
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isCheckingSubmission, setIsCheckingSubmission] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const { data, error } = await supabase.from("hackathon_interest").insert([
        {
          user_id: user.id,
          email: formData.email,
          major: formData.major,
          allergies: formData.allergies,
          friends: parseInt(formData.friends) || 0,
          skills: formData.skills,
          attendance_status: formData.attendanceStatus,
        },
      ]);

      if (error) {
        throw error;
      }

      setSubmitMessage(
        "✅ RSVP submitted successfully! We'll send you event details soon."
      );
      setHasSubmitted(true);

      // Reset form
      setFormData({
        name: formData.name, // Keep auto-filled data
        email: formData.email, // Keep auto-filled data
        major: "",
        allergies: "",
        friends: "",
        skills: "",
        attendanceStatus: "",
      });
    } catch (error) {
      console.error("Error submitting RSVP:", error);
      setSubmitMessage("❌ Error submitting RSVP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Redirect to login if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#772583] mb-4">
            Login Required
          </h1>
          <p className="text-gray-600 mb-6">
            Please log in to RSVP for the Design-a-thon.
          </p>
          <Link
            to="/auth/login"
            className="bg-[#772583] hover:bg-[#9C1E96] text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // Show loading state while checking submission
  if (isCheckingSubmission) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#772583] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show thank you message if already submitted
  if (hasSubmitted) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Back Button */}
        <div className="pt-4 pl-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[#772583] hover:text-[#9C1E96] transition-colors duration-300 font-medium"
          >
            <IoArrowBack className="text-xl" />
            Back to Home
          </Link>
        </div>

        {/* Thank You Message */}
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white border border-gray-200 rounded-xl p-12 shadow-sm">
              <div className="w-12 h-12 bg-[#772583] rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-white text-xl">✓</span>
              </div>
              <h1 className="text-3xl font-bold text-[#772583] mb-4">
                Thank You!
              </h1>
              <p className="text-gray-600 text-lg mb-8">
                Your RSVP for the Design-a-thon has been submitted successfully.
                We'll send you event details and updates soon!
              </p>

              {/* Event Details - Minimal */}
              <div className="inline-flex items-center gap-6 text-sm text-gray-500 mb-8">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#772583] rounded-full"></span>
                  <span>
                    <strong>Date:</strong> November 11th
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#772583] rounded-full"></span>
                  <span>
                    <strong>Duration:</strong> 12 Hours
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#772583] rounded-full"></span>
                  <span>
                    <strong>Location:</strong> TBD
                  </span>
                </div>
              </div>

              <Link
                to="/"
                className="inline-block bg-[#772583] hover:bg-[#9C1E96] text-white px-8 py-3 rounded-lg font-medium transition-colors duration-300"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 z-0">
        <GradientMesh colors={gradientPresets.designathon} />
      </div>

      {/* Back Button */}
      <div className="pt-4 pl-4 relative z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[#772583] hover:text-[#9C1E96] transition-colors duration-300 font-medium"
        >
          <IoArrowBack className="text-xl" />
          Back to Home
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 py-8 px-4 relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#772583] mb-4">
              Design-a-thon RSVP
            </h1>
            <p className="text-gray-600 text-lg mb-4">
              Join us for an exciting 12-hour design challenge! Please fill out
              the form below to reserve your spot.
            </p>

            {/* Event Details - Minimal */}
            <div className="inline-flex items-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#772583] rounded-full"></span>
                <span>
                  <strong>Date:</strong> October 11th
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#772583] rounded-full"></span>
                <span>
                  <strong>Duration:</strong> 12 Hours
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#772583] rounded-full"></span>
                <span>
                  <strong>Location:</strong> TUR L011
                </span>
              </div>
            </div>
          </div>

          {/* RSVP Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl p-8 shadow-lg"
          >
            <div className="space-y-6">
              {/* Name - Auto-filled (Read-only) */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Full Name <span className="text-[#007dae]">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  readOnly
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  placeholder="Auto-filled from your profile"
                />
              </div>

              {/* Email - Auto-filled (Read-only) */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address <span className="text-[#007dae]">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  readOnly
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  placeholder="Auto-filled from your profile"
                />
              </div>

              {/* Major */}
              <div>
                <label
                  htmlFor="major"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Major/Field of Study <span className="text-[#007dae]">*</span>
                </label>
                <input
                  type="text"
                  id="major"
                  name="major"
                  value={formData.major}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Biomedical Engineering, Computer Science"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#772583] focus:border-transparent"
                />
              </div>

              {/* Allergies */}
              <div>
                <label
                  htmlFor="allergies"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Dietary Restrictions/Allergies{" "}
                  <span className="text-[#007dae]">*</span>
                </label>
                <input
                  type="text"
                  id="allergies"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Vegetarian, Nuts, Gluten-free, None"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#772583] focus:border-transparent"
                />
              </div>

              {/* Friends */}
              <div>
                <label
                  htmlFor="friends"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Number of Friends Attending (Optional)
                </label>
                <input
                  type="number"
                  id="friends"
                  name="friends"
                  value={formData.friends}
                  onChange={handleInputChange}
                  min="0"
                  placeholder="e.g., 2"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#772583] focus:border-transparent"
                />
              </div>

              {/* Skills */}
              <div>
                <label
                  htmlFor="skills"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Design/Technical Skills{" "}
                  <span className="text-[#007dae]">*</span>
                </label>
                <textarea
                  id="skills"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  placeholder="e.g., UI/UX Design, Python, Figma, Web Development, Data Analysis"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#772583] focus:border-transparent"
                />
              </div>

              {/* Attendance Confirmation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Can you attend the 12-hour Design-a-thon on November 11th?{" "}
                  <span className="text-[#007dae]">*</span>
                </label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="attendanceYes"
                      name="attendanceStatus"
                      value="yes"
                      checked={formData.attendanceStatus === "yes"}
                      onChange={handleInputChange}
                      required
                      className="h-4 w-4 text-[#772583] focus:ring-[#772583] border-gray-300"
                    />
                    <label
                      htmlFor="attendanceYes"
                      className="text-sm font-medium text-gray-700"
                    >
                      Yes, for sure! I can attend the full 12-hour event
                    </label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="attendanceQuestionable"
                      name="attendanceStatus"
                      value="questionable"
                      checked={formData.attendanceStatus === "questionable"}
                      onChange={handleInputChange}
                      required
                      className="h-4 w-4 text-[#772583] focus:ring-[#772583] border-gray-300"
                    />
                    <label
                      htmlFor="attendanceQuestionable"
                      className="text-sm font-medium text-gray-700"
                    >
                      Questionable - I might be able to attend
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Message */}
              {submitMessage && (
                <div
                  className={`p-4 rounded-lg text-center font-medium ${
                    submitMessage.includes("✅")
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {submitMessage}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full font-bold py-4 px-6 rounded-xl text-lg transition-colors duration-300 shadow-lg hover:shadow-xl ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#772583] hover:bg-[#9C1E96]"
                } text-white`}
              >
                {isSubmitting ? "Submitting..." : "Submit RSVP"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
