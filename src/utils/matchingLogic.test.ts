import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeName,
  isItemMatch,
  matchToolRequirement,
  matchMaterialRequirement,
  analyzeStudentResourceReadiness,
  rankRecommendedSimulations,
} from './matchingLogic';
import { Student, InventoryItem, SimulationProject } from '../types';

const mockInventory: InventoryItem[] = [
  {
    id: 'tool-1',
    name: '3D Printer (FDM Dual Extruder)',
    type: 'tool',
    category: 'Rapid Prototyping',
    location: 'Lab Inovasi STEM',
    totalQuantity: 3,
    availableQuantity: 2,
    unit: 'unit',
    condition: 'Beroperasi',
    minimumThreshold: 1,
    costEstimate: 12500000,
    substitutes: ['SLA Resin Printer', 'Laser Cutter'],
    lastRestocked: '2026-09-10',
  },
  {
    id: 'tool-2',
    name: 'Digital Soldering Station',
    type: 'tool',
    category: 'Elektronika',
    location: 'Lab Inovasi STEM',
    totalQuantity: 8,
    availableQuantity: 0,
    unit: 'stasiun',
    condition: 'Pemeliharaan',
    minimumThreshold: 2,
    costEstimate: 2100000,
    substitutes: ['Solder Listrik Portabel'],
    lastRestocked: '2026-08-15',
  },
  {
    id: 'mat-1',
    name: 'Filamen PLA 3D Printer (1.75mm)',
    type: 'raw_material',
    category: 'Rapid Prototyping',
    location: 'Lab Inovasi STEM',
    totalQuantity: 10,
    availableQuantity: 6,
    unit: 'kg',
    condition: 'Stok Cukup',
    minimumThreshold: 3,
    costEstimate: 350000,
    lastRestocked: '2026-10-01',
  },
  {
    id: 'mat-2',
    name: 'Papan Modul Mikrokontroler (ESP32)',
    type: 'raw_material',
    category: 'Elektronika',
    location: 'Lab Inovasi STEM',
    totalQuantity: 15,
    availableQuantity: 1,
    unit: 'unit',
    condition: 'Stok Rendah',
    minimumThreshold: 5,
    costEstimate: 130000,
    lastRestocked: '2026-07-20',
  },
];

const mockStudent: Student = {
  id: 'stu-1',
  name: 'Marcus Vance',
  grade: 'Kelas XI SMK',
  avatarSeed: 'Marcus',
  targetedProfession: 'Teknisi Robotika & Otomasi',
  ventureType: 'Karier Profesional / Karyawan',
  careerCluster: 'Teknik Rekayasa & Robotika',
  statementOfIntent: 'Merancang lengan robotik otomatis untuk penyortiran logistik.',
  skillsAcquired: ['Dasar Pemrograman C++', 'Skema Rangkaian'],
  requirements: {
    tools: [
      {
        id: 'req-t1',
        name: '3D Printer',
        category: 'Rapid Prototyping',
        priority: 'Kritis',
      },
      {
        id: 'req-t2',
        name: 'Digital Soldering Station',
        category: 'Elektronika',
        priority: 'Kritis',
      },
    ],
    materials: [
      {
        id: 'req-m1',
        name: 'Filamen PLA 3D Printer',
        category: 'Rapid Prototyping',
        quantityNeeded: 2,
        unit: 'kg',
        priority: 'Kritis',
      },
      {
        id: 'req-m2',
        name: 'Papan Modul Mikrokontroler',
        category: 'Elektronika',
        quantityNeeded: 3,
        unit: 'unit',
        priority: 'Direkomendasikan',
      },
    ],
    coreCompetencies: ['Manufaktur Aditif', 'Penyolderan SMD'],
    safetyCertificationsNeeded: ['Keselamatan Suhu Nozel Ekstruder'],
  },
  completedSimulationIds: [],
};

test('normalizeName cleans punctuation and whitespace', () => {
  assert.equal(normalizeName('  3D-Printer (FDM)! '), '3d printer fdm');
  assert.equal(normalizeName('ESP32 / Arduino'), 'esp32 arduino');
});

test('isItemMatch recognizes substrings and word overlap', () => {
  assert.equal(isItemMatch('3D Printer', '3D Printer (FDM Dual Extruder)'), true);
  assert.equal(isItemMatch('Filamen PLA', 'Filamen PLA 3D Printer (1.75mm)'), true);
  assert.equal(isItemMatch('Solder Listrik', 'Digital Soldering Station', ['Solder Listrik Portabel']), true);
  assert.equal(isItemMatch('Ragi Roti', '3D Printer'), false);
});

