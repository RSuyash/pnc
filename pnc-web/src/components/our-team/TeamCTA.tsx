import React from 'react';

const TeamCTA = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-12 text-center">
          <h2 className="text-4xl font-serif font-bold text-white mb-6">
            Join Our Team
          </h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-3xl mx-auto">
            Be part of a passionate community dedicated to creating a sustainable future. 
            We're always looking for motivated individuals to join our mission.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="
              px-8 py-4 bg-white text-emerald-700 font-semibold rounded-full shadow-lg
              transform transition-all duration-300 hover:scale-105 hover:shadow-xl
              flex items-center justify-center space-x-2
            ">
              <span>Apply Now</span>
            </button>
            <button className="
              px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-full
              transform transition-all duration-300 hover:scale-105 hover:bg-white/10
              flex items-center justify-center space-x-2
            ">
              <span>Learn About Roles</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamCTA;