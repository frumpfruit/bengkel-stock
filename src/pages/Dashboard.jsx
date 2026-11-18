import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Plus,
  ExternalLink,
} from 'lucide-react';
import gsap from 'gsap';
import { useStock } from '../context/StockContext';
import { useToast } from '../context/ToastContext';

// Atomic Design Components
import { Card } from '../components/atoms/Card';
import { Button } from '../components/atoms/Button';
import { StockStatusBadge } from '../components/atoms/Badge';
import { StatCard } from '../components/molecules/StatCard';
import { StockMovementChart } from '../components/organisms/StockMovementChart';
import { StockStatusGauge } from '../components/organisms/StockStatusGauge';
import { WarehouseActivityCard } from '../components/organisms/WarehouseActivityCard';
import { LowStockAlertCard } from '../components/organisms/LowStockAlertCard';
import { DataTable } from '../components/organisms/DataTable';

export const Dashboard = ({ onOpenNewPartModal }) => {
  const { stats, spareParts, movementChartData, settings } = useStock();
  const { showSuccess } = useToast();
  const navigate = useNavigate();

  const [selectedYear, setSelectedYear] = useState('2026');
  const [filterCategory, setFilterCategory] = useState('Semua');

  const dashboardRef = useRef(null);

  useEffect(() => {
    if (dashboardRef.current) {
      gsap.fromTo(
        '.gsap-card',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.45, stagger: 0.06, ease: 'power2.out' }
      );
    }
  }, []);

  const recentParts = spareParts
    .filter((p) => filterCategory === 'Semua' || p.category === filterCategory)
    .slice(0, 6);

  const exportMovementCSV = () => {
    const headers = 'Bulan,Barang Masuk (Unit),Barang Keluar (Unit),Frekuensi Restock\n';
    const rows = movementChartData
      .map((r) => `${r.month},${r.masuk},${r.keluar},${r.restock}`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BengkelStock_Pergerakan_${selectedYear}.csv`;
    link.click();
    showSuccess('Laporan Diunduh', 'Data pergerakan stok berhasil diekspor ke CSV.');
  };

  const recentColumns = [
    {
      header: 'Kode SKU',
      key: 'code',
      render: (part) => (
        <span className="font-mono text-xs font-bold bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md text-slate-700 dark:text-slate-300">
          {part.code}
        </span>
      ),
    },
    {
      header: 'Nama Spare Part',
      key: 'name',
      render: (part) => (
        <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
          {part.name}
        </span>
      ),
    },
    {
      header: 'Kategori',
      key: 'category',
      className: 'text-xs text-slate-500 dark:text-slate-400 font-medium',
    },
    {
      header: 'Stok Fisik',
      key: 'stock',
      render: (part) => (
        <span>
          <strong className="text-slate-900 dark:text-white text-sm">{part.stock}</strong>{' '}
          <span className="text-xs text-slate-400">{part.unit}</span>
        </span>
      ),
    },
    {
      header: 'Harga Beli',
      key: 'purchasePrice',
      render: (part) => (
        <span className="text-xs text-slate-600 dark:text-slate-400">
          Rp {part.purchasePrice.toLocaleString('id-ID')}
        </span>
      ),
    },
    {
      header: 'Harga Jual',
      key: 'sellPrice',
      render: (part) => (
        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
          Rp {part.sellPrice.toLocaleString('id-ID')}
        </span>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (part) => <StockStatusBadge status={part.status} />,
    },
    {
      header: 'Aksi Cepat',
      key: 'actions',
      align: 'right',
      render: (part) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            size="xs"
            variant="success"
            onClick={() =>
              navigate('/transactions/incoming', { state: { selectedPartId: part.id } })
            }
            className="px-3"
          >
            + Masuk
          </Button>
          <Button
            size="xs"
            variant="danger"
            onClick={() =>
              navigate('/transactions/outgoing', { state: { selectedPartId: part.id } })
            }
            className="px-3"
          >
            - Keluar
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div ref={dashboardRef} className="space-y-7 pb-14">
      {/* Top Welcome Banner with generous padding & perfectly aligned horizontal actions */}
      <div className="gsap-card flex flex-col md:flex-row md:items-center justify-between gap-5 bg-white/80 dark:bg-slate-900/80 p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] backdrop-blur-sm">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Hello Admin! <span className="inline-block animate-wave">👋</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5 max-w-2xl leading-relaxed">
            Selamat datang di panel kendali <strong className="text-slate-700 dark:text-slate-300 font-bold">{settings.workshopName}</strong>. Pantau ketersediaan suku cadang dan logistik secara real-time.
          </p>
        </div>

        {/* Action Controls - Guaranteed Horizontal Alignment */}
        <div className="flex items-center gap-3 sm:gap-4 flex-row shrink-0">
          {/* Year selector pill */}
          <div className="h-11 flex items-center gap-2 px-3.5 bg-slate-100/90 dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200">
            <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-transparent border-none outline-none cursor-pointer pr-1 text-xs font-bold"
            >
              <option value="2026" className="dark:bg-slate-900">Tahun 2026</option>
              <option value="2025" className="dark:bg-slate-900">Tahun 2025</option>
            </select>
          </div>

          {/* Quick Catat Transaksi Button */}
          <Button
            variant="primaryGradient"
            size="md"
            icon={Plus}
            onClick={() => navigate('/transactions/incoming')}
            className="h-11 px-5 font-bold shadow-md shadow-red-500/20 shrink-0"
          >
            Catat Transaksi
          </Button>
        </div>
      </div>

      {/* Level 2: 5 KPI StatCards Row - Responsive Grid that never squishes (1 -> 2 -> 3 -> 5) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5">
        <StatCard
          title="Total Spare Part"
          value={stats.totalParts}
          badgeText="+12.5%"
          badgeType="red"
          percent={75}
          color="#DC2626"
          arrow="up"
          onClick={() => navigate('/inventory/parts')}
        />
        <StatCard
          title="Total Stok"
          value={stats.totalStock.toLocaleString('id-ID')}
          badgeText="+8.2%"
          badgeType="blue"
          percent={85}
          color="#0284C7"
          arrow="down"
        />
        <StatCard
          title="Stok Menipis"
          value={stats.lowStockCount}
          badgeText="Needs Attention"
          badgeType="amber"
          percent={stats.totalParts > 0 ? (stats.lowStockCount / stats.totalParts) * 100 : 25}
          color="#F59E0B"
          arrow="up"
          onClick={() => navigate('/inventory/parts?status=Menipis')}
        />
        <StatCard
          title="Stok Habis"
          value={stats.outOfStockCount}
          badgeText="Needs Restock"
          badgeType="red"
          percent={stats.totalParts > 0 ? (stats.outOfStockCount / stats.totalParts) * 100 : 15}
          color="#DC2626"
          arrow="down"
          onClick={() => navigate('/inventory/parts?status=Habis')}
        />
        <StatCard
          title="Supplier"
          value={stats.totalSuppliers}
          badgeText="+4 New"
          badgeType="purple"
          percent={65}
          color="#8B5CF6"
          arrow="up"
          onClick={() => navigate('/management/suppliers')}
        />
      </div>

      {/* Level 3: Charts Row - Proportional 8 / 4 Column Grid with Identical Stretched Height */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <StockMovementChart
          data={movementChartData}
          year={selectedYear}
          onExportCSV={exportMovementCSV}
          className="lg:col-span-8"
        />
        <StockStatusGauge
          safeCount={stats.safeStockCount}
          lowCount={stats.lowStockCount}
          outCount={stats.outOfStockCount}
          safePercent={stats.safePercent}
          className="lg:col-span-4"
        />
      </div>

      {/* Level 3: Activity & Low Stock Row - Proportional 5 / 7 Column Grid with Identical Stretched Height */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <WarehouseActivityCard
          masukCount={125}
          keluarCount={87}
          restockCount={24}
          assetValue={stats.totalAssetValue}
          className="lg:col-span-5"
        />
        <LowStockAlertCard
          parts={spareParts.filter((p) => p.status === 'Habis' || p.status === 'Menipis')}
          onRestock={(part) =>
            navigate('/transactions/incoming', { state: { selectedPartId: part.id } })
          }
          className="lg:col-span-7"
        />
      </div>

      {/* Level 3: Recent Spare Parts DataTable Organism */}
      <Card padding="p-6 sm:p-8" className="gsap-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Recent Spare Parts
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Daftar inventaris suku cadang terbaru yang tercatat di bengkel
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Category filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="h-10 text-xs font-semibold px-3.5 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            >
              <option value="Semua">Semua Kategori</option>
              <option value="Pelumas & Cairan">Pelumas & Cairan</option>
              <option value="Sistem Pengereman">Sistem Pengereman</option>
              <option value="Kelistrikan & Pengapian">Kelistrikan & Pengapian</option>
              <option value="Mesin & Transmisi">Mesin & Transmisi</option>
              <option value="Kaki-kaki & Suspensi">Kaki-kaki & Suspensi</option>
            </select>

            {/* View All Button */}
            <Link
              to="/inventory/parts"
              className="h-10 inline-flex items-center gap-1.5 px-4 text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 hover:bg-red-100 rounded-2xl transition-colors"
            >
              <span>Lihat Semua</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <DataTable
          columns={recentColumns}
          data={recentParts}
          emptyTitle="Belum ada spare part"
          emptyDescription="Tambahkan suku cadang pertama ke katalog."
        />
      </Card>
    </div>
  );
};
