import { RecommendedProject } from '../types/recommender';

export interface AiGenerationRequest {
  targetProfession: string;
  availableTools: string[];
  availableMaterials: string[];
  focusOption?: string;
  difficulty?: 'Mudah' | 'Sedang' | 'Menantang';
  customNotes?: string;
}

/**
 * Mensintesis proyek simulasi kejuruan representatif yang cerdas secara deterministik
 * bila koneksi ke cloud LLM sedang lambat, terputus, atau kehabisan kuota jaringan.
 */
export function synthesizeVocationalProject(req: AiGenerationRequest): RecommendedProject {
  const profession = req.targetProfession.trim();
  const tools = req.availableTools.length > 0 ? req.availableTools : ['Peralatan Tangan Dasar', 'Penggaris', 'Gunting'];
  const materials = req.availableMaterials.length > 0 ? req.availableMaterials : ['Bahan sisa', 'Kardus bekas', 'Kertas'];
  const diff = req.difficulty || 'Mudah';
  const focus = req.focusOption || 'Standar Kejuruan SMK';

  const title = `Simulasi Terapan: Praktik Representatif ${profession} Berbasis Sumber Daya Sekitar`;
  
  const rationale = `Proyek ini dirancang secara khusus untuk mensimulasikan tugas nyata dari seorang praktisi ${profession}. Dengan memanfaatkan peralatan (${tools.slice(0, 3).join(', ')}) dan bahan baku (${materials.slice(0, 3).join(', ')}) yang ada di sekitar siswa, siswa dapat menguasai logika kerja inti, prosedur keselamatan kerja (K3), dan standar hasil yang dipersyaratkan di industri nyata.`;

  const estimatedHours = diff === 'Mudah' ? '1-2 Jam' : diff === 'Sedang' ? '2-3 Jam' : '3-4 Jam';

  const toolsUsed = tools.slice(0, 5).map((t) => ({
    name: t,
    available: true,
  }));

  const materialsUsed = materials.slice(0, 5).map((m) => ({
    name: m,
    quantity: 'Secukupnya',
    available: true,
  }));

  const coreCompetenciesLearned = [
    `Memahami diagram alur dan metodologi kerja standar profesi ${profession}`,
    `Pengoperasian dan perawatan perkakas kerja (${tools[0] || 'alat kerja'}) secara aman`,
    `Analisis kualitas bahan baku dan substitusi kreatif sumber daya lokal`,
    `Pengendalian mutu hasil karya (Quality Control) dan dokumentasi jobsheet`,
  ];

  const deliverable = `Purwarupa / Produk simulasi hasil pengerjaan tangan mandiri yang membuktikan fungsi kerja dasar bidang ${profession}.`;

  const safetyProtocols = [
    'Gunakan Alat Pelindung Diri (APD) standar: sarung tangan kerja dan kacamata pelindung bila diperlukan',
    'Pastikan area kerja memiliki sirkulasi udara baik dan bebas dari benda berbahaya',
    'Rapikan dan simpan kembali seluruh perkakas setelah simulasi selesai dilakukan',
  ];

  const steps = [
    {
      stepNumber: 1,
      title: 'Pemeriksaan Alat, Bahan & Penerapan K3',
      instruction: `Periksa kondisi fisik ${tools.slice(0, 2).join(' dan ')}. Pastikan ${materials.slice(0, 2).join(' dan ')} dalam keadaan bersih dan siap diproses sesuai standar keselamatan kerja profesi ${profession}.`,
      safetyTip: 'Gunakan alas kerja pelindung agar meja tidak rusak dan rapikan jalur kabel/perkakas tajam.',
      checkpoint: 'Seluruh alat dan bahan terverifikasi siap dan APD telah dikenakan dengan benar.',
    },
    {
      stepNumber: 2,
      title: 'Pengukuran, Pola & Persiapan Komponen Utama',
      instruction: `Lakukan penandaan, pemotongan, atau pengukuran awal pada ${materials[0] || 'bahan utama'} menggunakan ${tools[0] || 'alat ukur/potong'}. Sesuaikan dimensi dengan sketsa kerja yang direncanakan.`,
      safetyTip: 'Terapkan prinsip "Ukur dua kali, potong sekali" untuk meminimalkan limbah bahan.',
      checkpoint: 'Komponen awal terpotong rapi dengan toleransi ukuran yang presisi.',
    },
    {
      stepNumber: 3,
      title: 'Perakitan, Sambungan & Pengujian Parsial',
      instruction: `Rangkai atau olah ${materials.slice(0, 3).join(', ')} menggunakan ${tools.slice(0, 2).join(' dan ')}. Sambungkan setiap bagian dengan kuat dan pastikan sambungan kokoh sesuai standar kejuruan.`,
      safetyTip: 'Pastikan posisi tubuh ergonomis saat melakukan perakitan berulang.',
      checkpoint: 'Rangkaian komponen utama tersambung kuat tanpa ada bagian yang longgar.',
    },
    {
      stepNumber: 4,
      title: 'Pengujian Fungsi Akhir, Finishing & Analisis Portofolio',
      instruction: `Lakukan uji fungsi akhir menyeluruh terhadap purwarupa. Catat parameter hasil pengujian pada lembar pengamatan siswa dan bandingkan dengan standar kerja industri ${profession}.`,
      safetyTip: 'Lakukan pembersihan area kerja (5R/5S) setelah seluruh pengujian selesai.',
      checkpoint: 'Hasil simulasi berfungsi normal dan lembar evaluasi kompetensi terisi lengkap.',
    },
  ];

  const badgeEarned = `Inovator Muda ${profession}`;

  return {
    id: `sim-ai-${Date.now()}`,
    title,
    targetProfession: profession,
    representationRationale: rationale,
    difficulty: diff,
    estimatedHours,
    toolsUsed,
    materialsUsed,
    alternativeMaterialsSuggested: [
      'Gunakan barang daur ulang (kardus tebal, botol bekas, atau kayu sisa) bila membutuhkan rangka tambahan.',
      'Bila perkakas listrik tidak ada, gunakan perkakas tangan manual secara bertahap dan teliti.',
    ],
    readinessPercentage: 95,
    coreCompetenciesLearned,
    deliverable,
    safetyProtocols,
    badgeEarned,
    steps,
  };
}

