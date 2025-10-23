import React from 'react';
import Header from '@/components/layout/Header';

const SOEELayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default SOEELayout;