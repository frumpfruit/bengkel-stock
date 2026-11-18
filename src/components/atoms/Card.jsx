import React from 'react';

export const Card = ({
  children,
  hoverable = false,
  padding = 'p-5 sm:p-6',
  className = '',
  ...props
}) => {
  return (
    <div
      className={`bg-white dark:bg-[#111827]/80 dark:backdrop-blur-sm border border-slate-100/90 dark:border-slate-800/70 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03),0_2px_6px_-1px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.2)] rounded-3xl transition-all duration-300 ${
        hoverable
          ? 'hover:shadow-[0_12px_28px_-4px_rgba(220,38,38,0.08),0_4px_12px_-2px_rgba(0,0,0,0.03)] dark:hover:border-slate-700/80 hover:-translate-y-0.5'
          : ''
      } ${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
