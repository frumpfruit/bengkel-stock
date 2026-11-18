import React, { useState, useRef } from 'react';
import {
  Settings as SettingsIcon,
  Save,
  Moon,
  Sun,
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  Building,
  User,
} from 'lucide-react';
import { useStock } from '../../context/StockContext';
import { useToast } from '../../context/ToastContext';

// Atomic Design Components
import { Button } from '../../components/atoms/Button';
import { Input } from '../../components/atoms/Input';
import { Card } from '../../components/atoms/Card';
import { FormField } from '../../components/molecules/FormField';
import { ConfirmDialog } from '../../components/molecules/ConfirmDialog';
import { Modal } from '../../components/organisms/Modal';
import { PageHeader } from '../../components/templates/PageHeader';

export const Settings = () => {
  const {
    settings,
    updateSettings,
    toggleDarkMode,
    resetDemoData,
    exportDataJSON,
    importDataJSON,
  } = useStock();

  const { showSuccess, showError } = useToast();

  const [form, setForm] = useState({
    workshopName: settings.workshopName,
    workshopTagline: settings.workshopTagline || '',
    workshopAddress: settings.workshopAddress,
    workshopPhone: settings.workshopPhone,
    adminName: settings.adminName,
    adminRole: settings.adminRole,
    defaultMinStock: String(settings.defaultMinStock || 15),
  });

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!form.workshopName.trim()) {
      showError('Validasi Gagal', 'Nama bengkel tidak boleh kosong.');
      return;
    }
    updateSettings({
      ...form,
      defaultMinStock: Number(form.defaultMinStock) || 10,
    });
    showSuccess('Pengaturan Disimpan', 'Konfigurasi bengkel berhasil diperbarui.');
  };

  const handleReset = () => {
    resetDemoData();
    setIsResetModalOpen(false);
    showSuccess('Data Direset', 'Semua data dan pengaturan telah dikembalikan ke sampel demo awal.');
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        importDataJSON(event.target.result);
        showSuccess('Restorasi Sukses', 'Data cadangan JSON berhasil diimpor ke sistem!');
      } catch (err) {
        showError('Gagal Membaca File', err.message);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        icon={SettingsIcon}
        title="Pengaturan Sistem Bengkel"
        subtitle="Konfigurasi profil bengkel, preferensi tema tampilan, cadangan data, dan pemulihan."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Workshop & Profile Settings */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSaveProfile}>
            <Card padding="p-6" className="space-y-5">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="w-8 h-8 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                  <Building className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Identitas Bengkel
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Nama Bengkel" required>
                  <Input
                    required
                    value={form.workshopName}
                    onChange={(e) => setForm({ ...form, workshopName: e.target.value })}
                  />
                </FormField>

                <FormField label="Slogan / Tagline">
                  <Input
                    value={form.workshopTagline}
                    onChange={(e) => setForm({ ...form, workshopTagline: e.target.value })}
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Nomor Kontak / Telepon">
                  <Input
                    value={form.workshopPhone}
                    onChange={(e) => setForm({ ...form, workshopPhone: e.target.value })}
                  />
                </FormField>

                <FormField label="Batas Default Stok Menipis">
                  <Input
                    type="number"
                    min="1"
                    value={form.defaultMinStock}
                    onChange={(e) => setForm({ ...form, defaultMinStock: e.target.value })}
                  />
                </FormField>
              </div>

              <FormField label="Alamat Lengkap Bengkel">
                <textarea
                  rows="2"
                  value={form.workshopAddress}
                  onChange={(e) => setForm({ ...form, workshopAddress: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#0B0F17]/90 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500/20 dark:focus:ring-red-500/10 focus:border-red-500 dark:focus:border-red-500/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all"
                />
              </FormField>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Profil Pengguna Aktif
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Nama Admin">
                    <Input
                      value={form.adminName}
                      onChange={(e) => setForm({ ...form, adminName: e.target.value })}
                    />
                  </FormField>
                  <FormField label="Jabatan / Peran">
                    <Input
                      value={form.adminRole}
                      onChange={(e) => setForm({ ...form, adminRole: e.target.value })}
                    />
                  </FormField>
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <Button type="submit" variant="primary" icon={Save}>
                  Simpan Perubahan
                </Button>
              </div>
            </Card>
          </form>
        </div>

        {/* Right Column (1 col): Theme, Backup & Restore, Demo Reset */}
        <div className="space-y-6">
          {/* Appearance / Dark Mode */}
          <Card padding="p-6">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
              Tema Tampilan
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-400 mb-4">
              Pilih antara tema cerah (Light Mode) dengan aksen merah-putih atau tema gelap (Dark Mode).
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  if (settings.darkMode) toggleDarkMode();
                }}
                className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                  !settings.darkMode
                    ? 'border-red-500 dark:border-red-500/80 bg-red-50/80 dark:bg-red-500/15 text-red-700 dark:text-red-300 font-bold shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0B0F17]/70 hover:bg-slate-100/60 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Sun className="w-6 h-6 mx-auto mb-1.5 text-amber-500" />
                <span className="text-xs font-bold block">Light Mode</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-400 font-normal">Merah & Putih</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!settings.darkMode) toggleDarkMode();
                }}
                className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                  settings.darkMode
                    ? 'border-red-500 dark:border-red-500/80 bg-red-50/80 dark:bg-red-500/15 text-red-700 dark:text-red-300 font-bold shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0B0F17]/70 hover:bg-slate-100/60 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Moon className="w-6 h-6 mx-auto mb-1.5 text-indigo-400" />
                <span className="text-xs font-bold block">Dark Mode</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-400 font-normal">Sleek Dark Slate</span>
              </button>
            </div>
          </Card>

          {/* Backup & Restore JSON */}
          <Card padding="p-6" className="space-y-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                Cadangan Data (Backup & Restore)
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-400">
                Karena aplikasi berjalan frontend-only menggunakan localStorage, Anda dapat mengunduh seluruh data dalam format JSON.
              </p>
            </div>

            <div className="space-y-2.5">
              <Button
                variant="secondary"
                size="sm"
                icon={Download}
                onClick={exportDataJSON}
                className="w-full"
              >
                Unduh Cadangan (Backup JSON)
              </Button>

              <input
                type="file"
                ref={fileInputRef}
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />

              <Button
                variant="outline"
                size="sm"
                icon={Upload}
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                Pulihkan Data (Import JSON)
              </Button>
            </div>
          </Card>

          {/* Reset Demo Data */}
          <Card padding="p-6" className="border-red-100 dark:border-red-900/30 dark:bg-red-950/10">
            <h2 className="text-sm font-bold text-red-600 dark:text-red-400 mb-1 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>Zona Bahaya</span>
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-400 mb-3 leading-relaxed">
              Ingin menguji aplikasi dari awal? Kembalikan seluruh stok, transaksi, dan katalog ke data demo pabrik.
            </p>

            <Button
              variant="outline"
              size="sm"
              icon={RefreshCw}
              onClick={() => setIsResetModalOpen(true)}
              className="w-full text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/60 hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              Reset ke Sampel Demo Bawaan
            </Button>
          </Card>
        </div>
      </div>

      {/* Modal Confirm Reset */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="Reset Data ke Sampel Demo?"
        maxWidth="max-w-md"
      >
        <ConfirmDialog
          message="Tindakan ini akan menghapus semua suku cadang baru dan mutasi transaksi yang pernah dibuat, lalu memulihkan data demo awal Bengkel."
          onConfirm={handleReset}
          onCancel={() => setIsResetModalOpen(false)}
          confirmText="Ya, Reset Sekarang"
        />
      </Modal>
    </div>
  );
};
