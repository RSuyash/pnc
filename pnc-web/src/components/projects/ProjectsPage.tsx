'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PROJECTS_DATA } from '@/data/projects';
import { Zap, Droplet, Users, BookOpen, Leaf, ChevronRight } from 'lucide-react';

const ProjectsPage: React.FC = () => {
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);
  
  const projects = PROJECTS_DATA.map(p => ({ ...p, link: `/projects/${p.link}` }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-teal-50">
      <div className="pt-20"> {/* Add padding to account for fixed header */}
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center" 
               style={{ backgroundImage: "url('https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=2070&auto=format&fit=crop')", opacity: 0.15 }}></div>
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/70 to-teal-100/90"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 mb-6">
                Environmental Projects & Fieldwork
              </h1>
              <p className="text-xl text-gray-800 max-w-3xl mx-auto mb-10">
                Discover our impactful environmental initiatives that cultivate a greener tomorrow
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link 
                  href="/join-our-mission" 
                  className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full transition-all duration-300 transform hover:scale-105"
                >
                  Join Our Mission
                </Link>
                <Link 
                  href="/become-a-partner" 
                  className="px-8 py-3 bg-transparent border-2 border-emerald-600 text-emerald-800 hover:bg-emerald-50 rounded-full transition-all duration-300"
                >
                  Become a Partner
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Showcase */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-gray-900">
                Our Impactful Projects
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                Each project contributes to our mission of environmental stewardship and sustainable development
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <Link 
                  href={project.link} 
                  key={project.id}
                  className="group relative block rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                  onMouseEnter={() => setHoveredProjectId(project.id)}
                  onMouseLeave={() => setHoveredProjectId(null)}
                >
                  <div className="aspect-[4/5] relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="absolute inset-0 bg-cover bg-center" 
                         style={{ 
                           backgroundImage: project.id === 'soee' 
                             ? "url('/images/projects/soee-banner.jpg')" 
                             : project.id === 'byoc'
                             ? "url('/images/projects/byoc/boyc-showcase.jpg')"
                             : project.id === 'campus-green-audit'
                             ? "url('/images/projects/project-campus-green-audit.jpg')"
                             : project.id === 'ruturang-2.0'
                             ? "url('/images/projects/ruturang-2/ruturang-2-observation.jpg')"
                             : "url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2071&auto=format&fit=crop')" 
                         }}></div>
                    
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <div className="mb-2">
                        {project.isFlagship && (
                          <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-3">
                            Flagship
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-lg md:text-xl mb-2 group-hover:text-emerald-300 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-sm text-white/90 mb-3">
                        {project.description}
                      </p>
                      <div className="flex items-center text-sm font-medium text-emerald-300 group-hover:text-white transition-colors">
                        <span>Explore Project</span>
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Project Highlight */}
        <section className="py-20 bg-gradient-to-r from-emerald-100/50 to-teal-100/50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-white/50">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="lg:w-1/2">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Spotlight: SOEE Program
                  </h2>
                  <p className="text-lg text-gray-800 mb-6">
                    Our flagship initiative that integrates environmental action with academic fieldwork, focusing on school outreach for scalable, data-driven solutions.
                  </p>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center mr-3">
                        <Droplet className="w-4 h-4 text-emerald-700" />
                      </div>
                      <span className="text-gray-700">Community Waste Management</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center mr-3">
                        <BookOpen className="w-4 h-4 text-emerald-700" />
                      </div>
                      <span className="text-gray-700">Environmental Literacy</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center mr-3">
                        <Users className="w-4 h-4 text-emerald-700" />
                      </div>
                      <span className="text-gray-700">Community Empowerment</span>
                    </div>
                  </div>
                  <Link 
                    href="/projects/soee" 
                    className="inline-flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full transition-all duration-300"
                  >
                    Explore SOEE Program
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
                <div className="lg:w-1/2">
                  <div className="aspect-video rounded-2xl overflow-hidden shadow-lg">
                    <div className="w-full h-full bg-cover bg-center" 
                         style={{ backgroundImage: "url('/images/projects/soee/chande/soee-village-school-pnc.jpg')" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-12 text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Be Part of Our Environmental Mission
              </h2>
              <p className="text-xl mb-8 text-emerald-100 max-w-2xl mx-auto">
                Join our community of environmental stewards and contribute to impactful change
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link 
                  href="/join-our-mission" 
                  className="px-8 py-3 bg-white text-emerald-700 font-bold rounded-full transition-all duration-300 hover:bg-emerald-50"
                >
                  Join Our Mission
                </Link>
                <Link 
                  href="/contact" 
                  className="px-8 py-3 bg-transparent border-2 border-white text-white font-medium rounded-full transition-all duration-300 hover:bg-white/10"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProjectsPage;