import React, { useState, useEffect } from 'react';
import {
  AvailableResources,
  PrototypeKitRecommendation,
  RecommendedToolItem,
  RecommendedMaterialItem,
  RecommendedProject,
} from '../types/recommender';
import { synthesizePrototypeKit } from '../utils/aiSynthesizer';
import {
  Sparkles,
  Wrench,
  Package,
  CheckCircle2,
  Circle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Plus,
  Trash2,
  Lightbulb,
  ShieldAlert,
  Award,
  Clock,
  Layers,
  Leaf,
  Store,
  Zap,
  Check,
  HelpCircle,
} from 'lucide-react';

interface ResourcesStepProps {
  selectedProfession: string;
  resources: AvailableResources;
  onChangeResources: (updated: AvailableResources) => void;
  onNext: () => void;
  onBack: () => void;
}

export function ResourcesStep({
  selectedProfession,
  resources,
  onChangeResources,
  onNext,
  onBack,
}: ResourcesStepProps) {
  const [prototypeKit, setPrototypeKit] = useState<PrototypeKitRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeMode, setActiveMode] = useState<'standard' | 'recycled' | 'commercial'>('standard');
  const [customNotes, setCustomNotes] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Input manual tambahan bila siswa ingin menambahkan alat/bahan ekstra
  const [newToolName, setNewToolName] = useState('');
  const [newToolRole, setNewToolRole] = useState('');
  const [showAddToolForm, setShowAddToolForm] = useState(false);

  const [newMatName, setNewMatName] = useState('');
  const [newMatQty, setNewMatQty] = useState('');
  const [newMatRole, setNewMatRole] = useState('');
  const [showAddMatForm, setShowAddMatForm] = useState(false);

  // Panggil AI untuk merekomendasikan alat & bahan yang harus ada untuk purwarupa
  const fetchPrototypeKit = async (mode: 'standard' | 'recycled' | 'commercial', notes?: string) => {
    if (!selectedProfession) return;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/recommend-prototype-kit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetProfession: selectedProfession,
          prototypeMode: mode,
          customNotes: notes || customNotes,
        }),
      });

      if (!res.ok) {
        throw new Error(`Gagal memuat rekomendasi purwarupa (${res.status})`);
      }

      const data = await res.json();
      if (data.prototypeKit) {
        setPrototypeKit(data.prototypeKit);
        syncResourcesToParent(data.prototypeKit.tools, data.prototypeKit.materials);
      } else {
        throw new Error('Respon AI kosong');
      }
    } catch (err: any) {
      console.warn('Fallback ke sintesis lokal kurikulum vokasi:', err);
      const fallback = synthesizePrototypeKit({
        targetProfession: selectedProfession,
        prototypeMode: mode,
        customNotes: notes || customNotes,
      });
      setPrototypeKit(fallback);
      syncResourcesToParent(fallback.tools, fallback.materials);
      setErrorMessage('Menggunakan rekomendasi kurikulum cerdas standar kejuruan SMK.');
    } finally {
      setIsLoading(false);
    }
  };

  // Sinkronisasikan alat & bahan yang berstatus "available" ke state parent (agar kompatibel penuh dengan jobsheet & simulator)
  const syncResourcesToParent = (tools: RecommendedToolItem[], materials: RecommendedMaterialItem[]) => {
    const activeTools = tools.filter((t) => t.available).map((t) => t.name);
    const activeMaterials = materials.filter((m) => m.available).map((m) => m.name);
    onChangeResources({
      tools: activeTools,
      materials: activeMaterials,
      notes: prototypeKit?.prototypeTitle,
    });
  };

  // Muat pertama kali ketika profesi berubah atau belum ada data
  useEffect(() => {
    if (selectedProfession && (!prototypeKit || prototypeKit.targetProfession !== selectedProfession)) {
      fetchPrototypeKit(activeMode);
    }
  }, [selectedProfession]);

  // Toggle ketersediaan alat
  const handleToggleTool = (toolId: string) => {
    if (!prototypeKit) return;
    const updatedTools = prototypeKit.tools.map((t) =>
      t.id === toolId ? { ...t, available: !t.available } : t
    );
    const updatedKit = { ...prototypeKit, tools: updatedTools };
    setPrototypeKit(updatedKit);
    syncResourcesToParent(updatedTools, prototypeKit.materials);
  };

  // Toggle ketersediaan bahan
  const handleToggleMaterial = (matId: string) => {
    if (!prototypeKit) return;
    const updatedMaterials = prototypeKit.materials.map((m) =>
      m.id === matId ? { ...m, available: !m.available } : m
    );
    const updatedKit = { ...prototypeKit, materials: updatedMaterials };
    setPrototypeKit(updatedKit);
    syncResourcesToParent(prototypeKit.tools, updatedMaterials);
  };

  // Hapus item alat
  const handleRemoveTool = (toolId: string) => {
    if (!prototypeKit) return;
    const updatedTools = prototypeKit.tools.filter((t) => t.id !== toolId);
    const updatedKit = { ...prototypeKit, tools: updatedTools };
    setPrototypeKit(updatedKit);
    syncResourcesToParent(updatedTools, prototypeKit.materials);
  };

  // Hapus item bahan
  const handleRemoveMaterial = (matId: string) => {
    if (!prototypeKit) return;
    const updatedMaterials = prototypeKit.materials.filter((m) => m.id !== matId);
    const updatedKit = { ...prototypeKit, materials: updatedMaterials };
    setPrototypeKit(updatedKit);
    syncResourcesToParent(prototypeKit.tools, updatedMaterials);
  };

  // Tambah alat custom buatan siswa
  const handleAddCustomTool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newToolName.trim() || !prototypeKit) return;

    const newTool: RecommendedToolItem = {
      id: `custom-tool-${Date.now()}`,
      name: newToolName.trim(),
      role: newToolRole.trim() || 'Alat pendukung pengerjaan purwarupa',
      isCritical: false,
      lowCostAlternative: 'Tersedia di lingkungan sekitar siswa',
      available: true,
    };

    const updatedTools = [...prototypeKit.tools, newTool];
    const updatedKit = { ...prototypeKit, tools: updatedTools };
    setPrototypeKit(updatedKit);
    syncResourcesToParent(updatedTools, prototypeKit.materials);

    setNewToolName('');
    setNewToolRole('');
    setShowAddToolForm(false);
  };

  // Tambah bahan custom buatan siswa
  const handleAddCustomMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMatName.trim() || !prototypeKit) return;

    const newMaterial: RecommendedMaterialItem = {
      id: `custom-mat-${Date.now()}`,
      name: newMatName.trim(),
      quantity: newMatQty.trim() || 'Secukupnya',
      role: newMatRole.trim() || 'Bahan uji pelengkap purwarupa',
      recycledAlternative: 'Bahan sekitar atau daur ulang',
      available: true,
    };

    const updatedMaterials = [...prototypeKit.materials, newMaterial];
    const updatedKit = { ...prototypeKit, materials: updatedMaterials };
    setPrototypeKit(updatedKit);
    syncResourcesToParent(prototypeKit.tools, updatedMaterials);

    setNewMatName('');
    setNewMatQty('');
    setNewMatRole('');
    setShowAddMatForm(false);
  };

  // Hitung tingkat kesiapan purwarupa
  const totalItems = (prototypeKit?.tools.length || 0) + (prototypeKit?.materials.length || 0);
  const availableToolsCount = prototypeKit?.tools.filter((t) => t.available).length || 0;
  const availableMaterialsCount = prototypeKit?.materials.filter((m) => m.available).length || 0;
  const totalAvailable = availableToolsCount + availableMaterialsCount;
  const readinessPercentage = totalItems > 0 ? Math.round((totalAvailable / totalItems) * 100) : 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Utama AI Rekomendasi */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/30 text-indigo-300 text-[11px] sm:text-xs font-semibold uppercase tracking-wider mb-3 sm:mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse shrink-0" />
            <span>Langkah 2 dari 3: Rekomendasi Alat & Bahan Purwarupa AI</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
            AI Menganalisis Kebutuhan Purwarupa untuk: <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-emerald-300">
              {selectedProfession}
            </span>
          </h2>
          <p className="mt-2 text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed">
            Siswa tidak perlu lagi bingung menebak-nebak alat atau bahan apa yang dibutuhkan. AI telah merekomendasikan 
            <strong className="text-emerald-300"> daftar alat dan bahan baku yang harus ada</strong> untuk membuat purwarupa representatif, lengkap dengan 
            alternatif murah dan bahan daur ulang di sekitar siswa.
          </p>
        </div>
      </div>

      {/* Mode Selector & Action Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 sm:p-5 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <span className="text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider shrink-0">
            Pendekatan Purwarupa:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 w-full sm:w-auto">
            <button
              onClick={() => {
                setActiveMode('standard');
                fetchPrototypeKit('standard');
              }}
              disabled={isLoading}
              className={`px-3 py-2 sm:py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 min-h-[40px] sm:min-h-0 ${
                activeMode === 'standard'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>Standar Vokasi SMK</span>
            </button>

            <button
              onClick={() => {
                setActiveMode('recycled');
                fetchPrototypeKit('recycled');
              }}
              disabled={isLoading}
              className={`px-3 py-2 sm:py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 min-h-[40px] sm:min-h-0 ${
                activeMode === 'recycled'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-1 ring-emerald-400'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
              }`}
              title="Fokus 100% menggunakan bahan daur ulang, kardus bekas, dan barang sekitar (Zero Cost)"
            >
              <Leaf className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
              <span>Bahan Daur Ulang</span>
            </button>

            <button
              onClick={() => {
                setActiveMode('commercial');
                fetchPrototypeKit('commercial');
              }}
              disabled={isLoading}
              className={`px-3 py-2 sm:py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 min-h-[40px] sm:min-h-0 ${
                activeMode === 'commercial'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 ring-1 ring-purple-400'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
              }`}
              title="Fokus pada purwarupa sampel produk atau model usaha komersial bernilai jual"
            >
              <Store className="w-3.5 h-3.5 text-purple-300 shrink-0" />
              <span>Sampel Usaha Komersial</span>
            </button>
          </div>
        </div>

        <button
          onClick={() => fetchPrototypeKit(activeMode)}
          disabled={isLoading}
          className="w-full lg:w-auto px-4 py-2.5 sm:py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2 shrink-0 active:scale-95 min-h-[42px] sm:min-h-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-indigo-400' : 'text-slate-400'} shrink-0`} />
          <span>{isLoading ? 'AI Sedang Menganalisis...' : 'Rancang Ulang dengan AI'}</span>
        </button>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-8 text-center space-y-4 animate-pulse">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6 animate-spin text-amber-300" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">AI Gemini Sedang Menganalisis Kebutuhan Purwarupa</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Menghitung spesifikasi alat tangan yang harus ada, bahan baku representatif, serta alternatif barang bekas di sekitar lingkungan siswa SMK...
            </p>
          </div>
        </div>
      )}

      {/* Konten Rekomendasi Purwarupa AI */}
      {!isLoading && prototypeKit && (
        <div className="space-y-6">
          {/* Kartu Konsep Purwarupa yang Dihasilkan AI */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Rancangan Purwarupa Terpilih
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 font-semibold text-slate-200">
                  {prototypeKit.difficulty}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 font-semibold text-slate-200 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-indigo-400" /> {prototypeKit.estimatedHours}
                </span>
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
              {prototypeKit.prototypeTitle}
            </h3>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs sm:text-sm text-slate-300 space-y-1.5">
              <span className="text-indigo-300 font-bold flex items-center gap-1.5 text-xs">
                <Lightbulb className="w-4 h-4 text-amber-400" /> Mengapa Purwarupa Ini Merepresentasikan Profesi Target:
              </span>
              <p className="text-slate-300 leading-relaxed">{prototypeKit.prototypeRationale}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
                <span className="text-slate-400 block mb-0.5 font-medium">Output Fisik Purwarupa:</span>
                <span className="text-slate-200 font-semibold">{prototypeKit.deliverable}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
                <span className="text-slate-400 block mb-0.5 font-medium">Kompetensi yang Dilatih:</span>
                <span className="text-slate-200 font-semibold">
                  {prototypeKit.coreCompetencies.slice(0, 2).join(' • ')}
                </span>
              </div>
            </div>
          </div>

          {/* Indikator Kesiapan Purwarupa Siswa */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <h4 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  Kesiapan Alat & Bahan di Sekitar Siswa: {readinessPercentage}%
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Centang item yang sudah Anda miliki di rumah atau sekolah. Gunakan saran alternatif murah dari AI untuk item yang belum ada.
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-indigo-300">
                  {totalAvailable} dari {totalItems} Kebutuhan Terpenuhi
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  readinessPercentage >= 75
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                    : readinessPercentage >= 40
                    ? 'bg-gradient-to-r from-amber-500 to-indigo-500'
                    : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                }`}
                style={{ width: `${Math.max(readinessPercentage, 5)}%` }}
              ></div>
            </div>
          </div>

          {/* Grid Dua Kolom: ALAT YANG HARUS ADA vs BAHAN BAKU PURWARUPA */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* KOLOM 1: ALAT YANG HARUS ADA */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold">
                      <Wrench className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base">Alat yang Harus Ada</h4>
                      <p className="text-xs text-slate-400">Direkomendasikan AI untuk purwarupa ini</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-800 text-amber-300 border border-slate-700">
                    {availableToolsCount} / {prototypeKit.tools.length} Ada
                  </span>
                </div>

                {/* List Kartu Alat */}
                <div className="mt-4 space-y-3">
                  {prototypeKit.tools.map((tool) => (
                    <div
                      key={tool.id}
                      onClick={() => handleToggleTool(tool.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer select-none space-y-2 ${
                        tool.available
                          ? 'bg-emerald-950/20 border-emerald-500/40 hover:border-emerald-400'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <button
                            type="button"
                            className={`w-5 h-5 rounded-md mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                              tool.available
                                ? 'bg-emerald-500 text-slate-950'
                                : 'border border-slate-600 bg-slate-900 text-transparent'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </button>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`font-bold text-sm ${tool.available ? 'text-white' : 'text-slate-300'}`}>
                                {tool.name}
                              </span>
                              {tool.isCritical ? (
                                <span className="text-[10px] px-2 py-0.2 rounded font-bold bg-rose-950/80 text-rose-300 border border-rose-800/60">
                                  Wajib
                                </span>
                              ) : (
                                <span className="text-[10px] px-2 py-0.2 rounded font-semibold bg-slate-800 text-slate-300">
                                  Pendukung
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{tool.role}</p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveTool(tool.id);
                          }}
                          className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors"
                          title="Hapus dari daftar purwarupa"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Kotak Alternatif Murah di Sekitar Siswa */}
                      {tool.lowCostAlternative && (
                        <div className="mt-1 p-2 rounded-lg bg-amber-950/20 border border-amber-500/20 text-[11px] text-amber-200/90 flex items-start gap-1.5">
                          <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span>
                            <strong>Alternatif Sederhana Sekitar:</strong> {tool.lowCostAlternative}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tambah Alat Custom */}
              <div className="mt-4 pt-3 border-t border-slate-800/80">
                {!showAddToolForm ? (
                  <button
                    onClick={() => setShowAddToolForm(true)}
                    className="w-full py-2 bg-slate-800/60 hover:bg-slate-800 border border-dashed border-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5 text-amber-400" />
                    <span>Punya Alat Lain di Sekitar? Tambah Manual</span>
                  </button>
                ) : (
                  <form onSubmit={handleAddCustomTool} className="space-y-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-xs font-bold text-slate-200 block">Tambah Alat Temuan Siswa:</span>
                    <input
                      type="text"
                      value={newToolName}
                      onChange={(e) => setNewToolName(e.target.value)}
                      placeholder="Nama alat (misal: Solder uap, Gunting kuku, Palu kecil)..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    <input
                      type="text"
                      value={newToolRole}
                      onChange={(e) => setNewToolRole(e.target.value)}
                      placeholder="Fungsi pada purwarupa (opsional)..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => setShowAddToolForm(false)}
                        className="px-3 py-1 text-xs text-slate-400 hover:text-white"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        disabled={!newToolName.trim()}
                        className="px-3 py-1 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-semibold text-xs rounded-lg shadow"
                      >
                        Simpan Alat
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* KOLOM 2: BAHAN BAKU PURWARUPA YANG HARUS ADA */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold">
                      <Package className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base">Bahan Baku Purwarupa</h4>
                      <p className="text-xs text-slate-400">Komponen fisik yang dirakit menjadi purwarupa</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-800 text-emerald-300 border border-slate-700">
                    {availableMaterialsCount} / {prototypeKit.materials.length} Ada
                  </span>
                </div>

                {/* List Kartu Bahan */}
                <div className="mt-4 space-y-3">
                  {prototypeKit.materials.map((mat) => (
                    <div
                      key={mat.id}
                      onClick={() => handleToggleMaterial(mat.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer select-none space-y-2 ${
                        mat.available
                          ? 'bg-emerald-950/20 border-emerald-500/40 hover:border-emerald-400'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <button
                            type="button"
                            className={`w-5 h-5 rounded-md mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                              mat.available
                                ? 'bg-emerald-500 text-slate-950'
                                : 'border border-slate-600 bg-slate-900 text-transparent'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </button>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`font-bold text-sm ${mat.available ? 'text-white' : 'text-slate-300'}`}>
                                {mat.name}
                              </span>
                              <span className="text-[11px] px-2 py-0.2 rounded font-mono font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
                                {mat.quantity}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{mat.role}</p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveMaterial(mat.id);
                          }}
                          className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors"
                          title="Hapus dari daftar purwarupa"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Kotak Alternatif Daur Ulang / Sekitar */}
                      {mat.recycledAlternative && (
                        <div className="mt-1 p-2 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-[11px] text-emerald-200/90 flex items-start gap-1.5">
                          <Leaf className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>
                            <strong>Alternatif Daur Ulang Sekitar:</strong> {mat.recycledAlternative}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tambah Bahan Custom */}
              <div className="mt-4 pt-3 border-t border-slate-800/80">
                {!showAddMatForm ? (
                  <button
                    onClick={() => setShowAddMatForm(true)}
                    className="w-full py-2 bg-slate-800/60 hover:bg-slate-800 border border-dashed border-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Punya Bahan Baku / Barang Bekas Lain? Tambah Manual</span>
                  </button>
                ) : (
                  <form onSubmit={handleAddCustomMaterial} className="space-y-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-xs font-bold text-slate-200 block">Tambah Bahan Temuan Siswa:</span>
                    <input
                      type="text"
                      value={newMatName}
                      onChange={(e) => setNewMatName(e.target.value)}
                      placeholder="Nama bahan (misal: Kardus sepatu, Botol sirup, Kawat jemuran)..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={newMatQty}
                        onChange={(e) => setNewMatQty(e.target.value)}
                        placeholder="Takaran/Jumlah..."
                        className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                      <input
                        type="text"
                        value={newMatRole}
                        onChange={(e) => setNewMatRole(e.target.value)}
                        placeholder="Fungsi purwarupa..."
                        className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => setShowAddMatForm(false)}
                        className="px-3 py-1 text-xs text-slate-400 hover:text-white"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        disabled={!newMatName.trim()}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-xs rounded-lg shadow"
                      >
                        Simpan Bahan
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Protokol Keselamatan Kerja K3 */}
          {prototypeKit.safetyTips && prototypeKit.safetyTips.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/20 text-xs text-amber-200/90 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-amber-300 block">Protokol Keselamatan Kerja (K3) Purwarupa:</span>
                <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                  {prototypeKit.safetyTips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navigasi Bawah */}
      <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Ganti Profesi / Usaha Target</span>
        </button>

        <button
          onClick={onNext}
          className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <span>Lanjut ke Simulasi & Jobsheet Purwarupa</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
