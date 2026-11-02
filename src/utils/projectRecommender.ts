import { VocationField, RecommendedProject, AvailableResources } from '../types/recommender';

export const POPULAR_VOCATION_FIELDS: VocationField[] = [
  {
    id: 'tkj',
    name: 'Teknik Komputer & Jaringan (TKJ)',
    category: 'Teknologi Informasi',
    description: 'Instalasi jaringan komputer LAN/Wi-Fi, crimping kabel, konfigurasi router, dan perakitan PC.',
    typicalTools: ['Tang Crimping RJ45', 'LAN Cable Tester', 'Obeng Presisi', 'Komputer / Laptop', 'Tang Potong'],
    typicalMaterials: ['Kabel UTP / LAN Cat5e/6', 'Konektor RJ45', 'Kabel USB', 'Flashdisk', 'Kabel Ties'],
    sampleRealWorldTasks: ['Crimping kabel LAN', 'Setting IP Address & Router Wi-Fi', 'Troubleshooting hardware komputer'],
  },
  {
    id: 'titl',
    name: 'Teknik Instalasi Tenaga Listrik (TITL)',
    category: 'Ketenagalistrikan',
    description: 'Pemasangan instalasi listrik rumah tangga, saklar, stop kontak, sekring pengaman MCB, dan panel listrik.',
    typicalTools: ['Tang Kombinasi', 'Tespen', 'Obeng Plus & Minus', 'Multimeter', 'Tang Pengupas Kabel'],
    typicalMaterials: ['Kabel Listrik NYA/NYM', 'Saklar Tunggal / Seri', 'Fitting Lampu & Bohlam', 'Isolasi Listrik', 'Stop Kontak'],
    sampleRealWorldTasks: ['Merangkai saklar ganda instalasi penerangan', 'Memasang pengaman MCB', 'Pengecekan jalur arus listrik'],
  },
  {
    id: 'tbsm',
    name: 'Teknik Sepeda Motor & Otomotif (TBSM / TKRO)',
    category: 'Otomotif & Mesin',
    description: 'Perawatan mesin sepeda motor/mobil, sistem pengereman, kelistrikan bodi kendaraan, dan setel karburator/injeksi.',
    typicalTools: ['Kunci Pas & Ring', 'Kunci T', 'Obeng', 'Kunci Busi', 'Feeler Gauge', 'Tang'],
    typicalMaterials: ['Busi Motor', 'Kabel Listrik Otomotif', 'Lampu Indikator 12V', 'Ampelas Halus', 'Cairan Pembersih Karburator'],
    sampleRealWorldTasks: ['Membersihkan dan setel celah busi', 'Rangkaian lampu sein & klakson motor', 'Pengecekan oli dan filter udara'],
  },
  {
    id: 'kuliner',
    name: 'Tata Boga & Kuliner / Usaha Bakery',
    category: 'Pariwisata & Kuliner',
    description: 'Pengolahan makanan, fermentasi roti bakery, pengemasan produk pangan higienis, dan perhitungan HPP kuliner.',
    typicalTools: ['Timbangan Dapur Digital', 'Oven / Panci Pemanggang', 'Wajan / Panci', 'Sendok Takar', 'Spatula & Pisau'],
    typicalMaterials: ['Tepung Terigu', 'Ragi Instan (Yeast)', 'Gula Pasir', 'Minyak Goreng / Mentega', 'Garam', 'Kemasan Makanan'],
    sampleRealWorldTasks: ['Uji aktivitas ragi roti manis', 'Standar porsi dan uji rasa resep komersial', 'Kalkulasi HPP & margin harga jual'],
  },
  {
    id: 'pertanian',
    name: 'Agribisnis Tanaman & Hidroponik (ATPH)',
    category: 'Pertanian & Agribisnis',
    description: 'Budidaya tanaman sayuran tanpa tanah, penyemaian benih, formulasi nutrisi pupuk, dan sistem irigasi otomatis.',
    typicalTools: ['Gunting / Cutter', 'Timbangan Gram', 'Penggaris', 'Wadah Air / Tandon', 'pH Meter / TDS Meter'],
    typicalMaterials: ['Botol Plastik Bekas', 'Kain Flanel (Sumbu)', 'Benih Sayuran (Kangkung/Selada)', 'Nutrisi AB Mix / Pupuk NPK', 'Rockwool / Spons'],
    sampleRealWorldTasks: ['Membuat modul hidroponik botol sistem sumbu', 'Menyemai benih sayuran pada spons', 'Mengukur kepekatan nutrisi larutan'],
  },
  {
    id: 'dkv',
    name: 'Desain Komunikasi Visual (DKV) & Sablon',
    category: 'Seni & Industri Kreatif',
    description: 'Desain identitas merek, cetak sablon manual pakaian, fotografi produk katalog, dan promosi digital.',
    typicalTools: ['Kamera Handphone', 'Gunting / Cutter Presisi', 'Penggaris Besi', 'Screen Sablon / Rakel', 'Lampu Belajar Meja'],
    typicalMaterials: ['Kardus Bekas Ukuran Besar', 'Kertas HVS Putih / Karton', 'Cat Akrilik / Tinta Sablon', 'Kain Polos / Kaos', 'Lakban Kertas'],
    sampleRealWorldTasks: ['Membuat mini studio lightbox foto produk', 'Sablon manual stensil pola kaos', 'Desain stiker kemasan label produk'],
  },
  {
    id: 'busana',
    name: 'Tata Busana & Penjahit Pakaian',
    category: 'Seni & Kerajinan',
    description: 'Pembuatan pola pakaian, teknik potong kain presisi, jahit sambungan kuat, dan kreasi produk daur ulang perca.',
    typicalTools: ['Gunting Kain', 'Pita Meteran Jahit', 'Jarum Jahit Tangan / Mesin', 'Pendedel Benang', 'Kapur Jahit'],
    typicalMaterials: ['Kain Perca Sisa Konveksi', 'Benang Jahit', 'Kancing Baju / Resleting', 'Kertas Pola / Koran Bekas'],
    sampleRealWorldTasks: ['Menjahit tote bag dari kain sisa', 'Membuat pola dasar kerah atau kantong', 'Jahit kelim tepi pakaian rapi'],
  },
  {
    id: 'elektronika',
    name: 'Teknik Elektronika & IoT Otomasi',
    category: 'Elektronika & Instrumentasi',
    description: 'Perakitan rangkaian elektronika sensor, penyolderan komponen PCB, dan sistem saklar otomatis.',
    typicalTools: ['Solder Listrik', 'Penyedot Timah', 'Tang Potong Kaki Komponen', 'Multimeter', 'Pinset'],
    typicalMaterials: ['Timah Solder', 'Sensor Cahaya (LDR)', 'Transistor (NPN BC547)', 'Resistor Berbagai Ukuran', 'LED Indikator', 'Baterai 9V / Kotak Baterai'],
    sampleRealWorldTasks: ['Merangkai saklar otomatis sensor cahaya', 'Penyolderan rangkaian running LED', 'Membuat alarm air tandon sederhana'],
  },
  {
    id: 'bisnis',
    name: 'Manajemen Bisnis Retail & Pemasaran',
    category: 'Bisnis & Manajemen',
    description: 'Penataan display toko (visual merchandising), pencatatan stok kasir, pelayanan pelanggan, dan strategi promosi.',
    typicalTools: ['Buku Catatan / Kasir', 'Kalkulator', 'Smartphone', 'Spidol & Label Harga'],
    typicalMaterials: ['Kertas Struk / Nota Kontan', 'Stiker Label Barcode / Harga', 'Kardus Display Produk', 'Sampel Barang Dagangan'],
    sampleRealWorldTasks: ['Membuat kartu stok barang keluar-masuk', 'Simulasi transaksi kasir dan hitung laba rugi', 'Merancang tata letak rak display toko'],
  },
  {
    id: 'las',
    name: 'Teknik Pengelasan & Fabrikasi Konstruksi Logam',
    category: 'Teknik Mesin & Konstruksi',
    description: 'Penyambungan logam, pemotongan presisi, perakitan rangka besi, dan pemahaman keselamatan kerja las.',
    typicalTools: ['Meteran Roll', 'Penggaris Siku Baja', 'Kikir Besi', 'Gergaji Besi / Tang Klem', 'Topeng Pelindung'],
    typicalMaterials: ['Besi Plat / Plat Seng Bekas', 'Baut & Mur', 'Kawat Besi Pengikat', 'Ampelas Besi'],
    sampleRealWorldTasks: ['Pengukuran & penandaan sudut siku 90 derajat', 'Pembuatan purwarupa sambungan rangka plat', 'Uji kekokohan struktur miniatur'],
  },
];

