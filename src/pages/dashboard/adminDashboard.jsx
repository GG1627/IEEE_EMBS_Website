import { useState, useEffect } from "react";
import StatsTab from "./statsTab";
import CreateEventTab from "./createEventTab";
import { gradientPresets } from "../../styles/ieeeColors";
import GradientMesh from "../../components/ui/GradientMesh";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("stats"); // Default to stats tab

  // Control body overflow based on active tab
  useEffect(() => {
    if (activeTab === "stats") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [activeTab]);

  const tabs = [
    {
      id: "stats",
      name: "Stats",
    },
    {
      id: "create-event",
      name: "Create Event",
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "stats":
        return <StatsTab />;
      case "create-event":
        return <CreateEventTab />;
      default:
        return <StatsTab />;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 z-0">
        <GradientMesh
          colors={gradientPresets.outreach}
          baseGradient="linear-gradient(to bottom, #c9faff, #f0f9ff, #f0f9ff)"
        />
      </div>

      {/* Tab Navigation */}
      <div className="relative z-10 bg-transparent sticky top-0 mt-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-0 text-lg font-medium transition-all duration-200 border-b-2 ${
                  activeTab === tab.id
                    ? "text-[#000000] border-[#000000]"
                    : "text-gray-500 border-gray-200 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 pt-0 relative z-10">{renderTabContent()}</div>
    </div>
  );
}
