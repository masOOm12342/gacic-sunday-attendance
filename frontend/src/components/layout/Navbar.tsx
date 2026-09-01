import React from 'react';
import { Church, QrCode, UserPlus, Shield, Sparkles, LogOut, Heart } from 'lucide-react';
import { AdminUser } from '../../types';

interface NavbarProps {
  activeTab: 'home' | 'register' | 'visitor' | 'download_qr' | 'scanner' | 'admin_dashboard';
  setActiveTab: (tab: 'home' | 'register' | 'visitor' | 'download_qr' | 'scanner' | 'admin_dashboard') => void;
  adminUser: AdminUser | null;
  onAdminLoginClick: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  adminUser,
  onAdminLoginClick,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#131B2E] backdrop-blur-md border-b border-slate-800 text-white shadow-lg font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Top-Left Logo + Full Church Title (Written Together) */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            {/* Circular Logo with Gold Border Ring */}
            <div className="relative flex-shrink-0">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-slate-950 p-0.5 border-2 border-amber-500 shadow-[0_0_14px_rgba(245,158,11,0.35)] flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-300">
                <img
                  src="/logo.png"
                  alt="GACIC Logo"
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            </div>

            <div>
              <h1 className="text-sm sm:text-base md:text-[17px] font-extrabold font-sans tracking-tight text-white group-hover:text-amber-300 transition-colors leading-tight">
                Glorious Apostolic Church India Council
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Sunday Attendance &amp; QR Registration System</span>
              </p>
            </div>
          </div>

          {/* Center Navigation Links Pill Container */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#0A0F1D] px-2 py-1.5 rounded-2xl border border-slate-800/90 shadow-inner">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'home'
                  ? 'bg-[#5833EA] text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Church className="w-4 h-4 text-amber-400" />
              <span>Home</span>
            </button>

            <button
              onClick={() => setActiveTab('register')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'register'
                  ? 'bg-[#5833EA] text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <UserPlus className="w-4 h-4 text-amber-400" />
              <span>Register Member</span>
            </button>

            <button
              onClick={() => setActiveTab('visitor')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'visitor'
                  ? 'bg-[#5833EA] text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Heart className="w-4 h-4 text-rose-400" />
              <span>New Visitor</span>
            </button>

            <button
              onClick={() => setActiveTab('download_qr')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'download_qr'
                  ? 'bg-[#5833EA] text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <QrCode className="w-4 h-4 text-amber-400" />
              <span>Download QR</span>
            </button>
          </nav>

          {/* Top-Right Admin Action Button */}
          <div className="flex items-center gap-3">
            {adminUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('admin_dashboard')}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-lg flex items-center gap-2 border ${
                    activeTab === 'admin_dashboard'
                      ? 'bg-amber-500 text-slate-950 border-amber-400 ring-2 ring-amber-400/30'
                      : 'bg-gradient-to-r from-purple-900 to-indigo-900 text-amber-300 border-purple-500/40 hover:border-amber-400/60'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin Dashboard</span>
                  {adminUser.role === 'SUPER_ADMIN' && (
                    <span className="bg-amber-400 text-slate-950 text-[9px] px-1.5 py-0.5 rounded font-black">SUPER</span>
                  )}
                </button>

                <button
                  onClick={onLogout}
                  title="Logout Admin"
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 border border-slate-700 hover:border-red-500/40 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onAdminLoginClick}
                className="relative group overflow-hidden px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#6D28D9] via-[#8B5CF6] to-[#EA580C] shadow-lg hover:scale-105 transition-all duration-300 border border-purple-400/30 flex items-center gap-2"
              >
                <Shield className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
                <span>Admin Login</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              </button>
            )}
          </div>

        </div>

        {/* Mobile Navigation Row */}
        <div className="flex lg:hidden items-center justify-around py-2.5 border-t border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-amber-400' : 'text-slate-400'}`}
          >
            <Church className="w-4 h-4" />
            <span>Home</span>
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'register' ? 'text-amber-400' : 'text-slate-400'}`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Register</span>
          </button>
          <button
            onClick={() => setActiveTab('visitor')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'visitor' ? 'text-emerald-400' : 'text-slate-400'}`}
          >
            <Heart className="w-4 h-4" />
            <span>Visitor</span>
          </button>
          <button
            onClick={() => setActiveTab('download_qr')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'download_qr' ? 'text-amber-400' : 'text-slate-400'}`}
          >
            <QrCode className="w-4 h-4" />
            <span>QR Code</span>
          </button>
          {adminUser && (
            <button
              onClick={() => setActiveTab('admin_dashboard')}
              className={`flex flex-col items-center gap-1 ${activeTab === 'admin_dashboard' ? 'text-amber-400' : 'text-slate-400'}`}
            >
              <Shield className="w-4 h-4" />
              <span>Admin</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
