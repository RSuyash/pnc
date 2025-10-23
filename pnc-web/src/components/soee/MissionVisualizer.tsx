import React from 'react';
import { Leaf, BookOpen, Users, GraduationCap, Lightbulb, Globe } from 'lucide-react';

const concepts = [
  { id: 'pnc-effort', text: 'PNC\'s Comprehensive Effort', icon: Leaf, bgColor: 'rgba(255, 255, 255, 0.15)', borderColor: 'rgba(255, 255, 255, 0.6)', textColor: 'text-gray-800', size: 'w-32 h-32 text-base', position: { top: '50%', left: '50%' }, center: { x: 50, y: 50 } },
  { id: 'env-action', text: 'Environmental Action', icon: Globe, bgColor: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.4)', textColor: 'text-gray-800', size: 'w-24 h-24 text-sm', position: { top: '10%', left: '10%' }, center: { x: 20, y: 20 } },
  { id: 'academic-fieldwork', text: 'Academic Fieldwork', icon: BookOpen, bgColor: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.4)', textColor: 'text-gray-800', size: 'w-24 h-24 text-sm', position: { top: '10%', right: '10%' }, center: { x: 80, y: 20 } },
  { id: 'msc-students', text: 'M.Sc. Students', icon: GraduationCap, bgColor: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.4)', textColor: 'text-gray-800', size: 'w-24 h-24 text-sm', position: { bottom: '10%', left: '10%' }, center: { x: 20, y: 80 } },
  { id: 'school-outreach', text: 'School Outreach', icon: Users, bgColor: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.4)', textColor: 'text-gray-800', size: 'w-24 h-24 text-sm', position: { bottom: '10%', right: '10%' }, center: { x: 80, y: 80 } },
  { id: 'data-solutions', text: 'Data-Driven Solutions', icon: Lightbulb, bgColor: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.4)', textColor: 'text-gray-800', size: 'w-24 h-24 text-sm', position: { top: '40%', left: '0%' }, center: { x: 10, y: 50 } },
  { id: 'rural-communities', text: 'Rural Communities', icon: Globe, bgColor: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.4)', textColor: 'text-gray-800', size: 'w-24 h-24 text-sm', position: { top: '40%', right: '0%' }, center: { x: 90, y: 50 } },
];

const connections = [
    { from: 'pnc-effort', to: 'env-action', color: '#4CAF50' },
    { from: 'pnc-effort', to: 'academic-fieldwork', color: '#FFC107' },
    { from: 'pnc-effort', to: 'msc-students', color: '#2196F3' },
    { from: 'pnc-effort', to: 'school-outreach', color: '#FF5722' },
    { from: 'pnc-effort', to: 'data-solutions', color: '#00BCD4' },
    { from: 'pnc-effort', to: 'rural-communities', color: '#FF9800' },
];

const MissionVisualizer: React.FC = () => {
  return (
    <div className="relative w-full h-96 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-4 overflow-hidden shadow-inner flex items-center justify-center">
      <svg className="absolute inset-0 w-full h-full z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto" markerUnits="strokeWidth">
            <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
          </marker>
        </defs>
        {connections.map((conn, index) => {
          const fromConcept = concepts.find(c => c.id === conn.from);
          const toConcept = concepts.find(c => c.id === conn.to);
          if (!fromConcept || !toConcept) return null;

          return (
            <path
              key={index}
              d={`M${fromConcept.center.x},${fromConcept.center.y} L${toConcept.center.x},${toConcept.center.y}`}
              stroke={conn.color}
              strokeWidth="0.5"
              fill="none"
              className="path"
              markerEnd="url(#arrowhead)"
              style={{ animationDelay: `${index * 0.2}s` }}
            />
          );
        })}
      </svg>

      {concepts.map(concept => (
        <div
          key={concept.id}
          className={`absolute rounded-full flex flex-col items-center justify-center shadow-2xl backdrop-blur-md transform transition duration-300 hover:scale-105 animate-float-subtle ${concept.textColor} ${concept.size} px-4 py-2 z-10`}
          style={{
            top: concept.position.top,
            left: concept.position.left,
            right: concept.position.right,
            bottom: concept.position.bottom,
            transform: concept.id === 'pnc-effort' ? 'translate(-50%, -50%)' : 'none',
            background: `linear-gradient(90deg, ${concept.bgColor}, ${concept.bgColor})`,
            border: `1px solid ${concept.borderColor}`,
          }}
        >
          {React.createElement(concept.icon, { className: "w-8 h-8 mb-1" })}
          <span className="text-center font-bold">{concept.text}</span>
        </div>
      ))}
    </div>
  );
};

export default MissionVisualizer;