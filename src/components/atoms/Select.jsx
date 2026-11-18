import React from 'react';
import { ChevronDown } from 'lucide-react';

export const Select = ({
  value,
  onChange,
  children,
  options = [],
  disabled = false,
  required = false,
  error = '',
  className = '',
  ...props
}) => {
  return (
    <div className="relative w-full">
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`w-full h-11 appearance-none pl-4 pr-9 text-xs sm:text-sm bg-slate-50 dark:bg-[#0B0F17]/90 border rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 dark:focus:ring-red-500/10 disabled:opacity-50 text-slate-900 dark:text-slate-100 cursor-pointer ${
          error
            ? 'border-red-500 focus:border-red-500'
            : 'border-slate-200/90 dark:border-slate-800/90 focus:border-red-500 dark:focus:border-red-500/80'
        } ${className}`}
        {...props}
      >
        {options.length > 0
          ? options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled} className="bg-white dark:bg-[#111827] text-slate-900 dark:text-slate-100">
                {opt.label}
              </option>
            ))
          : children}
      </select>
      <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      {error && <p className="mt-1.5 text-[11px] text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
};
