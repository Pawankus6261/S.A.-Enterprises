import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Lock, Droplets } from 'lucide-react';
import saLogo from '../assets/LOGO.png'; 

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    // Added a subtle overall page gradient
    <div className="min-h-screen bg-gradient-to-br from-[#f0f9ff] to-[#e6f4fa] font-sans relative overflow-hidden flex flex-col items-center justify-center p-6">
      
      {/* --- ENHANCED GRADIENT BACKGROUNDS --- */}
      {/* Top-left gradient blob */}
      <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full blur-[120px] animate-pulse pointer-events-none z-0"></div>
      {/* Bottom-right gradient blob */}
      <div className="absolute bottom-[-20%] right-[-20%] w-[600px] h-[600px] bg-gradient-to-tl from-cyan-400/30 to-emerald-400/30 rounded-full blur-[120px] animate-pulse pointer-events-none z-0 delay-1000"></div>

      {/* --- 1. TOP RIGHT: STAFF LOGIN --- */}
      <div className="absolute top-6 right-6 z-20">
        <button 
            onClick={() => navigate('/admin-login')}
            className="flex items-center gap-2 bg-white/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/40 text-slate-600 hover:text-blue-700 hover:bg-white/80 transition-all text-[10px] font-bold uppercase tracking-widest shadow-sm hover:shadow-md"
        >
            <Lock size={12} /> Staff Login
        </button>
      </div>

      {/* --- MAIN CENTER CONTENT --- */}
      <div className="relative z-10 w-full max-w-sm text-center flex flex-col items-center animate-in zoom-in-95 duration-700">
        
        {/* 2. TRANSPARENT LOGO WITH STRONG GRADIENT GLOW */}
        <div className="relative mb-8 filter drop-shadow-2xl group">
            {/* The new gradient halo behind the logo */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500 animate-pulse"></div>
            <img 
                src={saLogo} 
                alt="S.A. Enterprises" 
                // Increased size slightly to stand out against the new glow
                className="w-44 h-44 object-contain relative z-10 transform group-hover:scale-110 transition-transform duration-500" 
            />
        </div>

        {/* 3. NAME (With subtle gradient text) */}
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-slate-900 to-blue-900 tracking-tight leading-none mb-3">
          S.A. ENTERPRISES
        </h1>

        {/* 4. CATCHY TAGLINE */}
        <div className="flex items-center gap-3 mb-8">
            <div className="h-px w-8 bg-blue-200/50"></div>
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 font-bold text-sm uppercase tracking-[0.15em]">
                Pure Water. Pure Life.
            </p>
            <div className="h-px w-8 bg-blue-200/50"></div>
        </div>

        {/* 5. WORD FOR CONSUMERS */}
        <p className="text-slate-600 text-sm leading-relaxed font-medium mb-10 px-6 md:px-0 max-w-xs">
            Welcome to your personal water portal. Track supplies, view history, and manage bills instantly.
        </p>

        {/* 6. TRACK / LOGIN BUTTON (Enhanced Gradient & Shadow) */}
        <button 
            onClick={() => navigate('/consumer-login')}
            className="group relative w-full bg-gradient-to-r from-slate-900 to-blue-900 hover:from-blue-700 hover:to-cyan-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-blue-900/20 hover:shadow-blue-500/40 transition-all duration-500 transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 overflow-hidden"
        >
            {/* Subtle shine effect on hover */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            
            <div className="bg-white/20 p-1.5 rounded-lg group-hover:rotate-12 transition-transform relative z-10">
                <Droplets size={20} className="fill-white text-white"/>
            </div>
            <span className="relative z-10">Track My Supply</span>
            <ChevronRight size={20} className="opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all relative z-10"/>
        </button>

      </div>

      {/* --- 7. FOOTER: VERSION --- */}
      <div className="absolute bottom-6 text-center w-full z-10">
         <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] opacity-70">
            App Version 1.0
         </p>
      </div>

    </div>
  );
}