import React from 'react';
import { Church, QrCode, UserPlus, Shield, Sparkles, LogOut, CheckCircle2, UserCheck } from 'lucide-react';
import { AdminUser } from '../../types';

interface NavbarProps {
  activeTab: 'home' | 'register' | 'download_qr' | 'scanner' | 'admin_dashboard';
  setActiveTab: (tab: 'home' | 'register' | 'download_qr' | 'scanner' | 'admin_dashboard') => void;
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
          
          {/* Top-Left Dedicated Logo Placeholder + Church Title */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            {/* Dedicated Logo Placeholder Box */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-900 via-purple-900 to-amber-600 p-[2px] shadow-glow-gold group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center relative overflow-hidden border border-amber-500/30">
                <Church className="w-6 h-6 text-amber-400 group-hover:rotate-6 transition-transform" />
                <span className="absolute -bottom-1 text-[8px] font-bold text-amber-300 tracking-tighter opacity-80 uppercase">LOGO</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base sm:text-lg font-bold font-sans tracking-tight text-white group-hover:text-amber-400 transition-colors">
                  Glorious Apostolic Church
                </h1>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  India Council
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Sunday Attendance & QR Registration System
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
