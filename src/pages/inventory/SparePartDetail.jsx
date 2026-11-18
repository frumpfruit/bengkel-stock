import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Boxes,
  ArrowLeft,
  Edit,
  Trash2,
  MapPin,
  Truck,
  DollarSign,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Package,
  Layers,
  ArrowDownLeft,
  ArrowUpRight,
  Barcode,
  Calendar,
  Share2,
  FileQuestion
} from 'lucide-react';
import { useStock } from '../../context/StockContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/atoms/Button';
import { Card } from '../../components/atoms/Card';
import { StockStatusBadge } from '../../components/atoms/Badge';
import { PageHeader } from '../../components/templates/PageHeader';

export const SparePartDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { spareParts, categories, locations, suppliers, transactions, isAdmin, deleteSparePart } = useStock();
  const { showSuccess, showError } = useToast();

  const part = spareParts.find(
    (p) =>
      String(p.id).toLowerCase() === String(id).toLowerCase() ||
      String(p.code).toLowerCase() === String(id).toLowerCase()
  );

  // Penanganan ID tidak ditemukan (SOAL 03)
  if (!part) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl text-center">
          <div className="w-16 h-16 rounded-3xl bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center mb-5">
            <FileQuestion className="w-8 h-8" />
          </div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300">
            Data Tidak Ditemukan
          </span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-4">
            Spare Part Tidak Ditemukan
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            Suku cadang dengan parameter ID atau Kode SKU <code className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-red-600 font-mono font-bold text-xs">"{id}"</code> tidak terdaftar di sistem bengkel.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-2 justify-center">
            <Button
              variant="secondary"
              size="sm"
              icon={ArrowLeft}
              onClick={() => navigate('/inventory/parts')}
              className="justify-center"
            >
              Kembali ke Katalog
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={Boxes}
              onClick={() => navigate('/')}
              className="justify-center"
            >
              Ke Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const categoryObj = categories.find((c) => c.name === part.category);
  const locationObj = locations.find((l) => l.id === part.locationId);
  const supplierObj = suppliers.find((s) => s.id === part.supplierId);

  // Transaksi terkait part ini
  const relatedTransactions = transactions.filter(
    (t) => String(t.partId) === String(part.id) || t.partName === part.name
  );

  const profitMargin = part.purchasePrice > 0
    ? Math.round(((part.sellPrice - part.purchasePrice) / part.purchasePrice) * 100)
    : 0;

  const totalAssetPart = (Number(part.stock) || 0) * (Number(part.purchasePrice) || 0);
  const totalOmsetPotential = (Number(part.stock) || 0) * (Number(part.sellPrice) || 0);

  const handleDelete = () => {
    if (window.confirm(`Yakin ingin menghapus spare part "${part.name}"?`)) {
      deleteSparePart(part.id);
      showSuccess('Data Dihapus', `Spare part "${part.name}" telah dihapus.`);
      navigate('/inventory/parts');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        icon={Boxes}
        title={part.name}
        subtitle={`Detail informasi spesifikasi, status stok opname, dan riwayat mutasi SKU: ${part.code}`}
        actions={
          <>
            <Button
              variant="secondary"
              size="sm"
              icon={ArrowLeft}
              onClick={() => navigate('/inventory/parts')}
              className="w-full sm:w-auto justify-center"
            >
              Kembali
            </Button>

            {isAdmin && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  icon={Edit}
                  onClick={() => navigate(`/inventory/parts/${part.id}/edit`)}
                  className="w-full sm:w-auto justify-center"
                >
                  Ubah Data
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  icon={Trash2}
                  onClick={handleDelete}
                  className="w-full sm:w-auto justify-center"
                >
                  Hapus
                </Button>
              </>
            )}
          </>
        }
      />

      {/* Main Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card padding="p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
            <span>Stok Fisik Gudang</span>
            <StockStatusBadge status={part.status} />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span
              className={`text-3xl font-black ${
                part.status === 'Habis'
                  ? 'text-red-600'
                  : part.status === 'Menipis'
                  ? 'text-amber-600'
                  : 'text-slate-900 dark:text-white'
              }`}
            >
              {part.stock}
            </span>
            <span className="text-xs text-slate-500 font-bold">{part.unit || 'Pcs'}</span>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Ambang Batas Minimum: <strong className="text-slate-700 dark:text-slate-300">{part.minStock} {part.unit}</strong>
          </p>
        </Card>

        <Card padding="p-5">
          <span className="text-xs text-slate-400 font-bold uppercase">Harga Beli (Modal)</span>
          <div className="mt-3 text-2xl font-black text-slate-800 dark:text-slate-100">
            Rp {(Number(part.purchasePrice) || 0).toLocaleString('id-ID')}
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Nilai Stok Aset: <strong className="text-slate-700 dark:text-slate-300">Rp {totalAssetPart.toLocaleString('id-ID')}</strong>
          </p>
        </Card>

        <Card padding="p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
            <span>Harga Jual Konsumen</span>
            <span className="text-emerald-600 font-bold text-xs">+{profitMargin}% Margin</span>
          </div>
          <div className="mt-3 text-2xl font-black text-emerald-600 dark:text-emerald-400">
            Rp {(Number(part.sellPrice) || 0).toLocaleString('id-ID')}
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Potensi Omset: <strong className="text-slate-700 dark:text-slate-300">Rp {totalOmsetPotential.toLocaleString('id-ID')}</strong>
          </p>
        </Card>

        <Card padding="p-5">
          <span className="text-xs text-slate-400 font-bold uppercase">Kode SKU & Barcode</span>
          <div className="mt-3 font-mono font-black text-lg text-slate-900 dark:text-white tracking-wider">
            {part.code}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400 font-mono">
            <Barcode className="w-4 h-4 text-slate-500" />
            <span>ID: {part.id}</span>
          </div>
        </Card>
      </div>

      {/* Information Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Detail Specification */}
        <div className="lg:col-span-2 space-y-6">
          <Card padding="p-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-red-600" />
              <span>Spesifikasi & Informasi Produk</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 font-medium">Kategori Suku Cadang</span>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-red-500" />
                  <span>{part.category}</span>
                </p>
                {categoryObj && (
                  <p className="text-[11px] text-slate-400 mt-1">{categoryObj.description}</p>
                )}
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 font-medium">Lokasi Rak Gudang</span>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-indigo-500" />
                  <span>{locationObj ? locationObj.name : 'Gudang Utama'}</span>
                </p>
                {locationObj && (
                  <p className="text-[11px] text-slate-400 mt-1">{locationObj.zone} • Kapasitas {locationObj.capacity} unit</p>
                )}
              </div>
            </div>

            <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-400 font-medium">Deskripsi & Catatan Teknis</span>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-1.5 leading-relaxed">
                {part.description || 'Tidak ada catatan teknis tambahan untuk suku cadang ini.'}
              </p>
            </div>
          </Card>

          {/* Riwayat Mutasi Terkait */}
          <Card padding="p-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-red-600" />
              <span>Riwayat Mutasi & Transaksi Terakhir</span>
            </h3>

            {relatedTransactions.length > 0 ? (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {relatedTransactions.slice(0, 5).map((trx) => (
                  <div key={trx.id} className="py-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                          trx.type === 'IN'
                            ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60'
                            : 'bg-red-100 text-red-600 dark:bg-red-950/60'
                        }`}
                      >
                        {trx.type === 'IN' ? (
                          <ArrowDownLeft className="w-4 h-4" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 dark:text-slate-200">
                          {trx.type === 'IN' ? 'Barang Masuk (Restock)' : 'Barang Keluar (Servis)'}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {trx.date} • {trx.reference || trx.customerPlate || 'Tanpa Referensi'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`font-black text-sm ${
                          trx.type === 'IN' ? 'text-emerald-600' : 'text-red-600'
                        }`}
                      >
                        {trx.type === 'IN' ? `+${trx.quantity}` : `-${trx.quantity}`} {part.unit}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                Belum ada transaksi mutasi fisik tercatat untuk suku cadang ini.
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Supplier & Actions */}
        <div className="space-y-6">
          <Card padding="p-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5 text-red-600" />
              <span>Distributor Resmi</span>
            </h3>

            {supplierObj ? (
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 font-medium">Nama Perusahaan</span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                    {supplierObj.name}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Contact Person (PIC)</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {supplierObj.contactPerson}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Nomor Telepon</span>
                  <p className="font-mono text-slate-800 dark:text-slate-200 mt-0.5">
                    {supplierObj.phone}
                  </p>
                </div>
                {supplierObj.phone && (
                  <a
                    href={`https://wa.me/${supplierObj.phone.replace(/[^0-9]/g, '')}?text=Halo%20${encodeURIComponent(supplierObj.name)},%20saya%20ingin%20restock%20spare%20part%20${encodeURIComponent(part.name)}%20(${part.code}).`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full mt-3 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-xs"
                  >
                    <span>Hubungi via WhatsApp</span>
                  </a>
                )}
              </div>
            ) : (
              <div className="text-xs text-slate-400 py-4">
                Informasi distributor tidak ditentukan.
              </div>
            )}
          </Card>

          <Card padding="p-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
              Tindakan Cepat
            </h3>
            <div className="space-y-2">
              <Button
                variant="primary"
                size="sm"
                icon={ArrowDownLeft}
                onClick={() =>
                  navigate('/transactions/incoming', { state: { selectedPartId: part.id } })
                }
                className="w-full justify-center"
              >
                Catat Barang Masuk
              </Button>
              <Button
                variant="secondary"
                size="sm"
                icon={ArrowUpRight}
                onClick={() =>
                  navigate('/transactions/outgoing', { state: { selectedPartId: part.id } })
                }
                className="w-full justify-center"
              >
                Catat Pemakaian Keluar
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
