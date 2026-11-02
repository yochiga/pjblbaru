import React, { useState } from 'react';
import {
  Student,
  InventoryItem,
  SimulationProject,
} from '../types';
import {
  Sparkles,
  Play,
  CheckCircle2,
  Clock,
  Award,
  Wrench,
  Package,
  ArrowRight,
  ArrowLeft,
  Calculator,
  ListChecks,
  Activity,
  FileCheck,
  Loader2,
} from 'lucide-react';
import { rankRecommendedSimulations } from '../utils/matchingLogic';

interface SimulationStudioProps {
  students: Student[];
  inventory: InventoryItem[];
  simulations: SimulationProject[];
  selectedStudentId?: string;
  onSelectStudentId: (id: string) => void;
  onCompleteSimulation: (studentId: string, simulationId: string) => void;
  onAddNewSimulation: (sim: SimulationProject) => void;
}

export const SimulationStudio: React.FC<SimulationStudioProps> = ({
  students,
  inventory,
  simulations,
  selectedStudentId,
  onSelectStudentId,
  onCompleteSimulation,
  onAddNewSimulation,
}) => {
  const currentStudent =
    students.find((s) => s.id === selectedStudentId) || students[0];

  // Active running simulation state
  const [activeSimulation, setActiveSimulation] = useState<SimulationProject | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Step interaction states
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [calculatorInput, setCalculatorInput] = useState<number | ''>('');
  const [reflectionNotes, setReflectionNotes] = useState('');
  const [badgeClaimed, setBadgeClaimed] = useState(false);

  // AI Generator state
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [customFocusPrompt, setCustomFocusPrompt] = useState('');
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiSuccessMsg, setAiSuccessMsg] = useState<string | null>(null);

  // Ranked simulations for current student
  const rankedSimulations = currentStudent
    ? rankRecommendedSimulations(currentStudent, simulations, inventory)
    : [];

  const handleLaunchSimulation = (sim: SimulationProject) => {
    setActiveSimulation(sim);
    setCurrentStepIndex(0);
    setCheckedItems({});
    setCalculatorInput('');
    setReflectionNotes('');
    setBadgeClaimed(false);
  };

  const handleToggleCheck = (key: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleFinishSimulation = () => {
    if (activeSimulation && currentStudent) {
      setBadgeClaimed(true);
      onCompleteSimulation(currentStudent.id, activeSimulation.id);
    }
  };

  const handleGenerateCustomSimulation = async () => {
    if (!currentStudent) return;
    setIsGeneratingAI(true);
    setAiError(null);
    setAiSuccessMsg(null);

    try {
      const res = await fetch('/api/generate-simulation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student: currentStudent,
          inventory,
          focusNote: customFocusPrompt.trim(),
        }),
      });

      const data = await res.json();

      if (data.simulation) {
        onAddNewSimulation(data.simulation);
        setAiSuccessMsg(`Simulasi baru berhasil dirancang: "${data.simulation.title}"!`);
        setCustomFocusPrompt('');
      } else {
        // Fallback synthesis dalam Bahasa Indonesia
        const newSim: SimulationProject = {
          id: `sim-synth-${Date.now()}`,
          title: `${currentStudent.targetedProfession}: Purwarupa Praktik Mandiri`,
          targetProfession: currentStudent.targetedProfession,
          ventureType: currentStudent.ventureType,
          careerCluster: currentStudent.careerCluster,
          summary: `Proyek praktik nyata menggunakan fasilitas dan bahan lab sekolah untuk menguji kompetensi ${currentStudent.targetedProfession}.`,
          difficulty: 'Menengah',
          durationHours: 4,
          requiredTools: currentStudent.requirements.tools.map((t) => t.name).slice(0, 2),
          requiredMaterials: currentStudent.requirements.materials.map((m) => ({
            name: m.name,
            quantity: m.quantityNeeded,
            unit: m.unit,
          })),
          learningOutcomes: [
            `Standar operasional prosedur (SOP) untuk ${currentStudent.targetedProfession}`,
            'Pengendalian mutu dan kalibrasi parameter teknis',
            'Kelayakan komersial dan presentasi hasil karya',
          ],
          realWorldDeliverable: `Purwarupa terverifikasi dan bukti portofolio bidang ${currentStudent.targetedProfession}.`,
          safetyProtocols: ['Patuhi SOP keselamatan kerja lab sekolah', 'Jaga kebersihan dan kerapian meja praktik'],
          badgeName: `Praktisi Unggul ${currentStudent.targetedProfession}`,
          steps: [
            {
              id: 'st-1',
              title: 'Pemeriksaan Alat & K3 Lab',
              phase: 'Pemeriksaan Alat & K3',
              description: 'Pastikan seluruh alat kerja telah dipinjam dan alat pelindung diri (APD) terpasang rapi.',
              actionType: 'checklist',
              interactiveData: {
                prompts: [
                  'Periksa kalibrasi dan kondisi alat utama',
                  'Timbang dan ukur bahan baku sesuai takaran formula',
                  'Pahami letak tombol emergency stop dan APAR lab',
                ],
              },
            },
            {
              id: 'st-2',
              title: 'Kalkulator Parameter & Spesifikasi Desain',
              phase: 'Perakitan & Sintesis Desain',
              description: 'Hitung parameter teknis atau rasio formula utama.',
              actionType: 'calculator',
              interactiveData: {
                benchmarkKey: 'Toleransi Rekayasa / Rasio Target',
                targetValue: 1.0,
                unit: 'faktor',
              },
            },
            {
              id: 'st-3',
              title: 'Pengujian Diagnostik Operasional',
              phase: 'Kalibrasi & Diagnostik',
              description: 'Lakukan uji fungsi awal dan catat angka kinerja dasar.',
              actionType: 'tester',
              interactiveData: {
                prompts: [
                  'Jalankan uji coba putaran pertama',
                  'Verifikasi kinerja berada dalam batas toleransi aman',
                ],
              },
            },
            {
              id: 'st-4',
              title: 'Dokumentasi Portofolio & Paparan Hasil',
              phase: 'Presentasi Vokasi & Portofolio',
              description: 'Catat refleksi pembelajaran proyek dan klaim lencana kompetensi.',
              actionType: 'reflection',
            },
          ],
        };
        onAddNewSimulation(newSim);
        setAiSuccessMsg(`Simulasi tersintesis ditambahkan: "${newSim.title}"`);
        setCustomFocusPrompt('');
      }
    } catch (err: any) {
      console.error(err);
      setAiError('Gagal menghasilkan simulasi. Silakan coba lagi.');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // If in active simulation walkthrough mode
  if (activeSimulation) {
    const step = activeSimulation.steps[currentStepIndex];
    const totalSteps = activeSimulation.steps.length;
    const progressPct = Math.round(((currentStepIndex + 1) / totalSteps) * 100);

    return (
      <div className="space-y-6">
        {/* Runner Header */}
        <div className="rounded-2xl bg-slate-800/95 border border-slate-700 p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <button
                onClick={() => setActiveSimulation(null)}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 mb-2 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Keluar dari Studio Simulasi</span>
              </button>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 uppercase">
                  Simulasi Aktif Berjalan
                </span>
                <span className="text-xs text-slate-400">
                  Siswa: <strong className="text-white">{currentStudent?.name}</strong>
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                {activeSimulation.title}
              </h1>
            </div>

            {/* Step Counter */}
            <div className="text-right">
              <span className="text-xs text-slate-400 font-medium">Kemajuan</span>
              <div className="text-lg font-mono font-bold text-emerald-400">
                Tahap {currentStepIndex + 1} dari {totalSteps}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden mt-4">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-cyan-500 to-emerald-400 transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* Phases Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 text-[11px]">
            {activeSimulation.steps.map((s, idx) => (
              <div
                key={s.id}
                className={`p-2 rounded-lg border text-center transition-all ${
                  idx === currentStepIndex
                    ? 'bg-indigo-900/60 text-indigo-200 border-indigo-500 font-bold'
                    : idx < currentStepIndex
                    ? 'bg-slate-900/80 text-emerald-400 border-emerald-800/80 font-medium'
                    : 'bg-slate-900/40 text-slate-500 border-slate-800'
                }`}
              >
                <span>
                  {idx + 1}. {s.phase}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Interactive Workspace */}
        {!badgeClaimed ? (
          <div className="rounded-2xl bg-slate-800/90 border border-slate-700 p-6 shadow-xl space-y-6">
            <div>
              <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">
                Fase: {step.phase}
              </span>
              <h2 className="text-xl font-bold text-white mt-1">{step.title}</h2>
              <p className="text-sm text-slate-300 mt-2">{step.description}</p>
            </div>

            {/* Interactive Widget Area */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
              {step.actionType === 'checklist' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                    <ListChecks className="w-4 h-4 text-cyan-400" />
                    <span>Daftar Periksa Kesiapan & Keselamatan Kerja Lab</span>
                  </div>
                  <div className="space-y-2">
                    {(step.interactiveData?.prompts || [
                      'Periksa sambungan listrik alat dan kalibrasi sensor',
                      'Timbang dan takar bahan awal praktik',
                      'Gunakan Alat Pelindung Diri (APD) lengkap',
                    ]).map((prompt, idx) => {
                      const key = `step-${step.id}-check-${idx}`;
                      const isChecked = Boolean(checkedItems[key]);

                      return (
                        <label
                          key={idx}
                          className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                            isChecked
                              ? 'bg-emerald-950/40 border-emerald-700/80 text-slate-100'
                              : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleCheck(key)}
                            className="mt-0.5 rounded text-emerald-500 focus:ring-emerald-500 bg-slate-900 border-slate-600"
                          />
                          <span className={`text-xs font-medium ${isChecked ? 'line-through text-slate-400' : ''}`}>
                            {prompt}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {step.actionType === 'calculator' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                    <Calculator className="w-4 h-4 text-amber-400" />
                    <span>Kalkulator Tolok Ukur Parameter Kejuruan</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Masukkan hasil uji coba lab atau kalkulasi angka Anda. Nilai tolok ukur acuan:{' '}
                    <strong className="text-amber-300">
                      {step.interactiveData?.targetValue} {step.interactiveData?.unit}
                    </strong>
                  </p>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      step="0.1"
                      placeholder={`Masukkan angka terukur dalam ${step.interactiveData?.unit || 'satuan'}...`}
                      value={calculatorInput}
                      onChange={(e) => setCalculatorInput(e.target.value === '' ? '' : parseFloat(e.target.value))}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm font-mono text-white focus:outline-none focus:ring-2 focus:ring-amber-500 max-w-xs"
                      aria-label="Input kalkulator"
                    />
                    {typeof calculatorInput === 'number' && (
                      <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-800 text-emerald-400 border border-emerald-800/80 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Tercatat: {calculatorInput} {step.interactiveData?.unit} (Sesuai toleransi)</span>
                      </span>
                    )}
                  </div>
                </div>
              )}

              {step.actionType === 'tester' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                    <Activity className="w-4 h-4 text-purple-400" />
                    <span>Protokol Kalibrasi & Diagnostik Real-Time</span>
                  </div>
                  <div className="space-y-2">
                    {(step.interactiveData?.prompts || [
                      'Jalankan uji coba operasional 10 menit kontinu',
                      'Catat pembacaan telemetri suhu dan mekanis',
                      'Konfirmasi ketiadaan getaran berlebih atau hambatan',
                    ]).map((prompt, idx) => {
                      const key = `step-${step.id}-test-${idx}`;
                      const isChecked = Boolean(checkedItems[key]);

                      return (
                        <div
                          key={idx}
                          onClick={() => handleToggleCheck(key)}
                          className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                            isChecked
                              ? 'bg-purple-950/40 border-purple-700 text-purple-200'
                              : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <span className="text-xs font-medium">{prompt}</span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                              isChecked
                                ? 'bg-purple-900 text-purple-200 border-purple-600'
                                : 'bg-slate-900 text-slate-400 border-slate-700'
                            }`}
                          >
                            {isChecked ? 'Lolos / Terkalibrasi' : 'Menunggu Uji'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {step.actionType === 'reflection' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                    <FileCheck className="w-4 h-4 text-emerald-400" />
                    <span>Refleksi Proyek, Hasil Karya Nyata & Bukti Portofolio</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Output Karya Nyata yang Diharapkan:{' '}
                    <span className="text-slate-200 font-semibold">{activeSimulation.realWorldDeliverable}</span>
                  </p>
                  <textarea
                    rows={4}
                    value={reflectionNotes}
                    onChange={(e) => setReflectionNotes(e.target.value)}
                    placeholder="Catat observasi proyek, pelajaran penting, catatan uji coba, dan bukti persetujuan instruktur lab..."
                    className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              )}
            </div>

            {/* Stepper Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-700">
              <button
                onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentStepIndex === 0}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Tahap Sebelumnya</span>
              </button>

              {currentStepIndex < totalSteps - 1 ? (
                <button
                  onClick={() => setCurrentStepIndex((prev) => Math.min(totalSteps - 1, prev + 1))}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition-all active:scale-95"
                >
                  <span>Selesaikan Tahap & Lanjutkan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={handleFinishSimulation}
                  className="px-6 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all active:scale-95"
                >
                  <Award className="w-4 h-4" />
                  <span>Kirim Laporan Proyek & Berikan Lencana Kompetensi</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Badge Unlock Celebration Card */
          <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/80 to-slate-900 border border-emerald-500/50 p-8 text-center shadow-2xl space-y-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-400 via-emerald-400 to-teal-300 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/25 text-slate-900 font-extrabold text-3xl animate-bounce">
              <Award className="w-10 h-10 text-slate-900" />
            </div>

            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700 uppercase tracking-wider">
              Simulasi Proyek Praktik Berhasil Diselesaikan!
            </span>

            <h2 className="text-2xl font-black text-white">
              Lencana Kompetensi Vokasi Diberikan:
            </h2>
            <p className="text-xl font-bold bg-gradient-to-r from-emerald-300 via-cyan-200 to-amber-200 bg-clip-text text-transparent">
              {activeSimulation.badgeName}
            </p>

            <p className="text-xs text-slate-300 max-w-md mx-auto">
              {currentStudent?.name} telah memverifikasi praktik nyata menggunakan peralatan lab sekolah.
              Bukti tersimpan rapi dalam portofolio kejuruan siswa.
            </p>

            <div className="pt-4 flex justify-center gap-3">
              <button
                onClick={() => setActiveSimulation(null)}
                className="px-6 py-2.5 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg transition-all"
              >
                Kembali ke Katalog Simulasi
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Recommendation Catalog View
  return (
    <div className="space-y-6">
      {/* Studio Header */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-800 via-slate-800 to-emerald-950/40 p-6 border border-slate-700/80 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Mesin Rekomendasi Simulasi Vokasi</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Studio & Rekomendasi Simulasi Proyek
            </h1>
            <p className="mt-1 text-sm text-slate-300 max-w-2xl">
              Simulasi yang dirancang untuk menguji kompetensi kerja otentik sekaligus memaksimalkan pemanfaatan alat dan bahan baku yang benar-benar ada di sekolah.
            </p>
          </div>

          {/* Student Selector */}
          <div className="bg-slate-900/90 border border-slate-700 p-3 rounded-2xl flex flex-col gap-1.5 self-start md:self-auto min-w-[280px]">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Menyesuaikan Simulasi Untuk
            </label>
            <select
              value={currentStudent.id}
              onChange={(e) => onSelectStudentId(e.target.value)}
              className="px-3 py-2 text-sm font-bold rounded-xl bg-slate-800 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              aria-label="Pilih siswa untuk simulasi"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.targetedProfession})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* AI Custom Simulation Generator Bar */}
        <div className="mt-6 pt-5 border-t border-slate-700/60">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder={`Ketik fokus minat siswa (misal: "Spesialisasi drone pertanian" atau "Roti sourdough bebas gluten")...`}
              value={customFocusPrompt}
              onChange={(e) => setCustomFocusPrompt(e.target.value)}
              className="flex-1 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Prompt fokus karir"
            />
            <button
              onClick={handleGenerateCustomSimulation}
              disabled={isGeneratingAI}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 disabled:opacity-50 text-white shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5 active:scale-95 transition-all whitespace-nowrap"
            >
              {isGeneratingAI ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Merancang Simulasi AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
                  <span>Rancang Simulasi Khusus (AI)</span>
                </>
              )}
            </button>
          </div>

          {aiSuccessMsg && (
            <p className="text-xs text-emerald-400 font-medium mt-2 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{aiSuccessMsg}</span>
            </p>
          )}
          {aiError && (
            <p className="text-xs text-rose-400 font-medium mt-2">
              {aiError}
            </p>
          )}
        </div>
      </div>

      {/* Recommended Simulation Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Simulasi yang Direkomendasikan untuk {currentStudent?.name}</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-cyan-400 border border-slate-700">
              {rankedSimulations.length} Simulasi Cocok
            </span>
          </h3>
          <span className="text-xs text-slate-400 hidden sm:block">
            Diurutkan berdasarkan Kecocokan Karir & Ketersediaan Fasilitas Sekolah
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {rankedSimulations.map((item) => {
            const sim = item.project;
            const isTopRanked = item.score >= 80;

            return (
              <div
                key={sim.id}
                className="rounded-2xl bg-slate-800/90 border border-slate-700 hover:border-emerald-500/60 p-5 shadow-lg flex flex-col justify-between transition-all duration-200 group"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                        isTopRanked
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                          : 'bg-slate-900 text-slate-300 border-slate-700'
                      }`}
                    >
                      {item.score}% Kelayakan & Kesesuaian
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {sim.durationHours} jam • Tingkat {sim.difficulty}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {sim.title}
                  </h4>
                  <p className="text-xs font-semibold text-cyan-400 mt-0.5">
                    Target: {sim.targetProfession} ({sim.ventureType})
                  </p>
                  <p className="text-xs text-slate-300 mt-2 line-clamp-2">
                    {sim.summary}
                  </p>

                  {/* Required Inventory Items Tags */}
                  <div className="space-y-2 mt-4 pt-3 border-t border-slate-700/60 text-xs">
                    <div>
                      <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1 mb-1">
                        <Wrench className="w-3 h-3 text-cyan-400" />
                        <span>Alat Lab yang Dibutuhkan:</span>
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {sim.requiredTools.map((tool, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-[11px]"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1 mb-1">
                        <Package className="w-3 h-3 text-purple-400" />
                        <span>Bahan Baku yang Digunakan:</span>
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {sim.requiredMaterials.map((mat, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-[11px]"
                          >
                            {mat.quantity} {mat.unit} {mat.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Deliverable & Badge */}
                  <div className="mt-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px]">
                    <span className="text-slate-400 block font-medium">Output Karya:</span>
                    <span className="text-slate-200 font-semibold">{sim.realWorldDeliverable}</span>
                  </div>
                </div>

                {/* Launch Button */}
                <div className="pt-4 mt-4 border-t border-slate-700/60 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[11px] text-amber-300 font-semibold">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>Lencana: {sim.badgeName}</span>
                  </div>

                  <button
                    onClick={() => handleLaunchSimulation(sim)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Jalankan Simulasi</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
