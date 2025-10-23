import React from 'react';

const TeamSpotlight = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">
            Team Spotlight
          </h2>
          <p className="text-xl text-gray-800 max-w-3xl mx-auto">
            Highlighting the passion, expertise, and dedication of our members
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div className="space-y-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/50">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Diverse Expertise</h3>
              <p className="text-gray-800">
                Our team brings together individuals with diverse backgrounds in environmental science, 
                communications, research, and policy, creating a well-rounded approach to conservation.
              </p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/50">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Shared Vision</h3>
              <p className="text-gray-800">
                Every team member is united by a common passion for environmental conservation and 
                sustainability, driving our collective efforts toward meaningful impact.
              </p>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/50">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Team Impact</h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-800 font-medium">Environmental Projects</span>
                  <span className="text-gray-800 font-bold">50+</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-emerald-600 h-3 rounded-full" style={{width: '90%'}}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-800 font-medium">Active Members</span>
                  <span className="text-gray-800 font-bold">25+</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-teal-600 h-3 rounded-full" style={{width: '75%'}}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-800 font-medium">Community Outreach</span>
                  <span className="text-gray-800 font-bold">10K+</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-green-600 h-3 rounded-full" style={{width: '85%'}}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-800 font-medium">Trees Planted</span>
                  <span className="text-gray-800 font-bold">5000+</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-lime-600 h-3 rounded-full" style={{width: '80%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSpotlight;