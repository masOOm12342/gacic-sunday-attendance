import React, { useEffect, useState } from 'react';
import { Search, UserPlus, Download, QrCode, Edit3, Trash2, FileSpreadsheet, FileText, Filter, X, AlertTriangle, Loader2 } from 'lucide-react';
import { apiRequest } from '../../utils/api';
import { downloadWithAuth } from '../../utils/download';
import { Member } from '../../types';
import { QRSuccessModal } from '../public/QRSuccessModal';
import { emitDataEvent, onDataEvent } from '../../utils/dataEvents';

export const MemberManagement: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [downloading, setDownloading] = useState<string | null>(null); // tracks which export is in progress
  const [genderFilter, setGenderFilter] = useState('ALL');
  
  // Selected Member for QR Modal / Edit Modal / Delete Confirmation
  const [qrModalMember, setQrModalMember] = useState<Member | null>(null);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deletingMember, setDeletingMember] = useState<Member | null>(null);

  // Form State for Add/Edit
  const [memberForm, setMemberForm] = useState({
    full_name: '',
    mobile_number: '',
    email: '',
    address: '',
    place_city: '',
    gender: 'Male',
    dob: '',
    notes: '',
  });

  const [formError, setFormError] = useState<string | null>(null);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      let url = `/members?search=${encodeURIComponent(searchTerm)}`;
      if (genderFilter !== 'ALL') url += `&gender=${genderFilter}`;
      const res = await apiRequest<{ success: boolean; members: Member[] }>(url);
      if (res.success) {
        setMembers(res.members);
      }
    } catch (error) {
      console.error('Error loading members:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [searchTerm, genderFilter]);

  // Live-sync: re-fetch when members change in another tab (e.g. visitor transfer)
  useEffect(() => {
    const unsub = onDataEvent('members:changed', fetchMembers);
    return unsub;
  }, [searchTerm, genderFilter]);

  const handleOpenAdd = () => {
    setMemberForm({
      full_name: '',
      mobile_number: '',
      email: '',
      address: '',
      place_city: '',
      gender: 'Male',
      dob: '',
      notes: '',
    });
    setFormError(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (member: Member) => {
    setEditingMember(member);
    setMemberForm({
      full_name: member.full_name,
      mobile_number: member.mobile_number,
      email: member.email || '',
      address: member.address,
      place_city: member.place_city,
      gender: member.gender || 'Male',
      dob: member.dob || '',
      notes: member.notes || '',
    });
    setFormError(null);
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!memberForm.full_name.trim() || !memberForm.mobile_number.trim() || !memberForm.address.trim() || !memberForm.place_city.trim()) {
      setFormError('Full Name, Mobile Number, Address, and Place/City are required.');
      return;
    }

    try {
      if (editingMember) {
        // PUT update
        const res = await apiRequest<{ success: boolean; message: string }>(`/members/${editingMember.id}`, 'PUT', memberForm);
        if (res.success) {
          setEditingMember(null);
          fetchMembers();
          emitDataEvent('members:changed');
        } else {
          setFormError(res.message);
        }
      } else {
        // POST create manual
        const res = await apiRequest<{ success: boolean; message: string; member?: Member }>(`/members`, 'POST', memberForm);
        if (res.success && res.member) {
          setShowAddModal(false);
          fetchMembers();
          setQrModalMember(res.member);
          emitDataEvent('members:changed');
        } else {
          setFormError(res.message);
        }
      }
    } catch (err: any) {
      setFormError('Failed to save member details.');
    }
  };

  const handleDeleteMember = async () => {
    if (!deletingMember) return;
    try {
      const res = await apiRequest<{ success: boolean }>(`/members/${deletingMember.id}`, 'DELETE');
      if (res.success) {
        setDeletingMember(null);
        fetchMembers();
        emitDataEvent('members:changed');
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Member Directory &amp; Management</h2>
          <p className="text-xs text-slate-500 mt-1">
            Search, edit, filter, and manage church members or generate QR badges.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={async () => {
              setDownloading('excel');
              try {
                await downloadWithAuth('/api/export/members/excel', 'GACIC_Members.xlsx');
              } catch (e) {
                alert('Export failed. Please try again.');
              } finally {
                setDownloading(null);
              }
            }}
            disabled={!!downloading}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            {downloading === 'excel' ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4" />}
            <span>{downloading === 'excel' ? 'Exporting...' : 'Export Excel'}</span>
          </button>

          <button
            onClick={async () => {
              setDownloading('pdf');
              try {
                await downloadWithAuth('/api/export/members/pdf', 'GACIC_Members.pdf');
              } catch (e) {
                alert('Export failed. Please try again.');
              } finally {
                setDownloading(null);
              }
            }}
            disabled={!!downloading}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 border border-slate-700 cursor-pointer"
          >
            {downloading === 'pdf' ? <Loader2 className="w-4 h-4 animate-spin text-amber-400" /> : <FileText className="w-4 h-4 text-amber-400" />}
            <span>{downloading === 'pdf' ? 'Exporting...' : 'Export PDF'}</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-800 hover:from-purple-800 hover:to-indigo-900 text-white font-bold text-xs shadow-glow-gold hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-amber-300" />
            <span>Add Member Manually</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card-elevate flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Instant Search Bar */}
        <div className="relative w-full md:w-96">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by REG ID, Name, Mobile, City, Email..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 outline-none focus:border-purple-600"
          />
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 outline-none"
          >
            <option value="ALL">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <span className="text-xs font-bold text-slate-400 pl-2">
            Count: <strong className="text-purple-700 font-extrabold">{members.length}</strong>
          </span>
        </div>

      </div>

      {/* Data Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card-elevate overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white text-xs font-bold uppercase tracking-wider">
                <th className="py-4 px-6">Reg ID</th>
                <th className="py-4 px-6">Member Name</th>
                <th className="py-4 px-6">Mobile Number</th>
                <th className="py-4 px-6">Place / City</th>
                <th className="py-4 px-6">Gender</th>
                <th className="py-4 px-6 text-center">QR Badge</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">Loading members list...</td>
                </tr>
              ) : members.length > 0 ? (
                members.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 font-mono font-bold text-xs">
                        {m.reg_id}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900">{m.full_name}</td>
                    <td className="py-4 px-6">{m.mobile_number}</td>
                    <td className="py-4 px-6">{m.place_city}</td>
                    <td className="py-4 px-6">{m.gender || 'N/A'}</td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => setQrModalMember(m)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition-colors inline-flex items-center gap-1.5"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>View QR</span>
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(m)}
                        className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                        title="Edit Member"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingMember(m)}
                        className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                        title="Delete Member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">No church members found matching search query.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* QR Badge Modal */}
      {qrModalMember && (
        <QRSuccessModal
          member={qrModalMember}
          onClose={() => setQrModalMember(null)}
        />
      )}

      {/* Add / Edit Member Modal */}
      {(showAddModal || editingMember) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 p-8 space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-xl font-bold text-slate-900">
                {editingMember ? `Edit Member: ${editingMember.reg_id}` : 'Add Member Manually'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingMember(null);
                }}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveMember} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Full Name *</label>
                <input
                  type="text"
                  value={memberForm.full_name}
                  onChange={(e) => setMemberForm({ ...memberForm, full_name: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  value={memberForm.mobile_number}
                  onChange={(e) => setMemberForm({ ...memberForm, mobile_number: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold outline-none focus:border-purple-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Place / City *</label>
                  <input
                    type="text"
                    value={memberForm.place_city}
                    onChange={(e) => setMemberForm({ ...memberForm, place_city: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold outline-none focus:border-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Gender</label>
                  <select
                    value={memberForm.gender}
                    onChange={(e) => setMemberForm({ ...memberForm, gender: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold outline-none focus:border-purple-600"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Residential Address *</label>
                <input
                  type="text"
                  value={memberForm.address}
                  onChange={(e) => setMemberForm({ ...memberForm, address: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold outline-none focus:border-purple-600"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-purple-700 to-indigo-800 hover:from-purple-800 hover:to-indigo-900 shadow-md cursor-pointer"
              >
                Save Member Record
              </button>
            </form>

          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Delete Member Record?</h4>
            <p className="text-xs text-slate-500">
              Are you sure you want to delete member <strong>{deletingMember.full_name}</strong> ({deletingMember.reg_id})? This will also remove their attendance history.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setDeletingMember(null)}
                className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-xs text-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteMember}
                className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 font-bold text-xs text-white"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
