import React, { useMemo, useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { LogOut, Droplet, Calendar, Wallet, Phone, MessageCircle, History, Sparkles, IndianRupee, MapPin, X, ChevronUp, FileText, Printer, Share2, Snowflake } from 'lucide-react';
import saLogo from '../assets/logo.png';
import unpaidStampImg from '../assets/unpaid_stamp.png';
import paidStampImg from '../assets/paid_stamp.png'; 

export default function ConsumerDashboard() {
  const { entries, user, consumers, logout } = useApp();
  const [showFloatingMenu, setShowFloatingMenu] = useState(false);
  
  // --- INVOICE STATE ---
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceMonth, setInvoiceMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM

  // --- NEW: BACK BUTTON HANDLER ---
  useEffect(() => {
    // If invoice or floating menu is open
    if (showInvoice || showFloatingMenu) {
      // 1. Push fake state
      window.history.pushState(null, document.title, window.location.href);

      // 2. Listen for back action
      const handlePopState = () => {
        if (showInvoice) setShowInvoice(false);
        if (showFloatingMenu) setShowFloatingMenu(false);
      };

      window.addEventListener('popstate', handlePopState);

      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [showInvoice, showFloatingMenu]);

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
      // Removed lifetimeSpent calculation as tile is removed
    };
  }, [myData]);

  // Invoice Data Logic
  const invoiceData = useMemo(() => {
      return entries
        .filter(e => e.mobile === user.mobile && e.date.startsWith(invoiceMonth))
        .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [entries, user, invoiceMonth]);

  const invoiceTotal = invoiceData.reduce((sum, item) => sum + item.price, 0);
  
  // Check if invoice is fully paid (for stamp display)
  const isInvoicePaid = useMemo(() => {
      if (invoiceData.length === 0) return false;
      return invoiceData.every(item => item.is_paid);
  }, [invoiceData]);

  const getHouseNo = (profile) => {
    if (!profile) return '';
    return profile.house_no || profile.houseNo || '';
  };

  const handlePrint = () => {
      window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-200 relative overflow-hidden flex justify-center">

      {/* --- ANIMATED BACKGROUND --- */}
      <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[100px] animate-pulse pointer-events-none z-0"></div>

      {/* --- MAIN CONTAINER --- */}
      <div className="relative z-10 w-full max-w-md p-4 flex flex-col h-screen print:p-0 print:h-auto print:max-w-none">

        {/* 1. COMPACT HEADER (Hidden on Invoice View / Print) */}
        {!showInvoice && (
            <div className="bg-white/70 backdrop-blur-xl p-3 rounded-3xl border border-white/60 shadow-sm flex items-center gap-4 mb-4 shrink-0 print:hidden">
                <div className="bg-white p-2 rounded-2xl shadow-sm shrink-0">
                    <img src={saLogo} alt="Logo" className="w-10 h-10 object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                    <h1 className="text-lg font-black text-slate-800 truncate leading-tight">{userProfile.name}</h1>
                    <div className="flex items-center gap-1 text-slate-500 mt-0.5">
                        <MapPin size={10} className="shrink-0" />
                        <p className="text-[11px] font-bold truncate">
                            {getHouseNo(userProfile) ? `#${getHouseNo(userProfile)}, ` : ''}{userProfile.area || 'No Area'}
                        </p>
                    </div>
                </div>
                <button onClick={logout} className="p-2.5 bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition shrink-0">
                    <LogOut size={18} />
                </button>
            </div>
        )}

        {/* --- DASHBOARD CONTENT (Hidden if showing Invoice) --- */}
        {!showInvoice ? (
            <>
                {/* 2. STATS TILES (UPDATED: 2 Tiles Only) */}
                <div className="grid grid-cols-2 gap-3 mb-4 shrink-0">
                  {/* Large Tile: Due Amount */}
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

                  {/* Wide Tile: Total Jars (Spans full width now since Paid is removed, or can be 1/2 if you want to add something else) */}
                  <div className="col-span-2 bg-white/60 backdrop-blur-md rounded-2xl p-4 border border-white/50 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-100 w-10 h-10 rounded-xl flex items-center justify-center text-blue-600"><Droplet size={20} /></div>
                        <div>
                            <p className="text-slate-400 text-[10px] font-bold uppercase">Total Jars</p>
                            <p className="text-2xl font-black text-slate-800 leading-none">{stats.totalJars}</p>
                        </div>
                    </div>
                    {/* Visual graph line or decoration could go here */}
                    <div className="h-1 w-16 bg-blue-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-2/3 rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* 3. HISTORY LIST */}
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
                            <div className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center border font-bold shrink-0 ${entry.type === 'chilled' ? 'bg-cyan-50 border-cyan-100 text-cyan-600' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>
                              {entry.type === 'chilled' ? <Snowflake size={16}/> : (
                                  <>
                                    <span className="text-sm leading-none">{new Date(entry.date).getDate()}</span>
                                    <span className="text-[8px] uppercase leading-none mt-0.5 opacity-70">{new Date(entry.date).toLocaleString('default', { month: 'short' })}</span>
                                  </>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-slate-800 block">{entry.qty} Jars</span>
                                {entry.type === 'chilled' && <span className="text-[8px] bg-cyan-100 text-cyan-700 font-bold px-1 py-0.5 rounded">CHILLED</span>}
                                {entry.is_paid && <span className="text-[8px] bg-green-100 text-green-700 font-bold px-1 py-0.5 rounded">PAID</span>}
                              </div>
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
            </>
        ) : (
            // --- INVOICE VIEW ---
            <div className="h-full flex flex-col bg-white rounded-3xl shadow-xl overflow-hidden relative print:rounded-none print:shadow-none print:h-auto">
                <div className="p-6 flex-1 flex flex-col relative">
                    
                    {/* WATERMARK STAMP */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                        {isInvoicePaid ? (
                            <img src={paidStampImg} alt="PAID" className="w-64 h-64 object-contain opacity-30 transform -rotate-12" />
                        ) : (
                            <img src={unpaidStampImg} alt="UNPAID" className="w-64 h-64 object-contain opacity-20 transform -rotate-12" />
                        )}
                    </div>

                    {/* HEADER */}
                    <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4 relative z-10">
                        <div className="flex items-center gap-3">
                            <img src={saLogo} alt="Logo" className="w-12 h-12 object-contain" />
                            <div>
                                <h1 className="text-xl font-black text-slate-800 uppercase">S.A. Enterprises</h1>
                                <p className="text-[10px] font-bold text-slate-500">Pure Water Supply</p>
                                <p className="text-[10px] text-slate-400">+91 70604 56251</p>
                            </div>
                        </div>
                        <button onClick={() => setShowInvoice(false)} className="bg-slate-100 p-2 rounded-full hover:bg-slate-200 print:hidden"><X size={18}/></button>
                    </div>

                    {/* BILL DETAILS */}
                    <div className="mb-6 relative z-10">
                        <h2 className="text-2xl font-black text-slate-900 mb-1">INVOICE</h2>
                        <p className="text-slate-500 font-bold uppercase text-[10px] mb-4">Monthly Statement</p>
                        
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Bill To</p>
                                <p className="text-base font-bold text-slate-800">{userProfile.name}</p>
                                <p className="text-xs text-slate-500">{userProfile.mobile}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Month</p>
                                <input type="month" value={invoiceMonth} onChange={(e) => setInvoiceMonth(e.target.value)} className="font-bold text-slate-800 outline-none text-right bg-transparent cursor-pointer text-sm print:hidden" />
                                <p className="font-bold text-slate-800 hidden print:block text-sm">{invoiceMonth}</p>
                            </div>
                        </div>
                    </div>

                    {/* TABLE */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
                        <table className="w-full mb-4">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="text-left py-2 px-2 text-[10px] font-bold text-slate-500 uppercase">Date</th>
                                    <th className="text-left py-2 px-2 text-[10px] font-bold text-slate-500 uppercase">Item</th>
                                    <th className="text-center py-2 px-2 text-[10px] font-bold text-slate-500 uppercase">Qty</th>
                                    <th className="text-right py-2 px-2 text-[10px] font-bold text-slate-500 uppercase">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {invoiceData.map((item) => (
                                    <tr key={item.id}>
                                        <td className="py-2 px-2 text-xs font-bold text-slate-700">{new Date(item.date).toLocaleDateString('en-IN', {day: '2-digit', month: 'short'})}</td>
                                        <td className="py-2 px-2 text-xs text-slate-600">{item.type === 'chilled' ? 'Chilled ❄️' : 'Normal'}</td>
                                        <td className="py-2 px-2 text-xs font-bold text-slate-700 text-center">{item.qty}</td>
                                        <td className="py-2 px-2 text-xs font-bold text-slate-900 text-right">₹{item.price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* FOOTER */}
                    <div className="border-t-2 border-slate-900 pt-4 mt-auto relative z-10">
                        <div className="flex justify-between items-center mb-6">
                            <span className="font-bold text-sm uppercase tracking-wide">Total Due</span>
                            <span className="font-black text-2xl">₹{invoiceTotal}</span>
                        </div>
                        
                        <div className="text-center print:hidden">
                            <button onClick={handlePrint} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition shadow-lg">
                                <Printer size={18} /> Print / Save PDF
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* 4. FLOATING ACTION BUTTONS (Hidden on Invoice View) */}
        {!showInvoice && (
            <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 print:hidden">
                
                <div className={`flex flex-col gap-3 transition-all duration-300 origin-bottom ${showFloatingMenu ? 'scale-100 opacity-100 translate-y-0' : 'scale-0 opacity-0 translate-y-10 pointer-events-none'}`}>
                    
                    {/* VIEW BILL BUTTON */}
                    <button onClick={() => { setShowInvoice(true); setShowFloatingMenu(false); }} className="flex items-center gap-2 bg-slate-800 text-white pl-4 pr-3 py-3 rounded-full shadow-lg hover:bg-slate-900 transition transform hover:scale-105">
                        <span className="text-xs font-bold">My Invoice</span>
                        <div className="bg-white/20 p-1 rounded-full"><FileText size={16}/></div>
                    </button>

                    <a href="tel:+917060456251" className="flex items-center gap-2 bg-blue-600 text-white pl-4 pr-3 py-3 rounded-full shadow-lg shadow-blue-400/40 hover:bg-blue-700 transition transform hover:scale-105">
                        <span className="text-xs font-bold">Call Admin</span>
                        <div className="bg-white/20 p-1 rounded-full"><Phone size={16}/></div>
                    </a>

                    <a 
                        href="[https://wa.me/917060456251?text=Hello%20bhaiya,%20mujhe%20apne%20bill/hisab%20ke%20baare%20mein%20baat%20karni%20hai](https://wa.me/917060456251?text=Hello%20bhaiya,%20mujhe%20apne%20bill/hisab%20ke%20baare%20mein%20baat%20karni%20hai)"
                        target="_blank" rel="noreferrer"
                        className="flex items-center gap-2 bg-green-600 text-white pl-4 pr-3 py-3 rounded-full shadow-lg shadow-green-400/40 hover:bg-green-700 transition transform hover:scale-105"
                    >
                        <span className="text-xs font-bold">WhatsApp</span>
                        <div className="bg-white/20 p-1 rounded-full"><MessageCircle size={16}/></div>
                    </a>
                </div>

                <button 
                    onClick={() => setShowFloatingMenu(!showFloatingMenu)}
                    className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 active:scale-90 ${showFloatingMenu ? 'bg-slate-800 rotate-45' : 'bg-slate-900 rotate-0'}`}
                >
                    {showFloatingMenu ? <X className="text-white" size={24} /> : <Phone className="text-white fill-white animate-pulse" size={24} />}
                </button>

            </div>
        )}

      </div>
    </div>
  );
}