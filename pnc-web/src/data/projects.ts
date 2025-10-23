import { Zap, Droplet, Users, BookOpen, Leaf } from 'lucide-react';

export const PROJECTS_DATA = [
  {
    id: 'soee',
    title: 'PNC School Outreach for Environmental Education (SOEE) Program',
    tag: 'Flagship Initiative',
    description: 'MIT-WPU’s comprehensive effort to integrate environmental action with academic fieldwork, focusing on school outreach for scalable, data-driven solutions in rural communities.',
    icon: Zap,
    link: 'soee',
    isFlagship: true,
    subProjects: [
      {
        id: 'chande',
        title: 'Environmental Education at Chande',
        description: 'A focused initiative applying GIS mapping and community-based solutions for environmental education, water scarcity, and waste management in Chande Village.',
        icon: Droplet,
        link: 'chande',
        details: {
          metrics: [
            { label: 'Water Table Increase', value: '30%' },
            { label: 'Waste Segregation Rate', value: '70%' },
            { label: 'Students Engaged', value: '25+' },
          ]
        }
      },
      {
        id: 'biodiversity-audit',
        title: 'Western Ghats Biodiversity Audit',
        description: 'Yearly survey focusing on indicator species tracking and documentation protocols for conservation planning.',
        icon: BookOpen,
        link: 'biodiversity-audit',
        details: { metrics: [] } // Mock details
      },
    ]
  },
  {
    id: 'byoc',
    title: 'Zero-Waste Campus: BYOC Initiative',
    description: 'The successful campus-wide movement for plastic reduction, saving thousands of single-use cups since its pilot launch.',
    icon: Leaf, // Using a Leaf icon for the BYOC initiative
    link: 'byoc',
    isFlagship: false,
    details: {
        metrics: [
            { label: 'Cups Saved', value: '18,500+', unit: 'cups' },
            { label: 'Cafeterias', value: '6', unit: 'vendors' },
            { label: 'Discount', value: '15%', unit: 'off' },
            { label: 'Participants', value: '70%', unit: 'adoption' }
        ]
    }
  },
  {
    id: 'campus-green-audit',
    title: 'MIT-WPU Campus Green Audit',
    tag: 'Local Action',
    description: 'Comprehensive environmental assessment of the campus infrastructure and sustainability practices.',
    icon: Users,
    link: 'campus-green-audit',
    isFlagship: false,
  },
  {
    id: 'ruturang-2.0',
    title: 'Ruturang 2.0: Seasonal Nature Exploration',
    description: 'Explore Pune’s hills with expert naturalist and Geologist Siddharth Binniwale, discovering wonders hidden in the changing landscape.',
    icon: BookOpen,
    link: 'ruturang-2.0',
    isFlagship: false,
  },
];