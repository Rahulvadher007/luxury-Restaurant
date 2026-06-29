import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, AlertCircle, Loader } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (res.ok) {
        // Save token and navigate
        localStorage.setItem('aurum_admin_token', data.token);
        localStorage.setItem('aurum_admin_user', JSON.stringify(data.user));
        navigate('/admin/dashboard');
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Failed to connect to server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-luxury-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-96 bg-luxury-gold/5 blur-[120px] pointer-events-none"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <h1 className="text-luxury-gold tracking-[0.3em] text-3xl font-display font-bold uppercase mb-2">AURUM</h1>
          <p className="text-luxury-ivory/50 text-xs tracking-[0.2em] uppercase">Executive Access Portal</p>
          <div className="w-12 h-[1px] bg-luxury-gold/30 mx-auto mt-6"></div>
        </div>

        <div className="bg-[#050505]/80 backdrop-blur-md border border-luxury-gold/20 p-8 shadow-2xl rounded-sm">
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-red-950/40 border border-red-500/30 text-red-400 p-4 mb-6 text-xs tracking-wider flex items-center gap-3"
            >
              <AlertCircle size={16} />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="text-[10px] text-luxury-gold tracking-widest uppercase font-semibold block mb-2">Executive Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 text-luxury-gold/60" size={16} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-luxury-darkGray/50 border border-luxury-gold/15 focus:border-luxury-gold p-3.5 pl-10 text-xs tracking-wider text-luxury-ivory outline-none transition-colors"
                  placeholder="admin@aurum.com"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-luxury-gold tracking-widest uppercase font-semibold block mb-2">Security Key</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 text-luxury-gold/60" size={16} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-luxury-darkGray/50 border border-luxury-gold/15 focus:border-luxury-gold p-3.5 pl-10 text-xs tracking-wider text-luxury-ivory outline-none transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-4 bg-luxury-gold text-luxury-black font-semibold text-xs tracking-[0.2em] uppercase hover:bg-luxury-ivory transition-colors mt-4 flex justify-center items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin" size={16} />
                  <span>Authenticating...</span>
                </>
              ) : (
                'Initialize Session'
              )}
            </button>
          </form>
        </div>
        
        <div className="text-center mt-8">
          <p className="text-[#333] text-[10px] tracking-widest uppercase">
            Authorized Personnel Only. Strictly Confidential.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
