import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

function Counter({ target, suffix = '', label }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!isInView) return;
    
    let start = 0;
    const duration = 2000; // 2 seconds
    const end = parseInt(target, 10);
    if (isNaN(end)) return;

    const startTime = performance.now();

    const updateCount = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      if (elapsedTime >= duration) {
        setCount(end);
      } else {
        const progress = elapsedTime / duration;
        // Ease-out quad formula
        const easeOutProgress = progress * (2 - progress);
        setCount(Math.floor(easeOutProgress * end));
        requestAnimationFrame(updateCount);
      }
    };

    requestAnimationFrame(updateCount);
  }, [isInView, target]);

  return (
    <div ref={ref} className="text-center py-6 px-4 flex flex-col items-center">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-luxury-gold tracking-wide mb-2"
      >
        {count}
        {suffix}
      </motion.div>
      <motion.span 
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.6 } : {}}
        transition={{ duration: 1.2 }}
        className="text-[11px] md:text-xs text-luxury-ivory tracking-[0.25em] uppercase text-center max-w-[150px]"
      >
        {label}
      </motion.span>
    </div>
  );
}

export default function Stats() {
  const statsList = [
    { target: '15', suffix: '+', label: 'Years of Excellence' },
    { target: '50', suffix: '+', label: 'Signature Dishes' },
    { target: '25', suffix: 'K+', label: 'Happy Guests' },
    { target: '5', suffix: ' Star', label: 'Dining Experience' },
  ];

  return (
    <section className="bg-luxury-darkGray border-y border-luxury-gold/15 py-16 md:py-24 relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x-[0.5px] divide-luxury-gold/20">
        {statsList.map((stat, index) => (
          <div key={index} className={index === 0 ? "" : "pl-4 md:pl-0"}>
            <Counter
              target={stat.target}
              suffix={stat.suffix}
              label={stat.label}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
