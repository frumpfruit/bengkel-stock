import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, AlertOctagon, ArrowRight } from 'lucide-react';
import { Card } from '../atoms/Card';
import { Button } from '../atoms/Button';
import { StockStatusBadge } from '../atoms/Badge';

export const LowStockAlertCard = ({
  parts = [],
  onRestock,
  className = '',
}) => {
  return (
    <Card padding="p-6 sm:p-7" className={`gsap-card flex flex-col justify-between h-full ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Spare Part Perlu Restock</span>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400">
              {parts.length}
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Item yang telah mencapai atau di bawah batas stok minimum
          </p>
        </div>
        <Link
          to="/inventory/parts"
          className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1.5 transition-colors"
        >
          <span>Kelola Semua</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800/80 flex-1">
        {parts.slice(0, 4).map((part) => (
          <div key={part.id} className="py-3.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                  part.status === 'Habis'
                    ? 'bg-red-50 text-red-600 dark:bg-red-950/60'
                    : 'bg-amber-50 text-amber-600 dark:bg-amber-950/60'
                }`}
              >
                {part.status === 'Habis' ? (
                  <AlertOctagon className="w-5 h-5" />
                ) : (
                  <AlertTriangle className="w-5 h-5" />
                )}
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                  {part.name}
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                  <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                    {part.code}
                  </span>
                  <span>• Min: {part.minStock} {part.unit}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3.5 flex-shrink-0">
              <div className="text-right">
                <div
                  className={`text-sm font-black ${
                    part.status === 'Habis' ? 'text-red-600' : 'text-amber-600'
                  }`}
                >
                  {part.stock} {part.unit}
                </div>
                <StockStatusBadge status={part.status} size="sm" />
              </div>

              {onRestock && (
                <Button
                  size="xs"
                  variant="primary"
                  onClick={() => onRestock(part)}
                  className="px-3 py-1.5 shadow-xs"
                >
                  Restock
                </Button>
              )}
            </div>
          </div>
        ))}

        {parts.length === 0 && (
          <div className="py-10 text-center text-xs text-slate-400">
            Semua stok dalam keadaan aman terkendali!
          </div>
        )}
      </div>
    </Card>
  );
};
