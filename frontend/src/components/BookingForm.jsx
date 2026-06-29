import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, Users, Gift, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';

export default function BookingForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState('2');
  const [occasion, setOccasion] = useState('Couple');
  const [specialRequests, setSpecialRequests] = useState('');

  // AI Recommendation State
  const [recommendation, setRecommendation] = useState(null);

  // Availability check states
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState(null); // null, true, false
  const [availableSlots, setAvailableSlots] = useState([]);
  
  // Submit states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const timeSlots = ['17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];

  // AI Table Recommendation logic
  const getAIRecommendation = (occ) => {
    switch (occ) {
      case 'Couple':
        return {
          table: 'Window Table #12',
          rating: '98%',
          feature: 'Romantic candlelight setup overlooking the garden terrace. Perfect for couples.'
        };
      case 'Business':
        return {
          table: 'Private Alcove Table #8',
          rating: '97%',
          feature: 'Secluded corner alcove offering maximum privacy and sound insulation.'
        };
      case 'Family':
        return {
          table: 'Round Booth Table #5',
          rating: '95%',
          feature: 'Spacious central booth allowing comfortable group conversations and dining space.'
        };
      case 'Birthday':
        return {
          table: 'VIP Banquet Table #1',
          rating: '99%',
          feature: 'Near the main stage, custom celebration settings, and adjacent to the sommelier bar.'
        };
      default:
        return null;
    }
  };

  // Run AI recommendation when occasion changes
  useEffect(() => {
    if (occasion) {
      setRecommendation(getAIRecommendation(occasion));
    }
  }, [occasion]);

  // Check Availability against Express API
  useEffect(() => {
    const checkAvailability = async () => {
      if (!date || !time) return;

      setIsChecking(true);
      setErrorMsg('');

      try {
        const res = await fetch(`/api/reservations/check-availability?date=${date}&time=${time}`);
        const data = await res.json();

        if (res.ok) {
          setIsAvailable(data.available);
          if (!data.available) {
            setErrorMsg('Selected time slot is fully booked. Please choose another slot.');
          }
        } else {
          setIsAvailable(true); // Default to true if server has issues
        }
      } catch (err) {
        console.error('Availability check error:', err);
        setIsAvailable(true);
      } finally {
        setIsChecking(false);
      }
    };

    checkAvailability();
  }, [date, time]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (isAvailable === false) {
      setErrorMsg('Cannot reserve a fully booked slot.');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      name,
      email,
      phone,
      date,
      time,
      guests: parseInt(guests, 10),
      occasion,
      specialRequests,
      assignedTable: recommendation ? recommendation.table : 'Standard Table'
    };

    try {
      const token = localStorage.getItem('aurum_token');
      const headers = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/reservations/create', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to complete reservation.');
      }

      setSuccessMsg(`Reservation completed! A confirmation email has been sent to ${email}.`);
      
      // Reset form fields
      setName('');
      setEmail('');
      setPhone('');
      setDate('');
      setTime('');
      setGuests('2');
      setOccasion('Couple');
      setSpecialRequests('');
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="book" className="bg-luxury-darkGray py-24 px-6 relative z-10 border-t border-luxury-gold/15">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-luxury-gold tracking-[0.3em] text-xs font-semibold uppercase block mb-3">
            Secure Your Residency
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-[0.05em] text-luxury-ivory uppercase">
            Table Reservation
          </h2>
          <div className="w-12 h-[1px] bg-luxury-gold mx-auto mt-4"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left: Interactive Booking Form */}
          <div className="lg:col-span-7 bg-luxury-black border border-luxury-gold/15 p-8 rounded-lg shadow-lg">
            
            {successMsg && (
              <div className="bg-emerald-950/40 border border-emerald-500/35 text-emerald-300 text-sm p-4 rounded mb-6 flex items-start space-x-3">
                <CheckCircle className="text-emerald-500 mt-0.5 flex-shrink-0" size={18} />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="bg-red-950/40 border border-red-500/35 text-red-300 text-sm p-4 rounded mb-6 flex items-start space-x-3">
                <AlertCircle className="text-red-500 mt-0.5 flex-shrink-0" size={18} />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Name & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] text-luxury-gold tracking-widest uppercase font-semibold block mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="E.G. ALEXANDER VANCE"
                    className="w-full bg-luxury-darkGray border border-luxury-gold/15 focus:border-luxury-gold p-3.5 text-xs tracking-wider uppercase text-luxury-ivory outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-luxury-gold tracking-widest uppercase font-semibold block mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="E.G. VANCE@AURUM.COM"
                    className="w-full bg-luxury-darkGray border border-luxury-gold/15 focus:border-luxury-gold p-3.5 text-xs tracking-wider text-luxury-ivory outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Phone & Guests */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] text-luxury-gold tracking-widest uppercase font-semibold block mb-2">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="E.G. +1 555-0199"
                    className="w-full bg-luxury-darkGray border border-luxury-gold/15 focus:border-luxury-gold p-3.5 text-xs tracking-wider text-luxury-ivory outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-luxury-gold tracking-widest uppercase font-semibold block mb-2">Number of Guests</label>
                  <div className="relative">
                    <Users className="absolute left-3.5 top-3.5 text-luxury-gold/60" size={16} />
                    <select
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="w-full bg-luxury-darkGray border border-luxury-gold/15 focus:border-luxury-gold p-3.5 pl-10 text-xs tracking-wider text-luxury-ivory outline-none appearance-none transition-colors"
                    >
                      <option value="1">1 GUEST</option>
                      <option value="2">2 GUESTS</option>
                      <option value="3">3 GUESTS</option>
                      <option value="4">4 GUESTS</option>
                      <option value="6">6 GUESTS</option>
                      <option value="8">8+ GUESTS</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Date & Time slots */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] text-luxury-gold tracking-widest uppercase font-semibold block mb-2">Date Picker</label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3.5 top-3.5 text-luxury-gold/60 pointer-events-none" size={16} />
                    <input
                      type="date"
                      required
                      value={date}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-luxury-darkGray border border-luxury-gold/15 focus:border-luxury-gold p-3.5 pl-10 text-xs tracking-wider text-luxury-ivory outline-none transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-luxury-gold tracking-widest uppercase font-semibold block mb-2">Preferred Timing</label>
                  <div className="relative">
                    <Clock className="absolute left-3.5 top-3.5 text-luxury-gold/60 pointer-events-none" size={16} />
                    <select
                      value={time}
                      required
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full bg-luxury-darkGray border border-luxury-gold/15 focus:border-luxury-gold p-3.5 pl-10 text-xs tracking-wider text-luxury-ivory outline-none appearance-none transition-colors"
                    >
                      <option value="">SELECT TIME</option>
                      {timeSlots.map((slot) => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Occasion & Special Requests */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] text-luxury-gold tracking-widest uppercase font-semibold block mb-2">Occasion Type</label>
                  <div className="relative">
                    <Gift className="absolute left-3.5 top-3.5 text-luxury-gold/60" size={16} />
                    <select
                      value={occasion}
                      onChange={(e) => setOccasion(e.target.value)}
                      className="w-full bg-luxury-darkGray border border-luxury-gold/15 focus:border-luxury-gold p-3.5 pl-10 text-xs tracking-wider text-luxury-ivory outline-none appearance-none transition-colors"
                    >
                      <option value="Couple">COUPLE DINING / DATE</option>
                      <option value="Business">BUSINESS MEETINGS</option>
                      <option value="Family">FAMILY GATHERINGS</option>
                      <option value="Birthday">BIRTHDAY / ANNIVERSARY</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-luxury-gold tracking-widest uppercase font-semibold block mb-2">Special Accommodations</label>
                  <input
                    type="text"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="E.G. ALLERGIES, PREFERRED CHAMBER"
                    className="w-full bg-luxury-darkGray border border-luxury-gold/15 focus:border-luxury-gold p-3.5 text-xs tracking-wider text-luxury-ivory outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting || isChecking}
                className="w-full py-4 bg-luxury-gold text-luxury-black font-semibold text-xs tracking-[0.2em] uppercase hover:bg-luxury-ivory transition-colors hover:shadow-gold-glow disabled:opacity-50"
              >
                {isSubmitting ? 'Processing Booking...' : 'Complete Luxury Reservation'}
              </button>
            </form>
          </div>

          {/* Right: AI-Powered Table Recommendation Panel */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-luxury-black border border-luxury-gold/15 p-8 rounded-lg shadow-lg relative overflow-hidden h-full flex flex-col justify-between">
              
              {/* Radial Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-luxury-gold/5 rounded-full blur-2xl pointer-events-none"></div>
              
              <div className="space-y-6 relative z-10">
                <div className="flex items-center space-x-2">
                  <Sparkles className="text-luxury-gold" size={20} />
                  <span className="text-xs text-luxury-gold tracking-[0.25em] uppercase font-bold">
                    AI Recommendation
                  </span>
                </div>

                <div className="w-full h-[1px] bg-luxury-gold/20"></div>

                {recommendation ? (
                  <motion.div
                    key={occasion}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                  >
                    <div>
                      <span className="text-[10px] text-luxury-ivory/40 tracking-[0.2em] uppercase block mb-1">
                        Occasion Selected
                      </span>
                      <span className="text-sm font-semibold tracking-wider text-luxury-ivory uppercase">
                        {occasion} Dining
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-luxury-gold tracking-[0.2em] uppercase block mb-2">
                        Suggested Seating Arrangement
                      </span>
                      <h4 className="font-display text-2xl font-bold text-luxury-ivory">
                        {recommendation.table}
                      </h4>
                    </div>

                    <div className="grid grid-cols-2 gap-4 bg-luxury-darkGray/55 border border-luxury-gold/10 p-4">
                      <div>
                        <span className="text-[9px] text-luxury-ivory/40 tracking-widest uppercase block">Match Rating</span>
                        <span className="text-base font-bold text-luxury-gold tracking-wide">{recommendation.rating}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-luxury-ivory/40 tracking-widest uppercase block">Table Status</span>
                        <span className="text-xs font-semibold text-emerald-500 tracking-wider uppercase mt-1 block">CONFIRMED HITS</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[9px] text-luxury-ivory/40 tracking-widest uppercase block mb-1">Premium Perks</span>
                      <p className="text-xs text-luxury-ivory/70 font-light leading-relaxed">
                        {recommendation.feature}
                      </p>
                    </div>

                  </motion.div>
                ) : (
                  <p className="text-xs text-luxury-ivory/50 font-light">
                    Select an occasion to receive a bespoke seating layout recommendation.
                  </p>
                )}
              </div>

              {/* Status footer inside recommendation panel */}
              <div className="pt-6 border-t border-luxury-gold/10 mt-12 relative z-10">
                <span className="text-[9px] text-luxury-ivory/40 tracking-[0.2em] uppercase block">
                  Capacity Monitor
                </span>
                <div className="flex items-center space-x-2 mt-2">
                  <div className={`w-2 h-2 rounded-full ${isAvailable === false ? 'bg-red-500' : 'bg-emerald-500'} animate-pulse`}></div>
                  <span className="text-[10px] text-luxury-ivory/70 tracking-widest uppercase">
                    {isChecking 
                      ? 'VERIFYING ROOM CAPACITY...' 
                      : isAvailable === false 
                        ? 'FULLY BOOKED' 
                        : 'SEATS AVAILABLE FOR SELECTED TIMINGS'}
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
