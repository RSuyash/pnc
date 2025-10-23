"use client";

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion'; // Assuming framer-motion is available or will be added
import PillarCard from './PillarCard'; // Assuming PillarCard is in the same directory or accessible

interface PillarData {
  iconName: string; // Changed from icon: React.ElementType
  title: string;
  description: string;
  cardBg: string;
  cardBorder: string;
  iconBg: string;
  iconBorder: string;
  iconColor: string;
}

interface PillarDeckProps {
  pillars: PillarData[];
  autoPlay?: boolean;
  interval?: number;
}

const PillarDeck: React.FC<PillarDeckProps> = ({
  pillars,
  autoPlay = true,
  interval = 5000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoPlay || pillars.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % pillars.length);
    }, interval);

    return () => clearInterval(timer);
  }, [pillars.length, interval, autoPlay]);

  if (pillars.length === 0) {
    return <div className="text-center text-gray-500">No pillars to display.</div>;
  }

  const currentPillar = pillars[currentIndex];

  return (
    <div className="relative w-full h-[350px] flex items-center justify-center overflow-hidden rounded-xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex} // Important for AnimatePresence to detect changes
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <PillarCard
            iconName={currentPillar.iconName} // Changed from icon
            title={currentPillar.title}
            description={currentPillar.description}
            cardBg={currentPillar.cardBg}
            cardBorder={currentPillar.cardBorder}
            iconBg={currentPillar.iconBg}
            iconBorder={currentPillar.iconBorder}
            iconColor={currentPillar.iconColor}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PillarDeck;
