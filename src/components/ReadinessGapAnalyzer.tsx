import React, { useState } from 'react';
import { Student, InventoryItem } from '../types';
import {
  Scale,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  Layers,
  Wrench,
  Package,
  ArrowRight,
  FileText,
} from 'lucide-react';
import { analyzeStudentResourceReadiness } from '../utils/matchingLogic';

interface ReadinessGapAnalyzerProps {
  students: Student[];
  inventory: InventoryItem[];
  selectedStudentId?: string;
  onSelectStudentId: (id: string) => void;
  onLaunchSimulationForStudent: (student: Student) => void;
  onQuickReplenishItem: (itemId: string, delta: number) => void;
}

export const ReadinessGapAnalyzer: React.FC<ReadinessGapAnalyzerProps> = ({
  students,
  inventory,
  selectedStudentId,
  onSelectStudentId,
  onLaunchSimulationForStudent,
  onQuickReplenishItem,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'tools' | 'materials'>('all');
  const [requisitionSent, setRequisitionSent] = useState(false);

  const currentStudent =
    students.find((s) => s.id === selectedStudentId) || students[0];

  const analysis = currentStudent
    ? analyzeStudentResourceReadiness(currentStudent, inventory)
    : null;

  if (!currentStudent || !analysis) {
    return (
      <div className="text-center py-12 text-slate-400">
        Belum ada siswa terdaftar. Silakan daftarkan siswa terlebih dahulu.
      </div>
    );
  }

  const isHighReadiness = analysis.readinessScore >= 75;
  const isModerateReadiness = analysis.readinessScore >= 50 && analysis.readinessScore < 75;

  return (
    <div className="space-y-6">
      {/* Student Selector & Header */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-800 via-slate-800 to-amber-950/40 p-6 border border-slate-700/80 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold mb-2">
              <Scale className="w-3.5 h-3.5 text-amber-400" />
              <span>Mesin Analisis Kesenjangan Kebutuhan vs Inventaris</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Matriks Kesiapan & Kesenjangan Fasilitas
            </h1>
            <p className="mt-1 text-sm text-slate-300 max-w-2xl">
              Membandingkan kebutuhan profesi/usaha siswa dengan pasokan riil bengkel sekolah untuk memetakan kesiapan, opsi substitusi bahan, dan kendala peralatan.
            </p>
          </div>

          {/* Student Picker */}
          <div className="bg-slate-900/90 border border-slate-700/80 p-3 rounded-2xl flex flex-col gap-1.5 self-start md:self-auto min-w-[280px]">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Mengevaluasi Siswa & Minat Karir
            </label>
            <select
              value={currentStudent.id}
              onChange={(e) => onSelectStudentId(e.target.value)}
              className="px-3 py-2 text-sm font-bold rounded-xl bg-slate-800 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
              aria-label="Pilih siswa untuk analisis kelayakan"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — {s.targetedProfession}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Big Readiness Scoreboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-700/60">
          {/* Main Score */}
          <div className="md:col-span-1 p-5 rounded-2xl bg-slate-900/80 border border-slate-700 flex flex-col items-center justify-center text-center">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Kesiapan Keseluruhan
            </span>
            <div
              className={`text-5xl font-mono font-extrabold my-2 ${
                isHighReadiness
                  ? 'text-emerald-400'
                  : isModerateReadiness
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }`}
            >
              {analysis.readinessScore}%
            </div>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
                isHighReadiness
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : isModerateReadiness
                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                  : 'bg-rose-950 text-rose-300 border border-rose-800'
              }`}
            >
              {isHighReadiness
                ? 'Siap Simulasi'
                : isModerateReadiness
                ? 'Sebagian Tersedia'
                : 'Terkendala Bahan/Alat'}
            </span>
          </div>

          {/* Subscores */}
          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/60 flex flex-col justify-between">
              <div>
                <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Kecocokan Alat & Mesin</span>
                </span>
                <span className="text-2xl font-mono font-bold text-white block mt-1">
                  {analysis.toolsScore}%
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                {analysis.matchedTools.filter((t) => t.status === 'Cocok Penuh').length} dari{' '}
                {analysis.matchedTools.length} alat kritis siap pakai
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/60 flex flex-col justify-between">
              <div>
                <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-purple-400" />
                  <span>Ketersediaan Bahan Baku</span>
                </span>
                <span className="text-2xl font-mono font-bold text-white block mt-1">
                  {analysis.materialsScore}%
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                {analysis.matchedMaterials.filter((m) => m.status === 'Cocok Penuh').length} dari{' '}
                {analysis.matchedMaterials.length} bahan mencukupi
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/60 flex flex-col justify-between">
              <div>
                <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                  <span className="text-amber-400 font-bold font-mono">Rp</span>
                  <span>Estimasi Biaya Pengadaan</span>
                </span>
                <span className="text-2xl font-mono font-bold text-amber-300 block mt-1">
                  Rp {analysis.procurementEstimateIDR.toLocaleString('id-ID')}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Perkiraan biaya untuk melengkapi 100% kebutuhan praktik
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Bottlenecks Banner */}
      {analysis.criticalBottlenecks.length > 0 && (
        <div className="rounded-2xl bg-amber-950/40 border border-amber-800/80 p-4 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-900/60 text-amber-300 flex-shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-200">
                Peringatan Kendala Sumber Daya Kritis Terdeteksi ({analysis.criticalBottlenecks.length})
              </h3>
              <ul className="mt-1 space-y-0.5">
                {analysis.criticalBottlenecks.map((bottleneck, idx) => (
                  <li key={idx} className="text-xs text-amber-300/90 font-medium">
                    • {bottleneck}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button
            onClick={() => setRequisitionSent(true)}
            disabled={requisitionSent}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all self-end sm:self-auto ${
              requisitionSent
                ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700'
                : 'bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-600/30 active:scale-95'
            }`}
          >
            {requisitionSent ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Pengajuan Terkirim</span>
              </>
            ) : (
              <>
                <FileText className="w-3.5 h-3.5" />
                <span>Kirim Pengajuan Belanja Lab</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Next Step Launch Simulation Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900 border border-indigo-700/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider block">
            Rekomendasi Langkah Berikutnya
          </span>
          <h4 className="text-base font-bold text-white mt-0.5">
            Jalankan Simulasi Proyek yang Disesuaikan untuk {currentStudent.name}
          </h4>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Sistem secara dinamis merekomendasikan proyek yang memanfaatkan{' '}
            <strong className="text-emerald-300 font-semibold">{analysis.readilyAvailableCount} item siap pakai</strong> di sekolah dan alternatif bahan yang aman.
          </p>
        </div>

        <button
          onClick={() => onLaunchSimulationForStudent(currentStudent)}
          className="px-4 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-cyan-300" />
          <span>Lihat Rekomendasi Simulasi</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Filter Tabs for Matrix */}
      <div className="flex items-center justify-between border-b border-slate-700 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'all'
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Semua Kebutuhan ({analysis.matchedTools.length + analysis.matchedMaterials.length})
          </button>
          <button
            onClick={() => setActiveTab('tools')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 ${
              activeTab === 'tools'
                ? 'bg-cyan-900/60 text-cyan-200 border border-cyan-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wrench className="w-3 h-3" />
            <span>Alat ({analysis.matchedTools.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('materials')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 ${
              activeTab === 'materials'
                ? 'bg-purple-900/60 text-purple-200 border border-purple-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Package className="w-3 h-3" />
            <span>Bahan ({analysis.matchedMaterials.length})</span>
          </button>
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400" /> Cocok Penuh
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400" /> Pengganti Ada
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400" /> Stok Rendah
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-400" /> Kosong
          </span>
        </div>
      </div>

      {/* Itemized Requirements Match Table */}
      <div className="rounded-2xl bg-slate-800/90 border border-slate-700 overflow-hidden shadow-lg">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-900/80 border-b border-slate-700 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">Kebutuhan Siswa & Spesifikasi</th>
              <th className="py-3 px-3">Tipe & Prioritas</th>
              <th className="py-3 px-3">Status Inventaris Sekolah</th>
              <th className="py-3 px-3">Lokasi Lab / Stok Tersedia</th>
              <th className="py-3 px-3">Status Kesiapan</th>
              <th className="py-3 px-4 text-right">Tindakan / Solusi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/60">
            {/* Tools */}
            {(activeTab === 'all' || activeTab === 'tools') &&
              analysis.matchedTools.map((match, idx) => {
                const req = match.requirement;
                const inv = match.matchedInventoryItem;
                const sub = match.substituteItem;

                return (
                  <tr key={`tool-${idx}`} className="hover:bg-slate-700/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <Wrench className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                        <div>
                          <span className="font-semibold text-slate-100 block">{req.name}</span>
                          <span className="text-[11px] text-slate-400">
                            {req.category} {req.minimumSpecs ? `• Spesifikasi: ${req.minimumSpecs}` : ''}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="text-[10px] uppercase font-bold text-cyan-300 block">
                        Alat
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${
                          req.priority === 'Kritis' || req.priority === 'Critical'
                            ? 'bg-rose-950/80 text-rose-300 border-rose-800'
                            : 'bg-blue-950/80 text-blue-300 border-blue-800'
                        }`}
                      >
                        {req.priority}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <p className="text-[11px] text-slate-300 font-medium">{match.notes}</p>
                      {sub && (
                        <span className="text-[10px] text-cyan-400 font-semibold block mt-0.5">
                          Alternatif: {sub.name}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 font-mono text-[11px] text-slate-300">
                      {inv ? (
                        <div>
                          <span className="block truncate max-w-[160px]">{inv.location}</span>
                          <span className="text-slate-400">
                            Tersedia: {inv.availableQuantity} / {inv.totalQuantity}
                          </span>
                        </div>
                      ) : sub ? (
                        <div>
                          <span className="block truncate max-w-[160px]">{sub.location}</span>
                          <span className="text-slate-400">Tersedia: {sub.availableQuantity}</span>
                        </div>
                      ) : (
                        <span className="text-rose-400 font-sans italic">Belum ada di sekolah</span>
                      )}
                    </td>

                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold border ${
                          match.status === 'Cocok Penuh'
                            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                            : match.status === 'Tersedia Pengganti'
                            ? 'bg-cyan-950/80 text-cyan-300 border-cyan-800'
                            : match.status === 'Stok Rendah'
                            ? 'bg-amber-950/80 text-amber-300 border-amber-800'
                            : 'bg-rose-950/80 text-rose-300 border-rose-800'
                        }`}
                      >
                        {match.status === 'Cocok Penuh' && <CheckCircle2 className="w-3 h-3" />}
                        {match.status === 'Tersedia Pengganti' && <Layers className="w-3 h-3" />}
                        {match.status === 'Stok Rendah' && <AlertTriangle className="w-3 h-3" />}
                        {match.status === 'Tidak Tersedia' && <XCircle className="w-3 h-3" />}
                        <span>{match.status}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {inv && inv.availableQuantity < inv.totalQuantity ? (
                        <button
                          onClick={() => onQuickReplenishItem(inv.id, 1)}
                          className="px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 text-[11px] font-semibold"
                        >
                          Check In +1
                        </button>
                      ) : match.status === 'Tidak Tersedia' ? (
                        <span className="text-[11px] text-amber-400 font-medium">Perlu Pengadaan</span>
                      ) : (
                        <span className="text-[11px] text-emerald-400 font-medium">Terverifikasi Lab</span>
                      )}
                    </td>
                  </tr>
                );
              })}

            {/* Materials */}
            {(activeTab === 'all' || activeTab === 'materials') &&
              analysis.matchedMaterials.map((match, idx) => {
                const req = match.requirement;
                const inv = match.matchedInventoryItem;
                const sub = match.substituteItem;

                return (
                  <tr key={`mat-${idx}`} className="hover:bg-slate-700/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <Package className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                        <div>
                          <span className="font-semibold text-slate-100 block">{req.name}</span>
                          <span className="text-[11px] text-slate-400">
                            Dibutuhkan: {req.quantityNeeded} {req.unit} • {req.category}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="text-[10px] uppercase font-bold text-purple-300 block">
                        Bahan
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${
                          req.priority === 'Kritis' || req.priority === 'Critical'
                            ? 'bg-rose-950/80 text-rose-300 border-rose-800'
                            : 'bg-blue-950/80 text-blue-300 border-blue-800'
                        }`}
                      >
                        {req.priority}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <p className="text-[11px] text-slate-300 font-medium">{match.notes}</p>
                      {sub && (
                        <span className="text-[10px] text-cyan-400 font-semibold block mt-0.5">
                          Pengganti: {sub.name} ({sub.availableQuantity} {sub.unit})
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 font-mono text-[11px] text-slate-300">
                      {inv ? (
                        <div>
                          <span className="block truncate max-w-[160px]">{inv.location}</span>
                          <span
                            className={
                              inv.availableQuantity < req.quantityNeeded
                                ? 'text-amber-400 font-bold'
                                : 'text-slate-400'
                            }
                          >
                            Stok: {inv.availableQuantity} {inv.unit}
                          </span>
                        </div>
                      ) : sub ? (
                        <div>
                          <span className="block truncate max-w-[160px]">{sub.location}</span>
                          <span className="text-slate-400">
                            Stok Pengganti: {sub.availableQuantity} {sub.unit}
                          </span>
                        </div>
                      ) : (
                        <span className="text-rose-400 font-sans italic">Stok habis di sekolah</span>
                      )}
                    </td>

                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold border ${
                          match.status === 'Cocok Penuh'
                            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                            : match.status === 'Tersedia Pengganti'
                            ? 'bg-cyan-950/80 text-cyan-300 border-cyan-800'
                            : match.status === 'Stok Rendah'
                            ? 'bg-amber-950/80 text-amber-300 border-amber-800'
                            : 'bg-rose-950/80 text-rose-300 border-rose-800'
                        }`}
                      >
                        {match.status === 'Cocok Penuh' && <CheckCircle2 className="w-3 h-3" />}
                        {match.status === 'Tersedia Pengganti' && <Layers className="w-3 h-3" />}
                        {match.status === 'Stok Rendah' && <AlertTriangle className="w-3 h-3" />}
                        {match.status === 'Tidak Tersedia' && <XCircle className="w-3 h-3" />}
                        <span>{match.status}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {inv ? (
                        <button
                          onClick={() => onQuickReplenishItem(inv.id, req.quantityNeeded)}
                          className="px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 text-[11px] font-semibold"
                        >
                          Restock +{req.quantityNeeded}
                        </button>
                      ) : (
                        <span className="text-[11px] text-rose-400 font-medium">Beli Barang</span>
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
