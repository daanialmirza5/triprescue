import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { DestinationImage } from '@/components/travel/DestinationImage';
import { sceneImages } from '@/lib/destinationImages';
import { durationBetween, formatDay, formatINR, formatMinutes, formatTime } from '@/lib/journey';
import { optionBadge, whyBullets, type OptionRoute } from '@/lib/recovery';
import { toConciseLine } from '@/lib/concise';
import { riskTone, toneClasses } from '@/lib/status';
import type { RecoveryOption } from '@/types';
import { BadgePercent, Car, CheckCircle2, ChevronDown, Crown, Hotel, Lightbulb, Plane, ShieldCheck, Sparkles, TrainFront, Zap } from 'lucide-react';

const modeIcon = { flight: Plane, train: TrainFront, transfer: Car };
const modeScene = { flight: sceneImages.flight, train: sceneImages.train, transfer: sceneImages.transfer };
const badgeIcon = { safe: Sparkles, ai: BadgePercent, risk: Crown, brand: Zap };

interface Chip { label: string; tone: 'brand' | 'safe' | 'ai' | 'risk'; icon: typeof Zap }

function chipsFor(option: RecoveryOption, route: OptionRoute | null, isFastest: boolean, isCheapest: boolean): Chip[] {
  const chips: Chip[] = [];
  if (isFastest) chips.push({ label: 'Fastest recovery', tone: 'brand', icon: Zap });
  if (isCheapest) chips.push({ label: 'Lowest cost', tone: 'ai', icon: BadgePercent });
  if (route?.mode === 'transfer' && option.scoreBreakdown.comfort >= 85) chips.push({ label: 'Less rushing', tone: 'risk', icon: Crown });
  if (option.bookingsPreserved >= option.totalBookings) chips.push({ label: 'Hotel unaffected', tone: 'safe', icon: Hotel });
  else if (option.residualRisk === 'low') chips.push({ label: 'Reliable option', tone: 'safe', icon: ShieldCheck });
  if (chips.length < 2 && option.residualRisk !== 'high') chips.push({ label: 'Reliable option', tone: 'safe', icon: ShieldCheck });
  return chips.slice(0, 2);
}

interface RecoveryPlanCardProps {
  option: RecoveryOption;
  route: OptionRoute | null;
  rank: number;
  selected: boolean;
  isFastest: boolean;
  isCheapest: boolean;
  onSelect: () => void;
}

