import React, { useState, useMemo } from 'react';
import {
  X,
  BookOpen,
  Sparkles,
  HelpCircle,
  Compass,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Search,
  Camera,
  Layers,
  FileText,
  Briefcase,
  Wrench,
  Gamepad2,
  AlertCircle,
  Lightbulb,
  ExternalLink,
  ChevronRight,
  Play,
  Check,
  RotateCcw,
} from 'lucide-react';
import {
  TUTORIAL_STEPS,
  TUTORIAL_TOPICS,
  TutorialTopic,
  TutorialStep,
  searchTutorialTopics,
  getTutorialTopicsByCategory,
} from '../utils/tutorialData';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToView?: (view: 'generator' | 'saved' | 'vocations' | 'games', step?: 1 | 2 | 3) => void;
  onOpenAiGenerator?: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({
  isOpen,
  onClose,
  onNavigateToView,
  onOpenAiGenerator,
}) => {
  const [activeTab, setActiveTab] = useState<'tour' | 'docs'>('tour');
  const [currentTourStep, setCurrentTourStep] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('quickstart-flow');
  const [copiedLink, setCopiedLink] = useState(false);

  // Filter topics based on category and search query
  const filteredTopics = useMemo(() => {
    let result = TUTORIAL_TOPICS;
    if (selectedCategory !== 'all') {
      result = getTutorialTopicsByCategory(result, selectedCategory);
    }
    if (searchQuery.trim()) {
      result = searchTutorialTopics(result, searchQuery);
    }
    return result;
  }, [selectedCategory, searchQuery]);

  const activeTopic = useMemo(() => {
    return (
      filteredTopics.find((t) => t.id === selectedTopicId) ||
      filteredTopics[0] ||
      TUTORIAL_TOPICS[0]
    );
  }, [filteredTopics, selectedTopicId]);

  if (!isOpen) return null;

  const currentStepData: TutorialStep = TUTORIAL_STEPS[currentTourStep] || TUTORIAL_STEPS[0];

  const handleNextStep = () => {
    if (currentTourStep < TUTORIAL_STEPS.length - 1) {
      setCurrentTourStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentTourStep > 0) {
      setCurrentTourStep((prev) => prev - 1);
    }
  };

  const handleActionClick = (step: TutorialStep) => {
    if (onNavigateToView) {
      onNavigateToView(step.targetView, step.targetStep);
      onClose();
    }
  };

  const handleTopicActionClick = (topic: TutorialTopic) => {
    if (topic.relatedView && onNavigateToView) {
      onNavigateToView(topic.relatedView);
      onClose();
    } else if (topic.category === 'ai' && onOpenAiGenerator) {
      onOpenAiGenerator();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[96vh] sm:max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 border-b border-slate-800 p-4 sm:p-6 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-emerald-500 p-0.5 shadow-lg shadow-indigo-500/20 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">
                  Panduan Resmi
                </span>
                <span className="text-[10px] sm:text-xs text-slate-400">
                  Kurikulum Merdeka SMK & Simulasi Vokasi
                </span>
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight">
                Tutorial & Panduan Penggunaan Aplikasi
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5 max-w-2xl">
                Petunjuk interaktif bagi guru dan siswa dalam memilih representasi profesi, merancang purwarupa berbahan sekitar, memainkan simulator 2D, dan mengunduh laporan asesmen PDF terstruktur.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-colors shrink-0"
            title="Tutup Tutorial"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher & Quick Navigation Bar */}
        <div className="bg-slate-950/80 border-b border-slate-800 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setActiveTab('tour')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'tour'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Tur Terpandu (Langkah demi Langkah)</span>
            </button>

            <button
              onClick={() => setActiveTab('docs')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'docs'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Katalog Materi & Modul Panduan</span>
            </button>
          </div>

          {/* Quick shortcuts */}
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
            <span className="text-[11px] text-slate-500">Akses Cepat:</span>
            <button
              onClick={() => {
                onNavigateToView?.('games');
                onClose();
              }}
              className="px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold flex items-center gap-1"
            >
              <Camera className="w-3 h-3" />
              Game 2D
            </button>
            <button
              onClick={() => {
                onNavigateToView?.('generator', 1);
                onClose();
              }}
              className="px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-indigo-300 border border-slate-700 text-[11px] font-semibold flex items-center gap-1"
            >
              <Briefcase className="w-3 h-3" />
              Rekomendasi
            </button>
          </div>
        </div>

        {/* Modal Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {activeTab === 'tour' ? (
            /* TAB 1: INTERACTIVE STEP-BY-STEP GUIDED TOUR */
            <div className="space-y-6 max-w-4xl mx-auto">
              {/* Stepper Progress Indicator */}
              <div className="bg-slate-950/60 p-3 sm:p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="font-bold text-slate-300">
                    Progres Panduan: Langkah {currentTourStep + 1} dari {TUTORIAL_STEPS.length}
                  </span>
                  <span className="text-indigo-400 font-mono text-[11px] font-bold">
                    {Math.round(((currentTourStep + 1) / TUTORIAL_STEPS.length) * 100)}% Selesai
                  </span>
                </div>
                {/* Visual Step Bar */}
                <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                  {TUTORIAL_STEPS.map((step, idx) => (
                    <button
                      key={step.id}
                      onClick={() => setCurrentTourStep(idx)}
                      className={`h-2 sm:h-2.5 rounded-full transition-all ${
                        idx === currentTourStep
                          ? 'bg-gradient-to-r from-indigo-500 to-emerald-400 ring-2 ring-indigo-400/50'
                          : idx < currentTourStep
                          ? 'bg-emerald-600'
                          : 'bg-slate-800 hover:bg-slate-700'
                      }`}
                      title={`Langkah ${step.id}: ${step.title}`}
                    />
                  ))}
                </div>
                {/* Step labels */}
                <div className="hidden sm:grid grid-cols-5 gap-2 mt-2 text-[10px] text-slate-400 text-center">
                  <span>1. Pilih Profesi</span>
                  <span>2. Alat & Bahan</span>
                  <span>3. Rekomendasi</span>
                  <span>4. Jobsheet & PDF</span>
                  <span>5. Game 2D</span>
                </div>
              </div>

              {/* Main Step Card */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-7 space-y-6 relative overflow-hidden shadow-xl">
                {/* Ambient glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      Langkah {currentStepData.id} • {currentStepData.subtitle}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                      {currentStepData.title}
                    </h3>
                  </div>

                  {/* Primary Direct Action Button */}
                  <button
                    onClick={() => handleActionClick(currentStepData)}
                    className="self-start px-4 py-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-1.5 active:scale-95 shrink-0"
                    title="Buka langsung layar ini di aplikasi"
                  >
                    <span>{currentStepData.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Description */}
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  {currentStepData.description}
                </p>

                {/* Detailed Highlights based on Step */}
                <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-4 sm:p-5 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-300" />
                    Poin Penting & Tips Praktis:
                  </h4>
                  <ul className="space-y-2">
                    {currentStepData.tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Specific Visual Card Highlight */}
                {currentTourStep === 0 && (
                  <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-800/40 text-xs text-slate-300 flex items-center gap-3">
                    <Briefcase className="w-6 h-6 text-indigo-400 shrink-0" />
                    <div>
                      <strong className="text-white block">Tersedia Beragam Bidang Keahlian SMK</strong>
                      Mulai dari Teknik Mesin, Otomotif, Listrik, DKV, Multimedia/Fotografi, Sablon/Tekstil, hingga RPL.
                    </div>
                  </div>
                )}

                {currentTourStep === 1 && (
                  <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/40 text-xs text-slate-300 flex items-center gap-3">
                    <Wrench className="w-6 h-6 text-amber-400 shrink-0" />
                    <div>
                      <strong className="text-white block">Prinsip Subsitusi Bahan Daur Ulang</strong>
                      Siswa tidak harus membeli bahan baru; manfaatkan barang bekas layak pakai seperti baut bekas, kain perca, kardus, atau kaleng kemasan.
                    </div>
                  </div>
                )}

                {currentTourStep === 2 && (
                  <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-800/40 text-xs text-slate-300 flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-purple-400 shrink-0" />
                    <div>
                      <strong className="text-white block">Analisis Persentase Kesiapan (Readiness)</strong>
                      Sistem menghitung rasio ketersediaan alat inti (critical tools) dan bahan pendukung sehingga purwarupa dapat langsung dieksekusi.
                    </div>
                  </div>
                )}

                {currentTourStep === 3 && (
                  <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-xs text-slate-300 flex items-center gap-3">
                    <FileText className="w-6 h-6 text-emerald-400 shrink-0" />
                    <div>
                      <strong className="text-white block">Laporan PDF Terstruktur Langsung Download</strong>
                      Dilengkapi Kop Kedinasan, 4 Dimensi Rubrik Berbobot (K3 20%, Proses 40%, Mutu 30%, Waktu 10%), serta Tanda Tangan 3 Pihak resmi.
                    </div>
                  </div>
                )}

                {currentTourStep === 4 && (
                  <div className="p-3.5 rounded-xl bg-teal-950/30 border border-teal-800/40 text-xs text-slate-300 flex items-center gap-3">
                    <Gamepad2 className="w-6 h-6 text-teal-400 shrink-0" />
                    <div>
                      <strong className="text-white block">Dua Simulator Edukatif 2D Interaktif</strong>
                      1. Foto Produk Studio (Segitiga Eksposur & 3-Point Light) • 2. Sablon Kaos (Gesut Rakel 65°-75° & Curing Heat Press 165°C).
                    </div>
                  </div>
                )}

                {/* Tour Navigation Controls */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
                  <button
                    onClick={handlePrevStep}
                    disabled={currentTourStep === 0}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Sebelumnya</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {TUTORIAL_STEPS.map((_, idx) => (
                      <span
                        key={idx}
                        className={`w-2 h-2 rounded-full ${
                          idx === currentTourStep ? 'bg-indigo-400 w-4' : 'bg-slate-700'
                        } transition-all`}
                      />
                    ))}
                  </div>

                  {currentTourStep < TUTORIAL_STEPS.length - 1 ? (
                    <button
                      onClick={handleNextStep}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all"
                    >
                      <span>Lanjut</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setActiveTab('docs')}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-xs font-bold text-white flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all"
                    >
                      <span>Lihat Katalog Lengkap</span>
                      <BookOpen className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* TAB 2: DETAILED MODULES & KNOWLEDGE BASE */
            <div className="space-y-5">
              {/* Filter & Search Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari materi tutorial (contoh: 'segitiga eksposur', 'heat press', 'rubrik pdf', 'alat')..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Category Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                  {[
                    { id: 'all', label: 'Semua Materi' },
                    { id: 'quickstart', label: 'Alur Cepat' },
                    { id: 'simulations', label: 'Game 2D' },
                    { id: 'assessment', label: 'Asesmen & PDF' },
                    { id: 'ai', label: 'Rancang AI' },
                    { id: 'faq', label: 'Tanya Jawab (FAQ)' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                        selectedCategory === cat.id
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid 2 Kolom: Daftar Topik & Detail Topik */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                {/* Kolom Kiri: Daftar Topik */}
                <div className="lg:col-span-5 space-y-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
                    Topik Ditemukan ({filteredTopics.length})
                  </div>
                  {filteredTopics.length === 0 ? (
                    <div className="p-6 text-center rounded-xl bg-slate-950 border border-slate-800 text-slate-400 text-xs">
                      Tidak ada materi tutorial yang cocok dengan pencarian "{searchQuery}".
                    </div>
                  ) : (
                    filteredTopics.map((topic) => {
                      const isSelected = activeTopic.id === topic.id;
                      return (
                        <div
                          key={topic.id}
                          onClick={() => setSelectedTopicId(topic.id)}
                          className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-indigo-950/40 border-indigo-500/50 shadow-md ring-1 ring-indigo-500/30'
                              : 'bg-slate-950 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                              {topic.badge}
                            </span>
                            {topic.relatedView && (
                              <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                                <ExternalLink className="w-2.5 h-2.5" /> Ada Fitur
                              </span>
                            )}
                          </div>
                          <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">
                            {topic.title}
                          </h4>
                          <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                            {topic.summary}
                          </p>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Kolom Kanan: Detail Materi Terpilih */}
                <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5">
                  <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">
                        {activeTopic.badge}
                      </span>
                      <h3 className="text-base sm:text-xl font-bold text-white">
                        {activeTopic.title}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {activeTopic.summary}
                      </p>
                    </div>

                    {(activeTopic.relatedView || activeTopic.category === 'ai') && (
                      <button
                        onClick={() => handleTopicActionClick(activeTopic)}
                        className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1 shrink-0 self-start"
                      >
                        <span>Buka Fitur Ini</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Sections Body */}
                  <div className="space-y-5">
                    {activeTopic.sections.map((sec, idx) => (
                      <div key={idx} className="space-y-2">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-100 flex items-center gap-2">
                          <span className="w-1.5 h-4 bg-indigo-500 rounded-full" />
                          {sec.heading}
                        </h4>
                        {sec.paragraphs.map((p, pIdx) => (
                          <p key={pIdx} className="text-xs text-slate-300 leading-relaxed">
                            {p}
                          </p>
                        ))}
                        {sec.bulletPoints && sec.bulletPoints.length > 0 && (
                          <ul className="space-y-1.5 pl-2 pt-1">
                            {sec.bulletPoints.map((b, bIdx) => (
                              <li key={bIdx} className="flex items-start gap-2 text-xs text-slate-300">
                                <span className="text-indigo-400 font-bold shrink-0">•</span>
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        {sec.callout && (
                          <div
                            className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 mt-2 ${
                              sec.callout.type === 'warning'
                                ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                                : sec.callout.type === 'success'
                                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                                : 'bg-indigo-950/30 border-indigo-500/40 text-indigo-200'
                            }`}
                          >
                            <Lightbulb className="w-4 h-4 shrink-0 mt-0.5 text-amber-300" />
                            <span className="leading-relaxed">{sec.callout.text}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Tags */}
                  <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] text-slate-500 mr-1">Kata Kunci:</span>
                    {activeTopic.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 border-t border-slate-800 p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Panduan diselaraskan dengan standar Kurikulum Merdeka Kejuruan & LSP-P1.
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => {
                setActiveTab('tour');
                setCurrentTourStep(0);
              }}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors flex items-center gap-1 text-xs"
            >
              <RotateCcw className="w-3 h-3 text-slate-400" />
              <span>Ulangi Tur</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors text-xs"
            >
              Selesai & Mulai Eksplorasi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
