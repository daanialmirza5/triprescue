import { cn } from '@/lib/utils';
import { resolveDestinationImage, sceneImages } from '@/lib/destinationImages';
import { BedDouble, Car, CheckCircle2, MessageSquareText, Plane, RefreshCcw, Ticket, TrainFront, TriangleAlert } from 'lucide-react';

/** Brand illustration of what Safar Sathi does: one journey made of linked
 * bookings, a disruption on one leg, and the recovery that protects the rest.
 * Decorative only - the real data lives on the pages themselves. */

type Tone = 'safe' | 'danger' | 'risk' | 'brand';
const toneDot: Record<Tone, string> = { safe: 'bg-safe', danger: 'bg-danger', risk: 'bg-risk', brand: 'bg-brand-cyan' };
const toneText: Record<Tone, string> = { safe: 'text-safe', danger: 'text-danger', risk: 'text-risk-dark', brand: 'text-brand' };
const toneTile: Record<Tone, string> = { safe: 'bg-safe-light text-safe', danger: 'bg-danger-light text-danger', risk: 'bg-risk-light text-risk-dark', brand: 'bg-brand-light text-brand' };

const legs: { icon: typeof Plane; kind: string; title: string; city: string; time: string; status: string; tone: Tone }[] = [
  { icon: Plane, kind: 'Flight', title: 'Mumbai → Delhi', city: 'Mumbai', time: '08:00', status: '+95 min', tone: 'danger' },
  { icon: Car, kind: 'Transfer', title: 'Airport → Station', city: 'Delhi', time: '11:50', status: 'Re-timed', tone: 'brand' },
  { icon: TrainFront, kind: 'Train', title: 'Delhi → Agra', city: 'Delhi', time: '13:00', status: 'Rebooked', tone: 'brand' },
  { icon: BedDouble, kind: 'Hotel', title: 'Taj Hotel, Agra', city: 'Agra', time: '16:00', status: 'Protected', tone: 'safe' },
  { icon: Ticket, kind: 'Activity', title: 'Taj sunrise tour', city: 'Agra', time: '06:00', status: 'On Track', tone: 'safe' },
];

function HealthRing({ value, size = 56 }: { value: number; size?: number }) {
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <defs><linearGradient id="ia-ring" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#12B5E5" /><stop offset="1" stopColor="#1F6BFF" /></linearGradient></defs>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E8EEF7" strokeWidth="6" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="url(#ia-ring)" strokeWidth="6" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} />
    </svg>
  );
}

