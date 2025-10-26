'use client';
import React from 'react';
import DashboardLayout from '@/components/dashboard/common/DashboardLayout';

const MessagesPage: React.FC = () => {
  const messages = [
    {
      id: 1,
      sender: "Sarah Johnson",
      title: "Project Collaboration Request",
      content: "Would you like to collaborate on the upcoming conservation project?",
      time: "2 hours ago",
      read: false
    },
    {
      id: 2,
      sender: "EC Team",
      title: "Monthly Meeting Reminder",
      content: "Don&apos;t forget about the monthly executive committee meeting this Friday.",
      time: "1 day ago",
      read: true
    },
    {
      id: 3,
      sender: "Volunteer Coordinator",
      title: "Event Update",
      content: "The beach cleanup event has been rescheduled to next Saturday.",
      time: "3 days ago",
      read: true
    }
  ];

  return (
    <DashboardLayout activePage="messages">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600">Your inbox and communication center</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Compose Button */}
        <div className="lg:col-span-4 mb-6">
          <button className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors duration-300 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Compose New Message
          </button>
        </div>
        
        {/* Messages List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md border border-emerald-100/50">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Inbox</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {messages.map(message => (
                <div 
                  key={message.id} 
                  className={`p-4 hover:bg-emerald-50 cursor-pointer transition-colors duration-200 ${
                    !message.read ? 'bg-emerald-50/50' : ''
                  }`}
                >
                  <div className="flex justify-between">
                    <h3 className={`font-medium ${
                      !message.read ? 'text-emerald-700 font-semibold' : 'text-gray-900'
                    }`}>
                      {message.title}
                    </h3>
                    <span className="text-sm text-gray-500">{message.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">From: {message.sender}</p>
                  <p className="text-sm text-gray-700 mt-2 truncate">{message.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Message Preview */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-6 border border-emerald-100/50 h-full">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Message Preview</h2>
            <div className="border-b border-gray-200 pb-4 mb-4">
              <h3 className="text-lg font-bold text-gray-900">Project Collaboration Request</h3>
              <p className="text-gray-600">From: Sarah Johnson</p>
              <p className="text-gray-500 text-sm">2 hours ago</p>
            </div>
            <div className="text-gray-700 mb-6">
              <p>Hi Alex,</p>
              <p className="mt-3">I hope this message finds you well. I wanted to reach out about a potential collaboration on our upcoming conservation project in the coastal region. Given your expertise in marine ecosystems, I believe your insights would be invaluable to the initiative.</p>
              <p className="mt-3">The project aims to restore critical habitats and monitor marine biodiversity in partnership with the local community. We&apos;re looking for passionate individuals to join our efforts and make a meaningful impact.</p>
              <p className="mt-3">Would you be interested in discussing this opportunity further? I&apos;d be happy to arrange a meeting at your convenience.</p>
              <p className="mt-6">Best regards,<br />Sarah Johnson</p>
            </div>
            <div className="flex space-x-3">
              <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors duration-300">
                Reply
              </button>
              <button className="bg-white text-emerald-700 border border-emerald-600 px-4 py-2 rounded-lg font-medium hover:bg-emerald-50 transition-colors duration-300">
                Forward
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MessagesPage;