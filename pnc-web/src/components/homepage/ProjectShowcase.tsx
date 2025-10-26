"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PROJECTS_DATA } from '@/data/projects';

// --- Data for the component (now using centralized project data) ---
const projects = [
  {
    id: 'soee',
    name: 'SOEE: School of Environmental Education & Engagement',
    description: PROJECTS_DATA.find(p => p.id === 'soee')?.description || 'Integrating fieldwork, research, and community action for scalable environmental solutions.',
    imageUrl: '/images/projects/soee-banner.jpg',
    isFlagship: true,
    link: '/projects/soee',
  },
  {
    id: 'byoc',
    name: 'Bring Your Own Cup (BYOC)',
    description: PROJECTS_DATA.find(p => p.id === 'byoc')?.description || 'The successful campus-wide movement for plastic reduction, saving thousands of single-use cups since its pilot launch.',
    imageUrl: "/images/projects/byoc/boyc-showcase.jpg",
    isFlagship: false,
    link: '/projects/byoc',
  },
  {
    id: 'campus-green-audit',
    name: 'MIT-WPU Campus Green Audit',
    description: PROJECTS_DATA.find(p => p.id === 'campus-green-audit')?.description || 'Comprehensive environmental assessment of the campus infrastructure and sustainability practices.',
    imageUrl: "/images/projects/project-campus-green-audit.jpg",
    isFlagship: false,
    link: '/projects/campus-green-audit',
  },
  {
    id: 'ruturang-2.0',
    name: 'Ruturang 2.0: Seasonal Nature Exploration',
    description: 'Explore Pune’s hills with expert naturalist and Geologist Siddharth Binniwale, discovering wonders hidden in the changing landscape.',
    imageUrl: "/images/projects/ruturang-2/ruturang-2-observation.jpg",
    isFlagship: false,
    link: '/projects/ruturang-2.0',
  },
];

// --- Modern Redesigned Component ---
const ProjectShowcase: React.FC = () => {
  const [activeProjectId, setActiveProjectId] = useState(projects[0]?.id || null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const autoPlayInterval = 5000; // 5 seconds

  const startAutoPlay = () => {
    intervalRef.current = setInterval(() => {
      setActiveProjectId((prevId) => {
        const currentIndex = projects.findIndex(p => p.id === prevId);
        const nextIndex = (currentIndex + 1) % projects.length;
        return projects[nextIndex].id;
      });
    }, autoPlayInterval);
  };

  const stopAutoPlay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay(); // Cleanup on unmount
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Our Projects
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our impactful environmental initiatives
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.map((project) => (
            <Link 
              href={project.link} 
              key={project.id} 
              className={`group relative block rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${project.isFlagship ? 'ring-2 ring-green-600' : ''}`}
              onMouseEnter={() => { stopAutoPlay(); setActiveProjectId(project.id); }}
              onMouseLeave={() => { startAutoPlay(); }}
            >
              <div className="aspect-[4/5] relative">
                <Image
                  src={project.imageUrl}
                  alt={project.name}
                  fill
                  className="object-cover"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="mb-2">
                    {project.isFlagship && (
                      <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-3">
                        Flagship
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-lg md:text-xl mb-2 group-hover:text-green-300 transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-sm text-white/90 mb-3">
                    {project.description}
                  </p>
                  <div className="flex items-center text-sm font-medium text-green-300 group-hover:text-white transition-colors">
                    <span>Learn more</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectShowcase;