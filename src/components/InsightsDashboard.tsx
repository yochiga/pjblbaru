import React, { useMemo } from 'react';
import {
  Student,
  InventoryItem,
  SimulationProject,
} from '../types';
import {
  BarChart3,
  Download,
  Printer,
  Package,
  Wrench,
  Compass,
} from 'lucide-react';

interface InsightsDashboardProps {
  students: Student[];
  inventory: InventoryItem[];
  simulations: SimulationProject[];
}

export const InsightsDashboard: React.FC<InsightsDashboardProps> = ({
  students,
  inventory,
}) => {
  // Aggregate demand for tools across all students
  const toolDemand = useMemo(() => {
    const counts: Record<string, { count: number; category: string; inStock: boolean; available: number }> = {};

    students.forEach((s) => {
      s.requirements.tools.forEach((t) => {
        if (!counts[t.name]) {
          const inv = inventory.find(
            (i) =>
              i.name.toLowerCase().includes(t.name.toLowerCase()) ||
              t.name.toLowerCase().includes(i.name.toLowerCase())
          );
          counts[t.name] = {
            count: 0,
            category: t.category,
            inStock: Boolean(inv && inv.availableQuantity > 0),
            available: inv ? inv.availableQuantity : 0,
          };
        }
        counts[t.name].count += 1;
      });
    });

    return Object.entries(counts)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.count - a.count);
  }, [students, inventory]);

  // Aggregate demand for materials across all students
  const materialDemand = useMemo(() => {
    const counts: Record<string, { count: number; category: string; inStock: boolean; available: number; unit: string }> = {};

    students.forEach((s) => {
      s.requirements.materials.forEach((m) => {
        if (!counts[m.name]) {
          const inv = inventory.find(
            (i) =>
              i.name.toLowerCase().includes(m.name.toLowerCase()) ||
              m.name.toLowerCase().includes(i.name.toLowerCase())
          );
          counts[m.name] = {
            count: 0,
            category: m.category,
            inStock: Boolean(inv && inv.availableQuantity >= m.quantityNeeded),
            available: inv ? inv.availableQuantity : 0,
            unit: m.unit,
          };
        }
        counts[m.name].count += 1;
      });
    });

    return Object.entries(counts)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.count - a.count);
  }, [students, inventory]);

  // Cluster breakdown
  const clusterCounts = useMemo(() => {
    const map: Record<string, number> = {};
    students.forEach((s) => {
      map[s.careerCluster] = (map[s.careerCluster] || 0) + 1;
    });
    return Object.entries(map).map(([cluster, count]) => ({ cluster, count }));
  }, [students]);

  const handleExportCSV = () => {
    const headers = [
      'Nama Siswa',
      'Kelas',
      'Profesi Target',
      'Model Usaha',
      'Bidang Kejuruan',
      'Jumlah Alat Diperlukan',
      'Jumlah Bahan Diperlukan',
    ];
    const rows = students.map((s) => [
      `"${s.name}"`,
      `"${s.grade}"`,
      `"${s.targetedProfession}"`,
      `"${s.ventureType}"`,
      `"${s.careerCluster}"`,
      s.requirements.tools.length,
      s.requirements.materials.length,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `VocationCraft_Laporan_Kebutuhan_Siswa_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-800 via-slate-800 to-purple-950/40 p-6 border border-slate-700/80 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-2">
              <BarChart3 className="w-3.5 h-3.5 text-purple-400" />
              <span>Kecerdasan Vokasi & Perencanaan Sumber Daya</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Analisis Kebutuhan Karir & Utilisasi Lab Sekolah
            </h1>
            <p className="mt-1 text-sm text-slate-300 max-w-2xl">
              Wawasan lintas-kohort untuk memetakan minat kejuruan siswa, tingkat keterpakaian alat praktik, dan skala prioritas pengadaan bahan baku laboratorium.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-1.5 active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor Data CSV</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/20 transition-all flex items-center gap-1.5 active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Laporan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cluster Distribution & Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Career Cluster Breakdown */}
        <div className="md:col-span-1 rounded-2xl bg-slate-800/90 border border-slate-700 p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Compass className="w-4 h-4 text-indigo-400" />
            <span>Distribusi Bidang Kejuruan</span>
          </h3>

          <div className="space-y-2.5">
            {clusterCounts.map((item, idx) => {
              const pct = Math.round((item.count / students.length) * 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">{item.cluster}</span>
                    <span className="text-slate-400 font-mono">
                      {item.count} siswa ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* High-Demand Tools Heatmap */}
        <div className="md:col-span-1 rounded-2xl bg-slate-800/90 border border-slate-700 p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Wrench className="w-4 h-4 text-cyan-400" />
            <span>Alat Praktik Paling Banyak Diminati</span>
          </h3>

          <div className="space-y-2">
            {toolDemand.slice(0, 5).map((tool, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-semibold text-slate-200 block">{tool.name}</span>
                  <span className="text-[10px] text-slate-400">
                    Dibutuhkan oleh {tool.count} siswa
                  </span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    tool.inStock
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                      : 'bg-rose-950 text-rose-300 border-rose-800'
                  }`}
                >
                  {tool.inStock ? `${tool.available} Siap` : 'Stok Habis'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* High-Demand Consumables */}
        <div className="md:col-span-1 rounded-2xl bg-slate-800/90 border border-slate-700 p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Package className="w-4 h-4 text-purple-400" />
            <span>Bahan Baku Permintaan Tertinggi</span>
          </h3>

          <div className="space-y-2">
            {materialDemand.slice(0, 5).map((mat, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-semibold text-slate-200 block">{mat.name}</span>
                  <span className="text-[10px] text-slate-400">
                    Dibutuhkan {mat.count} proyek praktik
                  </span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    mat.inStock
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                      : 'bg-amber-950 text-amber-300 border-amber-800'
                  }`}
                >
                  {mat.inStock ? `${mat.available} ${mat.unit}` : 'Stok Rendah'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
