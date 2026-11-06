export interface TutorialStep {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  targetView: 'generator' | 'saved' | 'vocations' | 'games';
  targetStep?: 1 | 2 | 3;
  actionLabel: string;
  icon: string;
  tips: string[];
}

export interface TutorialSectionContent {
  heading: string;
  paragraphs: string[];
  bulletPoints?: string[];
  callout?: {
    type: 'tip' | 'info' | 'warning' | 'success';
    text: string;
  };
}

export interface TutorialTopic {
  id: string;
  category: 'quickstart' | 'generator' | 'simulations' | 'assessment' | 'ai' | 'storage' | 'faq';
  title: string;
  badge: string;
  summary: string;
  sections: TutorialSectionContent[];
  relatedView?: 'generator' | 'saved' | 'vocations' | 'games';
  tags: string[];
}

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 1,
    title: 'Pilih Bidang Kejuruan & Profesi Target',
    subtitle: 'Langkah Awal Penentuan Kompetensi',
    description:
      'Tentukan konsentrasi keahlian SMK atau profesi industri riil yang ingin disimulasikan, misalnya Teknik Sepeda Motor, Desain Komunikasi Visual, Kriya Tekstil, atau Rekayasa Perangkat Lunak.',
    targetView: 'generator',
    targetStep: 1,
    actionLabel: 'Buka Pemilihan Profesi',
    icon: 'Briefcase',
    tips: [
      'Gunakan kolom pencarian untuk menemukan profesi spesifik.',
      'Setiap profesi telah dipetakan ke Capaian Pembelajaran (CP) Kurikulum Merdeka Kejuruan.',
    ],
  },
  {
    id: 2,
    title: 'Inventarisasi Alat & Bahan di Sekitar Siswa',
    subtitle: 'Prinsip Keterjangkauan & Bahan Daur Ulang',
    description:
      'Centang alat perkakas yang dimiliki siswa di rumah atau bengkel sekolah, serta bahan-bahan daur ulang/bekas pakai yang mudah diperoleh di lingkungan sekitar.',
    targetView: 'generator',
    targetStep: 2,
    actionLabel: 'Isi Inventaris Alat & Bahan',
    icon: 'Wrench',
    tips: [
      'Tambahkan alat atau bahan kustom sesuai kondisi riil daerah masing-masing.',
      'Sistem otomatis mencocokkan substitusi bahan murah dan ramah lingkungan.',
    ],
  },
  {
    id: 3,
    title: 'Pilih Rekomendasi Simulasi Proyek Nyata',
    subtitle: 'Analisis Kesiapan & Rasionalisasi Industri',
    description:
      'Sistem menghitung persentase kesiapan (readiness percentage) dan memberikan rekomendasi proyek purwarupa yang paling relevan dengan alat yang sudah dimiliki.',
    targetView: 'generator',
    targetStep: 3,
    actionLabel: 'Lihat Rekomendasi Proyek',
    icon: 'Sparkles',
    tips: [
      'Prioritaskan proyek dengan persentase kesiapan tinggi untuk praktik langsung.',
      'Simpan proyek menarik ke koleksi ide untuk dipelajari nanti.',
    ],
  },
  {
    id: 4,
    title: 'Jalankan Jobsheet & Unduh Laporan PDF Resmi',
    subtitle: 'Asesmen Kinerja, K3, dan Rubrik Berbobot',
    description:
      'Buka Jobsheet Interaktif untuk memverifikasi langkah kerja SOP, mencatat hasil pengamatan siswa, dan langsung mengunduh Dokumen Laporan Asesmen & Rubrik Penilaian Terstruktur format PDF A4.',
    targetView: 'generator',
    targetStep: 3,
    actionLabel: 'Eksplorasi Jobsheet & PDF',
    icon: 'FileText',
    tips: [
      'Format PDF dilengkapi Kop Surat Resmi, skor 4 dimensi rubrik, dan lembar tanda tangan 3 pihak.',
      'Catatan guru pembimbing dapat diedit langsung sebelum mengunduh berkas PDF.',
    ],
  },
  {
    id: 5,
    title: 'Latihan di Game Simulasi Vokasi 2D',
    subtitle: 'Studio Foto Produk & Sablon Kaos Interaktif',
    description:
      'Uji keterampilan teknis tanpa risiko rusak alat melalui simulator edukatif: Segitiga Eksposur dan 3-Point Lighting pada Foto Produk, serta Sudut Rakel dan Heat Press pada Sablon Kaos.',
    targetView: 'games',
    actionLabel: 'Masuk ke Game Simulasi',
    icon: 'Gamepad2',
    tips: [
      'Segitiga eksposur memandu pengaturan Aperture, Shutter Speed, dan ISO hingga EV seimbang.',
      'Pada sablon kaos, pastikan sudut rakel 65°-75° dan pasang lembaran teflon sebelum heat press.',
    ],
  },
];

