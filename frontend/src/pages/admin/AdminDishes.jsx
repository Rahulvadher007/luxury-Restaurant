import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, ChefHat, Star, CheckCircle } from 'lucide-react';
import ImageUpload from '../../components/admin/ImageUpload';

export default function AdminDishes() {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'food',
    chefRecommendation: false,
    image: ''
  });

  const fetchDishes = async () => {
    try {
      const res = await fetch('/api/menu');
      if (res.ok) {
        const data = await res.json();
        setDishes(data);
      }
    } catch (error) {
      console.error('Error fetching dishes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDishes();
  }, []);

  const handleOpenModal = (dish = null) => {
    if (dish) {
      setEditingDish(dish);
      setFormData({
        name: dish.name,
        description: dish.description,
        price: dish.price,
        category: dish.category,
        chefRecommendation: dish.chefRecommendation,
        image: dish.image || ''
      });
    } else {
      setEditingDish(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'food',
        chefRecommendation: false,
        image: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDish(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('aurum_admin_token');
    const url = editingDish ? `/api/menu/${editingDish._id}` : '/api/menu';
    const method = editingDish ? 'PUT' : 'POST';

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
        fetchDishes();
        handleCloseModal();
      }
    } catch (error) {
      console.error('Error saving dish:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this exquisite dish?')) return;
    
    try {
      const token = localStorage.getItem('aurum_admin_token');
      const res = await fetch(`/api/menu/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchDishes();
      }
    } catch (error) {
      console.error('Error deleting dish:', error);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-luxury-gold/15 pb-6">
        <div>
          <h1 className="text-3xl font-display font-bold uppercase tracking-wider text-luxury-gold">Culinary Creations</h1>
          <p className="text-xs text-luxury-ivory/50 tracking-widest uppercase mt-2">
            Manage the Aurum Tasting Menu
          </p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-luxury-gold text-[#0F0F0F] px-6 py-3 rounded-sm font-semibold text-[10px] tracking-widest uppercase hover:bg-white transition-colors flex items-center gap-2"
        >
          <Plus size={16} /> Add Creation
        </button>
      </div>

      {/* Grid of Dishes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center text-luxury-gold/50 text-xs tracking-widest uppercase animate-pulse">
            Retrieving Culinary Masterpieces...
          </div>
        ) : (
          dishes.map((dish, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              key={dish._id}
              className="bg-[#050505] border border-luxury-gold/15 rounded-sm overflow-hidden group hover:border-luxury-gold/40 transition-colors flex flex-col"
            >
              <div className="h-48 w-full bg-[#111] relative border-b border-luxury-gold/15 overflow-hidden">
                {dish.image ? (
                  <img src={dish.image} alt={dish.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-luxury-gold/20">
                    <ChefHat size={48} />
                  </div>
                )}
                {dish.chefRecommendation && (
                  <div className="absolute top-3 right-3 bg-luxury-gold text-[#0F0F0F] text-[9px] px-2 py-1 tracking-widest uppercase font-bold rounded-sm flex items-center gap-1 shadow-lg shadow-black/50">
                    <Star size={10} fill="#0F0F0F" /> Featured
                  </div>
                )}
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-display text-luxury-gold leading-tight pr-2">{dish.name}</h3>
                  <span className="text-luxury-ivory font-semibold">{dish.price}</span>
                </div>
                <p className="text-[10px] text-luxury-gold/50 tracking-widest uppercase mb-4">{dish.category}</p>
                <p className="text-xs text-luxury-ivory/70 flex-1 line-clamp-3">{dish.description}</p>
                
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-luxury-gold/10">
                  <button 
                    onClick={() => handleOpenModal(dish)}
                    className="text-luxury-gold hover:text-white transition-colors"
                    title="Edit Dish"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(dish._id)}
                    className="text-red-500/70 hover:text-red-500 transition-colors"
                    title="Delete Dish"
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
                  {editingDish ? 'Edit Creation' : 'New Culinary Creation'}
                </h2>
                <button onClick={handleCloseModal} className="text-luxury-ivory/50 hover:text-luxury-gold transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                
                <ImageUpload 
                  label="Dish Photography (Cloudinary)" 
                  value={formData.image}
                  onChange={(url) => setFormData({...formData, image: url})}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] text-luxury-gold tracking-widest uppercase mb-2">Dish Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-[#050505] border border-luxury-gold/20 focus:border-luxury-gold text-luxury-ivory p-3 text-sm outline-none transition-colors"
                      placeholder="e.g. Beluga Caviar Tartlet"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-luxury-gold tracking-widest uppercase mb-2">Price</label>
                    <input 
                      type="text" 
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full bg-[#050505] border border-luxury-gold/20 focus:border-luxury-gold text-luxury-ivory p-3 text-sm outline-none transition-colors"
                      placeholder="e.g. $125"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-luxury-gold tracking-widest uppercase mb-2">Description</label>
                  <textarea 
                    required
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-[#050505] border border-luxury-gold/20 focus:border-luxury-gold text-luxury-ivory p-3 text-sm outline-none transition-colors resize-none"
                    placeholder="Describe the ingredients, preparation, and presentation..."
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] text-luxury-gold tracking-widest uppercase mb-2">Category</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full bg-[#050505] border border-luxury-gold/20 focus:border-luxury-gold text-luxury-ivory p-3 text-sm outline-none transition-colors"
                    >
                      <option value="food">Main Cuisine</option>
                      <option value="dessert">Dessert & Pastry</option>
                      <option value="beverage">Beverage & Wine</option>
                    </select>
                  </div>
                  <div className="flex items-center mt-6">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-5 h-5 border flex items-center justify-center transition-colors ${
                        formData.chefRecommendation 
                          ? 'bg-luxury-gold border-luxury-gold text-[#0F0F0F]' 
                          : 'border-luxury-gold/30 group-hover:border-luxury-gold/60'
                      }`}>
                        {formData.chefRecommendation && <CheckCircle size={14} />}
                      </div>
                      <span className="text-xs text-luxury-ivory tracking-wider">Featured Chef Recommendation</span>
                      <input 
                        type="checkbox" 
                        className="hidden"
                        checked={formData.chefRecommendation}
                        onChange={(e) => setFormData({...formData, chefRecommendation: e.target.checked})}
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
                    {editingDish ? 'Save Changes' : 'Publish Dish'}
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
