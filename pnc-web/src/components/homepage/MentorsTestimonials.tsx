import React from 'react';
import Image from 'next/image';

const testimonial = {
  quote: "Dr. Pankaj Koparde consistently demonstrates unparalleled dedication to environmental conservation. His impact is truly inspiring.",
  author: "Dr. Pankaj Pramod Koparde",
  title: "Program Coordinator & Assistant Professor",
  image: "/images/testimonials/pankaj-koparde.jpg",
};

const MentorsTestimonials: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-green-50 to-white">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900">
          Insights from Our Mentors
        </h2>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 md:p-10 shadow-lg border border-gray-100">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg border-4 border-green-100">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.author}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex-grow text-center md:text-left">
                <div className="relative">
                  <svg className="absolute -top-4 -left-4 w-8 h-8 text-green-200" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <p className="text-xl md:text-2xl italic leading-relaxed text-gray-700 pl-6">
                    "{testimonial.quote}"
                  </p>
                </div>
                <div className="mt-6">
                  <p className="text-lg font-bold text-gray-900">
                    {testimonial.author}
                  </p>
                  <p className="text-gray-600">
                    {testimonial.title}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MentorsTestimonials;
