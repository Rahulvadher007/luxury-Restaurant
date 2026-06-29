import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, ChefHat } from 'lucide-react';
import ImageUpload from '../../components/admin/ImageUpload';

export default function AdminChefs() {
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChef, setEditingChef] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    bio: '',
    signatureDish: '',
    order: 0,
    image: ''
  });

  const fetchChefs = async () => {
    try {
      const res = await fetch('/api/chefs');
      if (res.ok) {
        const data = await res.json();
        setChefs(data);
      }
    } catch (error) {
      console.error('Error fetching chefs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChefs();
  }, []);

  const handleOpenModal = (chef = null) => {
    if (chef) {
      setEditingChef(chef);
      setFormData({
        name: chef.name,
        title: chef.title,
        bio: chef.bio,
        signatureDish: chef.signatureDish || '',
        order: chef.order || 0,
        image: chef.image || ''
      });
    } else {
      setEditingChef(null);
      setFormData({
        name: '',
        title: '',
        bio: '',
        signatureDish: '',
        order: chefs.length,
        image: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingChef(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('aurum_admin_token');
    const url = editingChef ? `/api/chefs/${editingChef._id}` : '/api/chefs';
    const method = editingChef ? 'PUT' : 'POST';

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
        fetchChefs();
        handleCloseModal();
      }
    } catch (error) {
      console.error('Error saving chef:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this chef from the registry?')) return;
    
    try {
      const token = localStorage.getItem('aurum_admin_token');
      const res = await fetch(`/api/chefs/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchChefs();
      }
    } catch (error) {
      console.error('Error deleting chef:', error);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-end border-b border-luxury-gold/15 pb-6">
        <div>
          <h1 className="text-3xl font-display font-bold uppercase tracking-wider text-luxury-gold">Culinary Masters</h1>
          <p className="text-xs text-luxury-ivory/50 tracking-widest uppercase mt-2">
            Manage the Aurum Chef Registry
          </p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-luxury-gold text-[#0F0F0F] px-6 py-3 rounded-sm font-semibold text-[10px] tracking-widest uppercase hover:bg-white transition-colors flex items-center gap-2"
        >
          <Plus size={16} /> Register Chef
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center text-luxury-gold/50 text-xs tracking-widest uppercase animate-pulse">
            Retrieving Registry...
          </div>
        ) : (
          chefs.map((chef, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              key={chef._id}
              className="bg-[#050505] border border-luxury-gold/15 rounded-sm overflow-hidden group hover:border-luxury-gold/40 transition-colors flex flex-col"
            >
              <div className="h-64 w-full bg-[#111] relative border-b border-luxury-gold/15 overflow-hidden">
                {chef.image ? (
                  <img src={chef.image} alt={chef.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 object-top" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-luxury-gold/20">
                    <ChefHat size={64} />
                  </div>
                )}
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-display text-luxury-gold leading-tight">{chef.name}</h3>
                <p className="text-[10px] text-luxury-ivory/60 tracking-widest uppercase mt-1 mb-4">{chef.title}</p>
                <p className="text-xs text-luxury-ivory/70 flex-1">{chef.bio}</p>
                
                {chef.signatureDish && (
                  <div className="mt-4 p-3 bg-luxury-gold/5 border border-luxury-gold/10 rounded-sm">
                    <p className="text-[9px] text-luxury-gold tracking-widest uppercase mb-1">Signature Creation</p>
                    <p className="text-xs text-luxury-ivory">{chef.signatureDish}</p>
                  </div>
                )}
                
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-luxury-gold/10">
                  <button 
                    onClick={() => handleOpenModal(chef)}
                    className="text-luxury-gold hover:text-white transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(chef._id)}
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
                  {editingChef ? 'Update Master Details' : 'Register New Master'}
                </h2>
                <button onClick={handleCloseModal} className="text-luxury-ivory/50 hover:text-luxury-gold transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                
                <ImageUpload 
                  label="Master Portrait (Cloudinary)" 
                  value={formData.image}
                  onChange={(url) => setFormData({...formData, image: url})}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] text-luxury-gold tracking-widest uppercase mb-2">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-[#050505] border border-luxury-gold/20 focus:border-luxury-gold text-luxury-ivory p-3 text-sm outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-luxury-gold tracking-widest uppercase mb-2">Title</label>
                    <input 
                      type="text" 
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full bg-[#050505] border border-luxury-gold/20 focus:border-luxury-gold text-luxury-ivory p-3 text-sm outline-none transition-colors"
                      placeholder="e.g. Executive Sous Chef"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-luxury-gold tracking-widest uppercase mb-2">Biography</label>
                  <textarea 
                    required
                    rows="4"
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    className="w-full bg-[#050505] border border-luxury-gold/20 focus:border-luxury-gold text-luxury-ivory p-3 text-sm outline-none transition-colors resize-none"
                    placeholder="Describe their background, philosophy, and expertise..."
                  ></textarea>
                </div>

                <div>
                  <label className="block text-[10px] text-luxury-gold tracking-widest uppercase mb-2">Signature Creation (Optional)</label>
                  <input 
                    type="text" 
                    value={formData.signatureDish}
                    onChange={(e) => setFormData({...formData, signatureDish: e.target.value})}
                    className="w-full bg-[#050505] border border-luxury-gold/20 focus:border-luxury-gold text-luxury-ivory p-3 text-sm outline-none transition-colors"
                    placeholder="e.g. The Golden Truffle Risotto"
                  />
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
                    {editingChef ? 'Save Changes' : 'Register'}
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
