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
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Top-Left Dedicated Logo + Church Title */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            {/* Dedicated Circular Logo Box with Gold Aura */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/50 via-amber-300/40 to-amber-500/50 rounded-full blur-sm opacity-75 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative w-12 h-12 rounded-full bg-slate-950 p-1 border-2 border-amber-400/90 shadow-[0_0_18px_rgba(245,158,11,0.5)] flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-300">
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
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black font-sans tracking-tight bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(245,158,11,0.6)]">
                  Glorious Apostolic Church
                </h1>
                <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/60 shadow-[0_0_10px_rgba(245,158,11,0.3)]">
                  India Council
                </span>
              </div>
              <p className="text-xs text-amber-200/90 font-medium flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,1)] animate-pulse"></span>
                <span>Sunday Attendance &amp; QR Registration System</span>
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-950/60 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'home'
                  ? 'bg-gradient-to-r from-purple-700 to-indigo-800 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Church className="w-4 h-4 text-amber-400" />
              Home
            </button>

            <button
              onClick={() => setActiveTab('register')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'register'
                  ? 'bg-gradient-to-r from-purple-700 to-indigo-800 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <UserPlus className="w-4 h-4 text-amber-400" />
              Register Member
            </button>

            <button
              onClick={() => setActiveTab('visitor')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'visitor'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Heart className="w-4 h-4 text-rose-400" />
              New Visitor
            </button>

            <button
              onClick={() => setActiveTab('download_qr')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'download_qr'
                  ? 'bg-gradient-to-r from-purple-700 to-indigo-800 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <QrCode className="w-4 h-4 text-amber-400" />
              Download QR
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
                className="relative group overflow-hidden px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-purple-700 via-indigo-700 to-amber-600 shadow-glow-gold hover:shadow-glow-purple hover:scale-105 transition-all duration-300 border border-amber-400/40 flex items-center gap-2"
              >
                <Shield className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
                <span>Admin Login</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              </button>
            )}
          </div>

        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden items-center justify-around py-2.5 border-t border-slate-800 text-xs font-semibold">
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
