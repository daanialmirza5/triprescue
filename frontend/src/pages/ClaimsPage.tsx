import { useState } from 'react';
import { useApp } from '@/store/AppContext';
import { useRouter } from '@/lib/router';
import { useToast } from '@/components/ui/ToastProvider';
import { PageHero } from '@/components/layout/PageHero';
import { MetricCard } from '@/components/ui/MetricCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatINR, isAffected, nodeKind } from '@/lib/journey';
import { cn } from '@/lib/utils';
import type { ItineraryNodeData } from '@/types';
import { BedDouble, Car, Check, ClipboardCopy, FileCheck2, FileText, MessageSquareText, Plane, ShieldAlert, Sparkles, TrainFront, WalletCards } from 'lucide-react';

type Eligibility = 'eligible' | 'standby' | 'credit';

function eligibility(n: ItineraryNodeData): Eligibility {
  if (!n.refundable) return 'credit';
  return isAffected(n.status) ? 'eligible' : 'standby';
}

const eligibilityMeta: Record<Eligibility, { label: string; cls: string }> = {
  eligible: { label: 'Eligible now', cls: 'bg-safe-light text-safe' },
  standby: { label: 'Refundable if disrupted', cls: 'bg-brand-light text-brand' },
  credit: { label: 'Credit / non-refundable', cls: 'bg-canvas text-ink-muted' },
};

const kindIcon = { flight: Plane, train: TrainFront, transfer: Car, hotel: BedDouble, activity: Sparkles, connection: Car };

export function ClaimsPage() {
  const { trip, activeDisruption } = useApp();
  const { navigate } = useRouter();
  const { addToast } = useToast();
  const [copied, setCopied] = useState<string | null>(null);
  const bookings = trip.nodes.filter((n) => n.category !== 'connection');
  const eligible = bookings.filter((n) => eligibility(n) === 'eligible');
  const eligibleTotal = eligible.reduce((s, n) => s + (n.refundAmount ?? 0), 0);
  const refundableTotal = bookings.filter((n) => n.refundable).reduce((s, n) => s + (n.refundAmount ?? 0), 0);
  const nonRefundable = bookings.filter((n) => !n.refundable).reduce((s, n) => s + n.cost, 0);

  const copySummary = async (n: ItineraryNodeData) => {
    const text = [
      `Refund request — ${n.title}`,
      `Provider: ${n.provider}`,
      n.confirmation ? `Booking reference: ${n.confirmation}` : '',
      `Scheduled: ${n.scheduledTime}`,
      `Status: ${n.status}${n.reason ? ` — ${n.reason}` : ''}`,
      activeDisruption ? `Cause: ${activeDisruption.label}` : '',
      `Policy: ${n.cancellationPolicy}`,
      `Amount requested: ${formatINR(n.refundAmount ?? 0)}`,
    ].filter(Boolean).join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(n.id);
      setTimeout(() => setCopied(null), 1800);
      addToast('success', 'Claim summary copied', 'Paste it into the provider’s refund form or email.');
    } catch {
      addToast('error', 'Could not copy', 'Your browser blocked clipboard access.');
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHero crumbs={[{ label: 'Claims' }]} showTripBadge title="Claims & Refunds" subtitle={`What you can recover on ${trip.route || 'this trip'}.`} description="Refund amounts come from each booking's cancellation policy, evaluated by the Safar Sathi refund engine." />
      <div className="relative z-10 space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard value={eligibleTotal} prefix="₹ " label="Claimable now" icon={<FileCheck2 />} accent="green" animate={false} sub={`${eligible.length} affected booking${eligible.length === 1 ? '' : 's'}`} />
          <MetricCard value={refundableTotal} prefix="₹ " label="Refundable value" icon={<WalletCards />} accent="cyan" animate={false} sub="If any booking is disrupted" />
          <MetricCard value={nonRefundable} prefix="₹ " label="Non-refundable" icon={<ShieldAlert />} accent="red" animate={false} sub="Credit or no refund" />
          <MetricCard value={bookings.length} label="Bookings reviewed" icon={<FileText />} accent="amber" animate={false} sub={trip.name} />
        </div>

        <section className="card overflow-hidden" aria-labelledby="claims-title">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-5">
            <div>
              <h2 id="claims-title" className="section-title">Refund eligibility by booking</h2>
              <p className="text-sm text-ink-muted">{activeDisruption ? `Triggered by: ${activeDisruption.label}` : 'No active disruption — amounts shown are what you could recover if one happens.'}</p>
            </div>
            <button onClick={() => navigate('assistant', { prompt: 'Help me claim a refund' })} className="btn-primary"><MessageSquareText className="h-4 w-4" /> Ask AI about refunds</button>
          </div>
          <ul className="divide-y divide-line">
            {bookings.map((n) => {
              const e = eligibility(n);
              const Icon = kindIcon[nodeKind(n)];
              return (
                <li key={n.id} className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center">
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-light text-brand"><Icon className="h-5 w-5" /></span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2"><span className="font-bold text-ink">{n.title}</span><StatusBadge status={n.status} /></div>
                      <div className="text-sm text-ink-muted">{n.provider}{n.confirmation ? ` · ${n.confirmation}` : ''} · {n.scheduledTime}</div>
                      <div className="mt-1 text-xs text-ink-soft">{n.cancellationPolicy}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                    <span className={cn('pill', eligibilityMeta[e].cls)}>{eligibilityMeta[e].label}</span>
                    <div className="w-24 text-right"><div className="text-[15px] font-bold text-ink">{formatINR(n.refundAmount ?? 0)}</div><div className="text-[11px] text-ink-muted">of {formatINR(n.cost)}</div></div>
                    {e === 'eligible' && (
                      <>
                        <button onClick={() => copySummary(n)} className="btn-ghost px-3 py-2 text-xs">{copied === n.id ? <Check className="h-4 w-4 text-safe" /> : <ClipboardCopy className="h-4 w-4" />} Claim summary</button>
                        <button onClick={() => navigate('assistant', { prompt: `Help me claim a refund for ${n.title}${n.confirmation ? ` (ref ${n.confirmation})` : ''}` })} className="btn-outline px-3 py-2 text-xs"><Sparkles className="h-4 w-4" /> Draft with AI</button>
                      </>
                    )}
                  </div>
                </li>
              );
            })}
            {bookings.length === 0 && <li className="p-8 text-center text-sm text-ink-muted">No bookings on this trip yet.</li>}
          </ul>
        </section>
      </div>
    </div>
  );
}
