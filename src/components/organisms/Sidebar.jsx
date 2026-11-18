import React from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Boxes,
  Layers,
  MapPin,
  ArrowDownLeft,
  ArrowUpRight,
  Truck,
  FileBarChart2,
  Settings,
  ChevronLeft,
  ChevronRight,
  Wrench,
  X,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  LogOut,
  ShieldCheck,
  Eye
} from 'lucide-react';
import { useStock } from '../../context/StockContext';
import { useToast } from '../../context/ToastContext';
import { IconButton } from '../atoms/IconButton';

export const Sidebar = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
  const { stats, currentUser, logout, isAdmin, isViewer } = useStock();
  const { showSuccess } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const menuSections = [
    {
      title: 'Dashboard',
      items: [
        { label: 'Overview', to: '/', icon: LayoutDashboard, exact: true },
      ],
    },
    {
      title: 'Inventory',
      items: [
        { label: 'Data Spare Part', to: '/inventory/parts', icon: Boxes, badge: stats.lowStockCount > 0 ? stats.lowStockCount : null },
        { label: 'Kategori', to: '/inventory/categories', icon: Layers },
        { label: 'Lokasi Gudang', to: '/inventory/locations', icon: MapPin },
      ],
    },
    {
      title: 'Transaction',
      items: [
        { label: 'Barang Masuk', to: '/transactions/incoming', icon: ArrowDownLeft },
        { label: 'Barang Keluar', to: '/transactions/outgoing', icon: ArrowUpRight },
      ],
    },
    {
      title: 'Management',
      items: [
        { label: 'Supplier', to: '/management/suppliers', icon: Truck },
        { label: 'Laporan', to: '/management/reports', icon: FileBarChart2 },
      ],
    },
    {
      title: 'System',
      items: [
        { label: 'Pengaturan', to: '/settings', icon: Settings },
      ],
    },
  ];

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      setIsMobileOpen(false);
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 transition-all duration-300">
      {/* Brand Header - Height h-20 matching Topbar, spacious & perfectly centered when collapsed */}
      <div className={`relative flex items-center border-b border-slate-100 dark:border-slate-800/80 h-20 transition-all duration-300 ${isCollapsed ? 'justify-center px-0' : 'justify-between px-6'}`}>
        {!isCollapsed ? (
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-red-600 to-red-500 flex items-center justify-center text-white shadow-md shadow-red-500/25 shrink-0">
              <Wrench className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-red-600 to-red-500 dark:from-red-500 dark:to-rose-400 bg-clip-text text-transparent truncate">
                  BengkelStock
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400 dark:border dark:border-red-500/25 shrink-0">
                  PRO
                </span>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-400 font-medium truncate mt-0.5">
                Warehouse & Spare Part
              </p>
            </div>
          </div>
        ) : (
          <div
            className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-red-600 to-red-500 flex items-center justify-center text-white mx-auto"
            title="BengkelStock PRO"
          >
            <Wrench className="w-5 h-5" />
          </div>
        )}

        {/* Mobile close button */}
        <button
          type="button"
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Desktop Floating Toggle Button - Perfectly Centered on the Right Border Line */}
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? 'Perluas Sidebar' : 'Ciutkan Sidebar'}
          className="hidden lg:flex absolute right-0 translate-x-1/2 top-1/2 -translate-y-1/2 z-50 w-7 h-7 bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.12)] items-center justify-center text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-900 transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-300" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-slate-600 dark:text-slate-300" />
          )}
        </button>
      </div>

      {/* Navigation Menus */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {menuSections.map((section, idx) => (
          <div key={idx}>
            {!isCollapsed && (
              <h3 className="px-3 mb-2 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {section.title}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact
                  ? location.pathname === item.to
                  : location.pathname.startsWith(item.to);

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={handleLinkClick}
                    title={isCollapsed ? item.label : undefined}
                    className={`flex items-center gap-3.5 px-3 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 group relative ${isActive
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                      : 'text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-slate-100 hover:bg-red-50/70 dark:hover:bg-slate-800/60'
                      } ${isCollapsed ? 'justify-center px-2.5' : ''}`}
                  >
                    <Icon
                      className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-red-600 dark:group-hover:text-slate-200'
                        }`}
                    />
                    {!isCollapsed && (
                      <span className="flex-1 truncate">{item.label}</span>
                    )}

                    {!isCollapsed && item.badge && (
                      <span
                        className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${isActive
                          ? 'bg-white text-red-700'
                          : 'bg-amber-500 text-white'
                          }`}
                      >
                        {item.badge}
                      </span>
                    )}

                    {isCollapsed && item.badge && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white dark:ring-slate-900" />
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Warehouse Status & Direct Stock Alerts Section */}
      {!isCollapsed && (
        <div className="p-3 m-3 mb-2 rounded-2xl bg-gradient-to-br from-red-50/70 via-orange-50/40 to-slate-50 dark:from-slate-800/60 dark:via-slate-900/60 dark:to-slate-900/90 border border-red-100/90 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Status Gudang</span>
            </div>
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
              {stats.totalStock.toLocaleString('id-ID')} <span className="text-[10px] text-slate-400 font-normal">unit</span>
            </span>
          </div>

          {/* Quick Direct Alert Links to Stock Status */}
          <div className="space-y-1.5 pt-1.5 border-t border-slate-200/60 dark:border-slate-800">
            {/* Alert Stok Menipis with Direct Link */}
            {stats.lowStockCount > 0 && (
              <Link
                to="/inventory/parts?status=Menipis"
                onClick={handleLinkClick}
                className="flex items-center justify-between gap-2 p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 dark:bg-amber-500/15 dark:hover:bg-amber-500/25 border border-amber-300/60 dark:border-amber-500/30 text-amber-800 dark:text-amber-200 transition-all duration-200 group cursor-pointer"
                title="Klik untuk langsung melihat daftar spare part stok menipis"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-5 h-5 rounded-md bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                    <AlertTriangle className="w-3 h-3" />
                  </div>
                  <div className="truncate text-left">
                    <p className="text-[11px] font-bold leading-tight truncate">Stok Menipis</p>
                    <p className="text-[10px] text-amber-700 dark:text-amber-400 leading-tight">
                      {stats.lowStockCount} item perlu restock
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-amber-700 dark:text-amber-300 group-hover:translate-x-0.5 transition-transform shrink-0">
                  <span>Lihat</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            )}

            {/* Alert Stok Habis with Direct Link */}
            {stats.outOfStockCount > 0 && (
              <Link
                to="/inventory/parts?status=Habis"
                onClick={handleLinkClick}
                className="flex items-center justify-between gap-2 p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 dark:bg-red-500/15 dark:hover:bg-red-500/25 border border-red-300/60 dark:border-red-500/30 text-red-800 dark:text-red-200 transition-all duration-200 group cursor-pointer"
                title="Klik untuk langsung melihat daftar spare part stok habis"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-5 h-5 rounded-md bg-red-600 text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                    <AlertCircle className="w-3 h-3" />
                  </div>
                  <div className="truncate text-left">
                    <p className="text-[11px] font-bold leading-tight truncate">Stok Habis!</p>
                    <p className="text-[10px] text-red-700 dark:text-red-400 leading-tight">
                      {stats.outOfStockCount} item kosong
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-red-700 dark:text-red-300 group-hover:translate-x-0.5 transition-transform shrink-0">
                  <span>Lihat</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            )}

            {stats.lowStockCount === 0 && stats.outOfStockCount === 0 && (
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold p-1.5 text-center bg-emerald-50 dark:bg-emerald-950/30 rounded-xl">
                ✓ Seluruh stok dalam kondisi aman
              </div>
            )}
          </div>
        </div>
      )}

      {/* Collapsed Alert Indicators */}
      {isCollapsed && (stats.lowStockCount > 0 || stats.outOfStockCount > 0) && (
        <div className="py-2.5 px-2 flex flex-col items-center gap-2 border-t border-slate-100 dark:border-slate-800">
          {stats.lowStockCount > 0 && (
            <Link
              to="/inventory/parts?status=Menipis"
              title={`${stats.lowStockCount} Item Stok Menipis (Klik untuk buka)`}
              className="w-10 h-10 rounded-2xl bg-amber-100 hover:bg-amber-200 dark:bg-amber-500/20 dark:hover:bg-amber-500/30 text-amber-700 dark:text-amber-400 flex items-center justify-center transition-all relative hover:scale-105 shadow-2xs"
            >
              <AlertTriangle className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-amber-500 text-white text-[10px] font-black flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                {stats.lowStockCount}
              </span>
            </Link>
          )}
          {stats.outOfStockCount > 0 && (
            <Link
              to="/inventory/parts?status=Habis"
              title={`${stats.outOfStockCount} Item Stok Habis (Klik untuk buka)`}
              className="w-10 h-10 rounded-2xl bg-red-100 hover:bg-red-200 dark:bg-red-500/20 dark:hover:bg-red-500/30 text-red-700 dark:text-red-400 flex items-center justify-center transition-all relative hover:scale-105 shadow-2xs"
            >
              <AlertCircle className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                {stats.outOfStockCount}
              </span>
            </Link>
          )}
        </div>
      )}

      {/* User Session & Logout Footer */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800">
        {!isCollapsed ? (
          <div className="flex items-center justify-between p-2 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-red-600 to-red-500 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
                {currentUser?.name ? currentUser.name.charAt(0) : 'B'}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    {currentUser?.name || 'Budi Pratama'}
                  </p>
                  <span
                    className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded ${isAdmin
                      ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300'
                      : 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300'
                      }`}
                  >
                    {isAdmin ? 'Admin' : 'Viewer'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 dark:text-slate-400 truncate mt-0.5">
                  {currentUser?.roleLabel || currentUser?.role || 'Kepala Gudang & Logistik'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                logout();
                showSuccess('Berhasil Keluar', 'Sesi akun Anda telah diakhiri.');
                navigate('/login');
              }}
              title="Keluar (Logout)"
              className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-white dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => {
                logout();
                showSuccess('Berhasil Keluar', 'Sesi akun Anda telah diakhiri.');
                navigate('/login');
              }}
              title="Keluar (Logout)"
              className="p-2.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside
        className={`hidden lg:block fixed top-0 left-0 bottom-0 z-30 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-72'
          }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`lg:hidden fixed top-0 left-0 bottom-0 z-50 w-72 max-w-[85vw] transform transition-transform duration-300 ease-out ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};
