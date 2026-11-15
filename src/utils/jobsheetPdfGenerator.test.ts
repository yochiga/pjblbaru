import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  generateAndDownloadJobsheetPdf,
  buildJobsheetPdfDocument,
  formatWorkDateIndonesian,
} from './jobsheetPdfGenerator';
import { RecommendedProject } from '../types/recommender';

describe('Jobsheet PDF Generator', () => {
  it('formats YYYY-MM-DD work dates cleanly in Indonesian without timezone shift', () => {
    const formatted = formatWorkDateIndonesian('2026-11-15');
    assert.strictEqual(formatted, '15 November 2026');

    const fallback = formatWorkDateIndonesian('');
    assert.ok(fallback.length > 5);

    const invalidFallback = formatWorkDateIndonesian('2026-02-31');
    assert.ok(invalidFallback.length > 5);
  });

  it('instantiates and builds structured PDF with studentClass and workDate without errors', () => {
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

    assert.strictEqual(typeof generateAndDownloadJobsheetPdf, 'function');

    const doc = buildJobsheetPdfDocument({
      project: mockProject,
      steps: mockProject.steps,
      completedSteps: [0, 1],
      studentName: 'Budi Santoso',
      studentClass: 'XI TBSM 2',
      workDate: '2026-11-15',
      schoolName: 'SMKN 4 Kendari',
      subjectName: 'Pemeliharaan Sasis Sepeda Motor',
      subjectTopic: 'Sistem Rem Hidrolik & Bleeding',
      studentNotes: 'Rem berfungsi normal.',
      teacherNotes: 'Sangat baik dan teliti.',
    });

    const rawPdf = doc.output('datauristring');
    assert.ok(rawPdf.startsWith('data:application/pdf'));
    const internalText = JSON.stringify((doc as unknown as { internal: { pages: unknown } }).internal.pages);
    assert.ok(internalText.includes('Budi Santoso'));
    assert.ok(internalText.includes('XI TBSM 2'));
    assert.ok(internalText.includes('15 November 2026'));
    assert.ok(internalText.includes('Pemeliharaan Sasis Sepeda Moto'));
    assert.ok(internalText.includes('Sistem Rem Hidrolik'));
  });
});
