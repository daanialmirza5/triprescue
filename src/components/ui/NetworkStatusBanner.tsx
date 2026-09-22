import { useState, useEffect } from 'react';
import { onColdStartRetry } from '@/services/api';
import { WifiOff, Server, RefreshCw } from 'lucide-react';

export function NetworkStatusBanner() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isWakingBackend, setIsWakingBackend] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    onColdStartRetry(() => {
      setIsWakingBackend(true);
      // Auto-clear notification after wake timeout completes
      const timer = setTimeout(() => setIsWakingBackend(false), 55000);
      return () => clearTimeout(timer);
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      onColdStartRetry(null);
    };
  }, []);

  if (!isOffline && !isWakingBackend) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 right-4 z-50 flex max-w-md items-center gap-3 rounded-xl border border-amber-500/40 bg-ink-900/95 p-3.5 shadow-2xl backdrop-blur-md"
    >
      {isOffline ? (
        <>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-500/20 text-red-400">
            <WifiOff className="h-5 w-5" />
          </div>
          <div className="text-xs">
            <p className="font-semibold text-ink-100">You are currently offline</p>
            <p className="text-ink-400">Live DAG updates and AI assistant responses will resume once reconnected.</p>
          </div>
        </>
      ) : (
        <>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
            <RefreshCw className="h-5 w-5 animate-spin" />
          </div>
          <div className="text-xs">
            <p className="font-semibold text-ink-100">Waking cloud services...</p>
            <p className="text-ink-400">The cloud engine is starting up. Your request will finish automatically.</p>
          </div>
        </>
      )}
    </div>
  );
}
