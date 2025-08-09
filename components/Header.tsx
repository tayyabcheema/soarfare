'use client';

import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const router = useRouter();
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Check if we're on the home page
  const isHomePage = router.pathname === '/';

  // Handle scroll for sticky header background
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [router.pathname]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Menu links
  const menuLinks = [
    { href: '/about', label: 'About Us' },
    { href: '/subscription-plans', label: 'Subscriptions' },
    { href: '/search', label: 'Search Flights' },
    { href: '/faq', label: "FAQ's" },
    { href: '/blogs', label: 'Blogs' },
    { href: '/support', label: 'Support' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActiveLink = (href: string) => {
    return router.pathname === href;
  };

  // Determine header background class based on page and scroll state
  const getHeaderBgClass = () => {
    if (isHomePage) {
      // On home page: transparent initially, background when scrolled
      return isScrolled 
        ? 'bg-[#0C2545]/95 backdrop-blur-md border-b border-[#0C2545]' 
        : 'bg-transparent border-b border-transparent';
    } else {
      // On other pages: always have background
      return 'bg-[#0C2545] border-b border-[#0C2545]';
    }
  };

  return (
    <>
      <header className={`fixed top-0 z-[70] w-full transition-all duration-300 ${getHeaderBgClass()}`}>
        <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 py-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="block">
              <Image
                src="/logo.png"
                alt="SoarFare Logo"
                width={120}
                height={40}
                className="h-10 md:h-20 w-auto cursor-pointer p-2 md:p-4"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center justify-center flex-1">
            <ul className="flex items-center space-x-8">
              {menuLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-white hover:text-[#F27709] transition-colors duration-200 font-thins ${
                      isActiveLink(link.href)
                        ? 'text-[#F27709] font-bold'
                        : 'text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            {isLoading ? (
              <div className="text-white text-sm">Loading...</div>
            ) : isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-white hover:text-[#F27709] transition-colors duration-200 font-medium"
                >
                  Dashboard
                </Link>
              
                <button 
                  onClick={logout}
                  disabled={isLoading}
                  className="text-white hover:text-[#F27709] border border-white hover:border-[#F27709] rounded px-4 py-2 transition-colors duration-200 font-medium disabled:opacity-50"
                >
                  {isLoading ? 'Logging out...' : 'Logout'}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/register"
                  className="text-white hover:text-[#F27709] transition-colors duration-200 font-normal"
                >
                  Register
                </Link>
                <Link
                  href="/login"
                  className="bg-[#F27709] hover:bg-[#E66900] text-white px-10 py-2 rounded-md font-semibold transition-colors duration-200 shadow-md"
                >
                  Login
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 text-white hover:text-[#F27709] transition-colors duration-200"
            aria-label="Toggle mobile menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span
                className={`block w-6 h-0.5 bg-current transition-all duration-300 ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                }`}
              ></span>
              <span
                className={`block w-6 h-0.5 bg-current mt-1.5 transition-all duration-300 ${
                  isMobileMenuOpen ? 'opacity-0' : ''
                }`}
              ></span>
              <span
                className={`block w-6 h-0.5 bg-current mt-1.5 transition-all duration-300 ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                }`}
              ></span>
            </div>
          </button>
        </div>
      </header>

      {/* Mobile Full-Screen Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="fixed inset-0 bg-[#0C2545] bg-opacity-95 backdrop-blur-sm">
            <div className="flex flex-col items-center justify-center min-h-screen px-6">
              {/* Mobile Navigation */}
              <nav className="flex flex-col items-center space-y-8 mb-12">
                {menuLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-4xl md:text-5xl font-thin transition-colors duration-200 ${
                      isActiveLink(link.href)
                        ? 'text-[#F27709]'
                        : 'text-white hover:text-[#F27709]'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Mobile Auth Buttons */}
              <div className="flex flex-col items-center space-y-6">
                {isLoading ? (
                  <div className="text-white text-xl">Loading...</div>
                ) : isAuthenticated ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-2xl text-white hover:text-[#F27709] transition-colors duration-200 font-semibold"
                    >
                      Dashboard
                    </Link>
                    
                    <button 
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      disabled={isLoading}
                      className="text-2xl text-white hover:text-[#F27709] border-2 border-white hover:border-[#F27709] rounded-lg px-8 py-3 transition-colors duration-200 font-semibold disabled:opacity-50"
                    >
                      {isLoading ? 'Logging out...' : 'Logout'}
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-2xl text-white hover:text-[#F27709] transition-colors duration-200 font-thin"
                    >
                      Register
                    </Link>
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="bg-[#F27709] hover:bg-[#E66900] text-white text-2xl px-20 py-3 rounded-lg font-normal transition-colors duration-200 shadow-lg"
                    >
                      Login
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
