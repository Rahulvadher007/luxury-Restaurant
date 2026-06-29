import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Dishes', href: '#dishes' },
    { name: 'Chef Alexander', href: '#chef' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Reviews', href: '#reviews' },
    { name: 'VIP Club', href: '#vip' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-luxury-black/90 backdrop-blur-md border-b border-luxury-gold/20 py-4 shadow-gold-glow'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#home" className="flex items-center space-x-2">
          <span className="font-display text-2xl md:text-3xl tracking-[0.2em] text-luxury-gold font-bold">
            AURUM
          </span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium tracking-widest text-luxury-ivory/80 hover:text-luxury-gold transition-colors duration-300 relative group uppercase"
            >
              {link.name}
              <span className="absolute bottom-[-6px] left-0 w-0 h-[1px] bg-luxury-gold transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
          <a
            href="#book"
            className="px-6 py-2 border border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-luxury-black transition-all duration-300 text-xs font-semibold tracking-[0.15em] uppercase hover:shadow-gold-glow"
          >
            Reserve Table
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-luxury-ivory hover:text-luxury-gold transition-colors focus:outline-none"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 top-[73px] bg-luxury-black/95 backdrop-blur-lg z-40 transform transition-transform duration-500 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-[calc(100vh-73px)] space-y-8 pb-20">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-lg font-medium tracking-[0.2em] text-luxury-ivory hover:text-luxury-gold transition-colors duration-300 uppercase"
            >
              {link.name}
            </a>
          ))}
          <a
            href="#book"
            onClick={() => setIsOpen(false)}
            className="px-8 py-3 border border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-luxury-black transition-all duration-300 text-sm font-semibold tracking-[0.2em] uppercase hover:shadow-gold-glow"
          >
            Reserve Table
          </a>
        </div>
      </div>
    </nav>
  );
}