export const TUTORIAL_TOPICS: TutorialTopic[] = [
  {
    id: 'quickstart-flow',
    category: 'quickstart',
    title: 'Alur Cepat Penggunaan Aplikasi (4 Langkah)',
    badge: 'Panduan Dasar',
    summary:
      'Panduan ringkas dari awal menentukan profesi SMK hingga menghasilkan laporan asesmen dan rubrik berbobot siap unduh.',
    tags: ['panduan', 'pemula', 'alur', 'quickstart', 'rekomendasi'],
    relatedView: 'generator',
    sections: [
      {
        heading: '1. Pemilihan Profesi / Kejuruan',
        paragraphs: [
          'Aplikasi menyediakan puluhan representasi profesi kejuruan SMK mulai dari Teknik Mesin, Otomotif, DKV, Multimedia/Fotografi, Tata Busana/Kriya, hingga Agribisnis dan RPL.',
          'Pilih salah satu profesi untuk menyesuaikan basis kompetensi dan capaian pembelajaran yang ingin dicapai.',
        ],
      },
      {
        heading: '2. Pemetaan Alat & Bahan Sekitar (Resource Matching)',
        paragraphs: [
          'Keunggulan aplikasi ini adalah merancang purwarupa kejuruan dari alat sederhana dan bahan substitusi di sekitar siswa tanpa membebani biaya.',
          'Cukup centang alat yang tersedia (misal obeng, gunting, solder, multimeter) dan bahan bekas (seperti busi bekas, botol plastik, kain sisa, kardus kemasan).',
        ],
        bulletPoints: [
          'Fitur "Tambah Alat/Bahan Mandiri" memungkinkan input fleksibel.',
          'Algoritma cerdas mencocokkan sinonim nama perkakas secara otomatis.',
        ],
      },
      {
        heading: '3. Memilih Proyek & Menjalankan Jobsheet',
        paragraphs: [
          'Pilih proyek yang memiliki indikator "Kesiapan Tinggi". Buka tombol "Buka Jobsheet & Laporan" untuk menjalankan SOP interaktif.',
        ],
      },
      {
        heading: '4. Mengunduh Laporan Asesmen PDF Terstruktur',
        paragraphs: [
          'Pada tab Laporan Asesmen, periksa persentase keberhasilan praktikan, sesuaikan catatan guru pengamat, dan klik "Unduh Laporan PDF" untuk mengunduh dokumen resmi langsung ke browser.',
        ],
        callout: {
          type: 'success',
          text: 'Berkas PDF langsung tersimpan di komputer/ponsel Anda tanpa perlu membuka dialog cetak (print window).',
        },
      },
    ],
  },
  {
    id: 'photo-game-guide',
    category: 'simulations',
    title: 'Panduan Simulasi 2D: Fotografi Produk Komersial',
    badge: 'Game Simulasi',
    summary:
      'Memahami mekanik Segitiga Eksposur (Aperture, Shutter Speed, ISO) dan Pencahayaan 3 Titik (Key, Fill, Rim Light).',
    tags: ['game', 'foto', 'kamera', 'segitiga eksposur', 'iso', 'aperture', 'shutter', 'lighting'],
    relatedView: 'games',
    sections: [
      {
        heading: 'Konsep Segitiga Eksposur (Exposure Triangle)',
        paragraphs: [
          'Simulator ini mengajarkan hubungan fisika optik antara tiga elemen kamera untuk mencapai Exposure Value (EV) seimbang (0 EV):',
        ],
        bulletPoints: [
          'Aperture (Diafragma/f-stop): f/1.8 menghasilkan efek bokeh (latar buram), f/8.0 menghasilkan ketajaman menyeluruh pada produk komersial.',
          'Shutter Speed (Kecepatan Rana): Semakin cepat (misal 1/500s) mencegah blur, namun membutuhkan cahaya lebih kuat. Kecepatan lambat (<1/60s) membutuhkan tripod.',
          'ISO (Sensitivitas Sensor): ISO 100 menghasilkan gambar bersih tanpa noise. ISO tinggi (>1600) menambah kecerahan namun menimbulkan bintik noise.',
        ],
      },
      {
        heading: 'Sistem Pencahayaan Studio (3-Point Lighting)',
        paragraphs: [
          'Atur tiga sumber cahaya studio untuk menghasilkan gradasi dimensi produk yang menarik:',
        ],
        bulletPoints: [
          'Key Light: Cahaya utama pembentuk karakter dan bayangan produk.',
          'Fill Light: Cahaya pengisi untuk melembutkan bayangan pekat pada sisi berlawanan.',
          'Rim / Back Light: Cahaya aksen di belakang produk untuk memisahkan produk dari latar belakang.',
        ],
        callout: {
          type: 'tip',
          text: 'Pilihlah preset tripod saat menggunakan kecepatan rana lambat agar bidikan foto tidak goyang (camera shake).',
        },
      },
    ],
  },
  {
    id: 'screen-printing-guide',
    category: 'simulations',
    title: 'Panduan Simulasi 2D: Sablon Kaos & Heat Press',
    badge: 'Game Simulasi',
    summary:
      'Teknik menggesut tinta sablon tekstil, sudut kemiringan rakel, pelapisan teflon, dan curing mesin heat press.',
    tags: ['sablon', 'kaos', 'rakel', 'gesut', 'heat press', 'plastisol', 'rubber', 'kriya tekstil'],
    relatedView: 'games',
    sections: [
      {
        heading: 'Mekanik Gesut Rakel (Squeegee Technique)',
        paragraphs: [
          'Keberhasilan sablon manual ditentukan oleh sudut rakel dan tekanan gesutan tangan praktikan:',
        ],
        bulletPoints: [
          'Sudut Ideal: 65° hingga 75°. Sudut terlalu tegak (>80°) menyebabkan tinta tembus tipis, sedangkan sudut terlalu landai (<50°) menumpuk tinta secara berlebihan (bleeding).',
          'Tekanan Gesutan: Pertahankan tekanan sedang-stabil agar tinta turun merata menembus pori-pori kain saring screen.',
          'Pemilihan Jenis Tinta: Tinta Plastisol membutuhkan pemanasan tinggi (160-170°C), sedangkan Rubber (water-based) cukup pada suhu sedang.',
        ],
      },
      {
        heading: 'Proses Pematangan Heat Press (Curing)',
        paragraphs: [
          'Setelah tinta tercetak di kaos, lakukan pengeringan dan pematangan serat menggunakan mesin heat press:',
        ],
        bulletPoints: [
          'Wajib Gunakan Lembaran Teflon (Teflon Sheet): Mencegah tinta basah menempel dan merusak plat pemanas mesin.',
          'Suhu Ideal: 160°C - 170°C selama 12 - 15 detik untuk tinta plastisol.',
          'Peringatan Suhu Tinggi: Suhu di atas 185°C berisiko membuat kain katun hangus (scorched).',
        ],
        callout: {
          type: 'warning',
          text: 'Jangan pernah menekan mesin heat press tanpa lembaran teflon saat tinta sablon masih basah!',
        },
      },
    ],
  },
  {
    id: 'assessment-pdf-guide',
    category: 'assessment',
    title: 'Struktur Laporan Asesmen & Rubrik PDF Resmi',
    badge: 'Asesmen & Regulasi',
    summary:
      'Penjelasan komponen laporan asesmen A4, indikator persentase keberhasilan, 4 dimensi rubrik, dan legalitas tanda tangan.',
    tags: ['asesmen', 'rubrik', 'pdf', 'laporan', 'k3', 'skor', 'unduh', 'kurikulum merdeka'],
    relatedView: 'generator',
    sections: [
      {
        heading: '4 Dimensi Rubrik Penilaian Berbobot',
        paragraphs: [
          'Format laporan telah distandardisasi sesuai asesmen kinerja Kurikulum Merdeka Kejuruan dan LSP-P1:',
        ],
        bulletPoints: [
          '1. K3 & Sikap Kerja (Bobot 20%): Kepatuhan APD, ketertiban area kerja, keselamatan alat, dan penanganan limbah praktikum.',
          '2. Prosedur & Proses Praktik (Bobot 40%): Ketepatan urutan langkah kerja SOP, penggunaan perkakas secara presisi, dan kemandirian.',
          '3. Mutu Hasil Produk / Deliverable (Bobot 30%): Ketepatan ukuran, fungsi teknis produk, kerapian, dan kekuatan fisik purwarupa.',
          '4. Efisiensi Waktu & Dokumentasi (Bobot 10%): Ketepatan alokasi jam praktik dan kelengkapan catatan hasil pengamatan.',
        ],
      },
      {
        heading: 'Kop Surat Kedinasan & Lembar Pengesahan Tiga Pihak',
        paragraphs: [
          'Dokumen yang diunduh langsung ke browser memuat:',
        ],
        bulletPoints: [
          'Kop resmi instansi sekolah dan nomor registrasi verifikasi sistem.',
          'Data identitas praktikan dan nama proyek yang diselaraskan dengan Lencana Kompetensi.',
          'Kolom catatan pengamatan guru pembimbing yang dapat diedit langsung di layar sebelum berkas diunduh.',
          'Tanda tangan 3 pihak: Siswa Praktikan (NISN), Guru Penguji (NIP), dan Ketua Konsentrasi Keahlian SMK.',
        ],
      },
    ],
  },
  {
    id: 'ai-generator-guide',
    category: 'ai',
    title: 'Merancang Ide Proyek Baru dengan AI Gemini',
    badge: 'AI Cerdas',
    summary:
      'Cara memanfaatkan Gemini API untuk menghasilkan purwarupa kejuruan inovatif berbasis tantangan lokal daerah.',
    tags: ['ai', 'gemini', 'rancang', 'generator', 'inovasi', 'kreatif'],
    sections: [
      {
        heading: 'Kapan Menggunakan Fitur Rancang AI?',
        paragraphs: [
          'Gunakan studio perancang AI jika sekolah atau siswa memiliki kombinasi alat dan bahan yang unik (misalnya: limbah tempurung kelapa, bambu, komponen CPU lama, sisa kain tenun lokal) dan membutuhkan ide proyek purwarupa yang relevan dengan standar industri.',
        ],
      },
      {
        heading: 'Langkah Merancang dengan AI',
        paragraphs: [
          'Klik tombol "Rancang AI" di pojok kanan atas navbar.',
          'Pilih fokus proyek (misal: alat ramah lingkungan, alat peraga sains, kemasan UMKM).',
          'Sistem AI Gemini akan merumuskan judul proyek, deliverable, estimasi jam, SOP langkah kerja, protokol K3, dan lencana kompetensi yang dapat langsung disimulasikan.',
        ],
      },
    ],
  },
  {
    id: 'faq-tips',
    category: 'faq',
    title: 'Tanya Jawab & Tips Praktis Penggunaan (FAQ)',
    badge: 'Tanya Jawab',
    summary:
      'Solusi kendala teknis, penyimpanan data, integrasi perangkat, dan adaptasi pembelajaran di kelas.',
    tags: ['faq', 'tanya jawab', 'kendala', 'tips', 'guru', 'offline', 'kuota'],
    sections: [
      {
        heading: 'Apakah aplikasi ini dapat digunakan secara hemat kuota / offline?',
        paragraphs: [
          'Ya. Seluruh logika algoritma pencocokan proyek, simulasi game 2D, generator jobsheet, dan pembuatan berkas PDF berjalan langsung di peramban (client-side) tanpa memerlukan koneksi internet tinggi.',
          'Penyimpanan kemajuan siswa otomatis tersimpan di LocalStorage peramban dan sinkron dengan server database.',
        ],
      },
      {
        heading: 'Bagaimana cara guru membagikan tugas ke siswa?',
        paragraphs: [
          'Guru dapat merekomendasikan profesi tertentu kepada siswa, meminta siswa mendata alat di rumah masing-masing, lalu siswa mengunduh file Laporan Asesmen PDF untuk dikumpulkan ke Google Classroom atau WhatsApp guru.',
        ],
      },
      {
        heading: 'Mengapa tombol unduh PDF tidak membuka jendela print?',
        paragraphs: [
          'Sesuai kebutuhan guru agar praktis di perangkat mobile maupun laptop, tombol unduh langsung memicu berkas PDF berekstensi .pdf ke folder Downloads perangkat Anda secara instan dan rapi.',
        ],
      },
    ],
  },
];

