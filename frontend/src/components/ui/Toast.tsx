import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ToastData {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}

interface ToastProps {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastProps) {
  return createPortal(
    <div className="fixed inset-x-4 bottom-6 z-[200] flex flex-col items-stretch gap-3 sm:inset-x-auto sm:right-6 sm:items-end">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>,
    document.body
  );
}

function Toast({ toast, onDismiss }: { toast: ToastData; onDismiss: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 5000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-safar-safe" />,
    error: <AlertCircle className="h-5 w-5 text-safar-broken" />,
    info: <Info className="h-5 w-5 text-safar-sky" />,
  };

  const borders = {
    success: 'border-safar-safe/30',
    error: 'border-safar-broken/30',
    info: 'border-safar-blue/30',
  };

  return (
    <div className={cn('border border-line bg-white shadow-lift flex items-start gap-3 rounded-xl border p-4 shadow-lift animate-slide-in-right w-full sm:min-w-[300px] sm:w-auto sm:max-w-md', borders[toast.type])}>
      <div className="mt-0.5 shrink-0">{icons[toast.type]}</div>
      <div className="flex-1">
        <p className="text-sm font-medium text-ink">{toast.title}</p>
        {toast.message && <p className="mt-0.5 text-xs text-ink-muted">{toast.message}</p>}
      </div>
      <button onClick={() => onDismiss(toast.id)} className="text-ink-muted transition hover:text-ink" aria-label="Dismiss">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function useToasts() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = (type: ToastData['type'], title: string, message?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, addToast, dismissToast };
}
