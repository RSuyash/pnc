import React from 'react';
import { FiTarget, FiCompass } from 'react-icons/fi';

const MissionVisionCards = () => {
  return (
    <section className="py-16 relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Mission Card */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/50 transform transition-all duration-500 hover:scale-[1.02]">
            <div className="flex items-center mb-6">
              <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mr-4">
                <FiTarget className="text-emerald-700 text-2xl" />
              </div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">Our Mission</h2>
            </div>
            <p className="text-gray-800 leading-relaxed text-lg">
              To actively engage in and promote environmental conservation, protection, and sustainability within our community and beyond, empowering students to become lifelong advocates for the Earth.
            </p>
          </div>
          
          {/* Vision Card */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/50 transform transition-all duration-500 hover:scale-[1.02]">
            <div className="flex items-center mb-6">
              <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center mr-4">
                <FiCompass className="text-teal-700 text-2xl" />
              </div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">Our Vision</h2>
            </div>
            <p className="text-gray-800 leading-relaxed text-lg">
              We envision a world where humanity lives in harmony with nature, where every individual understands their role in preserving our planet for future generations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionVisionCards;