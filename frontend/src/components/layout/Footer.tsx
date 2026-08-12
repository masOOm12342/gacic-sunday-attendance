import React from 'react';
import { Church, ShieldCheck, Heart, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Col 1 */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                <Church className="w-5 h-5 text-amber-400" />
              </div>
              <span className="font-bold text-white text-base">Glorious Apostolic Church</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              India Council — Commercial SaaS Grade Sunday Attendance & Member QR Registration System. Built for seamless operations on web, mobile, and tablet.
            </p>
          </div>

          {/* Col 2 */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Timezone: Indian Standard Time (IST - Asia/Kolkata / Mumbai)</span>
            </div>
            <p className="text-xs text-slate-500">
              Check-in logs and attendance timestamps strictly adhere to IST for accurate Sunday service tracking.
            </p>
          </div>

          {/* Col 3 */}
          <div className="flex flex-col items-start md:items-end justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Super Admin: gacic_admin@gmail.com</span>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-bold text-slate-500">
          <p>© {new Date().getFullYear()} Glorious Apostolic Church India Council. All Rights Reserved.</p>
          <p className="flex items-center gap-1">
            <span>Powered with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for Kingdom Growth</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