/** Wide variant for page heroes: the itinerary as a horizontal chain. */
export function ItineraryStrip({ className }: { className?: string }) {
  return (
    <div className={cn('pointer-events-none select-none', className)} aria-hidden="true">
      <div className="relative rounded-[22px] border border-white/80 bg-white/70 p-3 shadow-lift backdrop-blur-xl">
        <div className="mb-2 flex items-center justify-between px-1">
          <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink-muted">Your journey · one connected itinerary</span>
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-safe"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-safe" />Live</span>
        </div>
        <div className="relative flex items-stretch gap-2">
          <div className="absolute left-6 right-6 top-[26px] border-t-2 border-dashed border-brand/30" />
          {legs.map(({ icon: Icon, kind, title, time, status, tone }) => (
            <div key={kind} className="relative flex w-[92px] flex-col items-center text-center">
              <span className={cn('relative z-10 flex h-[52px] w-[52px] items-center justify-center rounded-2xl border-2 border-white shadow-card', toneTile[tone])}><Icon className="h-6 w-6" /></span>
              <span className="mt-1.5 text-[12px] font-bold text-ink">{kind}</span>
              <span className="w-full truncate text-[10.5px] text-ink-muted">{title}</span>
              <span className={cn('mt-1 inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[10.5px] font-semibold shadow-sm', toneText[tone])}>
                <span className={cn('h-1.5 w-1.5 rounded-full', toneDot[tone])} />{status}
              </span>
              <span className="mt-0.5 text-[10px] text-ink-faint">{time}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="ss-float absolute -top-4 left-6 flex items-center gap-1.5 rounded-xl bg-danger px-2.5 py-1.5 text-[11px] font-bold text-white shadow-lift">
        <TriangleAlert className="h-3.5 w-3.5" /> Flight delayed · train at risk
      </div>
      <div className="ss-float absolute -bottom-9 right-4 flex items-center gap-2 rounded-xl border border-ai/20 bg-white px-3 py-2 text-[11px] font-semibold text-ink shadow-lift" style={{ animationDelay: '1.5s' }}>
        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-ai-light text-ai"><RefreshCcw className="h-3.5 w-3.5" /></span>
        Recovered & re-validated · <span className="text-safe">94% healthy</span>
      </div>
    </div>
  );
}

/** Tall variant for the sign-in panel: the full itinerary story. */
export function ItineraryBoard({ className }: { className?: string }) {
  return (
    <div className={cn('pointer-events-none relative select-none', className)} aria-hidden="true">
      <div className="rounded-[26px] border border-white/80 bg-white/80 p-5 shadow-lift backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink-muted">Golden Triangle Getaway</div>
            <div className="mt-0.5 font-display text-lg font-bold text-ink">Mumbai → Delhi → Agra</div>
          </div>
          <div className="relative flex items-center justify-center">
            <HealthRing value={94} />
            <span className="absolute text-[13px] font-extrabold text-ink">94%</span>
          </div>
        </div>
        <ol className="relative mt-4 space-y-2.5">
          <div className="absolute bottom-6 left-[27px] top-6 border-l-2 border-dashed border-line-strong" />
          {legs.map(({ icon: Icon, kind, title, city, time, status, tone }, i) => (
            <li key={kind}>
              <div className="relative flex items-center gap-3 rounded-2xl border border-line bg-white p-2 pr-3 shadow-sm">
                <span className={cn('relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-white', toneTile[tone])}><Icon className="h-5 w-5" /></span>
                <img src={kind === 'Flight' ? sceneImages.flight : kind === 'Transfer' ? sceneImages.transfer : kind === 'Train' ? sceneImages.train : resolveDestinationImage(city)} alt="" className="h-10 w-14 shrink-0 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-bold text-ink">{title}</div>
                  <div className="text-[11px] text-ink-muted">{kind} · {time}</div>
                </div>
                <span className={cn('inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold', toneTile[tone])}>
                  <span className={cn('h-1.5 w-1.5 rounded-full', toneDot[tone])} />{status}
                </span>
              </div>
              {i === 0 && (
                <div className="ml-12 mt-2 flex items-center gap-2 rounded-xl border border-danger/20 bg-danger-light/70 px-3 py-1.5 text-[11px] font-semibold text-danger-dark">
                  <TriangleAlert className="h-3.5 w-3.5 shrink-0" /> UA 901 delayed 95 min — Delhi → Agra connection at risk
                </div>
              )}
              {i === 2 && (
                <div className="ml-12 mt-2 flex items-center gap-2 rounded-xl border border-brand/20 bg-brand-light/70 px-3 py-1.5 text-[11px] font-semibold text-brand">
                  <RefreshCcw className="h-3.5 w-3.5 shrink-0" /> Safar Sathi rebooked the connection · journey re-validated
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>
      <div className="ss-float absolute left-full top-[36%] -ml-5 flex w-[210px] items-start gap-2 rounded-2xl border border-ai/20 bg-white p-3 text-[11.5px] leading-snug text-ink-soft shadow-lift">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-ai-light text-ai"><MessageSquareText className="h-4 w-4" /></span>
        <span><b className="text-ink">AI Assistant:</b> Your hotel check-in is protected. No action needed.</span>
      </div>
      <div className="ss-float absolute -bottom-5 -left-5 flex items-center gap-2 rounded-2xl bg-white px-3 py-2 text-[12px] font-semibold text-ink shadow-lift" style={{ animationDelay: '2s' }}>
        <CheckCircle2 className="h-4 w-4 text-safe" /> 7/7 bookings preserved
      </div>
    </div>
  );
}
