import React, { useState } from 'react';
import { RecommendedProject, AvailableResources } from '../types/recommender';
import {
  Sparkles,
  X,
  Wrench,
  Package,
  Cpu,
  Loader2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Award,
  Zap,
  Sliders,
  HelpCircle,
  Bookmark,
  BookmarkCheck,
  Save,
  Play,
  Check,
} from 'lucide-react';
import { auth, getUserAuthToken } from '../firebase';

interface AiProjectGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetProfession: string;
  availableResources: AvailableResources;
  onProjectGenerated: (project: RecommendedProject) => void;
  onSaveProjectIdea?: (project: RecommendedProject, note?: string) => void;
  isProjectSaved?: (projectId: string) => boolean;
  onOpenSimulation?: (project: RecommendedProject) => void;
  onViewSavedIdeas?: () => void;
}

export function AiProjectGeneratorModal({
  isOpen,
  onClose,
  targetProfession: initialProfession,
  availableResources: initialResources,
  onProjectGenerated,
  onSaveProjectIdea,
  isProjectSaved,
  onOpenSimulation,
  onViewSavedIdeas,
}: AiProjectGeneratorModalProps) {
  if (!isOpen) return null;

  const [profession, setProfession] = useState(initialProfession || 'Teknik Sepeda Motor & Otomotif (TBSM)');
  const [toolsInput, setToolsInput] = useState(initialResources.tools.join(', '));
  const [materialsInput, setMaterialsInput] = useState(initialResources.materials.join(', '));
  const [focusOption, setFocusOption] = useState('Standar Praktik & Industri');
  const [difficulty, setDifficulty] = useState<'Mudah' | 'Sedang' | 'Menantang'>('Mudah');
  const [customNote, setCustomNote] = useState('');
  const [customApiKey, setCustomApiKey] = useState(() => localStorage.getItem('vocation_user_gemini_key') || '');
  const [showKeyInput, setShowKeyInput] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState('');
  const [generatedProject, setGeneratedProject] = useState<RecommendedProject | null>(null);
  
  // State for saving the newly generated project
  const [studentSaveNote, setStudentSaveNote] = useState('');
  const [hasJustSaved, setHasJustSaved] = useState(false);

  const FOCUS_PRESETS = [
    { id: 'industry', label: '🏭 Standar Praktik & Industri', desc: 'Mensimulasikan SOP bengkel/lab industri nyata' },
    { id: 'recycle', label: '♻️ Kreatif Daur Ulang & Zero Waste', desc: 'Memaksimalkan limbah barang bekas sekitar' },
    { id: 'home', label: '🏠 Rumahan & Ramah Pemula', desc: 'Aman dikerjakan mandiri tanpa risiko listrik tinggi' },
    { id: 'ukk', label: '🏆 Standar Uji Kompetensi Keahlian (UKK)', desc: 'Fokus pada capaian portofolio nilai SMK' },
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profession.trim()) return;

    if (customApiKey) {
      localStorage.setItem('vocation_user_gemini_key', customApiKey.trim());
    }

    setIsLoading(true);
    setGeneratedProject(null);
    setLoadingPhase('Menghubungkan ke Google Gemini AI (gemini-3.8-flash)...');

    const toolsArray = toolsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const materialsArray = materialsInput
      .split(',')
      .map((m) => m.trim())
      .filter(Boolean);

    const timer1 = setTimeout(() => {
      setLoadingPhase('Menganalisis kompetensi kejuruan & ketersediaan perkakas...');
    }, 1500);

    const timer2 = setTimeout(() => {
      setLoadingPhase('Menyusun langkah kerja praktis, checkpoint K3, & lencana keahlian...');
    }, 3200);

    try {
      const userToken = await getUserAuthToken();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (userToken) {
        headers['Authorization'] = `Bearer ${userToken}`;
      }
      if (customApiKey.trim()) {
        headers['x-gemini-key'] = customApiKey.trim();
      }

      const res = await fetch('/api/recommend-projects', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          targetProfession: profession,
          availableTools: toolsArray,
          availableMaterials: materialsArray,
          focusOption,
          difficulty,
          customNotes: customNote,
        }),
      });

      const data = await res.json();
      clearTimeout(timer1);
      clearTimeout(timer2);

      if (data && data.project) {
        // Tag project as AI generated
        const proj: RecommendedProject = {
          ...data.project,
          title: data.project.title.startsWith('✨') ? data.project.title : `✨ [AI Gemini] ${data.project.title}`,
        };
        setGeneratedProject(proj);
        onProjectGenerated(proj);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
      setLoadingPhase('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn">
      <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[96vh] sm:max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950/50 to-purple-950/40 border-b border-slate-800 p-4 sm:p-5 md:p-6 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold shrink-0">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <h2 className="text-base sm:text-xl font-bold text-white tracking-tight truncate">
                  Studio Perancang Proyek Vokasi AI
                </h2>
                <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 flex items-center gap-1 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Gemini 3.8 Flash
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 hidden xs:block truncate">
                Rancang ide simulasi proyek kustom berbasis ketersediaan alat dan bahan siswa
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 md:p-6 space-y-5">
          {!generatedProject ? (
            <form onSubmit={handleGenerate} className="space-y-4">
              {/* Target Profesi */}
              <div>
                <label className="text-xs font-bold text-slate-200 block mb-1.5">
                  1. Profesi atau Bidang Usaha yang Ingin Disimulasikan:
                </label>
                <input
                  type="text"
                  required
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  placeholder="Contoh: Barista Minuman Kopi, Teknisi Kelistrikan Sepeda Motor, Hidroponik Selada..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Grid Alat & Bahan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5 mb-1.5">
                    <Wrench className="w-3.5 h-3.5 text-amber-400" />
                    <span>2. Alat yang Ada di Sekitar Siswa:</span>
                  </label>
                  <textarea
                    rows={3}
                    value={toolsInput}
                    onChange={(e) => setToolsInput(e.target.value)}
                    placeholder="Pisahkan dengan koma (contoh: Obeng, Tang, Gunting, Solder, Smartphone)..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5 mb-1.5">
                    <Package className="w-3.5 h-3.5 text-emerald-400" />
                    <span>3. Bahan Baku yang Ada di Sekitar Siswa:</span>
                  </label>
                  <textarea
                    rows={3}
                    value={materialsInput}
                    onChange={(e) => setMaterialsInput(e.target.value)}
                    placeholder="Pisahkan dengan koma (contoh: Botol bekas, Kabel sisa, Tepung, Kardus, Busi bekas)..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Fokus Simulasi AI */}
              <div>
                <label className="text-xs font-bold text-slate-200 block mb-2">
                  4. Pilih Pendekatan & Fokus Simulasi AI:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {FOCUS_PRESETS.map((preset) => (
                    <div
                      key={preset.id}
                      onClick={() => setFocusOption(preset.label)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        focusOption === preset.label
                          ? 'bg-indigo-950/60 border-indigo-500 ring-1 ring-indigo-500/40'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-xs font-bold text-white block mb-0.5">
                        {preset.label}
                      </span>
                      <span className="text-[11px] text-slate-400 block">
                        {preset.desc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Kesulitan & Catatan Khusus */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="text-xs font-bold text-slate-200 block mb-1.5">
                    Tingkat Kesulitan:
                  </label>
                  <div className="flex gap-2">
                    {(['Mudah', 'Sedang', 'Menantang'] as const).map((d) => (
                      <button
                        type="button"
                        key={d}
                        onClick={() => setDifficulty(d)}
                        className={`flex-1 py-2 text-xs rounded-lg font-medium transition-colors ${
                          difficulty === d
                            ? 'bg-indigo-600 text-white font-bold'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-200 block mb-1.5">
                    Catatan Tambahan (Opsional):
                  </label>
                  <input
                    type="text"
                    value={customNote}
                    onChange={(e) => setCustomNote(e.target.value)}
                    placeholder="Contoh: Tanpa menggunakan kompor api besar..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Status Token Akun Pengguna & Opsi Kunci Pribadi */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {auth.currentUser?.photoURL ? (
                      <img
                        src={auth.currentUser.photoURL}
                        alt="User"
                        className="w-5 h-5 rounded-full object-cover border border-emerald-500"
                      />
                    ) : (
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    )}
                    <span className="text-slate-300">
                      Token Pengguna:{' '}
                      <strong className="text-white">
                        {auth.currentUser?.displayName || auth.currentUser?.email || 'Akun Default Sistem'}
                      </strong>
                    </span>
                  </div>
                  {auth.currentUser ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                      Akun Google Aktif
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px]">
                      Mode Tamu
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => setShowKeyInput(!showKeyInput)}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                  >
                    <span>{showKeyInput ? 'Sembunyikan' : 'Gunakan Token / API Key Gemini Pribadi'}</span>
                  </button>
                  {customApiKey && (
                    <span className="text-[10px] text-emerald-400 font-mono">Kunci kustom terpasang</span>
                  )}
                </div>

                {showKeyInput && (
                  <div className="pt-2 space-y-1">
                    <input
                      type="password"
                      value={customApiKey}
                      onChange={(e) => setCustomApiKey(e.target.value)}
                      placeholder="Masukkan Google Gemini API Key pribadi (AIzaSy...)"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <p className="text-[10px] text-slate-500">
                      Opsional: Token ini akan digunakan secara langsung untuk kuota akun pribadi Anda.
                    </p>
                  </div>
                )}
              </div>

              {/* Tombol Rancang */}
              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto px-7 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 group"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>{loadingPhase || 'Memproses dengan AI Gemini...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Rancang Proyek Baru dengan AI Gemini</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Tampilan Hasil Proyek yang Dirancang AI */
            <div className="space-y-5 animate-fadeIn">
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-emerald-300">
                    Proyek Berhasil Dirancang Khusus oleh AI Gemini!
                  </h4>
                  <p className="text-xs text-slate-300">
                    Ide proyek telah otomatis disisipkan ke daftar rekomendasi Anda.
                  </p>
                </div>
              </div>

              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                    {generatedProject.targetProfession}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    Waktu: {generatedProject.estimatedHours}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                    Kesiapan: {generatedProject.readinessPercentage}%
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white">
                  {generatedProject.title}
                </h3>

                <div className="p-3.5 rounded-lg bg-indigo-950/30 border border-indigo-500/20 text-xs text-slate-200">
                  <strong className="text-indigo-300 block mb-1">
                    Mengapa Proyek Ini Merepresentasikan Profesi:
                  </strong>
                  {generatedProject.representationRationale}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="font-bold text-amber-300 block mb-1">Perkakas yang Digunakan:</span>
                    <ul className="text-slate-300 space-y-1">
                      {generatedProject.toolsUsed.map((t, idx) => (
                        <li key={idx}>✓ {t.name}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="font-bold text-emerald-300 block mb-1">Bahan Baku:</span>
                    <ul className="text-slate-300 space-y-1">
                      {generatedProject.materialsUsed.map((m, idx) => (
                        <li key={idx}>✓ {m.name}</li>
                      ))}
                    </ul>
                  </div>
                </div>

              {/* Detail Output Nyata Siswa */}
                <div className="p-3 rounded-lg bg-slate-900 text-xs text-slate-400">
                  <strong className="text-slate-300 block mb-1">Output Nyata Siswa:</strong>
                  {generatedProject.deliverable}
                </div>
              </div>

              {/* Fitur Simpan Ide Proyek Baru */}
              {(() => {
                const isSaved = isProjectSaved ? isProjectSaved(generatedProject.id) : hasJustSaved;
                const handleSaveClick = () => {
                  if (onSaveProjectIdea && generatedProject) {
                    onSaveProjectIdea(generatedProject, studentSaveNote);
                    setHasJustSaved(true);
                  }
                };

                return (
                  <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                          <Bookmark className="w-4 h-4" />
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-white">Simpan Rancangan Ide Proyek Ini</h5>
                          <p className="text-[11px] text-slate-400">
                            Simpan ke koleksi ide Anda agar dapat dibuka kapan saja tanpa hilang.
                          </p>
                        </div>
                      </div>
                      {isSaved && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          Tersimpan
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                        Catatan Siswa / Rencana Praktik (Opsional):
                      </label>
                      <input
                        type="text"
                        value={studentSaveNote}
                        onChange={(e) => setStudentSaveNote(e.target.value)}
                        placeholder="Contoh: Praktik mandiri akhir pekan / tugas semester lab..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleSaveClick}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                          isSaved
                            ? 'bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/60'
                            : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-900/30'
                        }`}
                      >
                        {isSaved ? (
                          <>
                            <BookmarkCheck className="w-4 h-4 text-emerald-400" />
                            <span>Perbarui Simpanan</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            <span>Simpan Rancangan Ide Ini</span>
                          </>
                        )}
                      </button>

                      {onViewSavedIdeas && (
                        <button
                          type="button"
                          onClick={() => {
                            if (!isSaved) handleSaveClick();
                            onViewSavedIdeas();
                            onClose();
                          }}
                          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
                        >
                          <Bookmark className="w-3.5 h-3.5 text-slate-400" />
                          <span>Lihat Koleksi Ide Tersimpan</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()}

              <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <button
                  onClick={() => {
                    setGeneratedProject(null);
                    setHasJustSaved(false);
                    setStudentSaveNote('');
                  }}
                  className="px-4 py-2.5 sm:py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors text-center min-h-[42px] sm:min-h-0"
                >
                  Rancang Proyek Lain
                </button>
                <div className="flex flex-col xs:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                  {onOpenSimulation && (
                    <button
                      onClick={() => {
                        const isSaved = isProjectSaved ? isProjectSaved(generatedProject.id) : hasJustSaved;
                        if (!isSaved && onSaveProjectIdea) {
                          onSaveProjectIdea(generatedProject, studentSaveNote);
                        }
                        onOpenSimulation(generatedProject);
                        onClose();
                      }}
                      className="px-4 py-2.5 sm:py-2 bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center justify-center gap-1.5 min-h-[42px] sm:min-h-0 active:scale-95"
                    >
                      <Play className="w-3.5 h-3.5 shrink-0" />
                      <span>Buka Jobsheet Praktik</span>
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="px-5 py-2.5 sm:py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow transition-colors flex items-center justify-center gap-2 min-h-[42px] sm:min-h-0 active:scale-95"
                  >
                    <span>Lihat di Halaman Proyek</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