import { PrototypeKitRecommendation, RecommendedToolItem, RecommendedMaterialItem } from '../types/recommender';

export interface PrototypeKitRequest {
  targetProfession: string;
  prototypeMode?: 'standard' | 'recycled' | 'commercial';
  customNotes?: string;
}

export function synthesizePrototypeKit(req: PrototypeKitRequest): PrototypeKitRecommendation {
  const profession = req.targetProfession.trim() || 'Teknik Terapan SMK';
  const mode = req.prototypeMode || 'standard';
  const norm = profession.toLowerCase();

  // TITL / Listrik
  if (norm.includes('listrik') || norm.includes('titl') || norm.includes('instalasi')) {
    const isRecycled = mode === 'recycled';
    return {
      targetProfession: profession,
      prototypeTitle: isRecycled
        ? 'Purwarupa Trainer Miniatur Instalasi Rumah Berbahan Papan Bekas & Kabel Daur Ulang'
        : 'Purwarupa Trainer Instalasi Penerangan 2 Titik Lampu dengan Saklar Seri & Pengaman',
      prototypeRationale:
        'Purwarupa ini merepresentasikan tugas mendasar teknisi kelistrikan gedung/rumah: merancang denah jalur kabel fasa-netral, memasang terminal saklar pemutus arus, dan menguji kontinuitas beban listrik tanpa resiko tegangan tinggi.',
      difficulty: 'Mudah',
      estimatedHours: '2-3 Jam',
      deliverable: 'Papan peraga trainer sirkuit penerangan miniatur yang berfungsi normal menyala aman.',
      coreCompetencies: [
        'Membaca dan merangkai diagram pengawatan instalasi penerangan tunggal/seri',
        'Teknik pengupasan isolasi kabel dan terminasi baut saklar berstandar PUIL',
        'Pengujian kontinuitas rangkaian dan proteksi keselamatan arus pendek (K3 Listrik)',
      ],
      tools: [
        {
          id: 't-1',
          name: 'Tespen Indikator Tegangan',
          role: 'Memeriksa kehadiran aliran arus listrik dan fasa rangkaian secara visual',
          isCritical: true,
          lowCostAlternative: 'Multimeter analog murah atau LED indikator baterai 9V untuk uji sirkuit aman',
          available: true,
        },
        {
          id: 't-2',
          name: 'Tang Kombinasi / Pengupas Kabel',
          role: 'Mengupas ujung isolasi tembaga kabel dan membengkokkan kawat terminal',
          isCritical: true,
          lowCostAlternative: 'Gunting dapur atau cutter tajam (dikupas berhati-hati melingkar)',
          available: true,
        },
        {
          id: 't-3',
          name: 'Obeng Plus & Minus (Set Obeng)',
          role: 'Mengencangkan sekrup pengunci kabel pada fitting lampu dan terminal saklar',
          isCritical: true,
          lowCostAlternative: 'Obeng bolak-balik serbaguna rumah tangga',
          available: true,
        },
        {
          id: 't-4',
          name: 'Penggaris & Pensil Penanda',
          role: 'Menentukan tata letak layout miniatur saklar dan lampu pada papan alas',
          isCritical: false,
          lowCostAlternative: 'Penggaris plastik anak sekolah 30 cm',
          available: true,
        },
      ],
      materials: [
        {
          id: 'm-1',
          name: 'Papan Kayu / Triplek / Kardus Tebal (30x40 cm)',
          quantity: '1 lembar',
          role: 'Media dudukan sirkuit peraga miniatur instalasi dinding',
          recycledAlternative: 'Kardus bekas kemasan barang elektronik atau potongan triplek sisa bangunan',
          available: true,
        },
        {
          id: 'm-2',
          name: 'Kabel Kawat / Kabel Listrik Rumah (NYA / NYM)',
          quantity: '2-3 meter',
          role: 'Konduktor penghubung fasa dan netral antar komponen saklar dan lampu',
          recycledAlternative: 'Potongan kabel sisa instalasi lama rumah atau kabel kawat jumper',
          available: true,
        },
        {
          id: 'm-3',
          name: 'Saklar Seri (Ganda) atau Saklar Tunggal',
          quantity: '1 unit',
          role: 'Komponen kendali on/off pemutus fasa titik lampu',
          recycledAlternative: 'Saklar bekas rumah yang masih layak pakai atau saklar geser toggle kecil',
          available: false,
        },
        {
          id: 'm-4',
          name: 'Fitting Lampu Tempel & Bohlam Mini (3-5 Watt atau LED Baterai)',
          quantity: '2 set',
          role: 'Beban penerangan untuk menguji keberhasilan aliran sirkuit',
          recycledAlternative: 'Lampu LED mini 5V/12V atau bohlam senter kecil dengan baterai 9V',
          available: false,
        },
        {
          id: 'm-5',
          name: 'Isolasi Listrik PVC (Electrical Tape)',
          quantity: '1 rol kecil',
          role: 'Menutup sambungan kawat terbuka agar terisolasi rapi dan aman',
          recycledAlternative: 'Selotip tebal atau heat-shrink tubing bila tersedia',
          available: true,
        },
      ],
      safetyTips: [
        'Lakukan perakitan seluruh komponen dalam keadaan sirkuit TIDAK terhubung ke sumber daya.',
        'Gunakan baterai DC (9V atau adaptor 12V aman) untuk uji coba awal bagi siswa pemula sebelum mencoba tegangan 220V berpanduan guru.',
        'Pastikan tidak ada serabut tembaga kabel yang keluar dari terminal baut.',
      ],
      isAiGenerated: true,
      modelUsed: 'Sintesis Kurikulum Vokasi SMK',
    };
  }

  // TBSM / Otomotif
  if (norm.includes('otomotif') || norm.includes('tbsm') || norm.includes('motor') || norm.includes('mesin') || norm.includes('tkro')) {
    return {
      targetProfession: profession,
      prototypeTitle: 'Purwarupa Meja Uji Celah & Percikan Busi serta Kelistrikan Lampu Sein Motor',
      prototypeRationale:
        'Merepresentasikan tugas pokok mekanik bengkel otomotif: diagnosis sistem pengapian motor, pembersihan deposit karbon elektroda busi, dan penyetelan celah presisi (spark plug gap) yang menentukan efisiensi pembakaran mesin.',
      difficulty: 'Mudah',
      estimatedHours: '1-2 Jam',
      deliverable: 'Busi terkalibrasi celah presisi 0.7mm siap pakai dan modul peraga simulasi kedip sein 12V.',
      coreCompetencies: [
        'Mendiagnosis kondisi pembakaran mesin melalui warna elektroda busi',
        'Teknik pembersihan elektroda karbon tanpa merusak keramik isolator',
        'Pengukuran toleransi celah busi sesuai spesifikasi pabrikan manual bengkel',
      ],
      tools: [
        {
          id: 't-1',
          name: 'Kunci Busi Motor (16mm / 21mm)',
          role: 'Melepas dan memasang busi dengan torsi yang tepat pada blok silinder',
          isCritical: true,
          lowCostAlternative: 'Kunci pas/ring ukuran 16mm atau pinjam kunci busi bawaan bagasi motor',
          available: true,
        },
        {
          id: 't-2',
          name: 'Sikat Kawat Kecil / Kertas Ampelas Halus (Grit 400-800)',
          role: 'Membersihkan jelaga hitam deposit sisa pembakaran pada elektroda busi',
          isCritical: true,
          lowCostAlternative: 'Ampelas sisa kayu atau sikat gigi bekas yang dicelup sedikit bensin/alkohol',
          available: true,
        },
        {
          id: 't-3',
          name: 'Feeler Gauge (Bilah Ukur Celah Presisi)',
          role: 'Mengukur ketebalan celah elektroda busi standar 0.70 - 0.80 mm',
          isCritical: false,
          lowCostAlternative: 'Kalibrasi darurat menggunakan bilah silet baru atau kartu ATM plastik (~0.75 mm)',
          available: false,
        },
        {
          id: 't-4',
          name: 'Tang Kombinasi / Tang Lancip',
          role: 'Menyesuaikan tekukan elektroda massa busi secara halus',
          isCritical: false,
          lowCostAlternative: 'Ketukan perlahan pada permukaan kayu datar',
          available: true,
        },
      ],
      materials: [
        {
          id: 'm-1',
          name: 'Busi Bekas Sepeda Motor',
          quantity: '1-2 buah',
          role: 'Objek utama diagnosis, pembersihan deposit, dan penyetelan celah',
          recycledAlternative: 'Minta busi bekas pakai yang sudah diganti dari bengkel motor terdekat sekitar',
          available: true,
        },
        {
          id: 'm-2',
          name: 'Kain Majun / Lap Katun Bersih',
          quantity: '1 lembar',
          role: 'Membersihkan kotoran oli dan mengeringkan ulir busi',
          recycledAlternative: 'Potongan baju kaos katun bekas yang tidak terpakai',
          available: true,
        },
        {
          id: 'm-3',
          name: 'Cairan Pembersih / Bensin / Karburator Cleaner',
          quantity: '50 ml',
          role: 'Melarutkan kerak karbon membandel di sela elektroda inti',
          recycledAlternative: 'Minyak tanah atau cairan alkohol pembersih luka',
          available: true,
        },
      ],
      safetyTips: [
        'Hindari menyalakan api atau merokok saat menggunakan bensin/cairan pembersih mudah terbakar.',
        'Jangan memukul elektroda busi terlalu keras agar keramik isolator tidak retak di dalam.',
      ],
      isAiGenerated: true,
      modelUsed: 'Sintesis Kurikulum Vokasi SMK',
    };
  }

  // TKJ / Jaringan
  if (norm.includes('tkj') || norm.includes('jaringan') || norm.includes('komputer') || norm.includes('it') || norm.includes('wifi')) {
    return {
      targetProfession: profession,
      prototypeTitle: 'Purwarupa Kabel Jaringan UTP Straight-Through & Modul Hotspot Router Praktik',
      prototypeRationale:
        'Merepresentasikan kompetensi inti Teknisi Jaringan Komputer: pengurutan 8 kode warna standar TIA/EIA-568B, terminasi crimping konektor RJ45 presisi, dan uji konektivitas LAN bebas packet-loss.',
      difficulty: 'Mudah',
      estimatedHours: '1-2 Jam',
      deliverable: 'Kabel jaringan LAN Cat5e/6 teruji 100% lulus 8 pin dan siap menghubungkan perangkat ke internet.',
      coreCompetencies: [
        'Menghafal urutan warna standar pengkabelan internasional T568B',
        'Teknik pemotongan dan perataan 8 inti kawat kabel UTP',
        'Diagnosis kontinuitas dan troubleshooting koneksi pin kabel jaringan',
      ],
      tools: [
        {
          id: 't-1',
          name: 'Tang Crimping RJ45',
          role: 'Mengunci pin tembaga konektor RJ45 ke inti kabel tembaga secara serempak',
          isCritical: true,
          lowCostAlternative: 'Pinjam tang crimping lab sekolah atau tekan pin dengan obeng minus presisi kecil perlahan',
          available: false,
        },
        {
          id: 't-2',
          name: 'Tang Potong Kecil / Gunting Kabel Presisi',
          role: 'Memotong lurus rata ujung 8 kawat sebelum dimasukkan ke dalam kepala konektor',
          isCritical: true,
          lowCostAlternative: 'Gunting kuku stainless tajam (sangat lurus dan presisi)',
          available: true,
        },
        {
          id: 't-3',
          name: 'LAN Cable Tester',
          role: 'Menguji kedipan lampu berurutan dari nomor 1 sampai 8 untuk memastikan kabel berfungsi',
          isCritical: false,
          lowCostAlternative: 'Uji langsung tancapkan dari port router Wi-Fi ke port LAN laptop/PC (lihat lampu indikator port menyala)',
          available: false,
        },
      ],
      materials: [
        {
          id: 'm-1',
          name: 'Kabel UTP Cat5e / Cat6',
          quantity: '1.5 - 2 meter',
          role: 'Media transmisi data kabel jaringan 8 inti',
          recycledAlternative: 'Potongan kabel LAN bekas kantor atau sisa kabel pasang Wi-Fi Indihome/Firstmedia',
          available: true,
        },
        {
          id: 'm-2',
          name: 'Konektor RJ45',
          quantity: '4-6 buah',
          role: 'Kepala konektor jack terminal penghubung ke port RJ45',
          recycledAlternative: 'Beli satuan di toko komputer terdekat (~Rp1.500 per biji)',
          available: false,
        },
      ],
      safetyTips: [
        'Hati-hati saat mengupas kulit luar kabel UTP agar 8 kabel isolasi di dalamnya tidak terluka.',
        'Kumpulkan potongan serabut kabel kecil ke wadah sampah agar tidak berserakan.',
      ],
      isAiGenerated: true,
      modelUsed: 'Sintesis Kurikulum Vokasi SMK',
    };
  }

  // Kuliner / Bakery
  if (norm.includes('boga') || norm.includes('kuliner') || norm.includes('bakery') || norm.includes('roti') || norm.includes('makanan')) {
    return {
      targetProfession: profession,
      prototypeTitle: 'Purwarupa Uji Aktivitas Fermentasi Ragi & Adonan Roti Manis Skala Sampel Uji',
      prototypeRationale:
        'Merepresentasikan tugas inti Baker / Wirausaha Kuliner: mengontrol suhu optimal ragi, teknik pembentukan gluten (windowpane test), dan kalkulasi biaya HPP per porsi untuk standardisasi usaha makanan.',
      difficulty: 'Mudah',
      estimatedHours: '2 Jam',
      deliverable: 'Purwarupa sampel adonan roti manis elastis berserat lembut siap panggang serta lembar HPP porsi.',
      coreCompetencies: [
        'Memahami biokimia ragi roti (Saccharomyces cerevisiae) dan fermentasi gula',
        'Teknik pengulian adonan hingga mencapai tingkat kalis elastis',
        'Kalkulasi HPP resep dan pengendalian kebersihan higienitas sanitasi makanan',
      ],
      tools: [
        {
          id: 't-1',
          name: 'Timbangan Digital Dapur / Sendok Takar Presisi',
          role: 'Menakar gramatur tepung, gula, ragi, dan mentega sesuai rasio formula standar',
          isCritical: true,
          lowCostAlternative: 'Gelas ukur takar atau sendok makan takaran standar (1 sdm = ~12-15 gram)',
          available: true,
        },
        {
          id: 't-2',
          name: 'Mangkuk / Wadah Kaca Pengaduk (Baskom)',
          role: 'Wadah aktivasi ragi dan fermentasi adonan (proofing)',
          isCritical: true,
          lowCostAlternative: 'Baskom stainless atau mangkuk kaca dapur rumahan',
          available: true,
        },
        {
          id: 't-3',
          name: 'Kain Lap / Plastik Wrap Penutup Mangkuk',
          role: 'Menjaga kelembapan suhu adonan saat proses pengembangan ragi',
          isCritical: false,
          lowCostAlternative: 'Serbet kain bersih yang dibasahi sedikit air hangat',
          available: true,
        },
      ],
      materials: [
        {
          id: 'm-1',
          name: 'Tepung Terigu Protein Tinggi (Cakra Kembar)',
          quantity: '250 gram',
          role: 'Bahan pembentuk kerangka gluten yang elastis dan menahan gas ragi',
          recycledAlternative: 'Tepung terigu serbaguna (segitiga) bila tidak ada protein tinggi',
          available: true,
        },
        {
          id: 'm-2',
          name: 'Ragi Roti Instan (Instant Yeast / Fermipan)',
          quantity: '1 sendok teh (4 gram)',
          role: 'Mikroorganisme fermentasi penghasil gas karbon dioksida pengembang roti',
          recycledAlternative: 'Beli sachet ragi sachet kecil di warung terdekat (~Rp4.000)',
          available: false,
        },
        {
          id: 'm-3',
          name: 'Gula Pasir & Air Hangat (Suhu Ruang ~35°C)',
          quantity: '25 gram gula & 120 ml air',
          role: 'Nutrisi pemicu pertumbuhan ragi dan cairan pengikat adonan',
          recycledAlternative: 'Gula pasir dapur dan air hangat kuku biasa',
          available: true,
        },
        {
          id: 'm-4',
          name: 'Margarin / Mentega & Garam Sejumput',
          quantity: '20 gram',
          role: 'Pelembut tekstur serat roti dan penyeimbang cita rasa gurih',
          recycledAlternative: 'Margarin sachet dapur rumahan (Blueband)',
          available: true,
        },
      ],
      safetyTips: [
        'Cuci tangan dengan sabun sesuai 6 langkah WHO sebelum menyentuh adonan makanan.',
        'Jangan gunakan air terlalu panas (di atas 45°C) karena ragi akan mati dan gagal mengembang.',
      ],
      isAiGenerated: true,
      modelUsed: 'Sintesis Kurikulum Vokasi SMK',
    };
  }

  // Pertanian / Hidroponik
  if (norm.includes('tani') || norm.includes('hidroponik') || norm.includes('agribisnis') || norm.includes('tanaman')) {
    return {
      targetProfession: profession,
      prototypeTitle: 'Purwarupa Modul Hidroponik Botol Bekas Sistem Sumbu (Wick System) Mandiri',
      prototypeRationale:
        'Merepresentasikan keahlian praktisi Modern Agriculture / Urban Farming: pemanfaatan ruang sempit, sirkulasi larutan kapilaritas nutrisi tanpa pompa listrik, dan monitoring media tumbuh tanaman sayur cepat panen.',
      difficulty: 'Mudah',
      estimatedHours: '1-2 Jam',
      deliverable: '1 unit modul hidroponik botol sumbu lengkap dengan media semai rockwool/spons dan bibit siap tumbuh.',
      coreCompetencies: [
        'Memahami mekanisme kapilaritas sumbu dalam menghantarkan larutan hara ke akar',
        'Teknik penyemaian benih sayuran pada media porous',
        'Pemanfaatan limbah plastik sekali pakai menjadi sarana produksi pangan bernilai ekonomis',
      ],
      tools: [
        {
          id: 't-1',
          name: 'Gunting / Cutter Tajam',
          role: 'Memotong botol plastik menjadi 2 bagian (corong atas dan wadah tandon bawah)',
          isCritical: true,
          lowCostAlternative: 'Gunting dapur tajam atau pisau kecil yang dipanaskan sedikit',
          available: true,
        },
        {
          id: 't-2',
          name: 'Paku / Solder Panas',
          role: 'Membuat lubang drainase dan lubang sumbu pada tutup botol plastik',
          isCritical: true,
          lowCostAlternative: 'Paku besi yang dipegang dengan tang lalu dipanaskan di atas kompor/lilin',
          available: true,
        },
        {
          id: 't-3',
          name: 'Penggaris 30cm',
          role: 'Mengukur batas ketinggian air nutrisi pada tandon agar akar tetap mendapat aerasi oksigen',
          isCritical: false,
          lowCostAlternative: 'Penggaris biasa atau penanda spidol permanen',
          available: true,
        },
      ],
      materials: [
        {
          id: 'm-1',
          name: 'Botol Plastik Bekas Air Mineral (1.5 Liter)',
          quantity: '1-2 botol',
          role: 'Bodi utama modul hidroponik (wadah nutrisi dan pot tanaman)',
          recycledAlternative: 'Botol bekas minuman atau cup minuman boba ukuran besar',
          available: true,
        },
        {
          id: 'm-2',
          name: 'Kain Flanel Sumbu (Lebar 2 cm, Panjang 15 cm)',
          quantity: '1 helai',
          role: 'Sumbu kapilaritas yang mengisap air nutrisi dari bawah ke atas media akar',
          recycledAlternative: 'Potongan kain katun tebal sisa kaos, tali pel lantai bersih, atau kain perca',
          available: true,
        },
        {
          id: 'm-3',
          name: 'Media Tanam Porous (Spons Cuci Piring / Rockwool)',
          quantity: '1 kubus (2.5x2.5 cm)',
          role: 'Penopang batang semai benih agar tetap berdiri tegak',
          recycledAlternative: 'Spons busa cuci piring baru yang dipotong dadu atau serabut kelapa bersih',
          available: true,
        },
        {
          id: 'm-4',
          name: 'Benih Sayuran Daun Cepat Tumbuh (Kangkung / Pakcoy / Selada)',
          quantity: '5-10 butir benih',
          role: 'Tanaman yang diuji coba kecepatan pertumbuhan sistem hidroponik',
          recycledAlternative: 'Benih kangkung warung atau batang kangkung dapur sisa masak',
          available: false,
        },
        {
          id: 'm-5',
          name: 'Nutrisi Tanaman (AB Mix atau Pupuk NPK Cair Sederhana)',
          quantity: '500 ml larutan',
          role: 'Suplai mineral makro dan mikro bagi fotosintesis daun',
          recycledAlternative: 'Larutan pupuk organik cair buatan sendiri (air cucian beras + gula) atau 1 gram NPK larut air',
          available: false,
        },
      ],
      safetyTips: [
        'Hati-hati saat memotong tepi botol plastik agar tidak tajam melukai jari.',
        'Simpan modul di tempat yang terkena sinar matahari pagi minimal 4-6 jam sehari.',
      ],
      isAiGenerated: true,
      modelUsed: 'Sintesis Kurikulum Vokasi SMK',
    };
  }

  // DKV / Desain Sablon
  if (norm.includes('dkv') || norm.includes('desain') || norm.includes('sablon') || norm.includes('grafika') || norm.includes('foto')) {
    return {
      targetProfession: profession,
      prototypeTitle: 'Purwarupa Mini Lightbox Studio Foto Produk & Sablon Stensil Kaos Manual',
      prototypeRationale:
        'Merepresentasikan tugas pokok Desainer Grafis & Industri Kreatif: perancangan template stensil pola vector, teknik cetak rintang manual (stencil screen printing), dan pencahayaan studio untuk katalog promosi komersial.',
      difficulty: 'Mudah',
      estimatedHours: '2-3 Jam',
      deliverable: '1 unit mini lightbox fotografi produk berkardus dan 1 sampel sablon stensil pada kain/tote bag.',
      coreCompetencies: [
        'Prinsip komposisi fotografi produk dan refleksi cahaya difusi studio',
        'Teknik stensil pola pisau cutter presisi untuk sablon manual',
        'Pemilihan media cetak dan ketahanan pigmen warna pada serat kain',
      ],
      tools: [
        {
          id: 't-1',
          name: 'Cutter Presisi (Pen Cutter / Cutter Tajam)',
          role: 'Memotong detail pola stensil desain logo/huruf pada kertas rintang',
          isCritical: true,
          lowCostAlternative: 'Cutter standar dengan mata pisau baru yang dipatahkan ujungnya agar runcing',
          available: true,
        },
        {
          id: 't-2',
          name: 'Gunting & Penggaris Besi',
          role: 'Mengukur dan memotong jendela pencahayaan pada bodi kardus lightbox',
          isCritical: true,
          lowCostAlternative: 'Penggaris plastik tebal dan gunting rumah biasa',
          available: true,
        },
        {
          id: 't-3',
          name: 'Spons Cuci Piring / Kuas Busa / Rakel Miniatur',
          role: 'Alat penepuk (dabbing) cat akrilik agar merata menembus lubang pola stensil',
          isCritical: true,
          lowCostAlternative: 'Potongan spons cuci piring kering bersih',
          available: true,
        },
        {
          id: 't-4',
          name: 'Kamera Smartphone & Lampu Meja Belajar',
          role: 'Pencahayaan luar dan pengambilan foto portofolio hasil karya',
          isCritical: false,
          lowCostAlternative: 'Senter handphone teman atau sinar matahari pagi dekat jendela',
          available: true,
        },
      ],
      materials: [
        {
          id: 'm-1',
          name: 'Kardus Bekas Ukuran Sedang (Kotak Sepatu / Mie Instan)',
          quantity: '1 buah',
          role: 'Bodi rangka kubus mini lightbox studio foto produk',
          recycledAlternative: 'Kardus bekas mie instan atau kardus paket belanja online',
          available: true,
        },
        {
          id: 'm-2',
          name: 'Kertas HVS Putih atau Kertas Kalkir/Mika Tipis',
          quantity: '3-4 lembar',
          role: 'Difuser cahaya lembut di jendela kardus dan media pemotongan pola stensil',
          recycledAlternative: 'Kertas HVS bekas yang masih bersih satu sisinya atau plastik mika jilid',
          available: true,
        },
        {
          id: 'm-3',
          name: 'Cat Akrilik / Cat Tekstil Sablon',
          quantity: '1 botol kecil (warna kontras)',
          role: 'Pigmen pewarna yang dicapkan ke atas media kain',
          recycledAlternative: 'Cat poster atau cat tembok sisa rumah yang dicampur sedikit lem putih PVA',
          available: true,
        },
        {
          id: 'm-4',
          name: 'Kain Perca Katun / Tote Bag Polos / Kaos Bekas',
          quantity: '1 lembar',
          role: 'Media uji coba pencetakan pola sablon stensil',
          recycledAlternative: 'Kain lap katun polos atau bagian punggung kaos bekas yang sudah tidak dipakai',
          available: true,
        },
        {
          id: 'm-5',
          name: 'Lakban Kertas (Masking Tape) / Selotip',
          quantity: '1 rol',
          role: 'Mengunci kertas stensil di atas kain agar tidak bergeser saat dicat',
          recycledAlternative: 'Selotip bening biasa',
          available: true,
        },
      ],
      safetyTips: [
        'Gunakan alas potong (cutting mat atau kardus tebal) agar pisau cutter tidak merusak permukaan meja.',
        'Biarkan cat mengering sempurna sebelum kertas stensil dilepas dari kain.',
      ],
      isAiGenerated: true,
      modelUsed: 'Sintesis Kurikulum Vokasi SMK',
    };
  }

  // Generic / Default untuk Profesi / Bisnis apa pun yang diinput siswa
  return {
    targetProfession: profession,
    prototypeTitle: `Purwarupa Simulasi Model & Uji Kelayakan Terapan ${profession}`,
    prototypeRationale: `Purwarupa ini dirancang khusus untuk mensimulasikan tugas inti dari seorang profesional atau perintis usaha di bidang ${profession}. Menggabungkan perkakas dasar yang mudah diakses dengan bahan baku sekitar, siswa dapat memvalidasi fungsi produk, mengasah logika kerja teknis, dan menguasai standar K3 sebelum terjun ke skala industri penuh.`,
    difficulty: 'Mudah',
    estimatedHours: '2-3 Jam',
    deliverable: `1 unit purwarupa fisik fungsional representasi ${profession} lengkap dengan lembar spesifikasi teknis dan panduan pengujian.`,
    coreCompetencies: [
      `Memahami diagram alur dan metodologi kerja standar profesi ${profession}`,
      `Pengoperasian perkakas kerja secara presisi dan penerapan keselamatan kerja (K3)`,
      `Substitusi cerdas bahan baku lokal menjadi purwarupa bernilai tambah`,
      `Pengendalian mutu hasil karya (Quality Control) dan dokumentasi portofolio`,
    ],
    tools: [
      {
        id: 't-1',
        name: 'Perkakas Ukur & Penanda (Penggaris, Meteran, Spidol)',
        role: 'Memastikan dimensi dan presisi komponen purwarupa sesuai cetak biru',
        isCritical: true,
        lowCostAlternative: 'Penggaris sekolah 30cm dan pensil grafit biasa',
        available: true,
      },
      {
        id: 't-2',
        name: 'Perkakas Potong & Pembentuk (Gunting / Cutter Presisi)',
        role: 'Memotong komponen pembentuk struktur purwarupa secara rapi',
        isCritical: true,
        lowCostAlternative: 'Gunting dapur tajam atau pisau lipat bersih',
        available: true,
      },
      {
        id: 't-3',
        name: 'Perkakas Sambung & Pengikat (Tang / Obeng / Lem)',
        role: 'Merekatkan atau mengunci sambungan struktural antar bagian purwarupa',
        isCritical: true,
        lowCostAlternative: 'Lem tembak, lakban kertas kuat, atau lem kayu PVA',
        available: true,
      },
      {
        id: 't-4',
        name: 'Peralatan Dokumentasi (Kamera Smartphone)',
        role: 'Mendokumentasikan tahapan pembuatan untuk bukti portofolio asesmen kompetensi',
        isCritical: false,
        lowCostAlternative: 'Kamera smartphone siswa atau catatan manual sketsa berdimensi',
        available: true,
      },
    ],
    materials: [
      {
        id: 'm-1',
        name: `Bahan Rangka Utama Purwarupa ${profession}`,
        quantity: 'Secukupnya (1 set)',
        role: 'Membentuk sasis / wadah / struktur fisik utama produk simulasi',
        recycledAlternative: 'Kardus tebal kemasan, papan triplek sisa, atau botol plastik bekas daur ulang',
        available: true,
      },
      {
        id: 'm-2',
        name: `Komponen Fungsional Inti (Bahan Uji Khusus ${profession})`,
        quantity: '1-2 unit / takaran uji',
        role: 'Komponen yang menjalankan fungsi mekanisme utama dari simulasi kejuruan',
        recycledAlternative: 'Bahan sekitar rumah yang memiliki sifat elastisitas, kelistrikan, atau tekstur yang setara',
        available: false,
      },
      {
        id: 'm-3',
        name: 'Perekat / Pengencang (Lem Kertas, Lem Fox, Baut, atau Selotip)',
        quantity: '1 buah',
        role: 'Menggabungkan komponen agar kokoh saat proses pengujian berlangsung',
        recycledAlternative: 'Lem putih serbaguna atau kawat pengikat sisa',
        available: true,
      },
      {
        id: 'm-4',
        name: 'Bahan Finishing & Label Identitas Produk',
        quantity: '1 lembar kertas / stiker',
        role: 'Memberikan identitas merek, tanggal pembuatan, dan instruksi penggunaan',
        recycledAlternative: 'Kertas HVS bekas atau potongan kardus berpola yang digambar tangan rapi',
        available: true,
      },
    ],
    safetyTips: [
      'Gunakan alas kerja pelindung (tatakan kardus tebal) agar meja kerja tidak tergores.',
      'Perhatikan keselamatan tangan saat menggunakan alat potong atau bahan berperekat kuat.',
      'Lakukan pengujian bertahap dari level beban rendah sebelum ke kapasitas maksimal.',
    ],
    isAiGenerated: true,
    modelUsed: 'Sintesis Kurikulum Vokasi SMK',
  };
}
