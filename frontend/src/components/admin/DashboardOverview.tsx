import React, { useEffect, useState } from 'react';
import { Users, CheckCircle2, UserX, TrendingUp, QrCode, UserPlus, ArrowUpRight, Sparkles, Clock, RefreshCw, AlertCircle, Calendar } from 'lucide-react';
import { apiRequest } from '../../utils/api';
import { DashboardStats } from '../../types';
import { formatISTDate } from '../../utils/datetime';

interface DashboardOverviewProps {
  onNavigateTab: (tab: 'scanner' | 'members' | 'attendance' | 'requests' | 'database') => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onNavigateTab }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [todayDate, setTodayDate] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await apiRequest<{ success: boolean; stats: DashboardStats; todayDate: string }>('/dashboard/stats');
      if (res.success) {
        setStats(res.stats);
        setTodayDate(res.todayDate);
      }
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const isSunday = stats?.isTodaySunday ?? false;
  const activeDate = stats?.activeServiceDate || todayDate;

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-glass relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-amber-500/20 via-purple-600/20 to-transparent blur-3xl pointer-events-none" />
        
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Glorious Apostolic Church India Council</span>
            </div>

            {/* Smart Sunday Mode Pill */}
            {!loading && (
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                isSunday
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
              }`}>
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  {isSunday ? '⚡ Live Sunday Attendance' : `🗓️ Displaying Last Sunday Report (${activeDate})`}
                </span>
              </div>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Sunday Attendance Dashboard</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>Today's Date (IST / Mumbai): <strong className="text-slate-200">{todayDate ? formatISTDate(todayDate) : 'Loading...'}</strong></span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('scanner')}
            className="px-5 py-3 rounded-2xl font-bold text-slate-950 text-xs sm:text-sm bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:scale-105 transition-all shadow-glow-gold flex items-center gap-2 cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            <span>Open Sunday Scanner</span>
          </button>
          
          <button
            onClick={fetchStats}
            title="Refresh Metrics"
            className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Total Registered Members */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card-elevate hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Total Registered</span>
            <div className="w-11 h-11 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {stats?.totalMembers ?? 0}
            </h3>
            <p className="text-xs text-slate-500 mt-1">Master church directory</p>
          </div>
        </div>

        {/* Card 2: Sunday Check-ins */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card-elevate hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider">
              {isSunday ? "Today's Check-ins" : "Last Sunday Check-ins"}
            </span>
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl sm:text-4xl font-black text-emerald-600 tracking-tight">
              {stats?.todayCheckIns ?? 0}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Checked in for service ({activeDate})
            </p>
          </div>
        </div>

        {/* Card 3: Members Not Checked In */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card-elevate hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-rose-600 uppercase tracking-wider">Not Checked In</span>
            <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <UserX className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl sm:text-4xl font-black text-rose-600 tracking-tight">
              {stats?.notCheckedIn ?? 0}
            </h3>
            <p className="text-xs text-slate-500 mt-1">Pending for {activeDate}</p>
          </div>
        </div>

        {/* Card 4: Attendance Rate % */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card-elevate hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-indigo-700 uppercase tracking-wider">Attendance Rate</span>
            <div className="w-11 h-11 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl sm:text-4xl font-black text-indigo-600 tracking-tight">
              {stats?.attendancePercentage ?? 0}%
            </h3>
            <p className="text-xs text-slate-500 mt-1">Percentage of total members</p>
          </div>
        </div>

      </div>

      {/* 3-Column Section: Recent Registrations | Recent Sunday Check-ins | Not Checked In Members */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Column 1: Recent Registrations */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card-elevate flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-purple-700" />
                <h3 className="text-base font-bold text-slate-900">Recent Registrations</h3>
              </div>
              <button
                onClick={() => onNavigateTab('members')}
                className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 cursor-pointer"
              >
                <span>View All</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {stats?.recentRegistrations && stats.recentRegistrations.length > 0 ? (
                stats.recentRegistrations.map((m) => (
                  <div key={m.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between hover:bg-slate-100/80 transition-colors">
                    <div className="min-w-0 pr-2">
                      <div className="font-bold text-slate-900 text-sm truncate">{m.full_name}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <span>{m.mobile_number}</span>
                        <span>•</span>
                        <span className="truncate">{m.place_city}</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 font-mono font-bold text-xs shrink-0">
                      {m.reg_id}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 text-center py-6">No member registrations recorded yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Column 2: Recent Sunday Check-ins */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card-elevate flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">Recent Sunday Check-ins</h3>
              </div>
              <button
                onClick={() => onNavigateTab('attendance')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
              >
                <span>View Logs</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {stats?.recentCheckIns && stats.recentCheckIns.length > 0 ? (
                stats.recentCheckIns.map((c) => (
                  <div key={c.id} className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex items-center justify-between hover:bg-emerald-100/50 transition-colors">
                    <div className="min-w-0 pr-2">
                      <div className="font-bold text-slate-900 text-sm truncate">{c.full_name}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <span>{c.reg_id}</span>
                        <span>•</span>
                        <span className="truncate">{c.place_city}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="px-2 py-0.5 rounded-lg bg-emerald-600 text-white font-semibold text-xs inline-block">
                        {c.check_in_time}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-0.5">{c.service_date}</div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 text-center py-6">No Sunday check-ins recorded yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Column 3: Not Checked In Members (NEW) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card-elevate flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <UserX className="w-5 h-5 text-rose-600" />
                <h3 className="text-base font-bold text-slate-900">Not Checked In Members</h3>
              </div>
              <button
                onClick={() => onNavigateTab('members')}
                className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
              >
                <span>Directory</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {stats?.notCheckedInMembers && stats.notCheckedInMembers.length > 0 ? (
                stats.notCheckedInMembers.map((m) => (
                  <div key={m.id} className="p-3.5 rounded-2xl bg-rose-50/40 border border-rose-100 flex items-center justify-between hover:bg-rose-100/50 transition-colors">
                    <div className="min-w-0 pr-2">
                      <div className="font-bold text-slate-900 text-sm truncate">{m.full_name}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <span>{m.mobile_number}</span>
                        <span>•</span>
                        <span className="truncate">{m.place_city}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 font-bold text-xs border border-rose-200">
                        Absent
                      </span>
                      <div className="text-[10px] text-slate-400 mt-0.5">{m.reg_id}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-emerald-600 space-y-1">
                  <CheckCircle2 className="w-6 h-6 mx-auto text-emerald-500" />
                  <p className="text-xs font-bold">100% Attendance Achieved!</p>
                  <p className="text-[10px] text-slate-400">All registered members checked in.</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
