import React, { useState } from 'react';
import { Search, QrCode, Sparkles, AlertCircle } from 'lucide-react';
import { apiRequest } from '../../utils/api';
import { Member } from '../../types';
import { QRSuccessModal } from './QRSuccessModal';

export const QRDownloadSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [foundMember, setFoundMember] = useState<Member | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setError('Please enter your Registration ID or Mobile Number.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch member using search parameter
      const res = await apiRequest<{ success: boolean; member?: Member; message?: string }>(
        `/members/${encodeURIComponent(searchTerm.trim())}`
      );

      if (res.success && res.member) {
        setFoundMember(res.member);
      } else {
        setError(res.message || `No registered member found for "${searchTerm}".`);
      }
    } catch (err: any) {
      setError('Member not found. Please verify your Registration ID or Mobile Number.');
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
          <span>Member QR Code Lookup</span>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 font-sans tracking-tight">
          Retrieve &amp; Download Your QR Badge
        </h2>
        <p className="text-sm text-slate-600 mt-2">
          Enter your <span className="font-bold text-indigo-800">Registration ID (e.g. REG-2026-00001)</span> or <span className="font-bold text-indigo-800">10-digit Mobile Number</span> below.
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
              placeholder="e.g. REG-2026-00001 or 9876543210"
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
                <span>Search &amp; Generate QR Badge</span>
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
