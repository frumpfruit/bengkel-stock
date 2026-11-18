import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  ArrowDownLeft,
  Plus,
  Search,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { useStock } from '../../context/StockContext';
import { useToast } from '../../context/ToastContext';

// Atomic Design Components
import { Button } from '../../components/atoms/Button';
import { Input } from '../../components/atoms/Input';
import { Select } from '../../components/atoms/Select';
import { Card } from '../../components/atoms/Card';
import { IconButton } from '../../components/atoms/IconButton';
import { FormField } from '../../components/molecules/FormField';
import { ConfirmDialog } from '../../components/molecules/ConfirmDialog';
import { Modal } from '../../components/organisms/Modal';
import { DataTable } from '../../components/organisms/DataTable';
import { PageHeader } from '../../components/templates/PageHeader';

export const IncomingStock = () => {
  const {
    spareParts,
    suppliers,
    transactions,
    recordIncomingStock,
    deleteTransaction,
    settings,
  } = useStock();

  const { showSuccess, showError } = useToast();
  const routeLocation = useLocation();

  const initialPartId = routeLocation.state?.selectedPartId || (spareParts[0]?.id || '');

  const [formData, setFormData] = useState({
    sparePartId: initialPartId,
    supplierName: suppliers[0]?.name || 'PT Astra Otoparts Tbk',
    quantity: '10',
    unitPrice: '',
    referenceNo: `PO-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    notes: 'Penerimaan restock suku cadang',
    handledBy: settings.adminName || 'Admin Gudang',
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
      unitPrice: part ? String(part.purchasePrice) : '',
    }));
  };

  const incomingTransactions = transactions.filter((t) => t.type === 'IN');
  const filteredTransactions = incomingTransactions.filter((t) => {
    return (
      t.sparePartName?.toLowerCase().includes(search.toLowerCase()) ||
      t.referenceNo?.toLowerCase().includes(search.toLowerCase()) ||
      t.supplierName?.toLowerCase().includes(search.toLowerCase()) ||
      t.id?.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.sparePartId) {
      showError('Gagal', 'Pilih spare part yang akan direstock.');
      return;
    }
    const qty = Number(formData.quantity);
    if (isNaN(qty) || qty <= 0) {
      showError('Jumlah Tidak Valid', 'Jumlah barang masuk harus minimal 1 unit.');
      return;
    }

    try {
      const price = Number(formData.unitPrice) || selectedPart?.purchasePrice || 0;
      recordIncomingStock({
        ...formData,
        quantity: qty,
        unitPrice: price,
      });

      showSuccess(
        'Barang Masuk Berhasil!',
        `Stok ${selectedPart?.name} bertambah +${qty} ${selectedPart?.unit}.`,
        true
      );

      setFormData((prev) => ({
        ...prev,
        quantity: '10',
        referenceNo: `PO-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
        notes: 'Penerimaan restock suku cadang',
      }));
    } catch (err) {
      showError('Terjadi Kesalahan', err.message);
    }
  };

  const handleConfirmDelete = () => {
    if (!activeTrx) return;
    deleteTransaction(activeTrx.id);
    showSuccess(
      'Transaksi Dibatalkan',
      `Catatan barang masuk ${activeTrx.id} dibatalkan dan stok dikembalikan.`
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
      header: 'Supplier',
      key: 'supplierName',
      className: 'text-xs text-slate-600 dark:text-slate-300',
      render: (trx) => trx.supplierName || 'Pemasok Umum',
    },
    {
      header: 'Jumlah',
      key: 'quantity',
      align: 'center',
      render: (trx) => (
        <span className="font-black text-emerald-600 dark:text-emerald-400">
          +{trx.quantity}
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
          title="Batalkan & Rollback Stok"
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
        icon={ArrowDownLeft}
        title="Penerimaan Barang Masuk (Inbound)"
        subtitle="Catat pasokan barang dari supplier ke gudang. Stok suku cadang akan otomatis bertambah."
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Input Organism - Spacious 5 Columns */}
        <Card padding="p-6 sm:p-7" className="xl:col-span-5">
          <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Form Barang Masuk</h2>
              <p className="text-xs text-slate-400">Restock suku cadang bengkel</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4.5">
            <FormField label="Pilih Suku Cadang" required>
              <Select
                value={formData.sparePartId}
                onChange={(e) => handlePartChange(e.target.value)}
              >
                {spareParts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Stok: {p.stock} {p.unit})
                  </option>
                ))}
              </Select>
            </FormField>

            {selectedPart && (
              <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-xs space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Stok Saat Ini:</span>
                  <strong className="text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                    {selectedPart.stock} {selectedPart.unit}
                  </strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Kode SKU:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">
                    {selectedPart.code}
                  </span>
                </div>
              </div>
            )}

            <FormField label="Supplier / Pemasok">
              <Select
                value={formData.supplierName}
                onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
              >
                {suppliers.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
                <option value="Pembelian Toko Retail">Pembelian Toko Retail / Spot</option>
              </Select>
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <FormField label="Jumlah Masuk" required>
                <Input
                  type="number"
                  min="1"
                  required
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                />
              </FormField>

              <FormField label="Harga Beli / Unit">
                <Input
                  type="number"
                  min="0"
                  value={formData.unitPrice || selectedPart?.purchasePrice || ''}
                  onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                  placeholder={String(selectedPart?.purchasePrice || 0)}
                />
              </FormField>
            </div>

            <FormField label="No. Bukti / PO">
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

            <FormField label="Catatan Penerimaan">
              <textarea
                rows="2"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full p-3 text-xs sm:text-sm bg-slate-50 dark:bg-[#0B0F17]/90 border border-slate-200/90 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-emerald-500/10 focus:border-emerald-500 dark:focus:border-emerald-500/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
              />
            </FormField>

            <Button
              type="submit"
              variant="success"
              size="md"
              icon={CheckCircle2}
              className="w-full h-11 text-sm font-bold"
            >
              Simpan Penerimaan Barang
            </Button>
          </form>
        </Card>

        {/* Right Column: Riwayat Barang Masuk DataTable Organism - Spacious 7 Columns */}
        <Card padding="p-6 sm:p-7" className="xl:col-span-7">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Riwayat Transaksi Barang Masuk</span>
                <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                  {filteredTransactions.length}
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Log historis penambahan stok gudang</p>
            </div>

            <div className="w-full sm:w-64">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari part, PO, supplier..."
                icon={Search}
              />
            </div>
          </div>

          <DataTable
            columns={historyColumns}
            data={filteredTransactions}
            emptyTitle="Belum ada transaksi barang masuk"
            emptyDescription="Gunakan formulir di sebelah kiri untuk mencatat penerimaan stok baru."
          />
        </Card>
      </div>

      {/* Modal Confirm Rollback */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Batalkan Transaksi Masuk?"
        maxWidth="max-w-md"
      >
        <ConfirmDialog
          message={`Membatalkan transaksi ${activeTrx?.referenceNo} akan otomatis mengurangi kembali stok ${activeTrx?.sparePartName} sebanyak ${activeTrx?.quantity} unit.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
          confirmText="Batalkan & Kembalikan Stok"
        />
      </Modal>
    </div>
  );
};
