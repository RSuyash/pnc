
'use client';
import React, { useRef } from 'react';
import Image from 'next/image';

const BecomeAPartnerPage: React.FC = () => {
  const benefitsSectionRef = useRef<HTMLDivElement>(null);
  
  const scrollToBenefitsSection = () => {
    benefitsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handlePartnerNow = () => {
    // Redirect to the signup/login page
    window.location.href = '/auth';
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-teal-50 to-emerald-50">
      <div>
        {/* Hero Section */}
        <section className="relative h-[600px] w-full flex items-center justify-center text-white overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
            alt="Become a Partner - Nature Conservation"
            layout="fill"
            objectFit="cover"
            quality={90}
            className="z-0"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-black/20 z-0"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.3)_100%)] z-0"></div>
          
          <div className="relative z-10 text-center px-4 max-w-3xl mx-auto pt-10">
            <h1 className="text-5xl md:text-6xl font-serif font-bold leading-tight mb-6">
              Become a Partner
            </h1>
            <p className="text-xl md:text-2xl font-light max-w-2xl mx-auto opacity-95 leading-relaxed">
              Partner with us to amplify our impact. We offer various partnership opportunities tailored to mutual goals.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={scrollToBenefitsSection}
                className="bg-white text-emerald-700 px-8 py-4 rounded-full text-lg font-bold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Learn More
              </button>
              <button 
                onClick={handlePartnerNow}
                className="bg-emerald-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Partner With Us
              </button>
            </div>
          </div>
        </section>

        {/* Partnership Benefits Section */}
        <section id="partnership-benefits" ref={benefitsSectionRef} className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-serif font-bold text-gray-900 mb-6">Partnership Benefits</h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
                When you partner with Prithvi Nature Club, you align your organization with a committed environmental 
                mission while gaining valuable marketing, community, and sustainability advantages.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-white to-emerald-50 rounded-xl p-8 shadow-md border border-emerald-100/50">
                <div className="text-emerald-700 text-4xl mb-4">🌿</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Brand Alignment</h3>
                <p className="text-gray-700">
                  Align your brand with environmental responsibility and demonstrate your commitment to sustainability.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-white to-emerald-50 rounded-xl p-8 shadow-md border border-emerald-100/50">
                <div className="text-emerald-700 text-4xl mb-4">📈</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Marketing Exposure</h3>
                <p className="text-gray-700">
                  Gain visibility through our events, publications, and digital channels reaching thousands of environmentally conscious individuals.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-white to-emerald-50 rounded-xl p-8 shadow-md border border-emerald-100/50">
                <div className="text-emerald-700 text-4xl mb-4">🤝</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Community Connection</h3>
                <p className="text-gray-700">
                  Connect with a passionate community of environmental advocates and like-minded organizations.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-white to-emerald-50 rounded-xl p-8 shadow-md border border-emerald-100/50">
                <div className="text-emerald-700 text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Targeted Reach</h3>
                <p className="text-gray-700">
                  Access our network of environmentally conscious individuals who align with your values and services.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-white to-emerald-50 rounded-xl p-8 shadow-md border border-emerald-100/50">
                <div className="text-emerald-700 text-4xl mb-4">🎓</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Educational Impact</h3>
                <p className="text-gray-700">
                  Contribute to meaningful environmental education and awareness initiatives that create lasting impact.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-white to-emerald-50 rounded-xl p-8 shadow-md border border-emerald-100/50">
                <div className="text-emerald-700 text-4xl mb-4">🌱</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Sustainability Goals</h3>
                <p className="text-gray-700">
                  Support concrete environmental projects that help you achieve your own sustainability and CSR objectives.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Partnership Types Section */}
        <section className="py-16 bg-gradient-to-br from-teal-50 to-emerald-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">Partnership Types</h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                We offer flexible partnership opportunities designed to meet various organizational goals and capabilities.
              </p>
            </div>
            
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-emerald-100/30">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 text-emerald-700">Silver Partnership</h3>
                  <div className="text-4xl font-bold text-gray-900 mb-6">₹10,000<span className="text-lg font-normal text-gray-600">/year</span></div>
                  
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start">
                      <span className="text-emerald-500 mr-2">✓</span>
                      <span className="text-gray-700">Logo placement on our website</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-500 mr-2">✓</span>
                      <span className="text-gray-700">Social media recognition</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-500 mr-2">✓</span>
                      <span className="text-gray-700">Quarterly project reports</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-500 mr-2">✓</span>
                      <span className="text-gray-700">Event invitation for 2 people</span>
                    </li>
                  </ul>
                  
                  <button className="w-full bg-emerald-100 text-emerald-700 py-3 rounded-lg font-medium hover:bg-emerald-200 transition-colors duration-300">
                    Choose Silver
                  </button>
                </div>
                
                <div className="bg-gradient-to-br from-white to-emerald-50 rounded-2xl shadow-xl p-8 border-2 border-emerald-600 relative">
                  <div className="absolute top-0 right-0 bg-emerald-600 text-white px-4 py-1 rounded-bl-lg rounded-tr-lg text-sm font-bold">
                    MOST POPULAR
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 text-emerald-700">Gold Partnership</h3>
                  <div className="text-4xl font-bold text-gray-900 mb-6">₹25,000<span className="text-lg font-normal text-gray-600">/year</span></div>
                  
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start">
                      <span className="text-emerald-500 mr-2">✓</span>
                      <span className="text-gray-700">Prominent logo placement</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-500 mr-2">✓</span>
                      <span className="text-gray-700">Dedicated social media posts</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-500 mr-2">✓</span>
                      <span className="text-gray-700">Monthly impact reports</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-500 mr-2">✓</span>
                      <span className="text-gray-700">Event invitation for 5 people</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-500 mr-2">✓</span>
                      <span className="text-gray-700">Co-branded educational materials</span>
                    </li>
                  </ul>
                  
                  <button className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors duration-300">
                    Choose Gold
                  </button>
                </div>
                
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-emerald-100/30">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 text-emerald-700">Platinum Partnership</h3>
                  <div className="text-4xl font-bold text-gray-900 mb-6">₹50,000<span className="text-lg font-normal text-gray-600">/year</span></div>
                  
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start">
                      <span className="text-emerald-500 mr-2">✓</span>
                      <span className="text-gray-700">Featured logo placement</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-500 mr-2">✓</span>
                      <span className="text-gray-700">Custom social media campaigns</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-500 mr-2">✓</span>
                      <span className="text-gray-700">Bi-weekly impact reports</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-500 mr-2">✓</span>
                      <span className="text-gray-700">Event invitation for 10 people</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-500 mr-2">✓</span>
                      <span className="text-gray-700">Exclusive event co-hosting</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-500 mr-2">✓</span>
                      <span className="text-gray-700">Direct project collaboration</span>
                    </li>
                  </ul>
                  
                  <button className="w-full bg-emerald-100 text-emerald-700 py-3 rounded-lg font-medium hover:bg-emerald-200 transition-colors duration-300">
                    Choose Platinum
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Partner Stories Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">Partner Stories</h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                Hear from some of our valued partners about their partnership experiences.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-8 shadow-md border border-emerald-100/50">
                <div className="text-emerald-700 text-2xl mb-4">&quot;</div>
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  Partnering with Prithvi Nature Club has allowed us to authentically connect with our community while 
                  demonstrating our commitment to environmental sustainability. The collaboration has been mutually beneficial 
                  and has strengthened our brand&apos;s values.
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gray-300 mr-4"></div>
                  <div>
                    <h4 className="font-bold text-gray-900">Rajesh Kumar</h4>
                    <p className="text-gray-600 text-sm">CSR Head, GreenTech Solutions</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-8 shadow-md border border-emerald-100/50">
                <div className="text-emerald-700 text-2xl mb-4">&quot;</div>
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  Our partnership with the club has helped us engage with environmentally conscious consumers while 
                  supporting meaningful conservation projects. It&apos;s been a perfect alignment with our corporate values.
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gray-300 mr-4"></div>
                  <div>
                    <h4 className="font-bold text-gray-900">Priya Sharma</h4>
                    <p className="text-gray-600 text-sm">Marketing Director, EcoLife Products</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-serif font-bold mb-6">Start Your Partnership Journey</h2>
            <p className="text-xl max-w-2xl mx-auto mb-8 opacity-90">
              Join our network of forward-thinking organizations committed to environmental stewardship.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-white text-emerald-700 px-8 py-4 rounded-full text-lg font-bold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl">
                Partner With Us
              </button>
              <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-white/10 transition-all duration-300">
                Download Partnership Brochure
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default BecomeAPartnerPage;
