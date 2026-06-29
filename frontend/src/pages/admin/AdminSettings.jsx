import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Loader2, Globe, Phone, MapPin, Mail, Instagram, Facebook, Twitter } from 'lucide-react';
import ImageUpload from '../../components/admin/ImageUpload';

export default function AdminSettings() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');

  // Hero Section State
  const [heroContent, setHeroContent] = useState({
    heading: 'A Symphony of Taste',
    subheading: 'Experience dining where culinary artistry meets unmatched luxury. Welcome to Aurum.',
    buttonText: 'Reserve Your Table',
    bgImage: ''
  });

  // Contact Info State
  const [contactInfo, setContactInfo] = useState({
    address: '123 Luxury Avenue, Beverly Hills, CA 90210',
    phone: '+1 (310) 555-0199',
    email: 'reservations@aurum.com',
    hours: 'Mon - Sun: 5:00 PM - 11:00 PM',
    instagram: 'https://instagram.com/aurum',
    facebook: 'https://facebook.com/aurum',
    twitter: 'https://twitter.com/aurum'
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Fetch Hero
        const resHero = await fetch('/api/content/hero');
        if (resHero.ok) {
          const heroData = await resHero.json();
          if (heroData.data) setHeroContent(heroData.data);
        }

        // Fetch Contact
        const resContact = await fetch('/api/content/contact');
        if (resContact.ok) {
          const contactData = await resContact.json();
          if (contactData.data) setContactInfo(contactData.data);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setFetching(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async (key, dataToSave) => {
    setLoading(true);
    setSuccessMsg('');
    const token = localStorage.getItem('aurum_admin_token');

    try {
      const res = await fetch(`/api/content/${key}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ data: dataToSave })
      });

      if (res.ok) {
        setSuccessMsg(`${key.charAt(0).toUpperCase() + key.slice(1)} settings saved successfully!`);
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="py-20 text-center text-luxury-gold/50 text-xs tracking-widest uppercase animate-pulse">Loading Global Configuration...</div>;
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="border-b border-luxury-gold/15 pb-6">
        <h1 className="text-3xl font-display font-bold uppercase tracking-wider text-luxury-gold">Global Settings</h1>
        <p className="text-xs text-luxury-ivory/50 tracking-widest uppercase mt-2">
          Manage Website Content & Configuration
        </p>
      </div>

      {successMsg && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-500/10 border border-green-500/30 text-green-400 p-4 rounded-sm text-xs tracking-widest uppercase text-center font-semibold"
        >
          {successMsg}
        </motion.div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* HERO SECTION CONFIG */}
        <div className="bg-[#050505] border border-luxury-gold/15 rounded-sm p-8">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-luxury-gold/10">
            <Globe className="text-luxury-gold" size={24} />
            <h2 className="text-xl font-display text-luxury-gold tracking-wider uppercase">Landing Page Hero</h2>
          </div>

          <div className="space-y-6">
            <ImageUpload 
              label="Hero Background Image" 
              value={heroContent.bgImage}
              onChange={(url) => setHeroContent({...heroContent, bgImage: url})}
            />

            <div>
              <label className="block text-[10px] text-luxury-gold tracking-widest uppercase mb-2">Main Heading</label>
              <input 
                type="text" 
                value={heroContent.heading}
                onChange={(e) => setHeroContent({...heroContent, heading: e.target.value})}
                className="w-full bg-[#111] border border-luxury-gold/20 focus:border-luxury-gold text-luxury-ivory p-3 text-sm outline-none transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-[10px] text-luxury-gold tracking-widest uppercase mb-2">Subheading / Description</label>
              <textarea 
                rows="3"
                value={heroContent.subheading}
                onChange={(e) => setHeroContent({...heroContent, subheading: e.target.value})}
                className="w-full bg-[#111] border border-luxury-gold/20 focus:border-luxury-gold text-luxury-ivory p-3 text-sm outline-none transition-colors resize-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-[10px] text-luxury-gold tracking-widest uppercase mb-2">Call to Action Button</label>
              <input 
                type="text" 
                value={heroContent.buttonText}
                onChange={(e) => setHeroContent({...heroContent, buttonText: e.target.value})}
                className="w-full bg-[#111] border border-luxury-gold/20 focus:border-luxury-gold text-luxury-ivory p-3 text-sm outline-none transition-colors"
              />
            </div>

            <button 
              onClick={() => handleSave('hero', heroContent)}
              disabled={loading}
              className="w-full bg-luxury-gold text-[#0F0F0F] py-4 rounded-sm font-semibold text-[10px] tracking-widest uppercase hover:bg-white transition-colors flex justify-center items-center gap-2 mt-4"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} 
              Save Hero Settings
            </button>
          </div>
        </div>

        {/* CONTACT & SOCIALS CONFIG */}
        <div className="bg-[#050505] border border-luxury-gold/15 rounded-sm p-8">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-luxury-gold/10">
            <Phone className="text-luxury-gold" size={24} />
            <h2 className="text-xl font-display text-luxury-gold tracking-wider uppercase">Contact & Socials</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-[10px] text-luxury-gold tracking-widest uppercase mb-2"><MapPin size={12}/> Physical Address</label>
              <input 
                type="text" 
                value={contactInfo.address}
                onChange={(e) => setContactInfo({...contactInfo, address: e.target.value})}
                className="w-full bg-[#111] border border-luxury-gold/20 focus:border-luxury-gold text-luxury-ivory p-3 text-sm outline-none transition-colors"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-[10px] text-luxury-gold tracking-widest uppercase mb-2"><Phone size={12}/> Telephone</label>
                <input 
                  type="text" 
                  value={contactInfo.phone}
                  onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                  className="w-full bg-[#111] border border-luxury-gold/20 focus:border-luxury-gold text-luxury-ivory p-3 text-sm outline-none transition-colors"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-[10px] text-luxury-gold tracking-widest uppercase mb-2"><Mail size={12}/> Email Address</label>
                <input 
                  type="text" 
                  value={contactInfo.email}
                  onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                  className="w-full bg-[#111] border border-luxury-gold/20 focus:border-luxury-gold text-luxury-ivory p-3 text-sm outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-luxury-gold tracking-widest uppercase mb-2">Operating Hours</label>
              <input 
                type="text" 
                value={contactInfo.hours}
                onChange={(e) => setContactInfo({...contactInfo, hours: e.target.value})}
                className="w-full bg-[#111] border border-luxury-gold/20 focus:border-luxury-gold text-luxury-ivory p-3 text-sm outline-none transition-colors"
              />
            </div>

            <div className="pt-6 border-t border-luxury-gold/10">
              <h3 className="text-xs text-luxury-ivory tracking-widest uppercase mb-4 font-semibold">Social Media Links</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Instagram className="text-luxury-gold/70" size={20} />
                  <input 
                    type="text" 
                    value={contactInfo.instagram}
                    onChange={(e) => setContactInfo({...contactInfo, instagram: e.target.value})}
                    className="flex-1 bg-[#111] border border-luxury-gold/20 focus:border-luxury-gold text-luxury-ivory p-2 text-sm outline-none transition-colors"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <Facebook className="text-luxury-gold/70" size={20} />
                  <input 
                    type="text" 
                    value={contactInfo.facebook}
                    onChange={(e) => setContactInfo({...contactInfo, facebook: e.target.value})}
                    className="flex-1 bg-[#111] border border-luxury-gold/20 focus:border-luxury-gold text-luxury-ivory p-2 text-sm outline-none transition-colors"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <Twitter className="text-luxury-gold/70" size={20} />
                  <input 
                    type="text" 
                    value={contactInfo.twitter}
                    onChange={(e) => setContactInfo({...contactInfo, twitter: e.target.value})}
                    className="flex-1 bg-[#111] border border-luxury-gold/20 focus:border-luxury-gold text-luxury-ivory p-2 text-sm outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            <button 
              onClick={() => handleSave('contact', contactInfo)}
              disabled={loading}
              className="w-full bg-luxury-gold text-[#0F0F0F] py-4 rounded-sm font-semibold text-[10px] tracking-widest uppercase hover:bg-white transition-colors flex justify-center items-center gap-2 mt-4"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} 
              Save Contact Settings
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
