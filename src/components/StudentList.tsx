import React, { useState, useMemo } from 'react';
import { Student, InventoryItem } from '../types';
import {
  Search,
  Briefcase,
  Layers,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { analyzeStudentResourceReadiness } from '../utils/matchingLogic';

interface StudentListProps {
  students: Student[];
  inventory: InventoryItem[];
  onSelectStudentForReadiness: (student: Student) => void;
  onSelectStudentForSimulation: (student: Student) => void;
  onViewStudentDetails: (student: Student) => void;
  onOpenAddStudent: () => void;
}

const CLUSTERS = [
  'Semua Bidang Kejuruan',
  'Teknik Rekayasa & Robotika',
  'Tata Boga & Kuliner Komersial',
  'Agri-Teknologi & Lingkungan Berkelanjutan',
  'Tekstil & Desain Mode',
  'Produksi Media & Industri Kreatif',
  'Teknik Ketenagalistrikan & Energi Bersih',
];

export const StudentList: React.FC<StudentListProps> = ({
  students,
  inventory,
  onSelectStudentForReadiness,
  onSelectStudentForSimulation,
  onViewStudentDetails,
  onOpenAddStudent,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCluster, setSelectedCluster] = useState('Semua Bidang Kejuruan');
  const [selectedVentureType, setSelectedVentureType] = useState('Semua');

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.targetedProfession.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.statementOfIntent.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCluster =
        selectedCluster === 'Semua Bidang Kejuruan' || s.careerCluster === selectedCluster;

      const matchVenture =
        selectedVentureType === 'Semua' || s.ventureType === selectedVentureType;

      return matchSearch && matchCluster && matchVenture;
    });
  }, [students, searchQuery, selectedCluster, selectedVentureType]);

  return (
    <div className="space-y-6">
      {/* Intro Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 via-slate-800/90 to-indigo-950/60 p-6 border border-slate-700/80 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2">
              <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
              <span>Jalur Karir Vokasi & Pemetaan Kohort Siswa</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Direktori Karir & Minat Usaha Siswa
            </h1>
            <p className="mt-1 text-sm text-slate-300 max-w-2xl">
              Lacak cita-cita karir siswa, petakan kebutuhan alat dan bahan baku spesifik, serta hitung kelayakan kesiapan fasilitas lab dan bengkel sekolah secara real-time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAddStudent}
              className="px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-lg shadow-indigo-500/25 transition-all active:scale-95"
            >
              + Daftarkan Siswa
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari siswa, profesi yang dituju, atau kata kunci usaha..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            aria-label="Cari siswa"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Cluster Select */}
          <select
            value={selectedCluster}
            onChange={(e) => setSelectedCluster(e.target.value)}
            className="px-3 py-2 text-xs font-medium rounded-xl bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Filter berdasarkan Bidang Kejuruan"
          >
            {CLUSTERS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Venture Type Select */}
          <select
            value={selectedVentureType}
            onChange={(e) => setSelectedVentureType(e.target.value)}
            className="px-3 py-2 text-xs font-medium rounded-xl bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Filter berdasarkan Model Usaha"
          >
            <option value="Semua">Semua Model Karir/Usaha</option>
            <option value="Karier Profesional / Karyawan">Karier Profesional / Karyawan</option>
            <option value="Wirausaha Mandiri">Wirausaha Mandiri</option>
            <option value="Kewirausahaan Sosial">Kewirausahaan Sosial</option>
          </select>
        </div>
      </div>

      {/* Students Cards Grid */}
      {filteredStudents.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-2xl bg-slate-800/40 border border-slate-800">
          <HelpCircle className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-200">Tidak ada siswa yang sesuai</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Coba sesuaikan kata kunci pencarian atau daftarkan profil siswa baru dengan kebutuhan kejuruan.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCluster('Semua Bidang Kejuruan');
              setSelectedVentureType('Semua');
            }}
            className="mt-4 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600"
          >
            Reset Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredStudents.map((student) => {
            const readiness = analyzeStudentResourceReadiness(student, inventory);
            const isHighReadiness = readiness.readinessScore >= 75;
            const isModerateReadiness = readiness.readinessScore >= 50 && readiness.readinessScore < 75;

            return (
              <div
                key={student.id}
                className="group relative flex flex-col justify-between rounded-2xl bg-slate-800/90 border border-slate-700 hover:border-indigo-500/50 p-5 shadow-lg hover:shadow-indigo-500/10 transition-all duration-200"
              >
                <div>
                  {/* Top Bar: Grade & Venture Type */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      {student.grade}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        student.ventureType === 'Wirausaha Mandiri'
                          ? 'bg-purple-950/70 text-purple-300 border-purple-800/60'
                          : student.ventureType === 'Kewirausahaan Sosial'
                          ? 'bg-emerald-950/70 text-emerald-300 border-emerald-800/60'
                          : 'bg-blue-950/70 text-blue-300 border-blue-800/60'
                      }`}
                    >
                      {student.ventureType}
                    </span>
                  </div>

                  {/* Student Identity */}
                  <div className="flex items-start gap-3.5 mb-3.5">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-base shadow-md flex-shrink-0">
                      {student.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-white group-hover:text-indigo-300 transition-colors">
                        {student.name}
                      </h3>
                      <p className="text-xs font-semibold text-cyan-400 flex items-center gap-1 mt-0.5">
                        <Briefcase className="w-3 h-3 text-cyan-400" />
                        {student.targetedProfession}
                      </p>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        {student.careerCluster}
                      </span>
                    </div>
                  </div>

                  {/* Statement of Intent */}
                  <p className="text-xs text-slate-300 line-clamp-2 italic bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/80 mb-4">
                    "{student.statementOfIntent}"
                  </p>

                  {/* Requirements Snapshot */}
                  <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                    <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                      <span className="text-[11px] text-slate-400 block">Alat Diperlukan</span>
                      <span className="font-mono font-bold text-slate-200">
                        {student.requirements.tools.length} Peralatan Lab
                      </span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                      <span className="text-[11px] text-slate-400 block">Bahan Diperlukan</span>
                      <span className="font-mono font-bold text-slate-200">
                        {student.requirements.materials.length} Bahan Baku
                      </span>
                    </div>
                  </div>

                  {/* Live School Resource Feasibility Meter */}
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 mb-4">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-semibold text-slate-300 flex items-center gap-1">
                        {isHighReadiness ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        ) : isModerateReadiness ? (
                          <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                        ) : (
                          <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                        )}
                        Kesiapan Sumber Daya Sekolah
                      </span>
                      <span
                        className={`font-mono font-bold ${
                          isHighReadiness
                            ? 'text-emerald-400'
                            : isModerateReadiness
                            ? 'text-amber-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {readiness.readinessScore}% Cocok
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          isHighReadiness
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                            : isModerateReadiness
                            ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                            : 'bg-gradient-to-r from-rose-500 to-orange-500'
                        }`}
                        style={{ width: `${Math.max(8, readiness.readinessScore)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                      <span>Alat: {readiness.toolsScore}%</span>
                      <span>Bahan: {readiness.materialsScore}%</span>
                      {readiness.substituteCount > 0 && (
                        <span className="text-cyan-400 font-medium">
                          {readiness.substituteCount} opsi pengganti
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-2 border-t border-slate-700/60 flex flex-col gap-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onSelectStudentForReadiness(student)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-700/80 hover:bg-slate-700 text-slate-200 border border-slate-600/60 transition-all flex items-center justify-center gap-1 active:scale-95"
                    >
                      <Layers className="w-3 h-3 text-amber-400" />
                      <span>Matriks Kesenjangan</span>
                    </button>
                    <button
                      onClick={() => onViewStudentDetails(student)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-700/80 hover:bg-slate-700 text-slate-200 border border-slate-600/60 transition-all flex items-center justify-center gap-1 active:scale-95"
                    >
                      <span>Profil Lengkap</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                    </button>
                  </div>

                  <button
                    onClick={() => onSelectStudentForSimulation(student)}
                    className="w-full py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                    <span>Rekomendasikan Simulasi Proyek</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