/**
 * Filter topics based on search query
 */
export function searchTutorialTopics(topics: TutorialTopic[], query: string): TutorialTopic[] {
  const q = query.trim().toLowerCase();
  if (!q) return topics;

  return topics.filter((t) => {
    const inTitle = t.title.toLowerCase().includes(q);
    const inSummary = t.summary.toLowerCase().includes(q);
    const inTags = t.tags.some((tag) => tag.toLowerCase().includes(q));
    const inSections = t.sections.some(
      (sec) =>
        sec.heading.toLowerCase().includes(q) ||
        sec.paragraphs.some((p) => p.toLowerCase().includes(q)) ||
        (sec.bulletPoints && sec.bulletPoints.some((b) => b.toLowerCase().includes(q)))
    );

    return inTitle || inSummary || inTags || inSections;
  });
}

/**
 * Filter topics by category
 */
export function getTutorialTopicsByCategory(
  topics: TutorialTopic[],
  category: string
): TutorialTopic[] {
  if (category === 'all') return topics;
  return topics.filter((t) => t.category === category);
}

/**
 * Get step by index with boundary safety
 */
export function getStepByIndex(steps: TutorialStep[], index: number): TutorialStep | undefined {
  if (index < 0 || index >= steps.length) return undefined;
  return steps[index];
}
