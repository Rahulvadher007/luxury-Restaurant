import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Image as ImageIcon } from 'lucide-react';
import ImageUpload from '../../components/admin/ImageUpload';

export default function AdminGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    category: 'Interior',
    image: '',
    featured: false
  });

  const fetchImages = async () => {
    try {
      const res = await fetch('/api/gallery');
      if (res.ok) {
        const data = await res.json();
        setImages(data);
      }
    } catch (error) {
      console.error('Error fetching gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleOpenModal = (img = null) => {
    if (img) {
      setEditingImage(img);
      setFormData({
        title: img.title,
        category: img.category || 'Interior',
        image: img.image,
        featured: img.featured || false
      });
    } else {
      setEditingImage(null);
      setFormData({
        title: '',
        category: 'Interior',
        image: '',
        featured: false
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('aurum_admin_token');
    const url = editingImage ? `/api/gallery/${editingImage._id}` : '/api/gallery';
    const method = editingImage ? 'PUT' : 'POST';

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
        fetchImages();
        handleCloseModal();
      }
    } catch (error) {
      console.error('Error saving image:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    
    try {
      const token = localStorage.getItem('aurum_admin_token');
      const res = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchImages();
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-end border-b border-luxury-gold/15 pb-6">
        <div>
          <h1 className="text-3xl font-display font-bold uppercase tracking-wider text-luxury-gold">Visual Portfolio</h1>
          <p className="text-xs text-luxury-ivory/50 tracking-widest uppercase mt-2">
            Manage Gallery Content & Imagery
          </p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-luxury-gold text-[#0F0F0F] px-6 py-3 rounded-sm font-semibold text-[10px] tracking-widest uppercase hover:bg-white transition-colors flex items-center gap-2"
        >
          <Plus size={16} /> Add Image
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center text-luxury-gold/50 text-xs tracking-widest uppercase animate-pulse">
            Retrieving Gallery Assets...
          </div>
        ) : images.length === 0 ? (
          <div className="col-span-full py-20 text-center flex flex-col items-center opacity-50">
            <ImageIcon size={48} className="text-luxury-gold mb-4" />
            <span className="text-xs tracking-widest uppercase text-luxury-ivory">No imagery uploaded yet</span>
          </div>
        ) : (
          images.map((img, index) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              key={img._id}
              className={`bg-[#050505] border ${img.featured ? 'border-luxury-gold/50 shadow-[0_0_15px_rgba(212,175,55,0.1)]' : 'border-luxury-gold/15'} rounded-sm overflow-hidden relative group hover:border-luxury-gold/40 transition-all flex flex-col`}
            >
              <div className="h-48 overflow-hidden relative">
                <img src={img.image} alt={img.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent opacity-80"></div>
                
                {img.featured && (
                  <div className="absolute top-4 right-4 bg-luxury-gold text-[#0F0F0F] text-[9px] px-2 py-1 tracking-widest uppercase font-bold rounded-sm shadow-lg">
                    Featured
                  </div>
                )}
                
                <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-luxury-ivory text-[9px] px-2 py-1 tracking-widest uppercase rounded-sm border border-luxury-gold/20">
                  {img.category}
                </span>
              </div>
              
              <div className="p-5 flex-1 flex flex-col justify-between relative z-10">
                <div>
                  <h3 className="font-display text-luxury-gold text-lg truncate mb-1">{img.title}</h3>
                </div>
                
                <div className="flex justify-end gap-3 pt-4 border-t border-luxury-gold/10 mt-4">
                  <button 
                    onClick={() => handleOpenModal(img)}
                    className="text-luxury-gold hover:text-white transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(img._id)}
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
                  {editingImage ? 'Update Asset' : 'Add Gallery Asset'}
                </h2>
                <button onClick={handleCloseModal} className="text-luxury-ivory/50 hover:text-luxury-gold transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                
                <ImageUpload 
                  label="Gallery Image" 
                  value={formData.image}
                  onChange={(url) => setFormData({...formData, image: url})}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] text-luxury-gold tracking-widest uppercase mb-2">Image Title / Description</label>
                    <input 
                      type="text" 
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full bg-[#050505] border border-luxury-gold/20 focus:border-luxury-gold text-luxury-ivory p-3 text-sm outline-none transition-colors"
                      placeholder="e.g. Main Dining Room"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-luxury-gold tracking-widest uppercase mb-2">Category</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full bg-[#050505] border border-luxury-gold/20 focus:border-luxury-gold text-luxury-ivory p-3 text-sm outline-none transition-colors"
                    >
                      <option value="Interior">Interior</option>
                      <option value="Dishes">Dishes</option>
                      <option value="Events">Events</option>
                      <option value="Behind the Scenes">Behind the Scenes</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center mt-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 border flex items-center justify-center transition-colors ${
                      formData.featured 
                        ? 'bg-luxury-gold border-luxury-gold text-[#0F0F0F]' 
                        : 'border-luxury-gold/30 group-hover:border-luxury-gold/60'
                    }`}>
                      {formData.featured && <div className="w-2.5 h-2.5 bg-[#0F0F0F] rounded-full"></div>}
                    </div>
                    <span className="text-xs text-luxury-ivory tracking-wider">Highlight in featured view</span>
                    <input 
                      type="checkbox" 
                      className="hidden"
                      checked={formData.featured}
                      onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                    />
                  </label>
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
                    className="bg-luxury-gold text-[#0F0F0F] px-8 py-3 rounded-sm font-semibold text-[10px] tracking-widest uppercase hover:bg-white transition-colors disabled:opacity-50"
                    disabled={!formData.image}
                  >
                    {editingImage ? 'Save Changes' : 'Publish Asset'}
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
