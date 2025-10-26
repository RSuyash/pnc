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
      <div className="pt-4"> {/* Reduced top padding now that breadcrumbs are separate */}
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center" 
               style={{ backgroundImage: "url('/images/projects/soee-banner.jpg')", opacity: 0.3 }}></div>
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/50 to-teal-100/60"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto">
              {/* Breadcrumbs */}
              <div className="flex items-center text-sm mb-6">
                <Link href="/" className="text-gray-700 hover:text-emerald-700 transition-colors duration-200 font-medium">
                  Home
                </Link>
                <ChevronRight className="h-4 w-4 text-gray-600/70 mx-2 flex-shrink-0" />
                <Link href="/projects" className="text-gray-700 hover:text-emerald-700 transition-colors duration-200 font-medium">
                  Projects
                </Link>
                <ChevronRight className="h-4 w-4 text-gray-600/70 mx-2 flex-shrink-0" />
                <span className="text-gray-900 font-medium">
                  School Outreach for Environmental Education
                </span>
              </div>
              
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mr-4">
                  <Zap className="w-6 h-6 text-emerald-700" />
                </div>
                <span className="bg-emerald-600 text-white text-sm font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Flagship Initiative
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-4">
                School Outreach for Environmental Education
              </h1>
              <p className="text-lg md:text-xl text-gray-800 max-w-3xl">
                Empowering the next generation with environmental knowledge and action.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg border border-white/50">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Leaf className="w-5 h-5 mr-2 text-emerald-700" /> SOEE&apos;s Mission
              </h2>
              <p className="text-base md:text-lg text-gray-800 leading-relaxed">
                The <strong className="text-emerald-700">PNC School Outreach for Environmental Education (SOEE) Program</strong> is PNC&apos;s comprehensive effort to integrate environmental action with academic fieldwork. It serves as the primary practical application platform for our M.Sc. Environmental Science students, focusing on school outreach for scalable, data-driven solutions in rural communities.
              </p>
            </div>
          </div>
        </section>

        {/* Core Focus */}
        <section className="py-12 bg-gradient-to-r from-emerald-100/30 to-teal-100/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8">Our Core Focus</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {/* Left Column: Key Pillars */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-emerald-200">
                  Key Pillars
                </h3>
                
                <div className="space-y-4">
                  {/* Pillar 1: Community Waste Management */}
                  <div className="p-4 rounded-xl border border-gray-200 bg-gradient-to-br from-emerald-50 to-teal-50">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mr-3">
                        <Droplet className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="text-base md:text-lg font-bold text-gray-900 mb-1">Community Waste Management</h4>
                        <p className="text-sm md:text-base text-gray-700">Implementing sustainable waste segregation and management practices in local communities.</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Pillar 2: Environmental Literacy */}
                  <div className="p-4 rounded-xl border border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mr-3">
                        <BookOpen className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="text-base md:text-lg font-bold text-gray-900 mb-1">Environmental Literacy</h4>
                        <p className="text-sm md:text-base text-gray-700">Developing curriculum and conducting workshops for local schools and community centers.</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Pillar 3: Community Empowerment */}
                  <div className="p-4 rounded-xl border border-gray-200 bg-gradient-to-br from-purple-50 to-violet-50">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center mr-3">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="text-base md:text-lg font-bold text-gray-900 mb-1">Community Empowerment</h4>
                        <p className="text-sm md:text-base text-gray-700">Training local communities in self-sustained waste and resource management practices.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Led By */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-emerald-200">
                  Led By
                </h3>
                
                <div className="space-y-4">
                  {/* Prajakta Jadhav */}
                  <div className="flex items-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm md:text-base font-bold mr-4 shadow-md">
                      PJ
                    </div>
                    <div>
                      <h4 className="text-base md:text-lg font-bold text-gray-900">Prajakta Jadhav</h4>
                      <p className="text-sm md:text-base text-gray-600 font-medium">Vice President, Project Lead</p>
                    </div>
                  </div>

                  {/* Dr. Pankaj Koparde */}
                  <div className="flex items-center p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-sm md:text-base font-bold mr-4 shadow-md">
                      PK
                    </div>
                    <div>
                      <h4 className="text-base md:text-lg font-bold text-gray-900">Dr. Pankaj Koparde</h4>
                      <p className="text-sm md:text-base text-gray-600 font-medium">Advisor & Mentor</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SOEE Fieldwork Initiatives */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8">SOEE Fieldwork Initiatives</h2>
            <div className={soeeSubProjects.length === 1 ? "flex justify-center" : "grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto"}>
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
                    <div className={`p-5 rounded-2xl shadow-lg transition duration-300 cursor-pointer bg-gradient-to-br ${currentColor.cardBg} border border-white/50 hover:shadow-xl`}>
                      <div className="flex items-center space-x-3 mb-3">
                        <sub.icon className={`w-6 h-6 ${currentColor.iconColor}`} />
                        <h3 className="text-lg font-bold text-gray-800">{sub.title}</h3>
                      </div>
                      <p className="text-sm md:text-base text-gray-600">{sub.description}</p>
                      <div className={`mt-3 text-xs md:text-sm font-semibold flex items-center ${currentColor.iconColor}`}>
                        View Details <ChevronRight className="w-3 h-3 ml-1" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-12">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-8 text-white">
              <h2 className="text-xl md:text-2xl font-bold mb-3">
                Join the SOEE Program
              </h2>
              <p className="text-sm md:text-base mb-6 text-emerald-100 max-w-xl mx-auto">
                Contribute to environmental education and community outreach initiatives
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Link 
                  href="/join-our-mission" 
                  className="px-6 py-2.5 bg-white text-emerald-700 font-bold rounded-full transition-all duration-300 hover:bg-emerald-50 text-sm md:text-base"
                >
                  Get Involved
                </Link>
                <Link 
                  href="/contact" 
                  className="px-6 py-2.5 bg-transparent border-2 border-white text-white font-medium rounded-full transition-all duration-300 hover:bg-white/10 text-sm md:text-base"
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