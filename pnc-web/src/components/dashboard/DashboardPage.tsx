'use client';
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/common/DashboardLayout';
import DashboardCard from '@/components/dashboard/common/DashboardCard';
import { useAuth } from '@/contexts/AuthContext';
import { UsersIcon, ActivityIcon, ChartIcon, CalendarIcon, AwardIcon, ClockIcon, CheckCircleIcon, StarIcon, ShieldIcon, BriefcaseIcon } from '@/components/dashboard/common/DashboardCard';
import DashboardAPIClient from '@/services/dashboardAPI';

// Define user roles
type UserRole = 'visitor' | 'member' | 'volunteer' | 'department_head' | 'executive_committee' | 'admin' | 'partner';

// Mock user data
const mockUserData = {
  name: "Alex Johnson",
  email: "alex@example.com",
  role: 'member' as UserRole,
  department: "Conservation",
  joinDate: "2024-01-15",
  points: 1250,
  badges: 5,
  nextEvent: "Tree Planting Drive",
  nextEventDate: "2024-11-05",
};

// Role-specific dashboard content
const RoleDashboard: React.FC<{ role: UserRole }> = ({ role }) => {
  switch(role) {
    case 'admin':
      return <AdminDashboard />;
    case 'executive_committee':
      return <ECDashboard />;
    case 'department_head':
      return <HeadDashboard />;
    case 'volunteer':
      return <VolunteerDashboard />;
    case 'member':
      return <MemberDashboard />;
    case 'partner':
      return <PartnerDashboard />;
    default:
      return <VisitorDashboard />;
  }
};

// Dashboard components for each role
const AdminDashboard: React.FC = () => {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { user } = useAuth();
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
      }
    }
  };

  if (loading && !summary) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Admin-specific banner */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-start">
            <div className="mr-4 mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold">System Administrator Dashboard</h1>
              <p className="text-emerald-100 mt-2">Full system access and administrative controls</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard title="Total Members" value={summary.total_members.toString()} change="" icon={<UsersIcon />} />
          <DashboardCard title="Active Members" value={summary.active_members.toString()} change="" icon={<ActivityIcon />} />
          <DashboardCard title="Active %" value={`${summary.active_percentage}%`} change="" icon={<ChartIcon />} />
          <DashboardCard title="Engagement Rate" value={`${summary.engagement_rate}%`} change="" icon={<ShieldIcon />} />
        </div>
      )}
      
      {/* Profile Section */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                <span className="text-xl font-bold text-emerald-700">
                  {user.full_name?.charAt(0) || 'U'}
                </span>
              </div>
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-bold text-gray-900">{user.full_name}</h2>
              <div className="mt-1 flex flex-wrap gap-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                  user.role === 'member' ? 'bg-blue-100 text-blue-800' :
                  user.role === 'volunteer' ? 'bg-amber-100 text-amber-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.status === 'active' ? 'bg-green-100 text-green-800' :
                  user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={user.full_name}
                readOnly
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 focus:ring-emerald-500 focus:border-emerald-500 cursor-not-allowed text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={user.email}
                readOnly
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 focus:ring-emerald-500 focus:border-emerald-500 cursor-not-allowed text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <input
                type="text"
                value={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                readOnly
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 focus:ring-emerald-500 focus:border-emerald-500 cursor-not-allowed text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <input
                type="text"
                value={user.department || 'Not specified'}
                readOnly
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 focus:ring-emerald-500 focus:border-emerald-500 cursor-not-allowed text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <input
                type="text"
                value={user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                readOnly
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 focus:ring-emerald-500 focus:border-emerald-500 cursor-not-allowed text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <input
                type="text"
                value={user.year || 'Not specified'}
                readOnly
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 focus:ring-emerald-500 focus:border-emerald-500 cursor-not-allowed text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
              <input
                type="text"
                value={new Date(user.created_at).toLocaleDateString()}
                readOnly
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 focus:ring-emerald-500 focus:border-emerald-500 cursor-not-allowed text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Login</label>
              <input
                type="text"
                value={user.last_login ? new Date(user.last_login).toLocaleString() : 'Never'}
                readOnly
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 focus:ring-emerald-500 focus:border-emerald-500 cursor-not-allowed text-sm"
              />
            </div>
          </div>

          <div className="mt-6">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-4 w-4 text-green-500">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-2">
                  <p className="text-xs font-medium text-gray-900">
                    {user.email_verified ? 'Email Verified' : 'Email Not Verified'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Search Members */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-emerald-100 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Search Members</h2>
        <form onSubmit={handleSearch} className="flex gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search members by name, department, etc..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Search
          </button>
        </form>

        {searchResults.length > 0 && (
          <div>
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
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {searchResults.map((member, index) => {
                    const properties = member.properties || {};
                    let name = 'Unknown';
                    let role = 'Unknown';
                    let department = 'Unknown';
                    let status = 'Unknown';
                    
                    // Extract properties based on the actual field names
                    Object.entries(properties).forEach(([key, value]) => {
                      const keyLower = key.toLowerCase();
                      if (keyLower.includes('name') || keyLower === 'title') name = String(value);
                      if (keyLower.includes('role')) role = String(value);
                      if (keyLower.includes('department')) department = String(value);
                      if (keyLower.includes('status')) status = String(value);
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
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border border-emerald-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">User Management</h2>
          <div className="space-y-4">
            <DashboardAction 
              title="Manage Users" 
              description="Add, edit, or remove users from the system" 
              action="Manage"
            />
            <DashboardAction 
              title="Role Assignments" 
              description="Assign or modify user roles and permissions" 
              action="Assign"
            />
            <DashboardAction 
              title="User Reports" 
              description="Generate reports on user activity and engagement" 
              action="Generate"
            />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 border border-emerald-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">System Administration</h2>
          <div className="space-y-4">
            <DashboardAction 
              title="Database Health" 
              description="Monitor database performance and integrity" 
              action="Check"
            />
            <DashboardAction 
              title="Security Logs" 
              description="Review system security events" 
              action="Review"
            />
            <DashboardAction 
              title="System Backup" 
              description="Manage system backups and recovery" 
              action="Manage"
            />
          </div>
        </div>
      </div>
      
      {/* Admin Special Features Section */}
      <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200 mb-8">
        <div className="flex items-center mb-4">
          <div className="bg-amber-100 p-2 rounded-lg mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-amber-800">Administrator Special Features</h2>
        </div>
        <p className="text-amber-700 mb-4">Access exclusive admin tools and settings</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-amber-200">
            <h3 className="font-bold text-amber-800 mb-2">Notion Integration</h3>
            <p className="text-sm text-amber-600">Manage Notion database connections</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-amber-200">
            <h3 className="font-bold text-amber-800 mb-2">Content Moderation</h3>
            <p className="text-sm text-amber-600">Review and approve content</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-amber-200">
            <h3 className="font-bold text-amber-800 mb-2">System Analytics</h3>
            <p className="text-sm text-amber-600">View detailed usage analytics</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ECDashboard: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900">Executive Committee Dashboard</h1>
        <p className="text-gray-600">Strategic oversight and high-level management</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <DashboardCard title="Total Members" value="842" change="+15%" icon={<UsersIcon />} />
        <DashboardCard title="Active Volunteers" value="126" change="+8%" icon={<ActivityIcon />} />
        <DashboardCard title="Ongoing Projects" value="18" change="+2" icon={<ChartIcon />} />
      </div>
      
      {/* Profile Section */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                <span className="text-xl font-bold text-emerald-700">
                  {user.full_name?.charAt(0) || 'U'}
                </span>
              </div>
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-bold text-gray-900">{user.full_name}</h2>
              <div className="mt-1 flex flex-wrap gap-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                  user.role === 'member' ? 'bg-blue-100 text-blue-800' :
                  user.role === 'volunteer' ? 'bg-amber-100 text-amber-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.status === 'active' ? 'bg-green-100 text-green-800' :
                  user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={user.full_name}
                readOnly
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 focus:ring-emerald-500 focus:border-emerald-500 cursor-not-allowed text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={user.email}
                readOnly
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 focus:ring-emerald-500 focus:border-emerald-500 cursor-not-allowed text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <input
                type="text"
                value={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                readOnly
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 focus:ring-emerald-500 focus:border-emerald-500 cursor-not-allowed text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <input
                type="text"
                value={user.department || 'Not specified'}
                readOnly
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 focus:ring-emerald-500 focus:border-emerald-500 cursor-not-allowed text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <input
                type="text"
                value={user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                readOnly
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 focus:ring-emerald-500 focus:border-emerald-500 cursor-not-allowed text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <input
                type="text"
                value={user.year || 'Not specified'}
                readOnly
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 focus:ring-emerald-500 focus:border-emerald-500 cursor-not-allowed text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
              <input
                type="text"
                value={new Date(user.created_at).toLocaleDateString()}
                readOnly
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 focus:ring-emerald-500 focus:border-emerald-500 cursor-not-allowed text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Login</label>
              <input
                type="text"
                value={user.last_login ? new Date(user.last_login).toLocaleString() : 'Never'}
                readOnly
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 focus:ring-emerald-500 focus:border-emerald-500 cursor-not-allowed text-sm"
              />
            </div>
          </div>

          <div className="mt-6">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-4 w-4 text-green-500">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-2">
                  <p className="text-xs font-medium text-gray-900">
                    {user.email_verified ? 'Email Verified' : 'Email Not Verified'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-emerald-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Executive Actions</h2>
          <div className="space-y-4">
            <DashboardAction 
              title="Review Proposals" 
              description="Review and approve new project proposals" 
              action="Review"
            />
            <DashboardAction 
              title="Budget Allocation" 
              description="Manage and allocate budget for projects" 
              action="Allocate"
            />
            <DashboardAction 
              title="Department Reports" 
              description="Review reports from all departments" 
              action="View"
            />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 border border-emerald-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Strategic Overview</h2>
          <div className="space-y-4">
            <DashboardAction 
              title="Strategic Planning" 
              description="Plan long-term strategy for the club" 
              action="Plan"
            />
            <DashboardAction 
              title="Partnership Review" 
              description="Review and update partnership agreements" 
              action="Review"
            />
            <DashboardAction 
              title="Policy Updates" 
              description="Update club policies and procedures" 
              action="Update"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const HeadDashboard: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900">Department Head Dashboard</h1>
        <p className="text-gray-600">Department-specific management and reporting</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <DashboardCard title="Team Members" value="36" change="+5%" icon={<UsersIcon />} />
        <DashboardCard title="Active Projects" value="7" change="+1" icon={<ActivityIcon />} />
        <DashboardCard title="Completion Rate" value="87%" change="+3%" icon={<ChartIcon />} />
      </div>
      
      {/* Profile Section */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                <span className="text-xl font-bold text-emerald-700">
                  {user.full_name?.charAt(0) || 'U'}
                </span>
              </div>
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-bold text-gray-900">{user.full_name}</h2>
              <div className="mt-1 flex flex-wrap gap-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                  user.role === 'member' ? 'bg-blue-100 text-blue-800' :
                  user.role === 'volunteer' ? 'bg-amber-100 text-amber-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.status === 'active' ? 'bg-green-100 text-green-800' :
                  user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={user.full_name}
                readOnly
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 focus:ring-emerald-500 focus:border-emerald-500 cursor-not-allowed text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={user.email}
                readOnly
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 focus:ring-emerald-500 focus:border-emerald-500 cursor-not-allowed text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <input
                type="text"
                value={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                readOnly
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 focus:ring-emerald-500 focus:border-emerald-500 cursor-not-allowed text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <input
                type="text"
                value={user.department || 'Not specified'}
                readOnly
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 focus:ring-emerald-500 focus:border-emerald-500 cursor-not-allowed text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <input
                type="text"
                value={user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                readOnly
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 focus:ring-emerald-500 focus:border-emerald-500 cursor-not-allowed text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <input
                type="text"
                value={user.year || 'Not specified'}
                readOnly
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 focus:ring-emerald-500 focus:border-emerald-500 cursor-not-allowed text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
              <input
                type="text"
                value={new Date(user.created_at).toLocaleDateString()}
                readOnly
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 focus:ring-emerald-500 focus:border-emerald-500 cursor-not-allowed text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Login</label>
              <input
                type="text"
                value={user.last_login ? new Date(user.last_login).toLocaleString() : 'Never'}
                readOnly
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 focus:ring-emerald-500 focus:border-emerald-500 cursor-not-allowed text-sm"
              />
            </div>
          </div>

          <div className="mt-6">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-4 w-4 text-green-500">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-2">
                  <p className="text-xs font-medium text-gray-900">
                    {user.email_verified ? 'Email Verified' : 'Email Not Verified'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-emerald-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Department Management</h2>
          <div className="space-y-4">
            <DashboardAction 
              title="Team Assignments" 
              description="Assign tasks to team members" 
              action="Assign"
            />
            <DashboardAction 
              title="Progress Tracking" 
              description="Monitor project progress" 
              action="Track"
            />
            <DashboardAction 
              title="Resource Allocation" 
              description="Manage department resources" 
              action="Allocate"
            />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 border border-emerald-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Reporting</h2>
          <div className="space-y-4">
            <DashboardAction 
              title="Weekly Reports" 
              description="Generate weekly department reports" 
              action="Generate"
            />
            <DashboardAction 
              title="Budget Tracking" 
              description="Monitor departmental budget" 
              action="Track"
            />
            <DashboardAction 
              title="Performance Metrics" 
              description="View performance metrics" 
              action="View"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const MemberDashboard: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900">Member Dashboard</h1>
        <p className="text-gray-600">Your personal activities and achievements</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard title="Points Earned" value="0" change="+120" icon={<StarIcon />} />
        <DashboardCard title="Badges" value="0" change="+1" icon={<AwardIcon />} />
        <DashboardCard title="Events Attended" value="18" change="+2" icon={<CalendarIcon />} />
        <DashboardCard title="Projects Contributed" value="7" change="+1" icon={<ActivityIcon />} />
      </div>
      
      {/* Profile Section */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                <span className="text-xl font-bold text-emerald-700">
                  {user.full_name?.charAt(0) || 'U'}
                </span>
              </div>
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-bold text-gray-900">{user.full_name}</h2>
              <div className="mt-1 flex flex-wrap gap-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                  user.role === 'member' ? 'bg-blue-100 text-blue-800' :
                  user.role === 'volunteer' ? 'bg-amber-100 text-amber-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.status === 'active' ? 'bg-green-100 text-green-800' :
                  user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={user.full_name}
                readOnly
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 focus:ring-emerald-500 focus:border-emerald-500 cursor-not-allowed text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={user.email}
                readOnly
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 focus:ring-emerald-500 focus:border-emerald-500 cursor-not-allowed text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <input
                type="text"
                value={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                readOnly
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 focus:ring-emerald-500 focus:border-emerald-500 cursor-not-allowed text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <input
                type="text"
                value={user.department || 'Not specified'}
                readOnly
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 focus:ring-emerald-500 focus:border-emerald-500 cursor-not-allowed text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <input
                type="text"
                value={user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                readOnly
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 focus:ring-emerald-500 focus:border-emerald-500 cursor-not-allowed text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <input
                type="text"
                value={user.year || 'Not specified'}
                readOnly
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 focus:ring-emerald-500 focus:border-emerald-500 cursor-not-allowed text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
              <input
                type="text"
                value={new Date(user.created_at).toLocaleDateString()}
                readOnly
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 focus:ring-emerald-500 focus:border-emerald-500 cursor-not-allowed text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Login</label>
              <input
                type="text"
                value={user.last_login ? new Date(user.last_login).toLocaleString() : 'Never'}
                readOnly
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 focus:ring-emerald-500 focus:border-emerald-500 cursor-not-allowed text-sm"
              />
            </div>
          </div>

          <div className="mt-6">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-4 w-4 text-green-500">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-2">
                  <p className="text-xs font-medium text-gray-900">
                    {user.email_verified ? 'Email Verified' : 'Email Not Verified'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-emerald-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Your Activities</h2>
          <div className="space-y-4">
            <DashboardAction 
              title="Upcoming Events" 
              description="Next event: None scheduled on Not set" 
              action="View"
            />
            <DashboardAction 
              title="Volunteer Opportunities" 
              description="Browse available volunteer opportunities" 
              action="Browse"
            />
            <DashboardAction 
              title="Submit Feedback" 
              description="Share feedback on recent events" 
              action="Submit"
            />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 border border-emerald-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Your Profile</h2>
          <div className="space-y-4">
            <DashboardAction 
              title="Update Profile" 
              description="Update your personal information" 
              action="Update"
            />
            <DashboardAction 
              title="View Certificates" 
              description="View and download earned certificates" 
              action="View"
            />
            <DashboardAction 
              title="Preferences" 
              description="Manage your preferences and notifications" 
              action="Manage"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const VolunteerDashboard: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900">Volunteer Dashboard</h1>
        <p className="text-gray-600">Your volunteer activities and recognition</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <DashboardCard title="Hours Volunteered" value="126" change="+12" icon={<ClockIcon />} />
        <DashboardCard title="Completed Tasks" value="24" change="+3" icon={<CheckCircleIcon />} />
        <DashboardCard title="Events Participated" value="12" change="+2" icon={<CalendarIcon />} />
      </div>
      
      {/* Profile Section */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                <span className="text-xl font-bold text-emerald-700">
                  {user.full_name?.charAt(0) || 'U'}
                </span>
              </div>
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-bold text-gray-900">{user.full_name}</h2>
              <div className="mt-1 flex flex-wrap gap-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                  user.role === 'member' ? 'bg-blue-100 text-blue-800' :
                  user.role === 'volunteer' ? 'bg-amber-100 text-amber-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.status === 'active' ? 'bg-green-100 text-green-800' :
                  user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={user.full_name}
                readOnly
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 focus:ring-emerald-500 focus:border-emerald-500 cursor-not-allowed text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={user.email}
                readOnly
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 focus:ring-emerald-500 focus:border-emerald-500 cursor-not-allowed text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <input
                type="text"
                value={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                readOnly
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 focus:ring-emerald-500 focus:border-emerald-500 cursor-not-allowed text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <input
                type="text"
                value={user.department || 'Not specified'}
                readOnly
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 focus:ring-emerald-500 focus:border-emerald-500 cursor-not-allowed text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <input
                type="text"
                value={user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                readOnly
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 focus:ring-emerald-500 focus:border-emerald-500 cursor-not-allowed text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <input
                type="text"
                value={user.year || 'Not specified'}
                readOnly
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 focus:ring-emerald-500 focus:border-emerald-500 cursor-not-allowed text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
              <input
                type="text"
                value={new Date(user.created_at).toLocaleDateString()}
                readOnly
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 focus:ring-emerald-500 focus:border-emerald-500 cursor-not-allowed text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Login</label>
              <input
                type="text"
                value={user.last_login ? new Date(user.last_login).toLocaleString() : 'Never'}
                readOnly
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 focus:ring-emerald-500 focus:border-emerald-500 cursor-not-allowed text-sm"
              />
            </div>
          </div>

          <div className="mt-6">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-4 w-4 text-green-500">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-2">
                  <p className="text-xs font-medium text-gray-900">
                    {user.email_verified ? 'Email Verified' : 'Email Not Verified'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-emerald-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Available Opportunities</h2>
          <div className="space-y-4">
            <DashboardAction 
              title="Upcoming Drives" 
              description="Tree planting, clean-up, awareness" 
              action="View"
            />
            <DashboardAction 
              title="Skill-Based Tasks" 
              description="Tasks matching your skills" 
              action="Browse"
            />
            <DashboardAction 
              title="Event Calendar" 
              description="View all upcoming events" 
              action="View"
            />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 border border-emerald-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recognition</h2>
          <div className="space-y-4">
            <DashboardAction 
            title="Volunteer Certificates" 
            description="Download your certificates" 
            action="Download"
          />
          <DashboardAction 
            title="Leaderboard" 
            description="See how you rank among volunteers" 
            action="View"
          />
          <DashboardAction 
            title="Impact Report" 
            description="View your environmental impact" 
            action="Generate"
          />
        </div>
      </div>
    </div>
  </div>
  );
};

const PartnerDashboard: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900">Partner Dashboard</h1>
        <p className="text-gray-600">Partnership tools and collaboration resources</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <DashboardCard title="Partnership Status" value="Active" change="Premium" icon={<ShieldIcon />} />
        <DashboardCard title="Projects Collaborated" value="12" change="+3" icon={<BriefcaseIcon />} />
        <DashboardCard title="Events Hosted" value="5" change="+1" icon={<CalendarIcon />} />
      </div>
      
      {/* Profile Section */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                <span className="text-xl font-bold text-emerald-700">
                  {user.full_name?.charAt(0) || 'U'}
                </span>
              </div>
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-bold text-gray-900">{user.full_name}</h2>
              <div className="mt-1 flex flex-wrap gap-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                  user.role === 'member' ? 'bg-blue-100 text-blue-800' :
                  user.role === 'volunteer' ? 'bg-amber-100 text-amber-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.status === 'active' ? 'bg-green-100 text-green-800' :
                  user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={user.full_name}
                readOnly
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 focus:ring-emerald-500 focus:border-emerald-500 cursor-not-allowed text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={user.email}
                readOnly
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 focus:ring-emerald-500 focus:border-emerald-500 cursor-not-allowed text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <input
                type="text"
                value={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                readOnly
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 focus:ring-emerald-500 focus:border-emerald-500 cursor-not-allowed text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <input
                type="text"
                value={user.department || 'Not specified'}
                readOnly
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 focus:ring-emerald-500 focus:border-emerald-500 cursor-not-allowed text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <input
                type="text"
                value={user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                readOnly
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 focus:ring-emerald-500 focus:border-emerald-500 cursor-not-allowed text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <input
                type="text"
                value={user.year || 'Not specified'}
                readOnly
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 focus:ring-emerald-500 focus:border-emerald-500 cursor-not-allowed text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
              <input
                type="text"
                value={new Date(user.created_at).toLocaleDateString()}
                readOnly
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 focus:ring-emerald-500 focus:border-emerald-500 cursor-not-allowed text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Login</label>
              <input
                type="text"
                value={user.last_login ? new Date(user.last_login).toLocaleString() : 'Never'}
                readOnly
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 focus:ring-emerald-500 focus:border-emerald-500 cursor-not-allowed text-sm"
              />
            </div>
          </div>

          <div className="mt-6">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-4 w-4 text-green-500">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-2">
                  <p className="text-xs font-medium text-gray-900">
                    {user.email_verified ? 'Email Verified' : 'Email Not Verified'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-emerald-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Partnership Tools</h2>
          <div className="space-y-4">
            <DashboardAction 
              title="Project Collaboration" 
              description="Collaborate on environmental projects" 
              action="Collaborate"
            />
            <DashboardAction 
              title="Event Hosting" 
              description="Host events with the club" 
              action="Plan"
            />
            <DashboardAction 
              title="Resource Sharing" 
              description="Share resources with the club" 
              action="Share"
            />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 border border-emerald-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Partnership Benefits</h2>
          <div className="space-y-4">
            <DashboardAction 
              title="Marketing Exposure" 
              description="Access to marketing and exposure benefits" 
              action="View"
            />
            <DashboardAction 
              title="Reporting Tools" 
              description="Generate partnership impact reports" 
              action="Generate"
            />
            <DashboardAction 
              title="Renew Partnership" 
              description="Renew your partnership agreement" 
              action="Renew"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const VisitorDashboard: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900">Visitor Dashboard</h1>
        <p className="text-gray-600">Welcome to Prithvi Nature Club</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-8 border border-emerald-100 mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Prithvi Nature Club!</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          You&apos;re currently viewing our platform as a visitor. 
          Join us as a member, volunteer, or partner to access exclusive features and contribute to our mission.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors duration-300">
            Become a Member
          </button>
          <button className="bg-white text-emerald-700 border border-emerald-600 px-6 py-3 rounded-lg font-medium hover:bg-emerald-50 transition-colors duration-300">
            Partner with Us
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-emerald-100">
          <div className="text-emerald-700 text-3xl mb-4">🌱</div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Environmental Impact</h3>
          <p className="text-gray-700">
            See our ongoing projects and environmental impact initiatives.
          </p>
          <button className="mt-4 text-emerald-600 font-medium hover:underline">Learn More</button>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 border border-emerald-100">
          <div className="text-emerald-700 text-3xl mb-4">👥</div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Meet Our Team</h3>
          <p className="text-gray-700">
            Discover our leadership team and department heads.
          </p>
          <button className="mt-4 text-emerald-600 font-medium hover:underline">Explore</button>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 border border-emerald-100">
          <div className="text-emerald-700 text-3xl mb-4">📅</div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Upcoming Events</h3>
          <p className="text-gray-700">
            View our event calendar and upcoming activities.
          </p>
          <button className="mt-4 text-emerald-600 font-medium hover:underline">View Events</button>
        </div>
      </div>
    </div>
  );
};

// Dashboard Action component
const DashboardAction: React.FC<{ title: string; description: string; action: string }> = ({ 
  title, 
  description, 
  action 
}) => (
  <div className="flex justify-between items-center p-4 border-b border-gray-100 last:border-b-0">
    <div>
      <h4 className="font-medium text-gray-900">{title}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
    <button className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-200 transition-colors duration-300">
      {action}
    </button>
  </div>
);

const DashboardPage: React.FC = () => {
  const { user, loading } = useAuth();
  const [userRole, setUserRole] = useState<UserRole>('visitor'); // Default to visitor

  useEffect(() => {
    if (!loading && user) {
      // Convert the user role string to our UserRole type
      // The backend returns lowercase roles, so we need to handle that
      const role = user.role.toLowerCase();
      
      // Map backend roles to our dashboard roles
      switch(role) {
        case 'admin':
          setUserRole('admin');
          break;
        case 'executive':
          setUserRole('executive_committee');
          break;
        case 'department_head':
        case 'moderator':
          setUserRole('department_head');
          break;
        case 'member':
          setUserRole('member');
          break;
        case 'volunteer':
          setUserRole('volunteer');
          break;
        default:
          setUserRole('member'); // Default fallback
      }
    } else if (!loading && !user) {
      setUserRole('visitor'); // No user logged in
    }
  }, [user?.id, user?.role, loading]); // Only re-run if user ID, role, or loading state changes

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <RoleDashboard role={userRole} />
    </DashboardLayout>
  );
};

export default DashboardPage;
