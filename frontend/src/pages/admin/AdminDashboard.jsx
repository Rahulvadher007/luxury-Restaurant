import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, 
  CalendarCheck, 
  ChefHat, 
  Utensils, 
  TrendingUp, 
  Image as ImageIcon 
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { format } from 'date-fns';

export default function AdminDashboard() {
  const { user } = useOutletContext();
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock chart data for Phase 2
  const chartData = [
    { name: 'Mon', reservations: 12 },
    { name: 'Tue', reservations: 19 },
    { name: 'Wed', reservations: 15 },
    { name: 'Thu', reservations: 25 },
    { name: 'Fri', reservations: 42 },
    { name: 'Sat', reservations: 55 },
    { name: 'Sun', reservations: 48 },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('aurum_admin_token');
        const res = await fetch('/api/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (res.ok) {
          setStats(data.stats);
          setRecentActivity(data.recentActivity);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard stats');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const StatCard = ({ title, value, icon: Icon, delay }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-[#050505] border border-luxury-gold/15 p-6 rounded-sm relative overflow-hidden group hover:border-luxury-gold/40 transition-colors"
    >
      <div className="absolute -right-6 -top-6 text-luxury-gold/5 group-hover:text-luxury-gold/10 transition-colors">
        <Icon size={120} />
      </div>
      <div className="relative z-10 flex justify-between items-start">
        <div>
          <p className="text-[10px] text-luxury-ivory/50 tracking-widest uppercase mb-2">{title}</p>
          <h3 className="text-3xl font-display font-bold text-luxury-gold">{value}</h3>
        </div>
        <div className="w-10 h-10 rounded-full bg-luxury-gold/10 flex items-center justify-center text-luxury-gold">
          <Icon size={18} />
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return <div className="text-luxury-gold text-xs tracking-widest uppercase animate-pulse">Loading Dashboard Metrics...</div>;
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-luxury-gold/15 pb-6">
        <div>
          <h1 className="text-3xl font-display font-bold uppercase tracking-wider text-luxury-gold">Executive Overview</h1>
          <p className="text-xs text-luxury-ivory/50 tracking-widest uppercase mt-2">
            Real-time insights for Aurum Management
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] tracking-widest text-luxury-gold uppercase">{format(new Date(), 'EEEE, MMMM do, yyyy')}</p>
          <p className="text-xs tracking-wider text-luxury-ivory mt-1">Status: <span className="text-green-500">Online</span></p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Bookings" value={stats?.totalReservations || 0} icon={CalendarCheck} delay={0.1} />
        <StatCard title="Today's Bookings" value={stats?.todayReservations || 0} icon={TrendingUp} delay={0.2} />
        <StatCard title="Curated Dishes" value={stats?.totalDishes || 0} icon={Utensils} delay={0.3} />
        <StatCard title="Total Revenue (Est)" value={stats?.totalRevenue || '$0'} icon={TrendingUp} delay={0.4} />
      </div>

      {/* Charts & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-2 bg-[#050505] border border-luxury-gold/15 p-6 rounded-sm"
        >
          <h3 className="text-xs tracking-widest text-luxury-gold uppercase mb-8">Weekly Reservation Trends</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(212, 175, 55, 0.1)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(248, 244, 233, 0.4)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(248, 244, 233, 0.4)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F0F0F', borderColor: 'rgba(212, 175, 55, 0.3)', color: '#D4AF37' }}
                  itemStyle={{ color: '#F8F4E9' }}
                />
                <Area type="monotone" dataKey="reservations" stroke="#D4AF37" strokeWidth={2} fillOpacity={1} fill="url(#colorRes)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Activity Feed */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-[#050505] border border-luxury-gold/15 p-6 rounded-sm flex flex-col"
        >
          <h3 className="text-xs tracking-widest text-luxury-gold uppercase mb-6 flex justify-between items-center">
            <span>Recent Activity</span>
            <span className="w-2 h-2 rounded-full bg-luxury-gold animate-pulse"></span>
          </h3>
          
          <div className="flex-1 overflow-y-auto space-y-6 pr-2">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div key={activity._id || index} className="flex gap-4 relative">
                  {/* Timeline line */}
                  {index !== recentActivity.length - 1 && (
                    <div className="absolute left-4 top-10 bottom-[-24px] w-[1px] bg-luxury-gold/10"></div>
                  )}
                  <div className="w-8 h-8 rounded-full bg-luxury-gold/10 flex items-center justify-center shrink-0 border border-luxury-gold/20 z-10 text-luxury-gold">
                    <CalendarCheck size={14} />
                  </div>
                  <div>
                    <p className="text-sm text-luxury-ivory font-semibold">New Reservation: {activity.name}</p>
                    <p className="text-[10px] text-luxury-ivory/50 mt-1">{activity.guests} Guests • {activity.date} @ {activity.time}</p>
                    <p className="text-[9px] text-luxury-gold tracking-wider uppercase mt-2">{format(new Date(activity.createdAt), 'MMM d, h:mm a')}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-luxury-ivory/40 text-center py-10 italic">No recent activity detected.</p>
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
