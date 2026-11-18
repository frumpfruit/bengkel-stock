import React from 'react';
import { Boxes, ThumbsUp, ShieldCheck, AlertTriangle, AlertOctagon } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card } from '../atoms/Card';

export const StockStatusGauge = ({
  safeCount = 0,
  lowCount = 0,
  outCount = 0,
  safePercent = 74,
  className = '',
}) => {
  const total = Math.max(1, safeCount + lowCount + outCount);
  const pieData = [
    { name: 'Stok Aman', value: safeCount, color: '#16A34A' },
    { name: 'Stok Menipis', value: lowCount, color: '#F59E0B' },
    { name: 'Stok Habis', value: outCount, color: '#DC2626' },
  ];

  return (
    <Card padding="p-6 sm:p-7" className={`gsap-card flex flex-col justify-between h-full ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Kesehatan Stok (Stock Status)
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            Rasio pemenuhan batas aman suku cadang
          </p>
        </div>
        <span className="p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
          <Boxes className="w-5 h-5" />
        </span>
      </div>

      {/* Semi-Donut Gauge Graphic - Proportionate and Centered */}
      <div className="flex-1 flex flex-col items-center justify-center py-2">
        <div className="w-64 h-48 relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="75%"
                startAngle={180}
                endAngle={0}
                innerRadius={76}
                outerRadius={106}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Gauge Center Content */}
          <div className="absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
            <div className="w-8 h-8 mx-auto mb-1 rounded-full bg-emerald-100/80 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-xs">
              <ThumbsUp className="w-4 h-4" />
            </div>
            <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
              {safePercent}%
            </div>
            <div className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-wider mt-1.5">
              Stok Aman
            </div>
          </div>
        </div>

        {/* Scale Min / Max markers */}
        <div className="w-56 flex justify-between text-xs font-bold text-slate-400 dark:text-slate-500 -mt-4 px-2">
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Status Breakdown Legend Cards - Rich, Spacious & Informative */}
      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/80">
        {/* Aman */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-center transition-all hover:bg-emerald-50">
          <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Aman</span>
          </div>
          <div className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-300 mt-1 leading-none">
            {safeCount}
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-semibold">
            {Math.round((safeCount / total) * 100)}% katalog
          </div>
        </div>

        {/* Menipis */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40 text-center transition-all hover:bg-amber-50">
          <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-400">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Menipis</span>
          </div>
          <div className="text-lg sm:text-xl font-black text-amber-600 dark:text-amber-300 mt-1 leading-none">
            {lowCount}
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-semibold">
            {Math.round((lowCount / total) * 100)}% katalog
          </div>
        </div>

        {/* Habis */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-red-50/70 dark:bg-red-950/30 border border-red-100 dark:border-red-900/40 text-center transition-all hover:bg-red-50">
          <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-red-700 dark:text-red-400">
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>Habis</span>
          </div>
          <div className="text-lg sm:text-xl font-black text-red-600 dark:text-red-300 mt-1 leading-none">
            {outCount}
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-semibold">
            {Math.round((outCount / total) * 100)}% katalog
          </div>
        </div>
      </div>
    </Card>
  );
};
