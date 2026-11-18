import React, { useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '../atoms/Input';

export const SearchBar = ({
  value,
  onChange,
  placeholder = 'Cari...',
  onClear,
  results = [],
  onSelectResult,
  showDropdown = false,
  setShowDropdown,
  className = '',
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        if (setShowDropdown) setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setShowDropdown]);

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <div className="relative">
        <Input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          icon={Search}
          onFocus={() => setShowDropdown && setShowDropdown(true)}
        />
        {value && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Dropdown Results if any */}
      {showDropdown && value.trim() && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-2 z-50 animate-in fade-in slide-in-from-top-2">
          {results.map((item, index) => (
            <div
              key={item.id || index}
              onClick={() => {
                if (onSelectResult) onSelectResult(item);
                if (setShowDropdown) setShowDropdown(false);
              }}
              className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  {item.title || item.name}
                </div>
                {item.subtitle && (
                  <div className="text-[11px] text-slate-400">{item.subtitle}</div>
                )}
              </div>
              {item.badge && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {item.badge}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
