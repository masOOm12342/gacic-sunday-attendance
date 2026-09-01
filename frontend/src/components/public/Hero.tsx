import React from 'react';
import { QrCode, UserPlus, Shield, CheckCircle, ArrowRight, Sparkles, Smartphone, Download } from 'lucide-react';

interface HeroProps {
  onRegisterClick: () => void;
  onDownloadQrClick: () => void;
  onAdminClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onRegisterClick,
  onDownloadQrClick,
  onAdminClick,
}) => {
  return (
    <div className="relative overflow-hidden bg-[#060D1A] text-white min-h-[90vh] flex flex-col justify-center font-sans">
      {/* Background Multi-Layer Ambient Luxury Glow FX */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-purple-900/25 via-indigo-900/25 to-amber-500/20 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        
        {/* Top Logo Emblem & Glow */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="relative mb-4 group cursor-default">
            <div className="absolute -inset-2 bg-gradient-to-r from-amber-500/40 via-purple-600/40 to-amber-500/40 rounded-full blur-lg opacity-70 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-950 p-1.5 border-2 border-amber-400/60 shadow-[0_0_30px_rgba(245,158,11,0.35)] flex items-center justify-center overflow-hidden">
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

          {/* Prominent & Premium "WELCOME TO" Banner (Exact Golden Capsule Style) */}
          <div className="flex items-center justify-center gap-3 sm:gap-5 my-3 w-full max-w-2xl px-4">
            <div className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent via-amber-400/60 to-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
            <div className="flex items-center gap-3 px-6 sm:px-8 py-2 sm:py-2.5 rounded-full bg-[#0a101d]/90 border border-amber-400/80 shadow-[0_0_30px_rgba(245,158,11,0.35)] backdrop-blur-md">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 animate-pulse" />
              <span className="text-sm sm:text-lg md:text-xl font-black tracking-[0.25em] sm:tracking-[0.35em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 drop-shadow-[0_0_12px_rgba(245,158,11,0.7)]">
                WELCOME TO
              </span>
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 animate-pulse" />
            </div>
            <div className="h-[1.5px] flex-1 bg-gradient-to-l from-transparent via-amber-400/60 to-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
          </div>
        </div>

        {/* Hero Title */}
        <div className="text-center max-w-5xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight font-sans text-white leading-tight">
            <span className="block text-2xl sm:text-4xl lg:text-5xl font-black text-white drop-shadow-md mb-2 sm:mb-3">
              Glorious Apostolic Church India Council
            </span>
            <span className="block text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white">
              <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(245,158,11,0.3)]">
                QR Code
              </span>{' '}
              Registration &amp; Sunday Attendance
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-300 font-normal leading-relaxed max-w-3xl mx-auto">
            Experience our next-generation digital church badging and Sunday service check-in portal. Register once to receive your digital QR Badge for seamless, instant weekly attendance.
          </p>
        </div>

        {/* Main CTA Cards */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          
          {/* Card 1: New Member Registration */}
          <div 
            onClick={onRegisterClick}
            className="group relative bg-slate-900/80 border border-purple-500/30 hover:border-amber-400/80 rounded-3xl p-8 backdrop-blur-xl shadow-glass hover:shadow-[0_10px_35px_rgba(245,158,11,0.15)] hover:-translate-y-2 transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-700 to-indigo-900 border border-purple-400/40 flex items-center justify-center mb-6 text-amber-400 group-hover:scale-110 shadow-lg transition-transform">
                <UserPlus className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                New Member Registration
              </h3>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                First time attending or updating details? Complete the quick form to automatically receive your permanent unique Registration ID and QR Badge.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-2 text-sm font-bold text-amber-400 group-hover:translate-x-1.5 transition-transform">
              <span>Register Now</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 2: Download / Retrieve QR Code */}
          <div 
            onClick={onDownloadQrClick}
            className="group relative bg-slate-900/80 border border-indigo-500/30 hover:border-amber-400/80 rounded-3xl p-8 backdrop-blur-xl shadow-glass hover:shadow-[0_10px_35px_rgba(245,158,11,0.15)] hover:-translate-y-2 transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-800 to-blue-950 border border-indigo-400/40 flex items-center justify-center mb-6 text-amber-400 group-hover:scale-110 shadow-lg transition-transform">
                <QrCode className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                Download Existing QR Code
              </h3>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                Already registered? Search by your Registration ID or Mobile Number to view, save, download as PNG, or print your QR Badge.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-2 text-sm font-bold text-amber-400 group-hover:translate-x-1.5 transition-transform">
              <span>Find My QR Badge</span>
              <Download className="w-4 h-4" />
            </div>
          </div>

          {/* Card 3: Admin Portal */}
          <div 
            onClick={onAdminClick}
            className="group relative bg-slate-900/80 border border-amber-500/30 hover:border-amber-400 rounded-3xl p-8 backdrop-blur-xl shadow-glass hover:shadow-[0_10px_35px_rgba(245,158,11,0.25)] hover:-translate-y-2 transition-all duration-300 cursor-pointer flex flex-col justify-between md:col-span-2 lg:col-span-1"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 border border-amber-300/40 flex items-center justify-center mb-6 text-slate-950 font-black group-hover:scale-110 shadow-lg transition-transform">
                <Shield className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                Sunday Service Scanner &amp; Admin
              </h3>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                Authorized church admins: Access the live Sunday camera scanner, attendance logs, visitor records, and member directory.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-2 text-sm font-bold text-amber-400 group-hover:translate-x-1.5 transition-transform">
              <span>Admin Portal Login</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-16 pt-10 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto text-center">
          <div className="flex flex-col items-center">
            <div className="w-11 h-11 rounded-full bg-slate-900 flex items-center justify-center text-amber-400 mb-3 border border-amber-500/20 shadow-md">
              <CheckCircle className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Smart Duplicate Verification</h4>
            <p className="text-xs text-slate-400 mt-1">Checks Full Name + Mobile combination</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-11 h-11 rounded-full bg-slate-900 flex items-center justify-center text-purple-400 mb-3 border border-purple-500/20 shadow-md">
              <QrCode className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Sequential REG-{new Date().getFullYear()} IDs</h4>
            <p className="text-xs text-slate-400 mt-1">Auto generated non-repeating sequence</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-11 h-11 rounded-full bg-slate-900 flex items-center justify-center text-indigo-400 mb-3 border border-indigo-500/20 shadow-md">
              <Smartphone className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Sunday Camera Scanner</h4>
            <p className="text-xs text-slate-400 mt-1">Instant check-in with audio chime confirmation</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-11 h-11 rounded-full bg-slate-900 flex items-center justify-center text-emerald-400 mb-3 border border-emerald-500/20 shadow-md">
              <Shield className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Super Admin Approvals</h4>
            <p className="text-xs text-slate-400 mt-1">Role-based access &amp; IST timestamps</p>
          </div>
        </div>

      </div>
    </div>
  );
};
