import { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useRouter, type Route } from '@/lib/router';
import { useApp } from '@/store/AppContext';
import { useAllTrips } from '@/hooks/useTravelData';
import { nodeKind } from '@/lib/journey';
import { primaryNav, secondaryNav } from '@/lib/navigation';
import { ArrowRight, BedDouble, Car, MessageSquareText, Plane, Search, TrainFront, Ticket } from 'lucide-react';

interface Result {
  id: string;
  group: 'Ask' | 'Pages' | 'Trips' | 'Bookings';
  title: string;
  subtitle?: string;
  icon: typeof Search;
  run: () => void;
}

const kindIcon = { flight: Plane, train: TrainFront, transfer: Car, hotel: BedDouble, activity: Ticket, connection: ArrowRight };

/** Global search: pages, trips and bookings, with "ask Safar Sathi" as the fallback. */
export function SearchCommand() {
  const { navigate } = useRouter();
  const { switchTrip } = useApp();
  const { trips } = useAllTrips();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, []);

  const results = useMemo<Result[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const go = (route: Route) => () => navigate(route);
    const pages: Result[] = [...primaryNav, ...secondaryNav]
      .filter((p) => p.label.toLowerCase().includes(q))
      .map((p) => ({ id: `page-${p.id}`, group: 'Pages', title: p.label, icon: p.icon, run: go(p.id) }));
    const tripHits: Result[] = trips
      .filter((t) => `${t.name} ${t.route}`.toLowerCase().includes(q))
      .slice(0, 4)
      .map((t) => ({ id: `trip-${t.id}`, group: 'Trips', title: t.route, subtitle: t.name, icon: Plane, run: () => { switchTrip(t.id); navigate('trip'); } }));
    const bookingHits: Result[] = trips
      .flatMap((t) => t.nodes.filter((n) => n.category !== 'connection').map((n) => ({ t, n })))
      .filter(({ n }) => `${n.title} ${n.subtitle} ${n.provider} ${n.confirmation ?? ''} ${n.label}`.toLowerCase().includes(q))
      .slice(0, 5)
      .map(({ t, n }) => ({ id: `node-${t.id}-${n.id}`, group: 'Bookings', title: n.title, subtitle: `${n.subtitle} · ${t.route}`, icon: kindIcon[nodeKind(n)], run: () => { switchTrip(t.id); navigate('trip'); } }));
    const ask: Result = { id: 'ask', group: 'Ask', title: `Ask Safar Sathi: “${query.trim()}”`, icon: MessageSquareText, run: () => navigate('assistant', { prompt: query.trim() }) };
    return [...pages, ...tripHits, ...bookingHits, ask];
  }, [query, trips, navigate, switchTrip]);

  const choose = (r: Result) => {
    r.run();
    setQuery('');
    setOpen(false);
    inputRef.current?.blur();
  };

  return (
    <div ref={wrapRef} className="relative min-w-0 flex-1 md:max-w-[600px]">
      <label className="flex h-12 items-center gap-3 rounded-2xl border border-line bg-white/95 px-4 shadow-card backdrop-blur focus-within:border-brand/50 focus-within:ring-4 focus-within:ring-brand/10">
        <Search className="h-5 w-5 shrink-0 text-ink-muted" />
        <span className="sr-only">Search</span>
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); setActive(0); }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
            else if (e.key === 'Enter' && results[active]) { e.preventDefault(); choose(results[active]); }
            else if (e.key === 'Escape') { setOpen(false); inputRef.current?.blur(); }
          }}
          placeholder="Search flights, trains, hotels or ask Safar Sathi..."
          className="min-w-0 flex-1 bg-transparent text-[15px] text-ink placeholder:text-ink-muted focus:outline-none"
          role="combobox"
          aria-expanded={open && results.length > 0}
          aria-controls="global-search-results"
          aria-autocomplete="list"
        />
        <kbd className="hidden shrink-0 rounded-lg border border-line bg-canvas px-2 py-1 font-sans text-xs font-medium text-ink-muted sm:inline">Ctrl K</kbd>
      </label>
      {open && results.length > 0 && (
        <div id="global-search-results" role="listbox" className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[420px] overflow-y-auto rounded-2xl border border-line bg-white p-2 shadow-lift animate-scale-in scrollbar-thin">
          {results.map((r, i) => {
            const showGroup = i === 0 || results[i - 1].group !== r.group;
            const Icon = r.icon;
            return (
              <div key={r.id}>
                {showGroup && r.group !== 'Ask' && <div className="eyebrow px-3 pb-1 pt-2">{r.group}</div>}
                <button
                  role="option"
                  aria-selected={i === active}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => choose(r)}
                  className={cn('flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left', i === active ? 'bg-brand-light/70' : 'hover:bg-canvas', r.group === 'Ask' && 'mt-1 border-t border-line pt-3')}
                >
                  <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', r.group === 'Ask' ? 'bg-ai-light text-ai' : 'bg-canvas text-brand')}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-ink">{r.title}</span>
                    {r.subtitle && <span className="block truncate text-xs text-ink-muted">{r.subtitle}</span>}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
