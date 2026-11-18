import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FileQuestion, ArrowLeft, Home, Boxes, HelpCircle } from 'lucide-react';
import { Button } from '../../components/atoms/Button';

export const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4 sm:p-8">
      <div className="max-w-lg w-full bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 sm:p-12 border border-slate-200/90 dark:border-slate-800 shadow-2xl text-center relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-red-500/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-red-600 to-red-500 text-white mx-auto flex items-center justify-center mb-6 shadow-xl shadow-red-500/25">
            <FileQuestion className="w-10 h-10 animate-bounce" />
          </div>

          <div className="inline-block px-3 py-1 rounded-full bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 font-mono text-xs font-bold tracking-wider mb-3">
            ERROR 404 • ROUTE NOT FOUND
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Alamat Tidak Ditemukan
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed">
            Halaman dengan rute URL <code className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-red-600 dark:text-red-400 font-mono text-xs break-all">{location.pathname}</code> tidak terdaftar di sistem BengkelStock.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="secondary"
              size="md"
              icon={ArrowLeft}
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto justify-center"
            >
              Kembali
            </Button>
            <Button
              variant="primary"
              size="md"
              icon={Home}
              onClick={() => navigate('/')}
              className="w-full sm:w-auto justify-center"
            >
              Ke Dashboard
            </Button>
            <Button
              variant="outline"
              size="md"
              icon={Boxes}
              onClick={() => navigate('/inventory/parts')}
              className="w-full sm:w-auto justify-center"
            >
              Katalog Spare Part
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
