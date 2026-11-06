import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useApp } from '@/store/AppContext';
import { useAuth } from '@/store/AuthContext';
import { useRouter } from '@/lib/router';
import { LogoMark } from '@/components/brand/Logo';
import { SearchCommand } from '@/components/layout/SearchCommand';
import { AlertTriangle, Bell, CheckCircle2, ChevronDown, Info, LogOut, Menu, PlayCircle, RotateCcw, Settings, Sparkles } from 'lucide-react';

interface TopBarProps {
  onOpenMenu: () => void;
  onRunDemo: () => void;
  onReset: () => void;
}

function useDismiss(open: boolean, close: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) close(); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('mousedown', onDown);
    window.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); window.removeEventListener('keydown', onKey); };
  }, [open, close]);
  return ref;
}

export function TopBar({ onOpenMenu, onRunDemo, onReset }: TopBarProps) {
  return (
    <header className="relative z-40 flex items-center gap-3 px-4 pb-2 pt-4 sm:px-6 lg:px-8">
      <button onClick={onOpenMenu} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line bg-white text-ink shadow-card md:hidden" aria-label="Open navigation">
        <Menu className="h-5 w-5" />
      </button>
      <LogoMark className="hidden h-9 w-16 shrink-0 max-md:block max-sm:hidden" />
      <SearchCommand />
      <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
        <Notifications />
        <ProfileMenu onRunDemo={onRunDemo} onReset={onReset} />
      </div>
    </header>
  );
}

function Notifications() {
  const { notifications, unreadCount, markNotificationsRead } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useDismiss(open, () => setOpen(false));
  const icon = { high: <AlertTriangle className="h-4 w-4 text-danger" />, medium: <AlertTriangle className="h-4 w-4 text-risk" />, low: <Info className="h-4 w-4 text-brand" />, system: <CheckCircle2 className="h-4 w-4 text-safe" /> };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => { setOpen((v) => !v); if (!open && unreadCount > 0) markNotificationsRead(); }}
        className="relative flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-ink shadow-card transition hover:text-brand"
        aria-label={`Notifications${unreadCount ? ` (${unreadCount} unread)` : ''}`}
        aria-expanded={open}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border-2 border-white bg-danger" />}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-line bg-white shadow-lift animate-scale-in">
          <div className="border-b border-line px-4 py-3 text-sm font-bold text-ink">Notifications</div>
          <div className="max-h-96 overflow-y-auto scrollbar-thin">
            {notifications.length === 0 && <div className="px-4 py-8 text-center text-sm text-ink-muted">You're all caught up.</div>}
            {notifications.map((n) => (
              <div key={n.id} className="flex gap-3 border-b border-line/70 px-4 py-3 last:border-0">
                <span className="mt-0.5">{icon[n.severity]}</span>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-ink">{n.title}</div>
                  <div className="mt-0.5 text-xs leading-5 text-ink-muted">{n.message}</div>
                  <div className="mt-1 text-[11px] text-ink-faint">{n.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileMenu({ onRunDemo, onReset }: { onRunDemo: () => void; onReset: () => void }) {
  const { profile, logout } = useAuth();
  const { phase, demoRunning, isBusy, trip } = useApp();
  const { navigate } = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useDismiss(open, () => setOpen(false));
  const canReset = trip.resettable !== false; // your own trips have no original snapshot to restore
  const name = profile?.name ?? 'Traveler';
  const first = name.split(' ')[0];
  const initials = name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
  const run = (fn: () => void) => () => { setOpen(false); fn(); };

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((v) => !v)} className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-2 transition hover:bg-white/70" aria-expanded={open} aria-haspopup="menu">
        <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-[#1F6BFF] to-[#12B5E5] text-sm font-bold text-white shadow-card">{initials}</span>
        <span className="hidden text-[15px] font-semibold text-ink sm:inline">{first}</span>
        <ChevronDown className={cn('hidden h-4 w-4 text-ink transition sm:block', open && 'rotate-180')} />
      </button>
      {open && (
        <div role="menu" className="absolute right-0 top-full mt-2 w-72 overflow-hidden rounded-2xl border border-line bg-white p-2 shadow-lift animate-scale-in">
          <div className="px-3 py-2.5">
            <div className="text-sm font-bold text-ink">{name}</div>
            <div className="truncate text-xs text-ink-muted">{profile?.email}</div>
            <span className="pill mt-2 bg-safe-light text-safe">
              <span className="h-1.5 w-1.5 rounded-full bg-safe" />
              Connected to live backend
            </span>
          </div>
          <div className="my-1 h-px bg-line" />
          <MenuItem icon={PlayCircle} label={demoRunning ? 'Guided demo running…' : 'Run guided demo'} disabled={demoRunning || isBusy} onClick={run(onRunDemo)} />
          <MenuItem icon={RotateCcw} label="Reset journey" disabled={!canReset || phase === 'idle' || demoRunning || isBusy} onClick={run(onReset)} />
          <MenuItem icon={Sparkles} label="Ask AI Assistant" onClick={run(() => navigate('assistant'))} />
          <MenuItem icon={Settings} label="Settings" onClick={run(() => navigate('settings'))} />
          <div className="my-1 h-px bg-line" />
          <MenuItem icon={LogOut} label="Sign out" onClick={run(logout)} />
        </div>
      )}
    </div>
  );
}

function MenuItem({ icon: Icon, label, onClick, disabled }: { icon: typeof Bell; label: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button role="menuitem" onClick={onClick} disabled={disabled} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-ink-soft transition hover:bg-canvas hover:text-ink disabled:cursor-not-allowed disabled:opacity-45">
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}
