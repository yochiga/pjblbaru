import React, { useState } from 'react';
import { POPULAR_VOCATION_FIELDS, CURATED_SIMULATION_PROJECTS } from '../utils/projectRecommender';
import {
  BookOpen,
  Search,
  Wrench,
  Package,
  Layers,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface VocationBankViewProps {
  onSelectProfession: (profession: string) => void;
}

export function VocationBankView({ onSelectProfession }: VocationBankViewProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = POPULAR_VOCATION_FIELDS.filter((v) => {
    const q = searchTerm.toLowerCase();
    return (
      v.name.toLowerCase().includes(q) ||
      v.category.toLowerCase().includes(q) ||
      v.typicalTools.some((t) => t.toLowerCase().includes(q)) ||
      v.typicalMaterials.some((m) => m.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold mb-2">
              <BookOpen className="w-3.5 h-3.5" /> Referensi Kejuruan Indonesia
            </div>
            <h2 className="text-lg sm:text-2xl font-bold text-white">
              Bank Jurusan & Kebutuhan Profesi Siswa SMK
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Daftar kejuruan SMK, perkakas standar industri, bahan baku yang biasa digunakan, dan contoh tugas nyata dunia kerja.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari jurusan, alat, atau bahan..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((vocation) => {
          // Cari simulasi yang ada untuk profesi ini
          const simulation = CURATED_SIMULATION_PROJECTS.find(
            (p) =>
              p.targetProfession.toLowerCase().includes(vocation.name.toLowerCase()) ||
              vocation.name.toLowerCase().includes(p.targetProfession.toLowerCase())
          );

          return (
            <div
              key={vocation.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-slate-800 text-indigo-400 border border-slate-700">
                      {vocation.category}
                    </span>
                    <h3 className="font-bold text-base text-white mt-1.5">
                      {vocation.name}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {vocation.description}
                </p>

                {/* Alat & Bahan Standar */}
                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <div className="text-xs">
                    <span className="font-semibold text-amber-300 flex items-center gap-1.5 mb-1">
                      <Wrench className="w-3.5 h-3.5" /> Alat Standar:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {vocation.typicalTools.map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-xs">
                    <span className="font-semibold text-emerald-300 flex items-center gap-1.5 mb-1">
                      <Package className="w-3.5 h-3.5" /> Bahan Baku:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {vocation.typicalMaterials.map((m, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800"
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Contoh Proyek Simulasi Representatif */}
                {simulation && (
                  <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-500/20 text-xs">
                    <span className="font-semibold text-indigo-300 flex items-center gap-1 mb-1">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      Proyek Simulasi Representatif:
                    </span>
                    <p className="text-slate-200 line-clamp-2">{simulation.title}</p>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row justify-end">
                <button
                  onClick={() => onSelectProfession(vocation.name)}
                  className="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 min-h-[40px] sm:min-h-0 active:scale-95"
                >
                  <span>Pilih & Mulai Simulasi Ini</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
