import React from 'react';
import Header from '@/components/layout/Header';
import Link from 'next/link';

interface SOEESubProjectLayoutProps {
  children: React.ReactNode;
  projectTitle: string;
  subProjectTitle: string;
}

const SOEESubProjectLayout: React.FC<SOEESubProjectLayoutProps> = ({ children, projectTitle, subProjectTitle }) => {
  return (
    <>
      <Header />
      {/* Breadcrumbs - positioned to work with backgrounds */ }
      <div className="bg-white/20 backdrop-blur-sm py-3 sticky top-16 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm">
            <Link href="/" className="text-gray-700 hover:text-emerald-700 transition-colors duration-200 font-medium">
              Home
            </Link>
            <span className="mx-2 text-gray-600/70">/</span>
            <Link href="/projects" className="text-gray-700 hover:text-emerald-700 transition-colors duration-200 font-medium">
              Projects
            </Link>
            <span className="mx-2 text-gray-600/70">/</span>
            <Link href="/projects/soee" className="text-gray-700 hover:text-emerald-700 transition-colors duration-200 font-medium">
              SOEE Program
            </Link>
            <span className="mx-2 text-gray-600/70">/</span>
            <span className="text-gray-900 font-medium">{subProjectTitle}</span>
          </div>
        </div>
      </div>
      {children}
    </>
  );
};

export default SOEESubProjectLayout;