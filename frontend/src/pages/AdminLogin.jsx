import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { User, Lock, Eye, EyeOff, ArrowRight, ChevronLeft, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';
import saLogo from '../assets/logo.png'; 

export default function AdminLogin() {
    const [creds, setCreds] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [greeting, setGreeting] = useState('Welcome Back');
    
    const { loginAdmin } = useApp();
    const navigate = useNavigate();

    // 1. Time-Aware Greeting Logic
    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 18) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        
        if (!creds.username.trim() || !creds.password.trim()) {
            setError('Please enter both username and password.');
            return;
        }

        setIsLoading(true);
        setError('');

        // Simulate network delay for smooth UX
        setTimeout(() => {
            if (loginAdmin(creds.username, creds.password)) {
                navigate('/admin-dashboard');
            } else {
                setError('Invalid credentials. Access denied.');
                setIsLoading(false);
            }
        }, 1000); 
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-blue-500 selection:text-white">
            
            {/* --- ANIMATED BACKGROUND (Dark Theme for Admin) --- */}
            {/* Gradient Blob 1 */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
            {/* Gradient Blob 2 */}
            <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse pointer-events-none delay-700"></div>

            {/* --- BACK LINK --- */}
            <button 
                onClick={() => navigate('/')} 
                className="absolute top-8 left-6 md:left-12 flex items-center gap-2 text-slate-400 hover:text-white transition font-bold text-sm z-20 group"
            >
                <div className="bg-white/10 p-2 rounded-full border border-white/10 group-hover:bg-white/20 transition">
                    <ChevronLeft size={16} />
                </div>
                <span className="opacity-70 group-hover:opacity-100 transition">Back home</span>
            </button>

            {/* --- GLASS CARD --- */}
            <div className="bg-slate-800/60 backdrop-blur-2xl w-full max-w-md p-8 md:p-10 rounded-[2.5rem] shadow-[0_40px_100px_-15px_rgba(0,0,0,0.5)] border border-white/10 relative z-10 animate-in fade-in zoom-in duration-500">
                
                {/* Logo & Header */}
                <div className="text-center mb-8">
                    <div className="inline-block relative">
                         {/* Glowing effect behind logo */}
                        <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 rounded-full"></div>
                        <img 
                            src={saLogo} 
                            alt="Logo" 
                            className="w-20 h-20 object-contain relative z-10 drop-shadow-xl mb-4 hover:scale-110 transition-transform duration-300" 
                        />
                    </div>
                    <div className="flex items-center justify-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-widest mb-2">
                        <ShieldCheck size={12} /> {greeting}, Boss
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tight">Admin Portal</h2>
                    <p className="text-slate-400 text-sm mt-2">Secure access for management</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-6">
                    
                    {/* Username Field */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase ml-2">Username</label>
                        <div className="relative group transition-all">
                            <div className={`absolute inset-0 bg-blue-500 rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition duration-500`}></div>
                            <div className="relative bg-slate-900/50 border border-slate-700 rounded-2xl flex items-center p-1 focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500 transition-all shadow-inner">
                                <div className="p-3 text-slate-500 group-focus-within:text-blue-400 transition-colors">
                                    <User size={20} />
                                </div>
                                <input
                                    autoFocus
                                    className="w-full bg-transparent outline-none font-semibold text-white placeholder:text-slate-600 placeholder:font-normal h-full py-2"
                                    placeholder="Enter Username"
                                    value={creds.username}
                                    onChange={e => { setCreds({ ...creds, username: e.target.value }); setError(''); }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase ml-2">Password</label>
                        <div className="relative group transition-all">
                            <div className={`absolute inset-0 bg-blue-500 rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition duration-500`}></div>
                            <div className="relative bg-slate-900/50 border border-slate-700 rounded-2xl flex items-center p-1 focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500 transition-all shadow-inner">
                                <div className="p-3 text-slate-500 group-focus-within:text-blue-400 transition-colors">
                                    <Lock size={20} />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="w-full bg-transparent outline-none font-bold text-lg text-white tracking-wide placeholder:text-slate-600 placeholder:font-normal placeholder:tracking-normal h-full py-2"
                                    placeholder="••••••••"
                                    value={creds.password}
                                    onChange={e => { setCreds({ ...creds, password: e.target.value }); setError(''); }}
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="p-3 text-slate-500 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="flex items-center gap-2 text-red-400 text-xs font-bold bg-red-500/10 p-3 rounded-xl border border-red-500/20 animate-in slide-in-from-top-1">
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button 
                        disabled={isLoading}
                        className="w-full relative overflow-hidden group bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-900/20 hover:bg-blue-500 transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-wait"
                    >
                        {/* Gradient Hover Effect */}
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                        
                        <div className="relative flex items-center justify-center gap-2">
                            {isLoading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" /> 
                                    <span>Verifying Access...</span>
                                </>
                            ) : (
                                <>
                                    <span>Secure Login</span>
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </div>
                    </button>
                </form>
            </div>
            
            {/* Footer Text */}
            <div className="absolute bottom-6 text-center w-full">
                <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest opacity-60">S.A. Enterprises • Management Console</p>
            </div>
            <div className="absolute bottom-10 text-center w-full">
                <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest opacity-60">App Version 1.0</p>
            </div>
        </div>
    );
}