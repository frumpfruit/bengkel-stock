import React, { useState } from 'react';
import { Sidebar } from '../organisms/Sidebar';
import { Topbar } from '../organisms/Topbar';

export const DashboardLayout = ({
  children,
  onOpenNewPartModal,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen app-bg-mesh text-slate-800 dark:text-slate-100 flex flex-col selection:bg-red-500 selection:text-white">
      {/* Sidebar Organism */}
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area Container */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isCollapsed ? 'lg:pl-20' : 'lg:pl-72'
        }`}
      >
        {/* Topbar Organism */}
        <Topbar
          isCollapsed={isCollapsed}
          setIsMobileOpen={setIsMobileOpen}
          onOpenNewPartModal={onOpenNewPartModal}
        />

        {/* Dynamic Route Content with Generous Breathing Room */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10 max-w-[1560px] w-full mx-auto animate-in fade-in duration-300">
          {children}
        </main>

        {/* Footer */}
        <footer className="py-5 px-6 text-center text-xs text-slate-400 dark:text-slate-500 border-t border-slate-200/50 dark:border-slate-800/60 print:hidden">
          BengkelStock v2.0 • Sistem Manajemen Stok & Gudang Bengkel Terintegrasi • React + Vite + Bun
        </footer>
      </div>
    </div>
  );
};
