import React from 'react';
import { Card } from '../atoms/Card';
import { Input } from '../atoms/Input';
import { Select } from '../atoms/Select';
import { Search } from 'lucide-react';

export const FilterToolbar = ({
  search,
  onSearchChange,
  searchPlaceholder = 'Cari...',
  categories = [],
  selectedCategory,
  onCategoryChange,
  statuses = [],
  selectedStatus,
  onStatusChange,
  sortOptions = [],
  selectedSort,
  onSortChange,
  totalResults = 0,
  totalItems = 0,
  onResetFilters,
  customFilters,
  className = '',
}) => {
  return (
    <Card padding="p-5 sm:p-6" className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5">
        {/* Search */}
        <div className="sm:col-span-2 lg:col-span-5">
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            icon={Search}
          />
        </div>

        {/* Category Filter */}
        {categories.length > 0 && onCategoryChange && (
          <div className="sm:col-span-1 lg:col-span-3">
            <Select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
            >
              <option value="Semua">Semua Kategori</option>
              {categories.map((c) => (
                <option key={c.id || c} value={c.name || c}>
                  {c.name || c}
                </option>
              ))}
            </Select>
          </div>
        )}

        {/* Status Filter */}
        {statuses.length > 0 && onStatusChange && (
          <div className="sm:col-span-1 lg:col-span-2">
            <Select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
            >
              <option value="Semua">Semua Status</option>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </div>
        )}

        {/* Sort Options */}
        {sortOptions.length > 0 && onSortChange && (
          <div className="sm:col-span-2 lg:col-span-2">
            <Select
              value={selectedSort}
              onChange={(e) => onSortChange(e.target.value)}
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </div>
        )}

        {customFilters}
      </div>

      {/* Quick Summary Counts & Reset */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
        <span>
          Menampilkan <strong>{totalResults}</strong> dari <strong>{totalItems}</strong> data
        </span>
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="text-xs font-semibold text-red-600 hover:underline ml-2"
          >
            Reset Filter
          </button>
        )}
      </div>
    </Card>
  );
};
