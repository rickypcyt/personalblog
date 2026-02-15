'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('home');

  const navItems = [
    { name: 'Dotfiles', href: '/dotfiles', id: 'dotfiles' },
    { name: 'Portfolio', href: 'https://rickypcyt.vercel.app/', id: 'portfolio' },
  ];

  const centerNavItems = [] as Array<{name: string; href: string; id: string}>;

  return (
    <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-sm shadow-lg w-full border-b border-black">
      <div className="w-full mx-auto px-4">
        <div className="flex justify-between items-center h-18 relative">
          {/* Logo */}
          <Link href="/" className=" transition-opacity">
            <div className="text-white font-bold text-2xl" style={{fontFamily: 'Helvetica, Arial, sans-serif'}}>
              rickypcyt&apos;s blog
            </div>
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

          {/* Right side - Dotfiles and Portfolio */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/dotfiles"
              className={`px-4 py-2 text-lg font-bold ${
                activeLink === 'dotfiles' ? 'text-white' : 'text-white hover:text-white'
              } transition-colors duration-200`}
              style={{fontFamily: 'Helvetica, Arial, sans-serif'}}
              onClick={() => setActiveLink('dotfiles')}
            >
              dotfiles & linux config
            </Link>
            <a
              href="https://rickypcyt.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className={`px-4 py-2 text-lg font-bold ${
                activeLink === 'portfolio' ? 'text-white' : 'text-white hover:text-white'
              } transition-colors duration-200`}
              style={{fontFamily: 'Helvetica, Arial, sans-serif'}}
              onClick={() => setActiveLink('portfolio')}
            >
              Portfolio
            </a>
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
            item.href.startsWith('http') ? (
              <a
                key={item.id}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`block px-3 py-2 text-lg font-bold ${
                  activeLink === item.id ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
                style={{fontFamily: 'Helvetica, Arial, sans-serif'}}
                onClick={() => {
                  setActiveLink(item.id);
                  setIsOpen(false);
                }}
              >
                {item.name}
              </a>
            ) : (
              <Link
                key={item.id}
                href={item.href}
                className={`block px-3 py-2 text-lg font-bold ${
                  activeLink === item.id ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
                style={{fontFamily: 'Helvetica, Arial, sans-serif'}}
                onClick={() => {
                  setActiveLink(item.id);
                  setIsOpen(false);
                }}
              >
                {item.name}
              </Link>
            )
          ))}
        </div>
      </div>
    </nav>
  );
}
