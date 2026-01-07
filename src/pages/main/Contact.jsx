import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useSnackbar } from "../../components/ui/Snackbar";
import SponsorshipPacketBook from "../../components/ui/SponsorshipPacketBook";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    anonymous: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSnackbar } = useSnackbar();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke("send-feedback", {
        body: formData,
      });

      if (error) {
        throw error;
      }

      if (data?.ok) {
        showSnackbar("Thank you for your feedback! We'll get back to you soon.", { severity: "success", customColor: "#772583" });
        // Reset form
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
          anonymous: false,
        });
      } else {
        throw new Error(data?.error || "Failed to send feedback");
      }
    } catch (error) {
      console.error("Error sending feedback:", error);
      showSnackbar("Failed to send feedback. Please try again later.", { severity: "error", customColor: "#b00000" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-gray-900 tracking-tight mb-3 md:mb-2">Get In Touch</h1>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-600 font-light leading-relaxed mb-2 max-w-3xl mx-auto px-4">
            Have questions, feedback, or interested in partnering with us? We're here to connect and collaborate!
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-stretch">
          {/* Feedback Form */}
          <div className="w-full md:w-1/2 bg-white rounded-2xl shadow-xl p-6 md:p-8 flex flex-col">
            <div className="mb-4 md:mb-6">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-gray-900 mb-3 md:mb-4">Share Your Feedback</h2>
              <p className="text-sm md:text-base text-gray-600 font-light leading-relaxed">
                Your thoughts help us improve and grow. Whether it's suggestions, bug reports, or general feedback, we appreciate hearing from you.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col flex-1 space-y-4 md:space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={formData.anonymous}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#772583] focus:border-transparent transition-all duration-200 ${
                    formData.anonymous ? "bg-gray-100 text-gray-500" : "bg-white"
                  }`}
                  placeholder="Your full name"
                  required={!formData.anonymous}
                />
              </div>

              {/* Anonymous Checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="anonymous"
                  name="anonymous"
                  checked={formData.anonymous}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-[#772583] focus:ring-[#772583] border-gray-300 rounded"
                />
                <label htmlFor="anonymous" className="ml-2 block text-sm text-gray-700">
                  Stay Anonymous
                </label>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={formData.anonymous}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#772583] focus:border-transparent transition-all duration-200 ${
                    formData.anonymous ? "bg-gray-100 text-gray-500" : "bg-white"
                  }`}
                  placeholder="your.email@ufl.edu"
                  required={!formData.anonymous}
                />
              </div>

              {/* Subject Field */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#772583] focus:border-transparent transition-all duration-200 bg-white"
                  placeholder="What's this about?"
                  required
                />
              </div>

              {/* Message Field */}
              <div className="flex flex-col flex-1">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="flex-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#772583] focus:border-transparent transition-all duration-200 bg-white resize-none min-h-[120px]"
                  placeholder="Tell us what's on your mind..."
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#772583] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#5a1c62] focus:ring-2 focus:ring-[#772583] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

          {/* Sponsorship Packet Section */}
          <div className="w-full md:w-1/2 bg-white rounded-2xl shadow-xl p-6 md:p-8 flex flex-col">
            <div className="text-center mb-6 md:mb-0">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-gray-900 mb-3 md:mb-4">
                Interested in Partnering?
              </h2>
              <p className="text-sm md:text-base text-gray-600 font-light leading-relaxed mb-0 md:mb-8 max-w-md mx-auto">
                Check out our sponsorship packet to learn about partnership opportunities with IEEE EMBS at UF.
              </p>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center max-h-[500px] md:max-h-none mb-6 md:mb-0">
              <div className="scale-65 md:scale-100">
                <SponsorshipPacketBook />
              </div>
            </div>
          </div>
        </div>

        {/* Additional Contact Information */}
        <div className="mt-8 md:mt-16 bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-gray-900 mb-6 md:mb-8 text-center">Other Ways to Connect</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-[#772583] rounded-full flex items-center justify-center mx-auto mb-3 md:mb-2">
                <svg className="w-7 h-7 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1">Email</h3>
              <p className="text-sm md:text-base text-gray-600">ieeeembsuf@gmail.com</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-[#772583] rounded-full flex items-center justify-center mx-auto mb-3 md:mb-2">
                <svg className="w-7 h-7 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1">Location</h3>
              <p className="text-sm md:text-base text-gray-600 leading-5.5">University of Florida<br />Gainesville, FL</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-[#772583] rounded-full flex items-center justify-center mx-auto mb-3 md:mb-2">
                <svg className="w-7 h-7 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1">Meetings</h3>
              <p className="text-sm md:text-base text-gray-600 leading-5.5">General Body Meetings<br />Check our events page!</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
