"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { TEAM_DATA, TeamMember } from '@/data/team';

type TeamYear = 'active' | 'inactive';

interface DepartmentShowcaseProps {
  teamYear?: TeamYear;
}

interface Department {
  name: string;
  description: string;
  members: TeamMember[];
}

const DepartmentShowcase: React.FC<DepartmentShowcaseProps> = ({ teamYear = 'active' }) => {
  const [activeTab, setActiveTab] = useState('media');
  
  // Filter members based on department
  const mediaMembers = TEAM_DATA.filter(member => member.department === 'Media');
  const researchMembers = TEAM_DATA.filter(member => member.department === 'Research');
  
  const departments: Record<string, Department> = {
    media: {
      name: "Media & Communications",
      description: "Responsible for content creation, visual storytelling, and community engagement across all platforms",
      members: mediaMembers
    },
    research: {
      name: "Research & Innovation",
      description: "Focuses on scientific inquiry and innovative solutions to advance our environmental mission",
      members: researchMembers
    }
  };

  // Filter members based on team year
  const filteredDepartments = { ...departments };
  if (teamYear === 'active') {
    Object.keys(filteredDepartments).forEach(deptKey => {
      filteredDepartments[deptKey].members = filteredDepartments[deptKey].members.filter(member => member.status === 'Active');
    });
  } else if (teamYear === 'inactive') {
    Object.keys(filteredDepartments).forEach(deptKey => {
      filteredDepartments[deptKey].members = filteredDepartments[deptKey].members.filter(member => member.status === 'Inactive');
    });
  }

  return (
    <section className="py-12 bg-gradient-to-b from-emerald-50/30 to-teal-50/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-3">
            Our Departments
          </h2>
          <p className="text-base md:text-lg text-gray-700 max-w-xl mx-auto">
            Each department focuses on specialized areas to advance our environmental mission
          </p>
        </div>
        
        {/* Department Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white/80 rounded-xl p-1 shadow-sm">
            <button
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeTab === 'media'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-gray-800 hover:bg-white'
              }`}
              onClick={() => setActiveTab('media')}
            >
              Media & Communications
            </button>
            <button
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeTab === 'research'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-gray-800 hover:bg-white'
              }`}
              onClick={() => setActiveTab('research')}
            >
              Research & Innovation
            </button>
          </div>
        </div>
        
        {/* Department Content */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
            <h3 className="text-xl font-bold text-gray-900 mb-3">{filteredDepartments[activeTab].name}</h3>
            <p className="text-gray-700 mb-6">{filteredDepartments[activeTab].description}</p>
            
            <div className="space-y-4">
              {filteredDepartments[activeTab].members.map((member) => (
                <div key={member.id} className="flex items-start p-4 bg-white/50 rounded-xl border border-white/50 hover:shadow-md transition-all duration-300">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12 flex items-center justify-center mr-4 flex-shrink-0">
                    {member.image ? (
                      <Image 
                        src={member.image} 
                        alt={member.name} 
                        width={48} 
                        height={48} 
                        className="rounded-xl w-full h-full object-cover" 
                        priority={false}
                      />
                    ) : (
                      <span className="text-lg">👥</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-bold text-gray-900 truncate">{member.name}</h4>
                    <p className="text-emerald-700 font-medium text-sm mb-1">{member.role}</p>
                    
                    <div className="flex flex-wrap gap-3 mt-2">
                      {member.email && (
                        <p className="text-xs text-gray-700 flex items-center truncate max-w-[120px]">
                          <span className="mr-1">📧</span> 
                          <span className="truncate">{member.email.split('@')[0]}...</span>
                        </p>
                      )}

                    </div>
                    
                    {member.interests && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-600 font-medium">Interests:</p>
                        <p className="text-xs text-gray-800">{member.interests}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DepartmentShowcase;