
import React from 'react';
import Image from 'next/image';

interface Member {
  name: string;
  role: string;
  imageUrl: string;
}

const executiveCommittee: Member[] = [
  { name: "Soham Sonawane", role: "President", imageUrl: "/images/about/team/President.png" },
  { name: "Prajakta Jadhav", role: "Vice President", imageUrl: "/images/about/team/Vice_President.png" },
  { name: "Sharvari Tate", role: "Secretary", imageUrl: "/images/about/team/Secretary.png" },
  { name: "Suyash Rahegaonkar", role: "Treasurer", imageUrl: "/images/about/team/Treasurer.png" },
];

// Placeholder for other heads and members
const otherMembers: Member[] = [
  // { name: "Member Name", role: "Role", imageUrl: "/images/about/team/member-name.jpg" },
];

const TeamSection: React.FC = () => {
  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900">Meet the Team</h2>
          <p className="text-lg text-gray-600 mt-4">The driving force behind our mission.</p>
        </div>

        {/* Executive Committee Section */}
        <h3 className="text-3xl font-serif font-bold text-gray-800 text-center mb-10">Executive Committee</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {executiveCommittee.map(member => (
            <div key={member.name} className="text-center">
              <div className="relative h-64 w-64 mx-auto rounded-full overflow-hidden shadow-lg">
                <Image src={member.imageUrl} alt={`Photo of ${member.name}`} layout="fill" objectFit="cover" />
              </div>
              <h3 className="text-2xl font-serif font-semibold mt-6 mb-1 text-gray-900">{member.name}</h3>
              <p className="text-gray-700 font-medium">{member.role}</p>
            </div>
          ))}
        </div>

        {/* Other Heads and Members Section (Placeholder) */}
        {otherMembers.length > 0 && (
          <>
            <h3 className="text-3xl font-serif font-bold text-gray-800 text-center mb-10">Other Heads and Members</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
              {otherMembers.map(member => (
                <div key={member.name} className="text-center">
                  <div className="relative h-64 w-64 mx-auto rounded-full overflow-hidden shadow-lg">
                    <Image src={member.imageUrl} alt={`Photo of ${member.name}`} layout="fill" objectFit="cover" />
                  </div>
                  <h3 className="text-2xl font-serif font-semibold mt-6 mb-1 text-gray-900">{member.name}</h3>
                  <p className="text-pnc-green-dark font-medium">{member.role}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default TeamSection;
