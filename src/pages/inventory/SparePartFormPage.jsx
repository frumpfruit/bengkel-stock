import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Boxes,
  ArrowLeft,
  Save,
  FileQuestion,
  PlusCircle,
  Edit3
} from 'lucide-react';
import { useStock } from '../../context/StockContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/atoms/Button';
import { Input } from '../../components/atoms/Input';
import { Select } from '../../components/atoms/Select';
import { FormField } from '../../components/molecules/FormField';
import { PageHeader } from '../../components/templates/PageHeader';
import { Card } from '../../components/atoms/Card';

export const SparePartFormPage = ({ isEdit = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    spareParts,
    categories,
    locations,
    suppliers,
    addSparePart,
    updateSparePart,
    isAdmin,
  } = useStock();
  const { showSuccess, showError } = useToast();

  const existingPart = isEdit
    ? spareParts.find(
        (p) =>
          String(p.id).toLowerCase() === String(id).toLowerCase() ||
          String(p.code).toLowerCase() === String(id).toLowerCase()
      )
    : null;

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    category: categories[0]?.name || 'Pelumas & Cairan',
    stock: '',
    minStock: '10',
    unit: 'Pcs',
    purchasePrice: '',
    sellPrice: '',
    locationId: locations[0]?.id || 'LOC-01',
    supplierId: suppliers[0]?.id || 'SUP-01',
    description: '',
  });

  // Populate data if editing
  useEffect(() => {
    if (isEdit && existingPart) {
      setFormData({
        code: existingPart.code || '',
        name: existingPart.name || '',
        category: existingPart.category || categories[0]?.name,
        stock: String(existingPart.stock ?? ''),
        minStock: String(existingPart.minStock ?? '10'),
        unit: existingPart.unit || 'Pcs',
        purchasePrice: String(existingPart.purchasePrice ?? ''),
        sellPrice: String(existingPart.sellPrice ?? ''),
        locationId: existingPart.locationId || locations[0]?.id,
        supplierId: existingPart.supplierId || suppliers[0]?.id,
        description: existingPart.description || '',
      });
    } else if (!isEdit) {
      setFormData((prev) => ({
        ...prev,
        code: `SP-${String(spareParts.length + 1).padStart(3, '0')}`,
      }));
    }
  }, [isEdit, existingPart, categories, locations, suppliers, spareParts.length]);

  // Penanganan ID tidak ditemukan jika URL edit dibuka dengan ID ngawur (SOAL 03)
  if (isEdit && !existingPart) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl text-center">
          <div className="w-16 h-16 rounded-3xl bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center mb-5">
            <FileQuestion className="w-8 h-8" />
          </div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300">
            ID Tidak Ditemukan
          </span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-4">
            Tidak Dapat Mengubah Data
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            Data suku cadang dengan ID <code className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-red-600 font-mono font-bold text-xs">"{id}"</code> tidak ditemukan di katalog bengkel.
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
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.code.trim()) {
      showError('Gagal Menyimpan', 'Kode SKU dan Nama Spare Part wajib diisi!');
      return;
    }

    const payload = {
      ...formData,
      stock: Number(formData.stock) || 0,
      minStock: Number(formData.minStock) || 10,
      purchasePrice: Number(formData.purchasePrice) || 0,
      sellPrice: Number(formData.sellPrice) || 0,
    };

    if (isEdit) {
      updateSparePart(existingPart.id, payload);
      showSuccess('Data Diperbarui', `Spare part "${formData.name}" berhasil diperbarui.`);
      navigate(`/inventory/parts/${existingPart.id}`);
    } else {
      const created = addSparePart(payload);
      showSuccess('Berhasil!', `Spare part "${formData.name}" berhasil ditambahkan.`);
      navigate(`/inventory/parts/${created.id}`);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      <PageHeader
        icon={isEdit ? Edit3 : PlusCircle}
        title={isEdit ? `Ubah Data: ${existingPart.name}` : 'Tambah Spare Part Baru'}
        subtitle={
          isEdit
            ? `Perbarui informasi stok, batas minimum, harga, dan lokasi rak untuk kode SKU ${existingPart.code}.`
            : 'Isi formulir data suku cadang lengkap untuk dicatat ke database inventaris bengkel.'
        }
        actions={
          <Button
            variant="secondary"
            size="sm"
            icon={ArrowLeft}
            onClick={() => navigate(-1)}
          >
            Batal & Kembali
          </Button>
        }
      />

      <Card padding="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField label="Kode SKU / Part Number" required helperText="Kode identifikasi unik barang">
              <Input
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="Contoh: YML-10W40-08"
              />
            </FormField>

            <FormField label="Nama Spare Part" required helperText="Nama resmi suku cadang">
              <Input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Contoh: Oli Yamalube Silver 10W-40 0.8L"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <FormField label="Kategori Suku Cadang" required>
              <Select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                options={categories.map((c) => ({ value: c.name, label: c.name }))}
              />
            </FormField>

            <FormField label="Stok Fisik Awal" required helperText="Jumlah unit yang tersedia di rak">
              <Input
                type="number"
                min="0"
                required
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="0"
              />
            </FormField>

            <FormField label="Batas Minimum Stok" required helperText="Ambang pemicu peringatan stok menipis">
              <Input
                type="number"
                min="0"
                required
                value={formData.minStock}
                onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                placeholder="10"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <FormField label="Satuan Unit" required>
              <Select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                options={[
                  { value: 'Pcs', label: 'Pcs (Pieces)' },
                  { value: 'Botol', label: 'Botol' },
                  { value: 'Set', label: 'Set' },
                  { value: 'Box', label: 'Box / Kotak' },
                  { value: 'Unit', label: 'Unit' },
                  { value: 'Liter', label: 'Liter' },
                ]}
              />
            </FormField>

            <FormField label="Harga Beli (Modal)" required helperText="Harga beli dari distributor (Rp)">
              <Input
                type="number"
                min="0"
                required
                value={formData.purchasePrice}
                onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                placeholder="Contoh: 45000"
              />
            </FormField>

            <FormField label="Harga Jual Konsumen" required helperText="Harga jual ke pelanggan (Rp)">
              <Input
                type="number"
                min="0"
                required
                value={formData.sellPrice}
                onChange={(e) => setFormData({ ...formData, sellPrice: e.target.value })}
                placeholder="Contoh: 55000"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField label="Lokasi Rak Gudang">
              <Select
                value={formData.locationId}
                onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
                options={locations.map((l) => ({ value: l.id, label: `${l.name} (${l.zone})` }))}
              />
            </FormField>

            <FormField label="Distributor / Supplier">
              <Select
                value={formData.supplierId}
                onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                options={suppliers.map((s) => ({ value: s.id, label: s.name }))}
              />
            </FormField>
          </div>

          <FormField label="Deskripsi & Catatan Spesifikasi">
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Tambahkan informasi peruntukan tipe motor, spesifikasi teknis, atau catatan garansi..."
              className="w-full p-3.5 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-slate-800 dark:text-slate-100 placeholder-slate-400"
            />
          </FormField>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={() => navigate('/inventory/parts')}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={Save}
              className="px-6"
            >
              {isEdit ? 'Simpan Perubahan' : 'Tambahkan ke Inventaris'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
