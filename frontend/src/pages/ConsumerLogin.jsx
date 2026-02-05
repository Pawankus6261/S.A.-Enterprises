import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { User, Smartphone, ArrowRight, ChevronLeft, AlertCircle, CheckCircle2, Loader2, Sparkles, Fingerprint, ShieldCheck, Lock } from 'lucide-react';
import saLogo from '../assets/LOGO.png'; 

export default function ConsumerLogin() {
    // 1. GET DATA
    // We access 'consumers' (from registration) AND 'entries' (historical logs)
    // to build a master list of allowed users.
    const { loginConsumer, consumers, entries } = useApp(); 
    const navigate = useNavigate();

    const [data, setData] = useState({ name: '', mobile: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [greeting, setGreeting] = useState('Welcome Back');
    const [isVerified, setIsVerified] = useState(false);

    // 2. TIME GREETING
    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 18) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');
    }, []);

    // 3. BUILD ALLOWED USER LIST (Memoized for performance)
    const allowedUsers = useMemo(() => {
        const map = new Map();
        // Add from Registered List
        if (consumers) consumers.forEach(c => map.set(c.mobile, c.name));
        // Add from Historical Entries (Legacy support)
        if (entries) entries.forEach(e => map.set(e.mobile, e.name));
        return map;
    }, [consumers, entries]);

    // 4. INPUT HANDLER
    const handleMobileChange = (e) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length > 10) val = val.slice(0, 10);
        
        let formatted = val;
        if (val.length > 5) formatted = val.slice(0, 5) + ' ' + val.slice(5);

        // CHECK IF USER EXISTS
        if (val.length === 10) {
            const foundName = allowedUsers.get(val);
            if (foundName) {
                // SUCCESS: User Found
                setData({ name: foundName, mobile: formatted });
                setIsVerified(true);
                setError('');
                return;
            } else {
                // FAIL: User Not Found (We don't show error immediately while typing, but we don't verify)
                setIsVerified(false);
            }
        } else {
            setIsVerified(false);
        }

        // Keep name empty if not verified so they can't fake it, 
        // OR let them type if you want, but we will block on submit.
        // Here we reset name if verification fails to enforce strictness.
        if (!isVerified) {
             setData(prev => ({ ...prev, name: '', mobile: formatted }));
        } else {
             setData(prev => ({ ...prev, mobile: formatted }));
        }
        
        setError('');
    };

    const handleLogin = (e) => {
        e.preventDefault();
        const cleanMobile = data.mobile.replace(/\s/g, '');

        // STRICT CHECK ON SUBMIT
        if (!allowedUsers.has(cleanMobile)) {
            setError('Access Denied: Mobile number not registered in system.');
            return;
        }

        if (!data.name.trim()) {
            setError('System Error: Name not retrieved.'); // Should not happen if logic is correct
            return;
        }

        setIsLoading(true);
        setTimeout(() => {
            loginConsumer(data.name, cleanMobile);
            navigate('/consumer-dashboard');
        }, 1000); 
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-blue-200">
            
            {/* --- ANIMATED BACKGROUND --- */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-300/30 rounded-full blur-[100px] animate-pulse pointer-events-none"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-cyan-300/30 rounded-full blur-[100px] animate-pulse pointer-events-none delay-700"></div>

            {/* --- BACK LINK --- */}
            <button 
                onClick={() => navigate('/')} 
                className="absolute top-8 left-6 md:left-12 flex items-center gap-2 text-slate-500 hover:text-blue-600 transition font-bold text-sm z-20 group"
            >
                <div className="bg-white p-2 rounded-full shadow-sm border border-slate-100 group-hover:border-blue-200 transition">
                    <ChevronLeft size={16} />
                </div>
                <span className="opacity-70 group-hover:opacity-100 transition">Back home</span>
            </button>

            {/* --- GLASS CARD --- */}
            <div className={`bg-white/80 backdrop-blur-2xl w-full max-w-md p-8 md:p-10 rounded-[2.5rem] shadow-[0_40px_100px_-15px_rgba(0,0,0,0.1)] border border-white relative z-10 animate-in fade-in zoom-in duration-500 transition-all ${isVerified ? 'shadow-green-200/50 border-green-200' : ''}`}>
                
                {/* Logo & Header */}
                <div className="text-center mb-8">
                    <div className="inline-block relative">
                        <div className={`absolute inset-0 blur-2xl opacity-20 rounded-full transition-colors duration-500 ${isVerified ? 'bg-green-500' : 'bg-blue-400'}`}></div>
                        <img 
                            src={saLogo} 
                            alt="Logo" 
                            className="w-20 h-20 object-contain relative z-10 drop-shadow-lg mb-4 hover:scale-110 transition-transform duration-300" 
                        />
                    </div>
                    <div className="flex items-center justify-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest mb-2">
                        <Sparkles size={12} /> {greeting}
                    </div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Consumer Portal</h2>
                    
                    {isVerified ? (
                        <p className="text-green-600 font-bold text-sm mt-2 flex items-center justify-center gap-1 animate-in slide-in-from-bottom-1">
                            <ShieldCheck size={16}/> Identity Verified
                        </p>
                    ) : (
                        <p className="text-slate-400 text-sm mt-2">Enter Registered Mobile Number</p>
                    )}
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-6">
                    
                    {/* Mobile Field */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase ml-2 flex justify-between">
                            Mobile Number
                            {isVerified && <span className="text-green-600 flex items-center gap-1"><Sparkles size={10}/> Account Found</span>}
                        </label>
                        <div className="relative group transition-all">
                            {/* Glow Effect */}
                            <div className={`absolute inset-0 rounded-2xl blur opacity-0 group-focus-within:opacity-50 transition duration-500 ${isVerified ? 'bg-green-200' : 'bg-blue-100'}`}></div>
                            
                            <div className={`relative bg-white border rounded-2xl flex items-center p-1 transition-all shadow-sm 
                                ${error ? 'border-red-300 ring-4 ring-red-50' : 'border-slate-200 focus-within:ring-4 focus-within:ring-blue-50 focus-within:border-blue-400'}
                                ${isVerified ? '!border-green-400 !ring-green-50' : ''}
                            `}>
                                <div className={`p-3 transition-colors ${isVerified ? 'text-green-500' : 'text-slate-400 group-focus-within:text-blue-500'}`}>
                                    <Smartphone size={20} />
                                </div>
                                <input
                                    autoFocus
                                    type="tel"
                                    className="w-full bg-transparent outline-none font-bold text-lg text-slate-800 tracking-wide placeholder:text-slate-300 placeholder:font-normal placeholder:tracking-normal h-full py-2"
                                    placeholder="98765 00000"
                                    value={data.mobile}
                                    onChange={handleMobileChange}
                                />
                                {isVerified && (
                                    <div className="pr-4 animate-in zoom-in duration-300">
                                        <CheckCircle2 size={20} className="text-green-500 fill-green-100" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Name Field (READ ONLY - Automatically Filled) */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase ml-2">Full Name</label>
                        <div className="relative group transition-all">
                            <div className={`absolute inset-0 bg-blue-100 rounded-2xl blur opacity-0 group-focus-within:opacity-50 transition duration-500`}></div>
                            <div className={`relative bg-slate-50 border border-slate-200 rounded-2xl flex items-center p-1 transition-all shadow-sm ${isVerified ? 'bg-blue-50/30' : 'opacity-60 cursor-not-allowed'}`}>
                                <div className="p-3 text-slate-400">
                                    {isVerified ? <Fingerprint size={20} className="text-blue-500"/> : <Lock size={20} />}
                                </div>
                                <input
                                    disabled // Prevent Manual Editing
                                    className="w-full bg-transparent outline-none font-semibold text-slate-700 placeholder:text-slate-400 placeholder:font-medium h-full py-2 disabled:cursor-not-allowed"
                                    placeholder="Waiting for number..."
                                    value={data.name}
                                    readOnly
                                />
                            </div>
                        </div>
                        {isVerified && <p className="text-[10px] text-blue-400 font-bold uppercase ml-2 animate-in slide-in-from-top-1">Auto-retrieved from database</p>}
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="flex items-center gap-2 text-red-500 text-xs font-bold bg-red-50 p-3 rounded-xl border border-red-100 animate-in slide-in-from-top-1">
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Submit Button (Only Active if Verified) */}
                    <button 
                        disabled={isLoading || !isVerified} // STRICT: Disable if not valid
                        className={`w-full relative overflow-hidden group text-white py-4 rounded-2xl font-bold shadow-xl flex items-center justify-center gap-2 transform active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed
                            ${isVerified ? 'bg-green-600 hover:bg-green-700 shadow-green-200' : 'bg-slate-400 shadow-none'}
                        `}
                    >
                        {/* Gradient Hover Effect */}
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        <div className="relative flex items-center justify-center gap-2">
                            {isLoading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" /> 
                                    <span>Verifying Access...</span>
                                </>
                            ) : (
                                <>
                                    {isVerified ? (
                                        <><span>Access Dashboard</span> <ArrowRight size={20} /></>
                                    ) : (
                                        <><Lock size={16} /> <span>Enter Registered Number</span></>
                                    )}
                                </>
                            )}
                        </div>
                    </button>
                </form>
            </div>
            
            {/* Footer Text */}
            <div className="absolute bottom-6 text-center w-full">
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest opacity-60">Authorized Access Only</p>
            </div>
            <div className="absolute bottom-10 text-center w-full">
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest opacity-60">App Version 1.0</p>
            </div>
        </div>
    );
}