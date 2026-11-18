import React, { useState } from 'react';
import {
  MapPin,
  Plus,
  Search,
  Edit3,
  Trash2,
} from 'lucide-react';
import { useStock } from '../../context/StockContext';
import { useToast } from '../../context/ToastContext';

// Atomic Design Components
import { Button } from '../../components/atoms/Button';
import { Input } from '../../components/atoms/Input';
import { Select } from '../../components/atoms/Select';
import { Card } from '../../components/atoms/Card';
import { ProgressBar } from '../../components/atoms/ProgressBar';
import { IconButton } from '../../components/atoms/IconButton';
import { FormField } from '../../components/molecules/FormField';
import { EmptyState } from '../../components/molecules/EmptyState';
import { ConfirmDialog } from '../../components/molecules/ConfirmDialog';
import { Modal } from '../../components/organisms/Modal';
import { PageHeader } from '../../components/templates/PageHeader';

export const Locations = () => {
  const { locations, spareParts, addLocation, updateLocation, deleteLocation, isAdmin } = useStock();
  const { showSuccess, showError, showWarning } = useToast();

  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeLocation, setActiveLocation] = useState(null);

  const initialForm = {
    name: '',
    zone: 'Zona Depan',
    capacity: 200,
    description: '',
  };
  const [formData, setFormData] = useState(initialForm);

  const filteredLocations = locations.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.zone.toLowerCase().includes(search.toLowerCase()) ||
      l.description?.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setFormData({
      ...initialForm,
      name: `Rak ${String.fromCharCode(65 + locations.length)}-01`,
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (loc) => {
    setActiveLocation(loc);
    setFormData({
      name: loc.name,
      zone: loc.zone,
      capacity: loc.capacity,
      description: loc.description || '',
    });
    setIsEditModalOpen(true);
  };

  const handleOpenDelete = (loc) => {
    setActiveLocation(loc);
    setIsDeleteModalOpen(true);
  };

  const handleSubmitAdd = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showError('Validasi Gagal', 'Nama rak atau lokasi wajib diisi.');
      return;
    }
    addLocation({
      ...formData,
      capacity: Number(formData.capacity) || 100,
    });
    showSuccess('Lokasi Ditambahkan', `Lokasi "${formData.name}" berhasil dibuat.`);
    setIsAddModalOpen(false);
  };

  const handleSubmitEdit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showError('Validasi Gagal', 'Nama rak atau lokasi wajib diisi.');
      return;
    }
    updateLocation(activeLocation.id, {
      ...formData,
      capacity: Number(formData.capacity) || 100,
    });
    showSuccess('Lokasi Diperbarui', `Lokasi "${formData.name}" berhasil disimpan.`);
    setIsEditModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!activeLocation) return;
    const partsInLoc = spareParts.filter((p) => p.locationId === activeLocation.id).length;
    if (partsInLoc > 0) {
      showWarning(
        'Lokasi Masih Berisi Barang',
        `Terdapat ${partsInLoc} spare part yang tersimpan di lokasi ini. Pindahkan lokasi suku cadang terlebih dahulu.`
      );
      setIsDeleteModalOpen(false);
      return;
    }
    deleteLocation(activeLocation.id);
    showSuccess('Lokasi Dihapus', `Lokasi "${activeLocation.name}" telah dihapus.`);
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        icon={MapPin}
        title="Lokasi Rak & Gudang"
        subtitle="Petakan zona penyimpanan, rak suku cadang, dan monitor kapasitas muatan fisik."
        actions={
          isAdmin ? (
            <Button variant="primary" size="sm" icon={Plus} onClick={handleOpenAdd}>
              Tambah Lokasi Rak
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
            placeholder="Cari nama rak atau zona penyimpanan..."
            icon={Search}
          />
        </div>
        <div className="text-xs text-slate-400">
          Total: <strong>{filteredLocations.length}</strong> Lokasi Rak
        </div>
      </Card>

      {/* Grid of Locations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredLocations.map((loc) => {
          const storedParts = spareParts.filter((p) => p.locationId === loc.id);
          const totalStoredUnits = storedParts.reduce((acc, p) => acc + (Number(p.stock) || 0), 0);
          const percentUsed = Math.min(100, Math.round((totalStoredUnits / (loc.capacity || 100)) * 100));

          return (
            <Card
              key={loc.id}
              hoverable
              padding="p-5"
              className="flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/60 dark:to-orange-950/40 text-red-600 dark:text-red-400 flex items-center justify-center font-bold">
                    <MapPin className="w-5 h-5" />
                  </div>
                  {isAdmin && (
                    <div className="flex items-center gap-1">
                      <IconButton
                        icon={Edit3}
                        title="Edit Lokasi"
                        variant="success"
                        onClick={() => handleOpenEdit(loc)}
                      />
                      <IconButton
                        icon={Trash2}
                        title="Hapus Lokasi"
                        variant="danger"
                        onClick={() => handleOpenDelete(loc)}
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{loc.name}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {loc.zone}
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                  {loc.description || 'Tidak ada catatan tambahan.'}
                </p>

                {/* Capacity Progress Bar */}
                <div className="mb-4 space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Kapasitas Rak Terpakai:</span>
                    <span className="font-bold text-slate-800 dark:text-white">
                      {totalStoredUnits} / {loc.capacity} ({percentUsed}%)
                    </span>
                  </div>
                  <ProgressBar
                    value={totalStoredUnits}
                    max={loc.capacity || 100}
                    variant={percentUsed >= 90 ? 'red' : percentUsed >= 70 ? 'amber' : 'green'}
                    size="md"
                  />
                </div>
              </div>

              {/* Items sample in this rack */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Daftar Part di Rak Ini ({storedParts.length})
                </div>
                <div className="space-y-1">
                  {storedParts.slice(0, 3).map((p) => (
                    <div
                      key={p.id}
                      className="text-xs text-slate-600 dark:text-slate-300 flex justify-between items-center py-0.5"
                    >
                      <span className="truncate pr-2">• {p.name}</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 flex-shrink-0">
                        {p.stock} {p.unit}
                      </span>
                    </div>
                  ))}
                  {storedParts.length > 3 && (
                    <div className="text-[11px] text-red-600 dark:text-red-400 font-semibold pt-1">
                      +{storedParts.length - 3} item lainnya...
                    </div>
                  )}
                  {storedParts.length === 0 && (
                    <div className="text-xs text-slate-400 italic py-1">
                      Belum ada spare part di rak ini
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredLocations.length === 0 && (
        <EmptyState
          title="Lokasi rak tidak ditemukan"
          description="Coba gunakan kata kunci pencarian lain atau buat penomoran rak baru."
          actionText="Buat Lokasi Baru"
          onAction={handleOpenAdd}
        />
      )}

      {/* Modal Add Location */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Tambah Lokasi / Rak Gudang"
        subtitle="Registrasi rak baru untuk penyimpanan suku cadang"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmitAdd} className="space-y-4">
          <FormField label="Nama Rak / Lokasi" required>
            <Input
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Contoh: Rak E-01 (Kelistrikan)"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Zona Gudang">
              <Select
                value={formData.zone}
                onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
              >
                <option value="Zona Depan">Zona Depan</option>
                <option value="Zona Tengah">Zona Tengah</option>
                <option value="Zona Belakang">Zona Belakang</option>
                <option value="Zona Dalam">Zona Dalam</option>
                <option value="Meja Servis">Meja Servis</option>
              </Select>
            </FormField>

            <FormField label="Kapasitas Maksimal (Unit)">
              <Input
                type="number"
                min="10"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              />
            </FormField>
          </div>

          <FormField label="Keterangan">
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Catatan khusus untuk penempatan suku cadang di rak ini..."
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#0B0F17]/90 border border-slate-200/90 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500/20 dark:focus:ring-red-500/10 focus:border-red-500 dark:focus:border-red-500/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
            />
          </FormField>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Simpan Lokasi
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Edit Location */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Lokasi Rak"
        subtitle={activeLocation?.name}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmitEdit} className="space-y-4">
          <FormField label="Nama Rak / Lokasi" required>
            <Input
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Zona Gudang">
              <Select
                value={formData.zone}
                onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
              >
                <option value="Zona Depan">Zona Depan</option>
                <option value="Zona Tengah">Zona Tengah</option>
                <option value="Zona Belakang">Zona Belakang</option>
                <option value="Zona Dalam">Zona Dalam</option>
                <option value="Meja Servis">Meja Servis</option>
              </Select>
            </FormField>

            <FormField label="Kapasitas Maksimal (Unit)">
              <Input
                type="number"
                min="10"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              />
            </FormField>
          </div>

          <FormField label="Keterangan">
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
              Perbarui Lokasi
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Confirm Delete */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Hapus Lokasi Rak?"
        maxWidth="max-w-md"
      >
        <ConfirmDialog
          message={`Yakin ingin menghapus rak "${activeLocation?.name}"?`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
          confirmText="Hapus Lokasi"
        />
      </Modal>
    </div>
  );
};
