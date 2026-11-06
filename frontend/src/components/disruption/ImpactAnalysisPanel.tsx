import { toConciseLine } from '@/lib/concise';
import { useEffect, useMemo, useState } from 'react';
import { useApp } from '@/store/AppContext';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/status';
import { CountUp } from '@/components/ui/CountUp';
import { ItineraryGraph } from '@/components/graph/ItineraryGraph';
import { AlertTriangle, ShieldAlert, DollarSign, ArrowRight, GitBranch, CheckCircle2 } from 'lucide-react';

interface Props { fullPage?: boolean; onNavigate?: (page: string) => void; }
export function ImpactAnalysisPanel({ fullPage = false, onNavigate }: Props) {
  const { activeDisruption, trip } = useApp();
  const [revealed, setRevealed] = useState(0);
  const [showGraph, setShowGraph] = useState(false);
  const steps = activeDisruption?.cascadeSteps ?? [];
  const stepCount = steps.length;
  const disruptionId = activeDisruption?.id;
  // Staged reveal: restarts for a new disruption; only the step count matters.
  useEffect(() => {
    setRevealed(stepCount ? 1 : 0);
    if (stepCount < 2) return;
    const timers = Array.from({ length: stepCount - 1 }, (_, i) => window.setTimeout(() => setRevealed(i + 2), 650 * (i + 1)));
    return () => timers.forEach(clearTimeout);
  }, [disruptionId, stepCount]);
  const primaryNode = trip.nodes.find(n=>n.id===activeDisruption?.primaryNodeId);
  // The backend's narrative explains the actual cascade; the template is the offline-demo fallback.
  const narrative = useMemo(()=>activeDisruption ? activeDisruption.narrative || `Your ${activeDisruption.label.toLowerCase()} affects ${activeDisruption.downstreamImpact} downstream booking${activeDisruption.downstreamImpact===1?'':'s'}. SafarSathi is tracing dependency buffers to separate broken commitments from bookings that remain safe.` : '', [activeDisruption]);
  if (!activeDisruption) return <div className="rounded-2xl border border-dashed border-line-strong bg-white p-10 text-center"><CheckCircle2 className="mx-auto h-8 w-8 text-safar-safe"/><h2 className="mt-3 font-semibold text-ink">No active disruption</h2><p className="mt-1 text-sm text-ink-muted">Your journey is currently being monitored.</p></div>;
  return <div className={cn('space-y-5', !fullPage && 'h-full overflow-y-auto')}>
    <div className="rounded-2xl border border-safar-broken/20 bg-white p-5 shadow-card"><div className="flex flex-wrap items-start justify-between gap-4"><div><div className="flex items-center gap-2 text-safar-broken"><ShieldAlert className="h-5 w-5"/><span className="text-xs font-bold uppercase tracking-wider">Disruption detected</span></div><h2 className="mt-2 text-xl font-bold text-ink">{primaryNode?.title ?? activeDisruption.primaryNodeId}</h2><p className="mt-1 text-sm text-ink-muted">{activeDisruption.label}</p></div><div className="rounded-full bg-safar-broken/10 px-3 py-1.5 text-xs font-semibold text-safar-broken">{activeDisruption.impactLevel.toUpperCase()} impact</div></div></div>
    <div className="ai-surface rounded-2xl p-5"><div className="text-[10px] font-bold uppercase tracking-wider text-safar-ai">✦ SAFARSATHI INSIGHT</div><p className="mt-2 max-w-3xl text-sm leading-6 text-ink-soft">{toConciseLine(narrative, 140)}</p><button onClick={()=>setShowGraph(v=>!v)} className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-safar-ai">{showGraph ? 'Hide dependency view' : 'Why? Show dependency view'} <GitBranch className="h-3.5 w-3.5"/></button></div>
    {showGraph && <div className="rounded-2xl border border-line bg-white p-3 shadow-card animate-slide-in-right"><div className="mb-2 px-2 text-xs text-ink-muted">Supporting graph view — the graph is an explanation, not the primary interface.</div><div className="h-[420px]"><ItineraryGraph nodes={trip.nodes} edges={trip.edges}/></div></div>}
    <div className="rounded-2xl border border-line bg-white p-5 shadow-card"><div className="mb-5 flex items-center justify-between"><div><h3 className="text-sm font-bold text-ink">What this affects</h3><p className="text-xs text-ink-muted">SafarSathi reveals the cascade in sequence.</p></div><span className="text-xs text-ink-muted">{Math.min(revealed,steps.length)}/{steps.length} stages</span></div><div className="space-y-1">{steps.map((step,i)=>{const visible=i<revealed; const critical=i===0?'bg-safar-saffron/10 text-safar-saffron':i<3?'bg-safar-broken/10 text-safar-broken':'bg-safar-risk/10 text-safar-risk'; return <div key={step.id} className={cn('flex items-start gap-3 transition-all duration-500',visible?'opacity-100 translate-x-0':'opacity-0 translate-x-4')}><div className="flex flex-col items-center"><div className={cn('flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold',visible?cn('animate-cascade border-current',critical):'border-line bg-canvas text-ink-faint')}>{i+1}</div>{i<steps.length-1&&<div className="h-10 w-px bg-line"/>}</div><div className="min-w-0 flex-1 rounded-xl border border-line bg-canvas p-3"><div className="flex items-center justify-between gap-3"><span className="text-xs font-semibold text-ink">{step.description}</span>{visible&&<span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold',critical)}>{i===0?'Triggered':i<3?'Affected':'Checked'}</span>}</div><div className="mt-1 text-[10px] text-ink-muted">Stage {i+1} · {step.timestamp}</div></div></div>})}</div></div>
    <div className={cn('grid grid-cols-2 gap-3 transition-all duration-700',revealed>=steps.length?'opacity-100 translate-y-0':'opacity-0 translate-y-3')}><ImpactStat label="Direct impact" value={`${activeDisruption.directImpact} booking`} icon={<AlertTriangle className="h-4 w-4 text-safar-saffron"/>}/><ImpactStat label="Downstream impact" value={`${activeDisruption.downstreamImpact} bookings`} icon={<ArrowRight className="h-4 w-4 text-safar-broken"/>}/><ImpactStat label="Financial exposure" value={formatCurrency(activeDisruption.financialExposure)} count={activeDisruption.financialExposure} icon={<DollarSign className="h-4 w-4 text-safar-broken"/>}/><ImpactStat label="Refund exposure" value={formatCurrency(activeDisruption.refundExposure)} count={activeDisruption.refundExposure} icon={<DollarSign className="h-4 w-4 text-safar-saffron"/>}/></div>
    {fullPage && <div className="flex justify-end"><button onClick={()=>onNavigate?.('recovery')} className="rounded-xl bg-safar-blue px-4 py-2.5 text-sm font-semibold text-white">See recovery options →</button></div>}
  </div>;
}
function ImpactStat({label,value,icon,count}:{label:string;value:string;icon:React.ReactNode;count?:number}) { return <div className="rounded-2xl border border-line bg-white p-4 shadow-card"><div className="flex items-center gap-2">{icon}<span className="text-xs text-ink-muted">{label}</span></div><div className="mt-2 text-lg font-bold text-ink">{count != null ? <CountUp value={count} prefix="₹"/> : value}</div></div>; }
