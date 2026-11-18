import React from 'react';
import { AlertTriangle, AlertOctagon, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  const variants = {
    default: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700',
    red: 'bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300 border border-red-200/80 dark:border-red-500/25',
    green: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-500/25',
    amber: 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300 border border-amber-200/80 dark:border-amber-500/25',
    blue: 'bg-sky-50 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300 border border-sky-200/80 dark:border-sky-500/25',
    purple: 'bg-purple-50 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300 border border-purple-200/80 dark:border-purple-500/25',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-full ${sizeClasses} ${
        variants[variant] || variants.default
      } ${className}`}
    >
      {children}
    </span>
  );
};

export const StockStatusBadge = ({ status, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  if (status === 'Aman') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-500/30 ${sizeClasses}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        Aman
      </span>
    );
  }

  if (status === 'Menipis') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300 border border-amber-200/80 dark:border-amber-500/30 ${sizeClasses}`}
      >
        <AlertTriangle className="w-3 h-3 text-amber-500 dark:text-amber-400" />
        Menipis
      </span>
    );
  }

  // Habis
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300 border border-red-200/80 dark:border-red-500/30 ${sizeClasses}`}
    >
      <AlertOctagon className="w-3 h-3 text-red-500 dark:text-red-400 animate-bounce" />
      Habis
    </span>
  );
};

export const TransactionBadge = ({ type }) => {
  if (type === 'IN') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-500/30">
        <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
        Masuk
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300 border border-red-200/60 dark:border-red-500/30">
      <ArrowUpRight className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
      Keluar
    </span>
  );
};
