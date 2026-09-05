import { createContext, useContext, type ReactNode } from 'react';
import { ToastContainer, useToasts, type ToastData } from '@/components/ui/Toast';

const ToastContext = createContext<{ addToast: (type: ToastData['type'], title: string, message?: string) => void } | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const { toasts, addToast, dismissToast } = useToasts();

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
