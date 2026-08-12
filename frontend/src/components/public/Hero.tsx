import React from 'react';
import { QrCode, UserPlus, Shield, CheckCircle, ArrowRight, Church, Sparkles, Smartphone, Download } from 'lucide-react';

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
    <div className="relative overflow-hidden bg-slate-950 text-white min-h-[85vh] flex flex-col justify-center">
      {/* Background Ambient Glow FX */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-purple-900/30 via-indigo-900/20 to-amber-500/20 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        
        {/* Header Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-semibold backdrop-blur-md shadow-glow-gold">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Glorious Apostolic Church India Council</span>
            <span className="hidden sm:inline text-slate-500">|</span>
            <span className="hidden sm:inline text-amber-400 font-bold">Sunday Attendance System</span>
          </div>
        </div>

        {/* Hero Title */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-sans text-white leading-tight">
            Seamless <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">QR Code</span> Registration &amp; Sunday Attendance
          </h1>
          <p className="mt-6 text-base sm:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
            Welcome church members and guests! Register once to receive your digital QR Badge (`REG-{new Date().getFullYear()}-XXXXX`). Scan every Sunday for instant check-in.
          </p>
        </div>

        {/* Main CTA Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          
          {/* Card 1: New Member Registration */}
          <div 
            onClick={onRegisterClick}
            className="group relative bg-slate-900/70 border border-purple-500/30 hover:border-amber-400/60 rounded-3xl p-8 backdrop-blur-xl shadow-glass hover:shadow-glass-hover hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-700 to-indigo-900 border border-purple-400/30 flex items-center justify-center mb-6 text-amber-400 group-hover:scale-110 transition-transform">
                <UserPlus className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                New Member Registration
              </h3>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                First time attending or updating details? Complete the quick form to automatically receive your permanent unique Registration ID and QR Badge.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-2 text-sm font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
              <span>Register Now</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 2: Download / Retrieve QR Code */}
          <div 
            onClick={onDownloadQrClick}
            className="group relative bg-slate-900/70 border border-indigo-500/30 hover:border-amber-400/60 rounded-3xl p-8 backdrop-blur-xl shadow-glass hover:shadow-glass-hover hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-800 to-blue-950 border border-indigo-400/30 flex items-center justify-center mb-6 text-amber-400 group-hover:scale-110 transition-transform">
                <QrCode className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                Download Existing QR Code
              </h3>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                Already registered? Search by your Registration ID or Mobile Number to view, save, download, or print your QR Badge.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-2 text-sm font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
              <span>Find My QR Badge</span>
              <Download className="w-4 h-4" />
            </div>
          </div>

          {/* Card 3: Admin Portal */}
          <div 
            onClick={onAdminClick}
            className="group relative bg-slate-900/70 border border-amber-500/30 hover:border-amber-400/80 rounded-3xl p-8 backdrop-blur-xl shadow-glass hover:shadow-glass-hover hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col justify-between md:col-span-2 lg:col-span-1"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-800 border border-amber-400/40 flex items-center justify-center mb-6 text-slate-950 font-black group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                Sunday Service Scanner & Admin
              </h3>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                Authorized church admins: Access the live Sunday camera scanner, attendance reports, member directory, and system statistics.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-2 text-sm font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
              <span>Admin Portal Login</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-16 pt-10 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto text-center">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-amber-400 mb-3 border border-slate-800">
              <CheckCircle className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Smart Duplicate Verification</h4>
            <p className="text-xs text-slate-400 mt-1">Checks Full Name + Mobile combination</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-purple-400 mb-3 border border-slate-800">
              <QrCode className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Sequential REG-{new Date().getFullYear()} IDs</h4>
            <p className="text-xs text-slate-400 mt-1">Auto generated non-repeating sequence</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-indigo-400 mb-3 border border-slate-800">
              <Smartphone className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Sunday Camera Scanner</h4>
            <p className="text-xs text-slate-400 mt-1">Instant check-in with audio confirmation</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-emerald-400 mb-3 border border-slate-800">
              <Shield className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Super Admin Approvals</h4>
            <p className="text-xs text-slate-400 mt-1">Role-based access & IST timestamps</p>
          </div>
        </div>

      </div>
    </div>
  );
};
