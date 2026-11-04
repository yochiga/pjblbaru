import React, { useState, useRef, useEffect } from 'react';
import {
  Shirt,
  Flame,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Award,
  RotateCcw,
  Download,
  Trash2,
  Sparkles,
  Info,
  Clock,
  Check,
  ChevronRight,
  Play,
  Layers,
  HelpCircle,
  Eye,
} from 'lucide-react';

// ==========================================
// TIPE DATA & KONSTANTA SABLON KAOS VOKASI
// ==========================================

export interface PrintedShirt {
  id: string;
  dataUrl: string;
  timestamp: string;
  shirtColor: string;
  shirtColorName: string;
  designId: string;
  designName: string;
  inkType: 'rubber' | 'plastisol';
  inkColor: string;
  inkColorName: string;
  squeegeeAngle: number;
  squeegeePressure: 'weak' | 'ideal' | 'hard';
  strokeCount: number;
  heatPressTemp: number;
  heatPressSeconds: number;
  useTeflonSheet: boolean;
  score: number;
  grade: 'A' | 'B' | 'C' | 'D';
  critique: {
    strokeEvaluation: string;
    curingEvaluation: string;
    teflonEvaluation: string;
    overallNotes: string;
  };
}

interface ShirtColorOption {
  id: string;
  name: string;
  hex: string;
  textTone: 'light' | 'dark';
}

const SHIRT_COLORS: ShirtColorOption[] = [
  { id: 'white', name: 'Putih Katun 24s', hex: '#f8fafc', textTone: 'dark' },
  { id: 'black', name: 'Hitam Reaktif 30s', hex: '#18181b', textTone: 'light' },
  { id: 'navy', name: 'Biru Navy Elegan', hex: '#1e293b', textTone: 'light' },
  { id: 'sage', name: 'Sage Green Pastel', hex: '#4d7c0f', textTone: 'light' },
  { id: 'maroon', name: 'Merah Maroon Distro', hex: '#881337', textTone: 'light' },
  { id: 'mustard', name: 'Kuning Mustard Vintage', hex: '#d97706', textTone: 'dark' },
];

interface GraphicDesignOption {
  id: string;
  title: string;
  category: string;
  tagline: string;
}

const GRAPHIC_DESIGNS: GraphicDesignOption[] = [
  {
    id: 'vokasi-vintage',
    title: 'Vokasi Indonesia: Karya Nyata',
    category: 'Tipografi Vintage Distro',
    tagline: 'TERAMPIL • MANDIRI • BERKARYA',
  },
  {
    id: 'smk-bisa',
    title: 'SMK BISA HEBAT Monogram',
    category: 'Identitas Sekolah Kejuruan',
    tagline: 'SIAP KERJA • SANTUN • KOMPETEN',
  },
  {
    id: 'creative-sultra',
    title: 'Kendari Creative Movement',
    category: 'Ilustrasi Streetwear Komunitas',
    tagline: 'KARYA GENERASI MUDA SULTRA',
  },
  {
    id: 'craft-code',
    title: 'CODE • CRAFT • CREATE',
    category: 'Minimalis Tech & Artisan',
    tagline: 'DIGITAL INNOVATION & VOCATION',
  },
];

interface InkColorOption {
  id: string;
  name: string;
  hex: string;
}

const INK_COLORS: InkColorOption[] = [
  { id: 'white', name: 'Putih Salju (Snow White)', hex: '#ffffff' },
  { id: 'gold', name: 'Kuning Emas (Super Gold)', hex: '#facc15' },
  { id: 'red', name: 'Merah Crimson', hex: '#ef4444' },
  { id: 'cyan', name: 'Biru Neon Elektrik', hex: '#06b6d4' },
  { id: 'green', name: 'Hijau Tosca', hex: '#10b981' },
  { id: 'black', name: 'Hitam Pekat', hex: '#09090b' },
];

