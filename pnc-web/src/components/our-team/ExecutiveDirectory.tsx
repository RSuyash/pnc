'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { TEAM_DATA, TeamMember } from '@/data/team';

type TeamYear = 'active' | 'inactive';

interface ExecutiveDirectoryProps {
  teamYear?: TeamYear;
  setTeamYear?: React.Dispatch<React.SetStateAction<TeamYear>>;
}

const ExecutiveDirectory: React.FC<ExecutiveDirectoryProps> = ({ teamYear = 'active', setTeamYear }) => {
  const [hoveredMember, setHoveredMember] = useState<number | null>(null);
  
  // Executive Committee members (current and previous)
  const executiveMembers: TeamMember[] = [
    // Current Executive Committee (25-26)
    {
      id: 1,
      name: "Soham Sonawane",
      role: "President",
      department: "Executive",
      email: "s12233050007@gmail.com",
      interests: "Aquatic Ecosystems, Avian Ecology, Botany, Climate Science, Conservation Technology, Entomology, Environmental Policy, Herpetology",
      futureCareer: "Academic Research, Corporate Sustainability, Environmental Consultancy, Government Policy, Undecided",
      skills: "Data Analysis, GIS, Grant Writing, Leadership, Project Management, Public Speaking, Scientific Writing",
      image: "/images/team/soham.png",
      status: "Active"
    },
    {
      id: 2,
      name: "Sharvari Tate",
      role: "Secretary",
      department: "Executive",
      email: "1332250378@mitwpu.edu.in",
      interests: "Aquatic Ecosystems, Climate Science, Conservation Technology, Environmental Policy",
      futureCareer: "Corporate Sustainability, Environmental Consultancy, Government Policy",
      skills: "Data Analysis, GIS, Grant Writing, Leadership, Project Management, Public Speaking, Scientific Writing",
      image: "/images/team/sharvari.png",
      status: "Active"
    },
    {
      id: 3,
      name: "Prajakta Jadhav",
      role: "Vice President",
      department: "Executive",
      email: "",
      interests: "",
      futureCareer: "",
      skills: "",
      image: "/images/team/prajakta.png",
      status: "Active"
    },
    {
      id: 4,
      name: "Suyash Rahegaonkar",
      role: "Treasurer",
      department: "Executive",
      email: "1332250296@mitwpu.edu.in",
      interests: "Climate Science, Environmental Policy",
      futureCareer: "Academic Research, Corporate Sustainability, Environmental Consultancy, Government Policy, Science Communication",
      skills: "Data Analysis, GIS, Grant Writing, Leadership, Project Management, Public Speaking, Scientific Writing",
      image: "/images/team/suyash.png",
      status: "Active"
    },
    // Previous Executive Team (24-25)
    {
      id: 5,
      name: "Anagha Purohit",
      role: "Former President",
      department: "Executive",
      email: "",
      interests: "",
      futureCareer: "",
      skills: "",
      image: "/images/team/president_24-25.PNG",
      status: "Inactive"
    },
    {
      id: 6,
      name: "Priya Kadam",
      role: "Vice - President",
      department: "Executive",
      email: "",
      interests: "",
      futureCareer: "",
      skills: "",
      image: "/images/team/vice_president.PNG",
      status: "Inactive"
    },
    {
      id: 7,
      name: "Parth Borkar",
      role: "Treasurer",
      department: "Executive",
      email: "",
      interests: "",
      futureCareer: "",
      skills: "",
      image: "/images/team/treasurer_24_25.PNG",
      status: "Inactive"
    },
    {
      id: 8,
      name: "Saartha Kamble",
      role: "Secretary",
      department: "Executive",
      email: "",
      interests: "",
      futureCareer: "",
      skills: "",
      image: "/images/team/secretary_24_25.PNG",
      status: "Inactive"
    }
  ];

  // Filter members based on team year
  let filteredMembers = executiveMembers;
  if (teamYear === 'active') {
    filteredMembers = filteredMembers.filter(member => member.status === 'Active');
  } else if (teamYear === 'inactive') {
    filteredMembers = filteredMembers.filter(member => member.status === 'Inactive');
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-3">
            Executive Committee
          </h2>
          <p className="text-base md:text-lg text-gray-700 max-w-xl mx-auto">
            Meet our leadership team who guide the strategic direction of Prithvi Nature Club
          </p>
        </div>
        
        {/* Team Year Toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white/80 rounded-lg p-1 shadow-sm">
            <button
              className={`px-4 py-2 rounded-md text-xs md:text-sm font-medium transition-all duration-300 ${
                teamYear === 'active'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-gray-800 hover:bg-white'
              }`}
              onClick={() => setTeamYear && setTeamYear('active')}
            >
              Current Team (25-26)
            </button>
            <button
              className={`px-4 py-2 rounded-md text-xs md:text-sm font-medium transition-all duration-300 ${
                teamYear === 'inactive'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-gray-800 hover:bg-white'
              }`}
              onClick={() => setTeamYear && setTeamYear('inactive')}
            >
              Previous Team (24-25)
            </button>
          </div>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredMembers.map((member, index) => (
              <div
                key={member.id}
                className={`
                  bg-gradient-to-br from-white to-emerald-50 rounded-xl p-4 shadow-md border border-emerald-100/50
                  transition-all duration-500 transform
                  ${hoveredMember === index ? 'scale-105 -translate-y-1 ring-2 ring-emerald-500/30 shadow-lg' : 'hover:scale-[1.02] hover:-translate-y-0.5'}
                `}
                onMouseEnter={() => setHoveredMember(index)}
                onMouseLeave={() => setHoveredMember(null)}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 mb-2 rounded-full overflow-hidden">
                    <Image
                      src={member.image}
                      alt={`${member.name} - ${member.role}`}
                      width={64}
                      height={64}
                      className="rounded-full object-cover w-full h-full"
                    />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 truncate w-full">{member.name}</h3>
                  <p className="text-emerald-700 font-medium text-xs">{member.role}</p>
                  <p className="text-gray-600 text-xs mb-1">{member.department}</p>
                  
                  {member.email && (
                    <p className="text-[0.6rem] text-gray-800 flex items-center justify-center truncate max-w-full">
                      <span className="mr-0.5">📧</span> {member.email.split('@')[0]}...
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExecutiveDirectory;