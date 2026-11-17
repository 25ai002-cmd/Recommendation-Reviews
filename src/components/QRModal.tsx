import React, { useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Copy, Check, Download, ExternalLink, Smartphone } from 'lucide-react';
import { Business } from '../types';

interface QRModalProps {
  business: Business;
  isOpen: boolean;
  onClose: () => void;
  onOpenPoster: () => void;
}

export const QRModal: React.FC<QRModalProps> = ({ business, isOpen, onClose, onOpenPoster }) => {
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const nfcUrl = `${window.location.origin}/r/${business.slug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(nfcUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    const svg = qrRef.current?.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = 600;
      canvas.height = 600;
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 600, 600);
        ctx.drawImage(img, 50, 50, 500, 500);
        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = `${business.slug}-review-qr.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900">NFC & QR Review Link</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col items-center text-center">
          {/* Business Badge */}
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full mb-3">
            {business.name}
          </span>

          {/* QR Code Container */}
          <div 
            ref={qrRef}
            className="p-4 bg-white rounded-2xl border-2 border-indigo-100 shadow-sm mb-4 inline-block"
          >
            <QRCodeSVG
              value={nfcUrl}
              size={200}
              level="H"
              includeMargin={false}
              fgColor="#1e293b"
            />
          </div>

          <p className="text-xs text-slate-500 mb-4 max-w-xs">
            Customers tap their phone or scan this code to leave a 5-star Google review in seconds.
          </p>

          {/* Direct URL Box */}
          <div className="w-full flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2 mb-4">
            <span className="text-xs font-mono text-slate-600 truncate flex-1 text-left px-2">
              {nfcUrl}
            </span>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex-shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="w-full grid grid-cols-2 gap-2.5 mb-4">
            <button
              onClick={downloadQR}
              className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download PNG
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenPoster();
              }}
              className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-colors"
            >
              Print Stand Poster
            </button>
          </div>

          {/* NFC Hardware Info Tip */}
          <div className="w-full bg-slate-50 rounded-xl p-3 text-left border border-slate-200/70">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Writing to Physical NFC Tags (NTAG213 / NTAG215)
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Use any free mobile app like <strong className="text-slate-800">NFC Tools</strong> on your smartphone. Select "Write" &gt; "Add a record" &gt; "URL" and paste this exact link. Tap your NFC stand, puck, or sticker to write!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
