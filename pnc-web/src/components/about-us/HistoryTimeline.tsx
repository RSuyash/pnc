
import React from 'react';

const timelineEvents = [
  { year: "2020", title: "Foundation", description: "Prithvi Nature Club was founded by a small group of passionate students at MIT-WPU." },
  { year: "2021", title: "First Major Project", description: "Launched 'Project Green Canopy,' planting over 1,000 native trees." },
  { year: "2022", title: "Community Expansion", description: "Reached 500 active members and partnered with local environmental NGOs." },
  { year: "2023", title: "National Recognition", description: "Awarded 'Best Student Environmental Initiative' at the National Youth Summit." },
];

const HistoryTimeline: React.FC = () => {
  return (
    <section className="py-24 bg-slate-900 text-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold">Our Journey</h2>
          <p className="text-lg text-slate-400 mt-4">From a small idea to a thriving community.</p>
        </div>
        <div className="relative max-w-2xl mx-auto">
          <div className="absolute left-1/2 w-0.5 h-full bg-slate-700 transform -translate-x-1/2"></div>
          {timelineEvents.map((event, index) => (
            <div key={index} className="mb-8 flex justify-between items-center w-full">
              <div className={`order-1 w-5/12 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                {index % 2 === 0 && (
                  <>
                    <p className="mb-2 text-xl font-bold text-pnc-accent-orange">{event.year}</p>
                    <h3 className="mb-2 font-bold text-xl">{event.title}</h3>
                    <p className="text-slate-300">{event.description}</p>
                  </>
                )}
              </div>
              <div className="z-20 flex items-center order-1 bg-slate-800 shadow-xl w-8 h-8 rounded-full">
                <div className="mx-auto w-2 h-2 bg-pnc-accent-orange rounded-full"></div>
              </div>
              <div className={`order-1 w-5/12 px-6 py-4 ${index % 2 !== 0 ? 'text-left' : 'text-right'}`}>
                {index % 2 !== 0 && (
                  <>
                    <p className="mb-2 text-xl font-bold text-pnc-accent-orange">{event.year}</p>
                    <h3 className="mb-2 font-bold text-xl">{event.title}</h3>
                    <p className="text-slate-300">{event.description}</p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HistoryTimeline;
