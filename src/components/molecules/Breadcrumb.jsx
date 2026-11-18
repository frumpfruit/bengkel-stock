import React from 'react';
import { ChevronRight } from 'lucide-react';

export const Breadcrumb = ({
  items = [],
  className = '',
}) => {
  return (
    <nav className={`flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 font-medium ${className}`}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            {index > 0 && <span className="text-slate-300 dark:text-slate-600">/</span>}
            <span
              className={
                isLast
                  ? 'text-red-600 dark:text-red-400 font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
              }
            >
              {item.label}
            </span>
          </React.Fragment>
        );
      })}
    </nav>
  );
};
