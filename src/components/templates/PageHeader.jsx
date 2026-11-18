import React from 'react';
import { Card } from '../atoms/Card';

export const PageHeader = ({
  icon: Icon,
  title,
  subtitle,
  actions,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-5 bg-white/70 dark:bg-[#111827]/60 p-5 sm:p-6 rounded-3xl border border-slate-200/70 dark:border-slate-800/60 shadow-xs dark:shadow-none backdrop-blur-md print:hidden ${className}`}
    >
      <div className="flex items-center gap-3.5 min-w-0">
        {Icon && (
          <div className="w-11 h-11 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 shadow-2xs">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight whitespace-nowrap truncate">
            {title}
          </h1>
          {subtitle && (
            <p
              className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed whitespace-nowrap truncate"
              title={subtitle}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {actions && (
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 flex-nowrap">
          {actions}
        </div>
      )}
    </div>
  );
};
