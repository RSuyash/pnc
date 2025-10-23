
'use client';
import React, { useState } from 'react';
import TeamStructure from './TeamStructure';
import ExecutiveDirectory from './ExecutiveDirectory';
import DepartmentShowcase from './DepartmentShowcase';
import TeamSpotlight from './TeamSpotlight';
import TeamCTA from './TeamCTA';

const OurTeamPage = () => {
  const [teamYear, setTeamYear] = useState<'active' | 'inactive'>('active');
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-teal-50">
      <div className="pt-20"> {/* Add padding to account for fixed header */}
        <TeamStructure />
        <ExecutiveDirectory teamYear={teamYear} setTeamYear={setTeamYear} />
        <DepartmentShowcase teamYear={teamYear} />
        <TeamSpotlight />
        <TeamCTA />
      </div>
    </main>
  );
};

export default OurTeamPage;
