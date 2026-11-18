import React from 'react';

export const ProgressBar = ({
  value = 0,
  max = 100,
  variant = 'red',
  size = 'md',
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-2.5',
  };

  const variantGradients = {
    red: 'bg-gradient-to-r from-red-600 to-rose-400',
    green: 'bg-gradient-to-r from-emerald-500 to-teal-400',
    amber: 'bg-gradient-to-r from-amber-500 to-orange-400',
    blue: 'bg-gradient-to-r from-blue-500 to-indigo-400',
    purple: 'bg-gradient-to-r from-purple-500 to-indigo-400',
  };

  return (
    <div
      className={`w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden ${
        sizeClasses[size] || sizeClasses.md
      } ${className}`}
    >
      <div
        className={`h-full rounded-full transition-all duration-700 ease-out ${
          variantGradients[variant] || variantGradients.red
        }`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};
