import React, { useEffect, useState } from 'react';
import { UserCheck, UserX, Trash2, Shield, AlertTriangle, CheckCircle2, Clock, Mail, Phone } from 'lucide-react';
import { apiRequest } from '../../utils/api';
import { AdminRequestItem, AdminUser } from '../../types';

export const AdminRequestsManager: React.FC = () => {
  const [requests, setRequests] = useState<AdminRequestItem[]>([]);
  const [activeAdmins, setActiveAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  const fetchAdminRequests = async () => {
    setLoading(true);
    try {
      const res = await apiRequest<{ success: boolean; requests: AdminRequestItem[]; activeAdmins: AdminUser[] }>(
        '/admin/requests'
      );
      if (res.success) {
        setRequests(res.requests);
        setActiveAdmins(res.activeAdmins);
      }
    } catch (error) {
      console.error('Error fetching admin requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminRequests();
  }, []);

  const handleApprove = async (id: number) => {
    setMessage(null);
    try {
      const res = await apiRequest<{ success: boolean; message: string }>(`/admin/requests/${id}/approve`, 'POST');
      if (res.success) {
        setMessage(res.message);
        fetchAdminRequests();
      }
    } catch (err) {
      console.error('Approve error:', err);
    }
  };

  const handleReject = async (id: number) => {
    setMessage(null);
    try {
      const res = await apiRequest<{ success: boolean; message: string }>(`/admin/requests/${id}/reject`, 'POST');
      if (res.success) {
        setMessage(res.message);
        fetchAdminRequests();
      }
    } catch (err) {
      console.error('Reject error:', err);
    }
  };

  const handleDeleteRequest = async (id: number) => {
    try {
      await apiRequest(`/admin/requests/${id}`, 'DELETE');
      fetchAdminRequests();
    } catch (err) {
      console.error('Delete request error:', err);
    }
  };

  const handleDeleteAdminUser = async (id: number) => {
    try {
      const res = await apiRequest<{ success: boolean; message?: string }>(`/admin/requests/admin-user/${id}`, 'DELETE');
      if (res.success) {
        fetchAdminRequests();
      } else {
        alert(res.message);
      }
    } catch (err) {
      console.error('Delete admin user error:', err);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold mb-2">
          <Shield className="w-4 h-4 text-amber-400" />
          <span>Super Admin Access Governance Queue</span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Admin Authorization Requests</h2>
        <p className="text-xs text-slate-500 mt-1">
          Review, approve, or reject user access requests for church admin accounts. Predefined Super Admin email: <strong className="text-purple-700">gacic_admin@gmail.com</strong>.
        </p>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Pending Admin Requests Section */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card-elevate">
        <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-500" />
          <span>Pending Admin Approval Requests ({requests.filter(r => r.status === 'PENDING').length})</span>
        </h3>

        <div className="space-y-4">
          {requests.filter(r => r.status === 'PENDING').length > 0 ? (
            requests.filter(r => r.status === 'PENDING').map((r) => (
              <div key={r.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="font-bold text-slate-900 text-base">{r.full_name}</div>
                  <div className="text-xs text-slate-600 flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-slate-400" /> {r.email}</span>
                    <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-slate-400" /> {r.mobile_number}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 bg-white p-2.5 rounded-xl border border-slate-200">
                    <strong>Reason:</strong> "{r.reason}"
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleApprove(r.id)}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Approve</span>
                  </button>

                  <button
                    onClick={() => handleReject(r.id)}
                    className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <UserX className="w-4 h-4" />
                    <span>Reject</span>
                  </button>

                  <button
                    onClick={() => handleDeleteRequest(r.id)}
                    className="p-2.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 transition-colors"
                    title="Delete Request"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 text-center py-6">No pending admin authorization requests at this time.</p>
          )}
        </div>
      </div>

      {/* Active Admin Accounts List */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card-elevate">
        <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4 text-purple-600" />
          <span>Active Admin System Users ({activeAdmins.length})</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-900 text-white text-xs font-bold uppercase">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {activeAdmins.map((a) => (
                <tr key={a.id}>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{a.full_name}</td>
                  <td className="py-3.5 px-4 text-slate-600">{a.email}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded text-xs font-extrabold ${a.role === 'SUPER_ADMIN' ? 'bg-amber-100 text-amber-900' : 'bg-purple-100 text-purple-900'}`}>
                      {a.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                      {a.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {a.role !== 'SUPER_ADMIN' && a.email.toLowerCase() !== 'gloriousapostolicchurch777@gmail.com' ? (
                      <button
                        onClick={() => handleDeleteAdminUser(a.id)}
                        className="p-1.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-600"
                        title="Delete Admin Account"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Permanent Super Admin</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
