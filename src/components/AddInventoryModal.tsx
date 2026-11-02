import React, { useState } from 'react';
import { InventoryItem, ItemType, ItemCondition } from '../types';
import { X, Wrench, Package } from 'lucide-react';

interface AddInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: InventoryItem) => void;
}

const LOCATIONS = [
  'Lab Inovasi STEM (Ruang 204)',
  'Dapur Tata Boga (Ruang 112)',
  'Rumah Kaca & Pusat Bio-Pertanian (Kebun Sekolah)',
  'Studio Desain & Tata Busana (Ruang 305)',
  'Studio Media & Penyiaran (Ruang 108)',
  'Bengkel Fabrikasi & Energi Terbarukan (Workshop)',
];

export const AddInventoryModal: React.FC<AddInventoryModalProps> = ({
  isOpen,
  onClose,
  onAddItem,
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<ItemType>('tool');
  const [category, setCategory] = useState('Elektronika & Perangkat Keras');
  const [location, setLocation] = useState(LOCATIONS[0]);
  const [quantity, setQuantity] = useState(5);
  const [unit, setUnit] = useState('unit');
  const [condition, setCondition] = useState<ItemCondition>('Beroperasi');
  const [minimumThreshold, setMinimumThreshold] = useState(2);
  const [costEstimate, setCostEstimate] = useState(500000);
  const [substitutes, setSubstitutes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newItem: InventoryItem = {
      id: `inv-${type}-${Date.now()}`,
      name: name.trim(),
      type,
      category: category.trim(),
      location,
      totalQuantity: Number(quantity) || 1,
      availableQuantity: Number(quantity) || 1,
      unit: unit.trim() || (type === 'tool' ? 'unit' : 'kg'),
      condition: type === 'tool' ? condition : 'Stok Cukup',
      minimumThreshold: Number(minimumThreshold) || 1,
      costEstimate: Number(costEstimate) || 50000,
      substitutes: substitutes
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      lastRestocked: new Date().toISOString().slice(0, 10),
    };

    onAddItem(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-800 border border-slate-700 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-700 flex items-center justify-between bg-slate-850">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30">
              {type === 'tool' ? <Wrench className="w-5 h-5" /> : <Package className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Tambah Sumber Daya / Stok Sekolah</h2>
              <p className="text-xs text-slate-400">
                Catat peralatan mesin atau bahan habis pakai ke dalam inventaris lab sekolah.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white" aria-label="Tutup form">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div className="flex items-center gap-3">
            <label className="text-[11px] font-semibold text-slate-300">Klasifikasi Barang:</label>
            <div className="inline-flex p-1 rounded-xl bg-slate-900 border border-slate-700">
              <button
                type="button"
                onClick={() => {
                  setType('tool');
                  setUnit('unit');
                }}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  type === 'tool' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Alat / Mesin Praktik
              </button>
              <button
                type="button"
                onClick={() => {
                  setType('raw_material');
                  setUnit('kg');
                }}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  type === 'raw_material' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Bahan Baku / Habis Pakai
              </button>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">Nama Barang *</label>
            <input
              type="text"
              required
              placeholder={type === 'tool' ? 'misal: Mesin Laser Engraver 40W' : 'misal: Lembar Papan Tembaga FR4'}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Kategori</label>
              <input
                type="text"
                placeholder="misal: Fabrikasi & Elektronika"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Jumlah Awal & Satuan</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  value={quantity}
                  onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
                  className="w-20 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
                <input
                  type="text"
                  placeholder="satuan (kg, unit)"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">Lokasi Lab / Ruang Sekolah</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-cyan-500"
            >
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Ambang Batas Minimum</label>
              <input
                type="number"
                min="0"
                value={minimumThreshold}
                onChange={(e) => setMinimumThreshold(parseFloat(e.target.value) || 1)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Estimasi Biaya Satuan (Rp)</label>
              <input
                type="number"
                min="0"
                value={costEstimate}
                onChange={(e) => setCostEstimate(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              Bahan / Alat Pengganti yang Dapat Diterima (pisahkan koma)
            </label>
            <input
              type="text"
              placeholder="misal: Lembar Akrilik, Prototipe Kardus"
              value={substitutes}
              onChange={(e) => setSubstitutes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
            />
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
              className="px-5 py-2 text-xs font-bold rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-600/30"
            >
              Simpan ke Inventaris Lab
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
