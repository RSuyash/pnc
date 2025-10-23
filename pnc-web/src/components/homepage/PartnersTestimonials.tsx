"use client";

import React from "react";
import Image from "next/image";
import PartnerCarousel from './PartnerCarousel';

// ---- PARTNER DATA ----
const partners = [
  { id: 1, name: "Partner 1", logo: "/images/partners/partner-company-1.png" },
  { id: 2, name: "Partner 2", logo: "/images/partners/partner-company-2.png" },
  { id: 3, name: "Partner 3", logo: "/images/partners/partner-company-3.png" },
  { id: 4, name: "Partner 4", logo: "/images/partners/partner-company-4.png" },
];

// ---- MODERN PARTNERS SECTION ----
const Partners: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Our Partners
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Collaboration for a Greener Tomorrow
          </p>
        </div>
        <PartnerCarousel partners={partners} />
      </div>
    </section>
  );
};

export default Partners;
