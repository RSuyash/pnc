import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

// --- Data for the cards to keep the component clean ---
const involvementOptions = [
  {
    title: "Join Our Mission",
    description: "Become a part of our passionate student community. Make a real difference.",
    link: "/apply",
    buttonText: "Apply Now",
    imageUrl: "/images/involved/community-action.jpg", // <-- IMPORTANT: REPLACE IMAGE
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  },
  {
    title: "Become a Partner",
    description: "Collaborate with us to amplify your impact and support environmental initiatives.",
    link: "/partner",
    buttonText: "Partner With Us",
    imageUrl: "/images/involved/professional-partnership.jpg", // <-- IMPORTANT: REPLACE IMAGE
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9V3m0 18a9 9 0 009-9M3 12a9 9 0 019-9m-9 9h18" />
      </svg>
    )
  }
];


// --- Modern Redesigned Component ---
const GetInvolved: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-4xl md:text-5xl text-center font-bold mb-16 text-gray-900">
          Get Involved
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {involvementOptions.map((option) => (
            <Link 
              href={option.link} 
              key={option.title} 
              className="group block bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="aspect-video relative">
                <Image
                  src={option.imageUrl}
                  alt={option.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
              </div>
              
              <div className="p-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-lg bg-green-100 text-green-700 flex items-center justify-center mr-4">
                    {option.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {option.title}
                  </h3>
                </div>
                
                <p className="text-gray-700 mb-6">
                  {option.description}
                </p>
                
                <div className="flex items-center text-green-600 font-medium group-hover:text-green-700 transition-colors">
                  <span>{option.buttonText}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GetInvolved;