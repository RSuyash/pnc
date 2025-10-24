'use client';
import React, { useState, useEffect } from 'react';
import { FiUser, FiUsers, FiAward, FiCalendar, FiActivity, FiBarChart2, FiSettings, FiLogOut, FiChevronDown, FiMail, FiMessageSquare, FiTrendingUp, FiTarget, FiZap, FiBriefcase, FiGlobe, FiLayers, FiPercent, FiShield } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

// Define types
type UserRole = 'visitor' | 'member' | 'volunteer' | 'department_head' | 'executive_committee' | 'admin' | 'partner';
type UserStatus = 'active' | 'pending_approval' | 'suspended' | 'completed';

// Mock user data - in a real app, this would come from an API
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
  status: 'active' as UserStatus,
};

// Define sidebar items based on role
const getSidebarItems = (role: UserRole) => {
  const baseItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FiActivity /> },
    { id: 'calendar', label: 'Calendar', icon: <FiCalendar /> },
    { id: 'messages', label: 'Messages', icon: <FiMessageSquare /> },
    { id: 'reports', label: 'Reports', icon: <FiBarChart2 /> },
  ];
  
  const roleSpecificItems: Record<string, typeof baseItems> = {
    admin: [
      ...baseItems,
      { id: 'users', label: 'User Management', icon: <FiUsers /> },
      { id: 'system', label: 'System Admin', icon: <FiSettings /> },
    ],
    executive_committee: [
      ...baseItems,
      { id: 'strategy', label: 'Strategic Planning', icon: <FiTarget /> },
      { id: 'partnerships', label: 'Partnerships', icon: <FiGlobe /> },
    ],
    department_head: [
      ...baseItems,
      { id: 'team', label: 'Team Management', icon: <FiUsers /> },
      { id: 'projects', label: 'Projects', icon: <FiLayers /> },
    ],
    member: [
      ...baseItems,
      { id: 'profile', label: 'Profile', icon: <FiUser /> },
      { id: 'events', label: 'Events', icon: <FiCalendar /> },
    ],
    volunteer: [
      ...baseItems,
      { id: 'opportunities', label: 'Opportunities', icon: <FiZap /> },
      { id: 'recognition', label: 'Recognition', icon: <FiAward /> },
    ],
    partner: [
      ...baseItems,
      { id: 'collaboration', label: 'Collaboration', icon: <FiBriefcase /> },
      { id: 'benefits', label: 'Benefits', icon: <FiShield /> },
    ],
    visitor: [
      ...baseItems,
      { id: 'about', label: 'About', icon: <FiTrendingUp /> },
    ]
  };
  
  return roleSpecificItems[role] || baseItems;
};

interface DashboardLayoutProps {
  children: React.ReactNode;
  activePage?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, activePage = 'dashboard' }) => {
  const [userRole, setUserRole] = useState<UserRole>('member');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: "New Event", description: "Tree Planting Drive is happening next week", date: "2024-10-22", read: false },
    { id: 2, title: "Achievement Unlocked", description: "You earned the 'Eco Warrior' badge", date: "2024-10-20", read: true },
    { id: 3, title: "Team Update", description: "Your team has a new project assignment", date: "2024-10-18", read: true },
  ]);
  const router = useRouter();

  useEffect(() => {
    // In a real app, this would come from authentication state
    setUserRole(mockUserData.role);
  }, []);

  // Mark notification as read
  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === id ? { ...n, read: true } : n
      )
    );
  };

  const sidebarItems = getSidebarItems(userRole);

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-emerald-50 to-teal-50">
      {/* Sidebar */}
      <div className={`bg-white shadow-lg ${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 z-40`}>
        <div className="p-4 border-b border-emerald-100">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <span className="text-emerald-700 font-bold">PNC</span>
            </div>
            {sidebarOpen && (
              <h1 className="ml-3 text-xl font-serif font-bold text-gray-900">Prithvi Nature Club</h1>
            )}
          </div>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <a 
                  href={`/dashboard/${item.id}`}
                  className={`flex items-center w-full p-3 rounded-lg text-left ${
                    activePage === item.id 
                      ? 'bg-emerald-50 text-emerald-700' 
                      : 'text-gray-700 hover:bg-emerald-50'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  {sidebarOpen && <span className="ml-3">{item.label}</span>}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Top Bar */}
        <div className="bg-white shadow-sm p-4 flex justify-between items-center">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-emerald-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="flex items-center space-x-4">
            {/* Notification Bell */}
            <div className="relative">
              <a href="/dashboard/messages" className="p-2 rounded-lg hover:bg-emerald-50 relative">
                <FiMail className="text-xl text-gray-600" />
                {!notifications.every(n => n.read) && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </a>
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-emerald-50"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <span className="text-emerald-700 font-medium">{mockUserData.name.charAt(0)}</span>
                </div>
                {sidebarOpen && (
                  <>
                    <span className="text-gray-700">{mockUserData.name}</span>
                    <FiChevronDown />
                  </>
                )}
              </button>
              
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-emerald-100">
                  <a href="/dashboard/profile" className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-emerald-50">Profile</a>
                  <a href="/dashboard/settings" className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-emerald-50">Settings</a>
                  <a 
                    href="/auth"
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-emerald-50 flex items-center"
                  >
                    <FiLogOut className="mr-2" /> Logout
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;