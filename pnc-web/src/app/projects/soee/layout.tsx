import React from 'react';
import Header from '@/components/layout/Header';
import Link from 'next/link';

interface SOEESubProjectLayoutProps {
  children: React.ReactNode;
}

const SOEESubProjectLayout: React.FC<SOEESubProjectLayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default SOEESubProjectLayout;