import { useState } from "react";
import Footer from "../../components/layout/Footer";

const fields = [
  {
    name: "Medical Imaging",
  },
  {
    name: "Signal Processing",
  },
  {
    name: "Medical Devices",
  },
  {
    name: "Neuroengineering",
  },
  {
    name: "AI & ML",
  },
  {
    name: "Bioinformatics & Genomics",
  },
  {
    name: "Digital Health & Wearables",
  },
  {
    name: "Healthcare Robotics",
  },
  {
    name: "Modeling & Simulation",
  },
  {
    name: "Cyber-BioSecurity",
  },
  {
    name: "Nano & Microtech",
  },
];

export default function Careers() {
  const [selectedField, setSelectedField] = useState(null);

  const handleFieldClick = (index) => {
    setSelectedField(selectedField === index ? null : index);
  };

  return (
    <>
      <div className="min-h-screen flex flex-col bg-white">
        <div className="flex-1 py-12">
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
              {fields.map((field, index) => (
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

            {/* Career List */}
            {selectedField !== null && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
                  {fields[selectedField].name} Careers
                </h2>
                {/* List */}
                <div className="flex flex-col gap-2 items-center text-lg">
                  <h1>Career 1</h1>
                  <h1>Career 2</h1>
                  <h1>Career 3</h1>
                  <h1>Career 4</h1>
                  <h1>Career 5</h1>
                  <h1>Career 6</h1>
                  <h1>Career 7</h1>
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
