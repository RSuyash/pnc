
import React from 'react';

// You can replace these with your actual SVG icons
const SustainabilityIcon = () => <svg className="h-12 w-12 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const CommunityIcon = () => <svg className="h-12 w-12 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const EducationIcon = () => <svg className="h-12 w-12 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;


const CoreValues: React.FC = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900">Our Core Values</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-12 text-center">
          {/* Value 1 */}
          <div className="flex flex-col items-center">
            <SustainabilityIcon />
            <h3 className="text-2xl font-serif font-semibold mt-4 mb-2 text-gray-900">Sustainability</h3>
            <p className="text-gray-700 leading-relaxed">We champion practices that meet the needs of the present without compromising the future.</p>
          </div>
          {/* Value 2 */}
          <div className="flex flex-col items-center">
            <CommunityIcon />
            <h3 className="text-2xl font-serif font-semibold mt-4 mb-2 text-gray-900">Community</h3>
            <p className="text-gray-700 leading-relaxed">We believe in the power of collective action and strive to build an inclusive environmental community.</p>
          </div>
          {/* Value 3 */}
          <div className="flex flex-col items-center">
            <EducationIcon />
            <h3 className="text-2xl font-serif font-semibold mt-4 mb-2 text-gray-900">Education</h3>
            <p className="text-gray-700 leading-relaxed">We are committed to raising awareness and sharing knowledge to inspire informed action.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoreValues;
