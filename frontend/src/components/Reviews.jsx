import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function Reviews() {
  const [reviewsList, setReviewsList] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 5,
    review: ''
  });

  const fetchApprovedReviews = () => {
    fetch('/api/testimonials')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Filter to only show featured testimonials on the home page
          const featured = data.filter(t => t.featured);
          if (featured.length > 0) {
            setReviewsList(featured);
          } else if (data.length > 0) {
            // Fallback to latest 3 if none are explicitly featured
            setReviewsList(data.slice(0, 3));
          }
        }
      })
      .catch(err => console.error('Error fetching testimonials:', err));
  };

  useEffect(() => {
    fetchApprovedReviews();
  }, []);

  useEffect(() => {
    if (reviewsList.length === 0) return;
    
    const timer = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % reviewsList.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [reviewsList.length]);

  const handlePrev = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + reviewsList.length) % reviewsList.length);
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % reviewsList.length);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ type: 'loading', message: 'Submitting review...' });

    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitStatus({ type: 'success', message: 'Thank you! Your review has been submitted and is pending moderation.' });
        setFormData({ name: '', email: '', rating: 5, review: '' });
        setTimeout(() => {
          setIsModalOpen(false);
          setSubmitStatus({ type: '', message: '' });
        }, 3000);
      } else {
        setSubmitStatus({ type: 'error', message: data.message || 'Failed to submit review.' });
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'An unexpected error occurred.' });
    }
  };

  return (
    <section id="reviews" className="bg-luxury-darkGray py-24 px-6 relative z-10 border-t border-luxury-gold/15 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-luxury-gold/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <span className="text-luxury-gold tracking-[0.3em] text-xs font-semibold uppercase block mb-3">
          Guest Testimonials
        </span>
        <h2 className="font-display text-4xl md:text-5xl font-bold tracking-[0.05em] text-luxury-ivory uppercase mb-12">
          Customer Reviews
        </h2>

        {reviewsList.length === 0 ? (
          <div className="py-20 text-luxury-ivory/50 font-display italic">
            No reviews available at the moment.
          </div>
        ) : (
          <div className="relative min-h-[300px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                className="space-y-6 w-full"
              >
                <div className="flex items-center justify-center space-x-1">
                  {[...Array(reviewsList[activeIndex].rating || 5)].map((_, i) => (
                    <Star key={i} size={18} fill="#D4AF37" className="text-luxury-gold" />
                  ))}
                </div>

                <p className="font-display text-lg md:text-2xl italic font-light text-luxury-ivory/90 leading-relaxed max-w-3xl mx-auto px-4 md:px-12">
                  "{reviewsList[activeIndex].review}"
                </p>

                <div className="flex flex-col items-center pt-6">
                  <div className="w-14 h-14 bg-luxury-black border border-luxury-gold/30 rounded-full flex items-center justify-center mb-3 shadow-gold-glow overflow-hidden">
                    {reviewsList[activeIndex].image ? (
                      <img src={reviewsList[activeIndex].image} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-display text-sm tracking-wider font-semibold text-luxury-gold uppercase">
                        {reviewsList[activeIndex].name ? reviewsList[activeIndex].name.charAt(0) : 'G'}
                      </span>
                    )}
                  </div>
                  <h4 className="font-display text-lg font-bold text-luxury-ivory tracking-wide">
                    {reviewsList[activeIndex].name}
                  </h4>
                  <span className="text-[10px] text-luxury-gold tracking-[0.25em] uppercase mt-1">
                    Verified Guest
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {reviewsList.length > 0 && (
          <div className="flex items-center justify-center space-x-8 mt-8">
            <button onClick={handlePrev} className="w-10 h-10 border border-luxury-gold/25 text-luxury-gold rounded-full flex items-center justify-center hover:bg-luxury-gold hover:text-luxury-black hover:border-luxury-gold transition-all duration-300">
              <ChevronLeft size={20} />
            </button>
            <div className="flex space-x-2">
              {reviewsList.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${activeIndex === index ? 'bg-luxury-gold w-6' : 'bg-luxury-ivory/20'}`}
                ></button>
              ))}
            </div>
            <button onClick={handleNext} className="w-10 h-10 border border-luxury-gold/25 text-luxury-gold rounded-full flex items-center justify-center hover:bg-luxury-gold hover:text-luxury-black hover:border-luxury-gold transition-all duration-300">
              <ChevronRight size={20} />
            </button>
          </div>
        )}

        {/* Leave a Review Button */}
        <div className="mt-16">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="border border-luxury-gold/50 text-luxury-gold px-8 py-3 tracking-[0.2em] uppercase text-xs font-semibold hover:bg-luxury-gold hover:text-black transition-all duration-300 shadow-gold-glow"
          >
            Leave a Review
          </button>
        </div>
      </div>

      {/* Review Submission Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#0A0A0A] border border-luxury-gold/30 rounded-sm w-full max-w-xl relative z-10 max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-[#0A0A0A] border-b border-luxury-gold/15 p-6 flex justify-between items-center z-20">
                <h2 className="text-xl font-display text-luxury-gold uppercase tracking-wider">
                  Share Your Experience
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-luxury-ivory/50 hover:text-luxury-gold transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleReviewSubmit} className="p-6 space-y-5 text-left">
                {submitStatus.message && (
                  <div className={`p-3 text-xs tracking-widest uppercase border ${
                    submitStatus.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-500' :
                    submitStatus.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-500' :
                    'bg-luxury-gold/10 border-luxury-gold/30 text-luxury-gold'
                  }`}>
                    {submitStatus.message}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] text-luxury-gold tracking-widest uppercase mb-2">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-[#050505] border border-luxury-gold/20 focus:border-luxury-gold text-luxury-ivory p-3 text-sm outline-none transition-colors"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-luxury-gold tracking-widest uppercase mb-2">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-[#050505] border border-luxury-gold/20 focus:border-luxury-gold text-luxury-ivory p-3 text-sm outline-none transition-colors"
                      placeholder="e.g. john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-luxury-gold tracking-widest uppercase mb-2">Your Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({...formData, rating: star})}
                        className="focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star 
                          size={24} 
                          className={star <= formData.rating ? "fill-luxury-gold text-luxury-gold" : "text-luxury-ivory/20"} 
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-luxury-gold tracking-widest uppercase mb-2">Review Message</label>
                  <textarea 
                    required
                    rows="4"
                    value={formData.review}
                    onChange={(e) => setFormData({...formData, review: e.target.value})}
                    className="w-full bg-[#050505] border border-luxury-gold/20 focus:border-luxury-gold text-luxury-ivory p-3 text-sm outline-none transition-colors resize-none"
                    placeholder="Describe your dining experience..."
                  ></textarea>
                </div>

                <div className="pt-4 flex justify-end">
                  <button 
                    type="submit" 
                    disabled={submitStatus.type === 'loading'}
                    className="bg-luxury-gold text-[#0F0F0F] px-8 py-3 rounded-sm font-semibold text-[10px] tracking-widest uppercase hover:bg-white transition-colors disabled:opacity-50"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
