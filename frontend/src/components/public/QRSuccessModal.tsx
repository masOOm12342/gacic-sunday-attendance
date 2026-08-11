import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Printer, CheckCircle2, X, Sparkles } from 'lucide-react';
import { Member } from '../../types';

interface QRSuccessModalProps {
  member: Member;
  onClose: () => void;
}

// Church logo path (placed in /public/logo.png)
const CHURCH_LOGO_SRC = '/logo.png';

export const QRSuccessModal: React.FC<QRSuccessModalProps> = ({ member, onClose }) => {
  const badgeRef = useRef<HTMLDivElement>(null);

  // Download QR Code as PNG with church logo
  const handleDownloadPNG = () => {
    const svgElement = document.getElementById('member-qr-code-svg') as SVGSVGElement | null;
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const qrImg = new Image();

    qrImg.onload = () => {
      // Card dimensions
      const CARD_W = 500;
      const CARD_H = 700;
      const canvas = document.createElement('canvas');
      // 2x resolution for crisp print quality
      const SCALE = 2;
      canvas.width = CARD_W * SCALE;
      canvas.height = CARD_H * SCALE;
      const ctx = canvas.getContext('2d')!;
      ctx.scale(SCALE, SCALE);

      // ── Background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, CARD_H);
      bgGrad.addColorStop(0, '#0D1B3E');
      bgGrad.addColorStop(1, '#0A1628');
      ctx.fillStyle = bgGrad;
      roundRect(ctx, 0, 0, CARD_W, CARD_H, 28);
      ctx.fill();

      // ── Gold border frame
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 3;
      roundRect(ctx, 8, 8, CARD_W - 16, CARD_H - 16, 22);
      ctx.stroke();

      // ── Header gradient band
      const headerGrad = ctx.createLinearGradient(0, 0, CARD_W, 0);
      headerGrad.addColorStop(0, '#4B0082');
      headerGrad.addColorStop(0.5, '#1E3A8A');
      headerGrad.addColorStop(1, '#B45309');
      ctx.fillStyle = headerGrad;
      roundRect(ctx, 16, 16, CARD_W - 32, 110, 16);
      ctx.fill();

      // ── Try to load the logo; if it fails, draw fallback text
      const logoImg = new Image();
      logoImg.crossOrigin = 'anonymous';

      const drawAfterLogo = (logoLoaded: boolean) => {
        // Logo in header
        if (logoLoaded && logoImg.complete && logoImg.naturalWidth > 0) {
          const logoSize = 72;
          const logoX = CARD_W / 2 - logoSize / 2;
          const logoY = 27;
          // Circular clip for logo
          ctx.save();
          ctx.beginPath();
          ctx.arc(CARD_W / 2, logoY + logoSize / 2, logoSize / 2, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
          ctx.restore();
        } else {
          // Fallback: Draw a small church icon text
          ctx.fillStyle = '#D4AF37';
          ctx.font = 'bold 32px serif';
          ctx.textAlign = 'center';
          ctx.fillText('✝', CARD_W / 2, 80);
        }

        // Church name in header
        ctx.fillStyle = '#FCD34D';
        ctx.font = 'bold 11px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('GLORIOUS APOSTOLIC CHURCH', CARD_W / 2, logoLoaded ? 108 : 112);
        ctx.fillStyle = '#FDE68A';
        ctx.font = '9px Arial';
        ctx.fillText('INDIA COUNCIL', CARD_W / 2, logoLoaded ? 120 : 124);

        // ── "SUNDAY SERVICE ATTENDANCE BADGE" label
        ctx.fillStyle = '#94A3B8';
        ctx.font = 'bold 9px Arial';
        ctx.letterSpacing = '2px';
        ctx.fillText('SUNDAY SERVICE ATTENDANCE BADGE', CARD_W / 2, 148);

        // ── Gold separator line
        ctx.strokeStyle = '#D4AF37';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(60, 158);
        ctx.lineTo(CARD_W - 60, 158);
        ctx.stroke();

        // ── Member Name
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 26px Arial';
        ctx.fillText(member.full_name, CARD_W / 2, 192);

        // ── Reg ID badge pill
        const regText = member.reg_id;
        const pillW = 180;
        const pillH = 30;
        const pillX = CARD_W / 2 - pillW / 2;
        ctx.fillStyle = 'rgba(245,158,11,0.2)';
        roundRect(ctx, pillX, 202, pillW, pillH, 8);
        ctx.fill();
        ctx.strokeStyle = 'rgba(245,158,11,0.5)';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = '#F59E0B';
        ctx.font = 'bold 13px monospace';
        ctx.fillText(regText, CARD_W / 2, 222);

        // ── QR Code (white background box)
        const qrBoxSize = 220;
        const qrBoxX = CARD_W / 2 - qrBoxSize / 2;
        const qrBoxY = 248;
        ctx.fillStyle = '#FFFFFF';
        roundRect(ctx, qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 16);
        ctx.fill();
        ctx.strokeStyle = '#D4AF37';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.drawImage(qrImg, qrBoxX + 10, qrBoxY + 10, qrBoxSize - 20, qrBoxSize - 20);

        // ── Member details below QR
        const detailY = qrBoxY + qrBoxSize + 24;
        ctx.fillStyle = '#94A3B8';
        ctx.font = '12px Arial';
        ctx.fillText(`Mobile:`, CARD_W / 2 - 80, detailY);
        ctx.fillStyle = '#E2E8F0';
        ctx.font = 'bold 12px Arial';
        ctx.fillText(member.mobile_number || '—', CARD_W / 2 + 10, detailY);

        ctx.fillStyle = '#94A3B8';
        ctx.font = '12px Arial';
        ctx.fillText(`Place:`, CARD_W / 2 - 80, detailY + 22);
        ctx.fillStyle = '#E2E8F0';
        ctx.font = 'bold 12px Arial';
        ctx.fillText(member.place_city || '—', CARD_W / 2 + 10, detailY + 22);

        // ── Bottom gold separator
        ctx.strokeStyle = '#D4AF37';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(60, CARD_H - 55);
        ctx.lineTo(CARD_W - 60, CARD_H - 55);
        ctx.stroke();

        // ── Footer text
        ctx.fillStyle = '#D4AF37';
        ctx.font = 'bold 9px Arial';
        ctx.fillText('✦  SCAN EVERY SUNDAY FOR INSTANT CHECK-IN  ✦', CARD_W / 2, CARD_H - 36);

        ctx.fillStyle = '#475569';
        ctx.font = '8px Arial';
        ctx.fillText('Glorious Apostolic Church India Council — REGD. NO. U94910PN2023NPL225222', CARD_W / 2, CARD_H - 20);

        // ── Export
        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = `${member.reg_id}_${member.full_name.replace(/\s+/g, '_')}_QR_Badge.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      };

      logoImg.onload = () => drawAfterLogo(true);
      logoImg.onerror = () => drawAfterLogo(false);
      logoImg.src = CHURCH_LOGO_SRC;
    };

    qrImg.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  // Helper: draw a rounded rectangle path
  function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

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
            <span>Member Found</span>
          </div>
          <h3 className="text-xl font-extrabold text-white">Member Digital QR Badge</h3>
          <p className="text-xs text-amber-200/80 mt-1">Glorious Apostolic Church India Council</p>
        </div>

        {/* Printable Badge Area */}
        <div className="p-6 sm:p-8" id="printable-qr-badge" ref={badgeRef}>
          <div className="bg-slate-900 rounded-3xl p-6 text-center text-white border border-slate-800 shadow-glass relative overflow-hidden">

            {/* Church Header with logo */}
            <div className="flex items-center justify-center gap-3 mb-4 pb-3 border-b border-slate-800">
              <img
                src={CHURCH_LOGO_SRC}
                alt="GACIC Logo"
                className="w-10 h-10 rounded-full object-cover border-2 border-amber-400 shadow"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <div className="text-left">
                <p className="text-xs font-bold text-amber-400 uppercase tracking-wider leading-tight">Glorious Apostolic Church</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest">India Council</p>
              </div>
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
