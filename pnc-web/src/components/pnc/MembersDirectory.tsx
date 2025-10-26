// src/components/pnc/MembersDirectory.tsx
'use client';

import { useState, useEffect } from 'react';
import pncDataService from '@/lib/pnc-data-service';

interface Member {
  id: string;
  properties: {
    [key: string]: any;
  };
}

export default function MembersDirectory() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const membersData = await pncDataService.getMembers();
        setMembers(membersData);
      } catch (err) {
        console.error('Error fetching members:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  // Filter members based on search term
  const filteredMembers = members.filter(member => {
    const fullName = member.properties['Full Name']?.title?.[0]?.plain_text || '';
    const email = member.properties['Student Educational Email']?.email || '';
    const role = member.properties.Role?.select?.name || '';
    const department = member.properties.Department?.select?.name || '';
    
    const searchLower = searchTerm.toLowerCase();
    
    return (
      fullName.toLowerCase().includes(searchLower) ||
      email.toLowerCase().includes(searchLower) ||
      role.toLowerCase().includes(searchLower) ||
      department.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-red-800 font-medium">Error loading members</h3>
        <p className="text-red-600 text-sm mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-emerald-100/50">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Members Directory</h2>
        
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search members by name, email, role, or department..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {filteredMembers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No members found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((member) => {
            const fullName = member.properties['Full Name']?.title?.[0]?.plain_text || 'N/A';
            const email = member.properties['Student Educational Email']?.email || 'N/A';
            const role = member.properties.Role?.select?.name || 'N/A';
            const department = member.properties.Department?.select?.name || 'N/A';
            const phone = member.properties['Phone Number']?.phone_number || 'N/A';
            const status = member.properties.Status?.status?.name || 'N/A';
            const skills = member.properties['High Pressure Skills']?.multi_select?.map((s: any) => s.name).join(', ') || 'N/A';
            
            return (
              <div 
                key={member.id} 
                className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <h3 className="font-bold text-lg text-gray-900">{fullName}</h3>
                <div className="mt-2 space-y-1 text-sm">
                  <p><span className="font-medium">Email:</span> {email}</p>
                  <p><span className="font-medium">Role:</span> {role}</p>
                  <p><span className="font-medium">Department:</span> {department}</p>
                  <p><span className="font-medium">Phone:</span> {phone}</p>
                  <p><span className="font-medium">Status:</span> {status}</p>
                  {skills !== 'N/A' && (
                    <p><span className="font-medium">Skills:</span> {skills}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}