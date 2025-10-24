export interface TeamMember {
  id: number;
  name: string;
  role: string;
  department: 'Executive' | 'Media' | 'Research';
  email: string;
  interests?: string;
  skills?: string;
  futureCareer?: string;
  status: 'Active' | 'Inactive'; // Active for current (25-26), Inactive for previous (24-25)
  image?: string;
  isHead?: boolean;
  phone?: string; // This will be removed after initial data load for privacy
}

export const TEAM_DATA: TeamMember[] = [
  // Current Executive Committee (25-26)
  {
    id: 1,
    name: "Soham Sonawane",
    role: "President",
    department: "Executive",
    email: "s12233050007@gmail.com",
    interests: "Aquatic Ecosystems, Avian Ecology, Botany, Climate Science, Conservation Technology, Entomology, Environmental Policy, Herpetology",
    skills: "Data Analysis, GIS, Grant Writing, Leadership, Project Management, Public Speaking, Scientific Writing",
    status: "Active",
    image: "/images/team/soham.png",
    isHead: true
  },
  {
    id: 2,
    name: "Sharvari Tate",
    role: "Secretary",
    department: "Executive",
    email: "1332250378@mitwpu.edu.in",
    interests: "Aquatic Ecosystems, Climate Science, Conservation Technology, Environmental Policy",
    skills: "Data Analysis, GIS, Grant Writing, Leadership, Project Management, Public Speaking, Scientific Writing",
    status: "Active",
    image: "/images/team/sharvari.png",
    isHead: false
  },
  {
    id: 3,
    name: "Prajakta Jadhav",
    role: "Vice President",
    department: "Executive",
    email: "",
    status: "Active",
    image: "/images/team/prajakta.png",
    isHead: false
  },
  {
    id: 4,
    name: "Suyash Rahegaonkar",
    role: "Treasurer",
    department: "Executive",
    email: "1332250296@mitwpu.edu.in",
    interests: "Climate Science, Environmental Policy",
    skills: "Data Analysis, GIS, Grant Writing, Leadership, Project Management, Public Speaking, Scientific Writing",
    status: "Active",
    image: "/images/team/suyash.png",
    isHead: false
  },
  // Previous Executive Committee (24-25)
  {
    id: 5,
    name: "Anagha Purohit",
    role: "Former President",
    department: "Executive",
    email: "",
    status: "Inactive",
    image: "/images/team/president_24-25.PNG",
    isHead: false
  },
  // Previous Department Heads (24-25)
  {
    id: 6,
    name: "Jui Dicholkar",
    role: "Media Head",
    department: "Media",
    email: "",
    status: "Inactive",
    image: "/images/team/media_head_24-25.PNG",
    isHead: true
  },
  {
    id: 7,
    name: "Priya Kadam",
    role: "Vice - President",
    department: "Executive",
    email: "",
    status: "Inactive",
    image: "/images/team/vice_president.PNG",
    isHead: false
  },
  {
    id: 8,
    name: "Parth Borkar",
    role: "Treasurer",
    department: "Executive",
    email: "",
    status: "Inactive",
    image: "/images/team/treasurer_24_25.PNG",
    isHead: false
  },
  {
    id: 9,
    name: "Saartha Kamble",
    role: "Secretary",
    department: "Executive",
    email: "",
    status: "Inactive",
    image: "/images/team/secretary_24_25.PNG",
    isHead: false
  },
  {
    id: 10,
    name: "Krishnandu Sarkar",
    role: "Research Head",
    department: "Research",
    email: "",
    status: "Inactive",
    image: "/images/team/research_head_24-25.PNG",
    isHead: true
  },
  // Current Media Department (25-26)
  {
    id: 11,
    name: "Shreya Joshi",
    role: "Head",
    department: "Media",
    email: "1332250538@mitwpu.edu.in",
    interests: "Climate Science, Conservation Technology",
    skills: "Leadership, Project Management",
    status: "Active",
    image: "/images/team/Media_head.png",
    isHead: true
  },
  {
    id: 12,
    name: "Arnav Ingle",
    role: "Member",
    department: "Media",
    email: "1332250630@mitwpu.edu.in",
    interests: "Avian Ecology, Climate Science, Conservation Technology, Environmental Policy",
    skills: "Data Analysis, GIS, Project Management",
    status: "Active",
    isHead: false
  },
  {
    id: 13,
    name: "Jayashri Donne",
    role: "Member",
    department: "Media",
    email: "1332250127@mitwpu.edu.in",
    interests: "Aquatic Ecosystems, Botany, Environmental Policy, Herpetology",
    skills: "Grant Writing, Project Management, Scientific Writing",
    status: "Active",
    isHead: false
  },
  // Current Research Department (25-26)
  {
    id: 14,
    name: "Aditya Roy",
    role: "Head",
    department: "Research",
    email: "",
    status: "Active",
    image: "/images/team/Research_Head.png",
    isHead: true
  },
  {
    id: 15,
    name: "Chinmay Kadam",
    role: "Member",
    department: "Research",
    email: "",
    status: "Active",
    isHead: false
  }
];