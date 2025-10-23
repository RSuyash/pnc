import React from 'react';

const EnhancedHeroSection = () => {
  return (
    <section className="relative w-full" style={{paddingTop: '56.25%'}} > {/* 16:9 aspect ratio */}
      <div className="absolute inset-0">
        {/* Background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2071&auto=format&fit=crop')",
          }}
        ></div>
        
        {/* Light overlay for better text contrast */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
      </div>
      
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-white/50 max-w-4xl w-full mx-4">
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-4 animate-fade-in text-center">
            Our Commitment to the Planet
          </h1>
          <p className="text-lg md:text-xl text-gray-800 mb-8 animate-fade-in delay-100 text-center">
            We are a student-led organization dedicated to fostering a sustainable future through action, education, and community engagement.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in delay-200">
            <button className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full transition-all duration-300 transform hover:scale-105">
              Join Our Mission
            </button>
            <button className="px-6 py-3 bg-transparent border-2 border-emerald-600 text-emerald-800 hover:bg-emerald-50 rounded-full transition-all duration-300">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedHeroSection;