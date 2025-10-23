"use client";
import React, { useState } from 'react';

const TeamShowcase = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [hoveredMember, setHoveredMember] = useState<number | null>(null);
  
  const teamMembers = [
    {
      id: 1,
      name: "Aarav Sharma",
      role: "Founder & President",
      bio: "Environmental science student passionate about sustainable development.",
      image: "/images/team/team-1.jpg",
      department: "leadership"
    },
    {
      id: 2,
      name: "Priya Patel",
      role: "Eco-Education Director",
      bio: "Biology major focused on community outreach and environmental education.",
      image: "/images/team/team-2.jpg",
      department: "education"
    },
    {
      id: 3,
      name: "Rohan Gupta",
      role: "Conservation Lead",
      bio: "Wildlife biology student with expertise in habitat restoration.",
      image: "/images/team/team-3.jpg",
      department: "conservation"
    },
    {
      id: 4,
      name: "Ananya Reddy",
      role: "Community Outreach Coordinator",
      bio: "Social work student bridging communities and environmental action.",
      image: "/images/team/team-4.jpg",
      department: "outreach"
    },
    {
      id: 5,
      name: "Vikram Singh",
      role: "Research & Innovation Lead",
      bio: "Environmental engineering student developing sustainable solutions.",
      image: "/images/team/team-5.jpg",
      department: "research"
    },
    {
      id: 6,
      name: "Meera Krishnan",
      role: "Youth Engagement Director",
      bio: "Education major inspiring the next generation of environmentalists.",
      image: "/images/team/team-6.jpg",
      department: "education"
    }
  ];

  const departments = [
    { id: 'all', name: 'All Team' },
    { id: 'leadership', name: 'Leadership' },
    { id: 'education', name: 'Education' },
    { id: 'conservation', name: 'Conservation' },
    { id: 'outreach', name: 'Outreach' },
    { id: 'research', name: 'Research' }
  ];

  const filteredMembers = activeFilter === 'all' 
    ? teamMembers 
    : teamMembers.filter(member => member.department === activeFilter);

  return (
    <section className="py-16 relative">
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-4xl font-serif font-bold text-center text-gray-900 mb-4">Meet Our Team</h2>
        <p className="text-center text-gray-800 text-lg mb-12 max-w-2xl mx-auto">
          Dedicated individuals working together to create a sustainable future.
        </p>
        
        {/* Department Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {departments.map((dept) => (
            <button
              key={dept.id}
              className={`
                px-6 py-3 rounded-full text-base font-medium transition-all duration-300
                ${activeFilter === dept.id
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'bg-white/80 text-gray-800 hover:bg-white shadow'}
              `}
              onClick={() => setActiveFilter(dept.id)}
            >
              {dept.name}
            </button>
          ))}
        </div>
        
        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMembers.map((member, index) => (
            <div
              key={member.id}
              className={`
                bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg border border-white/50
                transition-all duration-500 transform
                ${hoveredMember === index ? 'scale-105 ring-2 ring-emerald-500/50' : 'hover:scale-[1.02]'}
              `}
              onMouseEnter={() => setHoveredMember(index)}
              onMouseLeave={() => setHoveredMember(null)}
            >
              <div className="relative">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white">{member.name}</h3>
                    <p className="text-emerald-200 font-medium">{member.role}</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-800">{member.bio}</p>
                <div className="mt-4 flex space-x-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                    <span className="text-emerald-700 text-sm">f</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                    <span className="text-emerald-700 text-sm">t</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                    <span className="text-emerald-700 text-sm">in</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamShowcase;