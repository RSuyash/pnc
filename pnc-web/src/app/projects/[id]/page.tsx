import React from 'react';
import { PROJECTS_DATA } from '@/data/projects';
import { Zap, Droplet, Users, BookOpen, Leaf, ChevronRight, Clock, Globe, Award } from 'lucide-react';
import Link from 'next/link';

interface ProjectDetailPageProps {
  params: {
    id: string;
  };
}

const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ params }) => {
  const project = PROJECTS_DATA.find(p => p.link === params.id);

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Project Not Found</h1>
          <Link href="/projects" className="text-emerald-600 hover:underline">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  // Define icons for different project types
  const getIconComponent = (icon: any) => {
    const icons: Record<string, React.ReactNode> = {
      Zap: <Zap className="w-8 h-8" />,
      Droplet: <Droplet className="w-8 h-8" />,
      Users: <Users className="w-8 h-8" />,
      BookOpen: <BookOpen className="w-8 h-8" />,
      Leaf: <Leaf className="w-8 h-8" />,
    };

    // Try to match the icon by name
    const iconKey = icon?.name || icon;
    return icons[iconKey] || icons.Zap; // Default to Zap icon
  };

  const iconComponent = getIconComponent(project.icon);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-teal-50">
      <div className="pt-20"> {/* Add padding to account for fixed header */}
        {/* Project Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center" 
               style={{ 
                 backgroundImage: project.id === 'soee' 
                   ? "url('/images/projects/soee-banner.jpg')" 
                   : project.id === 'byoc'
                   ? "url('/images/projects/project-byoc.jpg')"
                   : project.id === 'campus-green-audit'
                   ? "url('/images/projects/project-campus-green-audit.jpg')"
                   : project.id === 'eco-education'
                   ? "url('/images/projects/project-eco-education.jpg')"
                   : "url('https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=2070&auto=format&fit=crop')",
                 opacity: 0.15 }}></div>
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/70 to-teal-100/90"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mr-4">
                  {iconComponent}
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
                    {project.description}
                  </p>
                  
                  {project.details?.metrics && project.details.metrics.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Impact Metrics</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {project.details.metrics.map((metric, index) => (
                          <div key={index} className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                            <div className="text-2xl font-bold text-emerald-700">{metric.value}</div>
                            <div className="text-sm text-gray-600">{metric.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
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
                        <h3 className="font-bold text-lg text-gray-900">Environmental Impact</h3>
                        <p className="text-gray-700">Every initiative contributes directly to environmental conservation and sustainability goals.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mr-4 flex-shrink-0">
                        <Users className="w-5 h-5 text-emerald-700" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">Community Engagement</h3>
                        <p className="text-gray-700">We work directly with communities to create sustainable and lasting change.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mr-4 flex-shrink-0">
                        <BookOpen className="w-5 h-5 text-emerald-700" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">Educational Outreach</h3>
                        <p className="text-gray-700">Our projects include educational components to spread environmental awareness.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sub-Projects (if any) */}
        {project.subProjects && project.subProjects.length > 0 && (
          <section className="py-20 bg-gradient-to-r from-emerald-100/50 to-teal-100/50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Sub-Projects
                </h2>
                <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                  Detailed initiatives under this project
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {project.subProjects.map((subProject, index) => {
                  const subIcon = getIconComponent(subProject.icon);
                  
                  return (
                    <Link 
                      href={`/projects/${project.link}/${subProject.link}`} 
                      key={subProject.id}
                      className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-start">
                        <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mr-4 flex-shrink-0">
                          {subIcon}
                        </div>
                        <div>
                          <h3 className="font-bold text-xl text-gray-900 mb-2">{subProject.title}</h3>
                          <p className="text-gray-700 mb-3">{subProject.description}</p>
                          <div className="flex items-center text-emerald-600 font-medium">
                            <span>Explore</span>
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Call to Action */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-12 text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Contribute to This Project
              </h2>
              <p className="text-xl mb-8 text-emerald-100 max-w-2xl mx-auto">
                Your support helps us continue our important environmental work
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

export default ProjectDetailPage;