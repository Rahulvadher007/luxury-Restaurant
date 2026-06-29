import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Hero() {
  const [heroData, setHeroData] = useState({
    heading: 'AURUM',
    subheading: 'Fine Dining Experience',
    buttonText: 'Book Now',
    bgImage: ''
  });

  useEffect(() => {
    fetch('/api/content/hero')
      .then(res => res.json())
      .then(data => {
        if (data && data.data) {
          setHeroData(data.data);
        }
      })
      .catch(err => console.error('Error fetching hero content:', err));
  }, []);

  return (
    <section id="home" className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-luxury-black">
      {/* Background (Video fallback to Image) */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          {heroData.bgImage ? (
            <motion.img 
              key="bgImage"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              src={heroData.bgImage} 
              alt="Hero Background" 
              className="w-full h-full object-cover opacity-60 scale-105"
            />
          ) : (
            <motion.video
              key="bgVideo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-60 scale-105"
            >
              <source src="/video.mp4" type="video/mp4" />
            </motion.video>
          )}
        </AnimatePresence>
        {/* Shadow overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-transparent to-luxury-black/75"></div>
        <div className="absolute inset-0 bg-luxury-black/30"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          <span className="text-luxury-gold tracking-[0.4em] text-xs md:text-sm font-semibold uppercase block">
            Where Every Meal Becomes a Memory
          </span>
          
          <h1 className="font-display text-6xl md:text-8xl lg:text-9xl font-bold tracking-[0.15em] text-luxury-ivory uppercase">
            {heroData.heading}
          </h1>
          
          <div className="w-24 h-[1px] bg-luxury-gold mx-auto my-6"></div>
          
          <p className="font-display text-xl md:text-3xl italic text-luxury-gold/90 font-light tracking-wide max-w-2xl mx-auto">
            {heroData.subheading}
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <a
            href="#book"
            className="w-48 py-4 bg-luxury-gold text-luxury-black font-semibold text-xs tracking-[0.2em] uppercase hover:bg-luxury-ivory transition-all duration-500 shadow-gold-glow hover:shadow-gold-glow-lg border border-luxury-gold text-center"
          >
            {heroData.buttonText}
          </a>
          <a
            href="#dishes"
            className="w-48 py-4 border border-luxury-ivory/40 text-luxury-ivory font-semibold text-xs tracking-[0.2em] uppercase hover:border-luxury-gold hover:text-luxury-gold transition-all duration-500 text-center"
          >
            Explore Menu
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center">
        <span className="text-[10px] text-luxury-ivory/40 tracking-[0.3em] uppercase mb-2">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-luxury-ivory/40 to-transparent"></div>
      </div>
    </section>
  );
}
