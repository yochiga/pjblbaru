import React, { useState, useMemo } from 'react';
import { InventoryItem } from '../types';
import {
  Wrench,
  Package,
  Search,
  Plus,
  Minus,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  MapPin,
} from 'lucide-react';

interface InventoryManagerProps {
  inventory: InventoryItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onToggleCondition: (id: string) => void;
  onOpenAddInventory: () => void;
}

const LOCATIONS = [
  'Semua Lokasi Fasilitas',
  'Lab Inovasi STEM (Ruang 204)',
  'Dapur Tata Boga (Ruang 112)',
  'Rumah Kaca & Pusat Bio-Pertanian (Kebun Sekolah)',
  'Studio Desain & Tata Busana (Ruang 305)',
  'Studio Media & Penyiaran (Ruang 108)',
  'Bengkel Fabrikasi & Energi Terbarukan (Workshop)',
];

export const InventoryManager: React.FC<InventoryManagerProps> = ({
  inventory,
  onUpdateQuantity,
  onToggleCondition,
  onOpenAddInventory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTypeFilter, setActiveTypeFilter] = useState<'all' | 'tool' | 'raw_material'>('all');
  const [selectedLocation, setSelectedLocation] = useState('Semua Lokasi Fasilitas');
  const [onlyLowStock, setOnlyLowStock] = useState(false);

  const filteredItems = useMemo(() => {
    return inventory.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.substitutes || []).some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchType = activeTypeFilter === 'all' || item.type === activeTypeFilter;
      const matchLocation =
        selectedLocation === 'Semua Lokasi Fasilitas' ||
        item.location.includes(selectedLocation.split(' (')[0]);

      const isLowOrDepleted =
        item.condition === 'Maintenance' ||
        item.condition === 'Pemeliharaan' ||
        item.condition === 'Depleted' ||
        item.condition === 'Habis' ||
        item.availableQuantity <= item.minimumThreshold;

      const matchLowStock = !onlyLowStock || isLowOrDepleted;

      return matchSearch && matchType && matchLocation && matchLowStock;
    });
  }, [inventory, searchQuery, activeTypeFilter, selectedLocation, onlyLowStock]);

  const stats = useMemo(() => {
    const tools = inventory.filter((i) => i.type === 'tool');
    const materials = inventory.filter((i) => i.type === 'raw_material');
    const lowStockCount = inventory.filter(
      (i) =>
        i.availableQuantity <= i.minimumThreshold ||
        i.condition === 'Maintenance' ||
        i.condition === 'Pemeliharaan' ||
        i.condition === 'Depleted' ||
        i.condition === 'Habis'
    ).length;

    return {
      totalTools: tools.length,
      availableTools: tools.filter(
        (t) =>
          t.availableQuantity > 0 &&
          (t.condition === 'Operational' || t.condition === 'Beroperasi')
      ).length,
      totalMaterials: materials.length,
      lowStockCount,
    };
  }, [inventory]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-800 via-slate-800 to-cyan-950/40 p-6 border border-slate-700/80 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold mb-2">
              <Wrench className="w-3.5 h-3.5 text-cyan-400" />
              <span>Sumber Daya Bengkel & Fasilitas Lab Sekolah</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Inventaris Lab & Peralatan Bengkel Sekolah
            </h1>
            <p className="mt-1 text-sm text-slate-300 max-w-2xl">
              Audit ketersediaan mesin, alat praktik, dan bahan baku habis pakai di seluruh bengkel kejuruan, rumah kaca sains, dapur komersial, dan lab fabrikasi.
            </p>
          </div>

          <button
            onClick={onOpenAddInventory}
            className="px-4 py-2 text-sm font-semibold rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-1.5 self-start md:self-auto active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Alat / Bahan</span>
          </button>
        </div>

        {/* Quick KPI Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-700/60">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/50">
            <span className="text-[11px] font-medium text-slate-400 block">Total Peralatan & Mesin</span>
            <span className="text-lg font-mono font-bold text-cyan-300">
              {stats.totalTools} unit
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/50">
            <span className="text-[11px] font-medium text-slate-400 block">Alat Siap Operasi</span>
            <span className="text-lg font-mono font-bold text-emerald-400">
              {stats.availableTools} siap pakai
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/50">
            <span className="text-[11px] font-medium text-slate-400 block">Bahan Habis Pakai</span>
            <span className="text-lg font-mono font-bold text-purple-300">
              {stats.totalMaterials} jenis bahan
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/50">
            <span className="text-[11px] font-medium text-slate-400 block">Peringatan Restock / Servis</span>
            <span
              className={`text-lg font-mono font-bold ${
                stats.lowStockCount > 0 ? 'text-amber-400' : 'text-slate-300'
              }`}
            >
              {stats.lowStockCount} barang
            </span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 flex-1 max-w-2xl">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari alat, bahan, pengganti, atau ruangan lab..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              aria-label="Cari barang inventaris"
            />
          </div>

          {/* Location filter */}
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-3 py-2 text-xs font-medium rounded-xl bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            aria-label="Filter berdasarkan Ruang Lab"
          >
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Type pills & Alert toggle */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex p-1 rounded-xl bg-slate-800 border border-slate-700">
            <button
              onClick={() => setActiveTypeFilter('all')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                activeTypeFilter === 'all'
                  ? 'bg-cyan-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Semua ({inventory.length})
            </button>
            <button
              onClick={() => setActiveTypeFilter('tool')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 ${
                activeTypeFilter === 'tool'
                  ? 'bg-cyan-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Wrench className="w-3 h-3" />
              <span>Alat & Mesin ({stats.totalTools})</span>
            </button>
            <button
              onClick={() => setActiveTypeFilter('raw_material')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 ${
                activeTypeFilter === 'raw_material'
                  ? 'bg-cyan-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Package className="w-3 h-3" />
              <span>Bahan Baku ({stats.totalMaterials})</span>
            </button>
          </div>

          <button
            onClick={() => setOnlyLowStock(!onlyLowStock)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all flex items-center gap-1.5 ${
              onlyLowStock
                ? 'bg-amber-500/20 border-amber-500/60 text-amber-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Peringatan Saja</span>
          </button>
        </div>
      </div>

      {/* Inventory Items List / Table */}
      <div className="rounded-2xl bg-slate-800/90 border border-slate-700 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900/80 border-b border-slate-700 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Nama Barang & Kategori</th>
                <th className="py-3 px-3">Tipe</th>
                <th className="py-3 px-3">Lokasi Lab Sekolah</th>
                <th className="py-3 px-3">Tersedia / Total</th>
                <th className="py-3 px-3">Status & Kondisi</th>
                <th className="py-3 px-3">Opsi Pengganti</th>
                <th className="py-3 px-4 text-right">Aksi Cepat Stok</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {filteredItems.map((item) => {
                const isTool = item.type === 'tool';
                const isUnderThreshold = item.availableQuantity <= item.minimumThreshold;
                const isDepletedOrMaint =
                  item.availableQuantity === 0 ||
                  item.condition === 'Maintenance' ||
                  item.condition === 'Pemeliharaan' ||
                  item.condition === 'Depleted' ||
                  item.condition === 'Habis';

                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-700/40 transition-colors ${
                      isDepletedOrMaint ? 'bg-rose-950/10' : ''
                    }`}
                  >
                    {/* Name & Category */}
                    <td className="py-3.5 px-4 font-medium text-slate-100">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            isTool
                              ? 'bg-cyan-950/80 text-cyan-400 border border-cyan-800/60'
                              : 'bg-purple-950/80 text-purple-400 border border-purple-800/60'
                          }`}
                        >
                          {isTool ? (
                            <Wrench className="w-3.5 h-3.5" />
                          ) : (
                            <Package className="w-3.5 h-3.5" />
                          )}
                        </div>
                        <div>
                          <span className="font-semibold text-slate-100 block">
                            {item.name}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {item.category} • Est. Rp {item.costEstimate.toLocaleString('id-ID')} / {item.unit}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          isTool
                            ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                            : 'bg-purple-950 text-purple-300 border border-purple-800'
                        }`}
                      >
                        {isTool ? 'Alat' : 'Bahan'}
                      </span>
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-3 text-slate-300">
                      <span className="flex items-center gap-1 text-[11px]">
                        <MapPin className="w-3 h-3 text-slate-500 flex-shrink-0" />
                        <span className="truncate max-w-[180px]">{item.location}</span>
                      </span>
                    </td>

                    {/* Quantity */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-baseline gap-1.5">
                        <span
                          className={`font-mono font-bold text-sm ${
                            isDepletedOrMaint
                              ? 'text-rose-400'
                              : isUnderThreshold
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          }`}
                        >
                          {item.availableQuantity}
                        </span>
                        <span className="text-slate-400 font-mono text-[11px]">
                          / {item.totalQuantity} {item.unit}
                        </span>
                      </div>
                      {isUnderThreshold && (
                        <span className="text-[10px] text-amber-400 font-medium block">
                          Batas Min: {item.minimumThreshold} {item.unit}
                        </span>
                      )}
                    </td>

                    {/* Condition / Status */}
                    <td className="py-3.5 px-3">
                      {isTool ? (
                        <button
                          onClick={() => onToggleCondition(item.id)}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold transition-all border ${
                            item.condition === 'Operational' || item.condition === 'Beroperasi'
                              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80 hover:bg-emerald-900/60'
                              : 'bg-rose-950/80 text-rose-300 border-rose-800/80 hover:bg-rose-900/60'
                          }`}
                          title="Klik untuk beralih antara Beroperasi dan Pemeliharaan"
                        >
                          {item.condition === 'Operational' || item.condition === 'Beroperasi' ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <RotateCcw className="w-3 h-3" />
                          )}
                          <span>
                            {item.condition === 'Operational' || item.condition === 'Beroperasi'
                              ? 'Beroperasi'
                              : 'Pemeliharaan'}
                          </span>
                        </button>
                      ) : (
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border ${
                            item.availableQuantity === 0
                              ? 'bg-rose-950/80 text-rose-300 border-rose-800/80'
                              : isUnderThreshold
                              ? 'bg-amber-950/80 text-amber-300 border-amber-800/80'
                              : 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80'
                          }`}
                        >
                          {item.availableQuantity === 0
                            ? 'Habis'
                            : isUnderThreshold
                            ? 'Stok Rendah'
                            : 'Stok Cukup'}
                        </span>
                      )}
                    </td>

                    {/* Substitutes */}
                    <td className="py-3.5 px-3 text-slate-400 text-[11px]">
                      {item.substitutes && item.substitutes.length > 0 ? (
                        <div className="flex flex-wrap gap-1 max-w-[190px]">
                          {item.substitutes.map((s, idx) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700/80 text-[10px]"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-600 italic">Belum ada</span>
                      )}
                    </td>

                    {/* Quick Adjust Buttons */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          disabled={item.availableQuantity <= 0}
                          className="w-7 h-7 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:hover:bg-slate-700 text-slate-200 flex items-center justify-center transition-all"
                          title="Gunakan Praktik / Ambil 1"
                          aria-label={`Kurangi stok ${item.name}`}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="w-7 h-7 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 flex items-center justify-center transition-all"
                          title="Restock / Kembalikan 1"
                          aria-label={`Tambah stok ${item.name}`}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 5)}
                          className="px-1.5 h-7 rounded-lg bg-cyan-900/60 hover:bg-cyan-800/80 text-cyan-300 border border-cyan-700/60 font-mono text-[11px] font-bold transition-all"
                          title="Restock +5"
                        >
                          +5
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
