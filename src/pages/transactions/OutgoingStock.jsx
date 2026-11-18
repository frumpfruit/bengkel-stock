import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  ArrowUpRight,
  Minus,
  Search,
  CheckCircle2,
  Trash2,
  AlertOctagon,
  Car
} from 'lucide-react';
import { useStock } from '../../context/StockContext';
import { useToast } from '../../context/ToastContext';

// Atomic Design Components
import { Button } from '../../components/atoms/Button';
import { Input } from '../../components/atoms/Input';
import { Select } from '../../components/atoms/Select';
import { Card } from '../../components/atoms/Card';
import { IconButton } from '../../components/atoms/IconButton';
import { StockStatusBadge } from '../../components/atoms/Badge';
import { FormField } from '../../components/molecules/FormField';
import { ConfirmDialog } from '../../components/molecules/ConfirmDialog';
import { Modal } from '../../components/organisms/Modal';
import { DataTable } from '../../components/organisms/DataTable';
import { PageHeader } from '../../components/templates/PageHeader';

export const OutgoingStock = () => {
  const {
    spareParts,
    transactions,
    recordOutgoingStock,
    deleteTransaction,
    settings,
  } = useStock();

  const { showSuccess, showError, showWarning } = useToast();
  const routeLocation = useLocation();

  const initialPartId = routeLocation.state?.selectedPartId || (spareParts[0]?.id || '');

  const [formData, setFormData] = useState({
    sparePartId: initialPartId,
    customerVehicle: '',
    quantity: '1',
    unitPrice: '',
    referenceNo: `SRV-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    notes: 'Penggantian suku cadang servis berkala',
    handledBy: 'Mekanik Danu',
  });

  const [search, setSearch] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeTrx, setActiveTrx] = useState(null);

  const selectedPart = spareParts.find((p) => p.id === formData.sparePartId) || spareParts[0];

  const handlePartChange = (partId) => {
    const part = spareParts.find((p) => p.id === partId);
    setFormData((prev) => ({
      ...prev,
      sparePartId: partId,
      unitPrice: part ? String(part.sellPrice) : '',
    }));
  };

  const outgoingTransactions = transactions.filter((t) => t.type === 'OUT');
  const filteredTransactions = outgoingTransactions.filter((t) => {
    return (
      t.sparePartName?.toLowerCase().includes(search.toLowerCase()) ||
      t.referenceNo?.toLowerCase().includes(search.toLowerCase()) ||
      t.customerVehicle?.toLowerCase().includes(search.toLowerCase()) ||
      t.id?.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.sparePartId) {
      showError('Gagal', 'Pilih spare part yang akan dikeluarkan.');
      return;
    }
    const qty = Number(formData.quantity);
    if (isNaN(qty) || qty <= 0) {
      showError('Jumlah Tidak Valid', 'Jumlah barang keluar harus minimal 1 unit.');
      return;
    }

    if (!selectedPart || Number(selectedPart.stock) < qty) {
      showError(
        'Stok Tidak Cukup!',
        `Stok ${selectedPart?.name} saat ini hanya tersisa ${selectedPart?.stock} ${selectedPart?.unit}. Anda meminta ${qty} unit.`
      );
      return;
    }

    if (!formData.customerVehicle.trim()) {
      showWarning('Perhatian', 'Harap isi plat nomor kendaraan atau keperluan pengeluaran.');
    }

    try {
      const price = Number(formData.unitPrice) || selectedPart?.sellPrice || 0;
      recordOutgoingStock({
        ...formData,
        quantity: qty,
        unitPrice: price,
      });

      showSuccess(
        'Barang Keluar Berhasil!',
        `${qty} ${selectedPart?.unit} ${selectedPart?.name} telah dikeluarkan dari gudang.`,
        true
      );

      setFormData((prev) => ({
        ...prev,
        quantity: '1',
        customerVehicle: '',
        referenceNo: `SRV-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
        notes: 'Penggantian suku cadang servis berkala',
      }));
    } catch (err) {
      showError('Pengeluaran Ditolak', err.message);
    }
  };

  const handleConfirmDelete = () => {
    if (!activeTrx) return;
    deleteTransaction(activeTrx.id);
    showSuccess(
      'Transaksi Dibatalkan',
      `Catatan barang keluar ${activeTrx.id} dibatalkan dan stok dikembalikan ke rak.`
    );
    setIsDeleteModalOpen(false);
  };

  const historyColumns = [
    {
      header: 'No. Bukti',
      key: 'referenceNo',
      render: (trx) => (
        <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
          {trx.referenceNo || trx.id}
        </span>
      ),
    },
    {
      header: 'Suku Cadang',
      key: 'sparePartName',
      render: (trx) => (
        <div>
          <div className="font-semibold text-slate-900 dark:text-white leading-tight">
            {trx.sparePartName}
          </div>
          <div className="text-[11px] text-slate-400">{trx.category}</div>
        </div>
      ),
    },
    {
      header: 'Nopol / Pelanggan',
      key: 'customerVehicle',
      className: 'text-xs font-medium text-slate-700 dark:text-slate-300',
      render: (trx) => trx.customerVehicle || 'Servis Umum',
    },
    {
      header: 'Jumlah',
      key: 'quantity',
      align: 'center',
      render: (trx) => (
        <span className="font-black text-red-600 dark:text-red-400">
          -{trx.quantity}
        </span>
      ),
    },
    {
      header: 'Total Nilai',
      key: 'totalAmount',
      render: (trx) => (
        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
          Rp {((trx.totalAmount) || (trx.quantity * trx.unitPrice)).toLocaleString('id-ID')}
        </span>
      ),
    },
    {
      header: 'Mekanik',
      key: 'handledBy',
      className: 'text-xs text-slate-500',
    },
    {
      header: 'Tanggal',
      key: 'date',
      render: (trx) => (
        <span className="text-xs text-slate-500">
          {trx.date} <span className="text-[10px] text-slate-400">{trx.time}</span>
        </span>
      ),
    },
    {
      header: 'Aksi',
      key: 'actions',
      align: 'right',
      render: (trx) => (
        <IconButton
          icon={Trash2}
          variant="danger"
          title="Batalkan & Kembalikan ke Stok"
          onClick={() => {
            setActiveTrx(trx);
            setIsDeleteModalOpen(true);
          }}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        icon={ArrowUpRight}
        title="Pengeluaran Barang Keluar (Outbound)"
        subtitle="Catat pemakaian suku cadang untuk servis motor pelanggan atau penjualan counter bengkel."
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Pengeluaran - Spacious 5 Columns */}
        <Card padding="p-6 sm:p-7" className="xl:col-span-5">
          <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-2xl bg-red-50 dark:bg-red-950/60 text-red-600 flex items-center justify-center font-bold">
              <Minus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Form Pengeluaran</h2>
              <p className="text-xs text-slate-400">Pengurangan stok suku cadang</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4.5">
            <FormField label="Pilih Suku Cadang" required>
              <Select
                value={formData.sparePartId}
                onChange={(e) => handlePartChange(e.target.value)}
              >
                {spareParts.map((p) => (
                  <option key={p.id} value={p.id} disabled={p.stock <= 0}>
                    {p.name} {p.stock <= 0 ? '(HABIS)' : `(Stok: ${p.stock} ${p.unit})`}
                  </option>
                ))}
              </Select>
            </FormField>

            {selectedPart && (
              <div
                className={`p-3.5 rounded-2xl border text-xs space-y-1.5 ${
                  selectedPart.stock <= 0
                    ? 'bg-red-50/70 border-red-200 dark:bg-red-500/10 dark:border-red-500/25'
                    : selectedPart.stock <= selectedPart.minStock
                    ? 'bg-amber-50/70 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/25'
                    : 'bg-slate-50 border-slate-200/80 dark:bg-[#0B0F17]/80 dark:border-slate-800'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Stok Tersedia:</span>
                  <div className="flex items-center gap-2">
                    <strong
                      className={`text-sm font-black ${
                        selectedPart.stock <= 0
                          ? 'text-red-600'
                          : selectedPart.stock <= selectedPart.minStock
                          ? 'text-amber-600'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {selectedPart.stock} {selectedPart.unit}
                    </strong>
                    <StockStatusBadge status={selectedPart.status} size="sm" />
                  </div>
                </div>

                {selectedPart.stock <= 0 && (
                  <div className="flex items-center gap-1.5 text-xs text-red-600 font-bold pt-1">
                    <AlertOctagon className="w-4 h-4 flex-shrink-0" />
                    <span>Barang ini sedang habis! Tidak dapat dikeluarkan.</span>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <FormField label="Jumlah Keluar" required>
                <Input
                  type="number"
                  min="1"
                  max={selectedPart ? selectedPart.stock : undefined}
                  required
                  disabled={!selectedPart || selectedPart.stock <= 0}
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                />
              </FormField>

              <FormField label="Harga Jual Satuan">
                <Input
                  type="number"
                  min="0"
                  value={formData.unitPrice || selectedPart?.sellPrice || ''}
                  onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                  placeholder={String(selectedPart?.sellPrice || 0)}
                />
              </FormField>
            </div>

            <FormField label="Nopol / Keperluan Servis" required>
              <Input
                required
                value={formData.customerVehicle}
                onChange={(e) => setFormData({ ...formData, customerVehicle: e.target.value })}
                placeholder="Contoh: B 1234 XYZ (Honda Vario 125)"
                icon={Car}
              />
            </FormField>

            <FormField label="Mekanik / Teknisi">
              <Select
                value={formData.handledBy}
                onChange={(e) => setFormData({ ...formData, handledBy: e.target.value })}
              >
                <option value="Mekanik Danu">Mekanik Danu (Servis Ringan / Matic)</option>
                <option value="Mekanik Gilang">Mekanik Gilang (Kelistrikan & Injeksi)</option>
                <option value="Mekanik Wahyu">Mekanik Wahyu (Turun Mesin & CVT)</option>
                <option value="Kasir Penjualan Langsung">Kasir Penjualan Langsung Counter</option>
              </Select>
            </FormField>

            <FormField label="No. Bukti Servis">
              <Input
                value={formData.referenceNo}
                onChange={(e) => setFormData({ ...formData, referenceNo: e.target.value })}
              />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <FormField label="Tanggal">
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </FormField>

              <FormField label="Jam">
                <Input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
              </FormField>
            </div>

            <FormField label="Catatan Servis">
              <textarea
                rows="2"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full p-3 text-xs sm:text-sm bg-slate-50 dark:bg-[#0B0F17]/90 border border-slate-200/90 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500/20 dark:focus:ring-red-500/10 focus:border-red-500 dark:focus:border-red-500/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
              />
            </FormField>

            <Button
              type="submit"
              variant="danger"
              size="md"
              icon={CheckCircle2}
              disabled={!selectedPart || selectedPart.stock <= 0}
              className="w-full h-11 text-sm font-bold"
            >
              Keluarkan Barang & Kurangi Stok
            </Button>
          </form>
        </Card>

        {/* Right Column: Riwayat Barang Keluar DataTable Organism - Spacious 7 Columns */}
        <Card padding="p-6 sm:p-7" className="xl:col-span-7">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Riwayat Transaksi Barang Keluar</span>
                <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400">
                  {filteredTransactions.length}
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Log pemakaian suku cadang bengkel</p>
            </div>

            <div className="w-full sm:w-64">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari part, nopol, bukti..."
                icon={Search}
              />
            </div>
          </div>

          <DataTable
            columns={historyColumns}
            data={filteredTransactions}
            emptyTitle="Belum ada transaksi barang keluar"
            emptyDescription="Gunakan formulir di sebelah kiri untuk mencatat penggunaan suku cadang kendaraan."
          />
        </Card>
      </div>

      {/* Modal Confirm Rollback */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Batalkan Transaksi Keluar?"
        maxWidth="max-w-md"
      >
        <ConfirmDialog
          message={`Membatalkan pengeluaran ${activeTrx?.referenceNo} akan otomatis menambah kembali stok ${activeTrx?.sparePartName} sebanyak +${activeTrx?.quantity} unit ke dalam gudang.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
          confirmText="Batalkan & Kembalikan Stok"
        />
      </Modal>
    </div>
  );
};
