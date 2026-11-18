import React from 'react';
import { PackageOpen, Plus } from 'lucide-react';
import { Button } from '../atoms/Button';

export const EmptyState = ({
  icon: Icon = PackageOpen,
  title = "Belum ada data",
  description = "Mulai tambahkan data baru ke dalam sistem BengkelStock.",
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-14 px-6 text-center bg-white/50 dark:bg-slate-900/40 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
      <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/40 flex items-center justify-center text-red-600 dark:text-red-400 mb-4 shadow-xs">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">{title}</h3>
      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-5 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <Button onClick={onAction} icon={Plus} size="sm">
          {actionText}
        </Button>
      )}
    </div>
  );
};
