import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { synthesizeVocationalProject, synthesizePrototypeKit } from './src/utils/aiSynthesizer.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Inisialisasi GoogleGenAI di sisi server dengan dukungan token kustom per pengguna
const defaultApiKey = process.env.GEMINI_API_KEY;

function getAiClient(customKey?: string): GoogleGenAI | null {
  const keyToUse = customKey?.trim() || defaultApiKey;
  if (!keyToUse) return null;
  return new GoogleGenAI({
    apiKey: keyToUse,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const ai = getAiClient();

// -------------------------------------------------------------
// MANAJEMEN DATABASE SERVER GRATIS (PERSISTENSI SERVER LOKAL & CLOUD)
// -------------------------------------------------------------
const DATA_DIR = process.env.VERCEL
  ? path.resolve('/tmp', 'data')
  : path.resolve(__dirname, 'data');
const DB_FILE = path.resolve(DATA_DIR, 'server-database.json');
const DEFAULT_SEED_FILE = path.resolve(__dirname, 'data', 'server-database.json');

interface ServerDatabase {
  projectIdeas: any[];
  studentSessions: any[];
  updatedAt: string;
}

function getDatabase(): ServerDatabase {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(content);
    } else if (process.env.VERCEL && fs.existsSync(DEFAULT_SEED_FILE)) {
      const content = fs.readFileSync(DEFAULT_SEED_FILE, 'utf-8');
      fs.writeFileSync(DB_FILE, content, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading server database:', err);
  }
  return { projectIdeas: [], studentSessions: [], updatedAt: new Date().toISOString() };
}

function saveDatabase(data: ServerDatabase) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    data.updatedAt = new Date().toISOString();
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing server database:', err);
  }
}

// Endpoint status kesehatan, AI, & Database Server
app.get('/api/health', (req: Request, res: Response) => {
  const userKey = (req.headers['x-gemini-key'] as string) || (req.headers['authorization']?.replace('Bearer ', '') as string);
  const activeAi = getAiClient(userKey);
  res.json({
    status: 'ok',
    aiConfigured: Boolean(activeAi),
    databaseConfigured: true,
    serverType: 'Node.js Express Server (Free Hosting Tier)',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/ai-status', (req: Request, res: Response) => {
  const userKey = (req.headers['x-gemini-key'] as string) || (req.headers['authorization']?.replace('Bearer ', '') as string);
  const activeAi = getAiClient(userKey);
  res.json({
    connected: Boolean(activeAi),
    model: 'gemini-3.8-flash',
    provider: 'Google Gemini AI',
    status: 'online',
    customTokenUsed: Boolean(userKey),
  });
});

// Endpoint Database Server: Status
app.get('/api/database/status', (_req: Request, res: Response) => {
  const db = getDatabase();
  res.json({
    status: 'online',
    serverType: 'Free Cloud Instance (Express Server DB)',
    ideasCount: db.projectIdeas.length,
    sessionsCount: db.studentSessions.length,
    lastUpdated: db.updatedAt,
  });
});

// Endpoint Database Server: Ide Proyek
app.get('/api/database/ideas', (_req: Request, res: Response) => {
  const db = getDatabase();
  res.json({ ideas: db.projectIdeas, count: db.projectIdeas.length });
});

app.post('/api/database/ideas', (req: Request, res: Response) => {
  const { idea } = req.body;
  if (!idea || !idea.id) {
    return res.status(400).json({ error: 'Data ide proyek tidak valid' });
  }
  const db = getDatabase();
  const existingIdx = db.projectIdeas.findIndex(
    (item) => item.id === idea.id || item.project?.id === idea.project?.id
  );
  if (existingIdx >= 0) {
    db.projectIdeas[existingIdx] = { ...db.projectIdeas[existingIdx], ...idea };
  } else {
    db.projectIdeas.unshift(idea);
  }
  saveDatabase(db);
  res.json({ success: true, count: db.projectIdeas.length, idea });
});

app.delete('/api/database/ideas/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const db = getDatabase();
  db.projectIdeas = db.projectIdeas.filter(
    (item) => item.id !== id && item.project?.id !== id
  );
  saveDatabase(db);
  res.json({ success: true, count: db.projectIdeas.length });
});

// Endpoint Database Server: Sesi Lembar Kerja / Jobsheet
app.get('/api/database/sessions', (_req: Request, res: Response) => {
  const db = getDatabase();
  res.json({ sessions: db.studentSessions, count: db.studentSessions.length });
});

app.post('/api/database/sessions', (req: Request, res: Response) => {
  const { session } = req.body;
  if (!session || !session.id) {
    return res.status(400).json({ error: 'Data sesi praktik tidak valid' });
  }
  const db = getDatabase();
  const existingIdx = db.studentSessions.findIndex(
    (s) =>
      s.id === session.id ||
      (s.activeProject?.id && session.activeProject?.id && s.activeProject.id === session.activeProject.id)
  );
  if (existingIdx >= 0) {
    db.studentSessions[existingIdx] = { ...db.studentSessions[existingIdx], ...session };
  } else {
    db.studentSessions.unshift(session);
  }
  saveDatabase(db);
  res.json({ success: true, count: db.studentSessions.length, session });
});

app.delete('/api/database/sessions/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const db = getDatabase();
  db.studentSessions = db.studentSessions.filter((s) => s.id !== id);
  saveDatabase(db);
  res.json({ success: true, count: db.studentSessions.length });
});

// Endpoint: AI merekomendasikan alat & bahan yang harus ada untuk membuat purwarupa profesi/usaha target
app.post('/api/recommend-prototype-kit', async (req: Request, res: Response) => {
  try {
    const { targetProfession, prototypeMode = 'standard', customNotes = '' } = req.body;

    if (!targetProfession) {
      return res.status(400).json({ error: 'Profesi atau bidang usaha target wajib diisi' });
    }

    const userCustomKey =
      (req.headers['x-gemini-key'] as string) ||
      (req.headers['authorization']?.replace('Bearer ', '') as string) ||
      req.body?.userApiKey;
    const activeAi = getAiClient(userCustomKey);

    if (!activeAi) {
      const fallbackKit = synthesizePrototypeKit({
        targetProfession,
        prototypeMode,
        customNotes,
      });
      return res.json({
        prototypeKit: fallbackKit,
        fallback: true,
        message: 'Kunci API Gemini tidak aktif, menggunakan rekomendasi purwarupa kurikulum vokasi lokal.',
      });
    }

    const modeDescription =
      prototypeMode === 'recycled'
        ? 'Utamakan 100% bahan daur ulang, barang bekas, dan perkakas rumah tangga murah yang ada di sekitar siswa (Zero Cost Prototype).'
        : prototypeMode === 'commercial'
        ? 'Fokus pada purwarupa sampel produk atau layanan yang memiliki standar higienis/kualitas komersial layak jual.'
        : 'Standar kejuruan SMK yang aplikatif, edukatif, dan mudah diakses oleh siswa.';

    const prompt = `Anda adalah ahli kurikulum Pendidikan Vokasi (SMK/Politeknik) dan pembimbing purwarupa (prototyping) wirausaha muda di Indonesia.
Siswa SMK ingin mempelajari profesi atau bidang usaha: "${targetProfession}".
Pendekatan Purwarupa: ${modeDescription}
${customNotes ? `Catatan Tambahan Kondisi Lingkungan Siswa: ${customNotes}` : ''}

Tugas Anda:
Alih-alih menyuruh siswa menebak sendiri, berikan REKOMENDASI LENGKAP ALAT DAN BAHAN YANG HARUS ADA UNTUK MEMBUAT PURWARUPA / SIMULASI yang benar-benar merepresentasikan profesi/usaha "${targetProfession}".

Berikan respon JSON terstruktur:
1. "prototypeTitle": Judul purwarupa konkret yang akan dibuat siswa (misal: "Purwarupa Trainer Miniatur Instalasi Saklar Seri & Penerangan").
2. "prototypeRationale": Penjelasan mendidik mengapa purwarupa ini merupakan representasi autentik dari keterampilan inti profesi/usaha tersebut.
3. "difficulty": 'Mudah', 'Sedang', atau 'Menantang'.
4. "estimatedHours": contoh "2-3 Jam".
5. "deliverable": Output nyata yang dihasilkan tangan siswa.
6. "coreCompetencies": 3-4 keterampilan vokasi inti yang dilatih saat membuat purwarupa ini.
7. "tools": Daftar 3-5 ALAT YANG HARUS ADA:
   - "id": string unik (misal "tool-1")
   - "name": Nama alat
   - "role": Fungsi spesifik alat dalam merakit purwarupa
   - "isCritical": boolean (true jika alat utama/wajib, false jika pendukung)
   - "lowCostAlternative": Rekomendasi alat pengganti yang murah, sederhana, atau ada di rumah tangga jika alat industri tidak tersedia
   - "available": boolean (default true)
8. "materials": Daftar 3-5 BAHAN BAKU PURWARUPA YANG HARUS ADA:
   - "id": string unik (misal "mat-1")
   - "name": Nama bahan
   - "quantity": Takaran/jumlah yang dibutuhkan untuk 1 purwarupa
   - "role": Fungsi bahan dalam struktur atau fungsi purwarupa
   - "recycledAlternative": Saran bahan pengganti daur ulang / barang bekas di sekitar siswa (misal kardus bekas, botol plastik, kain perca, kabel sisa)
   - "available": boolean (default true)
9. "safetyTips": 2-3 instruksi K3 keselamatan kerja penting saat merakit purwarupa ini.

Gunakan BAHASA INDONESIA yang jelas, komunikatif, dan memotivasi siswa SMK.`;

    const aiPromise = activeAi.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            prototypeTitle: { type: Type.STRING },
            prototypeRationale: { type: Type.STRING },
            difficulty: { type: Type.STRING },
            estimatedHours: { type: Type.STRING },
            deliverable: { type: Type.STRING },
            coreCompetencies: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            tools: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  role: { type: Type.STRING },
                  isCritical: { type: Type.BOOLEAN },
                  lowCostAlternative: { type: Type.STRING },
                  available: { type: Type.BOOLEAN },
                },
                required: ['id', 'name', 'role', 'isCritical', 'lowCostAlternative'],
              },
            },
            materials: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  quantity: { type: Type.STRING },
                  role: { type: Type.STRING },
                  recycledAlternative: { type: Type.STRING },
                  available: { type: Type.BOOLEAN },
                },
                required: ['id', 'name', 'quantity', 'role', 'recycledAlternative'],
              },
            },
            safetyTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: [
            'prototypeTitle',
            'prototypeRationale',
            'difficulty',
            'estimatedHours',
            'deliverable',
            'coreCompetencies',
            'tools',
            'materials',
            'safetyTips',
          ],
        },
      },
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('AI response timeout')), 12000)
    );

    const response = (await Promise.race([aiPromise, timeoutPromise])) as any;
    const parsed = JSON.parse(response.text || '{}');

    const prototypeKit = {
      ...parsed,
      targetProfession,
      isAiGenerated: true,
      modelUsed: 'gemini-3.8-flash',
      tools: (parsed.tools || []).map((t: any, idx: number) => ({
        ...t,
        id: t.id || `tool-${idx + 1}`,
        available: t.available !== undefined ? t.available : true,
      })),
      materials: (parsed.materials || []).map((m: any, idx: number) => ({
        ...m,
        id: m.id || `mat-${idx + 1}`,
        available: m.available !== undefined ? m.available : true,
      })),
    };

    return res.json({ prototypeKit, fallback: false, model: 'gemini-3.8-flash' });
  } catch (err: any) {
    console.warn('Gemini prototype kit generation fallback:', err?.message || err);
    const fallbackKit = synthesizePrototypeKit({
      targetProfession: req.body.targetProfession,
      prototypeMode: req.body.prototypeMode,
      customNotes: req.body.customNotes,
    });
    return res.json({
      prototypeKit: fallbackKit,
      fallback: true,
      message: 'Rekomendasi purwarupa dirancang oleh mesin kurikulum cerdas Vokasi SMK.',
    });
  }
});

