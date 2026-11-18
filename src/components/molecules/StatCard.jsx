import React from 'react';
import { Card } from '../atoms/Card';
import { CircularProgress } from '../atoms/CircularProgress';

export const StatCard = ({
  title,
  value,
  badgeText,
  badgeType = 'red',
  percent = 75,
  color = '#DC2626',
  arrow = 'up',
  className = '',
  onClick,
}) => {
  const badgeStyles = {
    red: 'bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-300 dark:border dark:border-red-500/25',
    blue: 'bg-sky-50 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300 dark:border dark:border-sky-500/25',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300 dark:border dark:border-amber-500/25',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-500/15 dark:text-purple-300 dark:border dark:border-purple-500/25',
    green: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border dark:border-emerald-500/25',
  };

  return (
    <Card
      hoverable
      padding="p-5"
      onClick={onClick}
      className={`gsap-card flex items-center gap-3.5 sm:gap-4 cursor-pointer overflow-hidden ${className}`}
    >
      <div className="flex-shrink-0">
        <CircularProgress percent={percent} color={color} arrow={arrow} size={44} />
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight tracking-tight truncate">
          {value}
        </div>
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate mt-0.5" title={title}>
          {title}
        </div>
        {badgeText && (
          <div className="mt-1.5 flex items-center">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-md truncate max-w-full ${
                badgeStyles[badgeType] || badgeStyles.red
              }`}
            >
              {badgeText}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};
