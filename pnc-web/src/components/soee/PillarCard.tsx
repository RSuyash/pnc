import React from 'react';
import { Droplet, BookOpen, Users, LucideIcon } from 'lucide-react'; // Import all possible icons

// Map icon names to their components
const iconComponents: { [key: string]: LucideIcon } = {
  Droplet: Droplet,
  BookOpen: BookOpen,
  Users: Users,
};

interface PillarCardProps {
  iconName: string; // Changed from icon: React.ElementType
  title: string;
  description: string;
  cardBg: string;
  cardBorder: string;
  iconBg: string;
  iconBorder: string;
  iconColor: string;
}

const PillarCard: React.FC<PillarCardProps> = ({ iconName, title, description, cardBg, cardBorder, iconBg, iconBorder, iconColor }) => {
  const Icon = iconComponents[iconName];
  if (!Icon) return null; // Handle case where iconName is not found

  return (
    <div className="p-6 rounded-xl text-center shadow-xl backdrop-blur-md transition duration-300 hover:shadow-2xl"
      style={{
        background: cardBg,
        border: cardBorder,
      }}>
      <div className="inline-block p-3 rounded-full mb-4"
        style={{
          backgroundColor: iconBg,
          border: iconBorder,
        }}>
          <Icon className="w-8 h-8" style={{ color: iconColor }} />
      </div>
      <h4 className="text-lg font-bold text-gray-800">{title}</h4>
      <p className="text-sm text-gray-600 mt-2">{description}</p>
    </div>
  );
};

export default PillarCard;
