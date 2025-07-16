import MemberCard from "../components/MemberCard";
import Navbar from "../components/Navbar";

// Next Step:
// 1. Add all the actual member of the organization
// 2. Add a hover effect where if you hover over the member card, it will show a popup with more information about the member

export default function Team() {
  // Sample team data - you can replace with real data later
  const teamMembers = [
    {
      name: "John Doe",
      position: "President",
      linkedin: "https://www.linkedin.com/",
    },
    {
      name: "Jane Smith",
      position: "Vice President",
      linkedin: "https://www.linkedin.com/",
    },
    {
      name: "Mike Johnson",
      position: "Secretary",
      linkedin: "https://www.linkedin.com/",
    },
    {
      name: "Sarah Wilson",
      position: "Treasurer",
      linkedin: "https://www.linkedin.com/",
    },
    {
      name: "Alex Brown",
      position: "Event Coordinator",
      linkedin: "https://www.linkedin.com/",
    },

    {
      name: "Emily Davis",
      position: "Tech Lead",
      linkedin: "https://www.linkedin.com/",
    },
    {
      name: "David Chen",
      position: "Marketing Director",
      linkedin: "https://www.linkedin.com/",
    },
    {
      name: "Lisa Garcia",
      position: "Research Head",
      linkedin: "https://www.linkedin.com/",
    },
    {
      name: "Tom Anderson",
      position: "Project Manager",
      linkedin: "https://www.linkedin.com/",
    },
    {
      name: "Maya Patel",
      position: "Outreach Officer",
      linkedin: "https://www.linkedin.com/",
    },

    {
      name: "James Liu",
      position: "Web Developer",
      linkedin: "https://www.linkedin.com/",
    },
    {
      name: "Rachel Kim",
      position: "Social Media",
      linkedin: "https://www.linkedin.com/",
    },
    {
      name: "Carlos Rodriguez",
      position: "Lab Coordinator",
      linkedin: "https://www.linkedin.com/",
    },
    {
      name: "Amanda Zhang",
      position: "Content Writer",
      linkedin: "https://www.linkedin.com/",
    },
    {
      name: "Kevin Taylor",
      position: "Event Assistant",
      linkedin: "https://www.linkedin.com/",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white pt-16 py-12">
        <div className="px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-4">
              Meet Our Team
            </h1>
          </div>

          {/* Team Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
            {teamMembers.map((member, index) => (
              <MemberCard
                key={index}
                name={member.name}
                position={member.position}
                linkedin={member.linkedin}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
