import React from 'react';

const FloatingCTA = () => {
  return (
    <section className="relative py-12 sm:py-16 md:py-20 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-60 h-60 sm:w-80 sm:h-80 bg-emerald-100/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-60 h-60 sm:w-80 sm:h-80 bg-teal-100/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 shadow-xl border border-white/50 text-center max-w-3xl sm:max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4 sm:mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-800 mb-6 sm:mb-8 max-w-xl sm:max-w-2xl mx-auto">
            Join our mission to create a sustainable future. Together, we can cultivate a greener tomorrow.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <button className="
              px-6 py-3 sm:px-7 sm:py-4 md:px-8 md:py-4 bg-gradient-to-r from-emerald-600 to-teal-600 
              text-white font-semibold rounded-full shadow-lg
              transform transition-all duration-300 hover:scale-105 hover:shadow-xl
              flex items-center justify-center space-x-2
            ">
              <span className="text-sm sm:text-base">Become a Member</span>
            </button>
            <button className="
              px-6 py-3 sm:px-7 sm:py-4 md:px-8 md:py-4 bg-white border-2 border-emerald-600 
              text-emerald-800 font-semibold rounded-full shadow
              transform transition-all duration-300 hover:scale-105 hover:bg-emerald-50
              flex items-center justify-center space-x-2
            ">
              <span className="text-sm sm:text-base">Volunteer with Us</span>
            </button>
          </div>
        </div>
        
        {/* Floating action button */}
        <div className="fixed bottom-6 right-4 sm:bottom-8 sm:right-8 z-50">
          <button className="
            w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 
            shadow-xl flex items-center justify-center text-white text-xl sm:text-2xl
            animate-float transform transition-all duration-300 hover:scale-110
          ">
            +
          </button>
        </div>
      </div>
    </section>
  );
};

export default FloatingCTA;