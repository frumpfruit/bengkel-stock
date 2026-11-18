import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';
import { useStock } from '../../context/StockContext';
import { Button } from '../atoms/Button';

export const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, currentUser } = useStock();
  const location = useLocation();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (adminOnly && !isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl text-center">
          <div className="w-16 h-16 rounded-3xl bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 mx-auto flex items-center justify-center mb-5 shadow-xs">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300">
            Akses Terbatas (Admin Only)
          </span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-4">
            Akses Ditolak
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            Akun Anda terdaftar dengan hak akses <strong className="text-slate-800 dark:text-slate-200">{currentUser?.roleLabel || 'Viewer / Mekanik'}</strong>.
            Halaman ini memerlukan hak akses penuh Administrator (CRUD).
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-2 justify-center">
            <Button
              variant="secondary"
              size="sm"
              icon={ArrowLeft}
              onClick={() => navigate(-1)}
              className="justify-center"
            >
              Kembali
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/inventory/parts')}
              className="justify-center"
            >
              Katalog Spare Part
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return children;
};