/**
 * Normalisasi teks untuk pencarian dan pencocokan longgar
 */
export function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Mengecek apakah suatu item ada dalam daftar ketersediaan siswa
 */
export function checkAvailability(neededItem: string, userAvailableList: string[]): boolean {
  const normNeeded = normalize(neededItem);
  const neededTokens = normNeeded.split(' ').filter(t => t.length > 2);

  for (const avail of userAvailableList) {
    const normAvail = normalize(avail);
    if (normAvail === normNeeded || normAvail.includes(normNeeded) || normNeeded.includes(normAvail)) {
      return true;
    }
    // Token overlap check
    const availTokens = normAvail.split(' ').filter(t => t.length > 2);
    const overlap = neededTokens.filter(t => availTokens.includes(t));
    if (overlap.length >= 1 && (overlap.length >= Math.min(neededTokens.length, 2))) {
      return true;
    }
  }
  return false;
}

/**
 * Proyek kurasi benchmark yang dapat direkomendasikan secara instan & deterministik
 */
export const CURATED_SIMULATION_PROJECTS: RecommendedProject[] = [
  // 1. TITL: Lampu Penerangan
  {
    id: 'sim-listrik-1',
    title: 'Simulasi Instalasi Penerangan Rumah 2 Titik Lampu dengan Saklar Seri',
    targetProfession: 'Teknik Instalasi Tenaga Listrik (TITL)',
    representationRationale:
      'Proyek ini merepresentasikan tugas utama Teknisi Listrik Bangunan: membaca gambar denah rangkaian, memasang saklar pembagi jalur penerangan, mengupas kabel dengan standar K3, dan menguji kontinuitas arus beban.',
    difficulty: 'Mudah',
    estimatedHours: '2-3 Jam',
    toolsUsed: [
      { name: 'Tespen', available: false },
      { name: 'Tang Kombinasi / Pengupas Kabel', available: false },
      { name: 'Obeng Plus & Minus', available: false },
    ],
    materialsUsed: [
      { name: 'Kabel Listrik / Kabel Kawat Sederhana', available: false, quantity: '3 meter' },
      { name: 'Saklar Ganda / Saklar Rumahan', available: false, quantity: '1 buah' },
      { name: 'Fitting & Bohlam Lampu (atau Lampu LED 5V/Baterai)', available: false, quantity: '2 set' },
      { name: 'Papan Kayu / Kardus Tebal sebagai Dinding Denah', available: false, quantity: '1 lembar' },
      { name: 'Isolasi Listrik', available: false, quantity: '1 rol' },
    ],
    alternativeMaterialsSuggested: [
      'Bila tidak ada sumber tegangan 220V, gunakan baterai 9V/kotak baterai AA dengan lampu LED kecil agar aman dipelajari siswa.',
    ],
    readinessPercentage: 0,
    coreCompetenciesLearned: [
      'Membuat jalur pengawatan instalasi penerangan seri-paralel',
      'Teknik terminasi kawat kabel pada baut kontak saklar',
      'Pemeriksaan keamanan kebocoran arus dan hubung singkat',
    ],
    deliverable: 'Papan simulasi denah penerangan rumah yang menyala bergantian melalui kendali saklar ganda.',
    safetyProtocols: [
      'Pastikan sumber daya listrik dalam keadaan terputus saat merangkai kabel',
      'Tutup seluruh sambungan tembaga terbuka dengan isolasi listrik standar SNI',
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Gambar Skema Rangkaian & Siapkan Papan Kerja',
        instruction: 'Gambar skema diagram satu garis instalasi penerangan 2 lampu dengan 1 saklar ganda pada papan kardus atau kayu.',
        safetyTip: 'Gunakan penggaris untuk jalur kawat agar rapi dan tidak tumpang tindih.',
        checkpoint: 'Skema jalur fasa dan netral terlihat jelas di papan denah.',
      },
      {
        stepNumber: 2,
        title: 'Pengupasan & Pemasangan Kabel pada Saklar',
        instruction: 'Kupas ujung kabel sepanjang 1 cm menggunakan tang kupas. Masukkan kawat fasa ke terminal input saklar dan sambungkan ke masing-masing fitting.',
        checkpoint: 'Baut terminal mengunci kawat dengan kuat tanpa goyang.',
      },
      {
        stepNumber: 3,
        title: 'Pemasangan Fitting Lampu & Jalur Netral',
        instruction: 'Hubungkan kabel netral dari kedua fitting lampu secara paralel menuju terminal sumber daya.',
        checkpoint: 'Kedua jalur lampu terisolasi rapi.',
      },
      {
        stepNumber: 4,
        title: 'Uji Fungsi Saklar & Kontinuitas Beban',
        instruction: 'Pasang bohlam, hubungkan ke sumber baterai/daya, lalu tekan saklar 1 dan 2 secara bergantian untuk memverifikasi lampu menyala independen.',
        checkpoint: 'Lampu 1 dan 2 dapat dikendalikan menyala dan padam secara mandiri.',
      },
    ],
    badgeEarned: 'Instalatur Listrik Pemula Terverifikasi',
  },

  // 2. TKJ: Kabel LAN & Jaringan
  {
    id: 'sim-tkj-1',
    title: 'Purwarupa Pengkabelan Jaringan LAN Tipe Straight-Through & Uji Konektivitas',
    targetProfession: 'Teknik Komputer & Jaringan (TKJ)',
    representationRationale:
      'Pemasangan kabel UTP berkonektor RJ45 dengan urutan warna standar T568B adalah keterampilan paling mendasar yang wajib dikuasai teknisi jaringan komputer di kantor, data center, maupun warnet.',
    difficulty: 'Mudah',
    estimatedHours: '1-2 Jam',
    toolsUsed: [
      { name: 'Tang Crimping RJ45', available: false },
      { name: 'LAN Cable Tester (atau Komputer/Laptop)', available: false },
      { name: 'Gunting / Cutter', available: false },
    ],
    materialsUsed: [
      { name: 'Kabel UTP / LAN Cat5e/6', available: false, quantity: '1-2 meter' },
      { name: 'Konektor RJ45', available: false, quantity: '2 buah' },
    ],
    alternativeMaterialsSuggested: [
      'Bila tang crimping belum ada, siswa dapat mempelajari urutan susunan kabel warna T568B pada kabel bekas untuk latihan ketelitian tangan.',
    ],
    readinessPercentage: 0,
    coreCompetenciesLearned: [
      'Menghafal dan menyusun 8 pin warna kabel standar TIA/EIA 568B',
      'Mengoperasikan tang crimping dengan tekanan pas',
      'Membaca indikator lampu berurutan 1 sampai 8 pada LAN tester',
    ],
    deliverable: 'Kabel LAN straight-through yang lolos uji kontinuitas 8 pin indikator menyala sinkron.',
    safetyProtocols: [
      'Hati-hati saat mengupas jaket luar kabel agar kawat tembaga halus di dalamnya tidak tergores putus',
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Kupas Jaket Kabel UTP',
        instruction: 'Kupas jaket pelindung luar kabel sepanjang kira-kira 2.5 cm dan uraikan lilitan 4 pasang kawat warna.',
        checkpoint: '8 kawat terurai lurus tanpa cacat isolasi.',
      },
      {
        stepNumber: 2,
        title: 'Urutkan Warna Standar T568B',
        instruction: 'Susun urutan warna dari kiri ke kanan: Putih-Oranye, Oranye, Putih-Hijau, Biru, Putih-Biru, Hijau, Putih-Cokelat, Cokelat. Potong ujungnya rata 1.2 cm.',
        checkpoint: 'Urutan warna pas dan ujung kawat terpotong rata presisi.',
      },
      {
        stepNumber: 3,
        title: 'Masukkan ke RJ45 & Crimping',
        instruction: 'Dorong kawat ke dalam konektor RJ45 sampai tembaga menyentuh ujung depan. Masukkan ke lubang tang crimping dan tekan hingga bunyi klik mengunci.',
        checkpoint: 'Pin tembaga menembus kawat dan pengunci jaket menjepit kuat.',
      },
      {
        stepNumber: 4,
        title: 'Uji Konektivitas pada LAN Tester',
        instruction: 'Colokkan kedua ujung kabel ke master dan remote LAN tester. Perhatikan lampu LED 1-8 menyala berurutan dari nomor 1 sampai 8.',
        checkpoint: 'Seluruh 8 lampu menyala berurutan tanpa ada pin yang terlewat atau silang.',
      },
    ],
    badgeEarned: 'Teknisi Pengkabelan Jaringan Terakreditasi',
  },

  // 3. TBSM / Otomotif: Busi & Pengapian
  {
    id: 'sim-otomotif-1',
    title: 'Inspeksi Ruang Bakar: Pembersihan, Analisis Warna Elektroda & Setel Celah Busi',
    targetProfession: 'Teknik Sepeda Motor & Otomotif (TBSM / TKRO)',
    representationRationale:
      'Mendiagnosis kondisi mesin melalui warna kepala elektroda busi (kering/basah/terlalu kaya bensin) dan menyetel celah renggang elektroda adalah simulasi perawatan berkala wajib bengkel servis motor resmi.',
    difficulty: 'Mudah',
    estimatedHours: '1-2 Jam',
    toolsUsed: [
      { name: 'Kunci Busi', available: false },
      { name: 'Feeler Gauge (atau Ujung Kertas Tebal / Silet sebagai Acuan 0.7mm)', available: false },
      { name: 'Sikat Kawat Kecil / Ampelas Halus', available: false },
      { name: 'Lap Bersih / Majun', available: false },
    ],
    materialsUsed: [
      { name: 'Busi Bekas Sepeda Motor', available: false, quantity: '1 buah' },
      { name: 'Cairan Pembersih / Bensin Sedikit', available: false, quantity: 'Sedikit' },
    ],
    alternativeMaterialsSuggested: [
      'Gunakan busi motor bekas yang tidak terpakai dari bengkel terdekat atau motor di rumah.',
    ],
    readinessPercentage: 0,
    coreCompetenciesLearned: [
      'Menganalisis hasil pembakaran mesin dari jelaga elektroda busi',
      'Mengukur celah renggang busi spesifikasi pabrikan (0.7 - 0.8 mm)',
      'Standar keselamatan kerja mekanik otomotif',
    ],
    deliverable: 'Busi bersih bebas kerak dengan celah renggang terkalibrasi dan lembar diagnosis kondisi pembakaran mesin.',
    safetyProtocols: [
      'Pastikan mesin motor dalam kondisi dingin sebelum melepas busi untuk mencegah ulang drat silinder rusak',
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Pelepasan Busi & Analisis Visual Kerak',
        instruction: 'Buka busi dari blok mesin menggunakan kunci busi. Amati warna ujung elektroda: cokelat abu-abu (sempurna), hitam jelaga (terlalu boros bensin), atau basah oli.',
        checkpoint: 'Kondisi pembakaran berhasil didiagnosis dan dicatat.',
      },
      {
        stepNumber: 2,
        title: 'Pembersihan Jelaga Karbon Elektroda',
        instruction: 'Bersihkan kerak karbon pada elektroda tengah dan ulir menggunakan sikat kawat dan sedikit ampelas halus.',
        checkpoint: 'Ujung isolator porselen dan elektroda kembali bersih dari kerak karbon hitam.',
      },
      {
        stepNumber: 3,
        title: 'Pengukuran & Penyetelan Celah (Gap)',
        instruction: 'Selipkan bilah pengukur 0.70 mm di antara elektroda tengah dan samping. Ketuk perlahan bila terlalu longgar, atau congkel hati-hati bila terlalu rapat.',
        checkpoint: 'Bilah feeler gauge masuk dengan gesekan halus pas.',
      },
      {
        stepNumber: 4,
        title: 'Uji Percikan Bunga Api (Spark Check)',
        instruction: 'Tempelkan badan ulir busi ke massa logam rangka motor, pasang cop busi, nyalakan kontak dan starter untuk melihat percikan bunga api biru tebal.',
        checkpoint: 'Bunga api meloncat biru terang di tengah elektroda.',
      },
    ],
    badgeEarned: 'Mekanik Servis Tune-Up Otomotif Mandiri',
  },

  // 4. Tata Boga: Fermentasi Roti
  {
    id: 'sim-boga-1',
    title: 'Simulasi Uji Fermentasi Ragi & Uji Mutu Roti Manis Skala Usaha Mikro',
    targetProfession: 'Tata Boga & Kuliner / Usaha Bakery',
    representationRationale:
      'Pemilik usaha bakery profesional harus memahami biokimia ragi roti (Saccharomyces cerevisiae), pengaruh suhu terhadap gas CO2, dan penghitungan resep formula baker agar roti empuk dengan margin laba tinggi.',
    difficulty: 'Mudah',
    estimatedHours: '2-3 Jam',
    toolsUsed: [
      { name: 'Timbangan Dapur Digital (atau Gelas Ukur)', available: false },
      { name: 'Mangkuk Wadah Adonan', available: false },
      { name: 'Oven / Wajan Pemanggang', available: false },
      { name: 'Sendok & Garpu', available: false },
    ],
    materialsUsed: [
      { name: 'Tepung Terigu Protein Tinggi / Sedang', available: false, quantity: '250 gram' },
      { name: 'Ragi Instan (Fermipan / Mauri-pan)', available: false, quantity: '1 sendok teh' },
      { name: 'Gula Pasir', available: false, quantity: '2 sendok makan' },
      { name: 'Air Hangat Kuku (sekitar 35 C)', available: false, quantity: '120 ml' },
      { name: 'Mentega / Margarin', available: false, quantity: '30 gram' },
    ],
    alternativeMaterialsSuggested: [
      'Bila oven belum ada di rumah, simulasi pemanggangan dapat menggunakan wajan teflon tertutup dengan api lilin kecil beralas seng.',
    ],
    readinessPercentage: 0,
    coreCompetenciesLearned: [
      'Menilai keaktifan ragi melalui pembentukan busa gas',
      'Teknik menguleni adonan hingga windowpane stage (elastis tidak mudah sobek)',
      'Proofing suhu ruang dan pengendalian waktu fermentasi',
    ],
    deliverable: 'Roti manis empuk buatan tangan dan lembar evaluasi aroma, pori remah, serta perhitungan modal bahan per biji.',
    safetyProtocols: [
      'Cuci tangan memakai sabun standar sanitasi makanan higienis sebelum menyentuh adonan',
      'Gunakan kain serbet tebal saat mengangkat loyang panas',
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Uji Keaktifan Biang Ragi (Yeast Bloom Test)',
        instruction: 'Campur air hangat kuku dengan 1 sdt gula dan 1 sdt ragi instan di dalam gelas. Diamkan 7 menit hingga timbul busa tebal berbusa.',
        checkpoint: 'Busa ragi mengembang tebal membuktikan kultur ragi aktif siap pakai.',
      },
      {
        stepNumber: 2,
        title: 'Pencampuran Bahan & Pengulenan Elastis',
        instruction: 'Campur tepung terigu, sisa gula, dan cairan ragi. Uleni dengan tangan sambil memasukkan margarin hingga adonan kalis dan lembut.',
        checkpoint: 'Adonan tidak lengket di tangan dan dapat ditarik tipis tanpa langsung sobek.',
      },
      {
        stepNumber: 3,
        title: 'Fermentasi (Proofing) Pengembangan Gas',
        instruction: 'Bulatkan adonan, tutup dengan kain lembap bersih, dan diamkan selama 45 menit hingga volumenya mengembang 2 kali lipat.',
        checkpoint: 'Adonan mengembang 2x lipat dan membal saat ditekan lembut jari.',
      },
      {
        stepNumber: 4,
        title: 'Pemanggangan & Analisis Margin Usaha',
        instruction: 'Bentuk adonan menjadi 6 roti kecil, panggang selama 15-20 menit hingga kuning keemasan. Hitung total modal bahan dibagi 6 buah untuk menentukan harga jual.',
        checkpoint: 'Roti matang keemasan beraroma sedap dan lembar HPP selesai dihitung.',
      },
    ],
    badgeEarned: 'Artisan Baker & Wirausaha Roti Muda',
  },

  // 5. Agribisnis: Hidroponik Botol
  {
    id: 'sim-agri-1',
    title: 'Rancang Bangun Miniatur Instalasi Hidroponik Botol Bekas Sistem Sumbu (Wick System)',
    targetProfession: 'Agribisnis Tanaman & Hidroponik (ATPH)',
    representationRationale:
      'Petani hidroponik modern memulai dari pemahaman gaya kapilaritas sumbu, aerasi akar, dan penyerapan hara terlarut. Proyek ini membuktikan kemampuan siswa menyulap limbah plastik menjadi kebun sayur produktif.',
    difficulty: 'Mudah',
    estimatedHours: '1-2 Jam',
    toolsUsed: [
      { name: 'Gunting / Cutter', available: false },
      { name: 'Paku / Solder untuk Melubangi', available: false },
      { name: 'Penggaris', available: false },
    ],
    materialsUsed: [
      { name: 'Botol Plastik Bekas Air Mineral (1.5 Liter)', available: false, quantity: '2 buah' },
      { name: 'Kain Flanel / Kain Kaos Katun Bekas (sebagai Sumbu)', available: false, quantity: 'Potongan 2x15 cm' },
      { name: 'Media Tanam (Spons Dapur / Rockwool / Sekam Bakar)', available: false, quantity: 'Secukupnya' },
      { name: 'Benih Sayuran (Kangkung / Bayam / Selada)', available: false, quantity: '10-20 butir' },
      { name: 'Air Bersih & Pupuk (AB Mix / Pupuk NPK Larut)', available: false, quantity: '1 liter' },
    ],
    alternativeMaterialsSuggested: [
      'Gunakan kain kaos katun bekas sebagai pengganti kain flanel. Gunakan spons cuci piring baru yang dipotong kecil sebagai pengganti rockwool semai.',
    ],
    readinessPercentage: 0,
    coreCompetenciesLearned: [
      'Menerapkan prinsip kapilaritas cairan pada sistem wick hidroponik',
      'Teknik penyemaian benih sayuran cepat tumbuh',
      'Manajemen sirkulasi oksigen dan kebersihan tandon nutrisi',
    ],
    deliverable: 'Modul hidroponik mandiri siap tanam dengan benih kangkung/selada yang mulai berkecambah pada media sumbu.',
    safetyProtocols: [
      'Hati-hati saat memotong botol plastik tebal dengan cutter, potong menjauhi arah tubuh',
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Pemotongan Botol & Pemasangan Sumbu',
        instruction: 'Potong botol plastik menjadi 2 bagian (1/3 bagian atas untuk netpot, 2/3 bagian bawah untuk tandon air). Lubangi tutup botol dan selipkan kain sumbu flanel.',
        checkpoint: 'Sumbu kain terjulur 5 cm ke bawah dan menyentuh dasar media atas.',
      },
      {
        stepNumber: 2,
        title: 'Pemasangan Media Tanam & Semai Benih',
        instruction: 'Balik bagian atas botol ke dalam tandon bawah. Masukkan potongan spons basah dan letakkan 3-4 butir benih kangkung di tengahnya.',
        checkpoint: 'Spons basah menyerap air dari sumbu dan menopang benih dengan stabil.',
      },
      {
        stepNumber: 3,
        title: 'Pengisian Larutan Nutrisi Tandon',
        instruction: 'Isi tandon bawah dengan air bernutrisi hingga menyentuh ujung bawah leher botol (jangan sampai spons terendam total agar akar tetap bernapas).',
        checkpoint: 'Air nutrisi membasahi sumbu secara kontinu.',
      },
      {
        stepNumber: 4,
        title: 'Penempatan Sinar Matahari & Log Pertumbuhan',
        instruction: 'Letakkan botol di tempat yang terkena sinar matahari pagi selama 4-6 jam dan buat tabel monitoring tinggi daun harian.',
        checkpoint: 'Modul siap dan tabel pemantauan kecambah tercatat rapi.',
      },
    ],
    badgeEarned: 'Pelopor Urban Farming Hidroponik Hijau',
  },

  // 6. DKV: Mini Studio Foto Produk
  {
    id: 'sim-dkv-1',
    title: 'Pembuatan Mini Studio Lightbox Portabel & Foto Komersial Produk UMKM',
    targetProfession: 'Desain Komunikasi Visual (DKV) & Sablon',
    representationRationale:
      'Seorang desainer grafis dan fotografer komersial harus mampu mengendalikan pantulan cahaya, difusi bayangan, dan sudut bidik kamera untuk menaikkan nilai jual produk dagang lokal dengan perlengkapan studio mandiri.',
    difficulty: 'Mudah',
    estimatedHours: '2 Jam',
    toolsUsed: [
      { name: 'Kamera Smartphone', available: false },
      { name: 'Cutter / Gunting', available: false },
      { name: 'Penggaris', available: false },
      { name: 'Lampu Belajar Meja / Senter HP Tambahan', available: false },
    ],
    materialsUsed: [
      { name: 'Kardus Bekas Ukuran Sedang / Besar', available: false, quantity: '1 buah' },
      { name: 'Kertas HVS Putih / Kertas Roti / Kain Tipis Putih', available: false, quantity: '3-4 lembar' },
      { name: 'Lakban Kertas / Selotip Bening', available: false, quantity: '1 rol' },
      { name: 'Produk Contoh untuk Difoto (Minuman/Keripik/Sepatu)', available: false, quantity: '1 objek' },
    ],
    alternativeMaterialsSuggested: [
      'Gunakan kertas kalkir atau kertas roti sebagai difuser penyaring cahaya keras agar bayangan produk menjadi sangat lembut.',
    ],
    readinessPercentage: 0,
    coreCompetenciesLearned: [
      'Merancang studio difusi pencahayaan continuous softbox',
      'Menerapkan aturan komposisi Rule of Thirds dan sudut eye-level fotografi',
      'Pengeditan dasar warna (exposure, contrast, saturation) di smartphone',
    ],
    deliverable: 'Kotak studio lightbox berfungsi penuh dan 3 foto komersial produk berlatar putih bersih siap upload ke toko online.',
    safetyProtocols: [
      'Gunakan alas kardus cadangan saat memotong dinding kardus agar meja belajar tidak tergores',
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Pemotongan Jendela Cahaya Sisi Kardus',
        instruction: 'Beri jarak 3 cm dari tepi kardus, lalu potong jendela berlubang pada sisi kiri, kanan, dan atas kardus bekas.',
        checkpoint: 'Tiga jendela sisi kardus berlubang rapi membentuk rangka kotak.',
      },
      {
        stepNumber: 2,
        title: 'Pemasangan Kertas Difuser & Latar Lengkung (Seamless Backdrop)',
        instruction: 'Tutup ketiga lubang jendela dengan kertas HVS/kertas roti sebagai penyaring cahaya lembut. Pasang kertas putih melengkung dari atas ke dasar kardus tanpa lipatan siku.',
        checkpoint: 'Latar belakang putih mulus tanpa garis sudut pertemuan lantai.',
      },
      {
        stepNumber: 3,
        title: 'Penataan Lampu & Objek Produk',
        instruction: 'Sorotkan lampu belajar dari sisi kiri dan kanan luar jendela kertas. Letakkan produk UMKM di tengah area latar lengkung.',
        checkpoint: 'Produk terang merata tanpa bayangan tajam yang mengganggu.',
      },
      {
        stepNumber: 4,
        title: 'Pemotretan & Color Grading Ponsel',
        instruction: 'Bidik foto memakai kamera ponsel dengan fokus terkunci pada logo produk. Lakukan sedikit penyesuaian kecerahan dan kontras di aplikasi foto ponsel.',
        checkpoint: 'Hasil foto bersih profesional layak tayang di marketplace.',
      },
    ],
    badgeEarned: 'Fotografer Komersial & Kreator Visual UMKM',
  },

  // 7. Tata Busana: Tote Bag Upcycling
  {
    id: 'sim-busana-1',
    title: 'Rancang Bangun Tote Bag Serbaguna Berpola Zero-Waste dari Kain Perca Daur Ulang',
    targetProfession: 'Tata Busana & Penjahit Pakaian',
    representationRationale:
      'Industri garmen dan fesyen berkelanjutan membutuhkan keahlian menyusun potongan perca sisa kain menjadi produk layak pakai dengan teknik sambungan obras/jahit stik balik yang tahan beban berat.',
    difficulty: 'Sedang',
    estimatedHours: '3 Jam',
    toolsUsed: [
      { name: 'Gunting Kain', available: false },
      { name: 'Jarum Jahit Tangan (atau Mesin Jahit)', available: false },
      { name: 'Pita Pengukur / Penggaris', available: false },
      { name: 'Jarum Pentul', available: false },
    ],
    materialsUsed: [
      { name: 'Kain Perca Sisa Baju / Celana Jeans Bekas', available: false, quantity: 'Secukupnya' },
      { name: 'Benang Jahit yang Kuat', available: false, quantity: '1 gulung' },
      { name: 'Kertas Pola / Koran Bekas', available: false, quantity: '1 lembar' },
    ],
    alternativeMaterialsSuggested: [
      'Bisa memanfaatkan celana jeans bekas yang sudah tidak muat untuk dijadikan bahan tas yang sangat kuat dan modis.',
    ],
    readinessPercentage: 0,
    coreCompetenciesLearned: [
      'Menyusun pola geometris perca teknik patchwork',
      'Menerapkan jahitan tusuk tikam jejak (backstitch) sekuat jahitan mesin',
      'Pemasangan tali pegangan tas dengan jahitan penguat silang (box stitch)',
    ],
    deliverable: 'Tas jinjing (tote bag) modis kuat yang mampu menahan beban buku sekolah dan botol minum.',
    safetyProtocols: [
      'Simpan jarum pentul pada bantalan jarum agar tidak jatuh tercecer ke lantai',
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Pembuatan Pola Badan & Tali Tas',
        instruction: 'Gambar pola persegi panjang ukuran 35 x 40 cm pada koran bekas untuk badan tas dan 8 x 60 cm untuk sepasang tali pegangan.',
        checkpoint: 'Pola koran terpotong rapi dengan kampuh jahitan 1.5 cm.',
      },
      {
        stepNumber: 2,
        title: 'Pemotongan & Penyambungan Perca Kain',
        instruction: 'Gunting kain perca mengikuti pola. Bila menggunakan kain sambungan, jahit sambung potongan perca dengan tusuk tikam jejak yang rapat.',
        checkpoint: 'Dua lembar kain badan tas depan dan belakang terbentuk rapi.',
      },
      {
        stepNumber: 3,
        title: 'Penjahitan Sisi Tas & Lipatan Kelim Atas',
        instruction: 'Satukan bagian baik kain berhadapan, jahit keliling sisi kiri, kanan, dan bawah tas. Lipat tepi atas tas 2 cm ke dalam dan jahit kelim rapi.',
        checkpoint: 'Kantong tas terbentuk kokoh dengan jahitan terkunci.',
      },
      {
        stepNumber: 4,
        title: 'Pemasangan Tali Pegangan & Uji Beban',
        instruction: 'Jahit kedua tali pegangan pada bibir tas dengan jahitan silang kotak (box X-stitch). Uji masukkan 3 buku tebal untuk memastikan kekuatan jahitan.',
        checkpoint: 'Tali tas kokoh menopang beban buku tanpa ada benang yang terlepas.',
      },
    ],
    badgeEarned: 'Perancang Busana Daur Ulang Kreatif',
  },

  // 8. Elektronika: Saklar Sensor Cahaya
  {
    id: 'sim-elektro-1',
    title: 'Purwarupa Saklar Lampu Otomatis Sensor Cahaya LDR Berbasis Transistor Sederhana',
    targetProfession: 'Teknik Elektronika & IoT Otomasi',
    representationRationale:
      'Sistem penerangan jalan otomatis dan otomasi rumah pintar (smart home) berakar pada prinsip pembagi tegangan resistor sensor LDR yang mengendalikan saklar saklar semikonduktor transistor.',
    difficulty: 'Sedang',
    estimatedHours: '2 Jam',
    toolsUsed: [
      { name: 'Solder Listrik & Dudukan Solder', available: false },
      { name: 'Tang Potong Kaki Komponen', available: false },
      { name: 'Penyedot Timah / Pinset', available: false },
    ],
    materialsUsed: [
      { name: 'Sensor Cahaya (LDR 5mm)', available: false, quantity: '1 buah' },
      { name: 'Transistor NPN (BC547 / 2N2222)', available: false, quantity: '1 buah' },
      { name: 'Resistor 10K Ohm & 220 Ohm', available: false, quantity: '2 buah' },
      { name: 'Lampu LED 5mm', available: false, quantity: '1 buah' },
      { name: 'Timah Solder', available: false, quantity: 'Secukupnya' },
      { name: 'Baterai 9V / 2 Baterai AA & Kancing Baterai', available: false, quantity: '1 set' },
      { name: 'Papan PCB Titik Lubang (atau Breadboard)', available: false, quantity: '1 buah' },
    ],
    alternativeMaterialsSuggested: [
      'Bila solder belum ada, seluruh kaki komponen dapat dirangkai di atas papan breadboard tanpa perlu menyolder sama sekali.',
    ],
    readinessPercentage: 0,
    coreCompetenciesLearned: [
      'Memahami fungsi transistor sebagai saklar elektronik otomatis (switching)',
      'Karakteristik perubahan hambatan LDR saat terkena cahaya versus gelap',
      'Teknik penyolderan kaki komponen elektronika presisi mengkilap (shiny joint)',
    ],
    deliverable: 'Rangkaian elektronik lampu pintar yang otomatis menyala ketika sensor ditutup bayangan tangan dan mati saat terang.',
    safetyProtocols: [
      'Jangan menghirup asap timah solder langsung, letakkan solder pada dudukan besi tahan panas',
      'Pastikan kaki kolektor, basis, dan emitor transistor tidak saling bersentuhan hubung singkat',
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Identifikasi Kaki Pin Komponen',
        instruction: 'Tentukan kaki Kolektor (C), Basis (B), dan Emitor (E) pada transistor NPN BC547 dengan menghadapkan sisi datar transistor ke depan.',
        checkpoint: 'Posisi ketiga kaki transistor teridentifikasi tepat tanpa tertukar.',
      },
      {
        stepNumber: 2,
        title: 'Rangkai Pembagi Tegangan LDR & Resistor',
        instruction: 'Hubungkan satu kaki LDR dan satu kaki resistor 10K Ohm menuju kaki Basis transistor.',
        checkpoint: 'Simpul basis terhubung kuat ke sensor LDR.',
      },
      {
        stepNumber: 3,
        title: 'Pasang Beban LED & Resistor Pengaman',
        instruction: 'Sambungkan anoda LED ke kutub positif baterai melalui resistor 220 Ohm, dan katoda LED ke kaki Kolektor transistor.',
        checkpoint: 'Rangkaian tertutup selesai dan kutub baterai terpasang sesuai polaritas.',
      },
      {
        stepNumber: 4,
        title: 'Uji Fungsi Sensor Gelap-Terang',
        instruction: 'Hubungkan baterai. Tutup sensor LDR dengan jari Anda: LED harus menyala terang seketika. Lepaskan jari: LED harus langsung padam.',
        checkpoint: 'Sistem otomasi lampu bekerja akurat merespons perubahan intensitas cahaya.',
      },
    ],
    badgeEarned: 'Teknisi Elektronika Otomasi Sensor Bersertifikasi',
  },
];

