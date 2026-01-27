'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('home');

  const navItems = [
    { name: 'Home', href: '/', id: 'home' },
    { name: 'Blog', href: '/blog', id: 'blog' },
    { name: 'Contact', href: '/contact', id: 'contact' },
  ];

  const centerNavItems = [
    { name: 'Home', href: '/', id: 'home' },
    { name: 'Blog', href: '/blog', id: 'blog' },
  ];

  return (
    <nav className="bg-black shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20 relative">
          {/* Logo */}
          <Link href="/" className="text-white font-bold text-2xl">
            rickypcyt
          </Link>

          {/* Center Navigation - Home and Blog */}
          <div className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
            {centerNavItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`px-4 py-2 text-base font-medium ${
                  activeLink === item.id ? 'text-white' : 'text-gray-400 hover:text-white'
                } transition-colors duration-200`}
                onClick={() => setActiveLink(item.id)}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right side - Contact */}
          <div className="hidden md:flex items-center">
            <Link
              href="/contact"
              className={`px-4 py-2 text-base font-medium ${
                activeLink === 'contact' ? 'text-white' : 'text-gray-400 hover:text-white'
              } transition-colors duration-200`}
              onClick={() => setActiveLink('contact')}
            >
              Contact
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg 
                className="h-8 w-8"
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} bg-gray-900`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`block px-3 py-2 text-base font-medium ${
                activeLink === item.id ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => {
                setActiveLink(item.id);
                setIsOpen(false);
              }}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
