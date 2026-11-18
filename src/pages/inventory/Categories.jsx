import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Search,
  Tag,
  Edit3,
  Trash2,
} from 'lucide-react';
import { useStock } from '../../context/StockContext';
import { useToast } from '../../context/ToastContext';

// Atomic Design Components
import { Button } from '../../components/atoms/Button';
import { Input } from '../../components/atoms/Input';
import { Card } from '../../components/atoms/Card';
import { IconButton } from '../../components/atoms/IconButton';
import { FormField } from '../../components/molecules/FormField';
import { EmptyState } from '../../components/molecules/EmptyState';
import { ConfirmDialog } from '../../components/molecules/ConfirmDialog';
import { Modal } from '../../components/organisms/Modal';
import { PageHeader } from '../../components/templates/PageHeader';

export const Categories = () => {
  const { categories, spareParts, addCategory, updateCategory, deleteCategory, isAdmin } = useStock();
  const { showSuccess, showError, showWarning } = useToast();

  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  const initialForm = {
    name: '',
    code: '',
    description: '',
  };
  const [formData, setFormData] = useState(initialForm);

  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.description?.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setFormData({
      ...initialForm,
      code: `CAT-${String(categories.length + 1).padStart(2, '0')}`,
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setActiveCategory(cat);
    setFormData({
      name: cat.name,
      code: cat.code,
      description: cat.description || '',
    });
    setIsEditModalOpen(true);
  };

  const handleOpenDelete = (cat) => {
    setActiveCategory(cat);
    setIsDeleteModalOpen(true);
  };

  const handleSubmitAdd = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showError('Validasi Gagal', 'Nama kategori wajib diisi.');
      return;
    }
    addCategory(formData);
    showSuccess('Kategori Ditambahkan', `Kategori "${formData.name}" berhasil dibuat.`);
    setIsAddModalOpen(false);
  };

  const handleSubmitEdit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showError('Validasi Gagal', 'Nama kategori wajib diisi.');
      return;
    }
    updateCategory(activeCategory.id, formData);
    showSuccess('Kategori Diperbarui', `Kategori "${formData.name}" telah disimpan.`);
    setIsEditModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!activeCategory) return;
    const partsCount = spareParts.filter((p) => p.category === activeCategory.name).length;
    if (partsCount > 0) {
      showWarning(
        'Kategori Sedang Digunakan',
        `Ada ${partsCount} spare part yang menggunakan kategori ini. Silakan pindahkan kategorinya terlebih dahulu.`
      );
      setIsDeleteModalOpen(false);
      return;
    }
    deleteCategory(activeCategory.id);
    showSuccess('Kategori Dihapus', `Kategori "${activeCategory.name}" telah dihapus.`);
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        icon={Layers}
        title="Kategori Spare Part"
        subtitle="Pengelompokan jenis suku cadang otomotif untuk kemudahan pengorganisasian stok gudang."
        actions={
          isAdmin ? (
            <Button variant="primary" size="sm" icon={Plus} onClick={handleOpenAdd}>
              Tambah Kategori
            </Button>
          ) : (
            <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-semibold">
              Mode Viewer (Read-Only)
            </div>
          )
        }
      />

      {/* Search Toolbar Card */}
      <Card padding="p-4" className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau kode kategori..."
            icon={Search}
          />
        </div>
        <div className="text-xs text-slate-400">
          Total: <strong>{filteredCategories.length}</strong> Kategori
        </div>
      </Card>

      {/* Category Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCategories.map((cat) => {
          const categoryParts = spareParts.filter((p) => p.category === cat.name);
          const totalCategoryStock = categoryParts.reduce((acc, p) => acc + (Number(p.stock) || 0), 0);

          return (
            <Card
              key={cat.id}
              hoverable
              padding="p-5"
              className="flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-11 h-11 rounded-2xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center font-bold">
                    <Tag className="w-5 h-5" />
                  </div>
                  {isAdmin && (
                    <div className="flex items-center gap-1">
                      <IconButton
                        icon={Edit3}
                        title="Edit Kategori"
                        variant="success"
                        onClick={() => handleOpenEdit(cat)}
                      />
                      <IconButton
                        icon={Trash2}
                        title="Hapus Kategori"
                        variant="danger"
                        onClick={() => handleOpenDelete(cat)}
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{cat.name}</h3>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {cat.code}
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                  {cat.description || 'Tidak ada deskripsi rincian.'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-slate-400 block text-[11px]">Jumlah Item</span>
                  <span className="font-black text-slate-800 dark:text-white text-sm">
                    {categoryParts.length} jenis
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-slate-400 block text-[11px]">Total Unit Fisik</span>
                  <span className="font-black text-red-600 dark:text-red-400 text-sm">
                    {totalCategoryStock} unit
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredCategories.length === 0 && (
        <EmptyState
          title="Kategori tidak ditemukan"
          description="Coba ubah kata kunci pencarian Anda atau buat kategori suku cadang baru."
          actionText="Buat Kategori Baru"
          onAction={handleOpenAdd}
        />
      )}

      {/* Modal Add Category */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Tambah Kategori Baru"
        subtitle="Buat pengelompokan suku cadang baru"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmitAdd} className="space-y-4">
          <FormField label="Nama Kategori" required>
            <Input
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Contoh: Ban Luar & Ban Dalam"
            />
          </FormField>

          <FormField label="Kode Singkatan">
            <Input
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              placeholder="Contoh: TYR"
            />
          </FormField>

          <FormField label="Deskripsi">
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Penjelasan jenis komponen dalam kategori ini..."
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#0B0F17]/90 border border-slate-200/90 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500/20 dark:focus:ring-red-500/10 focus:border-red-500 dark:focus:border-red-500/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
            />
          </FormField>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Simpan Kategori
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Edit Category */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Kategori"
        subtitle={activeCategory?.name}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmitEdit} className="space-y-4">
          <FormField label="Nama Kategori" required>
            <Input
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </FormField>

          <FormField label="Kode Singkatan">
            <Input
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
            />
          </FormField>

          <FormField label="Deskripsi">
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#0B0F17]/90 border border-slate-200/90 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500/20 dark:focus:ring-red-500/10 focus:border-red-500 dark:focus:border-red-500/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
            />
          </FormField>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" size="sm" onClick={() => setIsEditModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Perbarui Kategori
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Confirm Delete */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Hapus Kategori?"
        maxWidth="max-w-md"
      >
        <ConfirmDialog
          message={`Yakin ingin menghapus kategori "${activeCategory?.name}"?`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
          confirmText="Hapus Kategori"
        />
      </Modal>
    </div>
  );
};
