import React, { useState } from 'react';
import { Camera, Shirt, Sparkles, Award, Layers } from 'lucide-react';
import { ProductPhotoGame } from './ProductPhotoGame';
import { ScreenPrintingGame } from './ScreenPrintingGame';

export const VocationalSimulationHub: React.FC = () => {
  // Sub-tab game: 'photo' (Foto Produk) | 'screenprint' (Sablon Baju)
  const [selectedGame, setSelectedGame] = useState<'photo' | 'screenprint'>('screenprint');

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Game Selector Navigation Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-md">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Hub Game Simulasi Vokasi SMK</h3>
              <p className="text-[11px] text-slate-400">Pilih modul praktek kejuruan interaktif 2 dimensi</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
            {/* Tombol Game Sablon Baju */}
            <button
              onClick={() => setSelectedGame('screenprint')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                selectedGame === 'screenprint'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30 ring-1 ring-emerald-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Shirt className="w-4 h-4 text-emerald-300" />
              <span>Praktek Sablon Baju (Gesut & Press)</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-950/80 text-emerald-300 font-mono">
                BARU
              </span>
            </button>

            {/* Tombol Game Foto Produk */}
            <button
              onClick={() => setSelectedGame('photo')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                selectedGame === 'photo'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Camera className="w-4 h-4 text-cyan-300" />
              <span>Praktek Foto Produk (Segitiga Fotografi)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Render Game Aktif */}
      {selectedGame === 'screenprint' && <ScreenPrintingGame />}
      {selectedGame === 'photo' && <ProductPhotoGame />}
    </div>
  );
};