export const ScreenPrintingGame: React.FC = () => {
  // ----------------------------------------------------
  // STATE TAHAP PROSES (STEP-BY-STEP WORKFLOW)
  // ----------------------------------------------------
  // 1 = Persiapan Bahan & Desain
  // 2 = Meja Sablon & Menggesut Rakel (Squeegee)
  // 3 = Mesin Heat Press & Curing
  // 4 = Hasil Kaos Jadi & Penilaian
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // ----------------------------------------------------
  // STATE BAHAN & DESAIN (TAHAP 1)
  // ----------------------------------------------------
  const [selectedShirtColor, setSelectedShirtColor] = useState<ShirtColorOption>(SHIRT_COLORS[1]); // Default Hitam
  const [selectedDesign, setSelectedDesign] = useState<GraphicDesignOption>(GRAPHIC_DESIGNS[0]);
  const [inkType, setInkType] = useState<'rubber' | 'plastisol'>('plastisol');
  const [selectedInkColor, setSelectedInkColor] = useState<InkColorOption>(INK_COLORS[1]); // Default Gold

  // ----------------------------------------------------
  // STATE MEKANIK MENGGESUT RAKEL (TAHAP 2)
  // ----------------------------------------------------
  const [squeegeeAngle, setSqueegeeAngle] = useState<number>(70); // Ideal 65° - 75°
  const [squeegeePressure, setSqueegeePressure] = useState<'weak' | 'ideal' | 'hard'>('ideal');
  const [squeegeeProgress, setSqueegeeProgress] = useState<number>(0); // 0 to 100%
  const [strokeCount, setStrokeCount] = useState<number>(0);
  const [isScreenLifted, setIsScreenLifted] = useState<boolean>(false);
  const [isDraggingSqueegee, setIsDraggingSqueegee] = useState<boolean>(false);

  // ----------------------------------------------------
  // STATE MESIN HEAT PRESS (TAHAP 3)
  // ----------------------------------------------------
  const [heatPressTemp, setHeatPressTemp] = useState<number>(165); // Default 165°C
  const [heatPressTimerSetting, setHeatPressTimerSetting] = useState<number>(15); // 15 detik
  const [useTeflonSheet, setUseTeflonSheet] = useState<boolean>(true); // Wajib ON untuk hasil rapi
  const [isPressing, setIsPressing] = useState<boolean>(false);
  const [pressCountdown, setPressCountdown] = useState<number>(0);
  const [isPressFinished, setIsPressFinished] = useState<boolean>(false);

  // ----------------------------------------------------
  // STATE HASIL AKHIR & RIWAYAT
  // ----------------------------------------------------
  const [latestPrintedShirt, setLatestPrintedShirt] = useState<PrintedShirt | null>(null);
  const [savedShirts, setSavedShirts] = useState<PrintedShirt[]>(() => {
    try {
      const saved = localStorage.getItem('vocation_printed_shirts');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });
  const [modalShirt, setModalShirt] = useState<PrintedShirt | null>(null);

  // Audio Context Ref untuk efek suara gesutan kain dan alarm heat press
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Simpan ke localStorage
  useEffect(() => {
    try {
      localStorage.setItem('vocation_printed_shirts', JSON.stringify(savedShirts));
    } catch (e) {
      console.error(e);
    }
  }, [savedShirts]);

  // Audio Synthesizer: Suara Gesut Rakel Kain (Squeegee Gliding Sound)
  const playSqueegeeSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) audioCtxRef.current = new AudioCtx();
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;
      // White noise buffer generator untuk suara gesekan kain kassa screen
      const bufferSize = ctx.sampleRate * 0.35;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.linearRampToValueAtTime(1200, now + 0.3);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(now);
      noise.stop(now + 0.35);
    } catch (e) {
      console.warn('Audio synthesis squeegee error:', e);
    }
  };

  // Audio Synthesizer: Suara Alarm Heat Press Matang (BEEP BEEP BEEP)
  const playHeatPressAlarm = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) audioCtxRef.current = new AudioCtx();
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;
      [0, 0.18, 0.36].forEach((delay) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(987.77, now + delay); // B5 note

        gain.gain.setValueAtTime(0.3, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.12);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + delay);
        osc.stop(now + delay + 0.12);
      });
    } catch (e) {
      console.warn('Audio alarm heat press error:', e);
    }
  };

  // Timer Countdown Heat Press
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPressing && pressCountdown > 0) {
      interval = setInterval(() => {
        setPressCountdown((prev) => {
          if (prev <= 1) {
            setIsPressing(false);
            setIsPressFinished(true);
            playHeatPressAlarm();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPressing, pressCountdown]);

  // ----------------------------------------------------
  // MEKANIK MENGGESUT RAKEL (PULL SQUEEGEE)
  // ----------------------------------------------------
  const handlePerformSqueegeeStroke = () => {
    setIsDraggingSqueegee(true);
    playSqueegeeSound();

    let prog = 0;
    const interval = setInterval(() => {
      prog += 10;
      setSqueegeeProgress(prog);
      if (prog >= 100) {
        clearInterval(interval);
        setIsDraggingSqueegee(false);
        setStrokeCount((prev) => prev + 1);
      }
    }, 45);
  };

  // ----------------------------------------------------
  // MEKANIK HEAT PRESS
  // ----------------------------------------------------
  const handleStartHeatPress = () => {
    setIsPressing(true);
    setIsPressFinished(false);
    setPressCountdown(heatPressTimerSetting);
  };

  // ----------------------------------------------------
  // EVALUASI & RUBRIK PENILAIAN KEJURUAN SABLON
  // ----------------------------------------------------
  const evaluatePrintingQuality = () => {
    let score = 100;
    let strokeEvaluation = 'Gesutan Sempurna: Tinta menembus serat kain rata dan presisi.';
    let curingEvaluation = 'Curing Heat Press Matang Optimal: Daya rekat tinggi dan tahan cuci.';
    let teflonEvaluation = 'Kertas Teflon Terpasang: Permukaan sablon halus rapi dan pelat mesin bersih.';
    const notesArr: string[] = [];

    // 1. Evaluasi Gesutan Rakel
    if (strokeCount === 0) {
      score -= 40;
      strokeEvaluation = 'Belum Menggesut: Desain belum tertransfer sama sekali ke kain.';
      notesArr.push('Siswa lupa melakukan gesutan rakel sebelum masuk tahap press.');
    } else {
      // Sudut Rakel (Ideal: 65° - 75°)
      if (squeegeeAngle < 55) {
        score -= 20;
        strokeEvaluation = 'Sudut Terlalu Rebah (< 55°): Lapisan tinta terlalu tebal dan berisiko meluber (bleeding).';
        notesArr.push('Posisikan rakel pada kemiringan 65° - 75° agar ketebalan tinta seimbang.');
      } else if (squeegeeAngle > 82) {
        score -= 15;
        strokeEvaluation = 'Sudut Terlalu Tegak (> 82°): Tinta tipis dan tembus kurang merata.';
        notesArr.push('Rakel terlalu tegak membuat tinta hanya tergores tipis di permukaan screen.');
      }

      // Tekanan Rakel
      if (squeegeePressure === 'weak') {
        score -= 20;
        strokeEvaluation += ' Tekanan terlalu lemah, sablon tampak putus-putus.';
        notesArr.push('Tekan rakel dengan mantap menggunakan kedua tangan agar pori kassa screen terbuka sempurna.');
      } else if (squeegeePressure === 'hard') {
        score -= 15;
        strokeEvaluation += ' Tekanan terlalu kuat, tepian grafis sedikit melebar.';
        notesArr.push('Hindari menekan terlalu keras agar garis tepi huruf tidak bocor.');
      }

      // Jumlah Gesutan
      if (strokeCount === 1) {
        notesArr.push('1x gesutan memberikan ketebalan wajar.');
      } else if (strokeCount === 2) {
        notesArr.push('2x gesutan (double stroke) menghasilkan warna yang sangat pekat dan solid (standar distro).');
      } else if (strokeCount > 3) {
        score -= 10;
        notesArr.push('Terlalu banyak gesutan (>3x) menyebabkan tumpukan tinta berlebih dan kaku.');
      }
    }

    // 2. Evaluasi Mesin Heat Press (Suhu & Waktu)
    // Suhu Ideal: Plastisol 160-170°C, Rubber 140-150°C
    const idealTempMin = inkType === 'plastisol' ? 160 : 140;
    const idealTempMax = inkType === 'plastisol' ? 172 : 152;

    if (heatPressTemp < idealTempMin) {
      score -= 25;
      curingEvaluation = `Suhu Kurang Panas (${heatPressTemp}°C): Tinta ${inkType} belum matang (under-cured), mudah luntur/retak saat dicuci!`;
      notesArr.push(`Tinta ${inkType} membutuhkan suhu matang minimal ${idealTempMin}°C.`);
    } else if (heatPressTemp > 185) {
      score -= 30;
      curingEvaluation = `Suhu Terlalu Panas (${heatPressTemp}°C): Kain kaos hangus/menguning dan tinta melepuh!`;
      notesArr.push(`Suhu di atas 185°C merusak serat kain katun. Turunkan ke ${idealTempMin} - ${idealTempMax}°C.`);
    } else if (heatPressTemp >= idealTempMin && heatPressTemp <= idealTempMax) {
      curingEvaluation = `Suhu Sangat Tepat (${heatPressTemp}°C): Pematangan tinta ${inkType} berlangsung sempurna.`;
      notesArr.push('Suhu curing memenuhi standar pengeringan tekstil industri.');
    } else {
      score -= 10;
      curingEvaluation = `Suhu Cukup Baik (${heatPressTemp}°C), mendekati batas toleransi.`;
    }

    // Durasi Press (Ideal 12-18 detik)
    if (heatPressTimerSetting < 10) {
      score -= 15;
      curingEvaluation += ' Waktu press terlalu singkat (< 10 detik), panas belum meresap ke dasar serat.';
    } else if (heatPressTimerSetting > 22) {
      score -= 10;
      curingEvaluation += ' Waktu press agak terlalu lama, waspadai perubahan kilap kain.';
    }

    // 3. Evaluasi Teflon Sheet
    if (!useTeflonSheet) {
      score -= 30;
      teflonEvaluation = 'FATAL: Tidak Memakai Kertas Teflon! Tinta menempel ke pelat pemanas mesin press dan baju menjadi kotor/cacat!';
      notesArr.push('Kertas Teflon anti-lengket WAJIB digunakan sebagai pembatas antara pelat pemanas logam dan tinta sablon basah.');
    } else {
      notesArr.push('Penggunaan kertas teflon menjaga permukaan sablon tetap rata dan mesin press tetap bersih.');
    }

    score = Math.max(10, Math.min(100, score));
    let grade: 'A' | 'B' | 'C' | 'D' = 'A';
    if (score >= 88) grade = 'A';
    else if (score >= 75) grade = 'B';
    else if (score >= 60) grade = 'C';
    else grade = 'D';

    return {
      score,
      grade,
      strokeEvaluation,
      curingEvaluation,
      teflonEvaluation,
      overallNotes: notesArr.join(' '),
    };
  };

  // ----------------------------------------------------
  // GENERATE GAMBAR KAOS JADI (CANVAS RENDERER)
  // ----------------------------------------------------
  const handleFinalizeShirt = () => {
    const evaluation = evaluatePrintingQuality();

    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // 1. Background Studio Kaos
      const bgGrad = ctx.createRadialGradient(400, 400, 100, 400, 400, 500);
      bgGrad.addColorStop(0, '#1e293b');
      bgGrad.addColorStop(1, '#090d16');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 800, 800);

      // 2. Gambar Kaos 2D (T-Shirt Silhouette)
      const cx = 400;
      const cy = 420;

      // Bayangan Baju di Bawah
      ctx.save();
      ctx.filter = 'blur(20px)';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.beginPath();
      ctx.ellipse(cx, 710, 240, 40, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Siluet Baju Kaos
      ctx.save();
      ctx.fillStyle = selectedShirtColor.hex;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 3;

      ctx.beginPath();
      // Kerah Kiri
      ctx.moveTo(cx - 75, cy - 250);
      // Bahu Kiri
      ctx.lineTo(cx - 210, cy - 190);
      // Lengan Kiri Luar
      ctx.lineTo(cx - 300, cy - 70);
      // Ujung Lengan Kiri
      ctx.lineTo(cx - 240, cy - 20);
      // Ketiak Kiri
      ctx.lineTo(cx - 180, cy - 80);
      // Badan Kiri Bawah
      ctx.lineTo(cx - 190, cy + 240);
      // Jahitan Bawah
      ctx.quadraticCurveTo(cx, cy + 255, cx + 190, cy + 240);
      // Badan Kanan Bawah
      ctx.lineTo(cx + 180, cy - 80);
      // Ketiak Kanan
      ctx.lineTo(cx + 240, cy - 20);
      // Ujung Lengan Kanan
      ctx.lineTo(cx + 300, cy - 70);
      // Lengan Kanan Luar
      ctx.lineTo(cx + 210, cy - 190);
      // Bahu Kanan
      ctx.lineTo(cx + 75, cy - 250);
      // Kerah Tengah V/O-neck
      ctx.quadraticCurveTo(cx, cy - 200, cx - 75, cy - 250);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Rib Kerah Baju
      ctx.beginPath();
      ctx.moveTo(cx - 75, cy - 250);
      ctx.quadraticCurveTo(cx, cy - 185, cx + 75, cy - 250);
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.lineWidth = 8;
      ctx.stroke();

      // Efek Lipatan & Bayangan Realistis Kaos
      const foldGrad = ctx.createLinearGradient(cx - 200, cy, cx + 200, cy);
      foldGrad.addColorStop(0, 'rgba(0, 0, 0, 0.15)');
      foldGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.05)');
      foldGrad.addColorStop(1, 'rgba(0, 0, 0, 0.18)');
      ctx.fillStyle = foldGrad;
      ctx.fill();

      // Efek Hangus jika Heat Press Terlalu Panas (> 185°C)
      if (heatPressTemp > 185) {
        ctx.fillStyle = 'rgba(180, 83, 9, 0.45)';
        ctx.beginPath();
        ctx.ellipse(cx, cy - 20, 170, 160, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      // 3. Gambar Desain Sablon di Area Dada Kaos
      ctx.save();
      const printX = cx;
      const printY = cy - 35;

      // Kualitas Sablon: Opasitas & Efek Visual
      let inkAlpha = strokeCount >= 2 ? 0.98 : strokeCount === 1 ? 0.85 : 0.2;
      let blurPx = 0;

      // Jika sudut terlalu rebah (<55°), ada bleeding / blur
      if (squeegeeAngle < 55) {
        blurPx = 3;
      }
      // Jika tekanan lemah, agak transparan / putus
      if (squeegeePressure === 'weak') {
        inkAlpha *= 0.65;
      }
      // Jika lupa teflon, tinta rusak / mengelupas
      if (!useTeflonSheet) {
        inkAlpha *= 0.45;
        blurPx += 4;
      }

      ctx.filter = blurPx > 0 ? `blur(${blurPx}px)` : 'none';
      ctx.fillStyle = selectedInkColor.hex;
      ctx.globalAlpha = inkAlpha;

      // Render Grafis Spesifik
      renderGraphicDesignToCanvas(ctx, selectedDesign.id, printX, printY, selectedInkColor.hex);

      // Jika under-cured (<140°C), tambahkan tekstur retakan halus
      if (heatPressTemp < 140) {
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(printX - 60, printY - 30);
        ctx.lineTo(printX - 20, printY + 10);
        ctx.lineTo(printX + 30, printY - 15);
        ctx.stroke();
      }

      ctx.restore();

      // 4. Watermark EXIF Produksi Vokasi
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(0, 740, 800, 60);
      ctx.font = 'bold 13px Inter, sans-serif';
      ctx.fillStyle = '#f8fafc';
      ctx.fillText(`👕 PRAKTEK SABLON VOKASI • SMKN 4 KENDARI`, 25, 775);
      ctx.font = '11px monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(
        `RAKEL ${squeegeeAngle}° | ${strokeCount}x GESUT | PRESS ${heatPressTemp}°C (${heatPressTimerSetting}s) | ${inkType.toUpperCase()}`,
        360,
        775
      );
    }

    const generatedDataUrl = canvas.toDataURL('image/png');

    const newShirt: PrintedShirt = {
      id: `shirt-${Date.now()}`,
      dataUrl: generatedDataUrl,
      timestamp: new Date().toISOString(),
      shirtColor: selectedShirtColor.hex,
      shirtColorName: selectedShirtColor.name,
      designId: selectedDesign.id,
      designName: selectedDesign.title,
      inkType,
      inkColor: selectedInkColor.hex,
      inkColorName: selectedInkColor.name,
      squeegeeAngle,
      squeegeePressure,
      strokeCount,
      heatPressTemp,
      heatPressSeconds: heatPressTimerSetting,
      useTeflonSheet,
      score: evaluation.score,
      grade: evaluation.grade,
      critique: {
        strokeEvaluation: evaluation.strokeEvaluation,
        curingEvaluation: evaluation.curingEvaluation,
        teflonEvaluation: evaluation.teflonEvaluation,
        overallNotes: evaluation.overallNotes,
      },
    };

    setLatestPrintedShirt(newShirt);
    setSavedShirts((prev) => [newShirt, ...prev]);
    setCurrentStep(4);
  };

  // Helper untuk menggambar desain sablon pada kanvas
  const renderGraphicDesignToCanvas = (
    ctx: CanvasRenderingContext2D,
    designId: string,
    x: number,
    y: number,
    color: string
  ) => {
    ctx.textAlign = 'center';

    if (designId === 'vokasi-vintage') {
      // 1. Vokasi Vintage
      // Bingkai Distressed Box
      ctx.lineWidth = 3;
      ctx.strokeStyle = color;
      ctx.strokeRect(x - 110, y - 80, 220, 160);
      ctx.strokeRect(x - 104, y - 74, 208, 148);

      ctx.font = '900 13px "Impact", sans-serif';
      ctx.fillText('• KARYA NYATA KEJURUAN •', x, y - 50);

      ctx.font = '900 36px "Impact", sans-serif';
      ctx.fillText('VOKASI', x, y - 5);

      ctx.font = 'bold 16px "Impact", sans-serif';
      ctx.fillText('INDONESIA', x, y + 25);

      // Bintang & Pita
      ctx.font = '10px sans-serif';
      ctx.fillText('★ ★ ★ TERAMPIL & MANDIRI ★ ★ ★', x, y + 55);
    } else if (designId === 'smk-bisa') {
      // 2. SMK BISA HEBAT
      // Perisai Luar
      ctx.lineWidth = 3;
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(x - 90, y - 70);
      ctx.lineTo(x + 90, y - 70);
      ctx.lineTo(x + 85, y + 10);
      ctx.quadraticCurveTo(x, y + 90, x, y + 90);
      ctx.quadraticCurveTo(x, y + 90, x - 85, y + 10);
      ctx.closePath();
      ctx.stroke();

      ctx.font = '900 38px sans-serif';
      ctx.fillText('SMK', x, y - 10);

      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('BISA • HEBAT', x, y + 22);

      ctx.font = '10px sans-serif';
      ctx.fillText('SIAP KERJA & KOMPETEN', x, y + 50);
    } else if (designId === 'creative-sultra') {
      // 3. Kendari Creative Movement
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('STREETWEAR CULTURE 2026', x, y - 60);

      // Lingkaran Desain
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.arc(x, y - 5, 55, 0, Math.PI * 2);
      ctx.stroke();

      ctx.font = '900 24px sans-serif';
      ctx.fillText('KENDARI', x, y - 10);
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText('CREATIVE', x, y + 15);

      ctx.font = 'italic 10px sans-serif';
      ctx.fillText('SULTRA YOUTH MOVEMENT', x, y + 70);
    } else {
      // 4. CODE • CRAFT • CREATE
      ctx.font = 'bold 10px monospace';
      ctx.fillText('[ SMK DIGITAL ARTISAN ]', x, y - 60);

      ctx.font = '900 28px monospace';
      ctx.fillText('CODE', x, y - 25);
      ctx.fillText('CRAFT', x, y + 8);
      ctx.fillText('CREATE', x, y + 42);

      ctx.lineWidth = 2;
      ctx.strokeStyle = color;
      ctx.strokeRect(x - 100, y - 75, 200, 140);
    }
  };

  // Unduh Mockup Kaos PNG
  const handleDownloadShirt = (shirt: PrintedShirt) => {
    const a = document.createElement('a');
    a.href = shirt.dataUrl;
    a.download = `Kaos-Sablon-Vokasi-${shirt.designName.replace(/\s+/g, '-')}-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Reset Sesi Praktik Sablon
  const handleResetSession = () => {
    setCurrentStep(1);
    setSqueegeeProgress(0);
    setStrokeCount(0);
    setIsScreenLifted(false);
    setIsPressFinished(false);
    setIsPressing(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* ---------------------------------------------------- */}
      {/* HEADER SIMULASI SABLON KAOS */}
      {/* ---------------------------------------------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-7 shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-2 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
              <Shirt className="w-3.5 h-3.5 text-emerald-400" />
              Simulator Sablon Kaos Manual & Heat Press 2D
            </span>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-950/70 border border-indigo-500/40 text-indigo-300">
              SMK DKV / Desain Grafis / Kriya Tekstil
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-tight">
            Praktek Sablon Baju: Teknik Menggesut Rakel & Pematangan Heat Press
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Pelajari tahapan produksi sablon manual: memilih warna kain & tinta, mengatur sudut & tekanan rakel saat <strong>menggesut (squeegee stroke)</strong>, hingga pematangan suhu mesin <strong>Heat Press</strong> agar sablon awet dan rapi standar industri distro.
          </p>
        </div>

        {/* Wizard Langkah Praktik Sablon */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800 shrink-0">
          {[
            { step: 1, label: '1. Desain' },
            { step: 2, label: '2. Gesut' },
            { step: 3, label: '3. Press' },
            { step: 4, label: '4. Hasil' },
          ].map((item) => (
            <button
              key={item.step}
              onClick={() => {
                // Hanya boleh pindah ke langkah yang sudah tercapai
                if (item.step <= currentStep || (item.step === 2 && strokeCount > 0)) {
                  setCurrentStep(item.step as any);
                }
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentStep === item.step
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : currentStep > item.step
                  ? 'bg-slate-800 text-emerald-400'
                  : 'text-slate-500 opacity-60'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* TAHAP 1: PERSIAPAN BAHAN KAOS & DESAIN SABLON */}
      {/* ---------------------------------------------------- */}
      {currentStep === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
          {/* Kolom Kiri: Pilihan Warna Kaos, Desain & Tinta (7 Kolom) */}
          <div className="lg:col-span-7 space-y-5">
            {/* 1. Pilih Warna Kaos */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <span className="text-xs font-bold text-slate-200 block">
                1. Pilih Bahan & Warna Kaos Katun:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {SHIRT_COLORS.map((sc) => {
                  const isSelected = selectedShirtColor.id === sc.id;
                  return (
                    <button
                      key={sc.id}
                      onClick={() => setSelectedShirtColor(sc)}
                      className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                        isSelected
                          ? 'bg-indigo-950/60 border-indigo-400 shadow-md ring-1 ring-indigo-400'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div
                        className="w-7 h-7 rounded-lg border border-slate-600 shadow-sm shrink-0"
                        style={{ backgroundColor: sc.hex }}
                      />
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-white block truncate">{sc.name}</span>
                        <span className="text-[10px] text-slate-400 block">Kain Katun Murni</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Pilih Desain Grafis Sablon */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <span className="text-xs font-bold text-slate-200 block">
                2. Pilih Desain Grafis / Film Sablon (Screen Stencil):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {GRAPHIC_DESIGNS.map((des) => {
                  const isSelected = selectedDesign.id === des.id;
                  return (
                    <div
                      key={des.id}
                      onClick={() => setSelectedDesign(des)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all space-y-1.5 ${
                        isSelected
                          ? 'bg-emerald-950/40 border-emerald-500 shadow-md ring-1 ring-emerald-400'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-emerald-400 border border-slate-800">
                          {des.category}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                      </div>
                      <h4 className="font-bold text-sm text-white">{des.title}</h4>
                      <p className="text-[11px] text-slate-400 font-mono">{des.tagline}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Pilih Jenis & Warna Tinta Sablon */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-slate-200">
                  3. Karakteristik Tinta Sablon:
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setInkType('plastisol');
                      setHeatPressTemp(165);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                      inkType === 'plastisol'
                        ? 'bg-amber-600 text-white border-amber-400 shadow'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    Tinta Plastisol (Distro Standar)
                  </button>
                  <button
                    onClick={() => {
                      setInkType('rubber');
                      setHeatPressTemp(145);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                      inkType === 'rubber'
                        ? 'bg-cyan-600 text-white border-cyan-400 shadow'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    Tinta Rubber (Waterbased)
                  </button>
                </div>
              </div>

              {/* Pilihan Warna Tinta */}
              <div className="space-y-2">
                <span className="text-[11px] text-slate-400 font-semibold block">Warna Tinta:</span>
                <div className="flex flex-wrap gap-2">
                  {INK_COLORS.map((ink) => (
                    <button
                      key={ink.id}
                      onClick={() => setSelectedInkColor(ink)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                        selectedInkColor.id === ink.id
                          ? 'bg-slate-800 text-white border-emerald-400'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-slate-600"
                        style={{ backgroundColor: ink.hex }}
                      />
                      <span>{ink.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Pratinjau Desain pada Kaos & Tombol Mulai Gesut (5 Kolom) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <span className="text-xs font-bold text-slate-300">Pratinjau Mockup Kaos:</span>
                <span className="text-[10px] text-emerald-400 font-mono">SIAP CETAK</span>
              </div>

              {/* Mockup Kaos Mini 2D */}
              <div className="relative aspect-[4/3] rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden">
                {/* Siluet Kaos Mini */}
                <div
                  className="relative w-52 h-44 rounded-2xl border border-white/20 shadow-2xl flex flex-col items-center justify-center p-3 transition-colors duration-300"
                  style={{ backgroundColor: selectedShirtColor.hex }}
                >
                  {/* Kerah Kaos */}
                  <div className="absolute top-0 w-16 h-3 bg-black/25 rounded-b-xl border-b border-white/20" />
                  {/* Desain Sablon pada Kaos */}
                  <div
                    className="p-3 text-center border-2 border-dashed border-white/25 rounded-lg max-w-[140px] truncate"
                    style={{ color: selectedInkColor.hex }}
                  >
                    <span className="text-[10px] font-bold block uppercase tracking-wider truncate">
                      {selectedDesign.title}
                    </span>
                    <span className="text-[7px] block opacity-80 truncate">{selectedDesign.tagline}</span>
                  </div>
                </div>
              </div>

              {/* Rincian Spesifikasi */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Warna Kaos:</span>
                  <span className="font-semibold text-white">{selectedShirtColor.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Jenis Tinta:</span>
                  <span className="font-semibold text-emerald-400">
                    {inkType === 'plastisol' ? 'Plastisol (165°C)' : 'Rubber (145°C)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Warna Sablon:</span>
                  <span className="font-semibold text-amber-300">{selectedInkColor.name}</span>
                </div>
              </div>

              {/* Tombol Lanjut ke Meja Sablon */}
              <button
                onClick={() => setCurrentStep(2)}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
              >
                <span>Lanjut ke Meja Sablon (Mulai Menggesut)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAHAP 2: MEJA SABLON & MEKANIK MENGGESUT (SQUEEGEE) */}
      {/* ---------------------------------------------------- */}
      {currentStep === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
          {/* Kolom Kiri: Visual 2D Meja Sablon & Animasi Gesut Rakel (7 Kolom) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xl relative">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="font-mono font-bold text-slate-200">MEJA SABLON MANUAL (PLATEN & SCREEN)</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsScreenLifted(!isScreenLifted)}
                    className={`px-3 py-1 rounded-md text-xs font-semibold border transition-all ${
                      isScreenLifted
                        ? 'bg-amber-950 text-amber-300 border-amber-500/50'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                    }`}
                  >
                    {isScreenLifted ? 'Turunkan Screen Sablon' : 'Angkat Screen Sablon'}
                  </button>
                </div>
              </div>

              {/* AREA MEJA SABLON (VIEWPORT 2D) */}
              <div className="relative w-full aspect-[4/3] rounded-xl bg-slate-950 border border-slate-800 overflow-hidden mt-3 flex items-center justify-center select-none shadow-inner">
                {/* 1. Kaos Terbentang di Atas Papan Tatakan (Platen) */}
                <div
                  className="relative w-64 h-72 rounded-2xl border-2 border-slate-700/60 shadow-2xl flex flex-col items-center justify-center p-3 transition-all"
                  style={{ backgroundColor: selectedShirtColor.hex }}
                >
                  {/* Kerah Kaos */}
                  <div className="absolute top-0 w-20 h-4 bg-black/25 rounded-b-xl border-b border-white/20" />

                  {/* Cetakan Tinta pada Kaos jika sudah digesut */}
                  {strokeCount > 0 && (
                    <div
                      className="p-3 text-center border-2 border-dashed border-white/30 rounded-lg max-w-[170px] transition-opacity duration-500"
                      style={{
                        color: selectedInkColor.hex,
                        opacity: strokeCount >= 2 ? 0.98 : 0.8,
                      }}
                    >
                      <span className="text-xs font-bold block uppercase tracking-wider">
                        {selectedDesign.title}
                      </span>
                      <span className="text-[8px] block opacity-80">{selectedDesign.tagline}</span>
                    </div>
                  )}
                </div>

                {/* 2. Bingkai Screen Sablon Kayu/Aluminium (Bisa Diangkat / Diturunkan) */}
                <div
                  className={`absolute inset-4 rounded-xl border-8 border-amber-800/90 bg-slate-900/60 backdrop-blur-[1px] shadow-2xl transition-all duration-500 flex flex-col justify-between p-3 pointer-events-none ${
                    isScreenLifted
                      ? '-translate-y-28 opacity-40 scale-95'
                      : 'translate-y-0 opacity-100'
                  }`}
                  style={{
                    backgroundImage:
                      'radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 0)',
                    backgroundSize: '4px 4px',
                  }}
                >
                  <div className="flex justify-between text-[10px] font-mono font-bold text-amber-200 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-700/60">
                    <span>SCREEN T77 (ALUMUNIUM FRAME)</span>
                    <span>{isScreenLifted ? 'SCREEN DIANGKAT' : 'SCREEN MERAPAT KE KAIN'}</span>
                  </div>

                  {/* Desain Transparan di Kassa Screen */}
                  <div className="self-center p-4 border border-dashed border-cyan-400/40 rounded-lg text-center text-cyan-300">
                    <span className="text-xs font-bold block">{selectedDesign.title}</span>
                    <span className="text-[9px] block text-cyan-400/80">Stensil Film Afdrukat</span>
                  </div>

                  {/* 3. Rakel Sablon Bergeser (Squeegee Blade Animation) */}
                  {!isScreenLifted && (
                    <div
                      className="absolute left-6 right-6 h-8 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 rounded border-b-4 border-slate-900 shadow-2xl flex items-center justify-center transition-all duration-75"
                      style={{
                        top: `${10 + squeegeeProgress * 0.75}%`,
                        transform: `rotate(${squeegeeAngle - 70}deg)`,
                      }}
                    >
                      <div className="w-16 h-2 bg-amber-900 rounded-full" />
                      <span className="absolute -top-4 text-[9px] font-mono text-white bg-slate-900/90 px-1.5 py-0.2 rounded">
                        RAKEL {squeegeeAngle}°
                      </span>
                    </div>
                  )}

                  <div className="text-[10px] font-mono text-slate-400 text-center">
                    Garis Pasak Registrasi Meja Presisi
                  </div>
                </div>
              </div>

              {/* Status Gesutan Bawah */}
              <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-800">
                <div className="text-xs text-slate-400">
                  Jumlah Gesutan:{' '}
                  <strong className="text-emerald-400 font-mono text-sm">{strokeCount}x Gesutan</strong>
                  {strokeCount === 0 && ' (Belum digesut)'}
                  {strokeCount === 1 && ' (1x Gesutan - Cukup Tipis)'}
                  {strokeCount >= 2 && ' (2x Gesutan - Warna Solid Standar Distro)'}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handlePerformSqueegeeStroke}
                    disabled={isDraggingSqueegee || isScreenLifted}
                    className="flex-1 sm:flex-initial px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Tarik Rakel (Gesut Sekarang)</span>
                  </button>

                  <button
                    onClick={() => {
                      setStrokeCount(0);
                      setSqueegeeProgress(0);
                    }}
                    className="p-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white border border-slate-700"
                    title="Ulangi Gesutan"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Dial Kontrol Menggesut Rakel (5 Kolom) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-bold text-sm text-white">Mekanik Gesut: Sudut & Tekanan Rakel</h3>
                </div>
                <span className="text-[11px] text-emerald-400 font-mono">STANDAR DKV</span>
              </div>

              {/* 1. Sudut Kemiringan Rakel */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">Sudut Rakel:</span>
                  <span
                    className={`font-mono font-bold px-2 py-0.5 rounded text-xs border ${
                      squeegeeAngle >= 65 && squeegeeAngle <= 75
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-500/50'
                        : 'bg-amber-950 text-amber-400 border-amber-500/50'
                    }`}
                  >
                    {squeegeeAngle}° {squeegeeAngle >= 65 && squeegeeAngle <= 75 ? '(Ideal)' : ''}
                  </span>
                </div>
                <input
                  type="range"
                  min={40}
                  max={88}
                  value={squeegeeAngle}
                  onChange={(e) => setSqueegeeAngle(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-950 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>40° (Terlalu Rebah)</span>
                  <span className="text-emerald-400">65°-75° (Ideal)</span>
                  <span>88° (Terlalu Tegak)</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed italic">
                  *Sudut 65° - 75° mendorong tinta masuk secara merata tanpa membuat tinta meluber ke bawah screen.
                </p>
              </div>

              {/* 2. Tekanan Gesutan Rakel */}
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <span className="text-xs font-semibold text-slate-300 block">Kekuatan Tekanan Gesutan:</span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'weak', label: 'Lemah', desc: 'Tinta tipis/putus' },
                    { id: 'ideal', label: 'Sedang (Ideal)', desc: 'Tembus serat rata' },
                    { id: 'hard', label: 'Terlalu Kuat', desc: 'Risiko melebar' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSqueegeePressure(p.id as any)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        squeegeePressure === p.id
                          ? 'bg-emerald-600 text-white border-emerald-400 font-bold shadow'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      <span className="text-xs block">{p.label}</span>
                      <span className="text-[9px] opacity-75 block">{p.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tombol Lanjut ke Tahap Heat Press */}
              <div className="pt-3 border-t border-slate-800">
                <button
                  onClick={() => {
                    setIsScreenLifted(true);
                    setTimeout(() => setCurrentStep(3), 400);
                  }}
                  disabled={strokeCount === 0}
                  className="w-full py-3 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-amber-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Flame className="w-4 h-4" />
                  <span>Lanjut ke Mesin Heat Press ({strokeCount}x Gesut Selesai)</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                {strokeCount === 0 && (
                  <p className="text-[11px] text-amber-400 mt-1.5 text-center">
                    *Lakukan gesutan minimal 1x sebelum lanjut ke mesin press.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAHAP 3: MESIN HEAT PRESS & CURING KAOS */}
      {/* ---------------------------------------------------- */}
      {currentStep === 3 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
          {/* Kolom Kiri: Visual Mesin Heat Press Industri & Indikator Panas (7 Kolom) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xl relative">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span className="font-mono font-bold text-slate-200">
                    MESIN HEAT PRESS DIGITAL (HIGH PRESSURE CLAMSHELL)
                  </span>
                </div>
                <span className="text-amber-300 font-mono text-xs">
                  Suhu Pemanas: {heatPressTemp}°C
                </span>
              </div>

              {/* AREA MESIN HEAT PRESS (2D ANIMATION VIEWPORT) */}
              <div className="relative w-full aspect-[4/3] rounded-xl bg-slate-950 border border-slate-800 overflow-hidden mt-3 flex items-center justify-center select-none shadow-inner">
                {/* 1. Pelat Bawah dengan Kaos Sablon Terbentang */}
                <div className="relative w-80 h-64 rounded-xl bg-slate-900 border-4 border-slate-700 shadow-2xl flex flex-col items-center justify-center p-3">
                  {/* Kaos di Atas Busa Silikon Pelat Bawah */}
                  <div
                    className="w-56 h-48 rounded-lg shadow-inner flex flex-col items-center justify-center p-2 transition-all relative overflow-hidden"
                    style={{ backgroundColor: selectedShirtColor.hex }}
                  >
                    {/* Desain Sablon pada Kaos */}
                    <div
                      className="p-2 text-center border border-dashed border-white/20 rounded"
                      style={{ color: selectedInkColor.hex }}
                    >
                      <span className="text-[11px] font-bold block">{selectedDesign.title}</span>
                    </div>

                    {/* Lembaran Teflon Sheet Pelindung Anti-Lengket */}
                    {useTeflonSheet && (
                      <div className="absolute inset-2 bg-amber-200/40 backdrop-blur-[1px] border border-amber-400/60 rounded flex items-center justify-center z-10">
                        <span className="text-[10px] font-mono font-bold text-amber-950 bg-amber-300/80 px-2 py-0.5 rounded shadow">
                          LEMBARAN TEFLON PELINDUNG AKTIF
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Pelat Pemanas Atas Mesin Press (Clamshell Upper Platen) */}
                <div
                  className={`absolute inset-x-8 h-64 rounded-xl border-4 border-amber-600/80 bg-gradient-to-b from-stone-800 to-amber-950/90 shadow-2xl transition-all duration-700 flex flex-col items-center justify-center p-4 z-20 ${
                    isPressing
                      ? 'top-10 opacity-95 scale-100'
                      : '-top-40 opacity-70 scale-95'
                  }`}
                >
                  <div className="w-24 h-4 bg-red-600 rounded-full shadow-lg border border-red-400 mb-2" />
                  <span className="text-xs font-bold text-amber-200 tracking-wider">
                    {isPressing ? 'PELAT PEMANAS MENUTUP & MENEKAN' : 'PELAT PEMANAS TERANGKAT'}
                  </span>

                  {/* Timer Hitung Mundur Real-Time di LCD Mesin */}
                  {isPressing && (
                    <div className="mt-3 px-4 py-2 bg-black rounded-lg border-2 border-red-500 text-red-500 font-mono text-3xl font-extrabold tracking-widest animate-pulse shadow-lg">
                      {pressCountdown}s
                    </div>
                  )}

                  {/* Efek Kepulan Uap Panas saat Press */}
                  {isPressing && (
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-3 opacity-70 animate-bounce">
                      <span className="w-2 h-6 bg-white/40 blur-[2px] rounded-full"></span>
                      <span className="w-3 h-8 bg-white/40 blur-[2px] rounded-full"></span>
                      <span className="w-2 h-6 bg-white/40 blur-[2px] rounded-full"></span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Pengepresan & Tombol Tuas */}
              <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-800">
                <div className="text-xs text-slate-400">
                  Status Press:{' '}
                  <strong className="text-amber-400">
                    {isPressing
                      ? `Sedang Mengepress (${pressCountdown} detik tersisa)...`
                      : isPressFinished
                      ? 'Proses Heat Press Selesai! (Siap Selesai)'
                      : 'Menunggu Tuas Diturunkan'}
                  </strong>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {!isPressing && !isPressFinished && (
                    <button
                      onClick={handleStartHeatPress}
                      className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <Flame className="w-4 h-4" />
                      <span>Tarik Tuas Heat Press ({heatPressTimerSetting} Detik)</span>
                    </button>
                  )}

                  {isPressFinished && (
                    <button
                      onClick={handleFinalizeShirt}
                      className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Buka Hasil Jadi Kaos Sablon</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Dial Kontrol Suhu, Timer & Lembaran Teflon (5 Kolom) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <h3 className="font-bold text-sm text-white">Kalibrasi Mesin Heat Press</h3>
                </div>
                <span className="text-[11px] text-amber-400 font-mono">CURING TEXTILE</span>
              </div>

              {/* 1. Pengaturan Suhu Mesin */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">Suhu Pemanas Pelat:</span>
                  <span
                    className={`font-mono font-bold px-2 py-0.5 rounded text-xs border ${
                      heatPressTemp >= 140 && heatPressTemp <= 175
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-500/50'
                        : 'bg-rose-950 text-rose-400 border-rose-500/50'
                    }`}
                  >
                    {heatPressTemp}°C
                  </span>
                </div>
                <input
                  type="range"
                  min={110}
                  max={200}
                  value={heatPressTemp}
                  disabled={isPressing}
                  onChange={(e) => setHeatPressTemp(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-950 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>110°C (Dingin)</span>
                  <span className="text-emerald-400">
                    {inkType === 'plastisol' ? '160°-170°C (Plastisol)' : '140°-150°C (Rubber)'}
                  </span>
                  <span>200°C (Hangus)</span>
                </div>
              </div>

              {/* 2. Pengaturan Timer Press */}
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">Waktu Penekanan (Timer):</span>
                  <span className="font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                    {heatPressTimerSetting} Detik
                  </span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={25}
                  value={heatPressTimerSetting}
                  disabled={isPressing}
                  onChange={(e) => setHeatPressTimerSetting(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-slate-950 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>5s (Singkat)</span>
                  <span className="text-cyan-400">12s - 15s (Ideal)</span>
                  <span>25s (Lama)</span>
                </div>
              </div>

              {/* 3. Sakelar Kertas Teflon Pelindung */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                    Lembaran Kertas Teflon (Anti-Lengket)
                  </span>
                  <button
                    onClick={() => setUseTeflonSheet(!useTeflonSheet)}
                    disabled={isPressing}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                      useTeflonSheet
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-500/50'
                        : 'bg-rose-950 text-rose-400 border-rose-500/50'
                    }`}
                  >
                    {useTeflonSheet ? 'TERPASANG (ON)' : 'TIDAK DIPASANG (OFF)'}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed italic">
                  *Kertas teflon mencegah tinta sablon basah menempel di pelat logam pemanas dan membuat hasil cetak menjadi mulus mengkilap.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAHAP 4: TAMPILAN HASIL BAJU KAOS & ASESMEN GURU */}
      {/* ---------------------------------------------------- */}
      {currentStep === 4 && latestPrintedShirt && (
        <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-5 sm:p-7 shadow-2xl space-y-6 animate-slideUp">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                <Shirt className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">Hasil Kaos Sablon Selesai Diproduksi</h3>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                      latestPrintedShirt.grade === 'A'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/50'
                        : latestPrintedShirt.grade === 'B'
                        ? 'bg-indigo-950 text-indigo-400 border border-indigo-500/50'
                        : latestPrintedShirt.grade === 'C'
                        ? 'bg-amber-950 text-amber-400 border border-amber-500/50'
                        : 'bg-rose-950 text-rose-400 border border-rose-500/50'
                    }`}
                  >
                    Grade {latestPrintedShirt.grade} • Skor {latestPrintedShirt.score}/100
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Desain: {latestPrintedShirt.designName} • Tinta: {latestPrintedShirt.inkType.toUpperCase()} ({latestPrintedShirt.inkColorName})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDownloadShirt(latestPrintedShirt)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow transition-all flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Gambar Kaos (PNG)</span>
              </button>
              <button
                onClick={handleResetSession}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl border border-slate-700 transition-all flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Sablon Baju Baru</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Foto Mockup Kaos Jadi */}
            <div className="md:col-span-5 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-2xl group relative">
              <img
                src={latestPrintedShirt.dataUrl}
                alt="Hasil Baju Kaos Sablon"
                className="w-full h-auto object-cover"
              />
              <div className="p-3 bg-slate-950 text-[11px] font-mono text-slate-400 border-t border-slate-800/80 flex justify-between">
                <span>Sudut: {latestPrintedShirt.squeegeeAngle}°</span>
                <span>{latestPrintedShirt.strokeCount}x Gesut</span>
                <span>Press: {latestPrintedShirt.heatPressTemp}°C</span>
                <span>{latestPrintedShirt.useTeflonSheet ? 'Teflon ON' : 'Teflon OFF'}</span>
              </div>
            </div>

            {/* Rubrik Penilaian Sablon & Catatan Guru Kejuruan */}
            <div className="md:col-span-7 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* 1. Evaluasi Gesutan Rakel */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                  <span className="text-[11px] text-slate-400 block font-semibold">1. Kerapatan Gesutan (Squeegee):</span>
                  <span className="font-bold text-emerald-400 block">
                    {latestPrintedShirt.critique.strokeEvaluation}
                  </span>
                </div>

                {/* 2. Evaluasi Curing Heat Press */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                  <span className="text-[11px] text-slate-400 block font-semibold">2. Pematangan Panas (Curing):</span>
                  <span className="font-bold text-amber-400 block">
                    {latestPrintedShirt.critique.curingEvaluation}
                  </span>
                </div>

                {/* 3. Penggunaan Kertas Teflon */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1 sm:col-span-2">
                  <span className="text-[11px] text-slate-400 block font-semibold">3. Lapisan Pelindung (Teflon Sheet):</span>
                  <span
                    className={`font-bold block ${
                      latestPrintedShirt.useTeflonSheet ? 'text-cyan-400' : 'text-rose-400'
                    }`}
                  >
                    {latestPrintedShirt.critique.teflonEvaluation}
                  </span>
                </div>
              </div>

              {/* Ulasan & Rekomendasi Guru Sablon SMK */}
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 text-emerald-300 font-bold">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Ulasan Guru Kejuruan Sablon Tekstil:</span>
                </div>
                <p className="text-slate-300 leading-relaxed">{latestPrintedShirt.critique.overallNotes}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* GALERI KAOS HASIL SABLON TERSIMPAN */}
      {/* ---------------------------------------------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Shirt className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">Galeri Hasil Kaos Sablon Siswa ({savedShirts.length})</h3>
          </div>
          {savedShirts.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Hapus seluruh koleksi sablon baju dalam sesi ini?')) {
                  setSavedShirts([]);
                  setLatestPrintedShirt(null);
                }
              }}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Bersihkan Galeri</span>
            </button>
          )}
        </div>

        {savedShirts.length === 0 ? (
          <div className="text-center py-12 text-slate-500 space-y-2">
            <Shirt className="w-10 h-10 mx-auto text-slate-700" />
            <p className="text-xs">
              Belum ada kaos yang disablon. Ikuti tahapan di atas untuk menggesut dan mengepress kaos pertama Anda!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {savedShirts.map((shirt) => (
              <div
                key={shirt.id}
                className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden hover:border-emerald-500/50 transition-all flex flex-col justify-between group"
              >
                <div
                  className="aspect-square overflow-hidden cursor-pointer relative"
                  onClick={() => setModalShirt(shirt)}
                >
                  <img
                    src={shirt.dataUrl}
                    alt={shirt.designName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span
                    className={`absolute top-1.5 left-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      shirt.grade === 'A'
                        ? 'bg-emerald-600 text-white'
                        : shirt.grade === 'B'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-amber-600 text-white'
                    }`}
                  >
                    Grade {shirt.grade}
                  </span>
                </div>

                <div className="p-2 space-y-1">
                  <span className="font-bold text-[11px] text-white block truncate">{shirt.designName}</span>
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>{shirt.squeegeeAngle}°</span>
                    <span>{shirt.strokeCount}x</span>
                    <span>{shirt.heatPressTemp}°C</span>
                  </div>

                  <div className="pt-1.5 border-t border-slate-900 flex justify-between items-center text-xs">
                    <button
                      onClick={() => handleDownloadShirt(shirt)}
                      className="text-slate-400 hover:text-emerald-300 p-1"
                      title="Unduh Mockup Kaos"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setSavedShirts((prev) => prev.filter((s) => s.id !== shirt.id));
                        if (latestPrintedShirt?.id === shirt.id) setLatestPrintedShirt(null);
                        if (modalShirt?.id === shirt.id) setModalShirt(null);
                      }}
                      className="text-slate-500 hover:text-rose-400 p-1"
                      title="Hapus Kaos"
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

      {/* MODAL PREVIEW KAOS HIGH RES */}
      {modalShirt && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="font-bold text-white text-sm">{modalShirt.designName}</h4>
              <button
                onClick={() => setModalShirt(null)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 bg-slate-800 rounded-lg"
              >
                ✕ Tutup
              </button>
            </div>

            <div className="rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
              <img src={modalShirt.dataUrl} alt="Kaos Sablon High-Res" className="w-full h-auto" />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>
                Grade: <strong className="text-emerald-400">{modalShirt.grade}</strong> ({modalShirt.score}/100)
              </span>
              <button
                onClick={() => handleDownloadShirt(modalShirt)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg flex items-center gap-1.5"
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
