import React, { useState } from 'react';
import {
  User, Phone, MapPin, UserCheck, ArrowRight, Heart, Calendar, CreditCard, AlertTriangle, X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { apiRequest } from '../../utils/api';
import { Visitor } from '../../types';
import { emitDataEvent } from '../../utils/dataEvents';

interface VisitorRegistrationFormProps {
  onSuccess?: (visitor: Visitor) => void;
}

export const VisitorRegistrationForm: React.FC<VisitorRegistrationFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    mobile_number: '',
    address: '',
    dob: '',
    gender: '',
    invited_by: '',
    adhaar_number: '',
  });

  const [loading, setLoading]           = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMessage) setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.full_name.trim() || !formData.mobile_number.trim() || !formData.address.trim() || !formData.dob.trim()) {
      setErrorMessage('Please fill in all required fields: Full Name, Mobile Number, Address, and Date of Birth.');
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
        {
          ...formData,
          place_city: formData.address // fallback place_city to address
        }
      );

      if (res.success && res.visitor) {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ['#f59e0b', '#7c3aed', '#10b981'] });
        onSuccess?.(res.visitor);
        // Live-sync: notify all listening admin tabs (Visitors, Dashboard, etc.)
        emitDataEvent('visitors:changed');
        // Reset form automatically
        setFormData({ full_name: '', mobile_number: '', address: '', dob: '', gender: '', invited_by: '', adhaar_number: '' });
        setErrorMessage(null);
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
          Glorious Apostolic Church India Council — Fill in your details below to receive your automatic <span className="font-bold text-emerald-700">VIS-{new Date().getFullYear()}-XXXXX</span> Visitor ID &amp; printable QR badge.
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

          {/* Row 2: Address & DOB (Required) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            <div className="floating-label-group">
              <input type="text" id="visitor_address" name="address" value={formData.address}
                onChange={handleChange} placeholder=" " required className="floating-input" />
              <label htmlFor="visitor_address" className="floating-label">
                Residential Address <span className="text-rose-500">*</span>
              </label>
              <MapPin className="absolute right-3.5 top-4 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            {/* Date of Birth (Required) */}
            <div className="floating-label-group">
              <input
                type="date"
                id="visitor_dob"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                placeholder=" "
                required
                className="floating-input"
              />
              <label htmlFor="visitor_dob" className="floating-label">
                Date of Birth <span className="text-rose-500">*</span>
              </label>
              <Calendar className="absolute right-3.5 top-4 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

          </div>

          {/* Row 3: Gender & Referred By */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            {/* Gender (Required) */}
            <div className="floating-label-group">
              <select
                id="visitor_gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="floating-input"
              >
                <option value=""> </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <label htmlFor="visitor_gender" className="floating-label">
                Gender <span className="text-rose-500">*</span>
              </label>
            </div>

            {/* Referred By */}
            <div className="floating-label-group">
              <input
                type="text"
                id="visitor_invited_by"
                name="invited_by"
                value={formData.invited_by}
                onChange={handleChange}
                placeholder=" "
                className="floating-input"
              />
              <label htmlFor="visitor_invited_by" className="floating-label">
                Referred By (Optional)
              </label>
              <UserCheck className="absolute right-3.5 top-4 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

          </div>

          {/* Row 4: Aadhaar Number (Optional) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            {/* Aadhaar Number (Optional) */}
            <div className="floating-label-group">
              <input
                type="text"
                id="visitor_adhaar"
                name="adhaar_number"
                value={formData.adhaar_number}
                onChange={handleChange}
                placeholder=" "
                maxLength={14}
                className="floating-input"
              />
              <label htmlFor="visitor_adhaar" className="floating-label">
                Aadhaar Number (Optional)
              </label>
              <CreditCard className="absolute right-3.5 top-4 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

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
