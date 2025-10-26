'use client';
import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/common/DashboardLayout';

const CalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Mock events data
  const events = [
    { id: 1, title: 'Tree Planting Drive', date: '2024-11-05', time: '10:00 AM', location: 'Central Park', type: 'event' },
    { id: 2, title: 'Beach Cleanup', date: '2024-11-12', time: '9:00 AM', location: 'Sunset Beach', type: 'volunteer' },
    { id: 3, title: 'Wildlife Survey', date: '2024-11-18', time: '8:00 AM', location: 'National Forest', type: 'research' },
    { id: 4, title: 'EC Monthly Meeting', date: '2024-11-20', time: '2:00 PM', location: 'Conference Room', type: 'meeting' },
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  // Filter events for current month
  const monthEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate.getMonth() === currentDate.getMonth() && 
           eventDate.getFullYear() === currentDate.getFullYear();
  });

  return (
    <DashboardLayout activePage="calendar">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900">Calendar & Planning</h1>
        <p className="text-gray-600">Manage your events and schedule</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar View */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-6 border border-emerald-100/50">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">{monthName} {year}</h2>
              <div className="flex space-x-2">
                <button 
                  onClick={() => navigateMonth('prev')}
                  className="p-2 rounded-lg hover:bg-emerald-50"
                >
                  &lt;
                </button>
                <button 
                  onClick={() => setCurrentDate(new Date())}
                  className="px-4 py-2 text-sm bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200"
                >
                  Today
                </button>
                <button 
                  onClick={() => navigateMonth('next')}
                  className="p-2 rounded-lg hover:bg-emerald-50"
                >
                  &gt;
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center font-medium text-gray-600 py-2">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {daysInMonth.map(day => {
                const dayEvents = events.filter(event => {
                  const eventDate = new Date(event.date);
                  return eventDate.getDate() === day.getDate() &&
                         eventDate.getMonth() === day.getMonth() &&
                         eventDate.getFullYear() === day.getFullYear();
                });
                
                return (
                  <div 
                    key={day.getDate()} 
                    className={`min-h-24 p-2 border rounded-lg ${
                      day.getDate() === new Date().getDate() && 
                      day.getMonth() === new Date().getMonth() &&
                      day.getFullYear() === new Date().getFullYear()
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="text-right text-sm font-medium text-gray-700">
                      {day.getDate()}
                    </div>
                    <div className="mt-1 space-y-1 max-h-20 overflow-y-auto">
                      {dayEvents.map(event => (
                        <div 
                          key={event.id} 
                          className={`text-xs p-1 rounded truncate ${
                            event.type === 'event' ? 'bg-blue-100 text-blue-700' :
                            event.type === 'volunteer' ? 'bg-green-100 text-green-700' :
                            event.type === 'research' ? 'bg-purple-100 text-purple-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {event.title}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Events Sidebar */}
        <div>
          <div className="bg-white rounded-xl shadow-md p-6 border border-emerald-100/50 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
            <div className="space-y-4">
              {monthEvents.map(event => (
                <div key={event.id} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                  <div className="flex justify-between">
                    <h3 className="font-medium text-gray-900">{event.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      event.type === 'event' ? 'bg-blue-100 text-blue-700' :
                      event.type === 'volunteer' ? 'bg-green-100 text-green-700' :
                      event.type === 'research' ? 'bg-purple-100 text-purple-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {event.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {new Date(event.date).toLocaleDateString()} at {event.time}
                  </p>
                  <p className="text-sm text-gray-600">{event.location}</p>
                  <button className="mt-2 text-sm text-emerald-600 hover:underline">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border border-emerald-100/50">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Event</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Event Title</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Enter event title"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Date</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Time</label>
                  <input 
                    type="time" 
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Location</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Enter location"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Event Type</label>
                <select className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                  <option value="event">General Event</option>
                  <option value="volunteer">Volunteer Activity</option>
                  <option value="research">Research Activity</option>
                  <option value="meeting">Meeting</option>
                </select>
              </div>
              <button className="w-full bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors duration-300">
                Add Event
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CalendarPage;