import React from 'react';

const TeamStructure = () => {
  return (
    <section className="pt-20 py-12 bg-gradient-to-b from-emerald-50/20 to-teal-50/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-3">
            Our Team Structure
          </h1>
          <p className="text-base md:text-lg text-gray-700 max-w-xl mx-auto">
            A comprehensive organizational structure that enables our mission through specialized departments and leadership
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {/* Executive Leadership Card */}
          <div className="group relative bg-gradient-to-br from-white to-emerald-50 rounded-xl p-5 shadow-lg hover:shadow-2xl border border-emerald-100/50 overflow-hidden transform transition-all duration-500 hover:-translate-y-2.5">
            {/* Animated floating elements */}
            <div className="absolute top-3 left-3 w-2 h-2 rounded-full bg-emerald-400 animate-float1"></div>
            <div className="absolute bottom-3 right-3 w-1.5 h-1.5 rounded-full bg-teal-400 animate-float2"></div>
            
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/5 group-hover:to-teal-500/5 transition-all duration-500"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-3 text-white shadow-lg transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                <span className="text-lg">🏛️</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors duration-300">Executive Leadership</h3>
              <p className="text-gray-600 text-xs leading-relaxed mt-1">
                Strategic direction and organizational oversight ensuring our mission remains on track
              </p>
              
              {/* Animated underline */}
              <div className="mt-3 w-0 group-hover:w-10 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-700"></div>
            </div>
          </div>
          
          {/* Media & Communications Card */}
          <div className="group relative bg-gradient-to-br from-white to-teal-50 rounded-xl p-5 shadow-lg hover:shadow-2xl border border-teal-100/50 overflow-hidden transform transition-all duration-500 hover:-translate-y-2.5">
            {/* Animated floating elements */}
            <div className="absolute top-4 right-3 w-2 h-2 rounded-full bg-teal-400 animate-float3"></div>
            <div className="absolute bottom-3 left-4 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-float1"></div>
            
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/0 to-cyan-500/0 group-hover:from-teal-500/5 group-hover:to-cyan-500/5 transition-all duration-500"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center mx-auto mb-3 text-white shadow-lg transform transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3">
                <span className="text-lg">📷</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-teal-700 transition-colors duration-300">Media & Communications</h3>
              <p className="text-gray-600 text-xs leading-relaxed mt-1">
                Content creation, visual storytelling and community engagement across all platforms
              </p>
              
              {/* Animated underline */}
              <div className="mt-3 w-0 group-hover:w-10 h-0.5 bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-700"></div>
            </div>
          </div>
          
          {/* Research & Innovation Card */}
          <div className="group relative bg-gradient-to-br from-white to-cyan-50 rounded-xl p-5 shadow-lg hover:shadow-2xl border border-cyan-100/50 overflow-hidden transform transition-all duration-500 hover:-translate-y-2.5">
            {/* Animated floating elements */}
            <div className="absolute top-3.5 left-3.5 w-2 h-2 rounded-full bg-cyan-400 animate-float2"></div>
            <div className="absolute bottom-3.5 right-3.5 w-1.5 h-1.5 rounded-full bg-blue-400 animate-float3"></div>
            
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/5 group-hover:to-blue-500/5 transition-all duration-500"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mx-auto mb-3 text-white shadow-lg transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                <span className="text-lg">🔬</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-cyan-700 transition-colors duration-300">Research & Innovation</h3>
              <p className="text-gray-600 text-xs leading-relaxed mt-1">
                Scientific inquiry and innovative solutions to advance our environmental mission
              </p>
              
              {/* Animated underline */}
              <div className="mt-3 w-0 group-hover:w-10 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-700"></div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes float1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(5deg); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-6px) rotate(-5deg); }
        }
        @keyframes float3 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(3deg); }
        }
        .animate-float1 {
          animation: float1 4s ease-in-out infinite;
        }
        .animate-float2 {
          animation: float2 5s ease-in-out infinite;
        }
        .animate-float3 {
          animation: float3 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default TeamStructure;