"use client";

import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FiMenu, FiX, FiUsers, FiFeather, FiHome, FiChevronDown, FiGrid, FiHeart, FiGlobe, FiChevronsRight } from 'react-icons/fi';

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
  const [scrolled, setScrolled] = useState(false);
  const [logoModuleHovered, setLogoModuleHovered] = useState(false);
  const [rightModuleHovered, setRightModuleHovered] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine if we're on pages with lighter backgrounds that need darker text
  const isOnLightBgPage = pathname === '/our-team' || pathname.startsWith('/projects');

  return (
    <>
      {/* Left logo module that stays visible when scrolled */}
      {scrolled && (
        <div 
          className={`
            fixed left-6 top-6 z-50 
            transition-all duration-500 ease-out
            w-16 h-16 flex items-center justify-center
          `}
          onMouseEnter={() => setLogoModuleHovered(true)}
          onMouseLeave={() => setLogoModuleHovered(false)}
        >
          <Link href="/" className="flex items-center justify-center w-full h-full">
            <Image 
              src="/header-logo.png" 
              alt="Prithvi Nature Club Logo" 
              width={64} 
              height={64} 
              className="object-contain"
            />
          </Link>
          
          {/* Expanded menu on hover */}
          <div className={`
            absolute left-full top-0 ml-3 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg 
            rounded-xl shadow-2xl p-4 min-w-[200px] z-50
            transition-all duration-300 ease-out
            ${logoModuleHovered ? 'opacity-100 visible translate-x-0' : 'opacity-0 invisible -translate-x-2'}
          `}>
            <div className="flex items-center mb-3">
              <Image 
                src="/header-logo.png" 
                alt="PNC Logo" 
                width={32} 
                height={32} 
                className="object-contain mr-2"
              />
              <span className="font-bold text-sm text-gray-800 dark:text-white">Prithvi Nature Club</span>
            </div>
            <div className="space-y-2">
              {navLinks.map(({ href, label, icon }) => (
                <Link
                  key={label}
                  href={href}
                  className={`
                    flex items-center w-full p-2 rounded-lg
                    text-gray-700 dark:text-gray-300
                    hover:text-emerald-700 dark:hover:text-emerald-300
                    hover:bg-emerald-50/60 dark:hover:bg-emerald-900/20
                    transition-all duration-200
                  `}
                >
                  <span className="mr-2">{icon}</span>
                  <span className="text-sm">{label}</span>
                </Link>
              ))}
              <div className="border-t border-gray-200/50 dark:border-gray-700/50 my-2"></div>
              {actionLinks.map(({ href, label, icon }) => (
                <Link
                  key={label}
                  href={href}
                  className={`
                    flex items-center w-full p-2 rounded-lg
                    text-gray-700 dark:text-gray-300
                    hover:text-emerald-700 dark:hover:text-emerald-300
                    hover:bg-emerald-50/60 dark:hover:bg-emerald-900/20
                    transition-all duration-200
                  `}
                >
                  <span className="mr-2">{icon}</span>
                  <span className="text-sm">{label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Right navigation module that appears when scrolled */}
      {scrolled && (
        <div 
          className={`
            fixed right-6 top-6 z-40 
            bg-white/70 dark:bg-gray-900/70 backdrop-blur-md 
            rounded-2xl shadow-lg p-2
            transition-all duration-500 ease-out
            flex flex-col items-center space-y-1
          `}
          onMouseEnter={() => setRightModuleHovered(true)}
          onMouseLeave={() => setRightModuleHovered(false)}
        >
          <div className="relative">
            {navLinks.map(({ href, icon }, index) => (
              <Link
                key={href}
                href={href}
                className={`
                  w-10 h-10 rounded-full
                  flex items-center justify-center
                  text-gray-700 dark:text-gray-300
                  hover:text-emerald-700 dark:hover:text-emerald-300
                  hover:bg-white/60 dark:hover:bg-gray-800/60
                  transition-all duration-300 mb-1
                  ${rightModuleHovered ? 'w-12 h-12' : ''}
                `}
              >
                {icon}
              </Link>
            ))}
            <div className="w-full border-t border-gray-200/50 dark:border-gray-700/50 my-1"></div>
            {actionLinks.map(({ href, icon }, index) => (
              <Link
                key={href}
                href={href}
                className={`
                  w-10 h-10 rounded-full
                  flex items-center justify-center
                  text-gray-700 dark:text-gray-300
                  hover:text-emerald-700 dark:hover:text-emerald-300
                  hover:bg-white/60 dark:hover:bg-gray-800/60
                  transition-all duration-300 mb-1
                  ${rightModuleHovered ? 'w-12 h-12' : ''}
                `}
              >
                {icon}
              </Link>
            ))}
          </div>
          
          {/* Hover indicator */}
          {!rightModuleHovered && (
            <div className="absolute -right-1 -top-1 w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
          )}
        </div>
      )}

      {/* Original header - only visible when not scrolled */}
      <header 
        ref={navRef}
        className={`
          fixed top-4 left-4 right-4 z-30 
          transition-all duration-500 ease-out
          ${scrolled 
            ? 'opacity-0 pointer-events-none scale-95' 
            : 'opacity-100 pointer-events-auto bg-transparent backdrop-blur-3xl py-4 rounded-2xl'}
        `}
      >
        <nav className="container mx-auto px-2 sm:px-4 flex justify-between items-center">
          {/* Plain logo without backgrounds */}
          <div className={`
            flex items-center space-x-3 text-xl sm:text-2xl font-bold
            transition-all duration-500 ease-out
          `}>
            <Link 
              href="/" 
              className="flex items-center space-x-3 text-xl sm:text-2xl font-bold transition-all duration-300 hover:opacity-90"
            >
              <Image 
                src="/header-logo.png" 
                alt="Prithvi Nature Club Logo" 
                width={48} 
                height={48} 
                className="object-contain"
              />
              <span className={`hidden sm:block font-bold ${isOnLightBgPage && !scrolled ? 'text-gray-900' : 'text-gray-900 dark:text-white'} drop-shadow-lg`}>
                Prithvi Nature Club
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - only visible when not scrolled */}
          <div className={`
            hidden md:flex items-center space-x-1
            transition-all duration-500 ease-out
          `}>
            {navLinks.map(({ href, label, icon }) => (
              <Link
                href={href}
                key={label}
                className={`
                  flex items-center text-sm sm:text-base 
                  ${(isOnLightBgPage && !scrolled) 
                    ? 'text-gray-900 hover:text-emerald-700' 
                    : 'text-gray-800 dark:text-gray-200 hover:text-emerald-700 dark:hover:text-emerald-300'} 
                  font-medium px-3 py-2 rounded-lg 
                  transition-all duration-300
                  hover:bg-white/30 dark:hover:bg-gray-800/30 
                  backdrop-blur-sm
                `}
              >
                <span className="mr-2 text-base">{icon}</span>
                <span>{label}</span>
              </Link>
            ))}
            
            {/* Enhanced Dropdown for Actions */}
            <div className="relative">
              <button
                className={`
                  flex items-center text-sm sm:text-base 
                  ${(isOnLightBgPage && !scrolled) 
                    ? 'text-gray-900 hover:text-emerald-700' 
                    : 'text-gray-800 dark:text-gray-200 hover:text-emerald-700 dark:hover:text-emerald-300'} 
                  font-medium px-3 py-2 rounded-lg 
                  transition-all duration-300
                  hover:bg-white/30 dark:hover:bg-gray-800/30 
                  backdrop-blur-sm
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
              ${(isOnLightBgPage && !scrolled) 
                ? 'text-gray-900' 
                : 'text-gray-800 dark:text-gray-200'} 
              focus:outline-none p-2 rounded-lg 
              hover:bg-white/30 dark:hover:bg-gray-800/30 
              backdrop-blur-sm transition-all duration-300
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
            shadow-xl rounded-2xl
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
                    hover:bg-white/30 dark:hover:bg-gray-700/30 backdrop-blur-sm
                    border-b border-gray-100/30 dark:border-gray-700/30 last:border-b-0
                  `}
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="mr-3 text-lg">{icon}</span>
                  <span>{label}</span>
                </Link>
              ))}
              
              <div className="pt-2 space-y-2">
                {actionLinks.map(({ href, label }) => (
                  <Link
                    href={href}
                    key={label}
                    className={`
                      block py-3 px-4 rounded-lg text-center
                      text-gray-800 dark:text-gray-200
                      bg-white/30 dark:bg-gray-700/30
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
