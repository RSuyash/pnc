'use client';
import React, { useState } from 'react';

const CoreValuesGrid = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const coreValues = [
    {
      title: "Sustainability",
      description: "We are committed to promoting and practicing sustainable living.",
      icon: "🌱",
      color: "emerald"
    },
    {
      title: "Education",
      description: "We believe in empowering individuals through environmental education.",
      icon: "🎓",
      color: "teal"
    },
    {
      title: "Community",
      description: "We build strong relationships with our community to create lasting change.",
      icon: "👥",
      color: "green"
    },
    {
      title: "Innovation",
      description: "We embrace creative solutions to environmental challenges.",
      icon: "💡",
      color: "lime"
    },
    {
      title: "Integrity",
      description: "We operate with transparency and honesty in all our initiatives.",
      icon: "✅",
      color: "emerald"
    },
    {
      title: "Collaboration",
      description: "We work together with partners to amplify our impact.",
      icon: "🤝",
      color: "teal"
    }
  ];

  const colorClasses: Record<string, string> = {
    emerald: "bg-emerald-100 border-emerald-200 text-emerald-700",
    teal: "bg-teal-100 border-teal-200 text-teal-700",
    green: "bg-green-100 border-green-200 text-green-700",
    lime: "bg-lime-100 border-lime-200 text-lime-700"
  };

  return (
    <section className="py-12 sm:py-16 relative">
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-center text-gray-900 mb-3 sm:mb-4">Our Core Values</h2>
        <p className="text-center text-gray-800 text-base sm:text-lg mb-8 sm:mb-16 max-w-xl sm:max-w-2xl mx-auto">
          These principles guide everything we do and shape our approach to environmental conservation.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {coreValues.map((value, index) => (
            <div
              key={index}
              className={`
                bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border border-white/50
                transition-all duration-500 cursor-pointer transform
                ${hoveredIndex === index ? 'scale-105 ring-2 ring-emerald-500/50' : 'hover:scale-102'}
              `}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="flex flex-col items-center text-center">
                <div className={`
                  w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-2xl sm:text-3xl mb-4 sm:mb-6
                  border-2 ${colorClasses[value.color]}
                  transition-all duration-300
                  ${hoveredIndex === index ? 'scale-105 sm:scale-110' : ''}
                `}>
                  {value.icon}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">{value.title}</h3>
                <p className="text-sm sm:text-base text-gray-800">{value.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreValuesGrid;