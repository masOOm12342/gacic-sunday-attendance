import React, { useEffect, useState } from 'react';
import { Calendar, Search, FileSpreadsheet, FileText, Clock, RefreshCw, Loader2, ChevronDown, Download } from 'lucide-react';
import { apiRequest } from '../../utils/api';
import { downloadWithAuth } from '../../utils/download';
import { AttendanceRecord } from '../../types';

export const AttendanceLog: React.FC = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [downloading, setDownloading] = useState<string | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      let url = `/attendance?search=${encodeURIComponent(searchQuery)}`;
      if (dateFilter) url += `&date=${dateFilter}`;
      const res = await apiRequest<{ success: boolean; attendance: AttendanceRecord[] }>(url);
      if (res.success) {
        setRecords(res.attendance);
      }
    } catch (error) {
      console.error('Error loading attendance logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [dateFilter, searchQuery]);

  const handleExportExcel = async (range: 'current' | 'month' | 'year') => {
    setShowExportMenu(false);
    setDownloading(`excel_${range}`);
    try {
      let url = '/api/export/attendance/excel';
      let filename = 'GACIC_Attendance';

      if (range === 'month') {
        const monthStr = dateFilter ? dateFilter.slice(0, 7) : new Date().toISOString().slice(0, 7);
        url += `?range=month&month=${monthStr}`;
        filename += `_Monthly_${monthStr}.xlsx`;
      } else if (range === 'year') {
        const yearStr = dateFilter ? dateFilter.slice(0, 4) : String(new Date().getFullYear());
        url += `?range=year&year=${yearStr}`;
        filename += `_Yearly_${yearStr}.xlsx`;
      } else {
        if (dateFilter) url += `?date=${dateFilter}`;
        filename += dateFilter ? `_${dateFilter}.xlsx` : '_Report.xlsx';
      }

      await downloadWithAuth(url, filename);
    } catch (e) {
      alert('Export failed. Please try again.');
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Sunday Service Attendance Records</h2>
          <p className="text-xs text-slate-500 mt-1">
            Permanent Sunday attendance history filterable by date in Indian Standard Time (IST).
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Excel Export Menu Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              disabled={!!downloading}
              className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              {downloading?.startsWith('excel') ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <FileSpreadsheet className="w-4 h-4" />
              )}
              <span>Export Excel</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-30 animate-scale-up space-y-1">
                <button
                  onClick={() => handleExportExcel('current')}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-amber-50 text-xs font-bold text-slate-800 flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-amber-600" />
                  <div>
                    <div>Week-wise / Date Log</div>
                    <div className="text-[10px] text-slate-400 font-normal">Filtered or selected Sunday sheet</div>
                  </div>
                </button>

                <button
                  onClick={() => handleExportExcel('month')}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-purple-50 text-xs font-bold text-slate-800 flex items-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-purple-600" />
                  <div>
                    <div>Month-wise Attendance Matrix</div>
                    <div className="text-[10px] text-slate-400 font-normal">All Sundays in selected month</div>
                  </div>
                </button>

                <button
                  onClick={() => handleExportExcel('year')}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-indigo-50 text-xs font-bold text-slate-800 flex items-center gap-2 cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
                  <div>
                    <div>Year-wise Attendance Summary</div>
                    <div className="text-[10px] text-slate-400 font-normal">Full year Sunday summary for all members</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          <button
            onClick={async () => {
              setDownloading('pdf');
              try {
                const filename = `GACIC_Attendance${dateFilter ? '_' + dateFilter : ''}.pdf`;
                await downloadWithAuth(`/api/export/attendance/pdf${dateFilter ? '?date=' + dateFilter : ''}`, filename);
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
            <span>{downloading === 'pdf' ? 'Exporting...' : 'Export PDF Report'}</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card-elevate flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Member Name, REG ID, City..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 outline-none focus:border-amber-500"
          />
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Calendar className="w-4 h-4 text-slate-400" />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 outline-none"
          />
          {dateFilter && (
            <button
              onClick={() => setDateFilter('')}
              className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
            >
              Clear Date
            </button>
          )}

          <button
            onClick={fetchAttendance}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
            title="Refresh Attendance Log"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card-elevate overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white text-xs font-bold uppercase tracking-wider">
                <th className="py-4 px-6">Service Date</th>
                <th className="py-4 px-6">Reg ID</th>
                <th className="py-4 px-6">Member Name</th>
                <th className="py-4 px-6">Place / City</th>
                <th className="py-4 px-6">Check-in Time (IST)</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Approved By</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">Loading Sunday attendance records...</td>
                </tr>
              ) : records.length > 0 ? (
                records.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900">{r.service_date}</td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 font-mono font-bold text-xs">
                        {r.reg_id}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900">{r.full_name}</td>
                    <td className="py-4 px-6">{r.place_city}</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-bold text-xs">
                        <Clock className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{r.check_in_time}</span>
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-md bg-emerald-600 text-white text-xs font-extrabold uppercase tracking-wide">
                        {r.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-600 font-semibold">{r.scanned_by || 'Admin Scanner'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">No attendance records found for the selected filter.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
