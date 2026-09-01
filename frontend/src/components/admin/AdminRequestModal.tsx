import React, { useState } from 'react';
import { UserPlus, X, Mail, Phone, User, FileText, CheckCircle2, AlertCircle, Lock } from 'lucide-react';
import { apiRequest } from '../../utils/api';

interface AdminRequestModalProps {
  onClose: () => void;
}

export const AdminRequestModal: React.FC<AdminRequestModalProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    mobile_number: '',
    reason: '',
    password: '',
    confirm_password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name || !formData.email || !formData.mobile_number || !formData.reason || !formData.password) {
      setError('All fields are required.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await apiRequest<{ success: boolean; message: string }>('/auth/request-access', 'POST', formData);

      if (res.success) {
        setSuccessMessage(res.message);
      } else {
        setError(res.message || 'Failed to submit access request.');
      }
    } catch (err: any) {
      setError('Server error during submission.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 text-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-800 relative animate-scale-up">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-8 pb-6 border-b border-slate-800 text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 mx-auto flex items-center justify-center mb-3 text-amber-400">
            <UserPlus className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-extrabold text-white">Request Admin Access</h3>
          <p className="text-xs text-slate-400 mt-1">
            Glorious Apostolic Church India Council — Admin Account Authorization Queue
          </p>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          
          {successMessage ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-white">Request Submitted!</h4>
              <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                {successMessage}
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {error && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    required
                    placeholder="Brother/Sister Name"
                    className="w-full px-4 py-3 pl-10 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm outline-none focus:border-amber-400"
                  />
                  <User className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder="your.email@gmail.com"
                    className="w-full px-4 py-3 pl-10 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm outline-none focus:border-amber-400"
                  />
                  <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Mobile Phone Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={formData.mobile_number}
                    onChange={(e) => setFormData({ ...formData, mobile_number: e.target.value })}
                    required
                    placeholder="10-digit phone number"
                    className="w-full px-4 py-3 pl-10 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm outline-none focus:border-amber-400"
                  />
                  <Phone className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Reason for Requesting Admin Access
                </label>
                <div className="relative">
                  <textarea
                    rows={2}
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    required
                    placeholder="State your role/department (e.g. Ushering Ministry, Sunday Service Admin)"
                    className="w-full px-4 py-3 pl-10 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm outline-none focus:border-amber-400 resize-none"
                  />
                  <FileText className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                </div>
              </div>

              {/* Set Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Create Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      minLength={6}
                      placeholder="At least 6 characters"
                      className="w-full px-4 py-3 pl-10 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm outline-none focus:border-amber-400"
                    />
                    <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={formData.confirm_password}
                      onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                      required
                      minLength={6}
                      placeholder="Re-enter password"
                      className="w-full px-4 py-3 pl-10 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm outline-none focus:border-amber-400"
                    />
                    <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-amber-400/80">
                * All admin access requests remain in PENDING status until reviewed and approved by the Super Admin.
              </p>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold text-slate-950 text-sm bg-amber-400 hover:bg-amber-300 shadow-glow-gold hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Submit Request to Super Admin</span>
                )}
              </button>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
