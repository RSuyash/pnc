import React from 'react';
import Link from 'next/link';
import HeroSection from './HeroSection';
import ProjectShowcase from './ProjectShowcase';
import PartnersTestimonials from './PartnersTestimonials';
import MentorsTestimonials from './MentorsTestimonials';
import GetInvolved from './GetInvolved';
import ProfessionalShowcase from './ProfessionalShowcase';
import Footer from './Footer';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-pnc-sand text-pnc-green-dark font-sans">
      <HeroSection />
      <ProjectShowcase />
      <MentorsTestimonials />
      <PartnersTestimonials />
      <GetInvolved />
      <ProfessionalShowcase />
      <Footer />
    </div>
  );
};

export default HomePage;