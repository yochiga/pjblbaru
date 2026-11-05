import { jsPDF } from 'jspdf';
import { RecommendedProject, ProjectStep } from '../types/recommender';

export interface GeneratePdfOptions {
  project: RecommendedProject;
  steps: ProjectStep[];
  completedSteps: number[];
  studentName: string;
  schoolName: string;
  studentNotes: string;
  teacherNotes: string;
}

export function generateAndDownloadJobsheetPdf({
  project,
  steps,
  completedSteps,
  studentName,
  schoolName,
  studentNotes,
  teacherNotes,
}: GeneratePdfOptions): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const marginX = 14;
  const contentWidth = pageWidth - marginX * 2; // 182 mm
  let currentY = 14;

  const totalSteps = steps.length;
  const completedCount = completedSteps.length;
  const successPercentage = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

  // Skor rubrik terstruktur
  const scoreK3 = completedCount === 0 ? 10 : successPercentage >= 80 ? 20 : 17;
  const scoreProses = Math.round((completedCount / (totalSteps || 1)) * 40);
  const scoreProduk =
    successPercentage === 100 ? 30 : Math.round((completedCount / (totalSteps || 1)) * 26);
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

  // Helper check page overflow
  const ensureSpace = (neededHeight: number) => {
    if (currentY + neededHeight > pageHeight - 14) {
      doc.addPage();
      currentY = 14;
      // Header mini pada halaman lanjutan
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(
        `Laporan Asesmen Jobsheet - ${project.title} (${studentName}) - Halaman ${doc.getNumberOfPages()}`,
        marginX,
        currentY - 4
      );
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.3);
      doc.line(marginX, currentY - 2, marginX + contentWidth, currentY - 2);
    }
  };

  // ----------------------------------------------------
  // 1. KOP SURAT RESMI
  // ----------------------------------------------------
  // Badge SMK Logo Kiri
  doc.setFillColor(30, 27, 75); // Indigo 950
  doc.roundedRect(marginX, currentY, 12, 12, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('SMK', marginX + 6, currentY + 7.5, { align: 'center' });

  // Teks Kop Surat
  doc.setTextColor(51, 65, 85);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI', marginX + 16, currentY + 3.5);

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(schoolName.toUpperCase() || 'SMKN 4 KENDARI', marginX + 16, currentY + 8);

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text(
    'Konsentrasi Keahlian & Lembaga Sertifikasi Profesi (LSP-P1) • Kurikulum Merdeka Kejuruan',
    marginX + 16,
    currentY + 11.5
  );

  currentY += 15;

  // Garis Ganda Kop Surat
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.8);
  doc.line(marginX, currentY, marginX + contentWidth, currentY);
  doc.setLineWidth(0.2);
  doc.line(marginX, currentY + 0.8, marginX + contentWidth, currentY + 0.8);

  currentY += 4.5;

  // Judul Laporan
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(marginX, currentY, contentWidth, 8, 1, 1, 'F');
  doc.setTextColor(30, 27, 75);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('LAPORAN ASESMEN KINERJA PRAKTIK & EVALUASI JOBSHEET KEJURUAN', marginX + contentWidth / 2, currentY + 5.2, {
    align: 'center',
  });

  currentY += 9.5;

  doc.setFont('courier', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Nomor Registrasi: DOC/SMK/VC-${project.id.toUpperCase().slice(0, 10)}/${new Date().getFullYear()} • Terverifikasi Sistem`,
    marginX + contentWidth / 2,
    currentY + 1,
    { align: 'center' }
  );

  currentY += 4.5;

  // ----------------------------------------------------
  // 2. IDENTITAS SISWA & PROYEK (GRID BOX)
  // ----------------------------------------------------
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(marginX, currentY, contentWidth, 23, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);

  const col1X = marginX + 3;
  const col2X = marginX + contentWidth / 2 + 2;

  // Kolom Kiri
  doc.setTextColor(100, 116, 139);
  doc.text('Nama Siswa Praktikan', col1X, currentY + 5);
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text(`: ${studentName || 'Siswa Vokasi'}`, col1X + 34, currentY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Satuan Pendidikan', col1X, currentY + 9.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`: ${schoolName}`, col1X + 34, currentY + 9.5);

  doc.setTextColor(100, 116, 139);
  doc.text('Profesi / Kejuruan', col1X, currentY + 14);
  doc.setTextColor(30, 27, 75);
  doc.setFont('helvetica', 'bold');
  doc.text(`: ${project.targetProfession}`, col1X + 34, currentY + 14);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Tanggal Asesmen', col1X, currentY + 18.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`: ${currentDate}`, col1X + 34, currentY + 18.5);

  // Kolom Kanan
  doc.setTextColor(100, 116, 139);
  doc.text('Judul Proyek', col2X, currentY + 5);
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  const shortTitle = project.title.length > 34 ? project.title.slice(0, 34) + '...' : project.title;
  doc.text(`: ${shortTitle}`, col2X + 28, currentY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Tingkat & Waktu', col2X, currentY + 9.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`: ${project.difficulty} • ${project.estimatedHours}`, col2X + 28, currentY + 9.5);

  doc.setTextColor(100, 116, 139);
  doc.text('Luaran Produk', col2X, currentY + 14);
  doc.setTextColor(15, 23, 42);
  const shortDeliv = project.deliverable.length > 34 ? project.deliverable.slice(0, 34) + '...' : project.deliverable;
  doc.text(`: ${shortDeliv}`, col2X + 28, currentY + 14);

  doc.setTextColor(100, 116, 139);
  doc.text('Lencana Kompetensi', col2X, currentY + 18.5);
  doc.setTextColor(67, 56, 202);
  doc.setFont('helvetica', 'bold');
  doc.text(`: ${project.badgeEarned}`, col2X + 28, currentY + 18.5);

  currentY += 27;

  // ----------------------------------------------------
  // 3. BAGIAN I: LAPORAN PERSENTASE KEBERHASILAN (SUCCESS RATE)
  // ----------------------------------------------------
  ensureSpace(28);

  doc.setFillColor(30, 27, 75);
  doc.rect(marginX, currentY, 2.5, 4.5, 'F');
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('I. LAPORAN PERSENTASE KEBERHASILAN & KETERCAPAIAN LANGKAH KERJA', marginX + 4.5, currentY + 3.5);

  currentY += 6;

  // 3 Kartu Metrik
  const cardWidth = (contentWidth - 6) / 3;

  // Card 1: Persentase Keberhasilan
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(marginX, currentY, cardWidth, 16, 1.5, 1.5, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text('PERSENTASE KEBERHASILAN', marginX + cardWidth / 2, currentY + 4, { align: 'center' });
  doc.setFontSize(14);
  doc.setTextColor(67, 56, 202);
  doc.text(`${successPercentage}%`, marginX + cardWidth / 2, currentY + 10.5, { align: 'center' });
  doc.setFontSize(6.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`${completedCount} dari ${totalSteps} Langkah Tuntas`, marginX + cardWidth / 2, currentY + 14, { align: 'center' });

  // Card 2: Kesiapan Alat & Bahan
  const c2X = marginX + cardWidth + 3;
  doc.setFillColor(240, 253, 244);
  doc.roundedRect(c2X, currentY, cardWidth, 16, 1.5, 1.5, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(22, 101, 52);
  doc.text('KESIAPAN ALAT & BAHAN', c2X + cardWidth / 2, currentY + 4, { align: 'center' });
  doc.setFontSize(14);
  doc.setTextColor(21, 128, 61);
  doc.text(`${project.readinessPercentage}%`, c2X + cardWidth / 2, currentY + 10.5, { align: 'center' });
  doc.setFontSize(6.5);
  doc.setTextColor(22, 101, 52);
  doc.text('Kesiapan Sumber Daya Mandiri', c2X + cardWidth / 2, currentY + 14, { align: 'center' });

  // Card 3: Grade & Status KKTP
  const c3X = marginX + (cardWidth + 3) * 2;
  doc.setFillColor(238, 242, 255);
  doc.roundedRect(c3X, currentY, cardWidth, 16, 1.5, 1.5, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(55, 48, 163);
  doc.text('STATUS KELULUSAN KKTP', c3X + cardWidth / 2, currentY + 4, { align: 'center' });
  doc.setFontSize(13);
  doc.setTextColor(30, 27, 75);
  doc.text(`Grade ${gradeLetter} (${totalScore})`, c3X + cardWidth / 2, currentY + 10.5, { align: 'center' });
  doc.setFontSize(6);
  doc.setTextColor(67, 56, 202);
  doc.text(kktpStatus, c3X + cardWidth / 2, currentY + 14, { align: 'center' });

  currentY += 19;

  // Rationale Kejuruan Box
  ensureSpace(12);
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(marginX, currentY, contentWidth, 10, 1, 1, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(30, 27, 75);
  doc.text('Representasi Industri & Dunia Kerja:', marginX + 3, currentY + 3.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  const ratText = doc.splitTextToSize(project.representationRationale, contentWidth - 6);
  doc.text(ratText.slice(0, 2), marginX + 3, currentY + 7);

  currentY += 14;

  // ----------------------------------------------------
  // 4. BAGIAN II: CEKLIS VERIFIKASI LANGKAH KERJA (SOP)
  // ----------------------------------------------------
  ensureSpace(20);

  doc.setFillColor(30, 27, 75);
  doc.rect(marginX, currentY, 2.5, 4.5, 'F');
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('II. CEKLIS PELAKSANAAN & VERIFIKASI LANGKAH KERJA JOBSHEET (SOP)', marginX + 4.5, currentY + 3.5);

  currentY += 6;

  // Tabel Header
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(148, 163, 184);
  doc.rect(marginX, currentY, contentWidth, 6, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(15, 23, 42);
  doc.text('No', marginX + 2, currentY + 4.2);
  doc.text('Tahapan Praktik', marginX + 11, currentY + 4.2);
  doc.text('Instruksi Prosedur & Pengendalian K3', marginX + 54, currentY + 4.2);
  doc.text('Titik Kritis (Checkpoint)', marginX + 130, currentY + 4.2);
  doc.text('Status', marginX + 165, currentY + 4.2);

  currentY += 6;

  // Baris Tabel Langkah
  steps.forEach((st, idx) => {
    const isDone = completedSteps.includes(idx);
    const rowHeight = 9.5;
    ensureSpace(rowHeight);

    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(marginX, currentY, contentWidth, rowHeight, 'F');
    }
    doc.setDrawColor(226, 232, 240);
    doc.line(marginX, currentY + rowHeight, marginX + contentWidth, currentY + rowHeight);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(15, 23, 42);
    doc.text(`${st.stepNumber || idx + 1}`, marginX + 2.5, currentY + 5.5);

    doc.text(st.title.length > 25 ? st.title.slice(0, 25) + '...' : st.title, marginX + 11, currentY + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(51, 65, 85);
    const inst = st.instruction.length > 60 ? st.instruction.slice(0, 60) + '...' : st.instruction;
    doc.text(inst, marginX + 54, currentY + 4.2);
    if (st.safetyTip) {
      doc.setTextColor(180, 83, 9);
      doc.text(`K3: ${st.safetyTip.slice(0, 50)}`, marginX + 54, currentY + 7.5);
    }

    doc.setFontSize(6.5);
    doc.setTextColor(71, 85, 105);
    const cp = st.checkpoint ? (st.checkpoint.length > 25 ? st.checkpoint.slice(0, 25) + '...' : st.checkpoint) : 'Pemeriksaan fungsi fisik';
    doc.text(cp, marginX + 130, currentY + 5.5);

    // Status
    if (isDone) {
      doc.setTextColor(21, 128, 61);
      doc.setFont('helvetica', 'bold');
      doc.text('[ V ] Tuntas', marginX + 165, currentY + 5.5);
    } else {
      doc.setTextColor(148, 163, 184);
      doc.setFont('helvetica', 'normal');
      doc.text('[   ] Belum', marginX + 165, currentY + 5.5);
    }

    currentY += rowHeight;
  });

  currentY += 4;

  // ----------------------------------------------------
  // 5. BAGIAN III: RUBRIK PENILAIAN KOMPETENSI KEJURUAN
  // ----------------------------------------------------
  ensureSpace(40);

  doc.setFillColor(30, 27, 75);
  doc.rect(marginX, currentY, 2.5, 4.5, 'F');
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('III. RUBRIK PENILAIAN KOMPETENSI KEJURUAN (ASPEK TERSTRUKTUR)', marginX + 4.5, currentY + 3.5);

  currentY += 6;

  // Header Rubrik
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(148, 163, 184);
  doc.rect(marginX, currentY, contentWidth, 5.5, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(15, 23, 42);
  doc.text('No', marginX + 2, currentY + 3.8);
  doc.text('Komponen / Aspek Penilaian', marginX + 11, currentY + 3.8);
  doc.text('Indikator Ketercapaian Kompetensi', marginX + 54, currentY + 3.8);
  doc.text('Bobot', marginX + 144, currentY + 3.8);
  doc.text('Skor Capaian', marginX + 162, currentY + 3.8);

  currentY += 5.5;

  const rubricRows = [
    {
      no: '1',
      title: 'Sikap Kerja & Penerapan K3',
      indicator: `Menerapkan protokol K3 (${project.safetyProtocols?.length || 2} prosedur), memelihara ketertiban alat dan APD.`,
      bobot: '20%',
      skor: `${scoreK3} / 20`,
    },
    {
      no: '2',
      title: 'Keterampilan Proses Praktik',
      indicator: 'Ketepatan metode kerja, adaptasi alat & bahan lokal, ketelitian pelaksanaan SOP.',
      bobot: '40%',
      skor: `${scoreProses} / 40`,
    },
    {
      no: '3',
      title: 'Kualitas Produk (Deliverable)',
      indicator: `Kesesuaian luaran (${project.deliverable.slice(0, 40)}...), kehandalan fungsi teknis.`,
      bobot: '30%',
      skor: `${scoreProduk} / 30`,
    },
    {
      no: '4',
      title: 'Efisiensi Waktu & Tanggung Jawab',
      indicator: `Ketepatan alokasi waktu (${project.estimatedHours}) dan pengembalian alat dalam kondisi baik.`,
      bobot: '10%',
      skor: `${scoreWaktu} / 10`,
    },
  ];

  rubricRows.forEach((r, idx) => {
    const rh = 7.5;
    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(marginX, currentY, contentWidth, rh, 'F');
    }
    doc.setDrawColor(226, 232, 240);
    doc.line(marginX, currentY + rh, marginX + contentWidth, currentY + rh);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(15, 23, 42);
    doc.text(r.no, marginX + 2.5, currentY + 5);
    doc.text(r.title, marginX + 11, currentY + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(71, 85, 105);
    doc.text(r.indicator, marginX + 54, currentY + 5);

    doc.setFont('helvetica', 'bold');
    doc.text(r.bobot, marginX + 146, currentY + 5);

    doc.setTextColor(67, 56, 202);
    doc.text(r.skor, marginX + 165, currentY + 5);

    currentY += rh;
  });

  // Total Row
  doc.setFillColor(241, 245, 249);
  doc.rect(marginX, currentY, contentWidth, 6, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('TOTAL NILAI AKHIR ASESMEN PRAKTIK (SKALA 100):', marginX + 54, currentY + 4.2);
  doc.text('100%', marginX + 146, currentY + 4.2);
  doc.setFontSize(8.5);
  doc.setTextColor(30, 27, 75);
  doc.text(`${totalScore} (${gradeLetter})`, marginX + 165, currentY + 4.2);

  currentY += 9;

  // ----------------------------------------------------
  // 6. BAGIAN IV: CATATAN PENGAMATAN & REKOMENDASI GURU
  // ----------------------------------------------------
  ensureSpace(28);

  doc.setFillColor(30, 27, 75);
  doc.rect(marginX, currentY, 2.5, 4.5, 'F');
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('IV. CATATAN PENGAMATAN, KENDALA & REKOMENDASI GURU PEMBIMBING', marginX + 4.5, currentY + 3.5);

  currentY += 6;

  // Box Catatan Siswa
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(marginX, currentY, contentWidth, 10, 1, 1, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(30, 27, 75);
  doc.text('Catatan Refleksi & Kendala Siswa Praktikan:', marginX + 3, currentY + 3.5);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(71, 85, 105);
  const sNote = studentNotes
    ? `"${studentNotes}"`
    : '(Siswa tidak mencatat kendala khusus selama pelaksanaan praktik jobsheet).';
  const sNoteLines = doc.splitTextToSize(sNote, contentWidth - 6);
  doc.text(sNoteLines.slice(0, 2), marginX + 3, currentY + 7);

  currentY += 12;

  // Box Catatan & Rekomendasi Guru
  ensureSpace(14);
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(marginX, currentY, contentWidth, 12, 1, 1, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(30, 27, 75);
  doc.text('Catatan Pengamatan, Umpan Balik & Rekomendasi Guru Pengampu:', marginX + 3, currentY + 3.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  const tNote =
    teacherNotes ||
    'Siswa menunjukkan kemandirian dan keterampilan yang sangat baik. Protokol keselamatan kerja (K3) dipatuhi secara tertib, dan pemanfaatan bahan alternatif memenuhi standar mutu kejuruan.';
  const tNoteLines = doc.splitTextToSize(tNote, contentWidth - 6);
  doc.text(tNoteLines.slice(0, 3), marginX + 3, currentY + 7);

  currentY += 16;

  // ----------------------------------------------------
  // 7. BAGIAN V: LEMBAR PENGESAHAN TANDA TANGAN (3 PIHAK)
  // ----------------------------------------------------
  ensureSpace(28);

  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.4);
  doc.line(marginX, currentY, marginX + contentWidth, currentY);

  currentY += 4;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text(`Ditetapkan di: Kendari • Tanggal: ${currentDate}`, marginX + contentWidth, currentY, { align: 'right' });

  currentY += 4.5;

  const sigColWidth = contentWidth / 3;

  // 1. Siswa Praktikan
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text('Siswa Praktikan,', marginX + sigColWidth * 0.5, currentY, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text((studentName || 'SISWA VOKASI').toUpperCase(), marginX + sigColWidth * 0.5, currentY + 15, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text('NISN: ................................', marginX + sigColWidth * 0.5, currentY + 18, { align: 'center' });

  // 2. Guru Pembimbing / Penguji
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text('Guru Pembimbing / Penguji,', marginX + sigColWidth * 1.5, currentY, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('GURU KEJURUAN SMK', marginX + sigColWidth * 1.5, currentY + 15, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text('NIP: ................................', marginX + sigColWidth * 1.5, currentY + 18, { align: 'center' });

  // 3. Kepala Program Keahlian
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text('Ketua Konsentrasi Keahlian,', marginX + sigColWidth * 2.5, currentY, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('KEPALA PROGRAM SMK', marginX + sigColWidth * 2.5, currentY + 15, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text('NIP: ................................', marginX + sigColWidth * 2.5, currentY + 18, { align: 'center' });

  // ----------------------------------------------------
  // SIMPAN LANGSUNG KE BROWSER (DIRECT DOWNLOAD)
  // ----------------------------------------------------
  const cleanProjectTitle = project.title.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30);
  const cleanStudentName = (studentName || 'Siswa').replace(/[^a-zA-Z0-9]/g, '_');
  const fileName = `Laporan_Asesmen_Jobsheet_${cleanProjectTitle}_${cleanStudentName}.pdf`;

  // Trigger browser download langsung
  doc.save(fileName);
}
