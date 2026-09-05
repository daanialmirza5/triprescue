import { cn } from '@/lib/utils';
import { useAuth } from '@/store/AuthContext';
import {
  LayoutDashboard,
  Briefcase,
  Activity,
  LifeBuoy,
  ShieldAlert,
  History,
  Settings,
  ChevronLeft,
  Sparkles,
  LogOut,
} from 'lucide-react';

export type PageId = 'overview' | 'trips' | 'monitor' | 'recovery' | 'risk' | 'activity' | 'settings';

interface SidebarProps {
  current: PageId;
  onNavigate: (page: PageId) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const navItems: { id: PageId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'trips', label: 'My Trips', icon: Briefcase },
  { id: 'monitor', label: 'Live Monitor', icon: Activity },
  { id: 'recovery', label: 'Recovery Center', icon: LifeBuoy },
  { id: 'risk', label: 'Risk Intelligence', icon: ShieldAlert },
  { id: 'activity', label: 'Activity', icon: History },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ current, onNavigate, collapsed, onToggleCollapse }: SidebarProps) {
  const { profile, logout } = useAuth();
  const displayName = profile?.name ?? 'Traveler';
  const displayTier = profile?.loyaltyTier ? `${profile.loyaltyTier} Traveler` : 'Traveler';
  const initial = displayName.charAt(0).toUpperCase() || 'T';

  return (
    <aside
      className={cn(
        'relative z-30 flex h-screen flex-col border-r border-ink-700 bg-ink-950/95 backdrop-blur-xl transition-all duration-300',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      <div className={cn('flex items-center gap-2.5 px-4 py-5', collapsed && 'justify-center px-2')}>
        <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500 to-electric-600 shadow-glow-cyan">
          <LifeBuoy className="h-5 w-5 text-white" />
        </div>
        {!collapsed && (
          <div className="animate-fade-in">
            <div className="text-sm font-bold tracking-tight text-ink-100">TripRescue</div>
            <div className="text-[10px] text-ink-400">Disruption Recovery Engine</div>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 px-2 py-2">
        {navItems.map((item) => {
          const active = current === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                'group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all',
                active ? 'bg-ink-700 text-ink-100' : 'text-ink-400 hover:bg-ink-800 hover:text-ink-100',
                collapsed && 'justify-center'
              )}
              title={collapsed ? item.label : undefined}
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
            >
              {active && <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-accent-400" />}
              <Icon className={cn('h-[18px] w-[18px] shrink-0', active && 'text-accent-400')} />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="space-y-3 border-t border-ink-700 px-3 py-4">
        {!collapsed && (
          <div className="space-y-2 rounded-lg bg-gradient-to-br from-accent-500/10 to-electric-600/5 p-3 animate-fade-in">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent-600" />
              <span className="text-xs font-medium text-ink-100">AI Travel Assistant</span>
            </div>
            <p className="text-[10px] leading-relaxed text-ink-400">Ask questions about your itinerary, disruptions, and recovery options.</p>
          </div>
        )}

        <div className={cn('flex items-center gap-2', collapsed && 'justify-center')}>
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          {!collapsed && (
            <div className="text-[10px]">
              <div className="font-medium text-ink-200">System Status: Operational</div>
              <div className="text-ink-500">All services running</div>
            </div>
          )}
        </div>

        {!collapsed && (
          <div className="flex items-center gap-2.5 rounded-lg p-2 hover:bg-ink-800 transition">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent-400 to-electric-600 text-xs font-bold text-white">
              {initial}
            </div>
            <div className="flex-1 min-w-0">
              <div className="truncate text-xs font-medium text-ink-100">{displayName}</div>
              <div className="truncate text-[10px] text-ink-500">{displayTier}</div>
            </div>
            <button
              onClick={logout}
              title="Log out"
              aria-label="Log out"
              className="shrink-0 rounded-md p-1.5 text-ink-500 transition hover:bg-ink-700 hover:text-ink-200"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      <button
        onClick={onToggleCollapse}
        className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-ink-600 bg-ink-800 text-ink-400 shadow-card transition hover:bg-ink-700 hover:text-ink-100"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <ChevronLeft className={cn('h-3.5 w-3.5 transition-transform', collapsed && 'rotate-180')} />
      </button>
    </aside>
  );
}
