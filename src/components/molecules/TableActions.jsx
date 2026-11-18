import React from 'react';
import { Eye, Edit, Trash2, SlidersHorizontal } from 'lucide-react';
import { IconButton } from '../atoms/IconButton';

export const TableActions = ({
  onView,
  onEdit,
  onAdjust,
  onDelete,
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-end gap-1 ${className}`}>
      {onAdjust && (
        <IconButton
          icon={SlidersHorizontal}
          variant="primary"
          title="Sesuaikan Stok Cepat"
          onClick={onAdjust}
        />
      )}
      {onView && (
        <IconButton
          icon={Eye}
          variant="blue"
          title="Lihat Detail"
          onClick={onView}
        />
      )}
      {onEdit && (
        <IconButton
          icon={Edit}
          variant="success"
          title="Edit Data"
          onClick={onEdit}
        />
      )}
      {onDelete && (
        <IconButton
          icon={Trash2}
          variant="danger"
          title="Hapus Data"
          onClick={onDelete}
        />
      )}
    </div>
  );
};
