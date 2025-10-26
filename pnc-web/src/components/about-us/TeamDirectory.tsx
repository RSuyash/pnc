"use client";
import React, { useState } from 'react';
import { TEAM_DATA, TeamMember } from '@/data/team';
import Image from 'next/image';

const TeamDirectory = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [hoveredMember, setHoveredMember] = useState<number | null>(null);
  const [teamYear, setTeamYear] = useState<'all' | 'active' | 'inactive'>('all'); // all, active (25-26), inactive (24-25)
  
  const teamMembers: TeamMember[] = TEAM_DATA;

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
    <section className="py-12 sm:py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-center text-gray-900 mb-3 sm:mb-4">Our Team</h2>
        <p className="text-center text-gray-800 text-base sm:text-lg mb-6 sm:mb-8 max-w-xl sm:max-w-2xl mx-auto">
          Dedicated individuals working together to create a sustainable future.
        </p>
        
        {/* Team Year Toggle */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="inline-flex bg-white/80 rounded-lg sm:rounded-xl p-1 shadow">
            <button
              className={`px-4 py-1.5 sm:px-5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${
                teamYear === 'all'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-gray-800 hover:bg-white'
              }`}
              onClick={() => setTeamYear('all')}
            >
              All Teams
            </button>
            <button
              className={`px-4 py-1.5 sm:px-5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${
                teamYear === 'active'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-gray-800 hover:bg-white'
              }`}
              onClick={() => setTeamYear('active')}
            >
              Current Team (25-26)
            </button>
            <button
              className={`px-4 py-1.5 sm:px-5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${
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
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
          {departments.map((dept) => (
            <button
              key={dept.id}
              className={`
                px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-sm sm:text-base font-medium transition-all duration-300
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
          {filteredMembers.map((member, index) => (
            <div
              key={member.id}
              className={`
                bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-lg border border-white/50
                transition-all duration-500 transform
                ${hoveredMember === index ? 'scale-105 ring-2 ring-emerald-500/50' : 'hover:scale-[1.02]'}
              `}
              onMouseEnter={() => setHoveredMember(index)}
              onMouseLeave={() => setHoveredMember(null)}
            >
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center">
                  {member.name === "Soham Sonawane" && member.status === "Active" && (
                    <Image 
                      src="/images/team/soham.png" 
                      alt={member.name} 
                      width={56} 
                      height={56} 
                      className="rounded-xl w-full h-full object-cover" 
                      priority={member.name === "Soham Sonawane"} 
                    />
                  )}
                  {member.name === "Sharvari Tate" && member.status === "Active" && (
                    <Image 
                      src="/images/team/sharvari.png" 
                      alt={member.name} 
                      width={56} 
                      height={56} 
                      className="rounded-xl w-full h-full object-cover" 
                      priority={member.name === "Sharvari Tate"} 
                    />
                  )}
                  {member.name === "Prajakta Jadhav" && member.status === "Active" && (
                    <Image 
                      src="/images/team/prajakta.png" 
                      alt={member.name} 
                      width={56} 
                      height={56} 
                      className="rounded-xl w-full h-full object-cover" 
                      priority={false}
                    />
                  )}
                  {member.name === "Suyash Rahegaonkar" && member.status === "Active" && (
                    <Image 
                      src="/images/team/suyash.png" 
                      alt={member.name} 
                      width={56} 
                      height={56} 
                      className="rounded-xl w-full h-full object-cover" 
                      priority={false}
                    />
                  )}
                  {member.name === "Anagha Purohit" && member.status === "Inactive" && (
                    <Image 
                      src="/images/team/president_24-25.PNG" 
                      alt={member.name} 
                      width={56} 
                      height={56} 
                      className="rounded-xl w-full h-full object-cover" 
                      priority={false}
                    />
                  )}
                  {member.name === "Jui Dicholkar" && member.status === "Inactive" && (
                    <Image 
                      src="/images/team/media_head_24-25.PNG" 
                      alt={member.name} 
                      width={56} 
                      height={56} 
                      className="rounded-xl w-full h-full object-cover" 
                      priority={false}
                    />
                  )}
                  {member.name === "Priya Kadam" && member.status === "Inactive" && (
                    <Image 
                      src="/images/team/vice_president.PNG" 
                      alt={member.name} 
                      width={56} 
                      height={56} 
                      className="rounded-xl w-full h-full object-cover" 
                      priority={false}
                    />
                  )}
                  {member.name === "Parth Borkar" && member.status === "Inactive" && (
                    <Image 
                      src="/images/team/treasurer_24_25.PNG" 
                      alt={member.name} 
                      width={56} 
                      height={56} 
                      className="rounded-xl w-full h-full object-cover" 
                      priority={false}
                    />
                  )}
                  {member.name === "Saartha Kamble" && member.status === "Inactive" && (
                    <Image 
                      src="/images/team/secretary_24-25.PNG" 
                      alt={member.name} 
                      width={56} 
                      height={56} 
                      className="rounded-xl w-full h-full object-cover" 
                      priority={false}
                    />
                  )}
                  {member.name === "Krishnandu Sarkar" && member.status === "Inactive" && (
                    <Image 
                      src="/images/team/research_head_24-25.PNG" 
                      alt={member.name} 
                      width={56} 
                      height={56} 
                      className="rounded-xl w-full h-full object-cover" 
                      priority={false}
                    />
                  )}
                  {member.name === "Shreya Joshi" && member.status === "Active" && (
                    <Image 
                      src="/images/team/Media_head.png" 
                      alt={member.name} 
                      width={56} 
                      height={56} 
                      className="rounded-xl w-full h-full object-cover" 
                      priority={false}
                    />
                  )}
                  {member.name === "Aditya Roy" && member.status === "Active" && (
                    <Image 
                      src="/images/team/Research_Head.png" 
                      alt={member.name} 
                      width={56} 
                      height={56} 
                      className="rounded-xl w-full h-full object-cover" 
                      priority={false}
                    />
                  )}
                  {!(member.name === "Soham Sonawane" || member.name === "Sharvari Tate" || member.name === "Prajakta Jadhav" || member.name === "Suyash Rahegaonkar" || member.name === "Anagha Purohit" || member.name === "Jui Dicholkar" || member.name === "Priya Kadam" || member.name === "Parth Borkar" || member.name === "Saartha Kamble" || member.name === "Krishnandu Sarkar" || member.name === "Shreya Joshi" || member.name === "Aditya Roy") && (
                    <span className="text-lg">👤</span>
                  )}
                </div>
                <div className="ml-3 sm:ml-4">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">{member.name}</h3>
                  <p className="text-emerald-700 font-medium text-sm sm:text-base">{member.role}</p>
                  <p className="text-xs sm:text-sm text-gray-600">{member.department}</p>
                </div>
              </div>
              
              <div className="mt-3 sm:mt-4 space-y-1.5 sm:space-y-2">
                {member.email && (
                  <p className="text-xs sm:text-sm text-gray-800 flex items-center">
                    <span className="mr-1 sm:mr-2">📧</span> {member.email}
                  </p>
                )}

              </div>
              

            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamDirectory;