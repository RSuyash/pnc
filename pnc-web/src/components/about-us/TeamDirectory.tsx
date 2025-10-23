"use client";
import React, { useState } from 'react';

const TeamDirectory = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [hoveredMember, setHoveredMember] = useState<number | null>(null);
  const [teamYear, setTeamYear] = useState<'all' | 'active' | 'inactive'>('all'); // all, active (25-26), inactive (24-25)
  
  // Team data including current and previous members
  const teamMembers = [
    // Current Executive Committee (25-26)
    {
      id: 1,
      name: "Soham Sonawane",
      role: "President",
      department: "Executive",
      email: "s12233050007@gmail.com",
      phone: "9833712026",
      interests: "Aquatic Ecosystems, Avian Ecology, Botany, Climate Science, Conservation Technology, Entomology, Environmental Policy, Herpetology",
      futureCareer: "Academic Research, Corporate Sustainability, Environmental Consultancy, Government Policy, Undecided",
      skills: "Data Analysis, GIS, Grant Writing, Leadership, Project Management, Public Speaking, Scientific Writing",
      status: "Active"
    },
    {
      id: 2,
      name: "Sharvari Tate",
      role: "Secretary",
      department: "Executive",
      email: "1332250378@mitwpu.edu.in",
      phone: "8767261835",
      interests: "Aquatic Ecosystems, Climate Science, Conservation Technology, Environmental Policy",
      futureCareer: "Corporate Sustainability, Environmental Consultancy, Government Policy",
      skills: "Data Analysis, GIS, Grant Writing, Leadership, Project Management, Public Speaking, Scientific Writing",
      status: "Active"
    },
    {
      id: 3,
      name: "Prajakta Jadhav",
      role: "Vice President",
      department: "Executive",
      email: "",
      phone: "",
      interests: "",
      futureCareer: "",
      skills: "",
      status: "Active"
    },
    {
      id: 4,
      name: "Suyash Rahegaonkar",
      role: "Treasurer",
      department: "Executive",
      email: "1332250296@mitwpu.edu.in",
      phone: "9665278779",
      interests: "Climate Science, Environmental Policy",
      futureCareer: "Academic Research, Corporate Sustainability, Environmental Consultancy, Government Policy, Science Communication",
      skills: "Data Analysis, GIS, Grant Writing, Leadership, Project Management, Public Speaking, Scientific Writing",
      status: "Active"
    },
    // Previous Team Members (24-25)
    {
      id: 5,
      name: "Anagha Purohit",
      role: "Former President",
      department: "Executive",
      email: "",
      phone: "",
      interests: "",
      futureCareer: "",
      skills: "",
      status: "Inactive"
    },
    {
      id: 6,
      name: "Jui Dicholkar",
      role: "Media Lead",
      department: "Media",
      email: "",
      phone: "",
      interests: "",
      futureCareer: "",
      skills: "",
      status: "Inactive"
    },
    {
      id: 7,
      name: "Priya Kadam",
      role: "Vice - President",
      department: "Executive",
      email: "",
      phone: "",
      interests: "",
      futureCareer: "",
      skills: "",
      status: "Inactive"
    },
    {
      id: 8,
      name: "Parth Borkar",
      role: "Treasurer",
      department: "Executive",
      email: "",
      phone: "",
      interests: "",
      futureCareer: "",
      skills: "",
      status: "Inactive"
    },
    {
      id: 9,
      name: "Saartha Kamble",
      role: "Secretary",
      department: "Executive",
      email: "",
      phone: "",
      interests: "",
      futureCareer: "",
      skills: "",
      status: "Inactive"
    },
    {
      id: 10,
      name: "Krishnandu Sarkar",
      role: "Research Lead",
      department: "Research",
      email: "",
      phone: "",
      interests: "",
      futureCareer: "",
      skills: "",
      status: "Inactive"
    },
    // Current Team Members (25-26)
    {
      id: 11,
      name: "Shreya Joshi",
      role: "Head",
      department: "Media",
      email: "1332250538@mitwpu.edu.in",
      phone: "9711674126",
      interests: "Climate Science, Conservation Technology",
      futureCareer: "Conservation Field Work, Corporate Sustainability, Environmental Consultancy",
      skills: "Leadership, Project Management",
      status: "Active"
    },
    {
      id: 12,
      name: "Arnav Ingle",
      role: "Member",
      department: "Media",
      email: "1332250630@mitwpu.edu.in",
      phone: "7769881026",
      interests: "Avian Ecology, Climate Science, Conservation Technology, Environmental Policy",
      futureCareer: "Environmental Consultancy",
      skills: "Data Analysis, GIS, Project Management",
      status: "Active"
    },
    {
      id: 13,
      name: "Jayashri Donne",
      role: "Member",
      department: "Media",
      email: "1332250127@mitwpu.edu.in",
      phone: "7498110899",
      interests: "Aquatic Ecosystems, Botany, Environmental Policy, Herpetology",
      futureCareer: "Undecided",
      skills: "Grant Writing, Project Management, Scientific Writing",
      status: "Active"
    },
    {
      id: 14,
      name: "Aditya Roy",
      role: "Head",
      department: "Research",
      email: "",
      phone: "",
      interests: "",
      futureCareer: "",
      skills: "",
      status: "Active"
    },
    {
      id: 15,
      name: "Chinmay Kadam",
      role: "Member",
      department: "Research",
      email: "",
      phone: "",
      interests: "",
      futureCareer: "",
      skills: "",
      status: "Active"
    }
  ];

  const departments = [
    { id: 'all', name: 'All Members' },
    { id: 'executive', name: 'Executive' },
    { id: 'media', name: 'Media' },
    { id: 'research', name: 'Research' }
  ];

  // Filter members based on team year and department
  let filteredMembers = teamMembers;
  
  // First filter by team year
  if (teamYear === 'active') {
    filteredMembers = filteredMembers.filter(member => member.status === 'Active');
  } else if (teamYear === 'inactive') {
    filteredMembers = filteredMembers.filter(member => member.status === 'Inactive');
  }
  
  // Then filter by department
  if (activeFilter !== 'all') {
    filteredMembers = filteredMembers.filter(member => 
      member.department.toLowerCase() === activeFilter.toLowerCase()
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-serif font-bold text-center text-gray-900 mb-4">Our Team</h2>
        <p className="text-center text-gray-800 text-lg mb-8 max-w-2xl mx-auto">
          Dedicated individuals working together to create a sustainable future.
        </p>
        
        {/* Team Year Toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white/80 rounded-xl p-1 shadow">
            <button
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                teamYear === 'all'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-gray-800 hover:bg-white'
              }`}
              onClick={() => setTeamYear('all')}
            >
              All Teams
            </button>
            <button
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                teamYear === 'active'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-gray-800 hover:bg-white'
              }`}
              onClick={() => setTeamYear('active')}
            >
              Current Team (25-26)
            </button>
            <button
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                teamYear === 'inactive'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-gray-800 hover:bg-white'
              }`}
              onClick={() => setTeamYear('inactive')}
            >
              Previous Team (24-25)
            </button>
          </div>
        </div>
        
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
                bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/50
                transition-all duration-500 transform
                ${hoveredMember === index ? 'scale-105 ring-2 ring-emerald-500/50' : 'hover:scale-[1.02]'}
              `}
              onMouseEnter={() => setHoveredMember(index)}
              onMouseLeave={() => setHoveredMember(null)}
            >
              <div className="flex items-center mb-4">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center">
                  {member.name === "Soham Sonawane" && member.status === "Active" && (
                    <img src="/images/team/soham.png" alt={member.name} className="rounded-xl w-full h-full object-cover" />
                  )}
                  {member.name === "Sharvari Tate" && member.status === "Active" && (
                    <img src="/images/team/sharvari.png" alt={member.name} className="rounded-xl w-full h-full object-cover" />
                  )}
                  {member.name === "Prajakta Jadhav" && member.status === "Active" && (
                    <img src="/images/team/prajakta.png" alt={member.name} className="rounded-xl w-full h-full object-cover" />
                  )}
                  {member.name === "Suyash Rahegaonkar" && member.status === "Active" && (
                    <img src="/images/team/suyash.png" alt={member.name} className="rounded-xl w-full h-full object-cover" />
                  )}
                  {member.name === "Anagha Purohit" && member.status === "Inactive" && (
                    <img src="/images/team/president_24-25.PNG" alt={member.name} className="rounded-xl w-full h-full object-cover" />
                  )}
                  {member.name === "Jui Dicholkar" && member.status === "Inactive" && (
                    <img src="/images/team/media_head_24-25.PNG" alt={member.name} className="rounded-xl w-full h-full object-cover" />
                  )}
                  {member.name === "Priya Kadam" && member.status === "Inactive" && (
                    <img src="/images/team/vice_president.PNG" alt={member.name} className="rounded-xl w-full h-full object-cover" />
                  )}
                  {member.name === "Parth Borkar" && member.status === "Inactive" && (
                    <img src="/images/team/treasurer_24_25.PNG" alt={member.name} className="rounded-xl w-full h-full object-cover" />
                  )}
                  {member.name === "Saartha Kamble" && member.status === "Inactive" && (
                    <img src="/images/team/secretary_24_25.PNG" alt={member.name} className="rounded-xl w-full h-full object-cover" />
                  )}
                  {member.name === "Krishnandu Sarkar" && member.status === "Inactive" && (
                    <img src="/images/team/research_head_24-25.PNG" alt={member.name} className="rounded-xl w-full h-full object-cover" />
                  )}
                  {member.name === "Shreya Joshi" && member.status === "Active" && (
                    <img src="/images/team/Media_head.png" alt={member.name} className="rounded-xl w-full h-full object-cover" />
                  )}
                  {member.name === "Aditya Roy" && member.status === "Active" && (
                    <img src="/images/team/Research_Head.png" alt={member.name} className="rounded-xl w-full h-full object-cover" />
                  )}
                  {!(member.name === "Soham Sonawane" || member.name === "Sharvari Tate" || member.name === "Prajakta Jadhav" || member.name === "Suyash Rahegaonkar" || member.name === "Anagha Purohit" || member.name === "Jui Dicholkar" || member.name === "Priya Kadam" || member.name === "Parth Borkar" || member.name === "Saartha Kamble" || member.name === "Krishnandu Sarkar" || member.name === "Shreya Joshi" || member.name === "Aditya Roy") && (
                    <span className="text-lg">👤</span>
                  )}
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                  <p className="text-emerald-700 font-medium">{member.role}</p>
                  <p className="text-sm text-gray-600">{member.department}</p>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                {member.email && (
                  <p className="text-sm text-gray-800 flex items-center">
                    <span className="mr-2">📧</span> {member.email}
                  </p>
                )}
                {member.phone && (
                  <p className="text-sm text-gray-800 flex items-center">
                    <span className="mr-2">📱</span> {member.phone}
                  </p>
                )}
              </div>
              
              {member.interests && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-900">Interests:</p>
                  <p className="text-sm text-gray-800">{member.interests}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamDirectory;