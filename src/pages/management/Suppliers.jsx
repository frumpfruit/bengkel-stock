import React, { useState } from 'react';
import {
  Truck,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Building2,
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

export const Suppliers = () => {
  const { suppliers, spareParts, addSupplier, updateSupplier, deleteSupplier, isAdmin } = useStock();
  const { showSuccess, showError } = useToast();

  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeSupplier, setActiveSupplier] = useState(null);

  const initialForm = {
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    suppliedCategories: 'Pelumas & Cairan, Sistem Pengereman',
  };
  const [formData, setFormData] = useState(initialForm);

  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.contactPerson?.toLowerCase().includes(search.toLowerCase()) ||
      s.address?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setFormData(initialForm);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (sup) => {
    setActiveSupplier(sup);
    setFormData({
      name: sup.name,
      contactPerson: sup.contactPerson || '',
      phone: sup.phone || '',
      email: sup.email || '',
      address: sup.address || '',
      suppliedCategories: Array.isArray(sup.suppliedCategories)
        ? sup.suppliedCategories.join(', ')
        : sup.suppliedCategories || '',
    });
    setIsEditModalOpen(true);
  };

  const handleOpenDelete = (sup) => {
    setActiveSupplier(sup);
    setIsDeleteModalOpen(true);
  };

  const handleSubmitAdd = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showError('Validasi Gagal', 'Nama distributor/supplier wajib diisi.');
      return;
    }
    const categoriesArray = formData.suppliedCategories
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    addSupplier({
      ...formData,
      suppliedCategories: categoriesArray,
    });
    showSuccess('Supplier Ditambahkan', `Distributor "${formData.name}" berhasil dicatat.`);
    setIsAddModalOpen(false);
  };

  const handleSubmitEdit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showError('Validasi Gagal', 'Nama distributor/supplier wajib diisi.');
      return;
    }
    const categoriesArray = formData.suppliedCategories
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    updateSupplier(activeSupplier.id, {
      ...formData,
      suppliedCategories: categoriesArray,
    });
    showSuccess('Data Diperbarui', `Informasi distributor "${formData.name}" berhasil disimpan.`);
    setIsEditModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!activeSupplier) return;
    deleteSupplier(activeSupplier.id);
    showSuccess('Supplier Dihapus', `Supplier "${activeSupplier.name}" telah dihapus.`);
    setIsDeleteModalOpen(false);
  };

  const getWhatsAppUrl = (phone) => {
    if (!phone) return '#';
    let clean = phone.replace(/[^0-9]/g, '');
    if (clean.startsWith('0')) {
      clean = '62' + clean.slice(1);
    }
    return `https://wa.me/${clean}?text=Halo%20Admin%20Distributor,%20kami%20dari%20Bengkel%20ingin%20menanyakan%20ketersediaan%20stok%20spare%20part.`;
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        icon={Truck}
        title="Manajemen Supplier & Rekanan"
        subtitle="Data kontak pabrikan, distributor resmi suku cadang, dan pemasok oli bengkel."
        actions={
          isAdmin ? (
            <Button variant="primary" size="sm" icon={Plus} onClick={handleOpenAdd}>
              Tambah Supplier
            </Button>
          ) : (
            <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-semibold">
              Mode Viewer (Read-Only)
            </div>
          )
        }
      />

      {/* Search Toolbar */}
      <Card padding="p-4" className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama distributor, PIC kontak, atau lokasi..."
            icon={Search}
          />
        </div>
        <div className="text-xs text-slate-400">
          Total: <strong>{filteredSuppliers.length}</strong> Supplier
        </div>
      </Card>

      {/* Grid of Suppliers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSuppliers.map((sup) => {
          const suppliedParts = spareParts.filter((p) => p.supplierId === sup.id);

          return (
            <Card
              key={sup.id}
              hoverable
              padding="p-5"
              className="flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/60 dark:to-orange-950/40 text-red-600 dark:text-red-400 flex items-center justify-center font-bold">
                    <Building2 className="w-5 h-5" />
                  </div>
                  {isAdmin && (
                    <div className="flex items-center gap-1">
                      <IconButton
                        icon={Edit3}
                        title="Edit Supplier"
                        variant="success"
                        onClick={() => handleOpenEdit(sup)}
                      />
                      <IconButton
                        icon={Trash2}
                        title="Hapus Supplier"
                        variant="danger"
                        onClick={() => handleOpenDelete(sup)}
                      />
                    </div>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-0.5">
                  {sup.name}
                </h3>
                <p className="text-xs text-slate-400 mb-3">
                  PIC: <strong className="text-slate-700 dark:text-slate-300">{sup.contactPerson || '-'}</strong>
                </p>

                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 mb-4">
                  {sup.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{sup.phone}</span>
                    </div>
                  )}
                  {sup.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{sup.email}</span>
                    </div>
                  )}
                  {sup.address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{sup.address}</span>
                    </div>
                  )}
                </div>

                {sup.suppliedCategories && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {(Array.isArray(sup.suppliedCategories)
                      ? sup.suppliedCategories
                      : [sup.suppliedCategories]
                    ).map((c, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                <span className="text-xs text-slate-400 font-medium">
                  {suppliedParts.length} item terdaftar
                </span>

                {sup.phone && (
                  <a
                    href={getWhatsAppUrl(sup.phone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 rounded-xl transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp</span>
                  </a>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {filteredSuppliers.length === 0 && (
        <EmptyState
          title="Distributor tidak ditemukan"
          description="Coba gunakan kata kunci pencarian lain atau tambahkan supplier rekanan baru."
          actionText="Tambah Supplier Baru"
          onAction={handleOpenAdd}
        />
      )}

      {/* Modal Add Supplier */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Tambah Supplier Baru"
        subtitle="Registrasi data vendor & distributor suku cadang"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmitAdd} className="space-y-4">
          <FormField label="Nama Perusahaan / Supplier" required>
            <Input
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Contoh: PT Astra Otoparts Tbk"
            />
          </FormField>

          <FormField label="Nama Kontak (PIC)">
            <Input
              value={formData.contactPerson}
              onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
              placeholder="Contoh: Pak Bambang (Sales)"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="No. Telepon / WhatsApp">
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="0812-XXXX-XXXX"
              />
            </FormField>

            <FormField label="Email">
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="sales@vendor.com"
              />
            </FormField>
          </div>

          <FormField label="Alamat Kantor / Gudang">
            <textarea
              rows="2"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Kawasan Industri, Jl..."
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#0B0F17]/90 border border-slate-200/90 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500/20 dark:focus:ring-red-500/10 focus:border-red-500 dark:focus:border-red-500/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
            />
          </FormField>

          <FormField label="Kategori Pasokan (Pisahkan koma)">
            <Input
              value={formData.suppliedCategories}
              onChange={(e) => setFormData({ ...formData, suppliedCategories: e.target.value })}
              placeholder="Pelumas & Cairan, Busi, Pengereman"
            />
          </FormField>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Simpan Supplier
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Edit Supplier */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Data Supplier"
        subtitle={activeSupplier?.name}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmitEdit} className="space-y-4">
          <FormField label="Nama Perusahaan / Supplier" required>
            <Input
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </FormField>

          <FormField label="Nama Kontak (PIC)">
            <Input
              value={formData.contactPerson}
              onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="No. Telepon / WhatsApp">
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </FormField>

            <FormField label="Email">
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </FormField>
          </div>

          <FormField label="Alamat Kantor / Gudang">
            <textarea
              rows="2"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#0B0F17]/90 border border-slate-200/90 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500/20 dark:focus:ring-red-500/10 focus:border-red-500 dark:focus:border-red-500/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
            />
          </FormField>

          <FormField label="Kategori Pasokan">
            <Input
              value={formData.suppliedCategories}
              onChange={(e) => setFormData({ ...formData, suppliedCategories: e.target.value })}
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

      {/* Modal Confirm Delete */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Hapus Supplier?"
        maxWidth="max-w-md"
      >
        <ConfirmDialog
          message={`Apakah Anda yakin ingin menghapus data rekanan "${activeSupplier?.name}"?`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
          confirmText="Hapus Supplier"
        />
      </Modal>
    </div>
  );
};
