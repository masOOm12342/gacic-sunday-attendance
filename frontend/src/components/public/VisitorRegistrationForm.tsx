import React, { useState } from 'react';
import {
  User, Phone, MapPin, FileText, AlertTriangle, UserCheck,
  ArrowRight, Heart, CheckCircle2, X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { apiRequest } from '../../utils/api';
import { Visitor } from '../../types';

interface VisitorRegistrationFormProps {
  onSuccess?: (visitor: Visitor) => void;
}

export const VisitorRegistrationForm: React.FC<VisitorRegistrationFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    mobile_number: '',
    address: '',
    place_city: '',
    invited_by: '',
    notes: '',
  });

  const [loading, setLoading]               = useState(false);
  const [errorMessage, setErrorMessage]     = useState<string | null>(null);
  const [successVisitor, setSuccessVisitor] = useState<Visitor | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMessage) setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.full_name.trim() || !formData.mobile_number.trim() || !formData.address.trim() || !formData.place_city.trim()) {
      setErrorMessage('Please fill in all required fields: Full Name, Mobile Number, Address, and Place/City.');
      return;
    }

    if (!/^\d{10}$/.test(formData.mobile_number.trim())) {
      setErrorMessage('Mobile Number must be a valid 10-digit phone number.');
      return;
    }

    setLoading(true);
    try {
      const res = await apiRequest<{ success: boolean; message: string; visitor?: Visitor; isDuplicate?: boolean; existingVisitor?: Visitor }>(
        '/visitors/register',
        'POST',
        formData
      );

      if (res.success && res.visitor) {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ['#f59e0b', '#7c3aed', '#10b981'] });
        setSuccessVisitor(res.visitor);
        onSuccess?.(res.visitor);
      } else if (res.isDuplicate) {
        setErrorMessage(res.message || 'You are already registered as a visitor.');
      } else {
        setErrorMessage(res.message || 'Failed to submit. Please try again.');
      }
    } catch {
      setErrorMessage('Server connection error. Please check your network or try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSuccessVisitor(null);
    setFormData({ full_name: '', mobile_number: '', address: '', place_city: '', invited_by: '', notes: '' });
  };

  // ── Success Screen ─────────────────────────────────────────────────────────
  if (successVisitor) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center animate-fade-in">
        <div className="bg-white rounded-3xl p-8 shadow-card-elevate border border-slate-200 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
          
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3">
            <Heart className="w-3.5 h-3.5 text-rose-500" />
            Welcome to GACIC!
          </div>

          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1">
            You're Registered!
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            Thank you for visiting Glorious Apostolic Church India Council. You have been successfully registered as a new visitor.
          </p>

          {/* Visitor ID Badge */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 text-white text-left mb-6">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Visitor ID</div>
            <div className="text-xl font-black font-mono text-amber-400 tracking-wider mb-3">{successVisitor.visitor_id}</div>
            <div className="text-sm font-bold text-white">{successVisitor.full_name}</div>
            <div className="text-xs text-slate-400 mt-0.5">{successVisitor.mobile_number} · {successVisitor.place_city}</div>
          </div>

          <p className="text-xs text-slate-500 mb-6 italic">
            Keep this Visitor ID for your records. Our team will assist you further.
          </p>

          <button
            onClick={handleReset}
            className="w-full py-3 rounded-2xl font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <UserCheck className="w-5 h-5" />
            Register Another Visitor
          </button>
        </div>
      </div>
    );
  }

  // ── Registration Form ──────────────────────────────────────────────────────
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-900 font-semibold text-xs mb-3 border border-emerald-200">
          <Heart className="w-4 h-4 text-rose-500" />
          <span>First-Time Visitor Registration</span>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 font-sans tracking-tight">
          Welcome to Our Church!
        </h2>
        <p className="text-sm text-slate-600 mt-2 max-w-xl mx-auto">
          Glorious Apostolic Church India Council — Fill in your details and get a unique{' '}
          <span className="font-bold text-emerald-700">VIS-2026-XXXXX</span> Visitor ID to track your journey with us.
        </p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-card-elevate border border-slate-200/80 relative overflow-hidden">

        {/* Top Accent Stripe */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />

        {/* Error Banner */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2 animate-fade-in">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
            <button onClick={() => setErrorMessage(null)} className="ml-auto shrink-0 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Row 1: Name & Mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            <div className="floating-label-group">
              <input type="text" id="visitor_full_name" name="full_name" value={formData.full_name}
                onChange={handleChange} placeholder=" " required className="floating-input" />
              <label htmlFor="visitor_full_name" className="floating-label">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <User className="absolute right-3.5 top-4 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            <div className="floating-label-group">
              <input type="tel" id="visitor_mobile" name="mobile_number" value={formData.mobile_number}
                onChange={handleChange} placeholder=" " maxLength={10} required className="floating-input" />
              <label htmlFor="visitor_mobile" className="floating-label">
                10-Digit Mobile Number <span className="text-rose-500">*</span>
              </label>
              <Phone className="absolute right-3.5 top-4 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

          </div>

          {/* Row 2: Address (full width) */}
          <div className="floating-label-group">
            <input type="text" id="visitor_address" name="address" value={formData.address}
              onChange={handleChange} placeholder=" " required className="floating-input" />
            <label htmlFor="visitor_address" className="floating-label">
              Residential Address <span className="text-rose-500">*</span>
            </label>
            <MapPin className="absolute right-3.5 top-4 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          {/* Row 3: Place/City & Invited By */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            <div className="floating-label-group">
              <input type="text" id="visitor_place_city" name="place_city" value={formData.place_city}
                onChange={handleChange} placeholder=" " required className="floating-input" />
              <label htmlFor="visitor_place_city" className="floating-label">
                Place / City Came From <span className="text-rose-500">*</span>
              </label>
              <MapPin className="absolute right-3.5 top-4 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            <div className="floating-label-group">
              <input type="text" id="visitor_invited_by" name="invited_by" value={formData.invited_by}
                onChange={handleChange} placeholder=" " className="floating-input" />
              <label htmlFor="visitor_invited_by" className="floating-label">
                Invited By (Optional)
              </label>
              <UserCheck className="absolute right-3.5 top-4 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

          </div>

          {/* Row 4: Notes */}
          <div className="floating-label-group">
            <textarea id="visitor_notes" name="notes" rows={2} value={formData.notes}
              onChange={handleChange} placeholder=" " className="floating-input pt-4 resize-none" />
            <label htmlFor="visitor_notes" className="floating-label">
              Additional Notes / Prayer Request (Optional)
            </label>
            <FileText className="absolute right-3.5 top-4 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl font-bold text-white text-base bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 shadow-lg hover:scale-[1.01] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Register as First-Time Visitor</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

        </form>
      </div>
    </div>
  );
};
