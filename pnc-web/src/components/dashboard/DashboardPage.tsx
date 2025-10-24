'use client';
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/common/DashboardLayout';
import DashboardCard from '@/components/dashboard/common/DashboardCard';
import { UsersIcon, ActivityIcon, ChartIcon, CalendarIcon, AwardIcon, ClockIcon, CheckCircleIcon, StarIcon, ShieldIcon, BriefcaseIcon } from '@/components/dashboard/common/DashboardCard';

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
const AdminDashboard: React.FC = () => (
  <div>
    <div className="mb-8">
      <h1 className="text-3xl font-serif font-bold text-gray-900">Admin Dashboard</h1>
      <p className="text-gray-600">System-wide administration and management</p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <DashboardCard title="Total Users" value="1,248" change="+12%" icon={<UsersIcon />} />
      <DashboardCard title="Active Projects" value="24" change="+3" icon={<ActivityIcon />} />
      <DashboardCard title="Partners" value="42" change="+5" icon={<BriefcaseIcon />} />
      <DashboardCard title="System Health" value="98%" change="+2%" icon={<ShieldIcon />} />
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow-md p-6 border border-emerald-100/50">
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
      
      <div className="bg-white rounded-xl shadow-md p-6 border border-emerald-100/50">
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
  </div>
);

const ECDashboard: React.FC = () => (
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
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow-md p-6 border border-emerald-100/50">
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
      
      <div className="bg-white rounded-xl shadow-md p-6 border border-emerald-100/50">
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

const HeadDashboard: React.FC = () => (
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
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow-md p-6 border border-emerald-100/50">
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
      
      <div className="bg-white rounded-xl shadow-md p-6 border border-emerald-100/50">
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

const MemberDashboard: React.FC = () => (
  <div>
    <div className="mb-8">
      <h1 className="text-3xl font-serif font-bold text-gray-900">Member Dashboard</h1>
      <p className="text-gray-600">Your personal activities and achievements</p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <DashboardCard title="Points Earned" value={mockUserData.points.toString()} change="+120" icon={<StarIcon />} />
      <DashboardCard title="Badges" value={mockUserData.badges.toString()} change="+1" icon={<AwardIcon />} />
      <DashboardCard title="Events Attended" value="18" change="+2" icon={<CalendarIcon />} />
      <DashboardCard title="Projects Contributed" value="7" change="+1" icon={<ActivityIcon />} />
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow-md p-6 border border-emerald-100/50">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Your Activities</h2>
        <div className="space-y-4">
          <DashboardAction 
            title="Upcoming Events" 
            description={`Next event: ${mockUserData.nextEvent} on ${mockUserData.nextEventDate}`} 
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
      
      <div className="bg-white rounded-xl shadow-md p-6 border border-emerald-100/50">
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

const VolunteerDashboard: React.FC = () => (
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
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow-md p-6 border border-emerald-100/50">
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
      
      <div className="bg-white rounded-xl shadow-md p-6 border border-emerald-100/50">
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

const PartnerDashboard: React.FC = () => (
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
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow-md p-6 border border-emerald-100/50">
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
      
      <div className="bg-white rounded-xl shadow-md p-6 border border-emerald-100/50">
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

const VisitorDashboard: React.FC = () => (
  <div>
    <div className="mb-8">
      <h1 className="text-3xl font-serif font-bold text-gray-900">Visitor Dashboard</h1>
      <p className="text-gray-600">Welcome to Prithvi Nature Club</p>
    </div>
    
    <div className="bg-white rounded-xl shadow-md p-8 border border-emerald-100/50 mb-8 text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Prithvi Nature Club!</h2>
      <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
        You're currently viewing our platform as a visitor. 
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
      <div className="bg-white rounded-xl shadow-md p-6 border border-emerald-100/50">
        <div className="text-emerald-700 text-3xl mb-4">🌱</div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">Environmental Impact</h3>
        <p className="text-gray-700">
          See our ongoing projects and environmental impact initiatives.
        </p>
        <button className="mt-4 text-emerald-600 font-medium hover:underline">Learn More</button>
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-6 border border-emerald-100/50">
        <div className="text-emerald-700 text-3xl mb-4">👥</div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">Meet Our Team</h3>
        <p className="text-gray-700">
          Discover our leadership team and department heads.
        </p>
        <button className="mt-4 text-emerald-600 font-medium hover:underline">Explore</button>
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-6 border border-emerald-100/50">
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
  const [userRole, setUserRole] = useState<UserRole>('member');

  useEffect(() => {
    // In a real app, this would come from authentication state
    setUserRole(mockUserData.role);
  }, []);

  return (
    <DashboardLayout>
      <RoleDashboard role={userRole} />
    </DashboardLayout>
  );
};

export default DashboardPage;