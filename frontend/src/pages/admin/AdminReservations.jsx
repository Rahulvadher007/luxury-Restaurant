import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Search, Filter, CheckCircle, XCircle, Trash2, CalendarDays, Mail, MailWarning, MailCheck, Send, Clock, ChevronDown, ChevronUp } from 'lucide-react';

export default function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRow, setExpandedRow] = useState(null);
  const [resendingId, setResendingId] = useState(null);

  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem('aurum_admin_token');
      const res = await fetch('/api/reservations', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setReservations(data);
      }
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    if (!window.confirm(`Are you sure you want to mark this reservation as ${status}? This will trigger an automated email to the guest.`)) return;
    
    try {
      const token = localStorage.getItem('aurum_admin_token');
      const res = await fetch(`/api/reservations/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        // Optimistically update the UI to show the new status immediately,
        // then fetch again to get the updated emailStatus after the backend finishes sending.
        fetchReservations();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleResendEmail = async (id) => {
    if (!window.confirm('Are you sure you want to resend the confirmation/rejection email?')) return;
    
    setResendingId(id);
    try {
      const token = localStorage.getItem('aurum_admin_token');
      const res = await fetch(`/api/reservations/${id}/resend-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (res.ok) {
        alert('Email resent successfully!');
        fetchReservations();
      } else {
        const data = await res.json();
        alert(`Failed to resend email: ${data.message}`);
      }
    } catch (error) {
      console.error('Error resending email:', error);
      alert('An unexpected error occurred while resending.');
    } finally {
      setResendingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this reservation?')) return;
    try {
      const token = localStorage.getItem('aurum_admin_token');
      const res = await fetch(`/api/reservations/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchReservations();
      }
    } catch (error) {
      console.error('Error deleting reservation:', error);
    }
  };

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const filteredReservations = reservations.filter(res => {
    const matchesFilter = filter === 'All' ? true : res.status === filter;
    const matchesSearch = res.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          res.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-end border-b border-luxury-gold/15 pb-6">
        <div>
          <h1 className="text-3xl font-display font-bold uppercase tracking-wider text-luxury-gold">Reservations Ledger</h1>
          <p className="text-xs text-luxury-ivory/50 tracking-widest uppercase mt-2">
            Manage upcoming dining residencies & automated emails
          </p>
        </div>
        <div className="text-right flex items-center gap-2 text-luxury-gold text-xs tracking-widest uppercase">
          <CalendarDays size={16} />
          <span>{reservations.length} Total Records</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-3 text-luxury-gold/50" size={18} />
          <input 
            type="text" 
            placeholder="SEARCH GUEST NAME OR EMAIL..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#050505] border border-luxury-gold/20 focus:border-luxury-gold text-luxury-ivory pl-10 p-3 text-xs tracking-widest outline-none transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-luxury-gold/50" />
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-[#050505] border border-luxury-gold/20 text-luxury-gold p-3 text-xs tracking-widest uppercase outline-none focus:border-luxury-gold transition-colors"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending Review</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Rejected">Rejected</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#050505] border border-luxury-gold/15 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-luxury-gold/5 border-b border-luxury-gold/15 text-[10px] tracking-widest uppercase text-luxury-gold">
                <th className="p-4 font-semibold w-8"></th>
                <th className="p-4 font-semibold">Guest Detail</th>
                <th className="p-4 font-semibold">Reservation Time</th>
                <th className="p-4 font-semibold">Party & Occasion</th>
                <th className="p-4 font-semibold">Status / Email</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-luxury-gold/50 text-xs tracking-widest uppercase animate-pulse">
                    Retrieving Ledger & Email Logs...
                  </td>
                </tr>
              ) : filteredReservations.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-luxury-ivory/30 text-xs tracking-widest uppercase">
                    No reservations found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredReservations.map((res, index) => (
                  <React.Fragment key={res._id}>
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`border-b border-luxury-gold/5 hover:bg-luxury-gold/5 transition-colors cursor-pointer ${expandedRow === res._id ? 'bg-luxury-gold/5' : ''}`}
                      onClick={() => toggleRow(res._id)}
                    >
                      <td className="p-4 text-luxury-gold/50">
                        {expandedRow === res._id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </td>
                      <td className="p-4">
                        <p className="text-sm text-luxury-ivory font-semibold">{res.name}</p>
                        <p className="text-[10px] text-luxury-ivory/50 mt-1">{res.email}</p>
                        <p className="text-[10px] text-luxury-ivory/50">{res.phone}</p>
                      </td>
                      <td className="p-4">
                        <p className="text-xs text-luxury-ivory">{res.date}</p>
                        <p className="text-[10px] text-luxury-gold tracking-widest uppercase mt-1">{res.time}</p>
                      </td>
                      <td className="p-4">
                        <p className="text-xs text-luxury-ivory">{res.guests} Guests</p>
                        <p className="text-[10px] text-luxury-ivory/60 mt-1">
                          {res.occasion} • {res.assignedTable}
                        </p>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-2">
                          <span className={`w-fit px-3 py-1 text-[9px] tracking-widest uppercase border ${
                            res.status === 'Confirmed' ? 'bg-green-950/30 text-green-400 border-green-500/30' : 
                            res.status === 'Pending' ? 'bg-yellow-950/30 text-yellow-400 border-yellow-500/30' :
                            'bg-red-950/30 text-red-400 border-red-500/30'
                          }`}>
                            {res.status}
                          </span>
                          
                          <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest" title="Email Delivery Status">
                            {res.emailStatus === 'Sent' ? <span className="text-green-500 flex items-center gap-1"><MailCheck size={12}/> Delivered</span> :
                             res.emailStatus === 'Failed' ? <span className="text-red-500 flex items-center gap-1"><MailWarning size={12}/> Failed</span> :
                             <span className="text-luxury-ivory/40 flex items-center gap-1"><Mail size={12}/> Not Sent</span>}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end gap-3 mt-3">
                          {res.status === 'Pending' && (
                            <>
                              <button 
                                onClick={() => handleStatusUpdate(res._id, 'Confirmed')}
                                title="Approve & Send Confirmation"
                                className="text-green-500/70 hover:text-green-400 transition-colors"
                              >
                                <CheckCircle size={18} />
                              </button>
                              <button 
                                onClick={() => handleStatusUpdate(res._id, 'Rejected')}
                                title="Reject & Send Notice"
                                className="text-red-500/70 hover:text-red-400 transition-colors"
                              >
                                <XCircle size={18} />
                              </button>
                            </>
                          )}
                          
                          {(res.status === 'Confirmed' || res.status === 'Rejected') && (
                            <button 
                              onClick={() => handleResendEmail(res._id)}
                              disabled={resendingId === res._id}
                              title="Resend Email"
                              className="text-blue-400/70 hover:text-blue-400 transition-colors disabled:opacity-50"
                            >
                              <Send size={18} className={resendingId === res._id ? "animate-pulse" : ""} />
                            </button>
                          )}

                          <button 
                            onClick={() => handleDelete(res._id)}
                            title="Delete Record"
                            className="text-red-500/70 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>

                    {/* Expandable Activity Log Row */}
                    <AnimatePresence>
                      {expandedRow === res._id && (
                        <motion.tr
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-[#0A0A0A] border-b border-luxury-gold/5"
                        >
                          <td colSpan="6" className="p-6 border-l-2 border-luxury-gold/30">
                            <h4 className="text-luxury-gold text-xs tracking-widest uppercase mb-4 flex items-center gap-2">
                              <Clock size={14} /> Activity & Communication Logs
                            </h4>
                            
                            <div className="space-y-4">
                              {res.emailLogs && res.emailLogs.length > 0 ? (
                                res.emailLogs.map((log, i) => (
                                  <div key={i} className="flex gap-4 items-start">
                                    <div className="w-1.5 h-1.5 bg-luxury-gold/50 rounded-full mt-1.5"></div>
                                    <div>
                                      <p className="text-xs text-luxury-ivory">{log.action}</p>
                                      <p className="text-[10px] text-luxury-ivory/40 mt-1 uppercase tracking-widest">
                                        {format(new Date(log.timestamp), "MMM dd, yyyy HH:mm:ss")}
                                      </p>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <p className="text-xs text-luxury-ivory/50 italic">No activity recorded.</p>
                              )}
                            </div>
                            
                            {res.specialRequests && (
                              <div className="mt-6 pt-4 border-t border-luxury-gold/10">
                                <span className="text-[10px] text-luxury-gold uppercase tracking-widest block mb-1">Guest Special Accommodations</span>
                                <p className="text-sm text-luxury-ivory/80 italic">"{res.specialRequests}"</p>
                              </div>
                            )}
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
