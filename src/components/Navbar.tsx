import React, { useState, useRef, useEffect } from 'react';
import { User } from 'firebase/auth';
import {
  Compass,
  Sparkles,
  FolderClock,
  BookOpen,
  RotateCcw,
  LogOut,
  User as UserIcon,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';

interface NavbarProps {
  activeView: 'generator' | 'saved' | 'vocations' | 'inventory';
  setActiveView: (view: 'generator' | 'saved' | 'vocations' | 'inventory') => void;
  savedIdeasCount?: number;
  savedSessionsCount?: number;
  savedCount?: number;
  onResetSession: () => void;
  onOpenAiModal: () => void;
  currentUser: User | null;
  onSignInWithGoogle: () => void;
  onSignOut: () => void;
  isAuthLoading?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  savedIdeasCount = 0,
  savedSessionsCount = 0,
  savedCount = 0,
  onResetSession,
  onOpenAiModal,
  currentUser,
  onSignInWithGoogle,
  onSignOut,
  isAuthLoading = false,
}) => {
  const totalSaved = (savedIdeasCount + savedSessionsCount) || savedCount;
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

          {/* Quick Actions & Auth */}
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
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-all"
              title="Koleksi ide dan jobsheet tersimpan"
            >
              <FolderClock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="hidden sm:inline">Tersimpan</span>
              <span className="font-mono text-xs">({totalSaved})</span>
            </button>

            {/* Google Authentication Section */}
            {!currentUser ? (
              <button
                onClick={onSignInWithGoogle}
                disabled={isAuthLoading}
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold rounded-lg bg-white hover:bg-slate-100 text-slate-900 shadow-md border border-slate-200 transition-all active:scale-95 disabled:opacity-50"
                title="Masuk dengan Akun Google agar token & data tersimpan di akun Anda"
              >
                {/* Official Google 'G' icon */}
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span className="hidden xs:inline">Masuk </span>
                <span>Google</span>
              </button>
            ) : (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="inline-flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700/80 transition-all text-xs font-medium text-slate-200"
                  title="Akun Google Anda & Pengaturan Token"
                >
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || 'User'}
                      className="w-6 h-6 rounded-full border border-emerald-500 object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                      {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <span className="hidden sm:inline max-w-[90px] truncate text-slate-200 font-semibold">
                    {currentUser.displayName?.split(' ')[0] || 'Siswa'}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" title="Token Google Aktif"></span>
                  <ChevronDown className="w-3 h-3 text-slate-400 hidden xs:inline" />
                </button>

                {/* Dropdown Menu Akun & Token */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl py-3 px-3.5 z-50 text-slate-100 animate-fadeIn">
                    <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                      {currentUser.photoURL ? (
                        <img
                          src={currentUser.photoURL}
                          alt={currentUser.displayName || 'User'}
                          className="w-10 h-10 rounded-full border-2 border-emerald-500 object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                          {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-bold text-sm text-white truncate">
                          {currentUser.displayName || 'Pengguna Google'}
                        </p>
                        <p className="text-xs text-slate-400 truncate font-mono">
                          {currentUser.email}
                        </p>
                      </div>
                    </div>

                    <div className="my-3 p-2.5 rounded-xl bg-slate-950/70 border border-emerald-500/20 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Token Akun Google Aktif</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Data rancangan proyek dan jobsheet Anda kini tersinkronisasi khusus di akun Google pribadi.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onSignOut();
                      }}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-all"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Keluar (Sign Out)</span>
                    </button>
                  </div>
                )}
              </div>
            )}
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
