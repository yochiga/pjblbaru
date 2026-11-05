import React from 'react';
import { RecommendedProject, ProjectStep } from '../types/recommender';
import {
  CheckCircle2,
  Clock,
  Award,
  ShieldCheck,
  FileText,
  UserCheck,
  Building,
  Check,
  Percent,
  BookmarkCheck,
} from 'lucide-react';

interface JobsheetAssessmentReportProps {
  project: RecommendedProject;
  steps: ProjectStep[];
  completedSteps: number[];
  studentName: string;
  schoolName: string;
  studentNotes: string;
  teacherNotes: string;
  onTeacherNotesChange?: (val: string) => void;
  isEditableOnScreen?: boolean;
}

export const JobsheetAssessmentReport: React.FC<JobsheetAssessmentReportProps> = ({
  project,
  steps,
  completedSteps,
  studentName,
  schoolName,
  studentNotes,
  teacherNotes,
  onTeacherNotesChange,
  isEditableOnScreen = false,
}) => {
  const totalSteps = steps.length;
  const completedCount = completedSteps.length;
  const successPercentage = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

  // Perhitungan Rubrik Penilaian Standar Asesmen Kejuruan SMK
  // 1. Aspek K3 & Sikap Kerja (Bobot 20%)
  const scoreK3 = completedCount === 0 ? 10 : successPercentage >= 80 ? 20 : 17;
  // 2. Aspek Proses & Keterampilan Praktik (Bobot 40%)
  const scoreProses = Math.round((completedCount / (totalSteps || 1)) * 40);
  // 3. Aspek Kualitas Hasil Produk / Deliverable (Bobot 30%)
  const scoreProduk =
    successPercentage === 100 ? 30 : Math.round((completedCount / (totalSteps || 1)) * 26);
  // 4. Aspek Efisiensi Waktu & Ketertiban (Bobot 10%)
  const scoreWaktu = completedCount > 0 ? 10 : 5;

  const totalScore = Math.min(100, scoreK3 + scoreProses + scoreProduk + scoreWaktu);

  let gradeLetter = 'A';
  let gradePredicate = 'Amat Baik (Sangat Kompeten)';
  let kktpStatus = 'TUNTAS (MEMENUHI STANDAR INDUSTRI)';

  if (totalScore >= 88) {
    gradeLetter = 'A';
    gradePredicate = 'Amat Baik (Sangat Kompeten)';
    kktpStatus = 'TUNTAS (MEMENUHI STANDAR INDUSTRI)';
  } else if (totalScore >= 75) {
    gradeLetter = 'B';
    gradePredicate = 'Baik (Kompeten)';
    kktpStatus = 'TUNTAS (STANDAR TERCAPAI)';
  } else if (totalScore >= 60) {
    gradeLetter = 'C';
    gradePredicate = 'Cukup (Cukup Kompeten)';
    kktpStatus = 'TUNTAS BERSYARAT';
  } else {
    gradeLetter = 'D';
    gradePredicate = 'Kurang (Perlu Remedial)';
    kktpStatus = 'BELUM TUNTAS (PERLU PENDAMPINGAN)';
  }

  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="bg-white text-slate-900 font-sans p-6 sm:p-10 rounded-2xl shadow-sm border border-slate-200 print:border-none print:shadow-none print:p-0 print:m-0 w-full max-w-4xl mx-auto space-y-6">
      {/* ---------------------------------------------------- */}
      {/* KOP SURAT RESMI LAPORAN KEJURUAN */}
      {/* ---------------------------------------------------- */}
      <div className="border-b-4 border-double border-slate-900 pb-4 text-center space-y-1">
        <div className="flex items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-900 text-white flex items-center justify-center font-bold text-sm shrink-0 print:border print:border-slate-900">
            SMK
          </div>
          <div>
            <h4 className="text-[11px] font-bold tracking-widest uppercase text-slate-700">
              KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI
            </h4>
            <h3 className="text-base sm:text-lg font-black tracking-tight uppercase text-slate-950">
              {schoolName || 'SMKN 4 KENDARI'}
            </h3>
            <p className="text-[10px] text-slate-600">
              Konsentrasi Keahlian & Lembaga Sertifikasi Profesi (LSP-P1) • Kurikulum Merdeka Kejuruan
            </p>
          </div>
        </div>

        <div className="pt-2">
          <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-wide text-indigo-950 bg-slate-100 py-1 px-3 rounded inline-block border border-slate-300 print:border-slate-800">
            LAPORAN ASESMEN KINERJA PRAKTIK & EVALUASI JOBSHEET KEJURUAN
          </h2>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
            Nomor Dokumen: DOC/SMK/VC-{project.id.toUpperCase().slice(0, 10)}/{new Date().getFullYear()}
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* IDENTITAS PRAKTIKAN & DATA PROYEK */}
      {/* ---------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200 print:bg-transparent print:border-slate-800">
        <div className="space-y-1.5">
          <div className="flex">
            <span className="w-36 font-semibold text-slate-600">Nama Siswa Praktikan</span>
            <span className="text-slate-900 font-bold">: {studentName || 'Siswa Vokasi'}</span>
          </div>
          <div className="flex">
            <span className="w-36 font-semibold text-slate-600">Satuan Pendidikan</span>
            <span className="text-slate-900 font-bold">: {schoolName || 'SMKN 4 Kendari'}</span>
          </div>
          <div className="flex">
            <span className="w-36 font-semibold text-slate-600">Profesi / Kejuruan Target</span>
            <span className="text-slate-900 font-bold">: {project.targetProfession}</span>
          </div>
          <div className="flex">
            <span className="w-36 font-semibold text-slate-600">Tanggal Pelaksanaan</span>
            <span className="text-slate-900">: {currentDate}</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex">
            <span className="w-36 font-semibold text-slate-600">Judul Proyek Praktik</span>
            <span className="text-slate-900 font-bold">: {project.badgeEarned || project.title}</span>
          </div>
          <div className="flex">
            <span className="w-36 font-semibold text-slate-600">Tingkat Kesulitan / Jam</span>
            <span className="text-slate-900">: {project.difficulty} • {project.estimatedHours}</span>
          </div>
          <div className="flex">
            <span className="w-36 font-semibold text-slate-600">Luaran Karya (Deliverable)</span>
            <span className="text-slate-900 font-medium">: {project.deliverable}</span>
          </div>
          <div className="flex">
            <span className="w-36 font-semibold text-slate-600">Lencana Kompetensi</span>
            <span className="text-indigo-800 font-bold">: {project.badgeEarned}</span>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* BAGIAN 1: LAPORAN PERSENTASE KEBERHASILAN (SUCCESS RATE) */}
      {/* ---------------------------------------------------- */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b-2 border-slate-800 pb-1.5">
          <h3 className="font-extrabold text-xs sm:text-sm uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
            <Percent className="w-4 h-4 text-indigo-700" />
            I. LAPORAN PERSENTASE KEBERHASILAN & KETERCAPAIAN LANGKAH KERJA
          </h3>
          <span className="text-[11px] font-bold text-slate-600">Status Capaian</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          {/* Box 1: Persentase Keberhasilan Langkah */}
          <div className="p-3.5 rounded-xl border border-slate-300 bg-slate-50 print:bg-transparent print:border-slate-800 space-y-1">
            <span className="text-[11px] font-bold uppercase text-slate-600 block">
              Persentase Keberhasilan
            </span>
            <div className="text-2xl sm:text-3xl font-black text-indigo-700 font-mono">
              {successPercentage}%
            </div>
            <span className="text-[11px] text-slate-600 block">
              {completedCount} dari {totalSteps} Langkah Tuntas
            </span>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-1 print:border print:border-slate-400">
              <div
                className="bg-indigo-600 h-full rounded-full"
                style={{ width: `${successPercentage}%` }}
              />
            </div>
          </div>

          {/* Box 2: Kesiapan Alat & Bahan Pengganti */}
          <div className="p-3.5 rounded-xl border border-slate-300 bg-slate-50 print:bg-transparent print:border-slate-800 space-y-1">
            <span className="text-[11px] font-bold uppercase text-slate-600 block">
              Kesiapan Alat & Bahan
            </span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-700 font-mono">
              {project.readinessPercentage}%
            </div>
            <span className="text-[11px] text-slate-600 block">
              Tingkat Substitusi Mandiri
            </span>
            <span className="text-[10px] text-emerald-800 font-bold block bg-emerald-50 py-0.5 rounded border border-emerald-200 print:border-none">
              Tersedia di Lingkungan Siswa
            </span>
          </div>

          {/* Box 3: Hasil Kualifikasi Kompetensi */}
          <div className="p-3.5 rounded-xl border border-slate-300 bg-slate-50 print:bg-transparent print:border-slate-800 space-y-1">
            <span className="text-[11px] font-bold uppercase text-slate-600 block">
              Status Kelulusan KKTP
            </span>
            <div className="text-xl sm:text-2xl font-black text-slate-900">
              Grade {gradeLetter}
            </div>
            <span className="text-[11px] font-semibold text-slate-700 block">
              {gradePredicate.split('(')[0]}
            </span>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-100 text-indigo-900 border border-indigo-200 block print:border-slate-800">
              {kktpStatus}
            </span>
          </div>
        </div>

        {/* Representasi Kejuruan Proyek */}
        <div className="p-3 rounded-lg bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-950 space-y-1 print:bg-transparent print:border-slate-400">
          <strong className="block text-[11px] font-bold text-indigo-900">
            Rasionalisasi Representasi Industri & Kejuruan:
          </strong>
          <p className="leading-relaxed text-slate-800">{project.representationRationale}</p>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* BAGIAN 2: VERIFIKASI LANGKAH KERJA JOBSHEET */}
      {/* ---------------------------------------------------- */}
      <div className="space-y-3 print-page-break-avoid">
        <div className="flex items-center justify-between border-b-2 border-slate-800 pb-1.5">
          <h3 className="font-extrabold text-xs sm:text-sm uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            II. CEKLIS PELAKSANAAN & VERIFIKASI LANGKAH KERJA (SOP)
          </h3>
          <span className="text-[11px] font-bold text-slate-600">Verifikasi Prosedur</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse border border-slate-300 print:border-slate-800">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-bold print:bg-slate-200">
                <th className="p-2 border border-slate-300 print:border-slate-800 w-8 text-center">No</th>
                <th className="p-2 border border-slate-300 print:border-slate-800 w-44">Tahapan Praktik</th>
                <th className="p-2 border border-slate-300 print:border-slate-800">Instruksi Prosedur & Pengendalian K3</th>
                <th className="p-2 border border-slate-300 print:border-slate-800 w-44">Titik Kritis (Checkpoint)</th>
                <th className="p-2 border border-slate-300 print:border-slate-800 w-24 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {steps.map((st, idx) => {
                const isDone = completedSteps.includes(idx);
                return (
                  <tr key={idx} className={idx % 2 === 1 ? 'bg-slate-50 print:bg-transparent' : ''}>
                    <td className="p-2 border border-slate-300 print:border-slate-800 text-center font-bold">
                      {st.stepNumber || idx + 1}
                    </td>
                    <td className="p-2 border border-slate-300 print:border-slate-800 font-bold text-slate-900">
                      {st.title}
                    </td>
                    <td className="p-2 border border-slate-300 print:border-slate-800 text-slate-700 leading-relaxed">
                      {st.instruction}
                      {st.safetyTip && (
                        <div className="mt-1 text-[11px] text-amber-800 font-medium">
                          ⚠️ <em>K3: {st.safetyTip}</em>
                        </div>
                      )}
                    </td>
                    <td className="p-2 border border-slate-300 print:border-slate-800 text-slate-600 font-mono text-[11px]">
                      {st.checkpoint || 'Pemeriksaan fungsi & kesesuaian fisik'}
                    </td>
                    <td className="p-2 border border-slate-300 print:border-slate-800 text-center font-bold">
                      {isDone ? (
                        <span className="text-emerald-700 font-bold inline-flex items-center gap-1">
                          [ ✔ ] Tuntas
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium">[ &nbsp;&nbsp; ] Belum</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* BAGIAN 3: RUBRIK PENILAIAN STANDAR ASESMEN KEJURUAN */}
      {/* ---------------------------------------------------- */}
      <div className="space-y-3 print-page-break-avoid">
        <div className="flex items-center justify-between border-b-2 border-slate-800 pb-1.5">
          <h3 className="font-extrabold text-xs sm:text-sm uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-700" />
            III. RUBRIK PENILAIAN KOMPETENSI KEJURUAN (ASPEK TERSTRUKTUR)
          </h3>
          <span className="text-[11px] font-bold text-slate-600">Bobot Total: 100%</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse border border-slate-300 print:border-slate-800">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-bold print:bg-slate-200">
                <th className="p-2 border border-slate-300 print:border-slate-800 w-8 text-center">No</th>
                <th className="p-2 border border-slate-300 print:border-slate-800 w-44">Komponen / Aspek Penilaian</th>
                <th className="p-2 border border-slate-300 print:border-slate-800">Indikator Pencapaian Kompetensi</th>
                <th className="p-2 border border-slate-300 print:border-slate-800 w-16 text-center">Bobot</th>
                <th className="p-2 border border-slate-300 print:border-slate-800 w-20 text-center">Skor Capaian</th>
              </tr>
            </thead>
            <tbody>
              {/* Aspek 1: K3 */}
              <tr>
                <td className="p-2 border border-slate-300 print:border-slate-800 text-center font-bold">1</td>
                <td className="p-2 border border-slate-300 print:border-slate-800 font-bold text-slate-900">
                  Sikap Kerja & K3 (Safety)
                </td>
                <td className="p-2 border border-slate-300 print:border-slate-800 text-slate-700">
                  Menerapkan protokol K3 ({project.safetyProtocols?.length || 2} prosedur), memelihara ketertiban alat dan kebersihan ruang praktik.
                </td>
                <td className="p-2 border border-slate-300 print:border-slate-800 text-center font-bold">20%</td>
                <td className="p-2 border border-slate-300 print:border-slate-800 text-center font-bold text-indigo-700">
                  {scoreK3} / 20
                </td>
              </tr>

              {/* Aspek 2: Proses */}
              <tr className="bg-slate-50 print:bg-transparent">
                <td className="p-2 border border-slate-300 print:border-slate-800 text-center font-bold">2</td>
                <td className="p-2 border border-slate-300 print:border-slate-800 font-bold text-slate-900">
                  Keterampilan Proses Praktik
                </td>
                <td className="p-2 border border-slate-300 print:border-slate-800 text-slate-700">
                  Ketepatan langkah SOP, adaptasi material sekitar, penguasaan pengoperasian peralatan proyek secara mandiri.
                </td>
                <td className="p-2 border border-slate-300 print:border-slate-800 text-center font-bold">40%</td>
                <td className="p-2 border border-slate-300 print:border-slate-800 text-center font-bold text-indigo-700">
                  {scoreProses} / 40
                </td>
              </tr>

              {/* Aspek 3: Kualitas Hasil */}
              <tr>
                <td className="p-2 border border-slate-300 print:border-slate-800 text-center font-bold">3</td>
                <td className="p-2 border border-slate-300 print:border-slate-800 font-bold text-slate-900">
                  Kualitas Produk / Deliverable
                </td>
                <td className="p-2 border border-slate-300 print:border-slate-800 text-slate-700">
                  Kesesuaian luaran (<em>{project.deliverable}</em>), kehandalan fungsi teknis, kerapian perakitan dan estetika hasil akhir.
                </td>
                <td className="p-2 border border-slate-300 print:border-slate-800 text-center font-bold">30%</td>
                <td className="p-2 border border-slate-300 print:border-slate-800 text-center font-bold text-indigo-700">
                  {scoreProduk} / 30
                </td>
              </tr>

              {/* Aspek 4: Efisiensi Waktu */}
              <tr className="bg-slate-50 print:bg-transparent">
                <td className="p-2 border border-slate-300 print:border-slate-800 text-center font-bold">4</td>
                <td className="p-2 border border-slate-300 print:border-slate-800 font-bold text-slate-900">
                  Efisiensi Waktu & Tanggung Jawab
                </td>
                <td className="p-2 border border-slate-300 print:border-slate-800 text-slate-700">
                  Ketepatan alokasi waktu pengerjaan ({project.estimatedHours}) dan pengembalian alat dalam kondisi baik.
                </td>
                <td className="p-2 border border-slate-300 print:border-slate-800 text-center font-bold">10%</td>
                <td className="p-2 border border-slate-300 print:border-slate-800 text-center font-bold text-indigo-700">
                  {scoreWaktu} / 10
                </td>
              </tr>

              {/* Baris Total Nilai Akhir */}
              <tr className="bg-slate-100 font-bold text-slate-900 print:bg-slate-200">
                <td colSpan={3} className="p-2.5 border border-slate-300 print:border-slate-800 text-right uppercase">
                  Total Nilai Akhir Praktik (Skala 100):
                </td>
                <td className="p-2.5 border border-slate-300 print:border-slate-800 text-center">100%</td>
                <td className="p-2.5 border border-slate-300 print:border-slate-800 text-center text-sm font-black text-indigo-900">
                  {totalScore}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* BAGIAN 4: CATATAN PENGAMATAN & REKOMENDASI OLEH GURU */}
      {/* ---------------------------------------------------- */}
      <div className="space-y-4 print-page-break-avoid">
        <div className="flex items-center justify-between border-b-2 border-slate-800 pb-1.5">
          <h3 className="font-extrabold text-xs sm:text-sm uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-slate-800" />
            IV. CATATAN PENGAMATAN, KENDALA & REKOMENDASI GURU PEMBIMBING
          </h3>
          <span className="text-[11px] font-bold text-slate-600">Evaluasi Kualitatif</span>
        </div>

        {/* 1. Catatan Siswa Praktikan */}
        <div className="p-3.5 rounded-xl border border-slate-300 bg-slate-50 print:bg-transparent print:border-slate-800 space-y-1 text-xs">
          <strong className="text-slate-900 block font-bold">
            A. Catatan Refleksi & Hasil Pengamatan Siswa Praktikan:
          </strong>
          <p className="text-slate-700 italic leading-relaxed">
            {studentNotes ? `"${studentNotes}"` : '(Siswa tidak menambahkan catatan kendala khusus selama pelaksanaan praktik).'}
          </p>
        </div>

        {/* 2. Catatan Pengamatan & Rekomendasi Guru */}
        <div className="p-3.5 rounded-xl border border-slate-300 bg-slate-50 print:bg-transparent print:border-slate-800 space-y-1 text-xs">
          <strong className="text-slate-900 block font-bold">
            B. Catatan Pengamatan, Umpan Balik & Rekomendasi Guru Pengampu:
          </strong>
          {isEditableOnScreen && onTeacherNotesChange ? (
            <textarea
              rows={3}
              value={teacherNotes}
              onChange={(e) => onTeacherNotesChange(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded p-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 print:hidden"
              placeholder="Tuliskan catatan evaluasi kualitatif guru..."
            />
          ) : null}
          <p className="text-slate-800 leading-relaxed">
            {teacherNotes ||
              'Siswa menunjukkan kemandirian dan keterampilan yang baik dalam menyelesaikan proyek jobsheet ini. Protokol K3 diterapkan dengan disiplin, dan luaran karya memenuhi standar kompetensi kejuruan yang ditetapkan.'}
          </p>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* BAGIAN 5: LEMBAR PENGESAHAN TANDA TANGAN (TIGA PIHAK) */}
      {/* ---------------------------------------------------- */}
      <div className="pt-4 border-t-2 border-slate-800 space-y-3 print-page-break-avoid">
        <div className="text-right text-xs text-slate-700 font-medium">
          Ditetapkan di: <strong>Kendari</strong>, Tanggal: <strong>{currentDate}</strong>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center text-xs text-slate-900 pt-2">
          {/* Tanda Tangan 1: Siswa */}
          <div className="flex flex-col justify-between h-28 border-r border-slate-200 print:border-none">
            <span className="font-semibold text-slate-600">Siswa Praktikan,</span>
            <div>
              <span className="font-bold underline block text-slate-900 uppercase">
                {studentName || 'Siswa Vokasi'}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">NISN: ................................</span>
            </div>
          </div>

          {/* Tanda Tangan 2: Guru Pembimbing */}
          <div className="flex flex-col justify-between h-28 border-r border-slate-200 print:border-none">
            <span className="font-semibold text-slate-600">Guru Pembimbing / Penguji,</span>
            <div>
              <span className="font-bold underline block text-slate-900 uppercase">
                Guru Kejuruan SMK
              </span>
              <span className="text-[10px] text-slate-500 font-mono">NIP: ................................</span>
            </div>
          </div>

          {/* Tanda Tangan 3: Kepala Program */}
          <div className="flex flex-col justify-between h-28">
            <span className="font-semibold text-slate-600">Ketua Konsentrasi Keahlian,</span>
            <div>
              <span className="font-bold underline block text-slate-900 uppercase">
                Kepala Program SMK
              </span>
              <span className="text-[10px] text-slate-500 font-mono">NIP: ................................</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
