// src/components/dashboard/admin/AdminDashboard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import DashboardAPIClient from '@/services/dashboardAPI';

interface DashboardSummary {
  total_members: number;
  active_members: number;
  members_with_tasks: number;
  active_percentage: number;
  engagement_rate: number;
  timestamp: string;
}

interface Member {
  id: string;
  properties: {
    [key: string]: any;
  };
}

const AdminDashboard: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [searchResults, setSearchResults] = useState<Member[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const apiClient = new DashboardAPIClient();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const summaryData = await apiClient.getDashboardSummary();
      if (summaryData.success && summaryData.summary) {
        setSummary(summaryData.summary);
      }
    } catch (err) {
      console.error('Error loading dashboard:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      try {
        setLoading(true);
        const results = await apiClient.searchMembers(searchQuery);
        if (results.success) {
          setSearchResults(results.members || []);
        } else {
          setSearchResults([]);
        }
      } catch (err) {
        console.error('Error searching members:', err);
        setError('Failed to search members');
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading && !summary) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage and track PNC member information</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
            <h3 className="text-lg font-medium text-gray-700">Total Members</h3>
            <p className="text-3xl font-bold text-emerald-600 mt-2">{summary.total_members}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
            <h3 className="text-lg font-medium text-gray-700">Active Members</h3>
            <p className="text-3xl font-bold text-emerald-600 mt-2">{summary.active_members}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
            <h3 className="text-lg font-medium text-gray-700">Active %</h3>
            <p className="text-3xl font-bold text-emerald-600 mt-2">{summary.active_percentage}%</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
            <h3 className="text-lg font-medium text-gray-700">Engagement Rate</h3>
            <p className="text-3xl font-bold text-emerald-600 mt-2">{summary.engagement_rate}%</p>
          </div>
        </div>
      )}

      {/* Search Members */}
      <div className="bg-white rounded-xl shadow border border-gray-100 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Search Members</h2>
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, department, or any other field..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className={`px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {searchResults.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Search Results ({searchResults.length})
            </h3>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {searchResults.map((member, index) => {
                    const properties = member.properties || {};
                    let name = 'Unknown';
                    let role = 'Unknown';
                    let department = 'Unknown';
                    let status = 'Unknown';
                    let year = 'Unknown';
                    
                    // Extract properties based on the actual field names
                    Object.entries(properties).forEach(([key, value]) => {
                      const keyLower = key.toLowerCase();
                      if (keyLower.includes('name') || keyLower === 'title') name = value;
                      if (keyLower.includes('role')) role = value;
                      if (keyLower.includes('department')) department = value;
                      if (keyLower.includes('status')) status = value;
                      if (keyLower.includes('year')) year = value;
                    });
                    
                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{role}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{department}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{year}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Breakdown */}
        <div className="bg-white rounded-xl shadow border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Department Breakdown</h2>
          <p className="text-gray-600 mb-4">Use the API to fetch department statistics</p>
          <button 
            onClick={async () => {
              try {
                setLoading(true);
                const stats = await apiClient.getMemberStatistics();
                if (stats.success && stats.statistics) {
                  alert(`Departments: ${Object.keys(stats.statistics.departments).join(', ')}`);
                }
              } catch (err) {
                console.error('Error fetching stats:', err);
                setError('Failed to fetch statistics');
              } finally {
                setLoading(false);
              }
            }}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Load Department Stats
          </button>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button 
              onClick={async () => {
                try {
                  setLoading(true);
                  const activeMembers = await apiClient.getActiveMembers();
                  setSearchResults(activeMembers.members || []);
                } catch (err) {
                  console.error('Error fetching active members:', err);
                  setError('Failed to fetch active members');
                } finally {
                  setLoading(false);
                }
              }}
              className="w-full text-left px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors"
            >
              Show Active Members
            </button>
            
            <button 
              onClick={async () => {
                try {
                  setLoading(true);
                  const researchMembers = await apiClient.getResearchMembers();
                  setSearchResults(researchMembers.members || []);
                } catch (err) {
                  console.error('Error fetching research members:', err);
                  setError('Failed to fetch research members');
                } finally {
                  setLoading(false);
                }
              }}
              className="w-full text-left px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Show Research Department
            </button>
            
            <button 
              onClick={async () => {
                try {
                  setLoading(true);
                  const year2526Members = await apiClient.getYear2526Members();
                  setSearchResults(year2526Members.members || []);
                } catch (err) {
                  console.error('Error fetching 25-26 members:', err);
                  setError('Failed to fetch 25-26 members');
                } finally {
                  setLoading(false);
                }
              }}
              className="w-full text-left px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
            >
              Show 25-26 Cohort
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;