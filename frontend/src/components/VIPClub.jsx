import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Sparkles, Calendar, Gift, Lock, User, Mail, Phone, EyeOff, Eye, CreditCard } from 'lucide-react';

export default function VIPClub() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('register'); // 'register' or 'login'
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Payment mock state
  const [showPayment, setShowPayment] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  const perks = [
    {
      icon: <Calendar className="text-luxury-gold" size={24} />,
      title: 'Priority Reservations',
      desc: 'Exclusive access to prime-time tables, even on short notice.'
    },
    {
      icon: <Sparkles className="text-luxury-gold" size={24} />,
      title: "Chef's Table Experience",
      desc: 'Intimate tasting sessions hosted directly in Chef Alexander\'s development kitchen.'
    },
    {
      icon: <Shield className="text-luxury-gold" size={24} />,
      title: 'Private Lounge Access',
      desc: 'Booking privileges for private dining chambers and our cigar parlor.'
    },
    {
      icon: <Gift className="text-luxury-gold" size={24} />,
      title: 'Birthday & Anniversary Specials',
      desc: 'Complimentary vintage Champagne and bespoke desserts prepared by our patissier.'
    }
  ];

  useEffect(() => {
    const token = localStorage.getItem('aurum_token');
    const storedUser = localStorage.getItem('aurum_user');
    if (token && storedUser) {
      setIsLoggedIn(true);
      setUserProfile(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('aurum_token');
    localStorage.removeItem('aurum_user');
    setIsLoggedIn(false);
    setUserProfile(null);
    setSuccessMsg('Logged out successfully.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (modalMode === 'register' && !showPayment) {
      // Trigger payment step first for VIP verification
      setShowPayment(true);
      return;
    }

    const endpoint = modalMode === 'register' ? '/api/auth/register' : '/api/auth/login';
    const payload = modalMode === 'register' 
      ? { name, email, phone, password } 
      : { email, password };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed.');
      }

      // Success
      localStorage.setItem('aurum_token', data.token);
      localStorage.setItem('aurum_user', JSON.stringify(data.user));
      setUserProfile(data.user);
      setIsLoggedIn(true);
      setIsModalOpen(false);
      
      // Reset form states
      setName('');
      setEmail('');
      setPhone('');
      setPassword('');
      setShowPayment(false);
      setSuccessMsg(modalMode === 'register' ? 'VIP Membership activated!' : 'Welcome back to Aurum.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  return (
    <section id="vip" className="bg-luxury-black py-24 px-6 relative z-10 border-t border-luxury-gold/15">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left: Perks Grid */}
          <div className="lg:col-span-7 space-y-12">
            <div>
              <span className="text-luxury-gold tracking-[0.3em] text-xs font-semibold uppercase block mb-3">
                Aurum Elite
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-bold tracking-[0.05em] text-luxury-ivory uppercase">
                The VIP Club
              </h2>
              <div className="w-12 h-[1px] bg-luxury-gold mt-4"></div>
            </div>

            <p className="text-luxury-ivory/70 leading-relaxed font-light text-sm max-w-xl">
              Membership in Aurum's VIP Club is limited. As an elite member, you unlock privileged dining statuses and access culinary curation unavailable to the public. Enjoy a truly tailored fine-dining residency.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {perks.map((perk, idx) => (
                <div key={idx} className="flex space-x-4">
                  <div className="flex-shrink-0 mt-1">{perk.icon}</div>
                  <div>
                    <h3 className="text-sm font-semibold tracking-wider text-luxury-ivory uppercase mb-2">
                      {perk.title}
                    </h3>
                    <p className="text-xs text-luxury-ivory/60 leading-relaxed font-light">
                      {perk.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: VIP Card Showcase */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md bg-luxury-darkGray border border-luxury-gold/20 p-8 rounded-lg shadow-gold-glow flex flex-col justify-between relative overflow-hidden group">
              
              {/* Decorative radial gradients */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-luxury-gold/5 rounded-full blur-3xl pointer-events-none group-hover:bg-luxury-gold/10 transition-colors duration-500"></div>

              {isLoggedIn && userProfile ? (
                // Logged In Card UI
                <div className="space-y-8 relative z-10">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs text-luxury-gold tracking-[0.2em] uppercase font-bold">
                        AURUM ELITE
                      </span>
                      <span className="block text-[9px] text-luxury-ivory/40 tracking-[0.1em] uppercase">
                        VIP Membership Card
                      </span>
                    </div>
                    <Sparkles className="text-luxury-gold" size={24} />
                  </div>

                  <div className="my-10 flex flex-col justify-center">
                    <span className="text-xs text-luxury-ivory/40 tracking-widest uppercase">Member Name</span>
                    <span className="font-display text-xl font-bold tracking-wider text-luxury-ivory">
                      {userProfile.name}
                    </span>
                    <span className="text-[10px] text-luxury-gold tracking-widest uppercase mt-4">VIP Serial ID</span>
                    <span className="font-mono text-sm text-luxury-ivory/80 tracking-widest">
                      AURUM-{userProfile._id ? userProfile._id.slice(-8).toUpperCase() : 'MEMBER'}
                    </span>
                  </div>

                  <div className="flex justify-between items-end pt-4 border-t border-luxury-gold/15">
                    <div>
                      <span className="text-[9px] text-luxury-ivory/40 tracking-wider uppercase block">Status</span>
                      <span className="text-xs text-luxury-gold tracking-widest font-semibold uppercase">ACTIVE VIP</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 border border-luxury-gold/30 text-luxury-ivory/70 hover:border-luxury-gold hover:text-luxury-gold text-[10px] tracking-widest uppercase font-semibold transition-all duration-300"
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              ) : (
                // Guest / Logged Out UI
                <div className="space-y-8 relative z-10 text-center py-6">
                  <div className="flex justify-center mb-4">
                    <Lock className="text-luxury-gold animate-pulse" size={40} />
                  </div>
                  
                  <div>
                    <h3 className="font-display text-xl font-bold text-luxury-ivory uppercase tracking-wider">
                      Unlock Elite Benefits
                    </h3>
                    <p className="text-xs text-luxury-ivory/60 font-light mt-2 max-w-xs mx-auto leading-relaxed">
                      Register your VIP membership to start receiving priority reservations and chef invitations.
                    </p>
                  </div>

                  {successMsg && (
                    <p className="text-xs text-emerald-500 font-semibold tracking-wider">{successMsg}</p>
                  )}

                  <div className="space-y-4 pt-4">
                    <button
                      onClick={() => {
                        setModalMode('register');
                        setErrorMsg('');
                        setIsModalOpen(true);
                      }}
                      className="w-full py-4 bg-luxury-gold text-luxury-black font-semibold text-xs tracking-[0.2em] uppercase hover:bg-luxury-ivory hover:shadow-gold-glow transition-all duration-500 border border-luxury-gold"
                    >
                      Join The VIP Club
                    </button>
                    <button
                      onClick={() => {
                        setModalMode('login');
                        setErrorMsg('');
                        setIsModalOpen(true);
                      }}
                      className="w-full py-4 border border-luxury-ivory/30 text-luxury-ivory font-semibold text-xs tracking-[0.2em] uppercase hover:border-luxury-gold hover:text-luxury-gold transition-all duration-500"
                    >
                      Log In To Account
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-luxury-black/90 backdrop-blur-sm"
            ></motion.div>

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.4 }}
              className="relative w-full max-w-md bg-luxury-darkGray border border-luxury-gold/30 p-8 rounded-lg shadow-gold-glow-lg z-10"
            >
              <h3 className="font-display text-2xl font-bold text-luxury-ivory uppercase tracking-wider text-center mb-6">
                {showPayment 
                  ? 'VIP Verification' 
                  : modalMode === 'register' ? 'Join the Residency' : 'Welcome Back'}
              </h3>
              
              {errorMsg && (
                <div className="bg-red-950/40 border border-red-500/35 text-red-300 text-xs p-3 rounded mb-4 text-center">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {!showPayment ? (
                  <>
                    {/* Register Fields */}
                    {modalMode === 'register' && (
                      <div className="relative">
                        <User className="absolute left-3 top-3.5 text-luxury-gold/50" size={16} />
                        <input
                          type="text"
                          placeholder="FULL NAME"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-luxury-black border border-luxury-gold/15 focus:border-luxury-gold p-3 pl-10 text-xs tracking-wider uppercase text-luxury-ivory outline-none transition-colors"
                        />
                      </div>
                    )}

                    {/* Email */}
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 text-luxury-gold/50" size={16} />
                      <input
                        type="email"
                        placeholder="EMAIL ADDRESS"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-luxury-black border border-luxury-gold/15 focus:border-luxury-gold p-3 pl-10 text-xs tracking-wider text-luxury-ivory outline-none transition-colors"
                      />
                    </div>

                    {/* Phone for Registration */}
                    {modalMode === 'register' && (
                      <div className="relative">
                        <Phone className="absolute left-3 top-3.5 text-luxury-gold/50" size={16} />
                        <input
                          type="tel"
                          placeholder="PHONE NUMBER"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-luxury-black border border-luxury-gold/15 focus:border-luxury-gold p-3 pl-10 text-xs tracking-wider text-luxury-ivory outline-none transition-colors"
                        />
                      </div>
                    )}

                    {/* Password */}
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 text-luxury-gold/50" size={16} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="SECURITY PASSWORD"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-luxury-black border border-luxury-gold/15 focus:border-luxury-gold p-3 pl-10 pr-10 text-xs tracking-wider text-luxury-ivory outline-none transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3.5 text-luxury-gold/50 hover:text-luxury-gold transition-colors"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </>
                ) : (
                  /* Stripe/Razorpay Mock Payment Checkout Overlay */
                  <div className="space-y-4">
                    <p className="text-[11px] text-luxury-ivory/60 font-light text-center leading-relaxed mb-2">
                      An initiation fee of <span className="text-luxury-gold font-bold">$150</span> is charged to verify VIP member credentials and reserve status.
                    </p>
                    
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-3.5 text-luxury-gold/50" size={16} />
                      <input
                        type="text"
                        placeholder="CARD NUMBER (MOCK)"
                        required
                        maxLength="19"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-luxury-black border border-luxury-gold/15 focus:border-luxury-gold p-3 pl-10 text-xs tracking-wider text-luxury-ivory outline-none transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="EXP (MM/YY)"
                        required
                        maxLength="5"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-luxury-black border border-luxury-gold/15 focus:border-luxury-gold p-3 text-xs tracking-wider text-luxury-ivory outline-none text-center transition-colors"
                      />
                      <input
                        type="password"
                        placeholder="CVC"
                        required
                        maxLength="4"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full bg-luxury-black border border-luxury-gold/15 focus:border-luxury-gold p-3 text-xs tracking-wider text-luxury-ivory outline-none text-center transition-colors"
                      />
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowPayment(false)}
                        className="w-1/2 py-3 border border-luxury-ivory/30 text-luxury-ivory hover:border-luxury-gold hover:text-luxury-gold font-semibold text-xs tracking-wider uppercase transition-colors"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="w-1/2 py-3 bg-luxury-gold text-luxury-black hover:bg-luxury-ivory font-semibold text-xs tracking-wider uppercase transition-colors hover:shadow-gold-glow"
                      >
                        Submit Pay
                      </button>
                    </div>
                  </div>
                )}

                {/* Submissions */}
                {!showPayment && (
                  <button
                    type="submit"
                    className="w-full py-4 bg-luxury-gold text-luxury-black font-semibold text-xs tracking-[0.2em] uppercase hover:bg-luxury-ivory transition-colors hover:shadow-gold-glow"
                  >
                    {modalMode === 'register' ? 'Authorize Payment' : 'Log In'}
                  </button>
                )}
              </form>

              {!showPayment && (
                <div className="mt-6 text-center">
                  <button
                    onClick={() => {
                      setModalMode(modalMode === 'register' ? 'login' : 'register');
                      setErrorMsg('');
                    }}
                    className="text-[10px] text-luxury-gold hover:text-luxury-ivory tracking-widest uppercase transition-colors font-medium"
                  >
                    {modalMode === 'register' 
                      ? 'Already a VIP Member? Log In' 
                      : 'Create a VIP Account'}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
