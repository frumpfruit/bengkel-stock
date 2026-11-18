import React from 'react';
import { TrendingUp } from 'lucide-react';
import { Card } from '../atoms/Card';
import { ActivityProgressItem } from '../molecules/ActivityProgressItem';

export const WarehouseActivityCard = ({
  masukCount = 125,
  keluarCount = 87,
  restockCount = 24,
  assetValue = 0,
  className = '',
}) => {
  return (
    <Card padding="p-6 sm:p-7" className={`gsap-card flex flex-col justify-between h-full ${className}`}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Aktivitas Gudang
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Statistik transaksi suku cadang bulan ini</p>
        </div>
        <span className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500">
          <TrendingUp className="w-4.5 h-4.5" />
        </span>
      </div>

      <div className="space-y-5 my-2">
        <ActivityProgressItem
          label="Barang Masuk"
          value={`${masukCount} unit`}
          max={200}
          dotColor="bg-emerald-500"
          barVariant="green"
        />
        <ActivityProgressItem
          label="Barang Keluar"
          value={`${keluarCount} unit`}
          max={200}
          dotColor="bg-red-500"
          barVariant="red"
        />
        <ActivityProgressItem
          label="Restock Berkala"
          value={`${restockCount} PO`}
          max={50}
          dotColor="bg-blue-500"
          barVariant="blue"
        />
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
        <span className="text-slate-500 font-medium">Total Nilai Aset Gudang:</span>
        <span className="text-sm font-black text-slate-900 dark:text-white">
          Rp {assetValue.toLocaleString('id-ID')}
        </span>
      </div>
    </Card>
  );
};
