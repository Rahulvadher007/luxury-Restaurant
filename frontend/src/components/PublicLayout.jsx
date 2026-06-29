import React from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import Stats from './Stats';
import Dishes from './Dishes';
import ChefSection from './ChefSection';
import Gallery from './Gallery';
import Reviews from './Reviews';
import VIPClub from './VIPClub';
import BookingForm from './BookingForm';
import Footer from './Footer';

export default function PublicLayout() {
  return (
    <div className="bg-luxury-black text-luxury-ivory font-body selection:bg-luxury-gold selection:text-luxury-black min-h-screen relative">
      <Navbar />
      <Hero />
      <Stats />
      <Dishes />
      <ChefSection />
      <Gallery />
      <Reviews />
      <VIPClub />
      <BookingForm />
      <Footer />
    </div>
  );
}
