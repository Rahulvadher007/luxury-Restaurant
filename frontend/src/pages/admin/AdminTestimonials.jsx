import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, RefreshCw, Trash2, Star, EyeOff, Eye, User } from 'lucide-react';

export default function AdminTestimonials() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'approved', 'rejected'

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem('aurum_admin_token');
      const res = await fetch('/api/testimonials/admin', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('aurum_admin_token');
      const res = await fetch(`/api/testimonials/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (res.ok) {
        fetchReviews(); // Refresh list
      }
    } catch (error) {
      console.error(`Error updating review to ${status}:`, error);
    }
  };

  const handleToggleFeatured = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('aurum_admin_token');
      const res = await fetch(`/api/testimonials/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ featured: !currentStatus })
      });

      if (res.ok) {
        fetchReviews(); // Refresh list
      }
    } catch (error) {
      console.error('Error toggling featured:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this review? This cannot be undone.')) return;
    
    try {
      const token = localStorage.getItem('aurum_admin_token');
      const res = await fetch(`/api/testimonials/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchReviews();
      }
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  // Derived Statistics
  const pendingReviews = reviews.filter(r => r.status === 'pending');
  const approvedReviews = reviews.filter(r => r.status === 'approved');
  const rejectedReviews = reviews.filter(r => r.status === 'rejected');
  
  const avgRating = approvedReviews.length > 0 
    ? (approvedReviews.reduce((acc, curr) => acc + curr.rating, 0) / approvedReviews.length).toFixed(1)
    : 0;

  const currentList = 
    activeTab === 'pending' ? pendingReviews :
    activeTab === 'approved' ? approvedReviews : 
    rejectedReviews;

  return (
    <div className="space-y-8 pb-10">
      
      {/* Header */}
      <div className="border-b border-luxury-gold/15 pb-6">
        <h1 className="text-3xl font-display font-bold uppercase tracking-wider text-luxury-gold">Guest Feedback Management</h1>
        <p className="text-xs text-luxury-ivory/50 tracking-widest uppercase mt-2">
          Review, Moderate, and Curate Customer Testimonials
        </p>
      </div>

      {/* Statistics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-[#050505] border border-luxury-gold/15 rounded-sm p-4 text-center">
          <span className="block text-[10px] text-luxury-ivory/50 tracking-widest uppercase mb-1">Total</span>
          <span className="text-2xl font-display text-luxury-ivory">{reviews.length}</span>
        </div>
        <div className="bg-[#050505] border border-yellow-500/30 rounded-sm p-4 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-yellow-500/5 group-hover:bg-yellow-500/10 transition-colors"></div>
          <span className="relative z-10 block text-[10px] text-yellow-500/70 tracking-widest uppercase mb-1">Pending</span>
          <span className="relative z-10 text-2xl font-display text-yellow-500">{pendingReviews.length}</span>
        </div>
        <div className="bg-[#050505] border border-green-500/30 rounded-sm p-4 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-green-500/5 group-hover:bg-green-500/10 transition-colors"></div>
          <span className="relative z-10 block text-[10px] text-green-500/70 tracking-widest uppercase mb-1">Approved</span>
          <span className="relative z-10 text-2xl font-display text-green-500">{approvedReviews.length}</span>
        </div>
        <div className="bg-[#050505] border border-red-500/30 rounded-sm p-4 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-red-500/5 group-hover:bg-red-500/10 transition-colors"></div>
          <span className="relative z-10 block text-[10px] text-red-500/70 tracking-widest uppercase mb-1">Rejected</span>
          <span className="relative z-10 text-2xl font-display text-red-500">{rejectedReviews.length}</span>
        </div>
        <div className="bg-[#050505] border border-luxury-gold/30 rounded-sm p-4 text-center relative overflow-hidden group col-span-2 md:col-span-1">
          <div className="absolute inset-0 bg-luxury-gold/5 group-hover:bg-luxury-gold/10 transition-colors"></div>
          <span className="relative z-10 block text-[10px] text-luxury-gold/70 tracking-widest uppercase mb-1">Avg Rating</span>
          <span className="relative z-10 text-2xl font-display text-luxury-gold flex items-center justify-center gap-1">
            {avgRating} <Star size={18} className="fill-luxury-gold" />
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-2 border-b border-luxury-gold/10">
        <button 
          onClick={() => setActiveTab('pending')}
          className={`px-6 py-3 text-xs tracking-widest uppercase font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'pending' ? 'text-yellow-500 border-b-2 border-yellow-500' : 'text-luxury-ivory/40 hover:text-luxury-ivory'
          }`}
        >
          Pending {pendingReviews.length > 0 && <span className="bg-yellow-500 text-black px-1.5 py-0.5 rounded-full text-[9px]">{pendingReviews.length}</span>}
        </button>
        <button 
          onClick={() => setActiveTab('approved')}
          className={`px-6 py-3 text-xs tracking-widest uppercase font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'approved' ? 'text-green-500 border-b-2 border-green-500' : 'text-luxury-ivory/40 hover:text-luxury-ivory'
          }`}
        >
          Approved
        </button>
        <button 
          onClick={() => setActiveTab('rejected')}
          className={`px-6 py-3 text-xs tracking-widest uppercase font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'rejected' ? 'text-red-500 border-b-2 border-red-500' : 'text-luxury-ivory/40 hover:text-luxury-ivory'
          }`}
        >
          Rejected
        </button>
      </div>

      {/* Review List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-20 text-center text-luxury-gold/50 text-xs tracking-widest uppercase animate-pulse">
            Fetching Customer Feedback...
          </div>
        ) : currentList.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center opacity-50">
            <span className="text-xs tracking-widest uppercase text-luxury-ivory">No {activeTab} reviews found</span>
          </div>
        ) : (
          <AnimatePresence>
            {currentList.map((review) => (
              <motion.div 
                key={review._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#050505] border border-luxury-gold/15 p-6 rounded-sm flex flex-col md:flex-row gap-6 relative group hover:border-luxury-gold/30 transition-colors"
              >
                {/* Author Info */}
                <div className="flex-shrink-0 flex flex-col items-center md:items-start md:w-48 border-b md:border-b-0 md:border-r border-luxury-gold/10 pb-4 md:pb-0 md:pr-6">
                  <div className="w-16 h-16 rounded-full bg-luxury-black border border-luxury-gold/30 flex items-center justify-center overflow-hidden mb-3">
                    {review.image ? (
                      <img src={review.image} alt={review.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="text-luxury-gold/50" />
                    )}
                  </div>
                  <h3 className="font-display font-bold text-luxury-ivory text-center md:text-left">{review.name}</h3>
                  <p className="text-[10px] text-luxury-ivory/50 mt-1 text-center md:text-left break-all">{review.email}</p>
                  <p className="text-[9px] text-luxury-gold/40 mt-2 uppercase tracking-widest">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Review Content */}
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={i < review.rating ? "fill-luxury-gold text-luxury-gold" : "text-luxury-ivory/20"} />
                    ))}
                  </div>
                  <p className="text-sm text-luxury-ivory/80 italic leading-relaxed flex-1">"{review.review}"</p>
                  
                  {/* Actions based on Tab */}
                  <div className="mt-6 pt-4 border-t border-luxury-gold/10 flex flex-wrap gap-3 justify-end">
                    
                    {activeTab === 'pending' && (
                      <>
                        <button 
                          onClick={() => handleUpdateStatus(review._id, 'approved')}
                          className="bg-green-500/10 text-green-500 border border-green-500/30 px-4 py-2 rounded-sm text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 hover:bg-green-500 hover:text-black transition-colors"
                        >
                          <Check size={14} /> Approve
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(review._id, 'rejected')}
                          className="bg-red-500/10 text-red-500 border border-red-500/30 px-4 py-2 rounded-sm text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 hover:bg-red-500 hover:text-white transition-colors"
                        >
                          <X size={14} /> Reject
                        </button>
                      </>
                    )}

                    {activeTab === 'approved' && (
                      <>
                        <button 
                          onClick={() => handleToggleFeatured(review._id, review.featured)}
                          className={`px-4 py-2 rounded-sm text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 transition-colors border ${
                            review.featured 
                              ? 'bg-luxury-gold text-black border-luxury-gold hover:bg-transparent hover:text-luxury-gold' 
                              : 'bg-transparent text-luxury-gold border-luxury-gold/30 hover:border-luxury-gold'
                          }`}
                        >
                          <Star size={14} className={review.featured ? 'fill-black' : ''} /> 
                          {review.featured ? 'Unfeature' : 'Feature on Home'}
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(review._id, 'rejected')}
                          className="text-luxury-ivory/50 border border-luxury-ivory/10 px-4 py-2 rounded-sm text-[10px] uppercase tracking-widest flex items-center gap-2 hover:text-white hover:border-white/30 transition-colors"
                        >
                          <EyeOff size={14} /> Unpublish
                        </button>
                        <button 
                          onClick={() => handleDelete(review._id)}
                          className="text-red-500/70 border border-red-500/20 px-4 py-2 rounded-sm text-[10px] uppercase tracking-widest flex items-center gap-2 hover:text-red-500 hover:border-red-500/50 transition-colors"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </>
                    )}

                    {activeTab === 'rejected' && (
                      <>
                        <button 
                          onClick={() => handleUpdateStatus(review._id, 'pending')}
                          className="text-yellow-500/70 border border-yellow-500/30 px-4 py-2 rounded-sm text-[10px] uppercase tracking-widest flex items-center gap-2 hover:text-yellow-500 hover:border-yellow-500 transition-colors"
                        >
                          <RefreshCw size={14} /> Restore to Pending
                        </button>
                        <button 
                          onClick={() => handleDelete(review._id)}
                          className="bg-red-500/10 text-red-500 border border-red-500/30 px-4 py-2 rounded-sm text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 hover:bg-red-500 hover:text-white transition-colors"
                        >
                          <Trash2 size={14} /> Delete Permanently
                        </button>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Featured Badge Overlay */}
                {review.featured && activeTab === 'approved' && (
                  <div className="absolute top-0 right-0 bg-luxury-gold text-black text-[9px] px-3 py-1 font-bold tracking-widest uppercase rounded-bl-lg shadow-md">
                    Featured
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

    </div>
  );
}
