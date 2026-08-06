import React, { useEffect, useState } from 'react';
import { Database, Server, Settings, CheckCircle2, ShieldCheck, RefreshCw } from 'lucide-react';
import { apiRequest } from '../../utils/api';

export const DatabaseManager: React.FC = () => {
  const [dbInfo, setDbInfo] = useState<{
    tables: { name: string; records: number }[];
    settings: { key_name: string; key_value: string }[];
  } | null>(null);

  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold mb-2">
          <Database className="w-4 h-4 text-indigo-400" />
          <span>Super Admin Database Control</span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">System &amp; Relational Database Overview</h2>
        <p className="text-xs text-slate-500 mt-1">
          Inspect production table record counts, sequence indexes, and IST timezone configuration.
        </p>
      </div>

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
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
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

        {/* System Configurations */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card-elevate">
          <h3 className="text-base font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100 flex items-center gap-2">
            <Settings className="w-4 h-4 text-amber-600" />
            <span>System Settings &amp; Timezone</span>
          </h3>

          <div className="space-y-3">
            {dbInfo?.settings.map((s) => (
              <div key={s.key_name} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-700">{s.key_name}</span>
                <span className="font-semibold text-xs text-slate-900 bg-amber-100 text-amber-900 px-3 py-1 rounded-md">
                  {s.key_value}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
