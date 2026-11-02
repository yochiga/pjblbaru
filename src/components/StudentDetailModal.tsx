import React from 'react';
import { Student, InventoryItem } from '../types';
import {
  X,
  Briefcase,
  Layers,
  Wrench,
  Package,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { analyzeStudentResourceReadiness } from '../utils/matchingLogic';

interface StudentDetailModalProps {
  student: Student | null;
  inventory: InventoryItem[];
  onClose: () => void;
  onLaunchSimulations: (student: Student) => void;
  onViewGapMatrix: (student: Student) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  inventory,
  onClose,
  onLaunchSimulations,
  onViewGapMatrix,
}) => {
  if (!student) return null;

  const readiness = analyzeStudentResourceReadiness(student, inventory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-800 border border-slate-700 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-700 flex items-start justify-between bg-slate-850">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-base shadow-md">
              {student.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">{student.name}</h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 font-medium">
                  {student.grade}
                </span>
              </div>
              <p className="text-xs font-semibold text-cyan-400 mt-0.5 flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5" />
                <span>{student.targetedProfession}</span>
                <span className="text-slate-500">•</span>
                <span className="text-purple-300">{student.ventureType}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            aria-label="Tutup jendela modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs text-slate-200">
          {/* Career Statement */}
          <div>
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Pernyataan Minat & Visi Kejuruan
            </h3>
            <p className="p-3 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-200 italic leading-relaxed">
              "{student.statementOfIntent}"
            </p>
          </div>

          {/* School Lab Feasibility Gauge */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 font-semibold block uppercase">
                Tingkat Kesiapan Sumber Daya Sekolah
              </span>
              <span className="text-2xl font-mono font-extrabold text-emerald-400">
                {readiness.readinessScore}% Siap Pakai
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {readiness.readilyAvailableCount} item telah tersedia di lab/bengkel sekolah
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onClose();
                  onViewGapMatrix(student);
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold flex items-center gap-1 transition-all"
              >
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>Lihat Detail Kesenjangan</span>
              </button>
            </div>
          </div>

          {/* Core Competencies & Skills */}
          <div>
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Kompetensi Utama & Keterampilan yang Ditargetkan
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {student.requirements.coreCompetencies.map((comp, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-indigo-950/60 border border-indigo-700 text-indigo-300 font-medium"
                >
                  {comp}
                </span>
              ))}
            </div>
          </div>

          {/* Safety Certifications */}
          <div>
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Protokol Keselamatan Kerja & Sertifikasi K3 yang Diperlukan</span>
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {student.requirements.safetyCertificationsNeeded.map((cert, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-amber-950/60 border border-amber-800 text-amber-300 font-medium"
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>

          {/* Required Tools */}
          <div>
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-cyan-400" />
              <span>Peralatan & Mesin yang Dibutuhkan ({student.requirements.tools.length})</span>
            </h3>
            <div className="space-y-1.5">
              {student.requirements.tools.map((tool) => (
                <div
                  key={tool.id}
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-between"
                >
                  <div>
                    <span className="font-semibold text-slate-100">{tool.name}</span>
                    <span className="text-[11px] text-slate-400 block">
                      {tool.category} {tool.minimumSpecs ? `• ${tool.minimumSpecs}` : ''}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      tool.priority === 'Kritis' || tool.priority === 'Critical'
                        ? 'bg-rose-950 text-rose-300 border-rose-800'
                        : 'bg-blue-950 text-blue-300 border-blue-800'
                    }`}
                  >
                    {tool.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Required Materials */}
          <div>
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-purple-400" />
              <span>Bahan Baku & Habis Pakai yang Dibutuhkan ({student.requirements.materials.length})</span>
            </h3>
            <div className="space-y-1.5">
              {student.requirements.materials.map((mat) => (
                <div
                  key={mat.id}
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-between"
                >
                  <div>
                    <span className="font-semibold text-slate-100">{mat.name}</span>
                    <span className="text-[11px] text-slate-400 block">
                      Kebutuhan: {mat.quantityNeeded} {mat.unit} • {mat.category}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      mat.priority === 'Kritis' || mat.priority === 'Critical'
                        ? 'bg-rose-950 text-rose-300 border-rose-800'
                        : 'bg-blue-950 text-blue-300 border-blue-800'
                    }`}
                  >
                    {mat.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-700 bg-slate-850 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
          >
            Tutup
          </button>
          <button
            onClick={() => {
              onClose();
              onLaunchSimulations(student);
            }}
            className="px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>Rekomendasikan Simulasi</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
