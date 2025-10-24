'use client';
import React from 'react';
import DashboardLayout from '@/components/dashboard/common/DashboardLayout';

const ProfilePage: React.FC = () => {
  return (
    <DashboardLayout activePage="profile">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600">Manage your personal information and preferences</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6 border border-emerald-100/50">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">First Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  defaultValue="Alex"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Last Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  defaultValue="Johnson"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Email</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  defaultValue="alex@example.com"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Phone</label>
                <input 
                  type="tel" 
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  defaultValue="+1 (555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Department</label>
                <select className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                  <option>Conservation</option>
                  <option>Education</option>
                  <option>Research</option>
                  <option>Outreach</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Role</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-100"
                  value="Member"
                  readOnly
                />
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-gray-700 text-sm font-medium mb-1">Bio</label>
              <textarea 
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                rows={4}
                defaultValue="Environmental enthusiast passionate about conservation and sustainability."
              ></textarea>
            </div>
            <button className="mt-4 bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors duration-300">
              Update Profile
            </button>
          </div>
        </div>
        
        {/* Profile Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6 border border-emerald-100/50">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Profile Picture</h2>
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                <span className="text-5xl font-bold text-emerald-700">AJ</span>
              </div>
              <button className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg font-medium hover:bg-emerald-200 transition-colors duration-300">
                Change Photo
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border border-emerald-100/50">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Account Stats</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Member Since</span>
                <span className="font-medium">Jan 15, 2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Events Attended</span>
                <span className="font-medium">18</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Points Earned</span>
                <span className="font-medium">1,250</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Badges Earned</span>
                <span className="font-medium">5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;