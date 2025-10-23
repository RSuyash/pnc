import React from 'react';
import Link from 'next/link';
import { PROJECTS_DATA } from '@/data/projects';
import { Zap, Droplet, Users, BookOpen, Clock, Globe, Award, Leaf, ChevronRight } from 'lucide-react';

const NewSOEEPage: React.FC = () => {
  const soeeProject = PROJECTS_DATA.find(p => p.id === 'soee');
  
  if (!soeeProject) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">SOEE Project Not Found</h1>
          <Link href="/projects" className="text-emerald-600 hover:underline">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const soeeSubProjects = soeeProject.subProjects || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-teal-50">
      <div className="pt-20"> {/* Add padding to account for fixed header */}
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center" 
               style={{ backgroundImage: "url('/images/projects/soee-banner.jpg')", opacity: 0.15 }}></div>
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/70 to-teal-100/90"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Zap className="w-8 h-8 text-emerald-700" />
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 mb-6">
                School Outreach for Environmental Education <span className="block text-3xl md:text-4xl text-emerald-700">(SOEE)</span>
              </h1>
              <p className="text-xl text-gray-800 max-w-3xl mx-auto mb-10">
                Empowering the next generation with environmental knowledge and action.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-lg border border-white/50">
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
                  <Leaf className="w-8 h-8 mr-3 text-emerald-700" /> SOEE's Mission
                </h2>
                <p className="text-lg text-gray-800 leading-relaxed">
                  The <strong className="text-emerald-700">PNC School Outreach for Environmental Education (SOEE) Program</strong> is PNC's comprehensive effort to integrate environmental action with academic fieldwork. It serves as the primary practical application platform for our M.Sc. Environmental Science students, focusing on school outreach for scalable, data-driven solutions in rural communities.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Focus */}
        <section className="py-20 bg-gradient-to-r from-emerald-100/50 to-teal-100/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Core Focus</h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                Driving change through dedicated efforts and strategic initiatives
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Left Column: Key Pillars */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg border border-white/50">
                <div className="mb-8 text-center md:text-left">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 inline-block relative pb-2">
                    <span>Key Pillars</span>
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 transform -translate-y-0.5"></span>
                  </h3>
                </div>
                
                <div className="space-y-6">
                  {/* Pillar 1: Community Waste Management */}
                  <div className="p-5 rounded-xl border border-gray-200 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mr-4">
                        <Droplet className="w-5 h-5 md:w-6 md:h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Community Waste Management</h4>
                        <p className="text-gray-700">Implementing sustainable waste segregation and management practices in local communities.</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Pillar 2: Environmental Literacy */}
                  <div className="p-5 rounded-xl border border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mr-4">
                        <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Environmental Literacy</h4>
                        <p className="text-gray-700">Developing curriculum and conducting workshops for local schools and community centers.</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Pillar 3: Community Empowerment */}
                  <div className="p-5 rounded-xl border border-gray-200 bg-gradient-to-br from-purple-50 to-violet-50 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center mr-4">
                        <Users className="w-5 h-5 md:w-6 md:h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Community Empowerment</h4>
                        <p className="text-gray-700">Training local communities in self-sustained waste and resource management practices.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Led By */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg border border-white/50">
                <div className="mb-8 text-center md:text-left">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 inline-block relative pb-2">
                    <span>Led By</span>
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 transform -translate-y-0.5"></span>
                  </h3>
                </div>
                
                <div className="space-y-6">
                  {/* Prajakta Jadhav */}
                  <div className="flex items-center p-5 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 hover:shadow-md transition-all duration-300">
                    <div className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-lg md:text-xl font-bold mr-6 shadow-md">
                      PJ
                    </div>
                    <div>
                      <h4 className="text-lg md:text-xl font-bold text-gray-900">Prajakta Jadhav</h4>
                      <p className="text-gray-600 font-medium">Vice President, Project Lead</p>
                    </div>
                  </div>

                  {/* Dr. Pankaj Koparde */}
                  <div className="flex items-center p-5 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 hover:shadow-md transition-all duration-300">
                    <div className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-lg md:text-xl font-bold mr-6 shadow-md">
                      PK
                    </div>
                    <div>
                      <h4 className="text-lg md:text-xl font-bold text-gray-900">Dr. Pankaj Koparde</h4>
                      <p className="text-gray-600 font-medium">Advisor & Mentor</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SOEE Fieldwork Initiatives */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-10">SOEE Fieldwork Initiatives</h2>
            <div className={soeeSubProjects.length === 1 ? "flex justify-center" : "grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto"}>
              {soeeSubProjects.map((sub, index) => {
                const initiativeColors = [
                  {
                    cardBg: 'from-emerald-50 to-teal-50', // Teal
                    iconColor: 'text-emerald-600',
                  },
                  {
                    cardBg: 'from-blue-50 to-indigo-50', // Blue
                    iconColor: 'text-blue-600',
                  },
                  {
                    cardBg: 'from-purple-50 to-violet-50', // Deep Purple
                    iconColor: 'text-purple-600',
                  },
                ];
                const currentColor = initiativeColors[index % initiativeColors.length];

                return (
                  <Link href={`/projects/soee/${sub.link}`} key={sub.id}>
                    <div className={`p-6 rounded-2xl shadow-xl backdrop-blur-md transition duration-300 hover:shadow-2xl cursor-pointer bg-gradient-to-br ${currentColor.cardBg} border border-white/50`}>
                      <div className="flex items-center space-x-3 mb-3">
                        <sub.icon className={`w-8 h-8 ${currentColor.iconColor}`} />
                        <h3 className="text-xl font-bold text-gray-800">{sub.title}</h3>
                      </div>
                      <p className="text-gray-600">{sub.description}</p>
                      <div className={`mt-4 text-sm font-semibold flex items-center ${currentColor.iconColor}`}>
                        View Details <ChevronRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-12 text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Join the SOEE Program
              </h2>
              <p className="text-xl mb-8 text-emerald-100 max-w-2xl mx-auto">
                Contribute to environmental education and community outreach initiatives
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link 
                  href="/join-our-mission" 
                  className="px-8 py-3 bg-white text-emerald-700 font-bold rounded-full transition-all duration-300 hover:bg-emerald-50"
                >
                  Get Involved
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

export default NewSOEEPage;