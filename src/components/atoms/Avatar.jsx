import React from 'react';

export const Avatar = ({
  name = 'Admin',
  src,
  size = 'md',
  className = '',
}) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const sizeClasses = {
    sm: 'w-7 h-7 text-[10px]',
    md: 'w-9 h-9 text-xs',
    lg: 'w-11 h-11 text-sm',
    xl: 'w-14 h-14 text-base',
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`rounded-2xl object-cover border border-slate-100 dark:border-slate-800 ${
          sizeClasses[size] || sizeClasses.md
        } ${className}`}
      />
    );
  }

  return (
    <div
      className={`rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 text-white font-bold flex items-center justify-center shadow-inner flex-shrink-0 ${
        sizeClasses[size] || sizeClasses.md
      } ${className}`}
    >
      {initials}
    </div>
  );
};
