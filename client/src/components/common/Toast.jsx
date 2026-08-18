import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { clsx } from 'clsx';

export const Toast = ({
  message,
  type = 'info',
  onClose,
  duration = 4000,
}) => {
  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!message) return null;

  const typeConfig = {
    success: {
      bg: 'bg-emerald-600 text-white',
      icon: CheckCircle2,
    },
    error: {
      bg: 'bg-rose-600 text-white',
      icon: AlertCircle,
    },
    info: {
      bg: 'bg-indigo-600 text-white',
      icon: Info,
    },
  };

  const current = typeConfig[type] || typeConfig.info;
  const Icon = current.icon;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl animate-in slide-in-from-bottom-5 duration-200 text-sm font-medium max-w-md backdrop-blur-sm bg-opacity-95 bg-slate-900 text-white border border-slate-700">
      <div className={clsx('p-1 rounded-lg shrink-0', current.bg)}>
        <Icon className="w-4 h-4" />
      </div>
      <p className="flex-1 text-xs sm:text-sm">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Toast;
