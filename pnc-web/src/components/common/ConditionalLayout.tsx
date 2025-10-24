'use client';
import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import { ReactNode } from 'react';

interface ConditionalLayoutProps {
  children: ReactNode;
}

const ConditionalLayout: React.FC<ConditionalLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  
  // Don't show header on auth pages
  const hideHeaderPaths = ['/auth', '/dashboard'];
  const shouldHideHeader = hideHeaderPaths.some(p => pathname?.startsWith(p));
  
  return (
    <>
      {!shouldHideHeader && <Header />}
      {children}
    </>
  );
};

export default ConditionalLayout;