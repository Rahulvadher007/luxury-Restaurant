import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Dishes() {
  const [signatureDishes, setSignatureDishes] = useState([]);

  useEffect(() => {
    fetch('/api/menu')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // You might want to filter or limit to recommended dishes on the homepage,
          // but for now we display what comes from the backend.
          setSignatureDishes(data);
        }
      })
      .catch(err => console.error('Error fetching menu:', err));
  }, []);

  return (
    <section id="dishes" className="bg-luxury-black py-24 px-6 relative z-10">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-luxury-gold tracking-[0.3em] text-xs font-semibold uppercase block mb-3">
            Culinary Masterpieces
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-[0.05em] text-luxury-ivory uppercase">
            Signature Dishes
          </h2>
          <div className="w-12 h-[1px] bg-luxury-gold mx-auto mt-4"></div>
        </div>

        {/* Dishes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {signatureDishes.map((dish, index) => (
            <motion.div
              key={dish._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              className="bg-luxury-darkGray border border-luxury-gold/10 group relative flex flex-col justify-between overflow-hidden shadow-lg transition-all duration-500 hover:border-luxury-gold/45 hover:shadow-gold-glow"
            >
              {/* Image Container */}
              <div className="h-64 overflow-hidden relative">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-darkGray to-transparent opacity-85"></div>

                {/* Recommendation Badge */}
                {dish.chefRecommendation && (
                  <span className="absolute top-4 right-4 bg-luxury-gold text-luxury-black text-[9px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 shadow-md border border-luxury-gold/50">
                    Chef Recommends
                  </span>
                )}
              </div>

              {/* Dish Info */}
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-lg font-bold text-luxury-ivory mb-2 group-hover:text-luxury-gold transition-colors duration-300">
                    {dish.name}
                  </h3>
                  <p className="text-xs text-luxury-ivory/60 leading-relaxed font-light mb-4 min-h-[48px]">
                    {dish.description}
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-luxury-gold/10 pt-4 mt-2">
                  <span className="font-display text-xl font-semibold text-luxury-gold">
                    {dish.price}
                  </span>
                  <a
                    href="#book"
                    className="text-[10px] text-luxury-ivory tracking-[0.25em] uppercase hover:text-luxury-gold transition-colors duration-300 flex items-center space-x-1"
                  >
                    <span>Reserve</span>
                    <span>→</span>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
