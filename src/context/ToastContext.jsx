import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(({ type = 'success', title, message, duration = 3500 }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    const newToast = { id, type, title, message };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const showSuccess = (title, message = '') => {
    addToast({ type: 'success', title, message });
  };

  const showError = (title, message = '') => {
    addToast({ type: 'error', title, message });
  };

  const showWarning = (title, message = '') => {
    addToast({ type: 'warning', title, message });
  };

  const showInfo = (title, message = '') => {
    addToast({ type: 'info', title, message });
  };

  return (
    <ToastContext.Provider value={{ addToast, showSuccess, showError, showWarning, showInfo, removeToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-xl border backdrop-blur-md transition-all duration-300 transform animate-in slide-in-from-top-3 ${
              toast.type === 'success'
                ? 'bg-white/95 dark:bg-slate-900/95 border-emerald-200 dark:border-emerald-800 text-slate-800 dark:text-white shadow-emerald-500/10'
                : toast.type === 'error'
                ? 'bg-white/95 dark:bg-slate-900/95 border-red-200 dark:border-red-800 text-slate-800 dark:text-white shadow-red-500/10'
                : toast.type === 'warning'
                ? 'bg-white/95 dark:bg-slate-900/95 border-amber-200 dark:border-amber-800 text-slate-800 dark:text-white shadow-amber-500/10'
                : 'bg-white/95 dark:bg-slate-900/95 border-blue-200 dark:border-blue-800 text-slate-800 dark:text-white shadow-blue-500/10'
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />}
              {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-500 dark:text-amber-400" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">
                {toast.title}
              </h4>
              {toast.message && (
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {toast.message}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
