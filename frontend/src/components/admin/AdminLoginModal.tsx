import React, { useState } from 'react';
import { Shield, Lock, Mail, X, AlertTriangle, ArrowRight, UserPlus, Sparkles } from 'lucide-react';
import { apiRequest, setAuthToken } from '../../utils/api';
import { AdminUser } from '../../types';

interface AdminLoginModalProps {
  onClose: () => void;
  onLoginSuccess: (user: AdminUser) => void;
  onRequestAccessClick: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  onClose,
  onLoginSuccess,
  onRequestAccessClick,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await apiRequest<{
        success: boolean;
        message?: string;
        token?: string;
        user?: AdminUser;
      }>('/auth/login', 'POST', { email, password });

      if (res.success && res.token && res.user) {
        setAuthToken(res.token);
        onLoginSuccess(res.user);
        onClose();
      } else {
        setError(res.message || 'Invalid admin credentials.');
      }
    } catch (err: any) {
      setError('Failed to connect to authentication server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 text-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-800 relative animate-scale-up">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-8 pb-6 text-center border-b border-slate-800">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-700 to-indigo-900 border border-purple-400/30 mx-auto flex items-center justify-center mb-4 text-amber-400 shadow-glow-gold">
            <Shield className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-extrabold text-white">Admin Authentication</h3>
          <p className="text-xs text-slate-400 mt-1">Glorious Apostolic Church India Council</p>
        </div>

        {/* Form */}
        <div className="p-8 space-y-6">
          
          {error && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Admin Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your admin email"
                  required
                  className="w-full px-4 py-3.5 pl-11 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none text-sm font-semibold transition-all"
                />
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full px-4 py-3.5 pl-11 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none text-sm font-semibold transition-all"
                />
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl font-bold text-slate-950 text-sm bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-glow-gold hover:scale-[1.02] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Admin Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          {/* Request Access Link */}
          <div className="pt-4 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-400 mb-2">Don't have an approved admin account?</p>
            <button
              type="button"
              onClick={() => {
                onClose();
                onRequestAccessClick();
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-400 hover:text-amber-400 transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Submit Admin Account Access Request</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
