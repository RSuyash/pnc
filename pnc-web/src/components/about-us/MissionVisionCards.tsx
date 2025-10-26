import React from 'react';
import { FiTarget, FiCompass } from 'react-icons/fi';

const MissionVisionCards = () => {
  return (
    <section className="py-12 sm:py-16 relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Mission Card */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border border-white/50 transform transition-all duration-500 hover:scale-[1.02]">
            <div className="flex items-center mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-100 flex items-center justify-center mr-3 sm:mr-4">
                <FiTarget className="text-emerald-700 text-xl sm:text-2xl" />
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-gray-900">Our Mission</h2>
            </div>
            <p className="text-sm sm:text-base md:text-lg text-gray-800 leading-relaxed">
              To actively engage in and promote environmental conservation, protection, and sustainability within our community and beyond, empowering students to become lifelong advocates for the Earth.
            </p>
          </div>
          
          {/* Vision Card */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border border-white/50 transform transition-all duration-500 hover:scale-[1.02]">
            <div className="flex items-center mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-teal-100 flex items-center justify-center mr-3 sm:mr-4">
                <FiCompass className="text-teal-700 text-xl sm:text-2xl" />
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-gray-900">Our Vision</h2>
            </div>
            <p className="text-sm sm:text-base md:text-lg text-gray-800 leading-relaxed">
              We envision a world where humanity lives in harmony with nature, where every individual understands their role in preserving our planet for future generations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionVisionCards;