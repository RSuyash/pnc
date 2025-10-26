
'use client';
import React, { useRef } from 'react';
import Image from 'next/image';

const JoinOurMissionPage: React.FC = () => {
  const missionSectionRef = useRef<HTMLDivElement>(null);
  
  const scrollToMissionSection = () => {
    missionSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleApplyNow = () => {
    // Redirect to the signup/login page
    window.location.href = '/auth';
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-teal-50">
      <div>
        {/* Hero Section */}
        <section className="relative h-[600px] w-full flex items-center justify-center text-white overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
            alt="Join Our Mission - Nature Conservation"
            layout="fill"
            objectFit="cover"
            quality={90}
            className="z-0"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-black/20 z-0"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.3)_100%)] z-0"></div>
          
          <div className="relative z-10 text-center px-4 max-w-3xl mx-auto pt-10">
            <h1 className="text-5xl md:text-6xl font-serif font-bold leading-tight mb-6">
              Join Our Mission
            </h1>
            <p className="text-xl md:text-2xl font-light max-w-2xl mx-auto opacity-95 leading-relaxed">
              Become a part of something bigger. Explore opportunities to contribute to our mission and make a real difference.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={scrollToMissionSection}
                className="bg-white text-emerald-700 px-8 py-4 rounded-full text-lg font-bold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Learn More
              </button>
              <button 
                onClick={handleApplyNow}
                className="bg-emerald-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Apply Now
              </button>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section id="mission-section" ref={missionSectionRef} className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-serif font-bold text-gray-900 mb-6">Why Join Us?</h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
                At Prithvi Nature Club, we believe that every individual can make a significant impact in protecting our environment. 
                By joining our mission, you become part of a passionate community dedicated to conservation, education, and sustainable living.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-white to-emerald-50 rounded-xl p-8 shadow-md border border-emerald-100/50">
                <div className="text-emerald-700 text-4xl mb-4">🌱</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Environmental Impact</h3>
                <p className="text-gray-700">
                  Contribute to meaningful projects that have a direct, positive impact on our environment and local ecosystems.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-white to-emerald-50 rounded-xl p-8 shadow-md border border-emerald-100/50">
                <div className="text-emerald-700 text-4xl mb-4">🤝</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Community Connection</h3>
                <p className="text-gray-700">
                  Connect with like-minded individuals who share your passion for environmental conservation.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-white to-emerald-50 rounded-xl p-8 shadow-md border border-emerald-100/50">
                <div className="text-emerald-700 text-4xl mb-4">🎓</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Learning Opportunities</h3>
                <p className="text-gray-700">
                  Gain valuable knowledge and skills in environmental science, conservation, and sustainable practices.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How to Join Section */}
        <section className="py-16 bg-gradient-to-br from-emerald-50 to-teal-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">How to Join Our Mission</h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                There are multiple ways you can contribute to our mission based on your interests and availability.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-emerald-100/30">
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-emerald-100 rounded-full p-3 mr-4">
                      <span className="text-emerald-700 font-bold text-lg">1</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Volunteer Programs</h3>
                      <p className="text-gray-700">
                        Join our ongoing volunteer programs for hands-on environmental activities like tree planting, 
                        clean-up drives, wildlife monitoring, and educational outreach.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-emerald-100 rounded-full p-3 mr-4">
                      <span className="text-emerald-700 font-bold text-lg">2</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Membership</h3>
                      <p className="text-gray-700">
                        Become a full member to access exclusive events, workshops, and opportunities to lead conservation projects.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-emerald-100 rounded-full p-3 mr-4">
                      <span className="text-emerald-700 font-bold text-lg">3</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Skill-Based Contributions</h3>
                      <p className="text-gray-700">
                        Share your professional skills in areas like marketing, education, research, or technology to support our mission.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-emerald-100 rounded-full p-3 mr-4">
                      <span className="text-emerald-700 font-bold text-lg">4</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Educational Programs</h3>
                      <p className="text-gray-700">
                        Participate in or help organize educational workshops and awareness campaigns in schools and communities.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-10 text-center">
                  <button className="bg-emerald-600 text-white px-8 py-4 rounded-full text-lg font-medium tracking-wide hover:bg-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                    Get Started Today
                  </button>
                  <p className="mt-4 text-gray-600">
                    Contact us to learn more about upcoming opportunities
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-serif font-bold mb-6">Ready to Make a Difference?</h2>
            <p className="text-xl max-w-2xl mx-auto mb-8 opacity-90">
              Join hundreds of passionate individuals working together to protect and preserve our natural environment.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-white text-emerald-700 px-8 py-4 rounded-full text-lg font-bold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl">
                Sign Up Now
              </button>
              <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-white/10 transition-all duration-300">
                Contact Us
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default JoinOurMissionPage;
