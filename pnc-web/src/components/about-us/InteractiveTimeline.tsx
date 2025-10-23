'use client';
import React, { useState, useEffect } from 'react';

const InteractiveTimeline = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const timelineEvents = [
    {
      year: "2020",
      title: "Foundation",
      description: "Prithvi Nature Club was established with a small group of passionate students.",
      icon: "🌱"
    },
    {
      year: "2021",
      title: "First Project",
      description: "Launched our first community tree plantation drive with 500+ saplings.",
      icon: "🌿"
    },
    {
      year: "2022",
      title: "Growth",
      description: "Expanded to 50+ active members and launched educational workshops.",
      icon: "🌳"
    },
    {
      year: "2023",
      title: "Recognition",
      description: "Received the Green Initiative Award from the Environmental Council.",
      icon: "🏆"
    },
    {
      year: "2024",
      title: "Expansion",
      description: "Partnered with 5 schools and launched the Green Schools Program.",
      icon: "🌍"
    }
  ];

  // Auto-rotate timeline events
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % timelineEvents.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [timelineEvents.length]);

  return (
    <section className="py-16 relative">
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-4xl font-serif font-bold text-center text-gray-900 mb-16">Our Journey</h2>
        
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-emerald-300 to-teal-400"></div>
          
          {/* Timeline events */}
          <div className="space-y-12">
            {timelineEvents.map((event, index) => (
              <div 
                key={index}
                className={`flex items-center justify-between ${index % 2 === 0 ? 'flex-row-reverse' : ''}`}
                onMouseEnter={() => setActiveIndex(index)}
              >
                {/* Content card */}
                <div 
                  className={`
                    w-5/12 bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/50 
                    transition-all duration-500 cursor-pointer
                    ${activeIndex === index ? 'scale-105 ring-2 ring-emerald-500/50' : 'opacity-90 hover:opacity-100'}
                  `}
                >
                  <div className="flex items-start">
                    <span className="text-4xl mr-4">{event.icon}</span>
                    <div>
                      <span className="text-emerald-700 font-bold text-lg">{event.year}</span>
                      <h3 className="text-xl font-bold text-gray-900 mt-2">{event.title}</h3>
                      <p className="text-gray-800 mt-2">{event.description}</p>
                    </div>
                  </div>
                </div>
                
                {/* Timeline dot */}
                <div className={`
                  w-6 h-6 rounded-full border-4 border-white shadow-lg z-10
                  ${activeIndex === index 
                    ? 'bg-emerald-500 scale-125' 
                    : 'bg-gray-300 hover:bg-emerald-400'}
                  transition-all duration-300
                `}></div>
                
                {/* Spacer */}
                <div className="w-5/12"></div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Mobile timeline */}
        <div className="md:hidden mt-12">
          <div className="space-y-4">
            {timelineEvents.map((event, index) => (
              <div 
                key={index}
                className={`
                  bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50
                  ${activeIndex === index ? 'ring-2 ring-emerald-500/50' : ''}
                `}
                onClick={() => setActiveIndex(index)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-emerald-700 font-bold text-lg">{event.year}</span>
                    <h3 className="text-lg font-bold text-gray-900 mt-1">{event.title}</h3>
                    <p className="text-gray-800 mt-2">{event.description}</p>
                  </div>
                  <span className="text-2xl">{event.icon}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveTimeline;