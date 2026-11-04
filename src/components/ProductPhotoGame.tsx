import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Sun,
  Aperture,
  Sliders,
  Sparkles,
  RotateCcw,
  Download,
  CheckCircle2,
  AlertTriangle,
  Award,
  Eye,
  Info,
  Maximize2,
  Trash2,
  Grid,
  Zap,
  HelpCircle,
  Layers,
  ChevronRight,
  TrendingUp,
  Settings,
  CircleDot,
  Check,
  Share2,
} from 'lucide-react';

// ==========================================
// TIPE DATA & KONSTANTA FOTOGRAFI VOKASI
// ==========================================

export interface PhotoCapture {
  id: string;
  dataUrl: string;
  timestamp: string;
  productName: string;
  settings: {
    fStopLabel: string;
    shutterLabel: string;
    isoLabel: string;
    useTripod: boolean;
    keyLightPower: number;
    keyLightAngle: 'left' | 'center' | 'right';
    softbox: boolean;
    fillLightPower: number;
    rimLightPower: number;
    backdrop: string;
  };
  score: number;
  grade: 'A' | 'B' | 'C' | 'D';
  evDelta: number;
  critique: {
    exposureStatus: string;
    focusStatus: string;
    noiseStatus: string;
    lightingStatus: string;
    teacherNotes: string;
  };
}

interface ProductItem {
  id: string;
  name: string;
  category: string;
  description: string;
  colorTheme: string;
}

const PRODUCTS: ProductItem[] = [
  {
    id: 'coldbrew',
    name: 'Kopi Botol Cold Brew Vokasi',
    category: 'Agribisnis Pengolahan Hasil Pertanian / Kuliner',
    description: 'Kemasan botol kaca artisan dengan label transparan. Memerlukan highlight halus di lengkungan botol tanpa pantulan silau berlebih.',
    colorTheme: 'amber',
  },
  {
    id: 'sneakers',
    name: 'Sneakers Kanvas Kreasi Siswa',
    category: 'Kriya Kreatif / Desain Komunikasi Visual',
    description: 'Sepatu kanvas motif etnik dengan sol karet putih. Butuh ketajaman menyeluruh agar detail tekstur jahit dan bahan terlihat jelas.',
    colorTheme: 'indigo',
  },
  {
    id: 'wallet',
    name: 'Dompet Kulit Artisan Handmade',
    category: 'Kriya Kulit & Aksesori Mode',
    description: 'Kulit sapi samak nabati cokelat dengan jahitan tangan. Perlu pencahayaan lembut untuk menonjolkan emboss logo dan serat kulit alami.',
    colorTheme: 'orange',
  },
  {
    id: 'gear',
    name: 'Roda Gigi Presisi Mesin Bubut',
    category: 'Teknik Pemesinan / Otomotif',
    description: 'Komponen gear logam baja dengan gerigi presisi. Refleksi logam tinggi membutuhkan rim light untuk memisahkan gerigi dari latar.',
    colorTheme: 'slate',
  },
];

// Opsi Aperture (Bukaan Diafragma)
const APERTURE_OPTIONS = [
  { fStop: 1.4, label: 'f/1.4', blurPx: 16, lightScore: 8, desc: 'DoF Sangat Dangkal (Bokeh Ekstrem)' },
  { fStop: 2.0, label: 'f/2.0', blurPx: 12, lightScore: 7, desc: 'DoF Dangkal (Bokeh Kuat)' },
  { fStop: 2.8, label: 'f/2.8', blurPx: 8, lightScore: 6, desc: 'DoF Moderat (Bokeh Lembut Artistik)' },
  { fStop: 4.0, label: 'f/4.0', blurPx: 5, lightScore: 5, desc: 'Subjek Tajam, Latar Tetap Lembut' },
  { fStop: 5.6, label: 'f/5.6', blurPx: 3, lightScore: 4, desc: 'Cakupan Fokus Lebar' },
  { fStop: 8.0, label: 'f/8.0', blurPx: 1.2, lightScore: 3, desc: 'Sweet Spot Lensa: Ketajaman Maksimal Katalog' },
  { fStop: 11, label: 'f/11', blurPx: 0.4, lightScore: 2, desc: 'Seluruh Bidang Sangat Tajam (DoF Dalam)' },
  { fStop: 16, label: 'f/16', blurPx: 0, lightScore: 1, desc: 'DoF Penuh (Semua Bidang Fokus Bersih)' },
];

// Opsi Shutter Speed (Kecepatan Rana)
const SHUTTER_OPTIONS = [
  { val: 0.001, label: '1/1000s', shakeRisk: 0, lightScore: 1, desc: 'Membekukan gerakan sangat cepat' },
  { val: 0.002, label: '1/500s', shakeRisk: 0, lightScore: 2, desc: 'Sangat aman dari getaran kamera' },
  { val: 0.004, label: '1/250s', shakeRisk: 0, lightScore: 3, desc: 'Standar studio flash sync' },
  { val: 0.008, label: '1/125s', shakeRisk: 0, lightScore: 4, desc: 'Aman untuk bidikan genggam (handheld)' },
  { val: 0.016, label: '1/60s', shakeRisk: 1.5, lightScore: 5, desc: 'Batas aman genggam tanpa tripod' },
  { val: 0.033, label: '1/30s', shakeRisk: 4.5, lightScore: 6, desc: 'Rentan goyang bila tanpa tripod' },
  { val: 0.066, label: '1/15s', shakeRisk: 8.5, lightScore: 7, desc: 'Pasti goyang (motion blur) tanpa tripod' },
  { val: 0.25, label: '1/4s', shakeRisk: 16, lightScore: 8, desc: 'Eksposur panjang (wajib tripod)' },
  { val: 1.0, label: '1.0s', shakeRisk: 26, lightScore: 9, desc: 'Eksposur sangat panjang' },
];

// Opsi ISO (Kepekaan Sensor)
const ISO_OPTIONS = [
  { iso: 100, label: 'ISO 100', grainPct: 0, lightScore: 1, desc: 'Gambar murni tanpa noise (standar cetak)' },
  { iso: 200, label: 'ISO 200', grainPct: 0.8, lightScore: 2, desc: 'Sangat bersih dan tajam' },
  { iso: 400, label: 'ISO 400', grainPct: 2.2, lightScore: 3, desc: 'Bersih, sedikit grain di shadow' },
  { iso: 800, label: 'ISO 800', grainPct: 5.5, lightScore: 4, desc: 'Mulai timbul bintik halus' },
  { iso: 1600, label: 'ISO 1600', grainPct: 10, lightScore: 5, desc: 'Noise terlihat pada layar besar' },
  { iso: 3200, label: 'ISO 3200', grainPct: 17, lightScore: 6, desc: 'Noise cukup kasar, detail berkurang' },
  { iso: 6400, label: 'ISO 6400', grainPct: 26, lightScore: 7, desc: 'Bintik warna & luminance tinggi' },
  { iso: 12800, label: 'ISO 12800', grainPct: 38, lightScore: 8, desc: 'Noise sangat kasar (tidak dianjurkan)' },
];

// Opsi Studio Backdrop
const BACKDROP_OPTIONS = [
  { id: 'white', name: 'Putih Seamless', bgClass: 'bg-slate-100', floorColor: '#e2e8f0', wallColor: '#f8fafc', tag: 'Katalog E-commerce' },
  { id: 'dark', name: 'Hitam Elegan', bgClass: 'bg-zinc-900', floorColor: '#18181b', wallColor: '#09090b', tag: 'Moody & Mewah' },
  { id: 'wood', name: 'Meja Kayu Artisan', bgClass: 'bg-amber-950/50', floorColor: '#78350f', wallColor: '#451a03', tag: 'Handmade / Kriya' },
  { id: 'pastel', name: 'Pastel Studio Biru', bgClass: 'bg-cyan-950/40', floorColor: '#0e7490', wallColor: '#164e63', tag: 'Modern Lifestyle' },
];

// Misi Praktik Kejuruan
interface IndustryMission {
  id: string;
  title: string;
  targetProduct: string;
  badge: string;
  brief: string;
  criteria: {
    minFStop: number;
    maxFStop: number;
    maxIso: number;
    requireTripod: boolean;
    backdrop: string;
    maxEvAbs: number;
  };
}

const MISSIONS: IndustryMission[] = [
  {
    id: 'mission-ecommerce',
    title: 'Misi 1: Foto Katalog E-Commerce Bersih',
    targetProduct: 'sneakers',
    badge: 'Standar Industri Marketplace',
    brief: 'Klien toko online membutuhkan foto produk sepatu yang tajam dari ujung depan hingga tumit, latar belakang putih bersih, tanpa bintik noise (ISO maks 200), dan bukaan lensa f/8 - f/16.',
    criteria: {
      minFStop: 8.0,
      maxFStop: 16.0,
      maxIso: 200,
      requireTripod: false,
      backdrop: 'white',
      maxEvAbs: 0.4,
    },
  },
  {
    id: 'mission-coldbrew',
    title: 'Misi 2: Iklan Hero Cold Brew Moody',
    targetProduct: 'coldbrew',
    badge: 'Promosi Media Sosial & Kafe',
    brief: 'Buat foto produk botol kopi dengan nuansa dramatis dan latar belakang ber-bokeh lembut (aperture f/1.4 - f/2.8), latar gelap, serta rim light aktif untuk mempertegas garis siluet kaca botol.',
    criteria: {
      minFStop: 1.4,
      maxFStop: 2.8,
      maxIso: 400,
      requireTripod: false,
      backdrop: 'dark',
      maxEvAbs: 0.6,
    },
  },
  {
    id: 'mission-craft',
    title: 'Misi 3: Portofolio Makro Kerajinan Dompet',
    targetProduct: 'wallet',
    badge: 'Pameran Karya Vokasi Mandiri',
    brief: 'Tampilkan serat dan jahitan dompet kulit secara presisi. Wajib menggunakan Tripod agar stabil, ISO 100 murni bebas noise, bukaan f/5.6 - f/11, dan pencahayaan seimbang pada latar kayu.',
    criteria: {
      minFStop: 5.6,
      maxFStop: 11.0,
      maxIso: 100,
      requireTripod: true,
      backdrop: 'wood',
      maxEvAbs: 0.5,
    },
  },
];

