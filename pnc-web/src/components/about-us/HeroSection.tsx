
import React from 'react';
import Image from 'next/image';

const HeroSection: React.FC = () => {
  return (
    <section className="relative h-[60vh] md:h-[80vh] flex items-center justify-center text-white">
      <Image
        src="/images/about/hero-background.jpg"
        alt="A team of volunteers working together in a lush forest"
        layout="fill"
        objectFit="cover"
        className="brightness-50"
      />
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight">
          Our Commitment to the Planet
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-200">
          We are a student-led organization dedicated to fostering a sustainable future through action, education, and community engagement.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
