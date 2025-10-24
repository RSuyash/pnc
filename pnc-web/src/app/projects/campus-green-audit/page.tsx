import React from 'react';
import { PROJECTS_DATA } from '@/data/projects';
import { Users, BookOpen, ChevronRight, Globe } from 'lucide-react';
import Link from 'next/link';

const CampusGreenAuditPage: React.FC = () => {
  const project = PROJECTS_DATA.find(p => p.id === 'campus-green-audit');
  
  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Campus Green Audit Project Not Found</h1>
          <Link href="/projects" className="text-emerald-600 hover:underline">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-teal-50">
      <div className="pt-20"> {/* Add padding to account for fixed header */}
        {/* Project Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center" 
               style={{ backgroundImage: "url('/images/projects/project-campus-green-audit.jpg')", opacity: 0.3 }}></div>
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
                  {project.title}
                </span>
              </div>
              
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mr-4">
                  <Users className="w-8 h-8 text-emerald-700" />
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
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">About This Initiative</h2>
                  <p className="text-gray-700 mb-6">
                    The MIT-WPU Campus Green Audit is a comprehensive environmental assessment of the campus infrastructure and sustainability practices. This initiative aims to evaluate and improve the environmental footprint of the university through systematic review of energy usage, waste management, green spaces, and other sustainability metrics.
                  </p>
                  
                  <Link 
                    href="/join-our-mission" 
                    className="inline-flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full transition-all duration-300"
                  >
                    Get Involved
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
                
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Project Highlights</h2>
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mr-4 flex-shrink-0">
                        <Globe className="w-5 h-5 text-emerald-700" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">Comprehensive Assessment</h3>
                        <p className="text-gray-700">Detailed evaluation of all campus sustainability aspects.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mr-4 flex-shrink-0">
                        <Users className="w-5 h-5 text-emerald-700" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">Student-Led Initiative</h3>
                        <p className="text-gray-700">Engaging students in environmental assessment and improvement.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mr-4 flex-shrink-0">
                        <BookOpen className="w-5 h-5 text-emerald-700" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">Data-Driven Solutions</h3>
                        <p className="text-gray-700">Using audit results to implement targeted improvements.</p>
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
                Support Campus Sustainability
              </h2>
              <p className="text-xl mb-8 text-emerald-100 max-w-2xl mx-auto">
                Help us create a greener campus environment
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link 
                  href="/join-our-mission" 
                  className="px-8 py-3 bg-white text-emerald-700 font-bold rounded-full transition-all duration-300 hover:bg-emerald-50"
                >
                  Join Our Mission
                </Link>
                <Link 
                  href="/become-a-partner" 
                  className="px-8 py-3 bg-transparent border-2 border-white text-white font-medium rounded-full transition-all duration-300 hover:bg-white/10"
                >
                  Become a Partner
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CampusGreenAuditPage;