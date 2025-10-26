import React from 'react';
import Image from 'next/image';

const ProfessionalShowcase: React.FC = () => {
  // Updated data structure with descriptions for the hover effect
  const images = [
    { 
      id: 1, 
      src: "/images/showcase/showcase-conference.jpg", 
      alt: "Environmental Conference",
      description: "Hosting thought leaders to discuss the future of conservation."
    },
    { 
      id: 2, 
      src: "/images/showcase/showcase-field-research.jpg", 
      alt: "Field Research",
      description: "Conducting vital research to understand and protect ecosystems."
    },
    { 
      id: 3, 
      src: "/images/showcase/showcase-community-outreach.jpg", 
      alt: "Community Outreach",
      description: "Engaging with local communities to spread awareness."
    },
    { 
      id: 4, 
      src: "/images/showcase/showcase-tree-planting.jpg", 
      alt: "Tree Planting Event",
      description: "A hands-on initiative to reforest our local areas, one tree at a time."
    },
    { 
      id: 5, 
      src: "/images/showcase/showcase-environmental-workshop.jpg", 
      alt: "Environmental Workshop",
      description: "Educating the next generation of environmental stewards."
    },
    { 
      id: 6, 
      src: "/images/showcase/showcase-nature-walk.jpg", 
      alt: "Guided Nature Walk",
      description: "Exploring the beauty of local trails and learning about biodiversity."
    },
    {
      id: 7,
      src: "/images/showcase/showcase-conservation-project.jpg",
      alt: "Conservation Project",
      description: "Working on-site to preserve natural habitats for wildlife."
    },
  ];

  // This function applies special styling to create the asymmetrical layout
  const getGridItemClasses = (id: number) => {
    switch (id) {
      case 1:
        return 'lg:col-span-2'; // Make the first image span two columns
      case 4:
        return 'lg:row-span-2'; // Make the fourth image span two rows
      default:
        return '';
    }
  };


  return (
    <section className="py-20 bg-gradient-to-br from-gray-100 to-gray-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Professional Showcase
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A glimpse into our diverse range of activities, from high-impact conferences to hands-on community projects.
          </p>
        </div>

        {/* Modern Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <div
              key={image.id}
              className={`group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 ${getGridItemClasses(image.id)}`}
            >
              <div className="aspect-square">
                {/* The Image Itself */}
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                />
              </div>

              {/* Content Container for Title and Description */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-xl font-bold mb-2">
                  {image.alt}
                </h3>
                <p className="text-gray-200 text-sm">
                  {image.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProfessionalShowcase;