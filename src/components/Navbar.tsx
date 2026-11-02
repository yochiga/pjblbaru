import React from 'react';
import {
  Compass,
  Sparkles,
  FolderClock,
  BookOpen,
  RotateCcw,
} from 'lucide-react';

interface NavbarProps {
  activeView: 'generator' | 'saved' | 'vocations' | 'inventory';
  setActiveView: (view: 'generator' | 'saved' | 'vocations' | 'inventory') => void;
  savedIdeasCount?: number;
  savedSessionsCount?: number;
  savedCount?: number;
  onResetSession: () => void;
  onOpenAiModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  savedIdeasCount = 0,
  savedSessionsCount = 0,
  savedCount = 0,
  onResetSession,
  onOpenAiModal,
}) => {
  const totalSaved = (savedIdeasCount + savedSessionsCount) || savedCount;

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[3.75rem] py-2 sm:py-0">
          {/* Logo & Brand */}
          <div
            onClick={() => setActiveView('generator')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group min-w-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold group-hover:scale-105 transition-transform shrink-0">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent truncate">
                  SimulasiVokasi
                </span>
                <span className="hidden xs:inline-block text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 shrink-0">
                  SMK Mandiri
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 hidden sm:block truncate max-w-sm lg:max-w-md">
                Simulator Proyek Kejuruan Berbasis Alat & Bahan Sekitar
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={onOpenAiModal}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-indigo-600/30 transition-all active:scale-95"
              title="Rancang ide simulasi proyek baru dengan AI Gemini"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse shrink-0" />
              <span className="hidden xs:inline">Rancang </span>
              <span>AI</span>
            </button>

            <button
              onClick={onResetSession}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all active:scale-95"
              title="Mulai Rekomendasi Baru dari Awal"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="hidden md:inline">Mulai Baru</span>
              <span className="hidden xs:inline md:hidden">Reset</span>
            </button>

            <button
              onClick={() => setActiveView('saved')}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-all"
              title="Koleksi ide dan jobsheet tersimpan"
            >
              <FolderClock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="hidden sm:inline">Tersimpan</span>
              <span className="font-mono text-xs">({totalSaved})</span>
            </button>
          </div>
        </div>

        {/* Tab Navigasi */}
        <nav
          className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none border-t border-slate-800/60 -mx-3 px-3 sm:mx-0 sm:px-0"
          aria-label="Navigasi Utama"
        >
          <button
            onClick={() => setActiveView('generator')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
              activeView === 'generator'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
            <span>Rekomendasi Proyek Siswa</span>
          </button>

          <button
            onClick={() => setActiveView('saved')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
              activeView === 'saved'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FolderClock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Ide & Lembar Kerja</span>
            {totalSaved > 0 && (
              <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-slate-900/80 text-indigo-300 font-mono font-bold">
                {totalSaved}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveView('vocations')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
              activeView === 'vocations'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Bank Profesi & Kurikulum</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
