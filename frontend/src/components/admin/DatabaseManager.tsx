import React, { useEffect, useState } from 'react';
import { Database, Server, Settings, CheckCircle2, ShieldCheck, RefreshCw, Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { apiRequest } from '../../utils/api';
import { emitDataEvent } from '../../utils/dataEvents';

export const DatabaseManager: React.FC = () => {
  const [dbInfo, setDbInfo] = useState<{
    tables: { name: string; records: number }[];
    settings: { key_name: string; key_value: string }[];
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchDbInfo = async () => {
    setLoading(true);
    try {
      const res = await apiRequest<{ success: boolean; tables: any[]; settings: any[] }>('/database/info');
      if (res.success) {
        setDbInfo({ tables: res.tables, settings: res.settings });
      }
    } catch (err) {
      console.error('Database info fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDbInfo();
  }, []);

  const handleClearTable = async (tableKey: 'members' | 'visitors' | 'attendance', title: string) => {
    const confirmed = window.confirm(
      `⚠️ WARNING: Are you sure you want to clear the ${title} from Neon Cloud Database?\n\nThis will permanently delete all ${title.toLowerCase()} records from the database.`
    );
    if (!confirmed) return;

    setActionLoading(tableKey);
    setStatusMessage(null);

    try {
      const endpoint = `/database/clear-${tableKey}`;
      const res = await apiRequest<{ success: boolean; message: string }>(endpoint, 'POST');
      
      if (res.success) {
        setStatusMessage({ type: 'success', text: res.message });
        await fetchDbInfo();
        if (tableKey === 'members') emitDataEvent('members:changed');
        if (tableKey === 'visitors') emitDataEvent('visitors:changed');
        if (tableKey === 'attendance') emitDataEvent('attendance:changed');
        emitDataEvent('dashboard:refresh');
      } else {
        setStatusMessage({ type: 'error', text: res.message || 'Operation failed.' });
      }
    } catch (e: any) {
      setStatusMessage({ type: 'error', text: 'Network error performing database action.' });
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold mb-2">
          <Database className="w-4 h-4 text-indigo-400" />
          <span>Super Admin Database Control</span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">System &amp; Neon Relational Database Overview</h2>
        <p className="text-xs text-slate-500 mt-1">
          Inspect Neon Cloud PostgreSQL database tables, record counts, and execute administrative database cleanups.
        </p>
      </div>

      {statusMessage && (
        <div className={`p-4 rounded-2xl border text-xs font-semibold flex items-center gap-2 animate-scale-up ${
          statusMessage.type === 'success' ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-rose-50 border-rose-300 text-rose-900'
        }`}>
          {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-rose-600" />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Table Metrics */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card-elevate">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Server className="w-4 h-4 text-purple-600" />
              <span>Database Tables &amp; Record Counts</span>
            </h3>
            <button
              onClick={fetchDbInfo}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="space-y-3">
            {dbInfo?.tables.map((t) => (
              <div key={t.name} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-slate-900 text-sm">{t.name}</span>
                  <p className="text-[11px] text-slate-500">Relational schema table</p>
                </div>
                <span className="px-3 py-1 rounded-lg bg-purple-100 text-purple-900 font-extrabold text-sm">
                  {t.records} records
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Database Management Actions */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card-elevate">
          <h3 className="text-base font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100 flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-rose-600" />
            <span>Database Maintenance Actions</span>
          </h3>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-xs text-slate-900">Members Table</p>
                <p className="text-[11px] text-slate-500">Wipe all registered members &amp; attendance from Neon DB</p>
              </div>
              <button
                onClick={() => handleClearTable('members', 'All Members')}
                disabled={actionLoading === 'members'}
                className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                {actionLoading === 'members' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>Clear Members</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-xs text-slate-900">Visitors Table</p>
                <p className="text-[11px] text-slate-500">Wipe all visitor records from Neon DB</p>
              </div>
              <button
                onClick={() => handleClearTable('visitors', 'All Visitors')}
                disabled={actionLoading === 'visitors'}
                className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                {actionLoading === 'visitors' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>Clear Visitors</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-xs text-slate-900">Attendance Records</p>
                <p className="text-[11px] text-slate-500">Wipe Sunday attendance check-in history from Neon DB</p>
              </div>
              <button
                onClick={() => handleClearTable('attendance', 'Attendance Records')}
                disabled={actionLoading === 'attendance'}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                {actionLoading === 'attendance' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>Clear Attendance</span>
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

