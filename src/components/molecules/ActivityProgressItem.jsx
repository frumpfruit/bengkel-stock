import React from 'react';
import { ProgressBar } from '../atoms/ProgressBar';

export const ActivityProgressItem = ({
  label,
  value,
  max = 100,
  dotColor = 'bg-emerald-500',
  barVariant = 'green',
  className = '',
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex justify-between items-center text-xs">
        <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${dotColor}`} />
          {label}
        </span>
        <span className="font-bold text-slate-900 dark:text-white">{value}</span>
      </div>
      <ProgressBar value={typeof value === 'number' ? value : parseInt(value) || 0} max={max} variant={barVariant} size="lg" />
    </div>
  );
};
