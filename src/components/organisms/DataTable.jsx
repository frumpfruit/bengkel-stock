import React from 'react';
import { EmptyState } from '../molecules/EmptyState';
import { Skeleton } from '../atoms/Skeleton';

export const DataTable = ({
  columns = [],
  data = [],
  isLoading = false,
  emptyTitle = 'Tidak ada data',
  emptyDescription = 'Belum ada data untuk ditampilkan.',
  onEmptyAction,
  emptyActionText,
  className = '',
}) => {
  if (isLoading) {
    return (
      <div className={`bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm w-full space-y-3 p-6 animate-pulse ${className}`}>
        <div className="flex gap-4 border-b border-slate-100 dark:border-slate-800 pb-3">
          {columns.map((_, i) => (
            <Skeleton key={i} className="h-4 flex-1" />
          ))}
        </div>
        {Array.from({ length: 5 }).map((_, r) => (
          <div key={r} className="flex gap-4 py-2">
            {columns.map((_, c) => (
              <Skeleton key={c} className="h-5 flex-1" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={`bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm p-6 sm:p-8 ${className}`}>
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
          actionText={emptyActionText}
          onAction={onEmptyAction}
        />
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03),0_2px_6px_-1px_rgba(0,0,0,0.02)] overflow-x-auto ${className}`}>
      <table className="w-full text-left border-collapse bg-white dark:bg-slate-900">
        <thead>
          <tr className="bg-slate-50/90 dark:bg-slate-800/90 border-b border-slate-100 dark:border-slate-800">
            {columns.map((col, idx) => (
              <th
                key={col.key || idx}
                className={`table-th ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'} ${col.className || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 bg-white dark:bg-slate-900">
          {data.map((row, rowIdx) => (
            <tr
              key={row.id || rowIdx}
              className="bg-white dark:bg-slate-900 hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors group"
            >
              {columns.map((col, colIdx) => (
                <td
                  key={col.key || colIdx}
                  className={`table-td ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'} ${col.cellClassName || ''}`}
                >
                  {col.render ? col.render(row, rowIdx) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
