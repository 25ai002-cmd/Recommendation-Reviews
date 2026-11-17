import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Printer, Sparkles, Smartphone, Star } from 'lucide-react';
import { Business } from '../types';

interface StandPosterModalProps {
  business: Business;
  isOpen: boolean;
  onClose: () => void;
}

export const StandPosterModal: React.FC<StandPosterModalProps> = ({ business, isOpen, onClose }) => {
  if (!isOpen) return null;

  const nfcUrl = `${window.location.origin}/r/${business.slug}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Modal Controls (Hidden during print) */}
        <div className="print:hidden flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <span className="font-bold text-slate-800 text-sm">Printable Counter Stand Display</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Card
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Counter Stand Area */}
        <div className="p-8 sm:p-12 flex flex-col items-center text-center bg-gradient-to-b from-slate-50 to-white print:p-0">
          <div className="w-full max-w-sm rounded-3xl border-2 border-slate-200 bg-white p-8 shadow-lg flex flex-col items-center print:shadow-none print:border-4 print:border-slate-800">
            {/* Header Badge */}
            <div className="flex items-center gap-1.5 mb-2">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>

            <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-1">
              Love your visit?
            </h1>
            <p className="text-sm font-semibold text-slate-600 mb-6">
              Review <span className="text-indigo-600 font-bold">{business.name}</span> on Google
            </p>

            {/* QR Code with NFC badge */}
            <div className="relative p-4 bg-white rounded-2xl border-2 border-slate-100 shadow-md mb-6">
              <QRCodeSVG
                value={nfcUrl}
                size={180}
                level="H"
                fgColor="#0f172a"
              />
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-sm flex items-center gap-1 whitespace-nowrap">
                <Smartphone className="w-3 h-3" />
                Tap Phone or Scan
              </div>
            </div>

            <p className="text-xs text-slate-500 mb-4 max-w-[240px] leading-relaxed">
              Takes just 15 seconds. Tap your phone to this stand or open your camera to scan!
            </p>

            <div className="pt-4 border-t border-slate-100 w-full flex items-center justify-between text-[10px] text-slate-400 font-medium">
              <span>Powered by ReviewFlow</span>
              <span className="font-mono">/r/{business.slug}</span>
            </div>
          </div>

          <p className="print:hidden text-xs text-slate-400 mt-6 text-center max-w-sm">
            Tip: Print this on cardstock or slip it inside a standard 4x6" acrylic countertop sign holder. Affix an NFC sticker to the back!
          </p>
        </div>
      </div>
    </div>
  );
};
