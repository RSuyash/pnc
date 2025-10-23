
import React from 'react';

const MissionVision: React.FC = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Our Mission */}
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              To actively engage in and promote environmental conservation, protection, and sustainability within our community and beyond, empowering students to become lifelong advocates for the Earth.
            </p>
          </div>
          
          {/* Our Vision */}
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">Our Vision</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              We envision a world where humanity lives in harmony with nature, where every individual understands their role in preserving our planet for future generations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionVision;
