import React, { useState } from 'react';
import {
  FileBarChart2,
  Printer,
  Download,
  DollarSign,
  TrendingUp,
  Package,
  CheckCircle2,
} from 'lucide-react';
import { useStock } from '../../context/StockContext';
import { useToast } from '../../context/ToastContext';

// Atomic Design Components
import { Button } from '../../components/atoms/Button';
import { Card } from '../../components/atoms/Card';
import { Select } from '../../components/atoms/Select';
import { ProgressBar } from '../../components/atoms/ProgressBar';
import { TransactionBadge } from '../../components/atoms/Badge';
import { DataTable } from '../../components/organisms/DataTable';
import { PageHeader } from '../../components/templates/PageHeader';

export const Reports = () => {
  const { stats, spareParts, categories, transactions, settings } = useStock();
  const { showSuccess } = useToast();

  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const outgoingQuantitiesByPart = transactions
    .filter((t) => t.type === 'OUT')
    .reduce((acc, t) => {
      acc[t.sparePartId] = (acc[t.sparePartId] || 0) + Number(t.quantity);
      return acc;
    }, {});

  const fastMovingParts = [...spareParts]
    .map((p) => ({
      ...p,
      soldCount: outgoingQuantitiesByPart[p.id] || 0,
    }))
    .sort((a, b) => b.soldCount - a.soldCount)
    .slice(0, 5);

  const filteredTransactions = transactions.filter((t) => {
    if (selectedCategory !== 'Semua' && t.category !== selectedCategory) return false;
    return true;
  });

  const estimatedProfit = Math.max(0, stats.totalPotentialValue - stats.totalAssetValue);
  const profitMarginPercent =
    stats.totalAssetValue > 0
      ? Math.round((estimatedProfit / stats.totalAssetValue) * 100)
      : 0;

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = 'ID Transaksi,Tipe,Suku Cadang,Kategori,Jumlah,Harga Satuan,Total,Tanggal,Referensi,Penanggung Jawab\n';
    const rows = filteredTransactions
      .map(
        (t) =>
          `"${t.id}","${t.type === 'IN' ? 'Barang Masuk' : 'Barang Keluar'}","${t.sparePartName.replace(/"/g, '""')}","${t.category}",${t.quantity},${t.unitPrice},${t.totalAmount || t.quantity * t.unitPrice},"${t.date}","${t.referenceNo || ''}","${t.handledBy || ''}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Laporan_BengkelStock_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    showSuccess('Laporan Diunduh', 'Rekap mutasi transaksi berhasil diekspor ke file CSV.');
  };

  const mutationColumns = [
    {
      header: 'No. Transaksi',
      key: 'referenceNo',
      render: (trx) => (
        <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
          {trx.referenceNo || trx.id}
        </span>
      ),
    },
    {
      header: 'Tipe',
      key: 'type',
      render: (trx) => <TransactionBadge type={trx.type} />,
    },
    {
      header: 'Suku Cadang',
      key: 'sparePartName',
      render: (trx) => <span className="font-semibold text-slate-900 dark:text-white">{trx.sparePartName}</span>,
    },
    {
      header: 'Kategori',
      key: 'category',
      className: 'text-xs text-slate-500',
    },
    {
      header: 'Qty',
      key: 'quantity',
      align: 'center',
      render: (trx) => (
        <span
          className={`font-black ${trx.type === 'IN' ? 'text-emerald-600' : 'text-red-600'
            }`}
        >
          {trx.type === 'IN' ? `+${trx.quantity}` : `-${trx.quantity}`}
        </span>
      ),
    },
    {
      header: 'Harga Satuan',
      key: 'unitPrice',
      render: (trx) => `Rp ${(trx.unitPrice || 0).toLocaleString('id-ID')}`,
      className: 'text-xs text-slate-600 dark:text-slate-400',
    },
    {
      header: 'Total Nilai',
      key: 'totalAmount',
      render: (trx) => (
        <span className="text-xs font-bold text-slate-900 dark:text-white">
          Rp {((trx.totalAmount) || (trx.quantity * trx.unitPrice)).toLocaleString('id-ID')}
        </span>
      ),
    },
    {
      header: 'Pihak / Nopol',
      key: 'contact',
      render: (trx) => trx.supplierName || trx.customerVehicle || '-',
      className: 'text-xs text-slate-500',
    },
    {
      header: 'Tanggal',
      key: 'date',
      className: 'text-xs text-slate-500',
    },
  ];

  return (
    <div className="space-y-6 pb-12 print:p-0 print:space-y-4">
      {/* PageHeader Template */}
      <PageHeader
        icon={FileBarChart2}
        title="Laporan Stok & Keuangan Gudang"
        subtitle="Analisis valuasi inventaris suku cadang, performa pergerakan logistik, dan rekap."
        actions={
          <div className="flex items-center gap-2.5 sm:gap-3 whitespace-nowrap flex-nowrap">
            <Button
              variant="secondary"
              size="sm"
              icon={Download}
              onClick={handleExportCSV}
              className="whitespace-nowrap"
            >
              Ekspor Rekap CSV
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={Printer}
              onClick={handlePrint}
              className="whitespace-nowrap"
            >
              Cetak / Print Laporan
            </Button>
          </div>
        }
      />

      {/* Official Print Header */}
      <div className="hidden print:block border-b-2 border-slate-900 pb-4 mb-6">
        <h1 className="text-2xl font-black text-slate-900">{settings.workshopName}</h1>
        <p className="text-xs text-slate-600">{settings.workshopAddress} | Telp: {settings.workshopPhone}</p>
        <div className="mt-2 text-sm font-bold text-slate-800">
          LAPORAN REKAPITULASI INVENTARIS & LOGISTIK GUDANG
        </div>
        <p className="text-xs text-slate-500">Dicetak pada: {new Date().toLocaleString('id-ID')}</p>
      </div>

      {/* 4 Financial Valuation Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding="p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2 gap-2">
            <span className="text-xs font-bold uppercase tracking-wider whitespace-nowrap truncate" title="Nilai Modal Stok (Beli)">
              Nilai Modal (Beli)
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center text-slate-700 dark:text-slate-200 shrink-0">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight whitespace-nowrap">
            Rp {stats.totalAssetValue.toLocaleString('id-ID')}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 whitespace-nowrap truncate">
            Total modal fisik di rak
          </p>
        </Card>

        <Card padding="p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2 gap-2">
            <span className="text-xs font-bold uppercase tracking-wider whitespace-nowrap truncate" title="Potensi Omset (Jual)">
              Potensi Omset (Jual)
            </span>
            <div className="w-8 h-8 rounded-xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-red-600 dark:text-red-400 leading-tight whitespace-nowrap">
            Rp {stats.totalPotentialValue.toLocaleString('id-ID')}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 whitespace-nowrap truncate">
            Nilai kotor jika seluruh stok terjual
          </p>
        </Card>

        <Card padding="p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2 gap-2">
            <span className="text-xs font-bold uppercase tracking-wider whitespace-nowrap truncate" title="Potensi Laba Kotor">
              Potensi Laba Kotor
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 leading-tight whitespace-nowrap">
            Rp {estimatedProfit.toLocaleString('id-ID')}
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1 whitespace-nowrap truncate">
            Rata-rata Margin: +{profitMarginPercent}%
          </p>
        </Card>

        <Card padding="p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2 gap-2">
            <span className="text-xs font-bold uppercase tracking-wider whitespace-nowrap truncate" title="Volume Unit Fisik">
              Volume Unit Fisik
            </span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-500/10 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight whitespace-nowrap">
            {stats.totalStock.toLocaleString('id-ID')} unit
          </div>
          <p className="text-[11px] text-slate-400 mt-1 whitespace-nowrap truncate">
            Dari {stats.totalParts} jenis suku cadang
          </p>
        </Card>
      </div>

      {/* Row 2: Fast-Moving Parts vs Category Valuation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fast Moving Parts */}
        <Card padding="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Suku Cadang Terlaris (Fast-Moving)
              </h2>
              <p className="text-xs text-slate-400">
                Item dengan frekuensi pemakaian servis tertinggi
              </p>
            </div>
            <span className="text-xs font-bold text-red-600 bg-red-50 dark:bg-red-950/60 px-2.5 py-1 rounded-xl">
              Top 5
            </span>
          </div>

          <div className="space-y-3">
            {fastMovingParts.map((part, index) => (
              <div
                key={part.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 gap-3"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-7 h-7 rounded-xl bg-white dark:bg-slate-700 text-slate-700 dark:text-white font-extrabold text-xs flex items-center justify-center shadow-xs shrink-0">
                    #{index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate whitespace-nowrap" title={part.name}>
                      {part.name}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate whitespace-nowrap">
                      Sisa Stok: <strong className="text-slate-600 dark:text-slate-300 font-semibold">{part.stock} {part.unit}</strong> • Harga: <span className="font-mono">Rp {part.sellPrice.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0 whitespace-nowrap">
                  <span className="px-2.5 py-1 text-xs font-black text-red-600 bg-red-100/60 dark:bg-red-950/60 rounded-xl whitespace-nowrap">
                    {part.soldCount} keluar
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Category Valuation Breakdown */}
        <Card padding="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white whitespace-nowrap">
                Sebaran Aset per Kategori
              </h2>
              <p className="text-xs text-slate-400 whitespace-nowrap truncate">Valuasi stok berdasarkan kelompok komponen</p>
            </div>
          </div>

          <div className="space-y-3.5">
            {categories.map((cat) => {
              const catParts = spareParts.filter((p) => p.category === cat.name);
              const catAssetVal = catParts.reduce(
                (sum, p) => sum + (Number(p.stock) || 0) * (Number(p.purchasePrice) || 0),
                0
              );
              const percent =
                stats.totalAssetValue > 0
                  ? Math.round((catAssetVal / stats.totalAssetValue) * 100)
                  : 0;

              return (
                <div key={cat.id} className="flex items-center gap-3 sm:gap-4 text-xs py-1">
                  <div className="w-36 sm:w-44 shrink-0 min-w-0">
                    <span
                      className="font-semibold text-slate-800 dark:text-white truncate block text-xs whitespace-nowrap"
                      title={`${cat.name} (${catParts.length} item)`}
                    >
                      {cat.name}{' '}
                      <span className="text-[11px] font-normal text-slate-400 dark:text-slate-500">
                        ({catParts.length})
                      </span>
                    </span>
                  </div>
                  <div className="flex-1 min-w-[60px]">
                    <ProgressBar value={percent} max={100} variant="red" size="md" />
                  </div>
                  <div className="shrink-0 text-right font-mono whitespace-nowrap">
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                      {percent}%
                    </span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 ml-1.5 hidden sm:inline">
                      (Rp {catAssetVal.toLocaleString('id-ID')})
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Row 3: Riwayat Mutasi Transaksi DataTable Organism */}
      <Card padding="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="min-w-0">
            <h2 className="text-base font-bold text-slate-900 dark:text-white whitespace-nowrap truncate">
              Daftar Mutasi Transaksi Barang
            </h2>
            <p className="text-xs text-slate-400 whitespace-nowrap truncate">
              Laporan historis seluruh pergerakan barang masuk dan keluar
            </p>
          </div>

          <div className="flex items-center gap-2 print:hidden shrink-0">
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-48 shrink-0"
            >
              <option value="Semua">Semua Kategori</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <DataTable
          columns={mutationColumns}
          data={filteredTransactions.slice(0, 15)}
          emptyTitle="Belum ada mutasi transaksi"
          emptyDescription="Transaksi masuk dan keluar akan tercatat di tabel ini."
        />
      </Card>
    </div>
  );
};
