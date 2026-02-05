import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { LogOut, Plus, Search, Edit2, Trash2, X, ChevronLeft, ChevronRight, UserCheck, History, Eye, MinusSquare, PlusSquare, Wallet, TrendingUp, Users, Phone, MapPin, UserPlus, PlusCircle, Calendar, Home } from 'lucide-react';
import saLogo from '../assets/LOGO.png'; 

export default function AdminDashboard() {
  const { 
    consumers, 
    entries, 
    jarRate, 
    registerConsumer, 
    updateConsumer, 
    deleteConsumer, 
    addEntry, 
    editEntry, 
    deleteEntry, 
    updateRate, 
    logout 
} = useApp();
  
  // --- STATE ---
  const [activeTab, setActiveTab] = useState('daily'); 
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals
  const [modalType, setModalType] = useState(null); 
  const [viewingCustomer, setViewingCustomer] = useState(null);
  const [editingId, setEditingId] = useState(null);
  
  // Forms
  // ADDED: custom_rate to regForm
  const [regForm, setRegForm] = useState({ name: '', mobile: '', house_no: '', area: '', custom_rate: '' });
  const [entryForm, setEntryForm] = useState({ mobile: '', qty: 1, date: '' });
  const [entrySearch, setEntrySearch] = useState('');
  const [selectedConsumer, setSelectedConsumer] = useState(null); 

  // --- DERIVED DATA ---
  const dailyEntries = entries.filter(entry => entry.date === selectedDate);
  const displayedEntries = dailyEntries.filter(entry => 
    entry.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    entry.mobile.includes(searchTerm)
  );
  
  const displayedConsumers = consumers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.mobile.includes(searchTerm) ||
    c.area.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const dailyJars = dailyEntries.reduce((sum, item) => sum + item.qty, 0);
  const dailyRevenue = dailyEntries.reduce((sum, item) => sum + item.price, 0);

  // Profile Logic
  const customerHistory = useMemo(() => {
    if (!viewingCustomer) return [];
    return entries.filter(e => e.mobile === viewingCustomer.mobile).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [viewingCustomer, entries]);

  const customerStats = useMemo(() => {
    if (!viewingCustomer) return { qty: 0, price: 0, totalRevenue: 0 };
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlyEntries = customerHistory.filter(e => e.date.startsWith(currentMonth));
    const totalRevenue = customerHistory.reduce((s, i) => s + i.price, 0); 

    return {
      qty: monthlyEntries.reduce((s, i) => s + i.qty, 0),
      price: monthlyEntries.reduce((s, i) => s + i.price, 0),
      totalRevenue
    };
  }, [customerHistory, viewingCustomer]);

  // --- HANDLERS ---
  const handleRegister = (e) => {
    e.preventDefault();
    if (registerConsumer(regForm)) {
      setModalType(null); 
      setRegForm({ name: '', mobile: '', house_no: '', area: '', custom_rate: '' });
      alert('Consumer Saved!');
    }
  };

  const handleUpdateConsumer = async (e) => {
      e.preventDefault();
      const success = await updateConsumer(editingId, regForm);
      if (success) {
          setModalType(null);
          setEditingId(null);
          alert("Profile Updated Successfully!");
      }
  };

  const handleDeleteConsumer = async () => {
      await deleteConsumer(editingId);
      setModalType(null);
      setEditingId(null);
      setViewingCustomer(null);
  };

  const switchToEditProfile = () => {
      setRegForm({ 
          name: viewingCustomer.name,
          mobile: viewingCustomer.mobile,
          house_no: viewingCustomer.house_no || '', 
          area: viewingCustomer.area || '',
          custom_rate: viewingCustomer.custom_rate || '' // Pre-fill custom rate
      });
      setEditingId(viewingCustomer.mobile); 
      setViewingCustomer(null); 
      setModalType('edit_consumer'); 
  };

  const handleAddEntryFromProfile = () => {
      setSelectedConsumer(viewingCustomer);
      setEntryForm({ mobile: viewingCustomer.mobile, qty: 1, date: selectedDate });
      setViewingCustomer(null); 
      setModalType('entry'); 
  };

  const handleEditHistoryEntry = (entry) => {
      openEditEntry(entry);
      setViewingCustomer(null); 
  };

  const handleEntrySubmit = (e) => {
    e.preventDefault();
    const existingEntry = entries.find(e => e.date === entryForm.date && e.mobile === selectedConsumer.mobile);
    if (existingEntry) {
        editEntry(existingEntry.id, { ...existingEntry, qty: existingEntry.qty + parseInt(entryForm.qty) });
    } else {
        addEntry({
            name: selectedConsumer.name,
            mobile: selectedConsumer.mobile,
            house_no: selectedConsumer.house_no,
            area: selectedConsumer.area,
            date: entryForm.date,
            qty: parseInt(entryForm.qty)
        });
    }
    setModalType(null);
    setSelectedConsumer(null);
  };

  const openEditEntry = (entry) => {
    setEditingId(entry.id);
    setEntryForm({ mobile: entry.mobile, qty: entry.qty, date: entry.date });
    // Find consumer to allow rate calculation preview
    const c = consumers.find(x => x.mobile === entry.mobile);
    setSelectedConsumer(c || { name: entry.name, mobile: entry.mobile }); 
    setModalType('edit_entry');
  };

  const handleEditEntrySubmit = (e) => {
    e.preventDefault();
    const original = entries.find(e => e.id === editingId);
    editEntry(editingId, { ...original, qty: parseInt(entryForm.qty), date: entryForm.date });
    setModalType(null);
    setEditingId(null);
    setSelectedConsumer(null);
  };

  const handleDeleteEntry = () => {
      deleteEntry(editingId);
      setModalType(null);
      setEditingId(null);
      setSelectedConsumer(null);
  };

  // HELPER: Get effective rate for display
  const getEffectiveRate = (consumer) => {
      if (consumer && consumer.custom_rate) return consumer.custom_rate;
      return jarRate;
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-200 relative overflow-hidden">
      
      {/* Background */}
      <div className="fixed top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-[100px] animate-pulse pointer-events-none z-0"></div>
      
      <div className="relative z-10 p-4 md:p-8 pb-24 max-w-7xl mx-auto">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 bg-white/60 backdrop-blur-xl p-3 rounded-2xl shadow-sm border border-white/50">
          <div className="flex items-center justify-between w-full md:w-auto gap-3">
            <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-xl shadow-md"><img src={saLogo} alt="Logo" className="w-8 h-8 object-contain" /></div>
                <div>
                    <h1 className="text-xl font-black text-slate-800 tracking-tight">Admin CRM</h1>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Manager Panel</p>
                </div>
            </div>
            <button onClick={logout} className="md:hidden p-2.5 text-red-500 bg-white border border-white rounded-xl shadow-sm hover:bg-red-50 transition"><LogOut size={20}/></button>
          </div>
          
          <div className="w-full md:w-auto flex justify-center">
              <div className="flex items-center gap-4 bg-slate-900/5 border border-white/50 px-4 py-2 rounded-xl backdrop-blur-md">
                 <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Global Rate:</span>
                 <div className="flex items-center gap-3">
                    <button onClick={() => updateRate(jarRate - 1)} className="text-slate-500 hover:text-red-500 active:scale-90 transition"><MinusSquare size={24} strokeWidth={2}/></button>
                    <div className="min-w-[40px] text-center">
                        <span className="text-xl font-black text-slate-800">₹{jarRate}</span>
                    </div>
                    <button onClick={() => updateRate(Number(jarRate) + 1)} className="text-slate-500 hover:text-green-600 active:scale-90 transition"><PlusSquare size={24} strokeWidth={2}/></button>
                 </div>
              </div>
          </div>

          <div className="hidden md:flex gap-2 w-full md:w-auto justify-end">
            <button onClick={logout} className="p-2.5 text-red-500 bg-white border border-white rounded-xl shadow-sm hover:bg-red-50 transition flex justify-center"><LogOut size={20}/></button>
          </div>
        </header>

        {/* TABS */}
        <div className="flex bg-white/50 p-1.5 rounded-2xl mb-6 backdrop-blur shadow-sm border border-white w-full md:w-auto max-w-md">
            <button onClick={() => setActiveTab('daily')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'daily' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:bg-white/50'}`}>
                <Calendar size={16} /> Daily Log
            </button>
            <button onClick={() => setActiveTab('consumers')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'consumers' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-white/50'}`}>
                <Users size={16} /> Directory
            </button>
        </div>

        {/* VIEW 1: DAILY */}
        {activeTab === 'daily' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white/70 backdrop-blur-lg p-4 rounded-3xl shadow-sm border border-white/60 flex flex-col justify-center items-center">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Log Date</label>
                        <div className="flex items-center gap-2 bg-white p-2 rounded-2xl shadow-inner border border-slate-100 w-full justify-between">
                            <button onClick={() => { const d = new Date(selectedDate); d.setDate(d.getDate() - 1); setSelectedDate(d.toISOString().split('T')[0]); }} className="p-3 hover:bg-slate-50 rounded-xl transition text-slate-600"><ChevronLeft size={20}/></button>
                            <input type="date" className="bg-transparent font-black text-lg text-slate-800 outline-none cursor-pointer text-center" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}/>
                            <button onClick={() => { const d = new Date(selectedDate); d.setDate(d.getDate() + 1); setSelectedDate(d.toISOString().split('T')[0]); }} className="p-3 hover:bg-slate-50 rounded-xl transition text-slate-600"><ChevronRight size={20}/></button>
                        </div>
                    </div>
                    <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                        <div className="bg-white p-5 rounded-3xl shadow-lg border border-slate-100 flex flex-col justify-between">
                            <div className="flex items-center gap-2 mb-1 text-emerald-600 text-xs font-bold uppercase"><Wallet size={14}/> Revenue</div>
                            <div className="text-slate-800"><span className="text-4xl font-black tracking-tight">₹{dailyRevenue}</span></div>
                        </div>
                        <div className="bg-blue-600 text-white p-5 rounded-3xl shadow-lg shadow-blue-200 flex flex-col justify-between">
                            <div className="flex items-center gap-2 mb-1 text-blue-200 text-xs font-bold uppercase"><TrendingUp size={14}/> Volume</div>
                            <div><span className="text-4xl font-black tracking-tight">{dailyJars}</span><span className="text-sm opacity-80 font-medium ml-1">Jars</span></div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-3 mb-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
                        <input placeholder="Search Daily Log..." className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur border border-white/50 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-blue-500/50" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
                    </div>
                    <button onClick={() => { setModalType('entry'); setSelectedConsumer(null); setEntryForm({ mobile: '', qty: 1, date: selectedDate }); }} className="bg-slate-900 text-white px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 shadow-xl active:scale-95 transition-all">
                        <Plus size={20}/> <span className="hidden md:inline">Log Entry</span>
                        <span className="md:hidden">Add</span>
                    </button>
                </div>

                <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-sm border border-white/60 overflow-hidden">
                    {displayedEntries.length === 0 ? <div className="p-12 text-center text-slate-400"><p>No data for {selectedDate}</p></div> : (
                        <div className="divide-y divide-slate-100">
                            {displayedEntries.map(entry => (
                                <div key={entry.id} className="p-4 flex justify-between items-center hover:bg-white/80 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-sm">{entry.qty}</div>
                                        <div>
                                            <h3 className="font-bold text-slate-800 text-sm md:text-base">{entry.name}</h3>
                                            <div className="flex items-center gap-2 text-xs text-slate-400"><span>{entry.mobile}</span></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <p className="font-black text-slate-800">₹{entry.price}</p>
                                        <button onClick={() => openEditEntry(entry)} className="p-2 text-blue-500 bg-blue-50 hover:bg-blue-100 rounded-lg transition"><Edit2 size={18}/></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* VIEW 2: CONSUMERS */}
        {activeTab === 'consumers' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col md:flex-row gap-3 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
                        <input placeholder="Find registered consumers..." className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur border border-white/50 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-blue-500/50" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
                    </div>
                    <button onClick={() => { setModalType('register'); setRegForm({ name: '', mobile: '', house_no: '', area: '', custom_rate: '' }); }} className="bg-blue-600 text-white px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 shadow-xl shadow-blue-200 active:scale-95 transition-all">
                        <UserPlus size={20}/> <span className="hidden md:inline">Register New</span>
                        <span className="md:hidden">New</span>
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {displayedConsumers.map(c => (
                        <div key={c.mobile} className="bg-white/80 backdrop-blur p-4 rounded-3xl border border-white shadow-sm hover:shadow-md transition-all flex justify-between items-start group">
                            <div onClick={() => setViewingCustomer(c)} className="cursor-pointer flex-1">
                                <h3 className="font-bold text-slate-800 text-lg group-hover:text-blue-600 transition-colors">{c.name}</h3>
                                <p className="text-slate-400 font-mono text-xs mb-2">{c.mobile}</p>
                                <div className="flex items-start gap-1 text-[10px] text-slate-500 font-bold bg-slate-50 px-2 py-1 rounded-lg w-fit">
                                    <Home size={12} className="text-blue-400"/>
                                    <span className="truncate max-w-[150px]">{c.house_no ? `#${c.house_no}, ` : ''}{c.area}</span>
                                </div>
                                {c.custom_rate && (
                                     <span className="mt-2 inline-block bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                         Custom Rate: ₹{c.custom_rate}
                                     </span>
                                )}
                            </div>
                            <div className="flex flex-col gap-2 ml-2">
                                <button onClick={() => setViewingCustomer(c)} className="p-2 text-purple-500 bg-purple-50 hover:bg-purple-100 rounded-xl transition"><Eye size={18}/></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* 1. REGISTER / EDIT PROFILE MODAL */}
        {(modalType === 'register' || modalType === 'edit_consumer') && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl p-8 relative">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-slate-800">{modalType === 'register' ? 'New Consumer' : 'Edit Profile'}</h3>
                <button onClick={() => setModalType(null)} className="bg-slate-50 p-2 rounded-full hover:bg-slate-100"><X size={24}/></button>
              </div>
              <form onSubmit={modalType === 'edit_consumer' ? handleUpdateConsumer : handleRegister} className="space-y-4">
                <div><label className="text-xs font-bold text-slate-400 uppercase ml-1">Full Name</label><input required className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-500/20" value={regForm.name} onChange={e => setRegForm({...regForm, name: e.target.value})} /></div>
                <div><label className="text-xs font-bold text-slate-400 uppercase ml-1">Mobile</label><input required type="tel" maxLength="10" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-500/20" value={regForm.mobile} onChange={e => setRegForm({...regForm, mobile: e.target.value})} disabled={modalType === 'edit_consumer'} /></div>
                <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-1"><label className="text-xs font-bold text-slate-400 uppercase ml-1">House No</label><input className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-500/20" value={regForm.house_no} onChange={e => setRegForm({...regForm, house_no: e.target.value})} /></div>
                    <div className="col-span-2"><label className="text-xs font-bold text-slate-400 uppercase ml-1">Area / Colony</label><input required className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-500/20" value={regForm.area} onChange={e => setRegForm({...regForm, area: e.target.value})} /></div>
                </div>
                
                {/* --- CUSTOM RATE FIELD --- */}
                <div>
                     <label className="text-xs font-bold text-slate-400 uppercase ml-1">Custom Rate (Optional)</label>
                     <input 
                        type="number" 
                        placeholder={`Default: ₹${jarRate}`} 
                        className="w-full p-3 bg-yellow-50 border border-yellow-100 text-yellow-800 placeholder:text-yellow-800/40 rounded-xl font-bold outline-none focus:ring-2 focus:ring-yellow-500/20" 
                        value={regForm.custom_rate} 
                        onChange={e => setRegForm({...regForm, custom_rate: e.target.value})} 
                     />
                     <p className="text-[10px] text-slate-400 ml-1 mt-1">Leave empty to use global rate.</p>
                </div>

                <div className="flex gap-3 mt-4">
                    {modalType === 'edit_consumer' && (
                        <button type="button" onClick={handleDeleteConsumer} className="flex-1 bg-red-100 text-red-600 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-200 transition">
                            <Trash2 size={18}/> Delete
                        </button>
                    )}
                    <button type="submit" className="flex-[2] bg-slate-900 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:bg-slate-800 transition">
                        {modalType === 'edit_consumer' ? 'Update Profile' : 'Save Consumer'}
                    </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 2. ENTRY MODAL */}
        {(modalType === 'entry' || modalType === 'edit_entry') && (
             <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in">
                <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl p-6 relative flex flex-col max-h-[90vh]">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-black text-slate-800">{modalType === 'edit_entry' ? 'Edit Entry' : 'Log Filling'}</h3>
                        <button onClick={() => setModalType(null)} className="bg-slate-50 p-2 rounded-full"><X size={20}/></button>
                    </div>
                    {modalType === 'entry' && !selectedConsumer ? (
                        <div className="flex-1 flex flex-col min-h-0">
                            <input autoFocus placeholder="Search Consumer..." className="w-full p-3 bg-slate-50 rounded-xl border border-slate-100 font-bold mb-3" value={entrySearch} onChange={(e) => setEntrySearch(e.target.value)} />
                            <div className="flex-1 overflow-y-auto space-y-2">
                                {consumers.filter(c => c.name.toLowerCase().includes(entrySearch.toLowerCase()) || c.mobile.includes(entrySearch)).map(c => (
                                    <button key={c.mobile} onClick={() => { setSelectedConsumer(c); setEntryForm({ ...entryForm, mobile: c.mobile, qty: 1, date: selectedDate }); }} className="w-full text-left p-3 border border-slate-100 rounded-xl flex justify-between items-center hover:bg-blue-50">
                                        <div><p className="font-bold text-sm">{c.name}</p><p className="text-xs text-slate-500">{c.mobile}</p></div>
                                        <ChevronRight size={16}/>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={modalType === 'edit_entry' ? handleEditEntrySubmit : handleEntrySubmit} className="space-y-4">
                            <div className="bg-blue-50 p-3 rounded-xl flex justify-between items-center">
                                <div>
                                    <p className="font-black text-sm">{selectedConsumer.name}</p>
                                    <p className="text-xs text-slate-500">{selectedConsumer.mobile}</p>
                                </div>
                                {modalType !== 'edit_entry' && <button type="button" onClick={() => setSelectedConsumer(null)} className="text-xs text-red-500 font-bold">Change</button>}
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div><label className="text-xs font-bold text-slate-400">Date</label><input type="date" required className="w-full p-3 bg-slate-50 rounded-xl font-bold" value={entryForm.date} onChange={e => setEntryForm({...entryForm, date: e.target.value})} /></div>
                                <div><label className="text-xs font-bold text-slate-400">Qty</label><input type="number" min="1" autoFocus required className="w-full p-3 bg-slate-50 rounded-xl font-black text-center" value={entryForm.qty} onChange={e => setEntryForm({...entryForm, qty: e.target.value})} /></div>
                            </div>
                            
                            {/* --- DYNAMIC RATE PREVIEW --- */}
                            <div className="flex justify-between items-center bg-slate-100 p-3 rounded-xl">
                                <div>
                                    <span className="text-xs font-bold text-slate-500">Total Calculation</span>
                                    {selectedConsumer?.custom_rate ? (
                                        <p className="text-[10px] text-yellow-600 font-bold">Using Custom Rate: ₹{selectedConsumer.custom_rate}</p>
                                    ) : (
                                        <p className="text-[10px] text-slate-400 font-bold">Using Global Rate: ₹{jarRate}</p>
                                    )}
                                </div>
                                <span className="text-xl font-black text-blue-600">₹{entryForm.qty * getEffectiveRate(selectedConsumer)}</span>
                            </div>

                            <div className="flex gap-3 mt-2">
                                {modalType === 'edit_entry' && (
                                    <button type="button" onClick={handleDeleteEntry} className="flex-1 bg-red-100 text-red-600 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-200 transition">
                                        <Trash2 size={18}/> Delete
                                    </button>
                                )}
                                <button className="flex-[2] bg-slate-900 text-white py-3 rounded-xl font-bold shadow-xl hover:bg-slate-800 transition">
                                    {modalType === 'edit_entry' ? 'Update Entry' : 'Confirm'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
             </div>
        )}

        {/* 3. PRO PROFILE MODAL (Existing code with rate logic) */}
        {viewingCustomer && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in">
            <div className="bg-white w-full max-w-lg rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden h-[85vh] md:h-auto md:max-h-[90vh] flex flex-col relative">
              <div className="bg-slate-900 text-white p-6 md:p-8 relative shrink-0">
                <button onClick={() => setViewingCustomer(null)} className="absolute top-6 right-6 bg-white/10 p-2 rounded-full hover:bg-white/20 z-20"><X size={20}/></button>
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none"><UserCheck size={120} /></div>
                <div className="relative z-10 mt-2">
                    <div className="flex justify-between items-start">
                        <div className="inline-block bg-blue-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3 shadow-lg">Consumer Profile</div>
                        <button onClick={switchToEditProfile} className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-white/20 transition border border-white/20">
                            <Edit2 size={12}/> Edit Details
                        </button>
                    </div>
                    <h2 className="text-3xl font-black leading-tight">{viewingCustomer.name}</h2>
                    
                    {/* SHOW CUSTOM RATE BADGE */}
                    {viewingCustomer.custom_rate && (
                        <div className="mt-2 inline-flex items-center gap-1.5 bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 px-3 py-1 rounded-full text-xs font-bold">
                            <Wallet size={12}/> Custom Rate Active: ₹{viewingCustomer.custom_rate}/jar
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-2 mt-4">
                        <div className="flex items-center gap-3 bg-white/10 p-2.5 rounded-xl border border-white/10 backdrop-blur-md">
                            <div className="bg-green-500/20 p-1.5 rounded-lg text-green-400"><Phone size={16}/></div>
                            <span className="font-mono font-bold text-sm tracking-wide">{viewingCustomer.mobile}</span>
                        </div>
                        <div className="flex items-center gap-3 bg-white/10 p-2.5 rounded-xl border border-white/10 backdrop-blur-md">
                            <div className="bg-blue-500/20 p-1.5 rounded-lg text-blue-400"><MapPin size={16}/></div>
                            <span className="font-bold text-sm leading-tight">{viewingCustomer.house_no ? `#${viewingCustomer.house_no}, ` : ''}{viewingCustomer.area || 'No Area'}</span>
                        </div>
                    </div>
                    <button onClick={handleAddEntryFromProfile} className="w-full mt-4 bg-white text-slate-900 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-50 transition shadow-lg">
                        <PlusCircle size={18} className="text-blue-600"/> Add New Filling
                    </button>
                </div>
              </div>
              <div className="overflow-y-auto custom-scrollbar flex-1 p-6 md:p-8">
                  <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">This Month</p>
                          <p className="text-2xl font-black text-slate-800">₹{customerStats.price}</p>
                      </div>
                      <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                          <p className="text-[10px] font-bold text-emerald-600 uppercase">Lifetime</p>
                          <p className="text-2xl font-black text-emerald-700">₹{customerStats.totalRevenue}</p>
                      </div>
                  </div>
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wide"><History size={16}/> Full History</h3>
                  <div className="space-y-3">
                      {customerHistory.map(e => (
                          <div key={e.id} className="flex justify-between items-center p-3 bg-white rounded-xl border border-slate-100 shadow-sm group">
                              <div className="flex items-center gap-3">
                                  <div className="bg-blue-50 p-2 rounded-lg text-blue-500"><Calendar size={14}/></div>
                                  <div>
                                      <p className="font-bold text-slate-800 text-sm">{e.date}</p>
                                      <p className="text-[10px] font-bold text-slate-400 uppercase">{e.qty} Jars</p>
                                  </div>
                              </div>
                              <div className="flex items-center gap-3">
                                  <span className="block font-black text-slate-800 text-sm">₹{e.price}</span>
                                  <button onClick={() => handleEditHistoryEntry(e)} className="p-2 text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition"><Edit2 size={14}/></button>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}