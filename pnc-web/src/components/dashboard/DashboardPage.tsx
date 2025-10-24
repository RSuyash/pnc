'use client';
import React from 'react';

const DashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-teal-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">User Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-emerald-100/50">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Profile</h2>
            <p className="text-gray-700 mb-4">Manage your account information and preferences.</p>
            <button className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg font-medium hover:bg-emerald-200 transition-colors duration-300">
              Edit Profile
            </button>
          </div>
          
          {/* Available Forms for Regular Users */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-emerald-100/50">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Join Our Mission</h2>
            <p className="text-gray-700 mb-4">Apply to join our environmental mission as a volunteer or member.</p>
            <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors duration-300">
              Fill Application
            </button>
          </div>
          
          {/* Available Forms for Partners */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-emerald-100/50">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Partner Application</h2>
            <p className="text-gray-700 mb-4">Submit a partnership proposal with pre-filled information.</p>
            <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors duration-300">
              Partnership Form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;