/**
 * Mencari proyek yang cocok berdasarkan profesi dan ketersediaan alat/bahan
 */
export function recommendProjectsForStudent(
  targetProfessionInput: string,
  availableResources: AvailableResources
): RecommendedProject[] {
  const normInput = normalize(targetProfessionInput);
  const userTools = availableResources.tools;
  const userMaterials = availableResources.materials;

  // Skor setiap proyek kurasi
  const scored = CURATED_SIMULATION_PROJECTS.map((proj) => {
    // 1. Hitung alat yang tersedia
    let availableToolsCount = 0;
    const toolsUsed = proj.toolsUsed.map((t) => {
      const isAvail = checkAvailability(t.name, userTools);
      if (isAvail) availableToolsCount++;
      return { ...t, available: isAvail };
    });

    // 2. Hitung bahan yang tersedia
    let availableMaterialsCount = 0;
    const materialsUsed = proj.materialsUsed.map((m) => {
      const isAvail = checkAvailability(m.name, userMaterials);
      if (isAvail) availableMaterialsCount++;
      return { ...m, available: isAvail };
    });

    const toolPct = proj.toolsUsed.length > 0 ? (availableToolsCount / proj.toolsUsed.length) * 100 : 100;
    const matPct = proj.materialsUsed.length > 0 ? (availableMaterialsCount / proj.materialsUsed.length) * 100 : 100;
    const readinessPercentage = Math.round(toolPct * 0.55 + matPct * 0.45);

    // 3. Kesesuaian profesi
    const normTarget = normalize(proj.targetProfession);
    let professionRelevanceScore = 30; // Skor dasar

    if (normTarget === normInput || normTarget.includes(normInput) || normInput.includes(normTarget)) {
      professionRelevanceScore = 100;
    } else {
      // Token overlap
      const inTokens = normInput.split(' ').filter(t => t.length > 2);
      const tarTokens = normTarget.split(' ').filter(t => t.length > 2);
      const overlap = inTokens.filter(t => tarTokens.includes(t));
      if (overlap.length > 0) {
        professionRelevanceScore = 80;
      }
    }

    // Gabungkan relevansi profesi (40%) + kesiapan alat & bahan (60%)
    const compositeScore = Math.round(professionRelevanceScore * 0.4 + readinessPercentage * 0.6);

    return {
      project: {
        ...proj,
        toolsUsed,
        materialsUsed,
        readinessPercentage,
      },
      compositeScore,
      professionRelevanceScore,
    };
  });

  // Urutkan berdasarkan relevansi profesi terlebih dahulu jika cocok, lalu skor kesiapan
  return scored
    .sort((a, b) => {
      if (b.professionRelevanceScore !== a.professionRelevanceScore) {
        return b.professionRelevanceScore - a.professionRelevanceScore;
      }
      return b.compositeScore - a.compositeScore;
    })
    .map((s) => s.project);
}
