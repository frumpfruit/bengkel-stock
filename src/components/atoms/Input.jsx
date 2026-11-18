import React from 'react';

export const Input = ({
  type = 'text',
  value,
  onChange,
  placeholder = '',
  icon: Icon,
  disabled = false,
  required = false,
  error = '',
  className = '',
  ...props
}) => {
  return (
    <div className="relative w-full">
      {Icon && (
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 flex items-center justify-center">
          <Icon className="w-4 h-4" />
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`w-full h-11 text-xs sm:text-sm bg-slate-50 dark:bg-[#0B0F17]/90 border rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 dark:focus:ring-red-500/10 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 ${
          Icon ? 'pl-10 pr-4' : 'px-4'
        } ${
          error
            ? 'border-red-500 focus:border-red-500'
            : 'border-slate-200/90 dark:border-slate-800/90 focus:border-red-500 dark:focus:border-red-500/80'
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-[11px] text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
};
