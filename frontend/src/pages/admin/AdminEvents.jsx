import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Star } from 'lucide-react';
import ImageUpload from '../../components/admin/ImageUpload';

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    description: '',
    price: '',
    isUpcoming: true,
    image: ''
  });

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events');
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleOpenModal = (event = null) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        title: event.title,
        date: event.date,
        time: event.time,
        description: event.description,
        price: event.price,
        isUpcoming: event.isUpcoming,
        image: event.image || ''
      });
    } else {
      setEditingEvent(null);
      setFormData({
        title: '',
        date: '',
        time: '',
        description: '',
        price: '',
        isUpcoming: true,
        image: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('aurum_admin_token');
    const url = editingEvent ? `/api/events/${editingEvent._id}` : '/api/events';
    const method = editingEvent ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        fetchEvents();
        handleCloseModal();
      }
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to cancel and delete this event?')) return;
    
    try {
      const token = localStorage.getItem('aurum_admin_token');
      const res = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchEvents();
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-end border-b border-luxury-gold/15 pb-6">
        <div>
          <h1 className="text-3xl font-display font-bold uppercase tracking-wider text-luxury-gold">Exclusive Events</h1>
          <p className="text-xs text-luxury-ivory/50 tracking-widest uppercase mt-2">
            Schedule and manage private functions
          </p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-luxury-gold text-[#0F0F0F] px-6 py-3 rounded-sm font-semibold text-[10px] tracking-widest uppercase hover:bg-white transition-colors flex items-center gap-2"
        >
          <Plus size={16} /> Schedule Event
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center text-luxury-gold/50 text-xs tracking-widest uppercase animate-pulse">
            Retrieving Event Schedule...
          </div>
        ) : (
          events.map((event, index) => (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              key={event._id}
              className="bg-[#050505] border border-luxury-gold/15 rounded-sm overflow-hidden group hover:border-luxury-gold/40 transition-colors flex flex-col md:flex-row"
            >
              <div className="h-48 md:h-auto md:w-2/5 bg-[#111] relative border-b md:border-b-0 md:border-r border-luxury-gold/15 overflow-hidden">
                {event.image ? (
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-luxury-gold/20">
                    <Star size={48} />
                  </div>
                )}
                <div className={`absolute top-3 left-3 text-[9px] px-2 py-1 tracking-widest uppercase font-bold rounded-sm shadow-lg ${
                  event.isUpcoming ? 'bg-luxury-gold text-[#0F0F0F]' : 'bg-gray-800 text-gray-300'
                }`}>
                  {event.isUpcoming ? 'Upcoming' : 'Past Event'}
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-display text-luxury-gold leading-tight pr-2">{event.title}</h3>
                  <span className="text-luxury-ivory font-semibold text-sm whitespace-nowrap">{event.price}</span>
                </div>
                
                <div className="flex items-center gap-2 text-[10px] text-luxury-gold/70 tracking-widest uppercase mb-4">
                  <span>{event.date}</span>
                  <span className="w-1 h-1 rounded-full bg-luxury-gold/30"></span>
                  <span>{event.time}</span>
                </div>

                <p className="text-xs text-luxury-ivory/70 flex-1 line-clamp-3">{event.description}</p>
                
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-luxury-gold/10">
                  <button 
                    onClick={() => handleOpenModal(event)}
                    className="text-luxury-gold hover:text-white transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(event._id)}
                    className="text-red-500/70 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Editor Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#0A0A0A] border border-luxury-gold/30 rounded-sm w-full max-w-2xl relative z-10 max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-[#0A0A0A] border-b border-luxury-gold/15 p-6 flex justify-between items-center z-20">
                <h2 className="text-xl font-display text-luxury-gold uppercase tracking-wider">
                  {editingEvent ? 'Update Event Details' : 'Schedule New Event'}
                </h2>
                <button onClick={handleCloseModal} className="text-luxury-ivory/50 hover:text-luxury-gold transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                
                <ImageUpload 
                  label="Event Poster (Cloudinary)" 
                  value={formData.image}
                  onChange={(url) => setFormData({...formData, image: url})}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] text-luxury-gold tracking-widest uppercase mb-2">Event Title</label>
                    <input 
                      type="text" 
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full bg-[#050505] border border-luxury-gold/20 focus:border-luxury-gold text-luxury-ivory p-3 text-sm outline-none transition-colors"
                      placeholder="e.g. A Night in Tuscany"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-luxury-gold tracking-widest uppercase mb-2">Date</label>
                    <input 
                      type="text" 
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full bg-[#050505] border border-luxury-gold/20 focus:border-luxury-gold text-luxury-ivory p-3 text-sm outline-none transition-colors"
                      placeholder="e.g. October 15, 2026"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-luxury-gold tracking-widest uppercase mb-2">Time</label>
                    <input 
                      type="text" 
                      required
                      value={formData.time}
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                      className="w-full bg-[#050505] border border-luxury-gold/20 focus:border-luxury-gold text-luxury-ivory p-3 text-sm outline-none transition-colors"
                      placeholder="e.g. 7:00 PM - 11:00 PM"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-luxury-gold tracking-widest uppercase mb-2">Description</label>
                  <textarea 
                    required
                    rows="4"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-[#050505] border border-luxury-gold/20 focus:border-luxury-gold text-luxury-ivory p-3 text-sm outline-none transition-colors resize-none"
                    placeholder="Describe the atmosphere, menu, and exclusivity..."
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] text-luxury-gold tracking-widest uppercase mb-2">Price / Entry Fee</label>
                    <input 
                      type="text" 
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full bg-[#050505] border border-luxury-gold/20 focus:border-luxury-gold text-luxury-ivory p-3 text-sm outline-none transition-colors"
                      placeholder="e.g. $250 per guest"
                    />
                  </div>
                  <div className="flex items-center mt-6">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-5 h-5 border flex items-center justify-center transition-colors ${
                        formData.isUpcoming 
                          ? 'bg-luxury-gold border-luxury-gold text-[#0F0F0F]' 
                          : 'border-luxury-gold/30 group-hover:border-luxury-gold/60'
                      }`}>
                        {formData.isUpcoming && <div className="w-2.5 h-2.5 bg-[#0F0F0F] rounded-full"></div>}
                      </div>
                      <span className="text-xs text-luxury-ivory tracking-wider">Mark as Upcoming Event</span>
                      <input 
                        type="checkbox" 
                        className="hidden"
                        checked={formData.isUpcoming}
                        onChange={(e) => setFormData({...formData, isUpcoming: e.target.checked})}
                      />
                    </label>
                  </div>
                </div>

                <div className="pt-6 border-t border-luxury-gold/15 flex justify-end gap-4">
                  <button 
                    type="button" 
                    onClick={handleCloseModal}
                    className="px-6 py-3 text-xs tracking-widest uppercase text-luxury-ivory/70 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="bg-luxury-gold text-[#0F0F0F] px-8 py-3 rounded-sm font-semibold text-[10px] tracking-widest uppercase hover:bg-white transition-colors"
                  >
                    {editingEvent ? 'Save Details' : 'Schedule Event'}
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
