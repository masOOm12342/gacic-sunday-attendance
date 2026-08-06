import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Printer, CheckCircle2, Church, X, Share2, Sparkles } from 'lucide-react';
import { Member } from '../../types';

interface QRSuccessModalProps {
  member: Member;
  onClose: () => void;
}

export const QRSuccessModal: React.FC<QRSuccessModalProps> = ({ member, onClose }) => {
  const badgeRef = useRef<HTMLDivElement>(null);

  // Download QR Code as PNG
  const handleDownloadPNG = () => {
    const svgElement = document.getElementById('member-qr-code-svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width + 80;
      canvas.height = img.height + 180;
      if (!ctx) return;

      // Draw background
      ctx.fillStyle = '#0A192F';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Title
      ctx.fillStyle = '#F59E0B';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Glorious Apostolic Church India Council', canvas.width / 2, 35);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 18px Arial';
      ctx.fillText(member.full_name, canvas.width / 2, 65);

      ctx.fillStyle = '#94A3B8';
      ctx.font = '14px Arial';
      ctx.fillText(`REG ID: ${member.reg_id}`, canvas.width / 2, 88);

      // Draw QR Image
      ctx.drawImage(img, 40, 105);

      ctx.fillStyle = '#CBD5E1';
      ctx.font = '12px Arial';
      ctx.fillText(`Mobile: ${member.mobile_number} | ${member.place_city}`, canvas.width / 2, canvas.height - 20);

      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `${member.reg_id}_${member.full_name.replace(/\s+/g, '_')}_QR.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  // Print Badge
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 relative animate-scale-up">
        
        {/* Modal Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-amber-700 text-white p-6 text-center relative overflow-hidden">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold mb-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Registration Successful</span>
          </div>
          <h3 className="text-xl font-extrabold text-white">Member Digital QR Badge</h3>
          <p className="text-xs text-amber-200/80 mt-1">Glorious Apostolic Church India Council</p>
        </div>

        {/* Printable Badge Area */}
        <div className="p-6 sm:p-8" id="printable-qr-badge" ref={badgeRef}>
          <div className="bg-slate-900 rounded-3xl p-6 text-center text-white border border-slate-800 shadow-glass relative overflow-hidden">
            
            {/* Church Header inside card */}
            <div className="flex items-center justify-center gap-2 mb-4 pb-3 border-b border-slate-800">
              <Church className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Sunday Service Attendance Badge</span>
            </div>

            {/* Member Details */}
            <h2 className="text-2xl font-black text-white tracking-tight">{member.full_name}</h2>
            <div className="mt-1 inline-flex items-center px-3 py-1 rounded-lg bg-amber-500/20 text-amber-400 font-mono font-bold text-sm border border-amber-500/30">
              {member.reg_id}
            </div>

            {/* QR Code Container */}
            <div className="my-6 p-4 bg-white rounded-2xl inline-block shadow-lg border-2 border-amber-400">
              <QRCodeSVG
                id="member-qr-code-svg"
                value={member.reg_id}
                size={180}
                level="H"
                includeMargin={true}
              />
            </div>

            <div className="text-xs text-slate-400 space-y-1">
              <p>Mobile: <span className="text-slate-200 font-medium">{member.mobile_number}</span></p>
              <p>Place: <span className="text-slate-200 font-medium">{member.place_city}</span></p>
              <p className="text-[10px] text-amber-400/80 pt-2 uppercase tracking-widest font-semibold">
                Scan every Sunday for instant check-in
              </p>
            </div>

          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-4">
          <button
            onClick={handleDownloadPNG}
            className="py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-purple-700 to-indigo-800 text-white shadow-md hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-amber-300" />
            <span>Download PNG</span>
          </button>

          <button
            onClick={handlePrint}
            className="py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-slate-900 text-white hover:bg-slate-800 shadow-md hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-700"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>Print Badge</span>
          </button>
        </div>

      </div>
    </div>
  );
};
