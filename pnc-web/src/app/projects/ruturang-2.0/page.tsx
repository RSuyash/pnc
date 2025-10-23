'use client';
import React from 'react';
import { PROJECTS_DATA } from '@/data/projects';
import { Zap, Droplet, Users, BookOpen, Leaf, ChevronRight, Clock, MapPin, Calendar, Phone } from 'lucide-react';
import Link from 'next/link';

const Ruturang2Page: React.FC = () => {
  // Find the project data for Ruturang 2.0
  const project = PROJECTS_DATA.find(p => p.id === 'ruturang-2.0');

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-teal-50">
      <div className="pt-20"> {/* Add padding to account for fixed header */}
        {/* Project Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center" 
               style={{ backgroundImage: "url('https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=2070&auto=format&fit=crop')", opacity: 0.15 }}></div>
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/70 to-teal-100/90"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mr-4">
                  <BookOpen className="w-8 h-8 text-emerald-700" />
                </div>
                {project.isFlagship && (
                  <span className="bg-emerald-600 text-white text-sm font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Flagship
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
                {project.title}
              </h1>
              <p className="text-xl text-gray-800 max-w-3xl">
                {project.description}
              </p>
            </div>
          </div>
        </section>

        {/* Project Details */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-lg border border-white/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">About This Event</h2>
                  <p className="text-gray-700 mb-6">
                    Prithvi Nature Club, the state-recognized Green Club of MIT-WPU, is thrilled to bring you the second trail of the RutuRang series! This season, explore Pune’s hills with expert naturalist and Geologist Siddharth Binniwale and discover the wonders hidden in the changing landscape.
                  </p>
                  
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Event Details</h3>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <Calendar className="w-5 h-5 text-emerald-700 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <div className="font-bold text-gray-900">Date</div>
                          <div className="text-gray-700">Saturday, 13th September</div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Clock className="w-5 h-5 text-emerald-700 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <div className="font-bold text-gray-900">Time</div>
                          <div className="text-gray-700">7:00 – 8:30 AM</div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <MapPin className="w-5 h-5 text-emerald-700 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <div className="font-bold text-gray-900">Location</div>
                          <div className="text-gray-700">Baner Hill, Pune</div>
                          <div className="mt-1">
                            <a 
                              href="https://maps.app.goo.gl/V7YBZzTWYkUAVPQj6?g_st=awb" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-emerald-700 hover:underline"
                            >
                              View Assembly Point
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Link 
                    href="/join-our-mission" 
                    className="inline-flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full transition-all duration-300"
                  >
                    Get Involved
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
                
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">What's in Store</h2>
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mr-4 flex-shrink-0">
                        <Droplet className="w-5 h-5 text-emerald-700" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">Pedology (Soil Science)</h3>
                        <p className="text-gray-700">Explore the fascinating world of soil science and its importance in ecosystem health.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mr-4 flex-shrink-0">
                        <Users className="w-5 h-5 text-emerald-700" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">Pollinators & Biodiversity</h3>
                        <p className="text-gray-700">Discover the crucial role of pollinators and the rich biodiversity in Pune's hills.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mr-4 flex-shrink-0">
                        <Zap className="w-5 h-5 text-emerald-700" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">Fauna Recognition by Sound</h3>
                        <p className="text-gray-700">Learn to identify different animals and birds by their sounds.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mr-4 flex-shrink-0">
                        <Leaf className="w-5 h-5 text-emerald-700" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">Fun Games</h3>
                        <p className="text-gray-700">Interactive and educational games to make learning about nature enjoyable.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">Contact Information</h3>
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-emerald-700 mr-2" />
                      <div>
                        <div className="font-medium text-gray-900">Sharvari Tate (Secretary, PNC)</div>
                        <div className="text-gray-700">+91 8767261835</div>
                      </div>
                    </div>
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
                Join Ruturang 2.0: Nature Exploration
              </h2>
              <p className="text-xl mb-8 text-emerald-100 max-w-2xl mx-auto">
                Come with curiosity, leave with nature’s stories!
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

export default Ruturang2Page;