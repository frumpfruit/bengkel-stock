import React from 'react';

export const IconButton = ({
  icon: Icon,
  variant = 'default',
  size = 'md',
  title,
  onClick,
  disabled = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'p-1.5 rounded-xl transition-all duration-200 active:scale-90 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    default: 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800',
    primary: 'text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40',
    success: 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40',
    danger: 'text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40',
    blue: 'text-sky-600 hover:text-sky-700 hover:bg-sky-50 dark:hover:bg-sky-950/40',
  };

  const sizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  };

  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant] || variants.default} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4" />}
    </button>
  );
};
