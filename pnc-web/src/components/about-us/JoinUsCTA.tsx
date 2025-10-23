
import React from 'react';
import Link from 'next/link';

const JoinUsCTA: React.FC = () => {
  return (
    <section className="py-24 bg-pnc-green-dark text-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
          Ready to Make a Difference?
        </h2>
        <p className="text-lg text-gray-200 max-w-2xl mx-auto mb-8">
          Join a community of like-minded individuals and be a part of the change. Your passion and skills can help us create a greener tomorrow.
        </p>
        <Link href="/apply" className="bg-gradient-to-r from-white to-gray-100 text-pnc-green-dark px-10 py-4 rounded-full text-lg font-extrabold tracking-wide hover:from-gray-100 hover:to-white hover:scale-105 transition-all duration-300 shadow-lg inline-block ring-2 ring-white ring-opacity-50">
          Get Involved Today
        </Link>
      </div>
    </section>
  );
};

export default JoinUsCTA;
