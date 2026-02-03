import { Home, LayoutDashboard } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import saLogo from '../assets/sa-logo.png'; // Import here too

export default function Navbar() {
  const loc = useLocation();
  
  const links = [
    { name: 'Consumer', path: '/', icon: <Home size={24}/> },
    { name: 'Admin', path: '/admin', icon: <LayoutDashboard size={24}/> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t md:relative md:w-64 md:min-h-screen md:border-t-0 md:border-r z-50 flex md:flex-col shadow-[0_-5px_20px_rgba(0,0,0,0.05)] md:shadow-none">
      
      {/* PC LOGO DISPLAY */}
      <div className="hidden md:flex flex-col items-center gap-2 p-8 text-blue-600 font-black text-2xl border-b border-slate-50">
        <img src={saLogo} alt="S.A. Logo" className="w-24 h-auto" />
      </div>
      
      {/* Links */}
      <div className="flex md:flex-col justify-around md:justify-start w-full p-2 md:p-4 gap-2">
        {links.map(link => (
          <Link 
            key={link.path} 
            to={link.path} 
            className={`flex flex-col md:flex-row items-center gap-2 p-3 md:px-6 md:py-4 rounded-xl transition-all duration-200 ${
              loc.pathname === link.path 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
              : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            {link.icon}
            <span className="text-xs md:text-base font-bold">{link.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}