export const ProductPhotoGame: React.FC = () => {
  // ----------------------------------------------------
  // STATE KAMERA & SEGITIGA FOTOGRAFI
  // ----------------------------------------------------
  const [selectedProduct, setSelectedProduct] = useState<ProductItem>(PRODUCTS[0]);
  const [apertureIdx, setApertureIdx] = useState<number>(3); // f/4.0
  const [shutterIdx, setShutterIdx] = useState<number>(3); // 1/125s
  const [isoIdx, setIsoIdx] = useState<number>(0); // ISO 100
  const [useTripod, setUseTripod] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(true);

  // ----------------------------------------------------
  // STATE PENCAHAYAAN STUDIO (THREE-POINT LIGHTING)
  // ----------------------------------------------------
  const [keyLightPower, setKeyLightPower] = useState<number>(75); // 0 - 100%
  const [keyLightAngle, setKeyLightAngle] = useState<'left' | 'center' | 'right'>('left');
  const [softbox, setSoftbox] = useState<boolean>(true);
  const [fillLightPower, setFillLightPower] = useState<number>(40); // 0 - 100%
  const [rimLightPower, setRimLightPower] = useState<number>(35); // 0 - 100%
  const [backdropId, setBackdropId] = useState<string>('white');

  // ----------------------------------------------------
  // STATE HASIL JEPRETAN & REVIEW
  // ----------------------------------------------------
  const [isShutterActive, setIsShutterActive] = useState<boolean>(false);
  const [latestCapture, setLatestCapture] = useState<PhotoCapture | null>(null);
  const [capturedPhotos, setCapturedPhotos] = useState<PhotoCapture[]>(() => {
    try {
      const saved = localStorage.getItem('vocation_photo_captures');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });
  const [selectedCaptureForModal, setSelectedCaptureForModal] = useState<PhotoCapture | null>(null);

  // ----------------------------------------------------
  // MODE & TABS
  // ----------------------------------------------------
  const [gameMode, setGameMode] = useState<'sandbox' | 'mission' | 'theory'>('sandbox');
  const [activeMissionId, setActiveMissionId] = useState<string>(MISSIONS[0].id);

  // Audio Context Ref untuk efek suara mekanik shutter kamera
  const audioCtxRef = useRef<AudioContext | null>(null);
  const previewCanvasRef = useRef<HTMLDivElement>(null);

  // Simpan galeri ke localStorage
  useEffect(() => {
    try {
      localStorage.setItem('vocation_photo_captures', JSON.stringify(capturedPhotos));
    } catch (e) {
      console.error(e);
    }
  }, [capturedPhotos]);

  // Objek aktif
  const currentAperture = APERTURE_OPTIONS[apertureIdx];
  const currentShutter = SHUTTER_OPTIONS[shutterIdx];
  const currentIso = ISO_OPTIONS[isoIdx];
  const currentBackdrop = BACKDROP_OPTIONS.find((b) => b.id === backdropId) || BACKDROP_OPTIONS[0];

  // ----------------------------------------------------
  // KALKULATOR FISIKA EKSPOSUR & KESEIMBANGAN CAHAYA
  // ----------------------------------------------------
  // Total pencahayaan studio (bobot Key 55%, Fill 30%, Rim 15%)
  const studioLightScore = (keyLightPower * 0.55 + fillLightPower * 0.30 + rimLightPower * 0.15) / 10; // Rentang ~ 0 s.d 10

  // Total indeks eksposur kamera
  const cameraIntakeScore = currentAperture.lightScore + currentShutter.lightScore + currentIso.lightScore; // Rentang ~ 3 s.d 26

  // Titik nominal seimbang di studio foto (f/4.0, 1/125s, ISO 100-200 dengan lampu studio aktif)
  const combinedLightIndex = cameraIntakeScore + studioLightScore * 1.4;
  const nominalBalanced = 18.2;
  const rawEvDelta = (combinedLightIndex - nominalBalanced) / 2.6;
  // Batasi EV delta antara -3.0 dan +3.0
  const evDelta = Math.max(-3.0, Math.min(3.0, Math.round(rawEvDelta * 10) / 10));

  // Efek guncangan kamera (shake blur)
  const shakeRisk = useTripod ? 0 : currentShutter.shakeRisk;

  // Sound Synthesizer: Suara Shutter Kamera Mekanik (Web Audio API murni tanpa file eksternal)
  const playCameraShutterSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // 1. Klik pembuka rana (shutter open)
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.04);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);

      // 2. Klik penutup rana (shutter close & mirror return)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(450, now + 0.07);
      osc2.frequency.exponentialRampToValueAtTime(80, now + 0.13);

      gain2.gain.setValueAtTime(0.28, now + 0.07);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.07);
      osc2.stop(now + 0.16);
    } catch (e) {
      console.warn('Audio synthesis tidak didukung atau terblokir browser:', e);
    }
  };

  // ----------------------------------------------------
  // ASESMEN & RUBRIK PENILAIAN KEJURUAN OTOMATIS
  // ----------------------------------------------------
  const evaluatePhotoQuality = () => {
    let score = 100;
    let exposureStatus = 'Eksposur Sempurna (0.0 EV)';
    let focusStatus = 'Ketajaman Fokus Tajam & Presisi';
    let noiseStatus = 'Bersih Tanpa Noise (Standar Katalog Cetak)';
    let lightingStatus = 'Pencahayaan Studio Berdimensi Seimbang';
    const notesArr: string[] = [];

    // 1. Evaluasi Eksposur
    const absEv = Math.abs(evDelta);
    if (absEv <= 0.3) {
      exposureStatus = 'Eksposur Sangat Seimbang (Optimal 0 EV)';
      notesArr.push('Pencahayaan ideal, highlight dan shadow terekspos proporsional tanpa detail yang hilang.');
    } else if (evDelta > 1.2) {
      score -= 35;
      exposureStatus = 'Overexposed (Terlalu Terang / Highlight Hangus)';
      notesArr.push('Warna produk memudar dan detail highlight hilang karena terlalu banyak cahaya yang masuk. Turunkan ISO, percepat shutter speed, atau tutup diafragma (naikkan f-stop).');
    } else if (evDelta > 0.3) {
      score -= 15;
      exposureStatus = 'Sedikit Overexposed (+ ' + evDelta + ' EV)';
      notesArr.push('Foto sedikit terlalu cerah namun masih dapat ditoleransi. Sedikit reduksi cahaya akan lebih tajam.');
    } else if (evDelta < -1.2) {
      score -= 35;
      exposureStatus = 'Underexposed (Terlalu Gelap / Siluet Hilang)';
      notesArr.push('Produk terlalu gelap dan tenggelam dalam bayangan pekat. Perbesar bukaan diafragma (f-stop lebih kecil), lambatkan shutter speed, atau naikkan daya Key Light studio.');
    } else {
      score -= 15;
      exposureStatus = 'Sedikit Underexposed (' + evDelta + ' EV)';
      notesArr.push('Foto agak remang, tekstur permukaan produk belum menonjol maksimal.');
    }

    // 2. Evaluasi Ketajaman & Guncangan (Motion Blur)
    if (shakeRisk > 10) {
      score -= 30;
      focusStatus = 'Goyang / Buram Akibat Guncangan Tangan (Motion Shake)';
      notesArr.push('Shutter speed terlalu lambat untuk bidikan handheld! Siswa wajib mengaktifkan Tripod Studio atau mempercepat shutter speed minimal 1/125s.');
    } else if (shakeRisk > 2) {
      score -= 15;
      focusStatus = 'Ketajaman Menurun (Sedikit Guncangan Kamera)';
      notesArr.push('Terdapat sedikit getaran mikroskopis. Gunakan tripod untuk ketajaman katalog 100%.');
    } else {
      if (currentAperture.fStop <= 2.0) {
        focusStatus = 'Bokeh Artistik Dangkal (Fokus Selektif)';
        notesArr.push(`Bukaan lebar (${currentAperture.label}) menghasilkan efek blur lembut di latar belakang, sangat menarik untuk iklan media sosial.`);
      } else if (currentAperture.fStop >= 8.0) {
        focusStatus = 'Ketajaman Penuh dari Depan ke Belakang (DoF Luas)';
        notesArr.push(`Bukaan diafragma (${currentAperture.label}) merupakan sweet spot untuk katalog produk e-commerce resmi.`);
      } else {
        focusStatus = 'Fokus Tajam Proporsional';
        notesArr.push(`Bukaan diafragma (${currentAperture.label}) memberikan keseimbangan kedalaman ruang yang baik.`);
      }
    }

    // 3. Evaluasi Noise Sensor (ISO)
    if (currentIso.iso >= 6400) {
      score -= 25;
      noiseStatus = 'Noise / Grain Sangat Kasar (Kualitas Rendah)';
      notesArr.push('ISO terlalu tinggi menimbulkan bintik bintik warna digital yang merusak kemurnian tekstur produk. Naikkan lampu studio dan turunkan ISO ke 100 atau 200.');
    } else if (currentIso.iso >= 1600) {
      score -= 12;
      noiseStatus = 'Noise Sedang Terlihat';
      notesArr.push('Ada sedikit grain digital pada area shadow. Masih layak untuk web thumbnail, namun kurang optimal untuk cetak poster.');
    } else if (currentIso.iso <= 200) {
      noiseStatus = 'Jernih Kristal (Noise 0% Standar Profesional)';
      notesArr.push('Sensor menangkap detail produk dengan kemurnian optik tertinggi.');
    }

    // 4. Evaluasi Pencahayaan Studio (Lighting Setup)
    if (keyLightPower < 30) {
      score -= 15;
      lightingStatus = 'Lampu Utama (Key Light) Terlalu Lemah';
      notesArr.push('Key light adalah pondasi dimensi utama produk, naikkan minimal ke 60-80% untuk membentuk arah bayangan yang jelas.');
    } else if (fillLightPower === 0) {
      score -= 10;
      lightingStatus = 'Kontras Terlalu Tajam (Bayangan Keras Tanpa Fill Light)';
      notesArr.push('Sisi berlawanan produk tenggelam dalam bayangan hitam legam. Aktifkan Fill Light untuk melembutkan gradasi bayangan.');
    } else if (rimLightPower >= 30 && (selectedProduct.id === 'gear' || selectedProduct.id === 'coldbrew')) {
      notesArr.push('Pemakaian Rim Light sangat tepat untuk memisahkan siluet botol kaca / roda gigi logam dari latar belakang!');
    }

    // Evaluasi Misi Khusus jika sedang dalam mode misi
    let missionPassed = true;
    if (gameMode === 'mission') {
      const activeMission = MISSIONS.find((m) => m.id === activeMissionId);
      if (activeMission) {
        if (selectedProduct.id !== activeMission.targetProduct) {
          score -= 20;
          missionPassed = false;
          notesArr.push(`⚠️ Subjek produk belum sesuai misi (target: ${activeMission.targetProduct}).`);
        }
        if (currentAperture.fStop < activeMission.criteria.minFStop || currentAperture.fStop > activeMission.criteria.maxFStop) {
          score -= 15;
          missionPassed = false;
          notesArr.push(`⚠️ Nilai diafragma belum memenuhi kriteria misi (${activeMission.criteria.minFStop} - ${activeMission.criteria.maxFStop}).`);
        }
        if (currentIso.iso > activeMission.criteria.maxIso) {
          score -= 15;
          missionPassed = false;
          notesArr.push(`⚠️ ISO melebihi batas toleransi misi (maksimal ISO ${activeMission.criteria.maxIso}).`);
        }
        if (activeMission.criteria.requireTripod && !useTripod) {
          score -= 20;
          missionPassed = false;
          notesArr.push('⚠️ Misi ini mewajibkan penggunaan Tripod Kamera untuk kestabilan!');
        }
        if (backdropId !== activeMission.criteria.backdrop) {
          score -= 15;
          missionPassed = false;
          notesArr.push('⚠️ Latar belakang studio belum sesuai standar brief klien misi.');
        }
      }
    }

    // Hitung Grade
    score = Math.max(10, Math.min(100, score));
    let grade: 'A' | 'B' | 'C' | 'D' = 'A';
    if (score >= 88) grade = 'A';
    else if (score >= 75) grade = 'B';
    else if (score >= 60) grade = 'C';
    else grade = 'D';

    return {
      score,
      grade,
      exposureStatus,
      focusStatus,
      noiseStatus,
      lightingStatus,
      teacherNotes: notesArr.join(' '),
      missionPassed,
    };
  };

  // ----------------------------------------------------
  // MEKANISME JENGKAL AMBIL FOTO (SHUTTER TRIGGER)
  // ----------------------------------------------------
  const handleCapturePhoto = () => {
    // Bunyikan shutter kamera
    playCameraShutterSound();
    setIsShutterActive(true);

    setTimeout(() => {
      // Evaluasi foto
      const critiqueResult = evaluatePhotoQuality();

      // Render hasil visual ke kanvas offline untuk menghasilkan image dataURL resolusi tinggi
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 600;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // 1. Gambar Background & Studio Wall
        const grad = ctx.createLinearGradient(0, 0, 0, 600);
        grad.addColorStop(0, currentBackdrop.wallColor);
        grad.addColorStop(0.65, currentBackdrop.floorColor);
        grad.addColorStop(1, '#020617');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 800, 600);

        // Garis batas lantai studio & dinding
        ctx.beginPath();
        ctx.moveTo(0, 390);
        ctx.lineTo(800, 390);
        ctx.strokeStyle = 'rgba(255,255,255,0.06)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // 2. Gambar Efek Pencahayaan Studio di Lantai & Dinding
        // Key Light Cone
        const keyX = keyLightAngle === 'left' ? 220 : keyLightAngle === 'right' ? 580 : 400;
        const keyGrad = ctx.createRadialGradient(keyX, 280, 20, keyX, 360, 380);
        const keyAlpha = (keyLightPower / 100) * 0.45;
        keyGrad.addColorStop(0, `rgba(255, 250, 235, ${keyAlpha})`);
        keyGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = keyGrad;
        ctx.fillRect(0, 0, 800, 600);

        // Fill Light Softness
        const fillAlpha = (fillLightPower / 100) * 0.25;
        const fillX = keyLightAngle === 'left' ? 580 : 220;
        const fillGrad = ctx.createRadialGradient(fillX, 320, 20, fillX, 360, 340);
        fillGrad.addColorStop(0, `rgba(224, 231, 255, ${fillAlpha})`);
        fillGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = fillGrad;
        ctx.fillRect(0, 0, 800, 600);

        // 3. Gambar Bayangan Produk (Shadow)
        const shadowOffset = keyLightAngle === 'left' ? 70 : keyLightAngle === 'right' ? -70 : 0;
        const shadowBlur = softbox ? 35 : 12;
        ctx.save();
        ctx.filter = `blur(${shadowBlur}px)`;
        ctx.fillStyle = `rgba(0, 0, 0, ${(keyLightPower / 100) * 0.75})`;
        ctx.beginPath();
        ctx.ellipse(400 + shadowOffset, 450, 110, 26, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 4. Gambar Subjek Produk (Vector Graphic representation)
        ctx.save();

        // Motion shake if any
        if (shakeRisk > 2) {
          const shakeVal = (shakeRisk / 2);
          ctx.translate(shakeVal, shakeVal * 0.5);
          ctx.filter = `blur(${shakeVal * 0.4}px)`;
        }

        // Rim Light Outline Glow jika aktif
        if (rimLightPower > 20) {
          ctx.shadowColor = `rgba(224, 242, 254, ${(rimLightPower / 100) * 0.9})`;
          ctx.shadowBlur = 18;
        }

        // Render Produk Spesifik
        renderProductToCanvas(ctx, selectedProduct.id, keyLightAngle, keyLightPower);
        ctx.restore();

        // 5. Efek Noise Sensor (ISO Grain)
        if (currentIso.grainPct > 2) {
          const grainIntensity = (currentIso.grainPct / 100) * 0.35;
          const imgData = ctx.getImageData(0, 0, 800, 600);
          const data = imgData.data;
          for (let i = 0; i < data.length; i += 4) {
            const noise = (Math.random() - 0.5) * 255 * grainIntensity;
            data[i] = Math.min(255, Math.max(0, data[i] + noise));
            data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
            data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
          }
          ctx.putImageData(imgData, 0, 0);
        }

        // 6. Koreksi Eksposur Akhir (Over/Under Filter)
        if (evDelta > 0.3) {
          // Overexposure overlay putih
          const overAlpha = Math.min(0.75, (evDelta / 3.0) * 0.75);
          ctx.fillStyle = `rgba(255, 255, 255, ${overAlpha})`;
          ctx.fillRect(0, 0, 800, 600);
        } else if (evDelta < -0.3) {
          // Underexposure overlay gelap
          const underAlpha = Math.min(0.85, (Math.abs(evDelta) / 3.0) * 0.85);
          ctx.fillStyle = `rgba(0, 0, 0, ${underAlpha})`;
          ctx.fillRect(0, 0, 800, 600);
        }

        // 7. Watermark Data Pemotretan Kamera (EXIF HUD)
        ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
        ctx.fillRect(0, 555, 800, 45);
        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.fillStyle = '#f8fafc';
        ctx.fillText(`📷 SMKN 4 KENDARI • STUDIO VOKASI`, 20, 582);
        ctx.font = '11px monospace';
        ctx.fillStyle = '#38bdf8';
        ctx.fillText(
          `${currentAperture.label}  |  ${currentShutter.label}  |  ${currentIso.label}  |  EV ${evDelta >= 0 ? '+' : ''}${evDelta}  |  ${useTripod ? 'TRIPOD ON' : 'HANDHELD'}`,
          420,
          582
        );
      }

      const generatedDataUrl = canvas.toDataURL('image/png');

      const newCapture: PhotoCapture = {
        id: `capture-${Date.now()}`,
        dataUrl: generatedDataUrl,
        timestamp: new Date().toISOString(),
        productName: selectedProduct.name,
        settings: {
          fStopLabel: currentAperture.label,
          shutterLabel: currentShutter.label,
          isoLabel: currentIso.label,
          useTripod,
          keyLightPower,
          keyLightAngle,
          softbox,
          fillLightPower,
          rimLightPower,
          backdrop: currentBackdrop.name,
        },
        score: critiqueResult.score,
        grade: critiqueResult.grade,
        evDelta,
        critique: {
          exposureStatus: critiqueResult.exposureStatus,
          focusStatus: critiqueResult.focusStatus,
          noiseStatus: critiqueResult.noiseStatus,
          lightingStatus: critiqueResult.lightingStatus,
          teacherNotes: critiqueResult.teacherNotes,
        },
      };

      setLatestCapture(newCapture);
      setCapturedPhotos((prev) => [newCapture, ...prev]);
      setIsShutterActive(false);
    }, 450);
  };

  // Helper untuk merender grafik produk 2D pada kanvas ekspor
  const renderProductToCanvas = (
    ctx: CanvasRenderingContext2D,
    productId: string,
    keyAngle: 'left' | 'center' | 'right',
    keyPower: number
  ) => {
    ctx.save();
    const cx = 400;
    const cy = 340;

    if (productId === 'coldbrew') {
      // BOTOL KOPI COLD BREW
      // Tutup Botol Emas
      ctx.fillStyle = '#eab308';
      ctx.fillRect(cx - 22, cy - 170, 44, 24);
      ctx.fillStyle = '#ca8a04';
      ctx.fillRect(cx - 24, cy - 150, 48, 8);

      // Leher Botol
      ctx.fillStyle = '#3e2723';
      ctx.beginPath();
      ctx.moveTo(cx - 20, cy - 146);
      ctx.lineTo(cx + 20, cy - 146);
      ctx.lineTo(cx + 36, cy - 80);
      ctx.lineTo(cx - 36, cy - 80);
      ctx.closePath();
      ctx.fill();

      // Badan Botol Kaca Kopi
      const bottleGrad = ctx.createLinearGradient(cx - 55, cy, cx + 55, cy);
      bottleGrad.addColorStop(0, '#271710');
      bottleGrad.addColorStop(0.5, '#451a03');
      bottleGrad.addColorStop(1, '#1c100b');
      ctx.fillStyle = bottleGrad;
      ctx.beginPath();
      ctx.roundRect(cx - 55, cy - 80, 110, 190, [14, 14, 18, 18]);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label Kemasan Kopi
      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(cx - 44, cy - 35, 88, 105);
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(cx - 40, cy - 31, 80, 97);

      ctx.fillStyle = '#78350f';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('COLD BREW', cx, cy - 12);
      ctx.font = 'bold 12px serif';
      ctx.fillText('VOKASI 4', cx, cy + 6);
      ctx.font = '7px sans-serif';
      ctx.fillText('100% ARABICA SULTRA', cx, cy + 22);
      ctx.fillText('250 ML • ARTISAN', cx, cy + 45);

      // Highlight Pantulan Kaca Lengkung Sesuai Sudut Key Light
      const hlX = keyAngle === 'left' ? cx - 42 : keyAngle === 'right' ? cx + 38 : cx - 5;
      ctx.fillStyle = `rgba(255, 255, 255, ${(keyPower / 100) * 0.45})`;
      ctx.fillRect(hlX, cy - 75, 8, 180);
    } else if (productId === 'sneakers') {
      // SNEAKERS KANVAS
      // Sol Karet Bawah
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.roundRect(cx - 120, cy + 45, 240, 32, [8, 16, 12, 8]);
      ctx.fill();
      ctx.strokeStyle = '#cbd5e1';
      ctx.stroke();

      // Garis Aksen Sol Merah/Navy
      ctx.fillStyle = '#e11d48';
      ctx.fillRect(cx - 110, cy + 58, 225, 4);

      // Badan Sepatu Kanvas
      const shoeGrad = ctx.createLinearGradient(cx - 100, cy - 50, cx + 100, cy + 50);
      shoeGrad.addColorStop(0, '#1e1b4b');
      shoeGrad.addColorStop(1, '#312e81');
      ctx.fillStyle = shoeGrad;
      ctx.beginPath();
      ctx.moveTo(cx - 90, cy + 45);
      ctx.lineTo(cx - 85, cy - 50); // Tumit tinggi
      ctx.lineTo(cx - 15, cy - 40); // Lidah sepatu
      ctx.lineTo(cx + 45, cy + 5);  // Punggung kaki
      ctx.lineTo(cx + 115, cy + 45); // Ujung depan
      ctx.closePath();
      ctx.fill();

      // Ujung Karet Putih (Toecap)
      ctx.fillStyle = '#f1f5f9';
      ctx.beginPath();
      ctx.moveTo(cx + 85, cy + 45);
      ctx.quadraticCurveTo(cx + 90, cy + 20, cx + 115, cy + 45);
      ctx.closePath();
      ctx.fill();

      // Tali Sepatu Putih
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3.5;
      for (let i = 0; i < 5; i++) {
        const lx = cx - 40 + i * 15;
        const ly = cy - 25 + i * 9;
        ctx.beginPath();
        ctx.moveTo(lx, ly);
        ctx.lineTo(lx + 10, ly + 6);
        ctx.stroke();
      }

      // Emblem Patch Bundar Logo SMK
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(cx - 50, cy - 5, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#4338ca';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = '#4338ca';
      ctx.font = 'bold 8px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('SMK', cx - 50, cy - 1);
      ctx.fillText('STAR', cx - 50, cy + 9);
    } else if (productId === 'wallet') {
      // DOMPET KULIT ARTISAN
      const leatherGrad = ctx.createLinearGradient(cx - 90, cy - 60, cx + 90, cy + 60);
      leatherGrad.addColorStop(0, '#9a3412');
      leatherGrad.addColorStop(0.5, '#c2410c');
      leatherGrad.addColorStop(1, '#7c2d12');
      ctx.fillStyle = leatherGrad;
      ctx.beginPath();
      ctx.roundRect(cx - 110, cy - 60, 220, 130, 12);
      ctx.fill();

      // Jahitan Tangan (Saddle Stitching) Aksen Kuning Emas
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 1.8;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(cx - 102, cy - 52, 204, 114);
      ctx.setLineDash([]); // Reset

      // Lipatan & Kantong Depan
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      ctx.fillRect(cx - 110, cy + 5, 220, 65);
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.beginPath();
      ctx.moveTo(cx - 110, cy + 5);
      ctx.lineTo(cx + 110, cy + 5);
      ctx.stroke();

      // Kancing Jepit Kuningan
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(cx + 60, cy + 38, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Emboss Logo Kulit
      ctx.fillStyle = '#431407';
      ctx.font = 'bold 10px serif';
      ctx.textAlign = 'center';
      ctx.fillText('KRIYA KULIT VOKASI', cx - 25, cy + 35);
      ctx.font = 'italic 7px sans-serif';
      ctx.fillText('HANDMADE GENUINE LEATHER', cx - 25, cy + 47);
    } else {
      // RODA GIGI PRESIASI MESIN BUBUT
      // Hub Luar Gerigi Logam
      ctx.fillStyle = '#64748b';
      const teeth = 16;
      const rOuter = 85;
      const rInner = 68;

      ctx.beginPath();
      for (let i = 0; i < teeth; i++) {
        const angle = (i * 2 * Math.PI) / teeth;
        const nextAngle = ((i + 0.5) * 2 * Math.PI) / teeth;
        const endAngle = ((i + 1) * 2 * Math.PI) / teeth;

        const x1 = cx + Math.cos(angle) * rOuter;
        const y1 = cy + Math.sin(angle) * rOuter;
        const x2 = cx + Math.cos(nextAngle) * rOuter;
        const y2 = cy + Math.sin(nextAngle) * rOuter;
        const x3 = cx + Math.cos(endAngle) * rInner;
        const y3 = cy + Math.sin(endAngle) * rInner;

        if (i === 0) ctx.moveTo(x1, y1);
        else ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
      }
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Lingkaran Badan Gear Tengah
      const metalGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 60);
      metalGrad.addColorStop(0, '#cbd5e1');
      metalGrad.addColorStop(0.7, '#475569');
      metalGrad.addColorStop(1, '#334155');
      ctx.fillStyle = metalGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 55, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Lubang Poros Tengah (Shaft Hole)
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(cx, cy, 22, 0, Math.PI * 2);
      ctx.fill();
      // Pasak / Keyway
      ctx.fillRect(cx - 5, cy - 30, 10, 15);

      // Lubang Reduksi Bobot (Lightening Holes)
      for (let j = 0; j < 4; j++) {
        const ang = (j * Math.PI) / 2;
        const hx = cx + Math.cos(ang) * 38;
        const hy = cy + Math.sin(ang) * 38;
        ctx.beginPath();
        ctx.arc(hx, hy, 8, 0, Math.PI * 2);
        ctx.fill();
      }

      // Kilau Refleksi Logam Specular Sesuai Key Light
      const specX = keyAngle === 'left' ? cx - 35 : keyAngle === 'right' ? cx + 35 : cx;
      ctx.fillStyle = `rgba(255, 255, 255, ${(keyPower / 100) * 0.6})`;
      ctx.beginPath();
      ctx.arc(specX, cy - 35, 12, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  };

  // Unduh Foto PNG
  const handleDownloadPhoto = (photo: PhotoCapture) => {
    const a = document.createElement('a');
    a.href = photo.dataUrl;
    a.download = `Foto-Produk-Vokasi-${photo.productName.replace(/\s+/g, '-')}-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Hapus dari Galeri
  const handleDeleteCapture = (id: string) => {
    setCapturedPhotos((prev) => prev.filter((p) => p.id !== id));
    if (latestCapture?.id === id) setLatestCapture(null);
    if (selectedCaptureForModal?.id === id) setSelectedCaptureForModal(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* ---------------------------------------------------- */}
      {/* HEADER UTAMA GAME SIMULASI VOKASI */}
      {/* ---------------------------------------------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-7 shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-2 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/30 text-indigo-300 text-xs font-bold">
              <Camera className="w-3.5 h-3.5 text-emerald-400" />
              Simulator Studio Fotografi Produk 2D
            </span>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-400">
              SMK DKV / Multimedia & Pemasaran
            </span>
            <span className="text-[11px] text-slate-400">
              Kurikulum Merdeka Kejuruan
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-tight">
            Praktek Foto Produk Interaktif: Segitiga Fotografi & Tata Cahaya Studio
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Eksplorasi mekanika nyata <strong>Bukaan Diafragma (Aperture / Bokeh)</strong>,{' '}
            <strong>Kecepatan Rana (Shutter Speed / Motion)</strong>,{' '}
            <strong>Sensitivitas Sensor (ISO / Noise)</strong>, serta{' '}
            <strong>Tata Cahaya Tiga Titik (Key, Fill, & Rim Light)</strong> untuk menghasilkan foto produk standar e-commerce & katalog industri.
          </p>
        </div>

        {/* Tab Pemilih Mode Game */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setGameMode('sandbox')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              gameMode === 'sandbox'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Studio Bebas (Sandbox)</span>
          </button>
          <button
            onClick={() => setGameMode('mission')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              gameMode === 'mission'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Misi Industri</span>
          </button>
          <button
            onClick={() => setGameMode('theory')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              gameMode === 'theory'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>Panduan Teori</span>
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* MODE TAMPILAN 1: PANDUAN TEORI SEGITIGA FOTOGRAFI */}
      {/* ---------------------------------------------------- */}
      {gameMode === 'theory' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-cyan-400" />
                Kamus Visual: Segitiga Eksposur & Studio Tiga Titik (Three-Point Lighting)
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Gunakan konsep dasar ini sebagai acuan saat mengatur tombol kamera virtual di studio simulasi.
              </p>
            </div>
            <button
              onClick={() => setGameMode('sandbox')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all"
            >
              Mulai Praktek Studio
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 1. Aperture */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                  f/
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Aperture (Bukaan Diafragma)</h4>
                  <span className="text-[10px] text-slate-400">Kedalaman Ruang & Bokeh</span>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Mengatur seberapa lebar bilah diafragma lensa terbuka.
              </p>
              <ul className="text-xs text-slate-400 space-y-1.5 list-disc pl-4">
                <li>
                  <strong className="text-indigo-300">Angka f kecil (f/1.4 - f/2.8):</strong> Lubang sangat lebar, cahaya masuk banyak, latar belakang blur (bokeh artistik).
                </li>
                <li>
                  <strong className="text-indigo-300">Angka f sedang (f/5.6 - f/8):</strong> Sweet spot ketajaman lensa untuk katalog e-commerce.
                </li>
                <li>
                  <strong className="text-indigo-300">Angka f besar (f/11 - f/16):</strong> Lubang sempit, seluruh bidang tajam, cahaya masuk lebih sedikit.
                </li>
              </ul>
            </div>

            {/* 2. Shutter Speed */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  ⏱️
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Shutter Speed (Kecepatan Rana)</h4>
                  <span className="text-[10px] text-slate-400">Durasi Cahaya & Guncangan</span>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Mengatur lamanya sensor terpapar cahaya.
              </p>
              <ul className="text-xs text-slate-400 space-y-1.5 list-disc pl-4">
                <li>
                  <strong className="text-amber-300">Cepat (1/250s - 1/1000s):</strong> Membekukan gerakan, aman dari getaran tangan (handheld).
                </li>
                <li>
                  <strong className="text-amber-300">Sedang (1/60s - 1/125s):</strong> Batas wajar pemotretan tanpa penyangga.
                </li>
                <li>
                  <strong className="text-amber-300">Lambat (1/15s - 1s):</strong> Cahaya masuk melimpah, namun WAJIB menggunakan Tripod agar tidak buram goyang (shake blur).
                </li>
              </ul>
            </div>

            {/* 3. ISO */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  ISO
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">ISO (Sensitivitas Sensor)</h4>
                  <span className="text-[10px] text-slate-400">Kepekaan & Noise Digital</span>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Tingkat kepekaan sensor digital kamera terhadap cahaya yang masuk.
              </p>
              <ul className="text-xs text-slate-400 space-y-1.5 list-disc pl-4">
                <li>
                  <strong className="text-emerald-300">ISO 100 - 200:</strong> Standar emas studio! Gambar bersih, jernih kristal tanpa bintik (noise 0%).
                </li>
                <li>
                  <strong className="text-emerald-300">ISO 400 - 800:</strong> Masih cukup aman untuk pencahayaan ruang sedang.
                </li>
                <li>
                  <strong className="text-emerald-300">ISO 3200 - 12800:</strong> Sangat peka namun menimbulkan grain kasar yang merusak tekstur produk.
                </li>
              </ul>
            </div>
          </div>

          {/* Tata Cahaya 3 Titik */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-400" />
              Tata Cahaya Tiga Titik Studio (Three-Point Studio Lighting Setup)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80">
                <strong className="text-amber-300 block mb-1">1. Key Light (Lampu Utama)</strong>
                Sumber cahaya terkuat (~70-80%) diletakkan 45 derajat dari subjek untuk membentuk karakter dan bayangan dimensi produk.
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80">
                <strong className="text-indigo-300 block mb-1">2. Fill Light (Lampu Pengisi)</strong>
                Ditempatkan di sisi berlawanan (~30-50%) untuk menerangi bayangan agar tidak terlalu kontras dan detail tekstur tetap terlihat.
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80">
                <strong className="text-cyan-300 block mb-1">3. Rim / Hair Light (Lampu Pemisah)</strong>
                Ditempatkan di belakang produk (~20-40%) untuk menciptakan garis kilau di tepian subjek, memisahkannya secara elegan dari latar.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MODE TAMPILAN 2: MISI INDUSTRI (BRIEF KLIEN) */}
      {/* ---------------------------------------------------- */}
      {gameMode === 'mission' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">
                Pilih Misi Simulasi Kerja Praktik Industri (Jobsheet Brief)
              </h3>
            </div>
            <span className="text-xs text-slate-400">3 Tantangan Pembelajaran</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {MISSIONS.map((m) => {
              const isSelected = activeMissionId === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => {
                    setActiveMissionId(m.id);
                    // Sesuaikan produk target misi
                    const target = PRODUCTS.find((p) => p.id === m.targetProduct);
                    if (target) setSelectedProduct(target);
                    if (m.criteria.backdrop) setBackdropId(m.criteria.backdrop);
                    if (m.criteria.requireTripod) setUseTripod(true);
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? 'bg-indigo-950/40 border-indigo-500 shadow-lg ring-1 ring-indigo-400'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-400/30">
                      {m.badge}
                    </span>
                    <h4 className="font-bold text-sm text-white">{m.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{m.brief}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
                    <div>🎯 Diafragma: f/{m.criteria.minFStop} - f/{m.criteria.maxFStop}</div>
                    <div>🎯 ISO Maksimal: {m.criteria.maxIso}</div>
                    <div>🎯 Penyangga: {m.criteria.requireTripod ? 'Wajib Tripod' : 'Bebas'}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* STUDIO UTAMA: JENDELA BIDIK (VIEWFINDER) & KONTROL */}
      {/* ---------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* KOLOM KIRI: Jendela Bidik Kamera 2D Real-Time (7 Kolom) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-5 shadow-2xl relative">
            {/* Top Bar Kamera HUD */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-mono font-bold text-slate-200">LIVE VIEWFINDER (2D SIMULATOR)</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowGrid(!showGrid)}
                  className={`p-1.5 rounded-md text-xs border transition-all ${
                    showGrid
                      ? 'bg-indigo-600 text-white border-indigo-400'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                  title="Tampilkan / Sembunyikan Garis Bantu Rule of Thirds"
                >
                  <Grid className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setUseTripod(!useTripod)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                    useTripod
                      ? 'bg-emerald-950 text-emerald-400 border-emerald-500/50'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                  title="Aktifkan Tripod untuk menstabilkan pemotretan rana lambat"
                >
                  <CircleDot className="w-3 h-3 text-emerald-400" />
                  <span>{useTripod ? 'Tripod: ON' : 'Handheld'}</span>
                </button>
              </div>
            </div>

            {/* AREA SIMULASI KANVAS KAMERA (2D STUDIO VIEWPORT) */}
            <div
              ref={previewCanvasRef}
              className={`relative w-full aspect-[4/3] rounded-xl overflow-hidden mt-3 select-none transition-all duration-300 border border-slate-800 shadow-inner ${
                currentBackdrop.bgClass
              }`}
              style={{
                filter: `brightness(${Math.max(0.08, Math.min(2.2, 1 + evDelta * 0.45))}) contrast(${
                  softbox ? 1.05 : 1.25
                })`,
              }}
            >
              {/* Studio Wall & Floor 3D-feel Division */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to bottom, ${currentBackdrop.wallColor} 0%, ${currentBackdrop.wallColor} 65%, ${currentBackdrop.floorColor} 65.5%, #020617 100%)`,
                }}
              />

              {/* Efek Bokeh Background Latar Belakang (Aperture Simulation) */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backdropFilter: `blur(${currentAperture.blurPx * 0.75}px)`,
                  WebkitBackdropFilter: `blur(${currentAperture.blurPx * 0.75}px)`,
                }}
              />

              {/* Studio Light Glow Cone (Key Light) */}
              <div
                className="absolute inset-0 pointer-events-none transition-all duration-300"
                style={{
                  background: `radial-gradient(ellipse at ${
                    keyLightAngle === 'left' ? '25%' : keyLightAngle === 'right' ? '75%' : '50%'
                  } 45%, rgba(255, 252, 235, ${
                    (keyLightPower / 100) * 0.5
                  }) 0%, rgba(0,0,0,0) 65%)`,
                }}
              />

              {/* Fill Light Diffuse */}
              <div
                className="absolute inset-0 pointer-events-none transition-all duration-300"
                style={{
                  background: `radial-gradient(ellipse at ${
                    keyLightAngle === 'left' ? '75%' : '25%'
                  } 55%, rgba(224, 231, 255, ${
                    (fillLightPower / 100) * 0.28
                  }) 0%, rgba(0,0,0,0) 60%)`,
                }}
              />

              {/* Bayangan Produk (Shadow Rendering) */}
              <div
                className="absolute bottom-[20%] left-1/2 -translate-x-1/2 pointer-events-none transition-all duration-300"
                style={{
                  width: '240px',
                  height: '45px',
                  borderRadius: '50%',
                  backgroundColor: `rgba(0, 0, 0, ${(keyLightPower / 100) * 0.75})`,
                  filter: `blur(${softbox ? 22 : 8}px)`,
                  transform: `translateX(${
                    keyLightAngle === 'left' ? '25px' : keyLightAngle === 'right' ? '-25px' : '0px'
                  }) scaleY(0.7)`,
                }}
              />

              {/* Subjek Produk 2D SVG Representatif */}
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none transition-transform duration-200"
                style={{
                  filter: `${
                    shakeRisk > 2 ? `blur(${shakeRisk * 0.35}px)` : 'none'
                  } drop-shadow(0 0 ${rimLightPower > 20 ? (rimLightPower / 100) * 16 : 0}px rgba(224, 242, 254, 0.85))`,
                  transform: shakeRisk > 2 ? `translate(${shakeRisk * 0.5}px, ${shakeRisk * 0.3}px)` : 'none',
                }}
              >
                {selectedProduct.id === 'coldbrew' && (
                  <div className="relative flex flex-col items-center">
                    {/* Tutup Botol Emas */}
                    <div className="w-10 h-5 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-600 rounded-t-sm shadow-sm" />
                    <div className="w-12 h-2 bg-amber-500 rounded-sm shadow-sm" />
                    {/* Leher Botol */}
                    <div className="w-10 h-10 bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 border-x border-amber-900/40" />
                    {/* Badan Botol */}
                    <div className="relative w-32 h-56 bg-gradient-to-r from-stone-950 via-amber-950 to-stone-900 rounded-3xl border-2 border-stone-700/40 shadow-2xl flex items-center justify-center overflow-hidden">
                      {/* Highlight Pantulan Kaca Lengkung Sesuai Arah Key Light */}
                      <div
                        className={`absolute top-0 bottom-0 w-2.5 bg-white/40 blur-[1px] transition-all duration-300 ${
                          keyLightAngle === 'left'
                            ? 'left-3'
                            : keyLightAngle === 'right'
                            ? 'right-3'
                            : 'left-1/2 -translate-x-1/2 w-4'
                        }`}
                        style={{ opacity: (keyLightPower / 100) * 0.7 }}
                      />
                      {/* Label Botol */}
                      <div className="w-24 h-32 bg-amber-100/95 rounded-lg border border-amber-800/40 p-2 text-center flex flex-col justify-between shadow-inner">
                        <span className="text-[9px] font-bold tracking-widest text-amber-900 border-b border-amber-800/30 pb-0.5">
                          COLD BREW
                        </span>
                        <div>
                          <span className="text-xs font-serif font-extrabold text-amber-950 block">
                            VOKASI 4
                          </span>
                          <span className="text-[8px] text-amber-800 font-medium">100% ARABICA</span>
                        </div>
                        <span className="text-[7px] text-amber-900 font-mono">250 ML • ARTISAN</span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedProduct.id === 'sneakers' && (
                  <div className="relative w-64 h-40 flex items-center justify-center">
                    {/* 2D Vector Silhouette Sneakers */}
                    <svg viewBox="0 0 260 160" className="w-full h-full drop-shadow-xl">
                      {/* Sol Karet */}
                      <path
                        d="M 20 120 Q 20 145 35 145 L 230 145 Q 245 145 245 130 L 245 120 Z"
                        fill="#f8fafc"
                        stroke="#cbd5e1"
                        strokeWidth="2"
                      />
                      <line x1="30" y1="132" x2="235" y2="132" stroke="#e11d48" strokeWidth="2.5" />
                      {/* Badan Kanvas Sepatu */}
                      <path
                        d="M 35 120 L 40 50 L 110 55 L 170 95 L 235 120 Z"
                        fill="url(#sneakerGrad)"
                        stroke="#312e81"
                        strokeWidth="2"
                      />
                      {/* Toecap Depan */}
                      <path d="M 200 120 Q 205 100 235 120 Z" fill="#f1f5f9" />
                      {/* Tali Sepatu */}
                      <line x1="90" y1="65" x2="105" y2="70" stroke="#ffffff" strokeWidth="3" />
                      <line x1="105" y1="78" x2="120" y2="83" stroke="#ffffff" strokeWidth="3" />
                      <line x1="120" y1="91" x2="135" y2="96" stroke="#ffffff" strokeWidth="3" />
                      {/* Emblem Patch Bundar */}
                      <circle cx="75" cy="85" r="14" fill="#ffffff" stroke="#4338ca" strokeWidth="1.5" />
                      <text x="75" y="87" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#4338ca">
                        SMK
                      </text>
                      <defs>
                        <linearGradient id="sneakerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#1e1b4b" />
                          <stop offset="100%" stopColor="#3730a3" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                )}

                {selectedProduct.id === 'wallet' && (
                  <div className="relative w-56 h-36 bg-gradient-to-br from-amber-700 via-orange-800 to-amber-950 rounded-2xl border-2 border-amber-900 shadow-2xl p-3 flex flex-col justify-between">
                    {/* Saddle Stitching Dashed Border */}
                    <div className="absolute inset-1.5 border-2 border-dashed border-amber-200/50 rounded-xl pointer-events-none" />
                    <div className="flex justify-between items-start z-10">
                      <div className="text-left">
                        <span className="text-[10px] font-bold text-amber-200 block tracking-wider">
                          KRIYA KULIT
                        </span>
                        <span className="text-[8px] text-amber-300/80">SMKN 4 KENDARI</span>
                      </div>
                      {/* Kancing Kuningan */}
                      <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 border border-amber-900 shadow-md flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-900" />
                      </div>
                    </div>
                    {/* Tekstur Jahit Tengah & Emboss */}
                    <div className="z-10 text-center py-2 border-t border-amber-950/60 bg-black/10 rounded-lg">
                      <span className="text-[9px] font-serif font-bold text-amber-100 tracking-widest block">
                        GENUINE LEATHER
                      </span>
                      <span className="text-[7px] text-amber-300 font-mono">HANDMADE CRAFT</span>
                    </div>
                  </div>
                )}

                {selectedProduct.id === 'gear' && (
                  <div className="relative w-48 h-48 flex items-center justify-center">
                    {/* Gear Logam Presisi 2D */}
                    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
                      {/* Lingkaran Gerigi */}
                      <circle cx="100" cy="100" r="75" fill="#475569" stroke="#94a3b8" strokeWidth="3" />
                      {/* Gigi Gear Luar */}
                      {[...Array(16)].map((_, i) => (
                        <rect
                          key={i}
                          x="92"
                          y="14"
                          width="16"
                          height="16"
                          rx="2"
                          fill="#64748b"
                          transform={`rotate(${i * 22.5} 100 100)`}
                        />
                      ))}
                      {/* Badan Dalam Logam */}
                      <circle cx="100" cy="100" r="50" fill="url(#metalGrad)" stroke="#334155" strokeWidth="2" />
                      {/* Poros Tengah & Lubang Pasak */}
                      <circle cx="100" cy="100" r="20" fill="#0f172a" />
                      <rect x="96" y="74" width="8" height="12" fill="#0f172a" />
                      {/* Lubang Reduksi Bobot */}
                      {[0, 90, 180, 270].map((deg) => (
                        <circle
                          key={deg}
                          cx={100 + Math.cos((deg * Math.PI) / 180) * 34}
                          cy={100 + Math.sin((deg * Math.PI) / 180) * 34}
                          r="7"
                          fill="#1e293b"
                        />
                      ))}
                      {/* Kilau Specular */}
                      <circle
                        cx={keyLightAngle === 'left' ? 70 : keyLightAngle === 'right' ? 130 : 100}
                        cy="70"
                        r="12"
                        fill="rgba(255,255,255,0.4)"
                        filter="blur(2px)"
                      />
                      <defs>
                        <radialGradient id="metalGrad" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="#cbd5e1" />
                          <stop offset="70%" stopColor="#475569" />
                          <stop offset="100%" stopColor="#1e293b" />
                        </radialGradient>
                      </defs>
                    </svg>
                  </div>
                )}
              </div>

              {/* Noise Canvas Overlay (Simulasi Grain ISO Tinggi) */}
              {currentIso.grainPct > 2 && (
                <div
                  className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-60"
                  style={{
                    backgroundImage: `radial-gradient(rgba(255,255,255,${
                      currentIso.grainPct / 120
                    }) 1px, transparent 0)`,
                    backgroundSize: '3px 3px',
                  }}
                />
              )}

              {/* Garis Bantu Komposisi Rule of Thirds */}
              {showGrid && (
                <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 z-10">
                  <div className="border-r border-b border-cyan-400/25"></div>
                  <div className="border-r border-b border-cyan-400/25"></div>
                  <div className="border-b border-cyan-400/25"></div>
                  <div className="border-r border-b border-cyan-400/25"></div>
                  <div className="border-r border-b border-cyan-400/25"></div>
                  <div className="border-b border-cyan-400/25"></div>
                  <div className="border-r border-cyan-400/25"></div>
                  <div className="border-r border-cyan-400/25"></div>
                  <div></div>
                </div>
              )}

              {/* Titik AF Kamera Tengah (Autofocus Target) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 border border-emerald-400/60 rounded-sm pointer-events-none flex items-center justify-center z-10">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
              </div>

              {/* Flash / Rana Gelap saat Jepret Foto */}
              {isShutterActive && (
                <div className="absolute inset-0 bg-white z-50 animate-pulse transition-opacity duration-200" />
              )}

              {/* HUD Bar Bawah Viewfinder (LCD Kamera Mirrorless) */}
              <div className="absolute bottom-2 left-2 right-2 bg-slate-950/85 backdrop-blur-md rounded-lg p-2 border border-slate-800 text-xs font-mono flex items-center justify-between text-slate-300 z-20">
                <div className="flex items-center gap-3">
                  <span className="text-amber-400 font-bold">{currentAperture.label}</span>
                  <span className="text-cyan-400 font-bold">{currentShutter.label}</span>
                  <span className="text-emerald-400 font-bold">{currentIso.label}</span>
                </div>

                {/* Exposure Meter Bar (-3 .. 0 .. +3) */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-500 font-sans hidden sm:inline">EV:</span>
                  <div className="flex items-center gap-0.5 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-[10px]">
                    <span className="text-slate-500">-3</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-500">-2</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-500">-1</span>
                    <span className="text-slate-600">•</span>
                    <span className="font-bold text-white px-0.5 bg-slate-800 rounded">0</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-500">+1</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-500">+2</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-500">+3</span>
                  </div>

                  <span
                    className={`font-bold text-xs px-1.5 py-0.5 rounded ${
                      Math.abs(evDelta) <= 0.3
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/50'
                        : evDelta > 1.0
                        ? 'bg-rose-950 text-rose-400 border border-rose-500/50'
                        : evDelta < -1.0
                        ? 'bg-indigo-950 text-indigo-400 border border-indigo-500/50'
                        : 'bg-amber-950 text-amber-400 border border-amber-500/50'
                    }`}
                  >
                    {evDelta >= 0 ? `+${evDelta}` : evDelta}
                  </span>
                </div>
              </div>
            </div>

            {/* Tombol Shutter Rana (Ambil Foto) */}
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-800">
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                <span>
                  Status:{' '}
                  <strong className="text-slate-200">
                    {Math.abs(evDelta) <= 0.3
                      ? 'Pencahayaan Pas (Siap Jepret)'
                      : evDelta > 0
                      ? 'Terlalu Terang (Kelebihan Cahaya)'
                      : 'Terlalu Gelap (Kurang Cahaya)'}
                  </strong>
                </span>
              </div>

              <button
                onClick={handleCapturePhoto}
                disabled={isShutterActive}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                <div className="w-3.5 h-3.5 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                </div>
                <span>Ambil Foto Produk (Jepret)</span>
              </button>
            </div>
          </div>

          {/* Pemilih Subjek Produk Vokasi & Backdrop */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            <span className="text-xs font-bold text-slate-300 block">Pilih Produk Kejuruan SMK:</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PRODUCTS.map((p) => {
                const isSelected = selectedProduct.id === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProduct(p)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-400 shadow-md'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <span className="font-bold text-xs block truncate">{p.name}</span>
                    <span className="text-[10px] opacity-75 block truncate">{p.category.split('/')[0]}</span>
                  </button>
                );
              })}
            </div>

            {/* Pilihan Backdrop Studio */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2">
              <span className="text-[11px] text-slate-400 font-semibold shrink-0">Latar Studio:</span>
              <div className="flex flex-wrap gap-1.5">
                {BACKDROP_OPTIONS.map((bd) => (
                  <button
                    key={bd.id}
                    onClick={() => setBackdropId(bd.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                      backdropId === bd.id
                        ? 'bg-slate-800 text-white border-indigo-400'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {bd.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: Panel Kontrol Segitiga Fotografi & Lampu Studio (5 Kolom) */}
        <div className="lg:col-span-5 space-y-4">
          {/* PANEL 1: SEGITIGA FOTOGRAFI (EXPOSURE TRIANGLE) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-md">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm text-white">Mekanik 1: Segitiga Fotografi</h3>
              </div>
              <span className="text-[11px] text-indigo-400 font-semibold">Dial Kamera</span>
            </div>

            {/* Kontrol 1: Aperture */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Aperture className="w-3.5 h-3.5 text-indigo-400" />
                  Bukaan Diafragma (Aperture)
                </span>
                <span className="font-mono font-bold text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/30">
                  {currentAperture.label}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={APERTURE_OPTIONS.length - 1}
                value={apertureIdx}
                onChange={(e) => setApertureIdx(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-950 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>f/1.4 (Bokeh Lebar)</span>
                <span>f/8.0 (Sweet Spot)</span>
                <span>f/16 (Tajam Semua)</span>
              </div>
              <p className="text-[11px] text-slate-400 italic">{currentAperture.desc}</p>
            </div>

            {/* Kontrol 2: Shutter Speed */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  Kecepatan Rana (Shutter Speed)
                </span>
                <span className="font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                  {currentShutter.label}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={SHUTTER_OPTIONS.length - 1}
                value={shutterIdx}
                onChange={(e) => setShutterIdx(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-slate-950 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>1/1000s (Cepat)</span>
                <span>1/60s (Batas Tangan)</span>
                <span>1.0s (Lambat)</span>
              </div>
              <p className="text-[11px] text-slate-400 italic">{currentShutter.desc}</p>
            </div>

            {/* Kontrol 3: ISO */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  Sensitivitas Sensor (ISO)
                </span>
                <span className="font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  {currentIso.label}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={ISO_OPTIONS.length - 1}
                value={isoIdx}
                onChange={(e) => setIsoIdx(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-950 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>ISO 100 (Bebas Noise)</span>
                <span>ISO 800</span>
                <span>ISO 12800 (Kasar)</span>
              </div>
              <p className="text-[11px] text-slate-400 italic">{currentIso.desc}</p>
            </div>
          </div>

          {/* PANEL 2: TATA CAHAYA STUDIO (THREE-POINT LIGHTING SETUP) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-md">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm text-white">Mekanik 2: Tata Cahaya Studio (Lighting)</h3>
              </div>
              <span className="text-[11px] text-amber-400 font-semibold">Three-Point Setup</span>
            </div>

            {/* 1. Key Light (Lampu Utama) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300">1. Key Light (Daya: {keyLightPower}%)</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setSoftbox(!softbox)}
                    className={`text-[10px] px-2 py-0.5 rounded border transition-all ${
                      softbox
                        ? 'bg-amber-950 text-amber-300 border-amber-500/50'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {softbox ? 'Softbox (Lembut)' : 'Hard Light (Keras)'}
                  </button>
                </div>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={keyLightPower}
                onChange={(e) => setKeyLightPower(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-950 rounded-lg"
              />
              {/* Sudut Key Light */}
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Sudut Lampu:</span>
                <div className="flex gap-1">
                  {(['left', 'center', 'right'] as const).map((pos) => (
                    <button
                      key={pos}
                      onClick={() => setKeyLightAngle(pos)}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                        keyLightAngle === pos
                          ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {pos === 'left' ? 'Kiri 45°' : pos === 'right' ? 'Kanan 45°' : 'Depan 0°'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Fill Light (Lampu Pengisi Bayangan) */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300">2. Fill Light (Pengisi: {fillLightPower}%)</span>
                <span className="text-[10px] text-slate-400">Pelebut Bayangan Gelap</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={fillLightPower}
                onChange={(e) => setFillLightPower(Number(e.target.value))}
                className="w-full accent-indigo-400 cursor-pointer h-1.5 bg-slate-950 rounded-lg"
              />
            </div>

            {/* 3. Rim / Hair Light (Lampu Pemisah Latar) */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300">3. Rim / Back Light (Garis Siluet: {rimLightPower}%)</span>
                <span className="text-[10px] text-cyan-400 font-semibold">Pemisah Latar Belakang</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={rimLightPower}
                onChange={(e) => setRimLightPower(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-950 rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* KARTU HASIL FOTO TERAKHIR & ASESMEN GURU KEJURUAN */}
      {/* ---------------------------------------------------- */}
      {latestCapture && (
        <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl p-5 sm:p-7 shadow-2xl space-y-6 animate-slideUp">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">Hasil Tangkapan Foto Produk Terkini</h3>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                      latestCapture.grade === 'A'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/50'
                        : latestCapture.grade === 'B'
                        ? 'bg-indigo-950 text-indigo-400 border border-indigo-500/50'
                        : latestCapture.grade === 'C'
                        ? 'bg-amber-950 text-amber-400 border border-amber-500/50'
                        : 'bg-rose-950 text-rose-400 border border-rose-500/50'
                    }`}
                  >
                    Grade {latestCapture.grade} • Skor {latestCapture.score}/100
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Subjek: {latestCapture.productName} • Diambil pada{' '}
                  {new Date(latestCapture.timestamp).toLocaleTimeString('id-ID')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDownloadPhoto(latestCapture)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow transition-all flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Foto (PNG)</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Foto Hasil Jepretan */}
            <div className="md:col-span-5 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-xl group relative">
              <img
                src={latestCapture.dataUrl}
                alt="Hasil Foto Produk Siswa"
                className="w-full h-auto object-cover"
              />
              <div className="p-3 bg-slate-950 text-[11px] font-mono text-slate-400 border-t border-slate-800/80 flex justify-between">
                <span>{latestCapture.settings.fStopLabel}</span>
                <span>{latestCapture.settings.shutterLabel}</span>
                <span>{latestCapture.settings.isoLabel}</span>
                <span>EV {latestCapture.evDelta >= 0 ? '+' : ''}{latestCapture.evDelta}</span>
              </div>
            </div>

            {/* Rubrik Penilaian Kejuruan & Saran Guru */}
            <div className="md:col-span-7 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* 1. Status Eksposur */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                  <span className="text-[11px] text-slate-400 block font-semibold">1. Status Eksposur:</span>
                  <span
                    className={`font-bold block ${
                      Math.abs(latestCapture.evDelta) <= 0.3
                        ? 'text-emerald-400'
                        : latestCapture.evDelta > 0
                        ? 'text-rose-400'
                        : 'text-indigo-400'
                    }`}
                  >
                    {latestCapture.critique.exposureStatus}
                  </span>
                </div>

                {/* 2. Status Ketajaman & Fokus */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                  <span className="text-[11px] text-slate-400 block font-semibold">2. Ketajaman & Kedalaman:</span>
                  <span className="font-bold text-cyan-400 block">{latestCapture.critique.focusStatus}</span>
                </div>

                {/* 3. Tingkat Noise Sensor */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                  <span className="text-[11px] text-slate-400 block font-semibold">3. Kebersihan Sensor (Noise):</span>
                  <span className="font-bold text-amber-400 block">{latestCapture.critique.noiseStatus}</span>
                </div>

                {/* 4. Tata Cahaya Studio */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                  <span className="text-[11px] text-slate-400 block font-semibold">4. Dimensi Pencahayaan:</span>
                  <span className="font-bold text-slate-200 block">{latestCapture.critique.lightingStatus}</span>
                </div>
              </div>

              {/* Ulasan & Saran Guru */}
              <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 text-indigo-300 font-bold">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Ulasan Guru & Evaluasi Standar Katalog Vokasi:</span>
                </div>
                <p className="text-slate-300 leading-relaxed">{latestCapture.critique.teacherNotes}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* GALERI HASIL JEPRETAN SISWA */}
      {/* ---------------------------------------------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white">Galeri Hasil Jepretan Praktik ({capturedPhotos.length})</h3>
          </div>
          {capturedPhotos.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Hapus semua foto hasil praktik dalam sesi ini?')) {
                  setCapturedPhotos([]);
                  setLatestCapture(null);
                }
              }}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Bersihkan Galeri</span>
            </button>
          )}
        </div>

        {capturedPhotos.length === 0 ? (
          <div className="text-center py-12 text-slate-500 space-y-2">
            <Camera className="w-10 h-10 mx-auto text-slate-700" />
            <p className="text-xs">Belum ada foto yang diambil. Silakan atur tombol kamera dan klik "Ambil Foto Produk (Jepret)" di atas.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {capturedPhotos.map((photo) => (
              <div
                key={photo.id}
                className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden hover:border-indigo-500/50 transition-all flex flex-col justify-between group"
              >
                <div
                  className="aspect-[4/3] overflow-hidden cursor-pointer relative"
                  onClick={() => setSelectedCaptureForModal(photo)}
                >
                  <img
                    src={photo.dataUrl}
                    alt={photo.productName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span
                    className={`absolute top-1.5 left-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      photo.grade === 'A'
                        ? 'bg-emerald-600 text-white'
                        : photo.grade === 'B'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-amber-600 text-white'
                    }`}
                  >
                    Grade {photo.grade}
                  </span>
                </div>

                <div className="p-2 space-y-1">
                  <span className="font-bold text-[11px] text-white block truncate">{photo.productName}</span>
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>{photo.settings.fStopLabel}</span>
                    <span>{photo.settings.shutterLabel}</span>
                    <span>{photo.settings.isoLabel}</span>
                  </div>

                  <div className="pt-1.5 border-t border-slate-900 flex justify-between items-center text-xs">
                    <button
                      onClick={() => handleDownloadPhoto(photo)}
                      className="text-slate-400 hover:text-indigo-300 p-1"
                      title="Unduh Foto PNG"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCapture(photo.id)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                      title="Hapus Foto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL PREVIEW FOTO HIGH RESOLUTION */}
      {selectedCaptureForModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="font-bold text-white text-sm">{selectedCaptureForModal.productName}</h4>
              <button
                onClick={() => setSelectedCaptureForModal(null)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 bg-slate-800 rounded-lg"
              >
                ✕ Tutup
              </button>
            </div>

            <div className="rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
              <img
                src={selectedCaptureForModal.dataUrl}
                alt="Foto Produk High-Res"
                className="w-full h-auto"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>
                Grade: <strong className="text-emerald-400">{selectedCaptureForModal.grade}</strong> ({selectedCaptureForModal.score}/100)
              </span>
              <button
                onClick={() => handleDownloadPhoto(selectedCaptureForModal)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Gambar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
