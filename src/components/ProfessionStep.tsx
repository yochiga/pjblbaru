import React, { useState } from 'react';
import { POPULAR_VOCATION_FIELDS } from '../utils/projectRecommender';
import { VocationField } from '../types/recommender';
import {
  Briefcase,
  Search,
  Sparkles,
  ArrowRight,
  Zap,
  Wrench,
  Cpu,
  Utensils,
  Sprout,
  Palette,
  Scissors,
  Store,
  HelpCircle,
} from 'lucide-react';

interface ProfessionStepProps {
  selectedProfession: string;
  onSelectProfession: (profession: string) => void;
  onNext: () => void;
}

export function ProfessionStep({
  selectedProfession,
  onSelectProfession,
  onNext,
}: ProfessionStepProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [customInput, setCustomInput] = useState('');

  // Mapping ikon untuk setiap kejuruan
  const getIcon = (id: string) => {
    switch (id) {
      case 'titl':
        return <Zap className="w-5 h-5 text-amber-400" />;
      case 'tbsm':
        return <Wrench className="w-5 h-5 text-red-400" />;
      case 'tkj':
        return <Cpu className="w-5 h-5 text-sky-400" />;
      case 'kuliner':
        return <Utensils className="w-5 h-5 text-emerald-400" />;
      case 'pertanian':
        return <Sprout className="w-5 h-5 text-green-400" />;
      case 'dkv':
        return <Palette className="w-5 h-5 text-purple-400" />;
      case 'busana':
        return <Scissors className="w-5 h-5 text-pink-400" />;
      case 'elektronika':
        return <Cpu className="w-5 h-5 text-cyan-400" />;
      case 'bisnis':
        return <Store className="w-5 h-5 text-blue-400" />;
      default:
        return <Briefcase className="w-5 h-5 text-indigo-400" />;
    }
  };

  const filteredFields = POPULAR_VOCATION_FIELDS.filter((f) => {
    const q = searchTerm.toLowerCase();
    return (
      f.name.toLowerCase().includes(q) ||
      f.category.toLowerCase().includes(q) ||
      f.description.toLowerCase().includes(q)
    );
  });

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput.trim()) {
      onSelectProfession(customInput.trim());
      setCustomInput('');
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Penjelasan */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/30 text-indigo-300 text-[11px] sm:text-xs font-semibold uppercase tracking-wider mb-3 sm:mb-4">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>Langkah 1 dari 3: Eksplorasi Cita-Cita Siswa</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight">
            Profesi atau Bidang Usaha Apa yang Ingin Dipelajari?
          </h2>
          <p className="mt-2 text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed">
            Pilih jurusan atau bidang kejuruan SMK yang ingin ditekuni siswa, atau masukkan ide usaha bebas. 
            AI Gemini akan langsung menganalisis dan <strong className="text-indigo-300">merekomendasikan alat serta bahan yang harus ada</strong> untuk membuat purwarupa atau simulasi representatif di sekitar siswa.
          </p>
        </div>
      </div>

      {/* Input Profesi Khusus / Bebas */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm space-y-3">
        <h3 className="text-xs sm:text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>Ketik Profesi / Bidang Usaha Pilihan Siswa:</span>
        </h3>
        <form onSubmit={handleCustomSubmit} className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Contoh: Teknisi Jaringan Wi-Fi, Servis Busi & Karburator, Bakery Roti Manis, Hidroponik..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 sm:px-4 py-2.5 text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={!customInput.trim()}
            className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-xs sm:text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shrink-0 active:scale-95"
          >
            Gunakan Profesi Ini
          </button>
        </form>

        {selectedProfession && (
          <div className="mt-4 p-3 sm:p-4 bg-indigo-950/40 border border-indigo-500/30 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
              <div className="min-w-0">
                <span className="text-[11px] text-indigo-300 block">Profesi Terpilih Saat Ini:</span>
                <span className="text-sm sm:text-base font-bold text-white truncate block">{selectedProfession}</span>
              </div>
            </div>
            <button
              onClick={onNext}
              className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs sm:text-sm rounded-lg shadow-md transition-all flex items-center justify-center gap-2 shrink-0 active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse shrink-0" />
              <span>Rekomendasikan Alat & Bahan</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </div>
        )}
      </div>

      {/* Pilihan Cepat Jurusan / Profesi Populer SMK */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Rekomendasi Jurusan & Kejuruan Populer SMK</span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-normal">
                {filteredFields.length} Pilihan
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Klik salah satu kejuruan di bawah untuk memilih langsung profesi yang ingin disimulasikan.
            </p>
          </div>

          {/* Kolom Pencarian Cepat */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari jurusan / profesi..."
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Grid Kartu Jurusan */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFields.map((field) => {
            const isSelected = selectedProfession === field.name;
            return (
              <div
                key={field.id}
                onClick={() => onSelectProfession(field.name)}
                className={`group cursor-pointer rounded-xl p-5 border text-left transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-indigo-950/60 border-indigo-500 ring-2 ring-indigo-500/30 shadow-lg shadow-indigo-950/50'
                    : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 group-hover:scale-105 transition-transform">
                      {getIcon(field.id)}
                    </div>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                      {field.category}
                    </span>
                  </div>

                  <h4 className="font-semibold text-slate-100 text-base group-hover:text-indigo-300 transition-colors">
                    {field.name}
                  </h4>
                  <p className="mt-1.5 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {field.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="text-[11px] text-slate-500 truncate max-w-[200px]">
                    Contoh: {field.sampleRealWorldTasks[0]}
                  </div>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded transition-colors ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-300 group-hover:bg-indigo-900 group-hover:text-indigo-200'
                    }`}
                  >
                    {isSelected ? 'Dipilih' : 'Pilih'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tombol Aksi Bawah */}
      {selectedProfession && (
        <div className="pt-4 flex flex-col sm:flex-row justify-end gap-3">
          <button
            onClick={onNext}
            className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 group active:scale-95"
          >
            <span>Lanjut: Rekomendasi Alat & Bahan AI</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
          </button>
        </div>
      )}
    </div>
  );
}
