import React, { useEffect, useState } from 'react';
import { Outlet, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  ChefHat, 
  Image as ImageIcon, 
  CalendarDays, 
  Star, 
  Settings, 
  LogOut,
  MessageSquare
} from 'lucide-react';

export default function AdminLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('aurum_admin_token');
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('aurum_admin_token');
          localStorage.removeItem('aurum_admin_user');
          setIsAuthenticated(false);
        }
      } catch (err) {
        setIsAuthenticated(false);
      }
    };

    verifyToken();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('aurum_admin_token');
    localStorage.removeItem('aurum_admin_user');
    navigate('/admin/login');
  };

  if (isAuthenticated === null) {
    return <div className="min-h-screen bg-luxury-black flex items-center justify-center text-luxury-gold text-xs tracking-widest uppercase">Initializing...</div>;
  }

  if (isAuthenticated === false) {
    return <Navigate to="/admin/login" replace />;
  }

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Dishes', path: '/admin/dishes', icon: <UtensilsCrossed size={18} /> },
    { name: 'Chefs', path: '/admin/chefs', icon: <ChefHat size={18} /> },
    { name: 'Gallery', path: '/admin/gallery', icon: <ImageIcon size={18} /> },
    { name: 'Reservations', path: '/admin/reservations', icon: <CalendarDays size={18} /> },
    { name: 'Events', path: '/admin/events', icon: <Star size={18} /> },
    { name: 'Testimonials', path: '/admin/testimonials', icon: <MessageSquare size={18} /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-luxury-black flex font-body text-luxury-ivory selection:bg-luxury-gold selection:text-luxury-black">
      
      {/* Sidebar */}
      <aside className="w-64 bg-[#050505] border-r border-luxury-gold/15 flex flex-col fixed h-full z-20">
        <div className="p-8 border-b border-luxury-gold/15">
          <h2 className="text-luxury-gold tracking-[0.3em] text-2xl font-display font-bold uppercase">AURUM</h2>
          <p className="text-[9px] text-luxury-ivory/40 tracking-widest uppercase mt-2">Management Console</p>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-4 px-8 py-4 text-xs tracking-widest uppercase transition-all duration-300 ${
                  isActive 
                    ? 'text-luxury-gold bg-luxury-gold/5 border-r-2 border-luxury-gold' 
                    : 'text-luxury-ivory/60 hover:text-luxury-ivory hover:bg-white/5'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-6 border-t border-luxury-gold/15">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-luxury-gold/10 border border-luxury-gold/30 flex items-center justify-center text-luxury-gold font-display font-bold">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <p className="text-xs font-semibold tracking-wider uppercase text-luxury-ivory">{user?.name}</p>
              <p className="text-[9px] text-luxury-gold tracking-widest uppercase mt-1">{user?.role}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors text-[10px] tracking-widest uppercase"
          >
            <LogOut size={14} />
            <span>Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-10 h-screen overflow-y-auto bg-gradient-to-br from-luxury-black to-[#0a0a0a]">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-7xl mx-auto"
        >
          <Outlet context={{ user }} />
        </motion.div>
      </main>
    </div>
  );
}