// Endpoint baru: Rekomendasi Proyek Simulasi representatif berbasis Profesi + Ketersediaan Alat & Bahan
app.post('/api/recommend-projects', async (req: Request, res: Response) => {
  try {
    const { targetProfession, availableTools = [], availableMaterials = [], customNotes = '' } = req.body;

    if (!targetProfession) {
      return res.status(400).json({ error: 'Profesi atau bidang usaha target wajib diisi' });
    }

    const userCustomKey =
      (req.headers['x-gemini-key'] as string) ||
      (req.headers['authorization']?.replace('Bearer ', '') as string) ||
      req.body?.userApiKey;
    const activeAi = getAiClient(userCustomKey);

    if (!activeAi) {
      return res.status(200).json({
        fallback: true,
        message: 'Kunci API Gemini tidak aktif, menggunakan rekomendasi kurasi cerdas lokal.',
      });
    }

    const prompt = `Anda adalah seorang ahli kurikulum Pendidikan Vokasi (SMK/Politeknik) dan pembimbing wirausaha muda di Indonesia.
Siswa SMK ingin mempelajari profesi atau bidang usaha: "${targetProfession}".
Siswa memiliki alat-alat berikut di sekitarnya:
${(availableTools as string[]).join(', ') || 'Alat rumah tangga umum, gunting, penggaris'}

Siswa memiliki bahan-bahan berikut di sekitarnya:
${(availableMaterials as string[]).join(', ') || 'Barang bekas, kardus, kertas, botol'}

${customNotes ? `Catatan Tambahan Lingkungan Siswa: ${customNotes}` : ''}

Tolong rancang 1 PROYEK SIMULASI SEDERHANA yang:
1. Sangat merepresentasikan profesi/bidang usaha "${targetProfession}" tersebut (memberikan esensi keterampilan teknis inti, bukan hanya teori).
2. Memanfaatkan secara maksimal alat dan bahan yang sudah tersedia di sekitar siswa (atau berikan usulan bahan pengganti alternatif kreatif yang aman dan mudah dicari di lingkungan sekitar).
3. Aman dikerjakan siswa SMK mandiri atau dengan panduan guru (sertakan protokol K3).
4. Berisi 4 langkah terstruktur dengan instruksi jelas dan checkpoint verifikasi.
5. Ditulis sepenuhnya dalam BAHASA INDONESIA yang komunikatif, mendidik, dan aplikatif.
`;

    const aiPromise = activeAi.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            representationRationale: {
              type: Type.STRING,
              description: 'Penjelasan mengapa proyek sederhana ini merepresentasikan profesi atau bidang usaha tersebut',
            },
            difficulty: {
              type: Type.STRING,
              description: 'Mudah, Sedang, atau Menantang',
            },
            estimatedHours: { type: Type.STRING },
            toolsUsed: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                },
                required: ['name'],
              },
            },
            materialsUsed: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  quantity: { type: Type.STRING },
                },
                required: ['name'],
              },
            },
            alternativeMaterialsSuggested: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            coreCompetenciesLearned: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            deliverable: { type: Type.STRING },
            safetyProtocols: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            badgeEarned: { type: Type.STRING },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  stepNumber: { type: Type.NUMBER },
                  title: { type: Type.STRING },
                  instruction: { type: Type.STRING },
                  safetyTip: { type: Type.STRING },
                  checkpoint: { type: Type.STRING },
                },
                required: ['stepNumber', 'title', 'instruction', 'checkpoint'],
              },
            },
          },
          required: [
            'title',
            'representationRationale',
            'difficulty',
            'estimatedHours',
            'toolsUsed',
            'materialsUsed',
            'coreCompetenciesLearned',
            'deliverable',
            'safetyProtocols',
            'badgeEarned',
            'steps',
          ],
        },
      },
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('AI response timeout')), 10000)
    );

    const response = (await Promise.race([aiPromise, timeoutPromise])) as any;
    const parsed = JSON.parse(response.text || '{}');
    const project = {
      ...parsed,
      id: `sim-gemini-${Date.now()}`,
      targetProfession,
      badgeEarned: parsed.badgeEarned || `Inovator ${targetProfession}`,
    };

    return res.json({ project, fallback: false, model: 'gemini-3.8-flash' });
  } catch (err: any) {
    console.warn('Gemini generateContent had exception/timeout, using tailored AI synthesis:', err?.message || err);
    
    const fallbackProject = synthesizeVocationalProject({
      targetProfession: req.body.targetProfession,
      availableTools: req.body.availableTools || [],
      availableMaterials: req.body.availableMaterials || [],
      customNotes: req.body.customNotes,
      difficulty: req.body.difficulty,
      focusOption: req.body.focusOption,
    });

    return res.json({
      project: fallbackProject,
      fallback: true,
      message: 'Proyek berhasil dirancang oleh mesin simulasi cerdas berbasis Kurikulum Vokasi SMK.',
    });
  }
});

