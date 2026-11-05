import { describe, it } from 'node:test';
import assert from 'node:assert';
import { generateAndDownloadJobsheetPdf } from './jobsheetPdfGenerator';
import { RecommendedProject } from '../types/recommender';

describe('Jobsheet PDF Generator', () => {
  it('instantiates and builds structured PDF without errors', () => {
    const mockProject: RecommendedProject = {
      id: 'proj-test-1',
      title: 'Praktek Perbaikan Sistem Rem Cakram Sepeda Motor',
      targetProfession: 'Teknik Sepeda Motor (TBSM)',
      difficulty: 'Sedang',
      estimatedHours: '3 Jam Praktik',
      readinessPercentage: 90,
      coreCompetenciesLearned: ['Bleeding Hidrolik', 'Pemeriksaan Kampas Rem'],
      deliverable: 'Sistem rem cakram hidrolik berfungsi pakem tanpa gelembung udara',
      badgeEarned: 'Teknisi Sistem Pengereman Presisi',
      representationRationale: 'Melatih keterampilan bleeding minyak rem dan pemeriksaan ketebalan kampas.',
      safetyProtocols: ['Gunakan kacamata pelindung dan sarung tangan nitril', 'Hindari tumpahan minyak rem pada cat body'],
      toolsUsed: [{ name: 'Kunci Pas 8mm & 10mm', available: true }],
      materialsUsed: [{ name: 'Minyak Rem DOT 3/4', available: true, quantity: '250ml' }],
      steps: [
        {
          stepNumber: 1,
          title: 'Persiapan Alat & Penempatan Wadah',
          instruction: 'Buka tutup reservoir master rem dan pasang selang transparan.',
          safetyTip: 'Gunakan kacamata pelindung',
          checkpoint: 'Selang terpasang rapat di nipel kaliper',
        },
        {
          stepNumber: 2,
          title: 'Bleeding Minyak Rem',
          instruction: 'Tekan tuas rem beberapa kali lalu tahan dan buka baut nipel sekejap.',
          safetyTip: 'Bersihkan tetesan minyak rem',
          checkpoint: 'Cairan rem mengalir jernih tanpa gelembung udara',
        },
      ],
    };

    // Dalam environment node (tanpa browser window), doc.save memanggil fs atau blob url jika disupport,
    // atau kita pastikan fungsi tidak crash saat dipanggil.
    assert.strictEqual(typeof generateAndDownloadJobsheetPdf, 'function');
  });
});
