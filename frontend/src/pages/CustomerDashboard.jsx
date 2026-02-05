import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { LogOut, Droplet, Calendar, MapPin, Wallet, Phone, MessageCircle, History, Sparkles, User, IndianRupee } from 'lucide-react';
import saLogo from '../assets/LOGO.png';

export default function ConsumerDashboard() {
  const { entries, user, consumers, logout } = useApp();

  // --- DATA LOGIC ---
  const userProfile = useMemo(() => {
    // Try to find fresh data from consumers list, fallback to logged-in user state
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

  // Helper to safely get house number (handles both backend 'house_no' and frontend 'houseNo')
  const getHouseNo = (profile) => {
    if (!profile) return '';
    return profile.house_no || profile.houseNo || '';
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-200 relative overflow-hidden flex justify-center">

      {/* --- ANIMATED BACKGROUND --- */}
      <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[100px] animate-pulse pointer-events-none z-0"></div>

      {/* --- MAIN MOBILE CONTAINER --- */}
      <div className="relative z-10 w-full max-w-md p-6 flex flex-col h-screen">

        {/* 1. HEADER (Profile Info) */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-6">
            <div className="bg-white/80 backdrop-blur p-2 rounded-2xl shadow-sm border border-white/50">
              <img src={saLogo} alt="Logo" className="w-10 h-10 object-contain" />
            </div>
            <button onClick={logout} className="bg-white/50 p-3 rounded-full hover:bg-white transition backdrop-blur-md shadow-sm group">
              <LogOut size={20} className="text-slate-500 group-hover:text-red-500 transition-colors" />
            </button>
          </div>

          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Welcome Back,</p>
            <h1 className="text-3xl font-black text-slate-800 leading-tight mb-3">{userProfile.name}</h1>

            {/* Contact & Address Chips */}
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-1.5 bg-white/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/50 shadow-sm">
                <Phone size={14} className="text-blue-600" />
                <span className="text-xs font-bold text-slate-600">{userProfile.mobile}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/50 shadow-sm">
                <MapPin size={14} className="text-red-500" />
                <span className="text-xs font-bold text-slate-600 max-w-[200px] truncate">
                  {/* HERE IS THE FIX: Using helper function */}
                  {getHouseNo(userProfile) ? `#${getHouseNo(userProfile)}, ` : ''}{userProfile.area || 'No Address'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. STATS TILES */}
        <div className="grid grid-cols-2 gap-3 mb-6">

          {/* Tile 1: Monthly Bill */}
          <div className="col-span-2 bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-5 text-white shadow-xl shadow-slate-200 relative overflow-hidden flex justify-between items-center">
            <div className="absolute top-0 right-0 p-3 opacity-10"><Wallet size={80} /></div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wide mb-1">Current Month Due</p>
              <p className="text-4xl font-black">₹{stats.monthDue}</p>
            </div>
            <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md border border-white/10">
              <Sparkles size={24} className="text-yellow-400" />
            </div>
          </div>

          {/* Tile 2: Total Jars */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-4 border border-white/60 shadow-sm flex flex-col justify-between">
            <div className="bg-blue-50 w-10 h-10 rounded-xl flex items-center justify-center text-blue-600 mb-2"><Droplet size={20} /></div>
            <div>
              <p className="text-3xl font-black text-slate-800">{stats.totalJars}</p>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wide">Total Jars</p>
            </div>
          </div>

          {/* Tile 3: Lifetime Paid */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-4 border border-white/60 shadow-sm flex flex-col justify-between">
            <div className="bg-emerald-50 w-10 h-10 rounded-xl flex items-center justify-center text-emerald-600 mb-2"><IndianRupee size={20} /></div>
            <div>
              <p className="text-3xl font-black text-slate-800">₹{stats.lifetimeSpent}</p>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wide">Lifetime Paid</p>
            </div>
          </div>
        </div>

        {/* 3. HISTORY LIST */}
        <div className="flex-1 flex flex-col min-h-0 bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white/50 shadow-xl overflow-hidden">
          <div className="p-6 pb-2 flex justify-between items-end shrink-0">
            <div>
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <History size={18} className="text-blue-600" /> Recent Activity
              </h2>
              <p className="text-xs text-slate-400 font-medium ml-7">Your water supply logs</p>
            </div>
            <span className="text-[10px] font-bold bg-white px-2 py-1 rounded-lg text-slate-400 shadow-sm border border-slate-50">{myData.length} Entries</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {myData.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
                <Calendar size={48} className="mb-2" />
                <p className="text-sm font-bold">No history found</p>
              </div>
            ) : (
              myData.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-slate-50">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-50 w-12 h-12 rounded-2xl flex flex-col items-center justify-center text-blue-600 border border-blue-100 font-bold">
                      <span className="text-lg leading-none">{new Date(entry.date).getDate()}</span>
                      <span className="text-[9px] uppercase leading-none mt-0.5">{new Date(entry.date).toLocaleString('default', { month: 'short' })}</span>
                    </div>
                    <div>
                      <span className="text-sm font-bold text-slate-800">{entry.qty} Jars</span>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide mt-0.5">
                        {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'long' })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block font-black text-lg text-slate-800">₹{entry.price}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer Buttons */}
       <div className="mt-4 shrink-0 flex flex-col gap-3 pb-4 px-2">
            
            <p className="text-center text-[10px] text-slate-400 font-medium uppercase tracking-widest">
                Billing help needed?
            </p>

            {/* Primary Contact Row */}
            <div className="flex justify-center gap-3">
                <a
                    // Updated Hinglish Message with "Bhaiya" 👇
                    href="https://wa.me/917060456251?text=Hello%20bhaiya,%20mujhe%20apne%20bill/hisab%20ke%20baare%20mein%20baat%20karni%20hai"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex justify-center items-center gap-2 bg-green-100 text-green-800 px-4 py-3 rounded-xl text-xs font-bold shadow-sm hover:bg-green-200 transition"
                >
                    <MessageCircle size={16} /> WhatsApp
                </a>

                <a
                    href="tel:+917060456251"
                    className="flex-1 flex justify-center items-center gap-2 bg-blue-100 text-blue-800 px-4 py-3 rounded-xl text-xs font-bold shadow-sm hover:bg-blue-200 transition"
                >
                    <Phone size={16} /> Call Admin
                </a>
            </div>

            {/* Alternate Contact Row */}
            <div className="flex justify-center gap-3">
                 <a
                    // Same message for Alternate number 👇
                    href="https://wa.me/918120130340?text=Hello%20bhaiya,%20mujhe%20apne%20bill/hisab%20ke%20baare%20mein%20baat%20karni%20hai" 
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex justify-center items-center gap-2 border border-green-200 text-green-600 px-3 py-2 rounded-xl text-[10px] font-bold hover:bg-green-50 transition"
                >
                    <MessageCircle size={14} /> Alt WhatsApp
                </a>

                <a
                    href="tel:+918120130340" // <--- Replace with actual Alternate Number
                    className="flex-1 flex justify-center items-center gap-2 border border-blue-200 text-blue-600 px-3 py-2 rounded-xl text-[10px] font-bold hover:bg-blue-50 transition"
                >
                    <Phone size={14} /> Alt Call
                </a>
            </div>

        

        </div>

      </div>
    </div>
  );
}