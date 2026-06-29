import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Compass, Lock } from 'lucide-react';

export default function Footer() {
  const [contactData, setContactData] = useState({
    address: '12 Gold Sovereign Way, Mayfair, London, W1S 1SR',
    phone: '+44 20 7946 0199',
    email: 'concierge@aurum.com',
    hours: 'Monday - Sunday: 17:00 - 23:00',
    instagram: '#',
    facebook: '#',
    twitter: '#'
  });

  useEffect(() => {
    fetch('/api/content/contact')
      .then(res => res.json())
      .then(data => {
        if (data && data.data) {
          setContactData(data.data);
        }
      })
      .catch(err => console.error('Error fetching contact content:', err));
  }, []);

  return (
    <footer className="bg-luxury-black border-t border-luxury-gold/15 pt-20 pb-8 px-6 relative z-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        
        {/* Brand Info */}
        <div className="space-y-6">
          <span className="font-display text-3xl tracking-[0.2em] text-luxury-gold font-bold uppercase block">
            AURUM
          </span>
          <p className="text-xs text-luxury-ivory/60 leading-relaxed font-light">
            Experiencing the peak of fine dining through curated, luxurious culinary residencies and chef masterclasses.
          </p>
          <div className="flex space-x-4">
            <a href={contactData.facebook} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border border-luxury-gold/20 flex items-center justify-center text-luxury-ivory/60 hover:border-luxury-gold hover:text-luxury-gold transition-colors duration-300">
              <span className="text-xs font-semibold uppercase">Fb</span>
            </a>
            <a href={contactData.instagram} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border border-luxury-gold/20 flex items-center justify-center text-luxury-ivory/60 hover:border-luxury-gold hover:text-luxury-gold transition-colors duration-300">
              <span className="text-xs font-semibold uppercase">Ig</span>
            </a>
            <a href={contactData.twitter} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border border-luxury-gold/20 flex items-center justify-center text-luxury-ivory/60 hover:border-luxury-gold hover:text-luxury-gold transition-colors duration-300">
              <span className="text-xs font-semibold uppercase">Tw</span>
            </a>
          </div>
        </div>

        {/* Address & Contacts */}
        <div className="space-y-6">
          <h4 className="text-xs text-luxury-gold tracking-[0.2em] uppercase font-bold">
            Residency Location
          </h4>
          <ul className="space-y-4 text-xs font-light text-luxury-ivory/70">
            <li className="flex items-start space-x-3">
              <MapPin size={16} className="text-luxury-gold mt-0.5 flex-shrink-0" />
              <span>{contactData.address}</span>
            </li>
            <li className="flex items-center space-x-3">
              <Phone size={16} className="text-luxury-gold flex-shrink-0" />
              <span>{contactData.phone}</span>
            </li>
            <li className="flex items-center space-x-3">
              <Mail size={16} className="text-luxury-gold flex-shrink-0" />
              <span>{contactData.email}</span>
            </li>
          </ul>
        </div>

        {/* Hours of Service */}
        <div className="space-y-6">
          <h4 className="text-xs text-luxury-gold tracking-[0.2em] uppercase font-bold">
            Opening Hours
          </h4>
          <ul className="space-y-3 text-xs font-light text-luxury-ivory/70">
            <li className="flex justify-between border-b border-luxury-gold/10 pb-2">
              <span className="whitespace-pre-wrap">{contactData.hours}</span>
            </li>
          </ul>
        </div>

        {/* Interactive Google Map */}
        <div className="space-y-4">
          <div>
            <h4 className="text-xs text-luxury-gold tracking-[0.2em] uppercase font-bold">
              Interactive Directions
            </h4>
            <span className="text-[10px] text-luxury-ivory/60 font-light tracking-widest block mt-1 uppercase">
              Aurum Mayfair Residence
            </span>
          </div>
          
          <div className="relative w-full h-40 rounded-[16px] overflow-hidden border border-luxury-gold/30 group hover:shadow-[0_0_20px_rgba(212,175,55,0.25)] hover:border-luxury-gold/60 transition-all duration-500">
            {/* Adding a subtle dark overlay to blend the map with the dark theme when not hovered */}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all duration-500 pointer-events-none z-10"></div>
            
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2483.027663242698!2d-0.14652258422998393!3d51.510344579635745!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4876052d7e174251%3A0x6b13974bb7c4e5f7!2sMayfair%2C%20London%2C%20UK!5e0!3m2!1sen!2sus!4v1689531144421!5m2!1sen!2sus" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 w-full h-full grayscale-[30%] contrast-125 group-hover:grayscale-0 transition-all duration-500"
            ></iframe>
          </div>
          
          <a 
            href="https://www.google.com/maps/dir/?api=1&destination=Mayfair,+London,+UK"
            target="_blank" 
            rel="noreferrer"
            className="inline-flex items-center justify-center w-full py-3 bg-[#050505] border border-luxury-gold/30 text-[10px] text-luxury-gold tracking-widest uppercase font-semibold hover:bg-luxury-gold hover:text-black transition-all duration-300 rounded-[16px]"
          >
            Get Directions
          </a>
        </div>

      </div>

      <div className="w-full h-[1px] bg-luxury-gold/15 mb-8"></div>

      {/* Quote, Copyright & Management Portal */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-center gap-8 md:gap-4">
        
        {/* Left: Quote */}
        <div className="flex-1 md:text-left">
          <p className="font-display text-sm italic text-luxury-ivory/75 max-w-md mx-auto md:mx-0">
            "Dining is not just eating. It is an experience."
          </p>
        </div>
        
        {/* Center: Copyright */}
        <div className="flex-1 text-center">
          <span className="text-[10px] text-luxury-ivory/40 tracking-[0.25em] uppercase font-light">
            © {new Date().getFullYear()} AURUM FINE DINING. ALL RIGHTS RESERVED.
          </span>
        </div>

        {/* Right: Management Portal Link */}
        <div className="flex-1 md:text-right flex justify-center md:justify-end w-full md:w-auto">
          <a 
            href="/admin/login" 
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-luxury-gold/30 rounded-md text-[10px] tracking-widest text-luxury-gold uppercase font-semibold bg-transparent hover:border-luxury-gold hover:text-luxury-gold hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:-translate-y-1 transition-all duration-300"
          >
            <Lock size={12} className="text-luxury-gold" /> Management Portal &rarr;
          </a>
        </div>

      </div>
    </footer>
  );
}