// Endpoint untuk merekomendasikan simulasi proyek dalam Bahasa Indonesia menggunakan Gemini
app.post('/api/generate-simulation', async (req: Request, res: Response) => {
  try {
    const { student, inventory, focusNote } = req.body;

    if (!student || !inventory) {
      return res.status(400).json({ error: 'Data siswa dan inventaris wajib diisi' });
    }

    const userCustomKey =
      (req.headers['x-gemini-key'] as string) ||
      (req.headers['authorization']?.replace('Bearer ', '') as string) ||
      req.body?.userApiKey;
    const activeAi = getAiClient(userCustomKey);

    if (!activeAi) {
      return res.status(200).json({
        fallback: true,
        message: 'Kunci API Gemini tidak terpasang; sintesis fallback klien akan digunakan.',
      });
    }

    const availableTools = (inventory as any[])
      .filter((i) => i.type === 'tool' && i.availableQuantity > 0)
      .map((i) => `${i.name} (Lokasi: ${i.location})`)
      .slice(0, 15);

    const availableMaterials = (inventory as any[])
      .filter((i) => i.type === 'raw_material' && i.availableQuantity > 0)
      .map((i) => `${i.name} (${i.availableQuantity} ${i.unit} tersedia)`)
      .slice(0, 15);

    const prompt = `Anda adalah seorang direktur kurikulum Pendidikan Kejuruan / Vokasi (SMK/Politeknik) dan kewirausahaan.
Tolong rekomendasikan 1 "Simulasi Proyek Praktis" sederhana yang dirancang khusus dalam BAHASA INDONESIA untuk siswa berikut, dengan memanfaatkan alat dan bahan baku yang benar-benar tersedia di lingkungan sekolah:

Detail Siswa:
- Nama: ${student.name} (${student.grade})
- Profesi / Usaha yang Dituju: ${student.targetedProfession}
- Model Usaha: ${student.ventureType}
- Bidang Kejuruan: ${student.careerCluster}
- Pernyataan Minat Siswa: ${student.statementOfIntent}
- Keterampilan Saat Ini: ${(student.skillsAcquired || []).join(', ')}
${focusNote ? `- Catatan Minat Khusus Siswa: ${focusNote}` : ''}

Daftar Alat/Mesin Lab Sekolah yang Tersedia:
${availableTools.join('\n') || 'Meja kerja umum, perkakas tangan dasar'}

Daftar Bahan Baku & Habis Pakai Sekolah yang Tersedia:
${availableMaterials.join('\n') || 'Bahan uji dasar, kertas, dan perkakas standar'}

Buat 1 simulasi proyek praktis yang:
1. Memberikan pengalaman autentik sesuai profesi/usaha yang dituju siswa.
2. Menggunakan secara langsung alat dan bahan yang tersedia di sekolah (atau pengganti yang realistis dan aman).
3. Memiliki 4 tahapan berurutan: 'Pemeriksaan Alat & K3', 'Perakitan & Sintesis Desain', 'Kalibrasi & Diagnostik', dan 'Presentasi Vokasi & Portofolio'.
4. Menggunakan bahasa Indonesia yang formal, edukatif, dan praktis.
`;

    const response = await activeAi.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            difficulty: {
              type: Type.STRING,
              description: 'Pemula, Menengah, atau Lanjutan',
            },
            durationHours: { type: Type.NUMBER },
            requiredTools: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            requiredMaterials: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  quantity: { type: Type.NUMBER },
                  unit: { type: Type.STRING },
                },
                required: ['name', 'quantity', 'unit'],
              },
            },
            learningOutcomes: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            realWorldDeliverable: { type: Type.STRING },
            safetyProtocols: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            badgeName: { type: Type.STRING },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  phase: {
                    type: Type.STRING,
                    description:
                      'Salah satu dari: Pemeriksaan Alat & K3, Perakitan & Sintesis Desain, Kalibrasi & Diagnostik, Presentasi Vokasi & Portofolio',
                  },
                  description: { type: Type.STRING },
                  actionType: {
                    type: Type.STRING,
                    description: 'checklist, calculator, tester, atau reflection',
                  },
                  interactiveData: {
                    type: Type.OBJECT,
                    properties: {
                      prompts: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                      benchmarkKey: { type: Type.STRING },
                      targetValue: { type: Type.NUMBER },
                      unit: { type: Type.STRING },
                    },
                  },
                },
                required: ['title', 'phase', 'description', 'actionType'],
              },
            },
          },
          required: [
            'title',
            'summary',
            'difficulty',
            'durationHours',
            'requiredTools',
            'requiredMaterials',
            'learningOutcomes',
            'realWorldDeliverable',
            'safetyProtocols',
            'badgeName',
            'steps',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    const simulation = {
      ...parsed,
      id: `sim-ai-${Date.now()}`,
      targetProfession: student.targetedProfession,
      ventureType: student.ventureType,
      careerCluster: student.careerCluster,
      steps: (parsed.steps || []).map((s: any, idx: number) => ({
        ...s,
        id: `step-gen-${idx + 1}-${Date.now()}`,
      })),
    };

    return res.json({ simulation, fallback: false });
  } catch (err: any) {
    console.error('Error in /api/generate-simulation:', err);
    return res.status(500).json({ error: err.message || 'Gagal menghasilkan simulasi', fallback: true });
  }
});

// Setup Vite middleware di dev atau static files di produksi
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server VocationCraft berjalan di http://0.0.0.0:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer().catch((err) => {
    console.error('Gagal menjalankan server:', err);
  });
}

export default app;
