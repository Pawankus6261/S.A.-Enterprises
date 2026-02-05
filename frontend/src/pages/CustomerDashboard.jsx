import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { LogOut, Droplet, Calendar, Wallet, Phone, MessageCircle, History, Sparkles, IndianRupee, MapPin, X, ChevronUp } from 'lucide-react';
import saLogo from '../assets/LOGO.png';

export default function ConsumerDashboard() {
  const { entries, user, consumers, logout } = useApp();
  const [showFloatingMenu, setShowFloatingMenu] = useState(false);

  // --- DATA LOGIC ---
  const userProfile = useMemo(() => {
    return consumers.find(c => c.mobile === user.mobile) || user;
  }, [consumers, user]);

  const myData = useMemo(() => {
    return entries
      .filter(entry => entry.mobile === user.mobile)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [entries, user]);

  const stats = useMemo(() => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const thisMonthData = myData.filter(e => e.date.startsWith(currentMonth));

    return {
      monthDue: thisMonthData.reduce((acc, curr) => acc + curr.price, 0),
      totalJars: myData.reduce((acc, curr) => acc + curr.qty, 0),
      lifetimeSpent: myData.reduce((acc, curr) => acc + curr.price, 0)
    };
  }, [myData]);

  const getHouseNo = (profile) => {
    if (!profile) return '';
    return profile.house_no || profile.houseNo || '';
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-200 relative overflow-hidden flex justify-center">

      {/* --- ANIMATED BACKGROUND --- */}
      <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[100px] animate-pulse pointer-events-none z-0"></div>

      {/* --- MAIN CONTAINER --- */}
      <div className="relative z-10 w-full max-w-md p-4 flex flex-col h-screen">

        {/* 1. COMPACT HEADER (Logo + Name Side-by-Side) */}
        <div className="bg-white/70 backdrop-blur-xl p-3 rounded-3xl border border-white/60 shadow-sm flex items-center gap-4 mb-4 shrink-0">
            {/* Logo */}
            <div className="bg-white p-2 rounded-2xl shadow-sm shrink-0">
                <img src={saLogo} alt="Logo" className="w-10 h-10 object-contain" />
            </div>

            {/* User Info (Compact) */}
            <div className="flex-1 min-w-0">
                <h1 className="text-lg font-black text-slate-800 truncate leading-tight">{userProfile.name}</h1>
                <div className="flex items-center gap-1 text-slate-500 mt-0.5">
                    <MapPin size={10} className="shrink-0" />
                    <p className="text-[11px] font-bold truncate">
                        {getHouseNo(userProfile) ? `#${getHouseNo(userProfile)}, ` : ''}{userProfile.area || 'No Area'}
                    </p>
                </div>
            </div>

            {/* Logout Button */}
            <button onClick={logout} className="p-2.5 bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition shrink-0">
                <LogOut size={18} />
            </button>
        </div>

        {/* 2. STATS TILES (Compact Grid) */}
        <div className="grid grid-cols-2 gap-3 mb-4 shrink-0">
          {/* Main Tile: Due Amount */}
          <div className="col-span-2 bg-slate-900 rounded-3xl p-5 text-white shadow-xl shadow-slate-200 relative overflow-hidden flex justify-between items-center">
            <div className="absolute top-0 right-0 p-3 opacity-10"><Wallet size={80} /></div>
            <div>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Due Amount</p>
              <p className="text-4xl font-black tracking-tight">₹{stats.monthDue}</p>
            </div>
            <div className="bg-white/10 p-2.5 rounded-2xl backdrop-blur-md border border-white/10 shadow-inner">
              <Sparkles size={20} className="text-yellow-400 fill-yellow-400" />
            </div>
          </div>

          {/* Small Tile: Jars */}
          <div className="bg-white/60 backdrop-blur-md rounded-2xl p-3 border border-white/50 flex flex-col justify-between h-24">
            <div className="bg-blue-100 w-8 h-8 rounded-lg flex items-center justify-center text-blue-600 mb-1"><Droplet size={16} /></div>
            <div>
              <p className="text-2xl font-black text-slate-800 leading-none">{stats.totalJars}</p>
              <p className="text-slate-400 text-[9px] font-bold uppercase mt-1">Total Jars</p>
            </div>
          </div>

          {/* Small Tile: Paid */}
          <div className="bg-white/60 backdrop-blur-md rounded-2xl p-3 border border-white/50 flex flex-col justify-between h-24">
            <div className="bg-emerald-100 w-8 h-8 rounded-lg flex items-center justify-center text-emerald-600 mb-1"><IndianRupee size={16} /></div>
            <div>
              <p className="text-2xl font-black text-slate-800 leading-none">₹{stats.lifetimeSpent}</p>
              <p className="text-slate-400 text-[9px] font-bold uppercase mt-1">Total Paid</p>
            </div>
          </div>
        </div>

        {/* 3. HISTORY LIST (Fills Remaining Space) */}
        <div className="flex-1 flex flex-col min-h-0 bg-white/50 backdrop-blur-xl rounded-t-[2.5rem] border-t border-x border-white/60 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="p-5 pb-2 shrink-0 flex justify-between items-center">
            <h2 className="text-sm font-black text-slate-800 flex items-center gap-2 uppercase tracking-wide">
              <History size={16} className="text-blue-600" /> Recent Logs
            </h2>
            <span className="text-[10px] font-bold bg-white px-2 py-1 rounded-lg text-slate-400 shadow-sm">{myData.length}</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 pt-0 space-y-2.5 custom-scrollbar pb-24">
            {myData.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
                <Calendar size={48} className="mb-2" />
                <p className="text-xs font-bold uppercase tracking-widest">No history yet</p>
              </div>
            ) : (
              myData.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-3.5 bg-white rounded-2xl shadow-sm border border-slate-50 hover:scale-[1.01] transition-transform">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-50 w-10 h-10 rounded-xl flex flex-col items-center justify-center text-blue-600 border border-blue-100 font-bold shrink-0">
                      <span className="text-sm leading-none">{new Date(entry.date).getDate()}</span>
                      <span className="text-[8px] uppercase leading-none mt-0.5 opacity-70">{new Date(entry.date).toLocaleString('default', { month: 'short' })}</span>
                    </div>
                    <div>
                      <span className="text-sm font-bold text-slate-800 block">{entry.qty} Jars</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">
                        {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' })}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block font-black text-sm text-slate-800 bg-slate-100 px-2 py-1 rounded-lg">₹{entry.price}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 4. FLOATING ACTION BUTTONS (FAB) */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
            
            {/* Toggle Menu (Visible on Click) */}
            <div className={`flex flex-col gap-3 transition-all duration-300 origin-bottom ${showFloatingMenu ? 'scale-100 opacity-100 translate-y-0' : 'scale-0 opacity-0 translate-y-10 pointer-events-none'}`}>
                
                {/* Admin Call */}
                <a href="tel:+917060456251" className="flex items-center gap-2 bg-blue-600 text-white pl-4 pr-3 py-3 rounded-full shadow-lg shadow-blue-400/40 hover:bg-blue-700 transition transform hover:scale-105">
                    <span className="text-xs font-bold">Call Admin</span>
                    <div className="bg-white/20 p-1 rounded-full"><Phone size={16}/></div>
                </a>

                {/* WhatsApp */}
                <a 
                    href="https://wa.me/917060456251?text=Hello%20bhaiya,%20mujhe%20apne%20bill/hisab%20ke%20baare%20mein%20baat%20karni%20hai"
                    target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 bg-green-600 text-white pl-4 pr-3 py-3 rounded-full shadow-lg shadow-green-400/40 hover:bg-green-700 transition transform hover:scale-105"
                >
                    <span className="text-xs font-bold">WhatsApp</span>
                    <div className="bg-white/20 p-1 rounded-full"><MessageCircle size={16}/></div>
                </a>
            </div>

            {/* Main Toggle Button */}
            <button 
                onClick={() => setShowFloatingMenu(!showFloatingMenu)}
                className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 active:scale-90 ${showFloatingMenu ? 'bg-slate-800 rotate-45' : 'bg-slate-900 rotate-0'}`}
            >
                {showFloatingMenu ? <X className="text-white" size={24} /> : <Phone className="text-white fill-white animate-pulse" size={24} />}
            </button>

        </div>

      </div>
    </div>
  );
}