import React from 'react';
import Image from 'next/image';

const HeroSection: React.FC = () => {
  return (
    <section className="relative h-screen w-full flex items-center justify-center text-white overflow-hidden">
      {/* Background with abstract nature image and gradient overlay */}
      <Image
        src="/images/backgrounds/hero-background.jpg"
        alt="Serene minimalist landscape with lush green trees and clear blue sky"
        layout="fill"
        objectFit="cover"
        quality={90}
        className="z-0"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/40 z-0"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.5)_100%)] z-0"></div>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-6">
            Prithvi Nature Club
          </h1>
          <p className="text-xl md:text-2xl font-light max-w-3xl mx-auto opacity-95 leading-relaxed">
            Cultivating a Greener Tomorrow, One Step at a Time
          </p>
        </div>
        <div className="mt-10">
          <button className="bg-white/10 backdrop-blur-md text-white px-8 py-3 rounded-full text-base font-medium tracking-wide hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20">
            Explore Our Impact
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
