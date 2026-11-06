import { cn } from '@/lib/utils';
import { useRouter } from '@/lib/router';
import { useApp } from '@/store/AppContext';
import { Logo, LogoMark, ScriptTagline } from '@/components/brand/Logo';
import { sceneImages } from '@/lib/destinationImages';
import { primaryNav, secondaryNav, type NavItem } from '@/lib/navigation';
import { Plane, X } from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({ mobileOpen, onCloseMobile }: SidebarProps) {
  return (
    <>
      {/* Tablet rail + desktop sidebar */}
      <aside className="relative z-30 hidden h-screen shrink-0 flex-col overflow-hidden border-r border-line bg-white/80 backdrop-blur-xl md:flex md:w-[84px] xl:w-[264px]">
        <SidebarContent />
      </aside>
      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[90] md:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <div className="absolute inset-0 bg-ink/30 backdrop-blur-sm animate-fade-in" onClick={onCloseMobile} />
          <aside className="relative flex h-full w-[280px] flex-col overflow-hidden bg-white shadow-lift animate-slide-in-right">
            <button onClick={onCloseMobile} className="absolute right-3 top-5 z-10 rounded-lg p-2 text-ink-muted hover:bg-canvas" aria-label="Close navigation">
              <X className="h-5 w-5" />
            </button>
            <SidebarContent expanded onNavigate={onCloseMobile} />
          </aside>
        </div>
      )}
    </>
  );
}

function SidebarContent({ expanded = false, onNavigate }: { expanded?: boolean; onNavigate?: () => void }) {
  const { route, navigate } = useRouter();
  const { phase } = useApp();
  const hasDisruption = phase === 'disrupted' || phase === 'analyzing' || phase === 'recovering';
  const label = expanded ? 'inline' : 'hidden xl:inline';

  const item = (nav: NavItem) => {
    const active = route === nav.id;
    const Icon = nav.icon;
    return (
      <button
        key={nav.id}
        onClick={() => { navigate(nav.id); onNavigate?.(); }}
        aria-current={active ? 'page' : undefined}
        title={nav.label}
        className={cn(
          'group relative flex h-12 w-full items-center gap-3.5 rounded-2xl px-4 text-[15px] font-medium transition',
          !expanded && 'justify-center xl:justify-start',
          active ? 'bg-gradient-to-r from-[#E3ECFF] to-[#EEF4FF] text-brand shadow-[inset_0_0_0_1px_rgba(31,107,255,.12)]' : 'text-ink-soft hover:bg-canvas hover:text-ink'
        )}
      >
        <Icon className={cn('h-[21px] w-[21px] shrink-0', active ? 'text-brand' : 'text-ink-soft')} strokeWidth={1.8} />
        <span className={label}>{nav.label}</span>
        {nav.id === 'recovery' && hasDisruption && (
          <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-danger xl:static xl:ml-auto" aria-label="Disruption needs attention" />
        )}
      </button>
    );
  };

  return (
    <div className="scrollbar-none relative flex h-full flex-col overflow-y-auto">
      <button onClick={() => { navigate('dashboard'); onNavigate?.(); }} className={cn('px-5 pb-6 pt-6 text-left', !expanded && 'flex justify-center px-0 xl:block xl:px-5')} aria-label="Safar Sathi dashboard">
        {expanded ? <Logo size="sm" /> : <><LogoMark className="h-10 w-14 xl:hidden" /><Logo size="sm" className="hidden xl:flex" /></>}
      </button>
      <nav className="space-y-1.5 px-3.5" aria-label="Primary">
        {primaryNav.map(item)}
      </nav>
      <div className="mx-6 my-5 h-px bg-line" />
      <nav className="space-y-1.5 px-3.5" aria-label="Secondary">
        {secondaryNav.map(item)}
      </nav>

      {/* Coastal photograph + brand line, fading into the sidebar */}
      <div className={cn('pointer-events-none relative mt-auto min-h-[220px] flex-1', !expanded && 'hidden xl:block')} aria-hidden="true">
        <img src={sceneImages.sidebarCoast} alt="" className="mask-fade-top absolute inset-0 h-full w-full object-cover opacity-90" loading="lazy" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white via-white/80 to-transparent" />
        <div className="absolute bottom-6 left-6">
          <ScriptTagline lines={['Same', 'Destinations.', 'Fewer Disruptions.']} className="text-[26px]" />
          <Plane className="absolute -right-6 -top-2 h-6 w-6 -rotate-12 fill-ink text-ink" />
        </div>
      </div>
    </div>
  );
}
