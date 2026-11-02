import React, { useState } from 'react';
import { Student, ToolRequirement, MaterialRequirement, VentureType } from '../types';
import { X, Plus, Trash2, UserPlus, Wrench, Package } from 'lucide-react';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStudent: (student: Student) => void;
}

const CLUSTERS = [
  'Teknik Rekayasa & Robotika',
  'Tata Boga & Kuliner Komersial',
  'Agri-Teknologi & Lingkungan Berkelanjutan',
  'Tekstil & Desain Mode',
  'Produksi Media & Industri Kreatif',
  'Teknik Ketenagalistrikan & Energi Bersih',
  'Kesehatan & Biomedis',
];

export const AddStudentModal: React.FC<AddStudentModalProps> = ({
  isOpen,
  onClose,
  onAddStudent,
}) => {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('Kelas XI SMK');
  const [targetedProfession, setTargetedProfession] = useState('');
  const [ventureType, setVentureType] = useState<VentureType>('Karier Profesional / Karyawan');
  const [careerCluster, setCareerCluster] = useState(CLUSTERS[0]);
  const [statementOfIntent, setStatementOfIntent] = useState('');
  const [competencies, setCompetencies] = useState('Prosedur K3, Praktik Lapangan');

  // Dynamic tools and materials
  const [tools, setTools] = useState<{ name: string; category: string; priority: 'Kritis' | 'Direkomendasikan' }[]>([
    { name: '', category: 'Peralatan Umum', priority: 'Kritis' },
  ]);

  const [materials, setMaterials] = useState<
    { name: string; category: string; quantity: number; unit: string; priority: 'Kritis' | 'Direkomendasikan' }[]
  >([{ name: '', category: 'Bahan Habis Pakai', quantity: 1, unit: 'unit', priority: 'Kritis' }]);

  if (!isOpen) return null;

  const handleAddToolRow = () => {
    setTools([...tools, { name: '', category: 'Peralatan Umum', priority: 'Kritis' }]);
  };

  const handleRemoveToolRow = (index: number) => {
    setTools(tools.filter((_, i) => i !== index));
  };

  const handleAddMaterialRow = () => {
    setMaterials([...materials, { name: '', category: 'Bahan Habis Pakai', quantity: 1, unit: 'unit', priority: 'Kritis' }]);
  };

  const handleRemoveMaterialRow = (index: number) => {
    setMaterials(materials.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !targetedProfession.trim()) return;

    const formattedTools: ToolRequirement[] = tools
      .filter((t) => t.name.trim().length > 0)
      .map((t, idx) => ({
        id: `req-t-custom-${idx}-${Date.now()}`,
        name: t.name.trim(),
        category: t.category,
        priority: t.priority,
      }));

    const formattedMaterials: MaterialRequirement[] = materials
      .filter((m) => m.name.trim().length > 0)
      .map((m, idx) => ({
        id: `req-m-custom-${idx}-${Date.now()}`,
        name: m.name.trim(),
        category: m.category,
        quantityNeeded: Number(m.quantity) || 1,
        unit: m.unit.trim() || 'unit',
        priority: m.priority,
      }));

    const newStudent: Student = {
      id: `student-custom-${Date.now()}`,
      name: name.trim(),
      grade,
      avatarSeed: name.trim(),
      targetedProfession: targetedProfession.trim(),
      ventureType,
      careerCluster,
      statementOfIntent:
        statementOfIntent.trim() ||
        `Mengejar keahlian dan simulasi praktik nyata di bidang ${targetedProfession.trim()}.`,
      skillsAcquired: ['Dasar Teori Vokasi', 'Pengenalan Bengkel'],
      requirements: {
        tools: formattedTools,
        materials: formattedMaterials,
        coreCompetencies: competencies.split(',').map((c) => c.trim()).filter(Boolean),
        safetyCertificationsNeeded: ['Sertifikasi K3 Keselamatan Kerja Lab'],
      },
      completedSimulationIds: [],
    };

    onAddStudent(newStudent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-800 border border-slate-700 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-700 flex items-center justify-between bg-slate-850">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Daftarkan Siswa & Minat Karir</h2>
              <p className="text-xs text-slate-400">
                Tentukan profesi yang dituju siswa, model usaha, serta kebutuhan alat dan bahan praktiknya.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white" aria-label="Tutup form">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Nama Lengkap Siswa *</label>
              <input
                type="text"
                required
                placeholder="misal: Rian Pratama"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Tingkat Kelas</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Kelas X SMK">Kelas X SMK</option>
                <option value="Kelas XI SMK">Kelas XI SMK</option>
                <option value="Kelas XII SMK">Kelas XII SMK</option>
                <option value="Kelas XIII / Diploma Vokasi">Kelas XIII / Diploma Vokasi</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Profesi / Usaha yang Dituju *
              </label>
              <input
                type="text"
                required
                placeholder="misal: Teknisi Drone Pemetaan"
                value={targetedProfession}
                onChange={(e) => setTargetedProfession(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Model Karir / Usaha</label>
              <select
                value={ventureType}
                onChange={(e) => setVentureType(e.target.value as VentureType)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Karier Profesional / Karyawan">Karier Profesional / Karyawan</option>
                <option value="Wirausaha Mandiri">Wirausaha Mandiri</option>
                <option value="Kewirausahaan Sosial">Kewirausahaan Sosial</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">Bidang Kejuruan</label>
            <select
              value={careerCluster}
              onChange={(e) => setCareerCluster(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-indigo-500"
            >
              {CLUSTERS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              Pernyataan Minat & Ambisi Vokasi
            </label>
            <textarea
              rows={2}
              placeholder="Apa yang secara spesifik ingin dibuat, dirakit, atau diproduksi oleh siswa ini?"
              value={statementOfIntent}
              onChange={(e) => setStatementOfIntent(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Tools required section */}
          <div className="pt-2 border-t border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-cyan-400" />
                <span>Peralatan & Mesin yang Dibutuhkan</span>
              </span>
              <button
                type="button"
                onClick={handleAddToolRow}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Tambah Baris Alat
              </button>
            </div>
            {tools.map((t, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Nama alat (misal: 3D Printer, Multimeter Digital)"
                  value={t.name}
                  onChange={(e) => {
                    const updated = [...tools];
                    updated[idx].name = e.target.value;
                    setTools(updated);
                  }}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white"
                />
                <select
                  value={t.priority}
                  onChange={(e) => {
                    const updated = [...tools];
                    updated[idx].priority = e.target.value as any;
                    setTools(updated);
                  }}
                  className="px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-[11px]"
                >
                  <option value="Kritis">Kritis</option>
                  <option value="Direkomendasikan">Direkomendasikan</option>
                </select>
                {tools.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveToolRow(idx)}
                    className="p-1 text-slate-400 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Materials required section */}
          <div className="pt-2 border-t border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-purple-400" />
                <span>Bahan Baku & Habis Pakai yang Dibutuhkan</span>
              </span>
              <button
                type="button"
                onClick={handleAddMaterialRow}
                className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Tambah Baris Bahan
              </button>
            </div>
            {materials.map((m, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Nama bahan (misal: Filamen PLA, Ragi)"
                  value={m.name}
                  onChange={(e) => {
                    const updated = [...materials];
                    updated[idx].name = e.target.value;
                    setMaterials(updated);
                  }}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white"
                />
                <input
                  type="number"
                  placeholder="Jml"
                  value={m.quantity}
                  onChange={(e) => {
                    const updated = [...materials];
                    updated[idx].quantity = parseFloat(e.target.value) || 1;
                    setMaterials(updated);
                  }}
                  className="w-16 px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white"
                />
                <input
                  type="text"
                  placeholder="Satuan (kg, pcs)"
                  value={m.unit}
                  onChange={(e) => {
                    const updated = [...materials];
                    updated[idx].unit = e.target.value;
                    setMaterials(updated);
                  }}
                  className="w-16 px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white"
                />
                {materials.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveMaterialRow(idx)}
                    className="p-1 text-slate-400 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-slate-700 bg-slate-850 flex items-center justify-end gap-2 -mx-5 -mb-5 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-700 text-slate-300 hover:bg-slate-600"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30"
            >
              Simpan Profil Siswa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