export function RecoveryPlanCard({ option, route, rank, selected, isFastest, isCheapest, onSelect }: RecoveryPlanCardProps) {
  const [whyOpen, setWhyOpen] = useState(true);
  const badge = optionBadge(option, rank);
  const BadgeIcon = badgeIcon[badge.tone];
  const risk = toneClasses[riskTone[option.residualRisk]];
  const ModeIcon = route ? modeIcon[route.mode] : Plane;
  const nextDay = !!(route?.arrive && route.depart && route.arrive.toDateString() !== route.depart.toDateString());
  const arrival = route?.arrive ? formatTime(route.arrive) : option.timeImpactMinutes ? `+${formatMinutes(option.timeImpactMinutes)}` : 'On time';

  return (
    <article
      className={cn(
        'card relative flex flex-col p-5 transition duration-200 animate-fade-in-up',
        selected ? 'border-brand shadow-lift ring-4 ring-brand/15' : 'hover:border-brand/30 hover:shadow-lift'
      )}
      style={{ animationDelay: `${rank * 80}ms` }}
    >
      <button onClick={onSelect} className="absolute inset-0 z-0 rounded-card" aria-pressed={selected} aria-label={`Select plan: ${option.name}`} />
      <div className="pointer-events-none relative z-[1] flex items-start justify-between gap-3">
        <div>
          <span className={cn('pill', toneClasses[badge.tone].pill)}><BadgeIcon className="h-3.5 w-3.5" />{badge.label}</span>
          <h3 className="mt-3 font-display text-xl font-bold text-ink">{option.name}</h3>
          <p className="mt-0.5 text-sm text-ink-muted">{option.description.length > 60 ? optionSubtitle(badge.tone) : option.description}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="hidden text-[11px] text-ink-muted sm:block">Recovery Score</span>
          <ScoreRing score={option.score} size={62} strokeWidth={6} gradient suffix="%" valueClassName="text-[15px]" label="" />
        </div>
      </div>

      <div className="pointer-events-none relative z-[1] mt-4 flex items-center gap-3">
        <DestinationImage src={route ? modeScene[route.mode] : sceneImages.flight} alt={route?.mode ?? 'journey'} className="h-16 w-20 shrink-0 rounded-xl" />
        <div className="min-w-0 flex-1">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <div className="min-w-0">
              <div className="truncate text-sm text-ink-soft">{route?.from ?? '—'}</div>
              <div className="font-display text-lg font-bold text-ink">{route?.depart ? formatTime(route.depart) : '—'}</div>
            </div>
            <div className="flex flex-col items-center text-brand">
              <ModeIcon className="h-5 w-5" />
              <div className="my-1 h-px w-12 border-t border-dashed border-brand/60" />
              <span className="whitespace-nowrap text-[11px] text-ink-muted">{durationBetween(route?.depart, route?.arrive) ?? ''}</span>
            </div>
            <div className="min-w-0 text-right">
              <div className="truncate text-sm text-ink-soft">{route?.to ?? '—'}</div>
              <div className="font-display text-lg font-bold text-ink">{route?.arrive ? formatTime(route.arrive) : '—'}</div>
              {nextDay && route?.arrive && <div className="text-[11px] font-semibold text-risk-dark">{formatDay(route.arrive)}</div>}
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none relative z-[1] mt-4 flex flex-wrap gap-2">
        {chipsFor(option, route, isFastest, isCheapest).map(({ label, tone, icon: Icon }) => (
          <span key={label} className={cn('pill', toneClasses[tone].pill)}><Icon className="h-3.5 w-3.5" />{label}</span>
        ))}
      </div>

      <dl className="pointer-events-none relative z-[1] mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4">
        <Metric label="Extra Cost" value={option.costDelta > 0 ? formatINR(option.costDelta) : formatINR(0)} />
        <Metric label="Arrival Time" value={arrival} />
        <Metric label="Preserved" value={`${option.bookingsPreserved}/${option.totalBookings}`} accent="text-safe" />
        <div className="bg-white px-2.5 py-2.5">
          <dt className="whitespace-nowrap text-[11px] text-ink-muted">Risk</dt>
          <dd className="mt-1"><span className={cn('pill capitalize', risk.pill)}><span className={cn('h-1.5 w-1.5 rounded-full', risk.solid)} />{option.residualRisk}</span></dd>
        </div>
      </dl>

      <div className="relative z-[1] mt-4 rounded-2xl bg-canvas/80">
        <button onClick={() => setWhyOpen((v) => !v)} className="flex w-full items-center justify-between px-4 py-3 text-left" aria-expanded={whyOpen}>
          <span className="flex items-center gap-2 text-sm font-bold text-ink"><Lightbulb className="h-4 w-4 text-risk" />Why this plan?</span>
          <ChevronDown className={cn('h-4 w-4 text-ink-muted transition', whyOpen && 'rotate-180')} />
        </button>
        {whyOpen && (
          <ul className="space-y-1.5 px-4 pb-4">
            {(option.narrative ? [toConciseLine(option.narrative, 140)] : whyBullets(option).slice(0, 1)).map((b) => (
              <li key={b} className="flex items-start gap-2 text-xs text-ink-soft">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-safe" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}

function optionSubtitle(tone: 'safe' | 'ai' | 'risk' | 'brand') {
  return { safe: 'Quickest and most reliable option', ai: 'Cost-effective with minimal impact', risk: 'Relaxed journey with minimal hassle', brand: 'Alternative recovery path' }[tone];
}

function Metric({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="bg-white px-2.5 py-2.5">
      <dt className="whitespace-nowrap text-[11px] text-ink-muted">{label}</dt>
      <dd className={cn('mt-1 whitespace-nowrap text-[14px] font-bold text-ink', accent)}>{value}</dd>
    </div>
  );
}
