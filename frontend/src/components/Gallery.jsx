import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Gallery() {
  const [filter, setFilter] = useState('all');
  const [hoveredItem, setHoveredItem] = useState(null);

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'Food', name: 'Dishes' },
    { id: 'Interior', name: 'Interior' },
    { id: 'Events', name: 'Events' },
    { id: 'Behind the Scenes', name: 'Behind the Scenes' },
  ];

  const [galleryItems, setGalleryItems] = useState([]);

  useEffect(() => {
    fetch('/api/gallery')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Map backend data to frontend structure with fallbacks for hoverData
          const mappedData = data.map(item => {
            // Map the old categories 'food'/'chef' to the new 'Dishes' or 'Behind the Scenes'
            let mappedCategory = item.category;
            if (mappedCategory === 'Dishes') mappedCategory = 'Food';

            return {
              id: item._id,
              category: mappedCategory,
              title: item.title,
              image: item.image,
              height: ['h-64', 'h-72', 'h-80', 'h-96'][Math.floor(Math.random() * 4)], // random heights for masonry effect
              hoverData: {
                subtitle: item.category.toUpperCase(),
                title: item.title.toUpperCase(),
                features: ['Exclusive Experience', 'Curated by Aurum', 'Premium Selection'],
                rating: '★★★★★',
                ratingText: item.featured ? 'Featured Asset' : 'Gallery Collection'
              }
            };
          });
          setGalleryItems(mappedData);
        }
      })
      .catch(err => console.error('Error fetching gallery:', err));
  }, []);

  const filteredItems = filter === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === filter);

  return (
    <section id="gallery" className="bg-luxury-black py-24 relative z-10">
      <div className="max-w-[1700px] mx-auto px-6 lg:px-[80px]">
        
        {/* Section Header */}
        <div className="text-center mb-12 relative z-20">
          <span className="text-luxury-gold tracking-[0.3em] text-xs font-semibold uppercase block mb-3">
            A Visual Journey
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-[0.05em] text-luxury-ivory uppercase">
            Aurum Gallery
          </h2>
          <div className="w-12 h-[1px] bg-luxury-gold mx-auto mt-4"></div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mb-12 relative z-20">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`text-xs md:text-sm font-semibold tracking-[0.2em] uppercase transition-all duration-300 px-4 py-2 border-b-2 ${
                filter === cat.id
                  ? 'border-luxury-gold text-luxury-gold'
                  : 'border-transparent text-luxury-ivory/55 hover:text-luxury-ivory'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Three-Column Luxury Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr_1fr] gap-6 items-start relative z-20 w-full">
          
          {/* Left Column: Gallery Images */}
          <div className="w-full h-[80vh] overflow-y-auto pr-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-luxury-black [&::-webkit-scrollbar-thumb]:bg-luxury-gold/30 [&::-webkit-scrollbar-thumb]:rounded-full">
            <motion.div 
              layout
              className="flex flex-col gap-8 pb-8"
            >
              <AnimatePresence>
                {filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                    onMouseEnter={() => setHoveredItem(item)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className="relative overflow-hidden group border border-luxury-gold/10 bg-luxury-darkGray shadow-md cursor-pointer hover:border-luxury-gold/50 hover:shadow-gold-glow transition-all duration-500 rounded-2xl"
                  >
                    <div className={`relative w-full ${item.height} sm:h-[400px] md:h-[450px] overflow-hidden`}>
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/90 via-luxury-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                        <div>
                          <span className="text-[10px] text-luxury-gold tracking-[0.2em] uppercase font-bold block mb-1">
                            {item.category}
                          </span>
                          <h3 className="font-display text-lg text-luxury-ivory font-semibold tracking-wide">
                            {item.title}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Center Column: Interactive Hover Panel */}
          <div className="w-full lg:sticky lg:top-24 h-fit">
            <div className="bg-[#050505]/80 backdrop-blur-md border border-luxury-gold/30 rounded-[20px] p-8 shadow-[0_0_40px_rgba(212,175,55,0.06)] hover:shadow-[0_0_50px_rgba(212,175,55,0.15)] hover:border-luxury-gold/50 transition-all duration-500 h-[80vh] flex flex-col justify-center relative overflow-hidden group">
              
              {/* Soft gold ambient glow behind cards */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-luxury-gold/5 via-transparent to-transparent opacity-60 mix-blend-screen pointer-events-none transition-opacity duration-700 group-hover:opacity-100"></div>

              {/* Floating gold particles layer (CSS representation) */}
              <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0iI0Q0QUYzNyIvPjwvc3ZnPg==')] pointer-events-none"></div>

              <AnimatePresence mode="wait">
                {hoveredItem ? (
                  <motion.div
                    key={hoveredItem.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="relative z-10 flex flex-col text-center items-center justify-between h-full py-4"
                  >
                    <div className="mt-8">
                       <span className="text-[10px] text-luxury-gold tracking-[0.3em] font-bold uppercase mb-4 block">
                         {hoveredItem.hoverData.subtitle}
                       </span>
                       <h3 className="font-display text-2xl xl:text-3xl font-bold text-luxury-ivory mb-2 tracking-wider">
                         {hoveredItem.hoverData.title}
                       </h3>
                    </div>
                    
                    <ul className="space-y-4 my-8 w-full">
                      {hoveredItem.hoverData.features.map((f, i) => (
                        <motion.li 
                          key={f}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 + 0.2 }}
                          className="text-sm text-luxury-ivory/80 font-body"
                        >
                          {f}
                        </motion.li>
                      ))}
                    </ul>
                    
                    <div className="mb-8">
                       <div className="text-luxury-gold tracking-[0.3em] mb-3 text-lg drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]">
                         {hoveredItem.hoverData.rating}
                       </div>
                       <div className="text-[11px] text-luxury-ivory/70 uppercase tracking-widest font-semibold">
                         {hoveredItem.hoverData.ratingText}
                       </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="default"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="relative z-10 flex flex-col items-center text-center h-full justify-center px-2"
                  >
                    <span className="text-xs text-luxury-gold tracking-[0.3em] font-bold uppercase mb-8 leading-relaxed">
                      AURUM SIGNATURE COLLECTION
                    </span>
                    <p className="text-xl font-display text-luxury-ivory/90 mb-8 italic leading-relaxed">
                      Discover the stories behind our culinary masterpieces.
                    </p>
                    <p className="text-[11px] text-luxury-ivory/50 font-body uppercase tracking-[0.2em] leading-loose">
                      Move through the gallery to explore the experience.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column: Story & Statistics Panel */}
          <div className="w-full lg:sticky lg:top-24 h-fit hidden lg:block">
            <div className="bg-[#050505]/80 backdrop-blur-md border border-luxury-gold/30 rounded-[20px] p-8 shadow-[0_0_40px_rgba(212,175,55,0.06)] hover:shadow-[0_0_50px_rgba(212,175,55,0.15)] hover:border-luxury-gold/50 transition-all duration-500 h-[80vh] flex flex-col relative overflow-hidden group">
              
              {/* Soft gold ambient glow */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-luxury-gold/5 via-transparent to-transparent opacity-60 mix-blend-screen pointer-events-none transition-opacity duration-700 group-hover:opacity-100"></div>

              <div className="relative z-10 flex flex-col h-full justify-between py-4">
                  
                  {/* Story Section */}
                  <div className="text-center mt-8">
                    <span className="text-luxury-gold tracking-[0.2em] text-[10px] font-bold uppercase mb-4 block">
                      The Legacy
                    </span>
                    <h2 className="font-display text-3xl font-bold text-luxury-ivory mb-6 leading-tight">
                      Every Dish Tells a Story
                    </h2>
                    <p className="text-sm text-luxury-ivory/70 leading-relaxed font-body">
                      From handcrafted culinary masterpieces to unforgettable celebrations, every image captures the essence of Aurum. Our gallery reflects the passion, artistry, and elegance that define the dining experience.
                    </p>
                  </div>

                  {/* Gold Divider */}
                  <div className="w-24 h-[1px] bg-luxury-gold/30 mx-auto my-8"></div>

                  {/* Statistics Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-4 rounded-xl border border-luxury-gold/20 bg-[#0a0a0a]/60 hover:bg-[#111] transition-colors group/stat text-center">
                      <span className="text-2xl mb-2 block group-hover/stat:scale-110 transition-transform duration-300 drop-shadow-[0_0_5px_rgba(212,175,55,0.3)]">⭐</span>
                      <p className="text-[11px] text-luxury-ivory/90 font-medium tracking-wide uppercase">15+ Years</p>
                    </div>
                    <div className="p-4 rounded-xl border border-luxury-gold/20 bg-[#0a0a0a]/60 hover:bg-[#111] transition-colors group/stat text-center">
                      <span className="text-2xl mb-2 block group-hover/stat:scale-110 transition-transform duration-300 drop-shadow-[0_0_5px_rgba(212,175,55,0.3)]">🍷</span>
                      <p className="text-[11px] text-luxury-ivory/90 font-medium tracking-wide uppercase">50+ Dishes</p>
                    </div>
                    <div className="p-4 rounded-xl border border-luxury-gold/20 bg-[#0a0a0a]/60 hover:bg-[#111] transition-colors group/stat text-center">
                      <span className="text-2xl mb-2 block group-hover/stat:scale-110 transition-transform duration-300 drop-shadow-[0_0_5px_rgba(212,175,55,0.3)]">👨‍🍳</span>
                      <p className="text-[11px] text-luxury-ivory/90 font-medium tracking-wide uppercase">Michelin</p>
                    </div>
                    <div className="p-4 rounded-xl border border-luxury-gold/20 bg-[#0a0a0a]/60 hover:bg-[#111] transition-colors group/stat text-center">
                      <span className="text-2xl mb-2 block group-hover/stat:scale-110 transition-transform duration-300 drop-shadow-[0_0_5px_rgba(212,175,55,0.3)]">🏆</span>
                      <p className="text-[11px] text-luxury-ivory/90 font-medium tracking-wide uppercase">25k Guests</p>
                    </div>
                  </div>

                  {/* Philosophy Quote */}
                  <blockquote className="border-l-2 border-luxury-gold pl-5 mb-8 mx-4">
                    <p className="font-display italic text-lg text-luxury-ivory mb-4 leading-snug">
                      "Luxury is not about extravagance. It is about unforgettable experiences."
                    </p>
                    <footer className="text-[10px] text-luxury-gold uppercase tracking-[0.2em] font-semibold">
                      — Aurum Philosophy
                    </footer>
                  </blockquote>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
