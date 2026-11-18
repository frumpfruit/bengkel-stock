import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import {
  Boxes,
  Plus,
  Download,
  MapPin,
  AlertTriangle,
  AlertCircle,
  X,
  Eye,
  ShieldAlert,
} from 'lucide-react';
import { useStock } from '../../context/StockContext';
import { useToast } from '../../context/ToastContext';

// Atomic Design Components
import { Button } from '../../components/atoms/Button';
import { Input } from '../../components/atoms/Input';
import { Select } from '../../components/atoms/Select';
import { StockStatusBadge } from '../../components/atoms/Badge';
import { FormField } from '../../components/molecules/FormField';
import { TableActions } from '../../components/molecules/TableActions';
import { ConfirmDialog } from '../../components/molecules/ConfirmDialog';
import { Modal } from '../../components/organisms/Modal';
import { DataTable } from '../../components/organisms/DataTable';
import { PageHeader } from '../../components/templates/PageHeader';
import { FilterToolbar } from '../../components/templates/FilterToolbar';

export const SpareParts = ({ isAddModalOpenFromTopbar, onCloseAddModalFromTopbar }) => {
  const {
    spareParts,
    categories,
    locations,
    suppliers,
    addSparePart,
    updateSparePart,
    deleteSparePart,
    quickAdjustStock,
    isAdmin,
    isViewer,
  } = useStock();

  const { showSuccess, showError } = useToast();
  const routeLocation = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const statusFromUrl = searchParams.get('status');

  const [search, setSearch] = useState(routeLocation.state?.search || '');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedStatus, setSelectedStatus] = useState(
    statusFromUrl && ['Aman', 'Menipis', 'Habis'].includes(statusFromUrl)
      ? statusFromUrl
      : 'Semua'
  );
  const [selectedLocation, setSelectedLocation] = useState('Semua');
  const [sortBy, setSortBy] = useState('name-asc');

  // Sync state if URL query params change (e.g. clicking sidebar links)
  useEffect(() => {
    const statusParam = searchParams.get('status');
    if (statusParam && ['Aman', 'Menipis', 'Habis'].includes(statusParam)) {
      setSelectedStatus(statusParam);
    } else if (statusParam === 'Semua') {
      setSelectedStatus('Semua');
    }
  }, [searchParams]);

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    if (status === 'Semua') {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete('status');
      setSearchParams(nextParams);
    } else {
      setSearchParams({ ...Object.fromEntries(searchParams.entries()), status });
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('Semua');
    setSelectedStatus('Semua');
    setSelectedLocation('Semua');
    setSearchParams({});
  };

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [activePart, setActivePart] = useState(null);

  const initialFormState = {
    code: '',
    name: '',
    category: categories[0]?.name || 'Pelumas & Cairan',
    stock: '',
    minStock: '15',
    unit: 'Pcs',
    purchasePrice: '',
    sellPrice: '',
    locationId: locations[0]?.id || 'LOC-01',
    supplierId: suppliers[0]?.id || 'SUP-01',
    description: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [adjustData, setAdjustData] = useState({ newStock: '', reason: 'Penyesuaian Fisik Opname Gudang' });

  const effectiveIsAddOpen = isAddModalOpen || isAddModalOpenFromTopbar;
  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    if (onCloseAddModalFromTopbar) onCloseAddModalFromTopbar();
  };

  const handleOpenAdd = () => {
    setFormData({
      ...initialFormState,
      code: `SP-${String(spareParts.length + 1).padStart(3, '0')}`,
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (part) => {
    setActivePart(part);
    setFormData({
      code: part.code,
      name: part.name,
      category: part.category,
      stock: String(part.stock),
      minStock: String(part.minStock),
      unit: part.unit || 'Pcs',
      purchasePrice: String(part.purchasePrice),
      sellPrice: String(part.sellPrice),
      locationId: part.locationId || locations[0]?.id,
      supplierId: part.supplierId || suppliers[0]?.id,
      description: part.description || '',
    });
    setIsEditModalOpen(true);
  };

  const handleOpenAdjust = (part) => {
    setActivePart(part);
    setAdjustData({
      newStock: String(part.stock),
      reason: 'Penyesuaian Fisik Opname Gudang',
    });
    setIsAdjustModalOpen(true);
  };

  const handleOpenDetail = (part) => {
    setActivePart(part);
    setIsDetailModalOpen(true);
  };

  const handleOpenDelete = (part) => {
    setActivePart(part);
    setIsDeleteModalOpen(true);
  };

  const handleSubmitAdd = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) {
      showError('Gagal Menyimpan', 'Kode SKU dan Nama Spare Part wajib diisi!');
      return;
    }

    addSparePart({
      ...formData,
      stock: Number(formData.stock) || 0,
      minStock: Number(formData.minStock) || 10,
      purchasePrice: Number(formData.purchasePrice) || 0,
      sellPrice: Number(formData.sellPrice) || 0,
    });

    showSuccess('Berhasil!', `Spare part "${formData.name}" berhasil ditambahkan.`);
    handleCloseAddModal();
  };

  const handleSubmitEdit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) {
      showError('Gagal Memperbarui', 'Kode SKU dan Nama Spare Part wajib diisi!');
      return;
    }

    updateSparePart(activePart.id, {
      ...formData,
      stock: Number(formData.stock) || 0,
      minStock: Number(formData.minStock) || 10,
      purchasePrice: Number(formData.purchasePrice) || 0,
      sellPrice: Number(formData.sellPrice) || 0,
    });

    showSuccess('Data Diperbarui', `Spare part "${formData.name}" berhasil disimpan.`);
    setIsEditModalOpen(false);
  };

  const handleSubmitAdjust = (e) => {
    e.preventDefault();
    const newQty = Number(adjustData.newStock);
    if (isNaN(newQty) || newQty < 0) {
      showError('Jumlah Tidak Valid', 'Stok harus berupa bilangan positif atau 0.');
      return;
    }

    quickAdjustStock(activePart.id, newQty, adjustData.reason);
    showSuccess('Stok Disesuaikan', `Stok ${activePart.name} kini menjadi ${newQty} ${activePart.unit}.`);
    setIsAdjustModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!activePart) return;
    deleteSparePart(activePart.id);
    showSuccess('Data Dihapus', `Spare part "${activePart.name}" telah dihapus.`);
    setIsDeleteModalOpen(false);
  };

  const filteredParts = useMemo(() => {
    return spareParts
      .filter((part) => {
        const matchesSearch =
          part.name.toLowerCase().includes(search.toLowerCase()) ||
          part.code.toLowerCase().includes(search.toLowerCase()) ||
          part.category.toLowerCase().includes(search.toLowerCase());

        const matchesCategory =
          selectedCategory === 'Semua' || part.category === selectedCategory;

        const matchesStatus =
          selectedStatus === 'Semua' || part.status === selectedStatus;

        const matchesLocation =
          selectedLocation === 'Semua' || part.locationId === selectedLocation;

        return matchesSearch && matchesCategory && matchesStatus && matchesLocation;
      })
      .sort((a, b) => {
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
        if (sortBy === 'stock-asc') return a.stock - b.stock;
        if (sortBy === 'stock-desc') return b.stock - a.stock;
        if (sortBy === 'price-desc') return b.sellPrice - a.sellPrice;
        if (sortBy === 'price-asc') return a.sellPrice - b.sellPrice;
        return 0;
      });
  }, [spareParts, search, selectedCategory, selectedStatus, selectedLocation, sortBy]);

  const handleExportCSV = () => {
    const headers = 'ID,Kode,Nama,Kategori,Stok,Satuan,Batas Min,Harga Beli,Harga Jual,Status\n';
    const rows = filteredParts
      .map(
        (p) =>
          `"${p.id}","${p.code}","${p.name.replace(/"/g, '""')}","${p.category}",${p.stock},"${p.unit}",${p.minStock},${p.purchasePrice},${p.sellPrice},"${p.status}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BengkelStock_Inventaris_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    showSuccess('File CSV Berhasil Diunduh', `Mengekspor ${filteredParts.length} data suku cadang.`);
  };

  // DataTable column definitions
  const columns = [
    {
      header: 'Kode SKU',
      key: 'code',
      render: (part) => (
        <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
          {part.code}
        </span>
      ),
    },
    {
      header: 'Nama Spare Part',
      key: 'name',
      render: (part) => (
        <div>
          <div className="font-bold text-slate-900 dark:text-white leading-snug">{part.name}</div>
          {part.description && (
            <div className="text-[11px] text-slate-400 truncate max-w-xs">{part.description}</div>
          )}
        </div>
      ),
    },
    {
      header: 'Kategori',
      key: 'category',
      className: 'text-xs text-slate-600 dark:text-slate-300',
    },
    {
      header: 'Lokasi Rak',
      key: 'locationId',
      render: (part) => {
        const locationObj = locations.find((l) => l.id === part.locationId);
        return (
          <span className="inline-flex items-center gap-1 text-xs text-slate-500">
            <MapPin className="w-3 h-3 text-slate-400" />
            {locationObj ? locationObj.name : 'Gudang'}
          </span>
        );
      },
    },
    {
      header: 'Stok Fisik',
      key: 'stock',
      align: 'center',
      render: (part) => (
        <div>
          <span
            className={`font-black text-sm ${
              part.status === 'Habis'
                ? 'text-red-600'
                : part.status === 'Menipis'
                ? 'text-amber-600'
                : 'text-slate-900 dark:text-white'
            }`}
          >
            {part.stock}
          </span>{' '}
          <span className="text-xs text-slate-400">{part.unit}</span>
        </div>
      ),
    },
    {
      header: 'Min. Stok',
      key: 'minStock',
      render: (part) => `${part.minStock} ${part.unit}`,
      className: 'text-xs text-slate-400',
    },
    {
      header: 'Harga Beli',
      key: 'purchasePrice',
      render: (part) => `Rp ${part.purchasePrice.toLocaleString('id-ID')}`,
      className: 'text-xs text-slate-600 dark:text-slate-400',
    },
    {
      header: 'Harga Jual',
      key: 'sellPrice',
      render: (part) => `Rp ${part.sellPrice.toLocaleString('id-ID')}`,
      className: 'text-xs font-bold text-slate-800 dark:text-slate-200',
    },
    {
      header: 'Status',
      key: 'status',
      render: (part) => <StockStatusBadge status={part.status} />,
    },
    {
      header: 'Aksi',
      key: 'actions',
      align: 'right',
      render: (part) => (
        <TableActions
          onView={() => navigate(`/inventory/parts/${part.id}`)}
          onEdit={isAdmin ? () => navigate(`/inventory/parts/${part.id}/edit`) : undefined}
          onAdjust={isAdmin ? () => handleOpenAdjust(part) : undefined}
          onDelete={isAdmin ? () => handleOpenDelete(part) : undefined}
        />
      ),
    },
  ];

  const sortOptions = [
    { value: 'name-asc', label: 'Nama (A - Z)' },
    { value: 'name-desc', label: 'Nama (Z - A)' },
    { value: 'stock-asc', label: 'Stok Terkecil' },
    { value: 'stock-desc', label: 'Stok Terbesar' },
    { value: 'price-desc', label: 'Harga Jual Tertinggi' },
    { value: 'price-asc', label: 'Harga Jual Termurah' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Level 4: PageHeader Template */}
      <PageHeader
        icon={Boxes}
        title="Data Spare Part Bengkel"
        subtitle="Kelola katalog suku cadang, pantau ambang batas minimum, dan perbarui harga."
        actions={
          <>
            <Button
              variant="secondary"
              size="sm"
              icon={Download}
              onClick={handleExportCSV}
              className="w-full sm:w-auto justify-center"
            >
              Ekspor CSV
            </Button>
            {isAdmin ? (
              <Button
                variant="primary"
                size="sm"
                icon={Plus}
                onClick={() => navigate('/inventory/parts/add')}
                className="w-full sm:w-auto justify-center"
              >
                Tambah Spare Part
              </Button>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-semibold">
                <Eye className="w-3.5 h-3.5" />
                <span>Mode Viewer (Read-Only)</span>
              </div>
            )}
          </>
        }
      />

      {/* Viewer Notice if active */}
      {isViewer && (
        <div className="p-3.5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/50 flex items-center gap-2.5 text-blue-800 dark:text-blue-300 text-xs">
          <Eye className="w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400" />
          <span>
            <strong>Mode Akses Viewer:</strong> Anda dapat melihat seluruh katalog, detail suku cadang, dan mengunduh berkas CSV. Modifikasi data dibatasi untuk peran Administrator.
          </span>
        </div>
      )}

      {/* Level 4: FilterToolbar Template */}
      <FilterToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Cari nama spare part atau kode SKU..."
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        statuses={['Aman', 'Menipis', 'Habis']}
        selectedStatus={selectedStatus}
        onStatusChange={handleStatusChange}
        sortOptions={sortOptions}
        selectedSort={sortBy}
        onSortChange={setSortBy}
        totalResults={filteredParts.length}
        totalItems={spareParts.length}
        onResetFilters={handleResetFilters}
      />

      {/* Alert Banner saat filter Stok Menipis atau Habis aktif (Direct Link Target) */}
      {selectedStatus !== 'Semua' && (
        <div
          className={`p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 border shadow-xs transition-all animate-in fade-in duration-200 ${
            selectedStatus === 'Habis'
              ? 'bg-red-50/90 dark:bg-red-950/40 border-red-200 dark:border-red-900/60 text-red-900 dark:text-red-200'
              : selectedStatus === 'Menipis'
              ? 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200'
              : 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                selectedStatus === 'Habis'
                  ? 'bg-red-600 text-white'
                  : selectedStatus === 'Menipis'
                  ? 'bg-amber-500 text-white'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              {selectedStatus === 'Habis' ? (
                <AlertCircle className="w-5 h-5" />
              ) : (
                <AlertTriangle className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold flex items-center gap-2">
                <span>Filter Aktif Terpilih:</span>
                <span className="underline decoration-2">
                  Stok {selectedStatus === 'Habis' ? 'Habis (0 Unit)' : 'Menipis (Perlu Restock Segera)'}
                </span>
              </div>
              <p className="text-[11px] opacity-80 mt-0.5">
                Ditemukan {filteredParts.length} item suku cadang pada kondisi ini.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleResetFilters}
            className="self-start sm:self-auto px-3 py-1.5 text-xs font-bold rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-2xs border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer text-slate-700 dark:text-slate-200"
          >
            <X className="w-3.5 h-3.5" />
            <span>Tampilkan Semua Stok</span>
          </button>
        </div>
      )}

      {/* Level 3: DataTable Organism */}
      <DataTable
        columns={columns}
        data={filteredParts}
        emptyTitle="Tidak ada suku cadang ditemukan"
        emptyDescription="Tidak ada data yang cocok dengan kriteria pencarian atau filter yang Anda pilih."
        emptyActionText={isAdmin ? "Tambah Spare Part Baru" : undefined}
        onEmptyAction={isAdmin ? () => navigate('/inventory/parts/add') : undefined}
      />

      {/* Level 3: Add Spare Part Modal Organism */}
      <Modal
        isOpen={effectiveIsAddOpen}
        onClose={handleCloseAddModal}
        title="Tambah Spare Part Baru"
        subtitle="Isi rincian informasi suku cadang untuk dicatat ke inventaris gudang"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmitAdd} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Kode SKU / Part Number" required>
              <Input
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="Contoh: YML-10W40-08"
              />
            </FormField>

            <FormField label="Kategori" required>
              <Select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </FormField>
          </div>

          <FormField label="Nama Spare Part" required>
            <Input
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Contoh: Oli Mesin Yamalube Silver 4T 10W-40 0.8L"
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField label="Stok Awal Fisik" required>
              <Input
                type="number"
                min="0"
                required
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="0"
              />
            </FormField>

            <FormField label="Batas Min. Stok" required>
              <Input
                type="number"
                min="1"
                required
                value={formData.minStock}
                onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                placeholder="10"
              />
            </FormField>

            <FormField label="Satuan Unit">
              <Select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              >
                <option value="Pcs">Pcs</option>
                <option value="Botol">Botol</option>
                <option value="Set">Set</option>
                <option value="Kaleng">Kaleng</option>
                <option value="Unit">Unit</option>
                <option value="Dus">Dus</option>
              </Select>
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Harga Beli (Modal) (Rp)">
              <Input
                type="number"
                min="0"
                value={formData.purchasePrice}
                onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                placeholder="Contoh: 45000"
              />
            </FormField>

            <FormField label="Harga Jual (Rp)">
              <Input
                type="number"
                min="0"
                value={formData.sellPrice}
                onChange={(e) => setFormData({ ...formData, sellPrice: e.target.value })}
                placeholder="Contoh: 60000"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Lokasi Gudang / Rak">
              <Select
                value={formData.locationId}
                onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
              >
                {locations.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name} ({l.zone})
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Supplier Rekanan">
              <Select
                value={formData.supplierId}
                onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
              >
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </Select>
            </FormField>
          </div>

          <FormField label="Catatan / Kompatibilitas Motor">
            <textarea
              rows="2"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Contoh: Cocok untuk Honda Vario 125, PCX 150..."
              className="w-full p-3 text-xs sm:text-sm bg-slate-50 dark:bg-[#0B0F17]/90 border border-slate-200/90 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500/20 dark:focus:ring-red-500/10 focus:border-red-500 dark:focus:border-red-500/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
            />
          </FormField>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" size="sm" onClick={handleCloseAddModal}>
              Batal
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Simpan Spare Part
            </Button>
          </div>
        </form>
      </Modal>

      {/* Level 3: Edit Spare Part Modal Organism */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Data Spare Part"
        subtitle={activePart?.name}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmitEdit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Kode SKU / Part Number" required>
              <Input
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              />
            </FormField>

            <FormField label="Kategori" required>
              <Select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </FormField>
          </div>

          <FormField label="Nama Spare Part" required>
            <Input
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField label="Stok Fisik">
              <Input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              />
            </FormField>

            <FormField label="Batas Minimum">
              <Input
                type="number"
                min="1"
                value={formData.minStock}
                onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
              />
            </FormField>

            <FormField label="Satuan Unit">
              <Select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              >
                <option value="Pcs">Pcs</option>
                <option value="Botol">Botol</option>
                <option value="Set">Set</option>
                <option value="Kaleng">Kaleng</option>
                <option value="Unit">Unit</option>
                <option value="Dus">Dus</option>
              </Select>
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Harga Beli (Modal) (Rp)">
              <Input
                type="number"
                min="0"
                value={formData.purchasePrice}
                onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
              />
            </FormField>

            <FormField label="Harga Jual (Rp)">
              <Input
                type="number"
                min="0"
                value={formData.sellPrice}
                onChange={(e) => setFormData({ ...formData, sellPrice: e.target.value })}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Lokasi Gudang / Rak">
              <Select
                value={formData.locationId}
                onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
              >
                {locations.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Supplier">
              <Select
                value={formData.supplierId}
                onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
              >
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </Select>
            </FormField>
          </div>

          <FormField label="Catatan / Spesifikasi">
            <textarea
              rows="2"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 text-xs sm:text-sm bg-slate-50 dark:bg-[#0B0F17]/90 border border-slate-200/90 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500/20 dark:focus:ring-red-500/10 focus:border-red-500 dark:focus:border-red-500/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
            />
          </FormField>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" size="sm" onClick={() => setIsEditModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Perbarui Data
            </Button>
          </div>
        </form>
      </Modal>

      {/* Level 3: Quick Stock Adjust Modal Organism */}
      <Modal
        isOpen={isAdjustModalOpen}
        onClose={() => setIsAdjustModalOpen(false)}
        title="Penyesuaian Stok Cepat"
        subtitle={`Koreksi fisik untuk ${activePart?.name}`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmitAdjust} className="space-y-4">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Stok Saat Ini:</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {activePart?.stock} {activePart?.unit}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Batas Minimum:</span>
              <span className="text-amber-600 font-semibold">
                {activePart?.minStock} {activePart?.unit}
              </span>
            </div>
          </div>

          <FormField label="Stok Fisik Baru (Hasil Hitung)" required>
            <Input
              type="number"
              min="0"
              required
              value={adjustData.newStock}
              onChange={(e) => setAdjustData({ ...adjustData, newStock: e.target.value })}
            />
          </FormField>

          <FormField label="Alasan Penyesuaian">
            <Select
              value={adjustData.reason}
              onChange={(e) => setAdjustData({ ...adjustData, reason: e.target.value })}
            >
              <option value="Penyesuaian Fisik Opname Gudang">Penyesuaian Fisik Opname Gudang</option>
              <option value="Koreksi Salah Input Transaksi">Koreksi Salah Input Transaksi</option>
              <option value="Barang Rusak / Rusak di Rak">Barang Rusak / Rusak di Rak</option>
              <option value="Barang Hilang / Selisih">Barang Hilang / Selisih</option>
            </Select>
          </FormField>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" size="sm" onClick={() => setIsAdjustModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Terapkan Penyesuaian
            </Button>
          </div>
        </form>
      </Modal>

      {/* Level 3: Detail Modal Organism */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Detail Suku Cadang"
        subtitle={activePart?.code}
        maxWidth="max-w-lg"
      >
        {activePart && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 dark:from-slate-800 dark:to-slate-800/60 border border-red-100 dark:border-slate-700">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {activePart.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Kategori: <strong>{activePart.category}</strong>
                  </p>
                </div>
                <StockStatusBadge status={activePart.status} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80">
                <span className="text-slate-400 block mb-0.5">Stok Fisik Tersedia</span>
                <span className="text-lg font-black text-slate-900 dark:text-white">
                  {activePart.stock} {activePart.unit}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80">
                <span className="text-slate-400 block mb-0.5">Batas Minimum Stok</span>
                <span className="text-lg font-black text-amber-600">
                  {activePart.minStock} {activePart.unit}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80">
                <span className="text-slate-400 block mb-0.5">Harga Beli</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  Rp {activePart.purchasePrice.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80">
                <span className="text-slate-400 block mb-0.5">Harga Jual</span>
                <span className="font-bold text-red-600 dark:text-red-400">
                  Rp {activePart.sellPrice.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80">
                <span className="text-slate-400 block mb-0.5">Margin Keuntungan</span>
                <span className="font-bold text-emerald-600">
                  {activePart.purchasePrice > 0
                    ? `+${Math.round(
                        ((activePart.sellPrice - activePart.purchasePrice) /
                          activePart.purchasePrice) *
                          100
                      )}%`
                    : 'N/A'}
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button size="sm" variant="secondary" onClick={() => setIsDetailModalOpen(false)}>
                Tutup
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Level 3: Confirm Delete Modal with ConfirmDialog molecule */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Hapus Suku Cadang?"
        maxWidth="max-w-md"
      >
        <ConfirmDialog
          message={`Apakah Anda yakin ingin menghapus spare part "${activePart?.name}" (${activePart?.code})? Tindakan ini akan menghapus data dari katalog.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
          confirmText="Hapus Sekarang"
        />
      </Modal>
    </div>
  );
};
