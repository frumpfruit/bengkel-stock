import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Menu,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  Settings,
  AlertTriangle,
  AlertOctagon,
  RefreshCw,
  Plus,
  LogOut
} from 'lucide-react';
import { useStock } from '../../context/StockContext';
import { useToast } from '../../context/ToastContext';
import { SearchBar } from '../molecules/SearchBar';
import { Breadcrumb } from '../molecules/Breadcrumb';
import { Button } from '../atoms/Button';
import { Avatar } from '../atoms/Avatar';
import { IconButton } from '../atoms/IconButton';

export const Topbar = ({ isCollapsed, setIsMobileOpen, onOpenNewPartModal }) => {
  const { settings, stats, spareParts, toggleDarkMode, resetDemoData, currentUser, logout } = useStock();
  const { showSuccess } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifDropdown(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = searchQuery.trim()
    ? spareParts
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
        .map((p) => ({
          ...p,
          title: p.name,
          subtitle: `${p.code} • ${p.category}`,
          badge: `${p.stock} ${p.unit}`,
        }))
    : [];

  const alertItems = spareParts.filter((p) => p.status === 'Menipis' || p.status === 'Habis');

  const getBreadcrumbItems = () => {
    const path = location.pathname;
    if (path === '/') return [{ label: 'Dashboard' }, { label: 'Overview' }];
    if (path === '/inventory/parts') return [{ label: 'Inventory' }, { label: 'Data Spare Part' }];
    if (path === '/inventory/categories') return [{ label: 'Inventory' }, { label: 'Kategori Spare Part' }];
    if (path === '/inventory/locations') return [{ label: 'Inventory' }, { label: 'Lokasi Gudang & Rak' }];
    if (path === '/transactions/incoming') return [{ label: 'Transaction' }, { label: 'Barang Masuk (Inbound)' }];
    if (path === '/transactions/outgoing') return [{ label: 'Transaction' }, { label: 'Barang Keluar (Outbound)' }];
    if (path === '/management/suppliers') return [{ label: 'Management' }, { label: 'Data Supplier' }];
    if (path === '/management/reports') return [{ label: 'Management' }, { label: 'Laporan Stok & Keuangan' }];
    if (path === '/settings') return [{ label: 'System' }, { label: 'Pengaturan Bengkel' }];
    return [{ label: 'Dashboard' }, { label: 'BengkelStock' }];
  };

  const breadcrumbs = getBreadcrumbItems();
  const currentTitle = breadcrumbs[breadcrumbs.length - 1].label;

  return (
    <header className="sticky top-0 z-20 bg-white/85 dark:bg-[#0E131F]/90 backdrop-blur-md border-b border-slate-200/70 dark:border-slate-800/80 transition-all duration-200">
      <div className="flex items-center justify-between px-6 sm:px-8 lg:px-10 h-20 gap-4 sm:gap-6">
        {/* Left: Mobile hamburger & Breadcrumbs */}
        <div className="flex items-center gap-3.5">
          <IconButton
            icon={Menu}
            onClick={() => setIsMobileOpen(true)}
            className="lg:hidden p-2"
            title="Buka Menu"
          />

          <div>
            <Breadcrumb items={breadcrumbs} className="mb-0.5" />
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {currentTitle}
            </h1>
          </div>
        </div>

        {/* Center: SearchBar Molecule */}
        <div className="hidden md:block flex-1 max-w-lg mx-6">
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
            placeholder="Cari spare part, kode SKU, atau kategori..."
            results={searchResults}
            showDropdown={showSearchDropdown}
            setShowDropdown={setShowSearchDropdown}
            onSelectResult={(item) => {
              setSearchQuery('');
              navigate('/inventory/parts', { state: { search: item.name } });
            }}
          />
        </div>

        {/* Right Action Icons: Quick Action, Dark Mode, Notification, Profile */}
        <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
          {onOpenNewPartModal && (
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={onOpenNewPartModal}
              className="hidden sm:inline-flex h-10 px-4"
            >
              Tambah Spare Part
            </Button>
          )}

          {/* Dark Mode Switcher */}
          <IconButton
            icon={settings.darkMode ? Sun : Moon}
            onClick={toggleDarkMode}
            title={settings.darkMode ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
            className="text-slate-500 hover:text-amber-500 p-2"
          />

          {/* Notification Alert Bell */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              className="relative p-2.5 text-slate-600 dark:text-slate-300 hover:text-red-600 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Notifikasi Stok"
            >
              <Bell className="w-5 h-5" />
              {alertItems.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-600 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse" />
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifDropdown && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-5 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">Peringatan Stok</h4>
                    <span className="px-2.5 py-0.5 text-xs font-bold bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400 rounded-full">
                      {alertItems.length}
                    </span>
                  </div>
                  <Link
                    to="/inventory/parts"
                    onClick={() => setShowNotifDropdown(false)}
                    className="text-xs text-red-600 hover:underline font-semibold"
                  >
                    Buka Inventaris
                  </Link>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-72 overflow-y-auto my-2">
                  {alertItems.length > 0 ? (
                    alertItems.map((part) => (
                      <div key={part.id} className="py-3 flex items-start gap-3">
                        <div className="mt-0.5">
                          {part.status === 'Habis' ? (
                            <AlertOctagon className="w-4 h-4 text-red-600" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-800 dark:text-white truncate">
                            {part.name}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Sisa: <strong className={part.status === 'Habis' ? 'text-red-600' : 'text-amber-600'}>{part.stock} {part.unit}</strong> (Min: {part.minStock})
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setShowNotifDropdown(false);
                            navigate('/transactions/incoming', { state: { selectedPartId: part.id } });
                          }}
                          className="px-2.5 py-1 text-[11px] font-semibold text-red-600 dark:text-red-300 bg-red-50 hover:bg-red-100 dark:bg-red-500/15 dark:hover:bg-red-500/25 rounded-lg transition-colors flex-shrink-0"
                        >
                          Restock
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="py-6 text-center text-xs text-slate-400">
                      Semua stok aman terkendali! Tidak ada item yang menipis.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Admin Profile Dropdown */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center gap-3 p-1.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
            >
              <Avatar name={currentUser?.name || settings.adminName} size="md" />
              <div className="hidden md:block text-left">
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
                  {currentUser?.name || settings.adminName}
                </div>
                <div className="text-[11px] text-slate-400 dark:text-slate-400 mt-0.5">
                  {currentUser?.role || settings.adminRole}
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
            </button>

            {/* Profile Menu Dropdown */}
            {showProfileDropdown && (
              <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-[#111827] rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-2.5 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    {currentUser?.name || settings.adminName}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                    {currentUser?.email || 'admin@bengkelstock.com'}
                  </p>
                  <span className="inline-block mt-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300 dark:border dark:border-red-500/25">
                    {currentUser?.role || settings.adminRole}
                  </span>
                </div>
                <div className="py-1.5 space-y-1">
                  <Link
                    to="/settings"
                    onClick={() => setShowProfileDropdown(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/70 rounded-xl transition-colors"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    Pengaturan Sistem
                  </Link>
                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      if (window.confirm('Reset data ke sampel awal? Perubahan yang belum dicadangkan akan hilang.')) {
                        resetDemoData();
                        showSuccess('Data Berhasil Direset', 'Semua data kembali ke konfigurasi demo bawaan.');
                      }
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 rounded-xl transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reset Data Demo
                  </button>

                  <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                  {/* Keluar / Logout Button */}
                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      logout();
                      showSuccess('Berhasil Keluar', 'Sesi kerja bengkel Anda telah diakhiri.');
                      navigate('/login');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/15 rounded-xl transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Keluar (Logout)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
