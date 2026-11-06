import { useEffect, useState } from 'react';
import * as api from '@/services/api';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { cn } from '@/lib/utils';
import { shortText } from '@/lib/concise';
import { AlertTriangle, Car, CheckCircle2, CloudLightning, Megaphone, Plane, Users } from 'lucide-react';

const ICONS: Record<api.SocialSignalType, typeof Plane> = {
  airport_congestion: Plane,
  road_waterlogging: Car,
  transit_strike: Megaphone,
  weather_warning: CloudLightning,
  crowd_surge: Users,
  all_clear: CheckCircle2,
};

const URGENCY: Record<api.SocialSignal['urgency'], string> = {
  critical: 'bg-danger text-white',
  high: 'bg-danger-light text-danger',
  medium: 'bg-risk-light text-risk-dark',
  low: 'bg-safe-light text-safe',
};

interface SocialSignalsTickerProps {
  tripId: string;
  /** Scenario signals from a twin run; when set, polling pauses and these are shown. */
  scenario?: api.SocialSignals | null;
  intervalMs?: number;
}

/** Traveler-report feed along the route. Real public posts (Mastodon hashtag
 * timelines) where available, otherwise signals synthesized from each hub's
 * weather - the header and every row say which. */
export function SocialSignalsTicker({ tripId, scenario, intervalMs = 20_000 }: SocialSignalsTickerProps) {
  const [live, setLive] = useState<api.SocialSignals | null>(null);
  const [active, setActive] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (scenario || !tripId) return;
    let cancelled = false;
    const load = () => api.getSocialSignals(tripId).then((s) => { if (!cancelled) setLive(s); }).catch(() => { /* ticker is supplementary */ });
    load();
    const timer = setInterval(load, intervalMs);
    return () => { cancelled = true; clearInterval(timer); };
  }, [tripId, scenario, intervalMs]);

  const feed = scenario ?? live;
  const signals = feed?.signals ?? [];
  useEffect(() => { setActive(0); }, [feed]);
  useEffect(() => {
    if (reduced || signals.length < 2) return;
    const t = setInterval(() => setActive((i) => (i + 1) % signals.length), 4000);
    return () => clearInterval(t);
  }, [signals.length, reduced]);

  const current = signals[active] ?? signals[0];
  const hasReal = signals.some((s) => s.source === 'mastodon');
  const hasSimulated = signals.some((s) => s.source !== 'mastodon');
  return (
    <section className="card overflow-hidden" aria-labelledby="signals-title">
      <div className="flex flex-wrap items-center gap-2 border-b border-line px-5 py-3">
        <h2 id="signals-title" className="section-title">Traveler signals</h2>
        {hasReal && <span className="pill bg-safe-light text-safe" title="Real public posts from Mastodon hashtag timelines for the places on this trip.">Live · Mastodon</span>}
        {hasSimulated && <span className="pill bg-canvas text-ink-muted" title="Synthesized from the weather at each place where no real post was available.">Simulated</span>}
        {scenario && <span className="pill bg-ai-light text-ai">Scenario feed</span>}
        {feed && signals.length > 0 && <span className="ml-auto text-xs text-ink-muted">{signals.length} report{signals.length === 1 ? '' : 's'}</span>}
      </div>
      {current ? (
        <div aria-live="polite" className="px-5 py-3">
          <SignalRow key={current.id} signal={current} highlight />
          {signals.length > 1 && (
            <ul className="mt-2 space-y-1.5 border-t border-line pt-2">
              {signals.filter((s) => s !== current).slice(0, 2).map((s) => <li key={s.id}><SignalRow signal={s} /></li>)}
            </ul>
          )}
        </div>
      ) : (
        <p className="px-5 py-4 text-sm text-ink-muted">{feed ? 'No traveler reports along this route.' : 'Listening for traveler reports…'}</p>
      )}
    </section>
  );
}

function SignalRow({ signal, highlight }: { signal: api.SocialSignal; highlight?: boolean }) {
  const Icon = signal.urgency === 'critical' && signal.type !== 'all_clear' ? AlertTriangle : ICONS[signal.type];
  return (
    <div className={cn('flex items-start gap-3', highlight && 'animate-fade-in-up')}>
      <span className={cn('flex shrink-0 items-center justify-center rounded-lg', highlight ? 'h-9 w-9' : 'h-7 w-7', URGENCY[signal.urgency])}>
        <Icon className={highlight ? 'h-4 w-4' : 'h-3.5 w-3.5'} aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className={cn('truncate leading-snug text-ink', highlight ? 'text-sm font-medium' : 'text-[13px] text-ink-soft')} title={signal.text}>{shortText(signal.text, 70)}</p>
        <p className="mt-0.5 text-[11px] text-ink-muted">
          {signal.location} · {signal.minutesAgo}m
          {signal.source === 'mastodon' && signal.url && <> · <a href={signal.url} target="_blank" rel="noopener noreferrer" className="font-medium text-brand hover:underline">post ↗</a></>}
        </p>
      </div>
    </div>
  );
}