test('matchToolRequirement detects available tool vs maintenance state', () => {
  const match1 = matchToolRequirement(
    { id: '1', name: '3D Printer', category: 'Rapid Prototyping', priority: 'Kritis' },
    mockInventory
  );
  assert.equal(match1.status, 'Cocok Penuh');
  assert.equal(match1.fulfillmentPct, 100);

  const match2 = matchToolRequirement(
    { id: '2', name: 'Digital Soldering Station', category: 'Elektronika', priority: 'Kritis' },
    mockInventory
  );
  assert.equal(match2.status, 'Stok Rendah');
  assert.equal(match2.fulfillmentPct, 35);
});

test('matchMaterialRequirement calculates partial quantity vs full quantity', () => {
  const matchFull = matchMaterialRequirement(
    { id: '1', name: 'Filamen PLA 3D Printer', category: 'Rapid Prototyping', quantityNeeded: 2, unit: 'kg', priority: 'Kritis' },
    mockInventory
  );
  assert.equal(matchFull.status, 'Cocok Penuh');

  const matchPartial = matchMaterialRequirement(
    { id: '2', name: 'Papan Modul Mikrokontroler', category: 'Elektronika', quantityNeeded: 4, unit: 'unit', priority: 'Direkomendasikan' },
    mockInventory
  );
  assert.equal(matchPartial.status, 'Stok Rendah');
});

test('analyzeStudentResourceReadiness calculates weighted score and bottlenecks', () => {
  const analysis = analyzeStudentResourceReadiness(mockStudent, mockInventory);
  assert.ok(analysis.readinessScore > 0 && analysis.readinessScore <= 100);
  assert.ok(analysis.toolsScore > 0);
  assert.ok(analysis.materialsScore > 0);
  assert.ok(analysis.criticalBottlenecks.length > 0);
});

test('rankRecommendedSimulations prioritizes relevant simulations', () => {
  const sim1: SimulationProject = {
    id: 'sim-rob-1',
    title: 'Purwarupa Gripper Robotik Otomatis',
    targetProfession: 'Teknisi Robotika & Otomasi',
    ventureType: 'Karier Profesional / Karyawan',
    careerCluster: 'Teknik Rekayasa & Robotika',
    summary: 'Merancang dan mencetak rangka capit 3D dengan telemetri mikrokontroler.',
    difficulty: 'Menengah',
    durationHours: 6,
    requiredTools: ['3D Printer'],
    requiredMaterials: [{ name: 'Filamen PLA 3D Printer', quantity: 1, unit: 'kg' }],
    learningOutcomes: ['Purwarupa CAD', 'Kalibrasi Servo'],
    realWorldDeliverable: 'Capit mekanik yang berfungsi dengan video uji beban',
    safetyProtocols: ['Jauhkan tangan dari roda gigi bergerak'],
    steps: [],
    badgeName: 'Praktisi Robotika Terverifikasi',
  };

  const sim2: SimulationProject = {
    id: 'sim-bake-1',
    title: 'Batch Komersial Sourdough Artisan',
    targetProfession: 'Wirausaha Bakery Artisan',
    ventureType: 'Wirausaha Mandiri',
    careerCluster: 'Tata Boga & Kuliner Komersial',
    summary: 'Formulasi, fermentasi, dan memanggang 20 roti artisan.',
    difficulty: 'Pemula',
    durationHours: 5,
    requiredTools: ['Oven Konveksi Komersial'],
    requiredMaterials: [{ name: 'Tepung Terigu Protein Tinggi', quantity: 10, unit: 'kg' }],
    learningOutcomes: ['Kurva fermentasi', 'Pengendalian uap oven'],
    realWorldDeliverable: 'Lembar formula baker dan log uji remah roti',
    safetyProtocols: ['Gunakan sarung tangan anti panas oven'],
    steps: [],
    badgeName: 'Sertifikasi Baker Artisan',
  };

  const ranked = rankRecommendedSimulations(mockStudent, [sim2, sim1], mockInventory);
  assert.equal(ranked[0].project.id, 'sim-rob-1');
  assert.ok(ranked[0].score > ranked[1].score);
});
