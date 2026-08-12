import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';
import { QrCode, CheckCircle2, AlertTriangle, UserCheck, RefreshCw, Volume2, Search, ArrowRight } from 'lucide-react';
import { apiRequest } from '../../utils/api';
import { Member, AttendanceRecord } from '../../types';
import { emitDataEvent } from '../../utils/dataEvents';

interface SundayQRScannerProps {
  onCheckInSuccess?: () => void;
}

export const SundayQRScanner: React.FC<SundayQRScannerProps> = () => {
  const [manualCode, setManualCode] = useState('');
  const [processing, setProcessing] = useState(false);
  const [scanResult, setScanResult] = useState<{
    status: 'success' | 'already_checked_in' | 'error';
    message: string;
    member?: Member;
    attendance?: AttendanceRecord;
  } | null>(null);

  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  // Play audio check-in sound
  const playAudioChime = (type: 'success' | 'warning') => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      if (type === 'success') {
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      } else {
        osc.frequency.setValueAtTime(300, audioCtx.currentTime);
        osc.frequency.setValueAtTime(200, audioCtx.currentTime + 0.15);
      }

      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch (e) {
      // Audio fallback
    }
  };

  const processScanCode = async (code: string) => {
    if (processing) return;
    setProcessing(true);
    setScanResult(null);

    try {
      const res = await apiRequest<{
        success: boolean;
        message: string;
        alreadyCheckedIn?: boolean;
        member?: Member;
        attendance?: AttendanceRecord;
      }>('/attendance/scan', 'POST', { code });

      if (res.success && res.member) {
        playAudioChime('success');
        setScanResult({
          status: 'success',
          message: res.message,
          member: res.member,
          attendance: res.attendance
        });
        emitDataEvent('attendance:changed');
      } else if (res.alreadyCheckedIn && res.member) {
        playAudioChime('warning');
        setScanResult({
          status: 'already_checked_in',
          message: res.message,
          member: res.member,
          attendance: res.attendance
        });
      } else {
        playAudioChime('warning');
        setScanResult({
          status: 'error',
          message: res.message || 'Scanned QR Code was not recognized.'
        });
      }
    } catch (err: any) {
      setScanResult({
        status: 'error',
        message: 'Network error processing attendance scan.'
      });
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    // Initialize HTML5 QR Scanner
    const scanner = new Html5QrcodeScanner(
      'qr-reader-container',
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        rememberLastUsedCamera: true,
        supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA]
      },
      /* verbose= */ false
    );

    scannerRef.current = scanner;

    scanner.render(
      (decodedText) => {
        processScanCode(decodedText);
      },
      (errorMessage) => {
        // Quiet scan errors
      }
    );

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
      }
    };
  }, []);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    processScanCode(manualCode.trim());
    setManualCode('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      
      {/* Title */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-900 font-bold text-xs mb-3 border border-amber-300">
          <QrCode className="w-4 h-4 text-amber-700" />
          <span>Sunday Attendance Live Camera Scanner</span>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900">
          Scan Sunday Service Member QR Code
        </h2>
        <p className="text-sm text-slate-600 mt-2">
          Position member QR badge in front of the device camera for instant check-in.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* Left Column: Live Camera Scanner */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card-elevate">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-amber-500" />
            <span>Camera QR Scanner</span>
          </h3>

          <div className="overflow-hidden rounded-2xl border-2 border-slate-100 bg-slate-950 min-h-[300px] flex items-center justify-center">
            <div id="qr-reader-container" className="w-full"></div>
          </div>

          {/* Manual Entry Fallback */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Manual Registration ID / Mobile Search
            </label>
            <form onSubmit={handleManualSubmit} className="flex gap-2">
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="e.g. REG-2026-00001"
                className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                disabled={processing}
                className="px-5 py-3 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Check In
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Scan Result Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card-elevate min-h-[400px] flex flex-col justify-center">
          
          {processing ? (
            <div className="text-center py-12 space-y-4">
              <RefreshCw className="w-10 h-10 text-amber-500 animate-spin mx-auto" />
              <p className="text-sm font-bold text-slate-700">Verifying Member Registration...</p>
            </div>
          ) : scanResult ? (
            <div className="animate-scale-up space-y-6">
              
              {/* Result Status Header */}
              {scanResult.status === 'success' && (
                <div className="p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-400 text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-black text-emerald-900">Attendance Marked Present!</h3>
                  <p className="text-xs text-emerald-800 font-semibold">{scanResult.message}</p>
                </div>
              )}

              {scanResult.status === 'already_checked_in' && (
                <div className="p-6 rounded-2xl bg-amber-50 border-2 border-amber-400 text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center mx-auto shadow-lg">
                    <AlertTriangle className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-black text-amber-900">Member Already Checked In!</h3>
                  <p className="text-xs text-amber-800 font-semibold">{scanResult.message}</p>
                </div>
              )}

              {scanResult.status === 'error' && (
                <div className="p-6 rounded-2xl bg-rose-50 border-2 border-rose-300 text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-rose-600 text-white flex items-center justify-center mx-auto">
                    <AlertTriangle className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-black text-rose-900">Scan Verification Failed</h3>
                  <p className="text-xs text-rose-800 font-semibold">{scanResult.message}</p>
                </div>
              )}

              {/* Scanned Member Details Card */}
              {scanResult.member && (
                <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-bold text-amber-400">REGISTRATION DETAILS</span>
                    <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 font-mono font-bold text-xs">
                      {scanResult.member.reg_id}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-white">{scanResult.member.full_name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Phone: <span className="text-slate-200">{scanResult.member.mobile_number}</span> | City: <span className="text-slate-200">{scanResult.member.place_city}</span>
                    </p>
                  </div>

                  {scanResult.attendance && (
                    <div className="pt-2 text-xs text-emerald-400 flex items-center justify-between font-semibold">
                      <span>Service Date: {scanResult.attendance.service_date}</span>
                      <span>Check-in Time: {scanResult.attendance.check_in_time}</span>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={() => setScanResult(null)}
                className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-xs text-slate-800 transition-colors"
              >
                Scan Next Member
              </button>

            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 space-y-3">
              <QrCode className="w-12 h-12 stroke-1 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-600">Awaiting QR Code scan from camera or manual entry...</p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
