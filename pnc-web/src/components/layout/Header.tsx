"use client";

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FiMenu, FiX, FiUsers, FiFeather, FiHome, FiChevronDown, FiGrid, FiHeart, FiGlobe } from 'react-icons/fi';

const navLinks = [
  { href: '/', label: 'Home', icon: <FiHome /> },
  { href: '/about-us', label: 'About Us', icon: <FiFeather /> },
  { href: '/our-team', label: 'Our Team', icon: <FiUsers /> },
  { href: '/projects', label: 'Projects', icon: <FiGrid /> },
];

const actionLinks = [
  { href: '/join-our-mission', label: 'Join Our Mission', icon: <FiHeart /> },
  { href: '/become-a-partner', label: 'Become a Partner', icon: <FiGlobe /> },
];

const Header: React.FC = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Determine if we're on pages with lighter hero backgrounds that need contrasting header
  // On these pages, we want a darker header with light text
  const isOnLightHeroPage = pathname === '/our-team' || pathname.startsWith('/projects');

  return (
    <>
      {/* Main header with dynamic styling */}
      <header className={`fixed top-4 left-4 right-4 z-50 transition-all duration-500 ease-out ${
        isOnLightHeroPage 
          ? 'bg-gray-800/80 dark:bg-gray-900/80' 
          : 'bg-white/70 dark:bg-gray-900/70'
      } backdrop-blur-md py-4 rounded-2xl`}>
        <nav className="container mx-auto px-4 flex justify-between items-center">
          {/* Logo section */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3 text-xl font-bold transition-all duration-300 hover:opacity-90">
              <Image 
                src="/header-logo.png" 
                alt="Prithvi Nature Club Logo" 
                width={48} 
                height={48} 
                className="object-contain"
              />
              <span className={`hidden sm:block font-bold ${isOnLightHeroPage ? 'text-white' : 'text-gray-900 dark:text-white'} drop-shadow-lg`}>
                Prithvi Nature Club
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map(({ href, label, icon }) => (
              <Link
                href={href}
                key={label}
                className={`
                  flex items-center text-sm sm:text-base 
                  ${pathname === href 
                    ? 'text-emerald-700 dark:text-emerald-400 font-semibold' 
                    : (isOnLightHeroPage 
                      ? 'text-white hover:text-emerald-200' 
                      : 'text-gray-800 dark:text-gray-200 hover:text-emerald-700 dark:hover:text-emerald-300')} 
                  font-medium px-3 py-2 rounded-lg 
                  transition-all duration-300
                  hover:bg-white/50 dark:hover:bg-gray-800/50 
                `}
              >
                <span className="mr-2 text-base">{icon}</span>
                <span>{label}</span>
              </Link>
            ))}
            
            {/* Dropdown for Action Links */}
            <div className="relative">
              <button
                className={`
                  flex items-center text-sm sm:text-base 
                  ${isOnLightHeroPage 
                    ? 'text-white hover:text-emerald-200' 
                    : 'text-gray-800 dark:text-gray-200 hover:text-emerald-700 dark:hover:text-emerald-300'} 
                  font-medium px-3 py-2 rounded-lg 
                  transition-all duration-300
                  hover:bg-white/50 dark:hover:bg-gray-800/50 
                `}
                onClick={() => setDropdownOpen(v => !v)}
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
                aria-label="Club Actions Menu"
              >
                <span>Club Actions</span>
                <FiChevronDown 
                  className={`
                    ml-1 transition-transform duration-300 ease-in-out 
                    ${dropdownOpen ? 'rotate-180' : ''}
                  `} 
                />
              </button>
              
              {dropdownOpen && (
                <div className={`
                  absolute right-0 mt-2 w-48 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg 
                  rounded-xl shadow-xl z-50 overflow-hidden
                  transform origin-top-right transition-all duration-300 ease-out
                `}>
                  {actionLinks.map(({ href, label }) => (
                    <Link
                      href={href}
                      key={label}
                      className={`
                        block px-4 py-3 text-gray-800 dark:text-gray-200 
                        hover:bg-emerald-50/80 dark:hover:bg-emerald-900/30 
                        border-b border-gray-100/30 dark:border-gray-700/30 
                        last:border-b-0 text-sm transition-colors duration-200
                        hover:text-emerald-700 dark:hover:text-emerald-300
                      `}
                      onClick={() => {
                        setDropdownOpen(false);
                        // Close mobile menu if it's open
                        if (menuOpen) setMenuOpen(false);
                      }}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Hamburger */}
          <button
            className={`
              md:hidden text-xl 
              ${isOnLightHeroPage 
                ? 'text-white' 
                : 'text-gray-800 dark:text-gray-200'} 
              focus:outline-none p-2 rounded-lg 
              hover:bg-white/50 dark:hover:bg-gray-800/50 
              transition-all duration-300
            `}
            onClick={() => {
              setMenuOpen(v => !v);
              setDropdownOpen(false); // Close dropdown when opening mobile menu
            }}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </nav>
        
        {/* Mobile Menu */}
        {menuOpen && (
          <div className={`
            md:hidden bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl 
            shadow-xl rounded-b-2xl
            transform transition-all duration-300 ease-out
          `}>
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-2">
              {navLinks.map(({ href, label, icon }) => (
                <Link
                  href={href}
                  key={label}
                  className={`
                    flex items-center text-gray-800 dark:text-gray-200 
                    py-3 font-medium hover:text-emerald-700 dark:hover:text-emerald-300 
                    rounded-lg transition-all duration-300
                    hover:bg-white/50 dark:hover:bg-gray-700/50 
                    border-b border-gray-100/30 dark:border-gray-700/30 last:border-b-0
                  `}
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="mr-3 text-lg">{icon}</span>
                  <span>{label}</span>
                </Link>
              ))}
              
              <div className="pt-2 space-y-2 pb-4">
                {actionLinks.map(({ href, label }) => (
                  <Link
                    href={href}
                    key={label}
                    className={`
                      block py-3 px-4 rounded-lg text-center
                      text-gray-800 dark:text-gray-200
                      bg-white/50 dark:bg-gray-700/50
                      hover:bg-emerald-50/60 dark:hover:bg-emerald-900/20
                      transition-all duration-300
                    `}
                    onClick={() => setMenuOpen(false)}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;