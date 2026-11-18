import React from 'react';
import { AlertOctagon, RotateCcw } from 'lucide-react';
import { Button } from '../atoms/Button';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 text-slate-800 dark:text-slate-100">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-8 border border-red-200 dark:border-red-900 shadow-2xl text-center">
            <div className="w-16 h-16 rounded-3xl bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 mx-auto flex items-center justify-center mb-5">
              <AlertOctagon className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Terjadi Kendala Tampilan
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              {this.state.error?.message || 'Terjadi kesalahan runtime yang tidak terduga.'}
            </p>
            <div className="mt-6 flex gap-3 justify-center">
              <Button
                variant="primary"
                size="sm"
                icon={RotateCcw}
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.href = '/';
                }}
              >
                Muat Ulang Aplikasi
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
