import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { PROJECTS_DATA } from '@/data/projects';
import { ChevronRight } from 'lucide-react';

const ChandeVillagePage: React.FC = () => {
  const soeeProject = PROJECTS_DATA.find(p => p.id === 'soee');
  const chandeProject = soeeProject?.subProjects?.find(p => p.id === 'chande');

  if (!chandeProject) return <div>Error: Chande Village data not found.</div>;

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Projects', href: '/projects' },
    { label: 'SOEE', href: '/projects/soee' },
    { label: chandeProject.title, href: '/projects/soee/chande' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6">
        <Breadcrumbs items={breadcrumbItems} />

        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">
          {chandeProject.title}: A Key SOEE Fieldwork Initiative
        </h1>
        <p className="text-xl text-green-700 font-medium mb-12">
          Applied solutions for sustainable water and waste management in Chande Village, Pune.
        </p>

        {/* Metrics Section */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white p-6 rounded-xl shadow-lg mb-12">
          {chandeProject.details?.metrics?.map(m => (
            <div key={m.label} className="text-center">
              <p className="text-3xl font-bold text-blue-700">{m.value}</p>
              <p className="text-sm text-gray-600 mt-1">{m.label}</p>
            </div>
          ))}
        </div>

        {/* Detailed Content (from previous draft, now structured) */}
        <div className="space-y-6 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800">1. Community-Based Water Resource Management</h2>
          <p className="text-gray-700">
            Utilizing <strong>Geo-spatial Analysis (GIS)</strong>, students identified optimal sites for decentralized water harvesting structures. This phase included collaborating with villagers to build and manage small check dams and recharge pits, ensuring long-term resource security.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-800">2. Decentralized Solid Waste Management</h2>
          <p className="text-gray-700">
            The team implemented a simple two-bin segregation system, coupled with the establishment of a central <strong>vermicomposting unit</strong>. This not only addressed pollution but also created a valuable source of soil amendment and a new income opportunity for local self-help groups.
          </p>

          <h2 className="text-2xl font-bold text-gray-800">3. Environmental Literacy Program</h2>
          <p className="text-gray-700">
            Beyond physical infrastructure, the project delivered an age-appropriate curriculum to the local <strong>Chande School</strong>, focused on local biodiversity and ecological principles, ensuring long-term environmental stewardship within the community.
          </p>
        </div>

        <div className="text-center mt-12">
          <Link href="/projects/soee">
            <span className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 transition-colors duration-300">
              <ChevronRight className="w-5 h-5 mr-2 transform rotate-180" /> Back to SOEE Hub
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};


export default ChandeVillagePage;
