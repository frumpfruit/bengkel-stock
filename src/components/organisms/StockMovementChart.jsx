import React from 'react';
import { Download } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Card } from '../atoms/Card';
import { IconButton } from '../atoms/IconButton';

export const StockMovementChart = ({
  data = [],
  onExportCSV,
  year = '2026',
  className = '',
}) => {
  return (
    <Card padding="p-6 sm:p-7" className={`gsap-card flex flex-col justify-between h-full ${className}`}>
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Pergerakan Stok (Stock Movement)
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            Visualisasi tren perbandingan arus barang masuk vs barang keluar bulanan
          </p>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-center">
          {/* Legend pills */}
          <div className="flex items-center gap-3 text-xs font-semibold bg-slate-50 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-slate-600 dark:text-slate-300">Masuk</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
              <span className="text-slate-600 dark:text-slate-300">Keluar</span>
            </div>
          </div>

          {onExportCSV && (
            <IconButton
              icon={Download}
              title="Unduh Data CSV"
              onClick={onExportCSV}
              variant="default"
              className="border border-slate-200 dark:border-slate-700 p-2"
            />
          )}
        </div>
      </div>

      {/* Smooth Recharts AreaChart with proper breathing room margins */}
      <div className="h-72 sm:h-80 w-full pt-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 15, right: 20, left: 10, bottom: 5 }}>
            <defs>
              <linearGradient id="colorMasukOrg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorKeluarOrg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#DC2626" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#DC2626" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.6} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 500 }}
              dy={6}
            />
            <YAxis
              width={40}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 500 }}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 text-xs">
                      <p className="font-bold text-slate-800 dark:text-white mb-2">{label} {year}</p>
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-6 text-emerald-600 dark:text-emerald-400">
                          <span>Barang Masuk:</span>
                          <strong>{payload[0]?.value} unit</strong>
                        </div>
                        <div className="flex items-center justify-between gap-6 text-red-600 dark:text-red-400">
                          <span>Barang Keluar:</span>
                          <strong>{payload[1]?.value} unit</strong>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="masuk"
              stroke="#10B981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorMasukOrg)"
            />
            <Area
              type="monotone"
              dataKey="keluar"
              stroke="#DC2626"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorKeluarOrg)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
