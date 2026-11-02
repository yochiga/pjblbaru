import React, { useState, useEffect } from 'react';
import { RecommendedProject, ProjectStep } from '../types/recommender';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Award,
  Clock,
  Printer,
  ChevronRight,
  ChevronLeft,
  ShieldAlert,
  FileText,
  Save,
  Sparkles,
  Edit3,
  Check,
  RotateCcw,
} from 'lucide-react';

interface InteractiveJobsheetModalProps {
  project: RecommendedProject | null;
  onClose: () => void;
  onSaveProgress?: (notes: string, completedSteps: number[], updatedProject?: RecommendedProject) => void;
  onUpdateProject?: (updatedProject: RecommendedProject) => void;
}

export function InteractiveJobsheetModal({
  project,
  onClose,
  onSaveProgress,
  onUpdateProject,
}: InteractiveJobsheetModalProps) {
  if (!project) return null;

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [studentNotes, setStudentNotes] = useState('');
  const [studentName, setStudentName] = useState('Siswa Vokasi');
  const [schoolName, setSchoolName] = useState('SMKN 4 Kendari');
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  // State untuk pengeditan deskripsi dan instruksi langkah kerja
  const [steps, setSteps] = useState<ProjectStep[]>(() => project.steps);
  const [originalSteps] = useState<ProjectStep[]>(() => project.steps);
  const [isEditingStep, setIsEditingStep] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editInstruction, setEditInstruction] = useState('');
  const [editSafetyTip, setEditSafetyTip] = useState('');
  const [editCheckpoint, setEditCheckpoint] = useState('');
  const [hasBeenEdited, setHasBeenEdited] = useState<Record<number, boolean>>({});
  const [stepNotice, setStepNotice] = useState<string | null>(null);

  // Sinkronisasi jika proyek berganti
  useEffect(() => {
    setSteps(project.steps);
    setCompletedSteps([]);
    setCurrentStepIndex(0);
    setIsEditingStep(false);
  }, [project.id]);

  const totalSteps = steps.length;
  const currentStep = steps[currentStepIndex];
  const isStepCompleted = completedSteps.includes(currentStepIndex);
  const allCompleted = completedSteps.length === totalSteps && totalSteps > 0;

  const toggleCurrentStepCompleted = () => {
    if (isStepCompleted) {
      setCompletedSteps(completedSteps.filter((s) => s !== currentStepIndex));
    } else {
      const updated = [...completedSteps, currentStepIndex];
      setCompletedSteps(updated);
      if (currentStepIndex < totalSteps - 1) {
        setIsEditingStep(false);
        setCurrentStepIndex(currentStepIndex + 1);
      }
    }
  };

  const handleSelectStep = (idx: number) => {
    setIsEditingStep(false);
    setCurrentStepIndex(idx);
  };

  // Mulai mode edit deskripsi langkah
  const handleStartEditStep = () => {
    if (!currentStep) return;
    setEditTitle(currentStep.title);
    setEditInstruction(currentStep.instruction);
    setEditSafetyTip(currentStep.safetyTip || '');
    setEditCheckpoint(currentStep.checkpoint || '');
    setIsEditingStep(true);
  };

  // Simpan perubahan deskripsi langkah
  const handleSaveStepEdit = () => {
    if (!currentStep || !editInstruction.trim()) return;

    const updatedSteps = steps.map((s, idx) => {
      if (idx === currentStepIndex) {
        return {
          ...s,
          title: editTitle.trim() || s.title,
          instruction: editInstruction.trim(),
          safetyTip: editSafetyTip.trim() || undefined,
          checkpoint: editCheckpoint.trim() || s.checkpoint,
        };
      }
      return s;
    });

    setSteps(updatedSteps);
    setHasBeenEdited((prev) => ({ ...prev, [currentStepIndex]: true }));
    setIsEditingStep(false);

    const updatedProject = { ...project, steps: updatedSteps };
    if (onUpdateProject) {
      onUpdateProject(updatedProject);
    }
    setStepNotice('Deskripsi langkah berhasil diperbarui!');
    setTimeout(() => setStepNotice(null), 3000);
  };

  // Kembalikan ke deskripsi awal rekomendasi
  const handleResetStepToOriginal = () => {
    const original = originalSteps[currentStepIndex];
    if (!original) return;

    const updatedSteps = steps.map((s, idx) => (idx === currentStepIndex ? { ...original } : s));
    setSteps(updatedSteps);
    setHasBeenEdited((prev) => ({ ...prev, [currentStepIndex]: false }));
    setIsEditingStep(false);

    const updatedProject = { ...project, steps: updatedSteps };
    if (onUpdateProject) {
      onUpdateProject(updatedProject);
    }
    setStepNotice('Deskripsi langkah dikembalikan ke versi rekomendasi awal.');
    setTimeout(() => setStepNotice(null), 3000);
  };

  const handleSave = () => {
    const updatedProject = { ...project, steps };
    if (onSaveProgress) {
      onSaveProgress(studentNotes, completedSteps, updatedProject);
    }
    if (onUpdateProject) {
      onUpdateProject(updatedProject);
    }
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[96vh] sm:max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-b border-slate-800 p-4 sm:p-5 md:p-6 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5">
              <span className="text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-400/30 text-indigo-300 font-semibold truncate max-w-[220px] sm:max-w-none">
                Jobsheet: {project.targetProfession}
              </span>
              <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                {project.difficulty}
              </span>
              <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-500 shrink-0" /> {project.estimatedHours}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight leading-snug">
              {project.title}
            </h2>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handlePrint}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors print:hidden"
              title="Cetak Lembar Kerja"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              title="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 md:p-6 space-y-5 sm:space-y-6">
          {/* Identitas Siswa */}
          <div className="bg-slate-950/60 p-4 border border-slate-800 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Nama Siswa Praktikan:</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Nama Sekolah / Instansi:</label>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Protokol K3 Keselamatan Kerja */}
          {project.safetyProtocols && project.safetyProtocols.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/20 text-xs space-y-2">
              <div className="flex items-center gap-2 font-semibold text-amber-300">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Protokol Keselamatan & Kesehatan Kerja (K3):</span>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300 pl-1">
                {project.safetyProtocols.map((prot, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-400 shrink-0">⚠️</span>
                    <span>{prot}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Progress Bar Langkah */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">
                Progres Pengerjaan Langkah: {completedSteps.length} dari {totalSteps} Selesai
              </span>
              <span className="text-indigo-400 font-bold">
                {totalSteps > 0 ? Math.round((completedSteps.length / totalSteps) * 100) : 0}%
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full transition-all duration-300"
                style={{ width: `${totalSteps > 0 ? (completedSteps.length / totalSteps) * 100 : 0}%` }}
              ></div>
            </div>

            {/* Step navigation tabs */}
            <div className="flex gap-2 overflow-x-auto py-2">
              {steps.map((step, idx) => {
                const done = completedSteps.includes(idx);
                const isCurrent = currentStepIndex === idx;
                const isEdited = hasBeenEdited[idx];
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectStep(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 flex items-center gap-1.5 transition-all ${
                      isCurrent
                        ? 'bg-indigo-600 text-white shadow ring-2 ring-indigo-400/50'
                        : done
                        ? 'bg-emerald-950/60 border border-emerald-500/30 text-emerald-300'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {done ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <span>{idx + 1}</span>
                    )}
                    <span className="truncate max-w-[120px]">{step.title}</span>
                    {isEdited && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="Deskripsi disesuaikan"></span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Kartu Langkah Aktif */}
          {currentStep && (
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                    Langkah {currentStep.stepNumber} dari {totalSteps}
                  </span>
                  {hasBeenEdited[currentStepIndex] && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 font-semibold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      Deskripsi Disesuaikan
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  {!isEditingStep && (
                    <button
                      type="button"
                      onClick={handleStartEditStep}
                      className="flex-1 sm:flex-initial justify-center text-xs px-3 py-2 sm:py-1.5 rounded-lg font-semibold bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 border border-slate-700 flex items-center gap-1.5 transition-colors active:scale-95 shadow-sm min-h-[38px] sm:min-h-0"
                      title="Ubah atau sesuaikan deskripsi instruksi langkah ini"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Deskripsi</span>
                    </button>
                  )}
                  <button
                    onClick={toggleCurrentStepCompleted}
                    className={`flex-1 sm:flex-initial justify-center text-xs px-3 py-2 sm:py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors min-h-[38px] sm:min-h-0 ${
                      isStepCompleted
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{isStepCompleted ? 'Langkah Selesai' : 'Tandai Selesai'}</span>
                  </button>
                </div>
              </div>

              {stepNotice && (
                <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2 animate-fadeIn">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{stepNotice}</span>
                </div>
              )}

              {/* Tampilan Mode Edit vs Tampilan Standar */}
              {isEditingStep ? (
                <div className="p-4 rounded-xl bg-slate-900 border-2 border-indigo-500/60 shadow-lg space-y-3.5 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <Edit3 className="w-4 h-4" />
                      Edit Deskripsi & Instruksi Pengerjaan Langkah {currentStep.stepNumber}
                    </span>
                    {hasBeenEdited[currentStepIndex] && (
                      <button
                        type="button"
                        onClick={handleResetStepToOriginal}
                        className="text-[11px] text-slate-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
                        title="Kembalikan ke deskripsi instruksi awal"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reset ke Awal</span>
                      </button>
                    )}
                  </div>

                  {/* Judul Langkah */}
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1 font-medium">
                      Judul Langkah:
                    </label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      placeholder="Judul langkah..."
                    />
                  </div>

                  {/* Deskripsi Utama */}
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1 font-medium">
                      Deskripsi & Instruksi Pengerjaan <span className="text-rose-400">*</span>:
                    </label>
                    <textarea
                      rows={4}
                      value={editInstruction}
                      onChange={(e) => setEditInstruction(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed font-sans"
                      placeholder="Tuliskan deskripsi pengerjaan yang disesuaikan dengan alat/bahan alternatif di sekitar..."
                      autoFocus
                    ></textarea>
                  </div>

                  {/* Tips Keselamatan */}
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1 font-medium">
                      Tips Keselamatan / Presisi (Opsional):
                    </label>
                    <input
                      type="text"
                      value={editSafetyTip}
                      onChange={(e) => setEditSafetyTip(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      placeholder="Contoh: Gunakan alas kerja pelindung..."
                    />
                  </div>

                  {/* Checkpoint Verifikasi */}
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1 font-medium">
                      Checkpoint Verifikasi Hasil:
                    </label>
                    <input
                      type="text"
                      value={editCheckpoint}
                      onChange={(e) => setEditCheckpoint(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      placeholder="Indikator keberhasilan langkah..."
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[10px] text-slate-500">
                      Perubahan deskripsi akan langsung diterapkan pada jobsheet praktik ini.
                    </span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setIsEditingStep(false)}
                        className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        Batal
                      </button>
                      <button
                        type="button"
                        disabled={!editInstruction.trim()}
                        onClick={handleSaveStepEdit}
                        className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs rounded-lg shadow transition-all flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Simpan Deskripsi</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {currentStep.title}
                  </h3>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-indigo-400" />
                        Instruksi & Deskripsi Pengerjaan:
                      </span>
                      <button
                        type="button"
                        onClick={handleStartEditStep}
                        className="text-[11px] text-slate-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
                      >
                        <Edit3 className="w-3 h-3 text-amber-400" />
                        <span>Edit Deskripsi</span>
                      </button>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                      {currentStep.instruction}
                    </div>
                  </div>

                  {currentStep.safetyTip && (
                    <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2">
                      <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-amber-200">Tips Keselamatan / Presisi:</strong>
                        {currentStep.safetyTip}
                      </div>
                    </div>
                  )}

                  {/* Checkpoint Verifikasi */}
                  <div className="p-3.5 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-xs flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-emerald-300">
                        Checkpoint Verifikasi Hasil Langkah Ini:
                      </strong>
                      <span className="text-slate-300">{currentStep.checkpoint}</span>
                    </div>
                  </div>
                </>
              )}

              {/* Tombol Sebelumnya & Selanjutnya */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  disabled={currentStepIndex === 0}
                  onClick={() => handleSelectStep(Math.max(0, currentStepIndex - 1))}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs text-slate-300 flex items-center gap-1 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Sebelumnya
                </button>

                <button
                  disabled={currentStepIndex === totalSteps - 1}
                  onClick={() => handleSelectStep(Math.min(totalSteps - 1, currentStepIndex + 1))}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs text-slate-300 flex items-center gap-1 transition-colors"
                >
                  Selanjutnya
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Kolom Catatan Pengamatan Siswa */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-indigo-400" />
              Catatan Pengamatan, Kendala, & Hasil Karya Siswa:
            </label>
            <textarea
              rows={3}
              value={studentNotes}
              onChange={(e) => setStudentNotes(e.target.value)}
              placeholder="Tuliskan hasil pengukuran, kondisi nyala/fungsi alat, atau solusi kreatif saat memakai bahan pengganti..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            ></textarea>

            <div className="flex items-center justify-between pt-1">
              {isSavedNotice && (
                <span className="text-xs text-emerald-400 flex items-center gap-1 animate-fadeIn">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Catatan berhasil disimpan ke perangkat!
                </span>
              )}
              <div className="ml-auto">
                <button
                  onClick={handleSave}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5 text-indigo-400" />
                  Simpan Catatan
                </button>
              </div>
            </div>
          </div>

          {/* Lencana Kompetensi Siswa jika selesai */}
          {allCompleted && (
            <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-indigo-950/40 to-emerald-950/40 border border-emerald-500/40 text-center space-y-3 animate-fadeIn">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-300 shadow-lg shadow-emerald-950">
                <Award className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-white">Selamat! Simulasi Proyek Berhasil Selesai</h4>
              <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
                Siswa telah membuktikan kompetensi praktik representasi profesi{' '}
                <strong className="text-emerald-300">{project.targetProfession}</strong> dengan menghasilkan{' '}
                <em>{project.deliverable}</em>.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-600/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold">
                <Sparkles className="w-4 h-4" />
                Lencana Diraih: {project.badgeEarned}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 border-t border-slate-800 p-3.5 sm:p-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="text-xs text-slate-400 text-center sm:text-left">
            Output: <strong className="text-slate-200">{project.deliverable}</strong>
          </div>
          <div className="flex flex-col xs:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 sm:py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 min-h-[42px] sm:min-h-0"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Unduh PDF</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2.5 sm:py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow transition-colors flex items-center justify-center min-h-[42px] sm:min-h-0"
            >
              Tutup Panduan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
