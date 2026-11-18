import React from 'react';

export const FormField = ({
  label,
  required = false,
  error = '',
  helperText = '',
  children,
  className = '',
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 min-h-[1.25rem] leading-tight">
          {label} {required && <span className="text-red-500 font-black ml-0.5">*</span>}
        </label>
      )}
      {children}
      {helperText && !error && (
        <p className="text-[11px] text-slate-400 leading-tight">{helperText}</p>
      )}
      {error && (
        <p className="text-[11px] text-red-600 dark:text-red-400 leading-tight font-medium">{error}</p>
      )}
    </div>
  );
};
