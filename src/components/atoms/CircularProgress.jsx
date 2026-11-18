import React from 'react';
import { ArrowUpRight, ArrowDownLeft, TrendingUp } from 'lucide-react';

export const CircularProgress = ({
  percent = 75,
  color = '#DC2626',
  arrow = 'up',
  size = 46,
  strokeWidth = 4,
  className = '',
}) => {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, percent)) / 100) * circumference;

  return (
    <div
      className={`relative flex items-center justify-center flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 48 48">
        <circle
          cx="24"
          cy="24"
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth - 0.5}
          className="text-slate-100 dark:text-slate-800"
          fill="transparent"
        />
        <circle
          cx="24"
          cy="24"
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {arrow === 'up' && <ArrowUpRight className="w-3.5 h-3.5" style={{ color }} />}
        {arrow === 'down' && <ArrowDownLeft className="w-3.5 h-3.5" style={{ color }} />}
        {arrow === 'trend' && <TrendingUp className="w-3.5 h-3.5" style={{ color }} />}
      </div>
    </div>
  );
};
