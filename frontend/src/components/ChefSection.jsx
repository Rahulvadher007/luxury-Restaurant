import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ChefSection() {
  const [chefs, setChefs] = useState([]);

  useEffect(() => {
    fetch('/api/chefs')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setChefs(data);
        }
      })
      .catch(err => console.error('Error fetching chefs:', err));
  }, []);

  if (chefs.length === 0) return null;

  return (
    <section id="chef" className="bg-luxury-darkGray py-24 px-6 relative z-10 overflow-hidden border-t border-luxury-gold/15">
      <div className="max-w-7xl mx-auto space-y-32">
        {chefs.map((chef, index) => {
          // Alternate layout for multiple chefs
          const isEven = index % 2 === 0;

          return (
            <div key={chef._id} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              
              {/* Left/Right: Chef Portrait */}
              <motion.div
                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1 }}
                className={`relative h-[550px] group overflow-hidden border border-luxury-gold/20 p-2 bg-luxury-black ${isEven ? 'order-1' : 'order-1 lg:order-2'}`}
              >
                <div className="relative w-full h-full overflow-hidden">
                  {chef.image ? (
                    <img
                      src={chef.image}
                      alt={chef.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 object-top"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#111] flex items-center justify-center text-luxury-gold text-2xl font-display">
                      {chef.name.charAt(0)}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/90 via-transparent to-transparent"></div>
                </div>
                
                {/* Elegant overlay frame */}
                <div className="absolute inset-6 border border-luxury-gold/10 pointer-events-none group-hover:border-luxury-gold/30 transition-colors duration-500"></div>
              </motion.div>

              {/* Story & Bio */}
              <motion.div
                initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1 }}
                className={`space-y-6 ${isEven ? 'order-2 lg:pl-6' : 'order-2 lg:order-1 lg:pr-6'}`}
              >
                <span className="text-luxury-gold tracking-[0.3em] text-xs font-semibold uppercase block">
                  The Culinary Visionary
                </span>
                <h2 className="font-display text-4xl md:text-5xl font-bold tracking-[0.05em] text-luxury-ivory uppercase">
                  {chef.name}
                </h2>
                <div className="w-12 h-[1px] bg-luxury-gold mb-8"></div>
                
                <p className="text-luxury-ivory/80 leading-relaxed font-light text-sm whitespace-pre-wrap">
                  {chef.bio}
                </p>

                {chef.signatureDish && (
                  <div className="pt-6">
                    <span className="text-[11px] text-luxury-gold tracking-[0.25em] uppercase font-bold block mb-4">
                      Signature Creation
                    </span>
                    <p className="text-sm font-light text-luxury-ivory/70 border-l-2 border-luxury-gold pl-4 italic">
                      "{chef.signatureDish}"
                    </p>
                  </div>
                )}

                {/* Title Graphic */}
                <div className="pt-8 flex items-center justify-between">
                  <div>
                    <span className="font-display text-xl font-medium tracking-wide text-luxury-ivory block">
                      {chef.name}
                    </span>
                    <span className="text-[10px] text-luxury-gold tracking-[0.2em] uppercase">
                      {chef.title}
                    </span>
                  </div>
                  
                  {/* Elegant Simulated SVG Signature */}
                  <svg className="w-40 h-16 text-luxury-gold opacity-80" viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 40C35 25 50 15 65 30C75 42 55 60 70 65C85 70 100 35 110 25C120 15 125 35 130 45C135 55 140 20 150 25C160 30 165 45 175 35C185 25 190 30 195 35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M50 35L75 25" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
