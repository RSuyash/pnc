// src/components/pnc/ProjectsList.tsx
'use client';

import { useState, useEffect } from 'react';
import pncDataService from '@/lib/pnc-data-service';

interface Project {
  id: string;
  properties: {
    [key: string]: any;
  };
}

export default function ProjectsList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const projectsData = await pncDataService.getProjects();
        setProjects(projectsData);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Filter projects based on search term and status
  const filteredProjects = projects.filter(project => {
    const projectName = project.properties['Project Name']?.title?.[0]?.plain_text || '';
    const goal = project.properties['Goal / Desired Outcome']?.rich_text?.[0]?.plain_text || '';
    const status = project.properties.Status?.select?.name || '';
    
    const matchesSearch = searchTerm === '' || 
      projectName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      goal.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const uniqueStatuses = Array.from(
    new Set(projects.map(p => p.properties.Status?.select?.name).filter(Boolean))
  );

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
        <h3 className="text-red-800 font-medium">Error loading projects</h3>
        <p className="text-red-600 text-sm mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-emerald-100/50">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Projects</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Search projects by name or goal..."
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <select
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            {uniqueStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>
      
      {filteredProjects.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No projects found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => {
            const projectName = project.properties['Project Name']?.title?.[0]?.plain_text || 'N/A';
            const goal = project.properties['Goal / Desired Outcome']?.rich_text?.[0]?.plain_text || 'N/A';
            const status = project.properties.Status?.select?.name || 'N/A';
            const progress = project.properties.Progress?.number || 0;
            const budget = project.properties.Budget?.number || 0;
            const timeline = project.properties.Timeline?.date?.start || 'N/A';
            const priority = project.properties.Priority?.select?.name || 'N/A';
            
            return (
              <div 
                key={project.id} 
                className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg text-gray-900">{projectName}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    status === 'Completed' ? 'bg-green-100 text-green-800' :
                    status === 'Active' ? 'bg-blue-100 text-blue-800' :
                    status === 'On Hold' ? 'bg-yellow-100 text-yellow-800' :
                    status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {status}
                  </span>
                </div>
                
                <div className="mt-2 space-y-1 text-sm">
                  <p className="font-medium">Goal:</p>
                  <p className="text-gray-700">{goal}</p>
                  
                  {progress !== 0 && (
                    <p>
                      <span className="font-medium">Progress:</span> {progress}%
                    </p>
                  )}
                  
                  {budget !== 0 && (
                    <p>
                      <span className="font-medium">Budget:</span> ${budget}
                    </p>
                  )}
                  
                  {timeline !== 'N/A' && (
                    <p>
                      <span className="font-medium">Timeline:</span> {timeline}
                    </p>
                  )}
                  
                  {priority !== 'N/A' && (
                    <p>
                      <span className="font-medium">Priority:</span> {priority}
                    </p>
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