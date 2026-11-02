import React, { useState } from 'react';
import { RecommendedProject, AvailableResources } from '../types/recommender';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Award,
  ArrowRight,
  ArrowLeft,
  Wrench,
  Package,
  Layers,
  Lightbulb,
  ExternalLink,
  Loader2,
  RefreshCw,
  SlidersHorizontal,
  Bookmark,
  BookmarkCheck,
  Check,
} from 'lucide-react';

interface RecommendationsStepProps {
  selectedProfession: string;
  resources: AvailableResources;
  projects: RecommendedProject[];
  onOpenSimulation: (project: RecommendedProject) => void;
  onBackToResources: () => void;
  onBackToProfession: () => void;
  onAddAiProject: (project: RecommendedProject) => void;
  onOpenAiModal?: () => void;
  onSaveProjectIdea?: (project: RecommendedProject, note?: string) => void;
  onRemoveProjectIdea?: (projectId: string) => void;
  isProjectSaved?: (projectId: string) => boolean;
}

export function RecommendationsStep({
  selectedProfession,
  resources,
  projects,
  onOpenSimulation,
  onBackToResources,
  onBackToProfession,
  onAddAiProject,
  onOpenAiModal,
  onSaveProjectIdea,
  onRemoveProjectIdea,
  isProjectSaved,
}: RecommendationsStepProps) {
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Filter projects by difficulty
  const filteredProjects = projects.filter((p) => {
    if (filterDifficulty === 'all') return true;
    return p.difficulty.toLowerCase() === filterDifficulty.toLowerCase();
  });

  // Minta rekomendasi baru ke API AI Gemini
  const handleRequestAiProject = async () => {
    setIsAiLoading(true);
    setAiError(null);
    try {
      const response = await fetch('/api/recommend-projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetProfession: selectedProfession,
          availableTools: resources.tools,
          availableMaterials: resources.materials,
          customNotes: 'Rekomendasikan proyek simulasi praktis sederhana yang menggunakan alat dan bahan ini.',
        }),
      });

      const data = await response.json();
      if (data && data.project) {
        // Hitung ketersediaan untuk proyek AI baru
        const toolsUsed = (data.project.toolsUsed || []).map((t: any) => ({
          name: t.name,
          available: resources.tools.some(
            (userT) =>
              userT.toLowerCase().includes(t.name.toLowerCase()) ||
              t.name.toLowerCase().includes(userT.toLowerCase())
          ),
        }));

        const materialsUsed = (data.project.materialsUsed || []).map((m: any) => ({
          name: m.name,
          quantity: m.quantity || 'Secukupnya',
          available: resources.materials.some(
            (userM) =>
              userM.toLowerCase().includes(m.name.toLowerCase()) ||
              m.name.toLowerCase().includes(userM.toLowerCase())
          ),
        }));

        const availToolsCount = toolsUsed.filter((t: any) => t.available).length;
        const availMatCount = materialsUsed.filter((m: any) => m.available).length;
        const toolPct = toolsUsed.length > 0 ? (availToolsCount / toolsUsed.length) * 100 : 100;
        const matPct = materialsUsed.length > 0 ? (availMatCount / materialsUsed.length) * 100 : 100;
        const readinessPercentage = Math.round(toolPct * 0.55 + matPct * 0.45);

        const completeProject: RecommendedProject = {
          ...data.project,
          toolsUsed,
          materialsUsed,
          readinessPercentage,
        };

        onAddAiProject(completeProject);
      } else {
        setAiError(data.message || 'Gagal menghasilkan simulasi baru');
      }
    } catch (err: any) {
      console.error(err);
      setAiError('Tidak dapat terhubung ke server AI');
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Banner Ringkasan */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-[11px] sm:text-xs font-semibold uppercase tracking-wider mb-3 sm:mb-4">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Langkah 3: Rekomendasi Proyek Simulasi Kejuruan</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight">
            Proyek Sederhana Representasi Profesi Siswa
          </h2>
          <p className="mt-2 text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed">
            Berdasarkan profesi <strong className="text-indigo-300 font-semibold">{selectedProfession}</strong> dan ketersediaan <strong className="text-emerald-300">{resources.tools.length} alat</strong> serta <strong className="text-emerald-300">{resources.materials.length} bahan</strong> di sekitar siswa, berikut simulasi proyek realistis yang dapat langsung dipraktikkan.
          </p>

          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <button
              onClick={onBackToProfession}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors flex items-center gap-1.5 text-xs"
            >
              <span className="text-slate-400">Profesi:</span> <span className="font-semibold text-white">{selectedProfession}</span> (Ubah)
            </button>
            <button
              onClick={onBackToResources}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors flex items-center gap-1.5 text-xs"
            >
              <span className="text-slate-400">Sumber Daya:</span> {resources.tools.length} Alat, {resources.materials.length} Bahan (Kelola)
            </button>
          </div>
        </div>
      </div>

      {/* Filter & Tombol AI */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4 bg-slate-900/60 p-3.5 sm:p-4 border border-slate-800 rounded-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Kesulitan:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {['all', 'Mudah', 'Sedang', 'Menantang'].map((diff) => (
              <button
                key={diff}
                onClick={() => setFilterDifficulty(diff)}
                className={`text-xs px-2.5 py-1.5 rounded-md transition-colors ${
                  filterDifficulty === diff
                    ? 'bg-indigo-600 text-white font-medium shadow'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {diff === 'all' ? 'Semua' : diff}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onOpenAiModal || handleRequestAiProject}
          disabled={isAiLoading}
          className="w-full lg:w-auto px-4 py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          {isAiLoading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
              <span>Merancang Ide AI Gemini...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse shrink-0" />
              <span>Rancang Ide Proyek AI Gemini</span>
            </>
          )}
        </button>
      </div>

      {aiError && (
        <div className="p-3 bg-rose-950/40 border border-rose-500/30 rounded-lg text-xs text-rose-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{aiError}</span>
        </div>
      )}

      {/* Daftar Kartu Proyek Rekomendasi */}
      <div className="space-y-6">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/50 border border-dashed border-slate-800 rounded-2xl space-y-3">
            <Layers className="w-10 h-10 text-slate-600 mx-auto" />
            <h4 className="font-semibold text-slate-300 text-base">Tidak ada proyek yang cocok dengan filter saat ini</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Coba pilih filter kesulitan "Semua", tambahkan variasi alat dan bahan di langkah sebelumnya, atau gunakan tombol AI Gemini di atas.
            </p>
          </div>
        ) : (
          filteredProjects.map((project, idx) => {
            const isTopMatch = idx === 0 && project.readinessPercentage >= 40;
            const isAiGenerated =
              project.id.startsWith('sim-gemini') ||
              project.id.startsWith('sim-ai') ||
              project.title.includes('AI Gemini');
            return (
              <div
                key={project.id}
                className={`bg-slate-900 border rounded-2xl p-6 sm:p-7 shadow-lg transition-all relative overflow-hidden ${
                  isAiGenerated
                    ? 'border-purple-500/50 ring-2 ring-purple-500/20 shadow-purple-950/50 bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950/20'
                    : isTopMatch
                    ? 'border-indigo-500/50 ring-1 ring-indigo-500/20 shadow-indigo-950/40'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Header Proyek */}
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 pb-5 border-b border-slate-800">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-400/30 text-indigo-300">
                        {project.targetProfession}
                      </span>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        Kesulitan: {project.difficulty}
                      </span>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {project.estimatedHours}
                      </span>
                      {isAiGenerated && (
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-400/40 text-purple-300 flex items-center gap-1 shadow-sm">
                          <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
                          Dirancang Khusus oleh AI Gemini
                        </span>
                      )}
                      {!isAiGenerated && isTopMatch && (
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          Rekomendasi Utama
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      {project.title}
                    </h3>
                  </div>

                  {/* Kesiapan Meter */}
                  <div className="shrink-0 bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 flex items-center gap-4">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Kesiapan Sumber Daya:</span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span
                          className={`text-2xl font-black ${
                            project.readinessPercentage >= 75
                              ? 'text-emerald-400'
                              : project.readinessPercentage >= 40
                              ? 'text-amber-400'
                              : 'text-rose-400'
                          }`}
                        >
                          {project.readinessPercentage}%
                        </span>
                        <span className="text-[11px] text-slate-500">siap mulai</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-full border-4 border-slate-800 flex items-center justify-center relative">
                      <div
                        className={`w-9 h-9 rounded-full ${
                          project.readinessPercentage >= 75
                            ? 'bg-emerald-500/20'
                            : project.readinessPercentage >= 40
                            ? 'bg-amber-500/20'
                            : 'bg-rose-500/20'
                        }`}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* ALASAN REPRESENTASI: Mengapa proyek ini mensimulasikan profesi */}
                <div className="my-5 p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20 space-y-1.5">
                  <div className="flex items-center gap-2 text-indigo-300 font-semibold text-xs uppercase tracking-wider">
                    <Lightbulb className="w-4 h-4 text-amber-400" />
                    Mengapa Proyek Sederhana Ini Merepresentasikan Profesi {project.targetProfession}:
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {project.representationRationale}
                  </p>
                </div>

                {/* Detail Alat & Bahan (Checklist Ketersediaan) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-5">
                  {/* Alat */}
                  <div className="bg-slate-950/50 rounded-xl p-3.5 border border-slate-800/80">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <Wrench className="w-3.5 h-3.5 text-amber-400" />
                        Alat yang Digunakan:
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {project.toolsUsed.filter((t) => t.available).length}/{project.toolsUsed.length} Ada
                      </span>
                    </div>
                    <ul className="space-y-1.5">
                      {project.toolsUsed.map((tool, tIdx) => (
                        <li key={tIdx} className="text-xs flex items-center justify-between text-slate-300">
                          <span className="truncate pr-2">{tool.name}</span>
                          {tool.available ? (
                            <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                              <CheckCircle2 className="w-2.5 h-2.5" /> Ada
                            </span>
                          ) : (
                            <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                              Belum Ada
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Bahan */}
                  <div className="bg-slate-950/50 rounded-xl p-3.5 border border-slate-800/80">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <Package className="w-3.5 h-3.5 text-emerald-400" />
                        Bahan Baku / Habis Pakai:
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {project.materialsUsed.filter((m) => m.available).length}/{project.materialsUsed.length} Ada
                      </span>
                    </div>
                    <ul className="space-y-1.5">
                      {project.materialsUsed.map((mat, mIdx) => (
                        <li key={mIdx} className="text-xs flex items-center justify-between text-slate-300">
                          <span className="truncate pr-2">
                            {mat.name} {mat.quantity ? `(${mat.quantity})` : ''}
                          </span>
                          {mat.available ? (
                            <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                              <CheckCircle2 className="w-2.5 h-2.5" /> Ada
                            </span>
                          ) : (
                            <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                              Belum Ada
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Usulan Alternatif Kreatif jika ada bahan/alat yang belum ada */}
                {project.alternativeMaterialsSuggested && project.alternativeMaterialsSuggested.length > 0 && (
                  <div className="mb-5 p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1">
                    <span className="font-semibold text-slate-300 text-[11px] block">
                      💡 Ide Pengganti Bahan Alternatif di Sekitar Siswa:
                    </span>
                    {project.alternativeMaterialsSuggested.map((alt, aIdx) => (
                      <p key={aIdx} className="text-slate-400 leading-relaxed">
                        • {alt}
                      </p>
                    ))}
                  </div>
                )}

                {/* Kompetensi & Deliverable */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-3 border-t border-slate-800/80 text-xs">
                  <div>
                    <span className="font-semibold text-slate-300 block mb-1">
                      Kompetensi Vokasi yang Dikuasai:
                    </span>
                    <ul className="space-y-1 text-slate-400">
                      {project.coreCompetenciesLearned.map((comp, cIdx) => (
                        <li key={cIdx} className="flex items-start gap-1.5">
                          <span className="text-indigo-400">✓</span>
                          <span>{comp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-300 block mb-1">
                      Output Nyata (Deliverable):
                    </span>
                    <p className="text-slate-400 leading-relaxed">{project.deliverable}</p>
                    <div className="mt-2.5 flex items-center gap-1.5 text-amber-300">
                      <Award className="w-4 h-4" />
                      <span className="font-semibold text-[11px]">Lencana: {project.badgeEarned}</span>
                    </div>
                  </div>
                </div>

                {/* Tombol Mulai Simulasi & Simpan Ide */}
                {(() => {
                  const saved = isProjectSaved ? isProjectSaved(project.id) : false;
                  return (
                    <div className="mt-5 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                      <div className="text-[11px] text-slate-500 text-center sm:text-left">
                        {project.steps.length} Langkah Terpandu dengan Protokol K3 & Checkpoint
                      </div>
                      <div className="flex flex-col xs:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                        {onSaveProjectIdea && (
                          <button
                            type="button"
                            onClick={() => {
                              if (saved && onRemoveProjectIdea) {
                                onRemoveProjectIdea(project.id);
                              } else {
                                onSaveProjectIdea(project);
                              }
                            }}
                            className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 min-h-[42px] sm:min-h-0 ${
                              saved
                                ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300 hover:bg-rose-950/50 hover:border-rose-500/40 hover:text-rose-300'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                            }`}
                            title={saved ? 'Klik untuk membatalkan simpan ide ini' : 'Simpan ide rancangan proyek ini'}
                          >
                            {saved ? (
                              <>
                                <BookmarkCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>Tersimpan</span>
                              </>
                            ) : (
                              <>
                                <Bookmark className="w-4 h-4 text-slate-400 shrink-0" />
                                <span>Simpan Ide</span>
                              </>
                            )}
                          </button>
                        )}
                        <button
                          onClick={() => onOpenSimulation(project)}
                          className="flex-1 sm:flex-initial px-5 sm:px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2 group min-h-[42px] sm:min-h-0 active:scale-95"
                        >
                          <span>Mulai Panduan Praktik (Jobsheet)</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            );
          })
        )}
      </div>

      {/* Navigasi Bawah */}
      <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          onClick={onBackToResources}
          className="w-full sm:w-auto px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          <span>Kembali ke Alat & Bahan Purwarupa</span>
        </button>
      </div>
    </div>
  );
}
