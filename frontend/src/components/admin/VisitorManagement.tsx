import React, { useEffect, useState, useCallback } from 'react';
import {
  UserCheck, Search, RefreshCw, ArrowUpRight, Trash2, AlertCircle,
  CheckCircle2, Users, UserPlus, X, Heart
} from 'lucide-react';
import { apiRequest } from '../../utils/api';
import { Visitor, Member } from '../../types';
import { QRSuccessModal } from '../public/QRSuccessModal';

export const VisitorManagement: React.FC = () => {
  const [visitors, setVisitors]             = useState<Visitor[]>([]);
  const [loading, setLoading]               = useState(true);
  const [searchQuery, setSearchQuery]       = useState('');
  const [transferring, setTransferring]     = useState<number | null>(null);
  const [deleting, setDeleting]             = useState<number | null>(null);
  const [errorMsg, setErrorMsg]             = useState<string | null>(null);
  const [successMsg, setSuccessMsg]         = useState<string | null>(null);
  const [transferredMember, setTransferredMember] = useState<Member | null>(null);

  // Confirm modal state
  const [confirmTransfer, setConfirmTransfer] = useState<Visitor | null>(null);
  const [confirmDelete, setConfirmDelete]     = useState<Visitor | null>(null);

  const fetchVisitors = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await apiRequest<{ success: boolean; visitors: Visitor[] }>(
        `/visitors?status=ACTIVE${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''}`
      );
      if (res.success) setVisitors(res.visitors);
    } catch {
      setErrorMsg('Failed to load visitors. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    const t = setTimeout(fetchVisitors, searchQuery ? 400 : 0);
    return () => clearTimeout(t);
  }, [fetchVisitors, searchQuery]);

  const handleTransfer = async (visitor: Visitor) => {
    setTransferring(visitor.id);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const res = await apiRequest<{ success: boolean; message: string; member?: Member }>(
        `/visitors/${visitor.id}/transfer`,
        'POST'
      );
      if (res.success && res.member) {
        setSuccessMsg(res.message);
        setTransferredMember(res.member);
        setVisitors(prev => prev.filter(v => v.id !== visitor.id));
      } else {
        setErrorMsg(res.message || 'Transfer failed. Please try again.');
      }
    } catch {
      setErrorMsg('Server error during transfer. Please try again.');
    } finally {
      setTransferring(null);
      setConfirmTransfer(null);
    }
  };

  const handleDelete = async (visitor: Visitor) => {
    setDeleting(visitor.id);
    setErrorMsg(null);
    try {
      const res = await apiRequest<{ success: boolean; message: string }>(
        `/visitors/${visitor.id}`,
        'DELETE'
      );
      if (res.success) {
        setVisitors(prev => prev.filter(v => v.id !== visitor.id));
        setSuccessMsg(res.message);
      } else {
        setErrorMsg(res.message || 'Failed to delete visitor.');
      }
    } catch {
      setErrorMsg('Server error. Please try again.');
    } finally {
      setDeleting(null);
      setConfirmDelete(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card-elevate">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Heart className="w-5 h-5 text-rose-500" />
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Visitor Directory</h2>
            </div>
            <p className="text-sm text-slate-500 ml-11">
              Manage first-time visitors. Transfer continuous visitors to the Registered Member list.
            </p>
          </div>

          <div className="flex items-center gap-3 ml-11 sm:ml-0">
            {/* Counter badge */}
            <div className="px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-bold flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{visitors.length} Active</span>
            </div>
            <button
              onClick={fetchVisitors}
              className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 text-slate-600 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-5 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, mobile, visitor ID, or city…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
            >
              <X className="w-4 h-4 text-slate-400 hover:text-slate-700" />
            </button>
          )}
        </div>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-semibold flex items-center gap-3 animate-fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} className="ml-auto cursor-pointer"><X className="w-4 h-4" /></button>
        </div>
      )}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg(null)} className="ml-auto cursor-pointer"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Visitor List */}
      {loading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-400 font-semibold">Loading visitors…</p>
        </div>
      ) : visitors.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center shadow-card-elevate">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No Active Visitors Found</h3>
          <p className="text-sm text-slate-400">
            {searchQuery ? 'No visitors match your search. Try different keywords.' : 'No first-time visitors have been registered yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {visitors.map(visitor => (
            <div
              key={visitor.id}
              className="bg-white rounded-3xl p-5 border border-slate-200 shadow-card-elevate hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              {/* Visitor Badge */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center shrink-0">
                    <span className="text-emerald-700 font-black text-sm">
                      {visitor.full_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 text-sm truncate">{visitor.full_name}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{visitor.visitor_id}</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-[10px] shrink-0 border border-emerald-200">
                  ACTIVE
                </span>
              </div>

              {/* Details */}
              <div className="space-y-1.5 text-xs text-slate-600 mb-4 grow">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-500 w-14 shrink-0">Mobile</span>
                  <span className="font-semibold text-slate-800">{visitor.mobile_number}</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="font-bold text-slate-500 w-14 shrink-0">Address</span>
                  <span className="truncate text-slate-700">{visitor.address}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-500 w-14 shrink-0">City</span>
                  <span className="text-slate-700">{visitor.place_city}</span>
                </div>
                {visitor.invited_by && (
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-500 w-14 shrink-0">Invited</span>
                    <span className="text-slate-700">{visitor.invited_by}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-500 w-14 shrink-0">Registered</span>
                  <span className="text-slate-500">{visitor.created_at}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-auto">
                {/* Transfer Button */}
                <button
                  onClick={() => setConfirmTransfer(visitor)}
                  disabled={transferring === visitor.id}
                  className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-purple-700 to-indigo-700 text-white hover:from-purple-800 hover:to-indigo-800 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-sm"
                >
                  {transferring === visitor.id ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      Transfer to Member
                    </>
                  )}
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => setConfirmDelete(visitor)}
                  disabled={deleting === visitor.id}
                  title="Remove Visitor"
                  className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {deleting === visitor.id ? (
                    <div className="w-4 h-4 border-2 border-rose-300 border-t-rose-600 rounded-full animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Transfer Confirm Modal ──────────────────────────────────── */}
      {confirmTransfer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-7 w-full max-w-md shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-purple-700" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Transfer to Member?</h3>
                <p className="text-xs text-slate-500">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-sm text-slate-700 mb-1">
              You are about to transfer <strong>{confirmTransfer.full_name}</strong> from the Visitor list to the official Registered Members list.
            </p>
            <p className="text-xs text-slate-500 bg-slate-50 rounded-xl p-3 mb-6 border border-slate-100">
              A new sequential <strong>REG-2026-XXXXX</strong> ID will be generated. The visitor will be removed from the Visitor Directory and their QR badge will be available for print.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmTransfer(null)}
                className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleTransfer(confirmTransfer)}
                disabled={transferring === confirmTransfer.id}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-purple-700 to-indigo-700 text-white font-bold text-sm hover:from-purple-800 hover:to-indigo-800 transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {transferring === confirmTransfer.id
                  ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <><UserCheck className="w-4 h-4" /> Confirm Transfer</>
                }
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ────────────────────────────────────── */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-7 w-full max-w-md shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Remove Visitor?</h3>
                <p className="text-xs text-slate-500">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-sm text-slate-700 mb-6">
              Are you sure you want to permanently remove <strong>{confirmDelete.full_name}</strong> ({confirmDelete.visitor_id}) from the Visitor Directory?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                disabled={deleting === confirmDelete.id}
                className="flex-1 py-3 rounded-2xl bg-rose-600 text-white font-bold text-sm hover:bg-rose-700 transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {deleting === confirmDelete.id
                  ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <><Trash2 className="w-4 h-4" /> Delete Visitor</>
                }
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Badge modal after successful transfer */}
      {transferredMember && (
        <QRSuccessModal
          member={transferredMember}
          onClose={() => setTransferredMember(null)}
        />
      )}
    </div>
  );
};
