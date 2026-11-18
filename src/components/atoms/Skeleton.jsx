import React from 'react';

export const Skeleton = ({
  className = '',
  rounded = 'rounded-xl',
  width,
  height,
}) => {
  return (
    <div
      style={{ width, height }}
      className={`animate-pulse bg-slate-200 dark:bg-slate-800 ${rounded} ${className}`}
    />
  );
};
