"use client";

import React, { useState, useEffect, useMemo } from 'react';

interface Dot {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  opacity: number;
  animationDelay: string;
  animationDuration: string;
}

interface DynamicPatternBackgroundProps {
  dotCount?: number;
  colors?: string[];
  minSize?: number;
  maxSize?: number;
  minOpacity?: number;
  maxOpacity?: number;
  animationSpeed?: number; // in seconds
}

const defaultColors = [
  'rgba(144, 238, 144, 0.7)', // LightGreen
  'rgba(152, 251, 152, 0.7)', // PaleGreen
  'rgba(173, 255, 47, 0.7)',  // GreenYellow
  'rgba(60, 179, 113, 0.7)',  // MediumSeaGreen
];

const DynamicPatternBackground: React.FC<DynamicPatternBackgroundProps> = ({
  dotCount = 50,
  colors = defaultColors,
  minSize = 5,
  maxSize = 20,
  minOpacity = 0.2,
  maxOpacity = 0.8,
  animationSpeed = 5,
}) => {
  const dots = useMemo(() => {
    const generatedDots: Dot[] = [];
    for (let i = 0; i < dotCount; i++) {
      generatedDots.push({
        id: `dot-${i}`,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: minSize + Math.random() * (maxSize - minSize),
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: minOpacity + Math.random() * (maxOpacity - minOpacity),
        animationDelay: `${Math.random() * animationSpeed}s`,
        animationDuration: `${animationSpeed + Math.random() * animationSpeed}s`,
      });
    }
    return generatedDots;
  }, [dotCount, colors, minSize, maxSize, minOpacity, maxOpacity, animationSpeed]);

  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      {dots.map(dot => (
        <div
          key={dot.id}
          className="absolute rounded-full animate-float-pattern"
          style={{
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            width: `${dot.size}px`,
            height: `${dot.size}px`,
            backgroundColor: dot.color,
            opacity: dot.opacity,
            animationDelay: dot.animationDelay,
            animationDuration: dot.animationDuration,
          }}
        />
      ))}
    </div>
  );
};

export default DynamicPatternBackground;
