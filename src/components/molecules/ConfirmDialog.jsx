import React from 'react';
import { AlertTriangle, AlertCircle } from 'lucide-react';
import { Button } from '../atoms/Button';

export const ConfirmDialog = ({
  title = 'Konfirmasi Tindakan',
  message,
  confirmText = 'Hapus Sekarang',
  cancelText = 'Batal',
  onConfirm,
  onCancel,
  type = 'danger',
}) => {
  return (
    <div className="space-y-4">
      <div
        className={`flex items-center gap-3 p-4 rounded-2xl border ${
          type === 'danger'
            ? 'bg-red-50 dark:bg-red-950/40 border-red-100 dark:border-red-900/40 text-red-700 dark:text-red-300'
            : 'bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900/40 text-amber-700 dark:text-amber-300'
        }`}
      >
        {type === 'danger' ? (
          <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0" />
        ) : (
          <AlertTriangle className="w-8 h-8 text-amber-600 flex-shrink-0" />
        )}
        <p className="text-xs leading-relaxed">{message}</p>
      </div>

      <div className="flex items-center justify-end gap-2.5 pt-2">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          {cancelText}
        </Button>
        <Button
          variant={type === 'danger' ? 'danger' : 'primary'}
          size="sm"
          onClick={onConfirm}
        >
          {confirmText}
        </Button>
      </div>
    </div>
  );
};
