import React, { useState } from 'react';
import { User, Phone, MapPin, Calendar, AlertTriangle, Sparkles, ArrowRight, CreditCard } from 'lucide-react';
import confetti from 'canvas-confetti';
import { apiRequest } from '../../utils/api';
import { Member } from '../../types';

interface RegistrationFormProps {
  onSuccess: (member: Member) => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    mobile_number: '',
    address: '',
    place_city: '',
    adhaar_number: '',
    gender: 'Male',
    dob: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [duplicateInfo, setDuplicateInfo] = useState<Member | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMessage) setErrorMessage(null);
    if (duplicateInfo) setDuplicateInfo(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setDuplicateInfo(null);

    // Front-end validation
    if (!formData.full_name.trim() || !formData.mobile_number.trim() || !formData.address.trim() || !formData.place_city.trim() || !formData.adhaar_number.trim()) {
      setErrorMessage('Please fill in all required fields: Full Name, Mobile Number, Address, Place/City, and Aadhaar Number.');
      return;
    }

    if (!/^\d{10}$/.test(formData.mobile_number.trim())) {
      setErrorMessage('Mobile Number must be a valid 10-digit phone number.');
      return;
    }

    setLoading(true);

    try {
      const res = await apiRequest<{ success: boolean; message: string; member?: Member; isDuplicate?: boolean; existingMember?: Member }>(
        '/members/register',
        'POST',
        formData
      );

      if (res.success && res.member) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        onSuccess(res.member);
        // Automatically refresh/reset the form fields
        setFormData({
          full_name: '',
          mobile_number: '',
          address: '',
          place_city: '',
          adhaar_number: '',
          gender: 'Male',
          dob: '',
        });
        setErrorMessage(null);
        setDuplicateInfo(null);
      } else if (res.isDuplicate && res.existingMember) {
        setDuplicateInfo(res.existingMember);
        setErrorMessage(res.message || 'Duplicate registration detected for this exact Full Name and Mobile Number.');
      } else {
        setErrorMessage(res.message || 'Failed to submit registration. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage('Server connection error. Please check your network or try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      
      {/* Header Badge */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 text-purple-900 font-semibold text-xs mb-3 border border-purple-200">
          <Sparkles className="w-4 h-4 text-purple-700" />
          <span>Church Member Registration</span>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 font-sans tracking-tight">
          Register Member &amp; Get Unique QR Badge
        </h2>
        <p className="text-sm text-slate-600 mt-2 max-w-xl mx-auto">
          Glorious Apostolic Church India Council — Fill in your details below to generate your automatic <span className="font-bold text-purple-700">REG-2026-XXXXX</span> ID &amp; printable Sunday attendance QR code.
        </p>
      </div>

      {/* Main Registration Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-card-elevate border border-slate-200/80 relative overflow-hidden">
        
        {/* Top Accent Stripe */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-700 via-indigo-700 to-amber-500" />

        {/* Duplicate Alert Banner */}
        {duplicateInfo && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 animate-fade-in">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm text-amber-900">Duplicate Member Registration Detected</h4>
              <p className="text-xs text-amber-800 mt-1">
                A member named <strong>"{duplicateInfo.full_name}"</strong> with mobile number <strong>{duplicateInfo.mobile_number}</strong> is already registered.
              </p>
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-200/70 text-amber-900 font-mono font-bold text-xs">
                Registration ID: {duplicateInfo.reg_id}
              </div>
            </div>
          </div>
        )}

        {/* General Error Banner */}
        {errorMessage && !duplicateInfo && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Row 1: Full Name & Mobile Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Full Name */}
            <div className="floating-label-group">
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder=" "
                required
                className="floating-input"
              />
              <label htmlFor="full_name" className="floating-label">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <User className="absolute right-3.5 top-4 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            {/* Mobile Number */}
            <div className="floating-label-group">
              <input
                type="tel"
                id="mobile_number"
                name="mobile_number"
                value={formData.mobile_number}
                onChange={handleChange}
                placeholder=" "
                maxLength={10}
                required
                className="floating-input"
              />
              <label htmlFor="mobile_number" className="floating-label">
                10-Digit Mobile Number <span className="text-rose-500">*</span>
              </label>
              <Phone className="absolute right-3.5 top-4 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

          </div>

          {/* Row 2: Address & Place/City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Address */}
            <div className="floating-label-group">
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder=" "
                required
                className="floating-input"
              />
              <label htmlFor="address" className="floating-label">
                Residential Address <span className="text-rose-500">*</span>
              </label>
              <MapPin className="absolute right-3.5 top-4 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            {/* Place / City Came From */}
            <div className="floating-label-group">
              <input
                type="text"
                id="place_city"
                name="place_city"
                value={formData.place_city}
                onChange={handleChange}
                placeholder=" "
                required
                className="floating-input"
              />
              <label htmlFor="place_city" className="floating-label">
                Place / City Came From <span className="text-rose-500">*</span>
              </label>
              <MapPin className="absolute right-3.5 top-4 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

          </div>

          {/* Row 3: Aadhaar Number (REQUIRED), Gender & DOB */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

            {/* Aadhaar Number (Required) */}
            <div className="floating-label-group">
              <input
                type="text"
                id="adhaar_number"
                name="adhaar_number"
                value={formData.adhaar_number}
                onChange={handleChange}
                placeholder=" "
                maxLength={14}
                required
                className="floating-input"
              />
              <label htmlFor="adhaar_number" className="floating-label">
                Aadhaar Number <span className="text-rose-500">*</span>
              </label>
              <CreditCard className="absolute right-3.5 top-4 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            
            {/* Gender */}
            <div>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-3.5 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-800 focus:border-purple-600 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer Not to Say">Prefer Not to Say</option>
              </select>
            </div>

            {/* Date of Birth */}
            <div className="floating-label-group">
              <input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                placeholder=" "
                className="floating-input"
              />
              <label htmlFor="dob" className="floating-label">
                Date of Birth (Optional)
              </label>
              <Calendar className="absolute right-3.5 top-4 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl font-bold text-white text-base bg-gradient-to-r from-purple-700 via-indigo-800 to-amber-600 hover:from-purple-800 hover:to-amber-700 shadow-glow-gold hover:scale-[1.01] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Complete Member Registration</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

        </form>

      </div>
    </div>
  );
};
