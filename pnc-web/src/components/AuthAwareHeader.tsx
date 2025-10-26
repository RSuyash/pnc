// src/components/AuthAwareHeader.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { FiMenu, FiX, FiUser, FiLogOut, FiHome, FiUsers, FiGrid, FiFeather } from 'react-icons/fi';
import { useState } from 'react';

export default function AuthAwareHeader() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Navigation links for authenticated users
  const navLinks = [
    { href: '/', label: 'Home', icon: <FiHome /> },
    { href: '/dashboard', label: 'Dashboard', icon: <FiGrid /> },
    { href: '/members', label: 'Members', icon: <FiUsers /> },
    { href: '/projects', label: 'Projects', icon: <FiGrid /> },
    { href: '/about-us', label: 'About Us', icon: <FiFeather /> },
  ];

  // Filter links based on user role
  const filteredNavLinks = navLinks.filter(link => {
    // All authenticated users can access these
    return true;
  });

  return (
    <header className="bg-white shadow-sm border-b border-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              className="md:hidden mr-2 text-gray-700 p-2 rounded-md"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
            
            <Link href="/" className="text-xl font-bold text-emerald-600 flex items-center">
              <span className="hidden sm:inline">Prithvi Nature Club</span>
              <span className="sm:hidden">PNC</span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1 ml-10">
              {filteredNavLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-600'
                  }`}
                >
                  <span className="mr-2">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {/* User Info */}
            {isAuthenticated && (
              <div className="hidden md:flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{user?.full_name}</div>
                  <div className="text-xs text-gray-500 capitalize">{user?.role}</div>
                </div>
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                    <span className="text-emerald-700 font-medium">
                      {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition"
            >
              <FiLogOut className="mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2">
              {filteredNavLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-600'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="mr-3">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </div>
            
            {isAuthenticated && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center px-3 py-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center mr-3">
                    <span className="text-emerald-700 font-medium">
                      {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{user?.full_name}</div>
                    <div className="text-xs text-gray-500 capitalize">{user?.role}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}