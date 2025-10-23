"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface Partner {
  id: number;
  name: string;
  logo: string;
}

interface PartnerCarouselProps {
  partners: Partner[];
}

const PartnerCarousel: React.FC<PartnerCarouselProps> = ({ partners }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCount, setShowCount] = useState(3);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setShowCount(window.innerWidth < 640 ? 1 : 3);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let autoScroll: ReturnType<typeof setInterval> | null = null;
    if (showCount > 1) {
      autoScroll = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % partners.length);
      }, 2800);
    }
    return () => {
      if (autoScroll) clearInterval(autoScroll);
    };
  }, [showCount, partners.length]); // Added partners.length to dependency array

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % partners.length);
  };
  const handlePrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + partners.length) % partners.length
    );
  };

  useEffect(() => {
    let startX: number | null = null;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      if (startX === null) return;
      const endX = e.changedTouches[0].clientX;
      if (endX - startX > 40) handlePrev();
      if (startX - endX > 40) handleNext();
      startX = null;
    };
    const carouselEl = carouselRef.current;
    if (carouselEl) {
      carouselEl.addEventListener("touchstart", handleTouchStart);
      carouselEl.addEventListener("touchend", handleTouchEnd);
    }
    return () => {
      if (carouselEl) {
        carouselEl.removeEventListener("touchstart", handleTouchStart);
        carouselEl.removeEventListener("touchend", handleTouchEnd);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleNext, handlePrev]); // Added handleNext, handlePrev to dependency array

  return (
    <div className="relative w-full max-w-4xl mx-auto rounded-lg shadow-xl bg-white/30 backdrop-blur-md border border-white/50 py-6 px-4">
      <div className="flex overflow-hidden">
        {partners.map((partner, index) => (
          <div
            key={partner.id + "carousel"}
            className={`w-full flex-shrink-0 flex items-center justify-center p-4 transition-transform duration-500 ease-in-out`}
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            <div
              title={partner.name}
              className={`bg-white rounded-xl shadow-md flex items-center justify-center h-24 w-40 mx-2 transition-all duration-300 border border-green-200 relative ${index === Math.floor(showCount / 2) ? 'scale-105 shadow-xl z-10' : ''}`}
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                layout="fill"
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-4 space-x-2">
        {partners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 w-2 rounded-full ${idx === currentIndex ? 'bg-green-700' : 'bg-green-300'} hover:bg-green-500 transition-colors`}
          />
        ))}
      </div>
      <button
        onClick={handlePrev}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-green-100 text-green-700 p-3 rounded-full z-10 hover:bg-green-300 transition-colors shadow-md focus:outline-none hidden sm:block"
      >
        <FiChevronLeft className="h-8 w-8" />
      </button>
      <button
        onClick={handleNext}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-green-100 text-green-700 p-3 rounded-full z-10 hover:bg-green-300 transition-colors shadow-md focus:outline-none hidden sm:block"
      >
        <FiChevronRight className="h-8 w-8" />
      </button>
    </div>
  );
};

export default PartnerCarousel;
