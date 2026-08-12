import React, { useState } from 'react';
import { Search, QrCode, Sparkles, AlertCircle, ShieldAlert, Lock, LogIn } from 'lucide-react';
import { apiRequest } from '../../utils/api';
import { AdminUser, Member } from '../../types';
import { QRSuccessModal } from './QRSuccessModal';

interface QRDownloadSearchProps {
  adminUser: AdminUser | null;
  onAdminLoginClick: () => void;
}

export const QRDownloadSearch: React.FC<QRDownloadSearchProps> = ({ adminUser, onAdminLoginClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [foundMember, setFoundMember] = useState<Member | null>(null);

  // If not an admin, show access denied
  if (!adminUser) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 flex flex-col items-center text-center">
        {/* Icon */}
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-900 via-indigo-900 to-amber-700 flex items-center justify-center shadow-2xl mb-6 relative">
          <Lock className="w-10 h-10 text-amber-300" />
          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-rose-600 flex items-center justify-center border-2 border-white">
            <ShieldAlert className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Title */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100 text-rose-800 font-semibold text-xs mb-4 border border-rose-200">
          <ShieldAlert className="w-4 h-4 text-rose-600" />
          <span>Admin Access Required</span>
        </div>

        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
          QR Badge Download
        </h2>
        <p className="text-slate-500 text-sm max-w-md mb-8 leading-relaxed">
          Downloading member QR badges is restricted to <span className="font-bold text-indigo-800">Church Administrators</span> only. 
          If you are an admin, please log in to access this feature.
        </p>

        {/* Divider */}
        <div className="w-full max-w-xs border-t border-slate-200 mb-8" />

        {/* Info box */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 max-w-md w-full text-left mb-8">
          <p className="text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">📋 For Members</p>
          <p className="text-amber-700 text-sm leading-relaxed">
            Your QR badge was sent to you upon registration. Please contact the church office or your admin if you need a copy of your QR code.
          </p>
        </div>

        {/* Login Button */}
        <button
          onClick={onAdminLoginClick}
          className="flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-white text-sm bg-gradient-to-r from-indigo-800 via-purple-800 to-amber-600 hover:from-indigo-900 hover:to-amber-700 shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <LogIn className="w-5 h-5 text-amber-300" />
          <span>Admin Login to Download QR</span>
        </button>
      </div>
    );
  }

  // Admin is logged in — show the QR search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setError('Please enter a Registration ID or Mobile Number.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Use the admin-authenticated endpoint to fetch full member details
      const res = await apiRequest<{ success: boolean; member?: Member; message?: string }>(
        `/members/${encodeURIComponent(searchTerm.trim())}`
      );

      if (res.success && res.member) {
        setFoundMember(res.member);
      } else {
        setError(res.message || `No registered member found for "${searchTerm}".`);
      }
    } catch (err: any) {
      setError('Member not found. Please verify the Registration ID or Mobile Number.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-900 font-semibold text-xs mb-3 border border-indigo-200">
          <QrCode className="w-4 h-4 text-indigo-700" />
          <span>Admin — Member QR Code Download</span>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 font-sans tracking-tight">
          Generate & Download Member QR Badge
        </h2>
        <p className="text-sm text-slate-600 mt-2">
          Enter a <span className="font-bold text-indigo-800">Registration ID (e.g. REG-{new Date().getFullYear()}-00001)</span> or <span className="font-bold text-indigo-800">10-digit Mobile Number</span> to generate the badge.
        </p>
      </div>

      {/* Search Card */}
      <div className="bg-white rounded-3xl p-8 shadow-card-elevate border border-slate-200">

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`e.g. REG-${new Date().getFullYear()}-00001 or 9876543210`}
              className="w-full px-5 py-4 pl-12 rounded-2xl bg-slate-50 border-2 border-slate-200 focus:border-indigo-600 focus:bg-white text-base font-bold text-slate-900 outline-none transition-all"
            />
            <Search className="absolute left-4 top-4.5 w-5 h-5 text-slate-400" />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl font-bold text-white text-base bg-gradient-to-r from-indigo-800 via-purple-800 to-amber-600 hover:from-indigo-900 hover:to-amber-700 shadow-glow-gold hover:scale-[1.01] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>Search & Generate QR Badge</span>
              </>
            )}
          </button>
        </form>

      </div>

      {/* Render Badge Modal when found */}
      {foundMember && (
        <QRSuccessModal
          member={foundMember}
          onClose={() => setFoundMember(null)}
        />
      )}

    </div>
  );
};
