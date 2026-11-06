import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useInView, usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { JourneyRoute } from '@/components/travel/JourneyRoute';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { BotAvatar } from '@/components/ai/AssistantParts';
import { Logo } from '@/components/brand/Logo';
import { resolveDestinationImage, sceneImages } from '@/lib/destinationImages';
import type { Journey } from '@/lib/journey';
import type { ItineraryNodeData, NodeStatus } from '@/types';
import {
  ArrowRight, BadgePercent, BedDouble, BellRing, Brain, Car, CheckCircle2, ChevronDown, ClipboardList, Crown, FileCheck2, GitBranch,
  PlayCircle, Plane, RefreshCcw, ScanSearch, ShieldCheck, Sparkles, Ticket, TrainFront, TriangleAlert, Zap,
} from 'lucide-react';

export function SectionHeading({ eyebrow, title, text, center = true }: { eyebrow: string; title: ReactNode; text?: string; center?: boolean }) {
  return (
    <div className={cn('max-w-2xl', center && 'mx-auto text-center')}>
      <span className="pill bg-brand-light text-brand"><Sparkles className="h-3.5 w-3.5" />{eyebrow}</span>
      <h2 className="mt-4 font-display text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-[40px]">{title}</h2>
      {text && <p className="mt-3 text-[17px] leading-relaxed text-ink-soft">{text}</p>}
    </div>
  );
}

function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, 0.15);
  return (
    <div ref={ref} className={cn('transition duration-700 ease-out', inView ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0', className)} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

// ---- 2. The problem -------------------------------------------------------------

const cascade = [
  { icon: Plane, title: 'Flight delayed', text: 'Mumbai → Delhi, +95 min', tone: 'bg-danger-light text-danger', status: 'Delayed' },
  { icon: TrainFront, title: 'Train connection', text: 'Only 45 min left to reach the station', tone: 'bg-risk-light text-risk', status: 'At Risk' },
  { icon: BedDouble, title: 'Hotel check-in', text: 'Late arrival in Agra', tone: 'bg-risk-light text-risk', status: 'At Risk' },
  { icon: Ticket, title: 'Sunrise tour', text: 'Next morning, non-refundable', tone: 'bg-danger-light text-danger', status: 'Exposed' },
];

export function ProblemSection() {
  return (
    <section id="problem" className="scroll-mt-24 px-4 py-20 sm:px-8">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <SectionHeading center={false} eyebrow="The problem" title={<>One delay rarely breaks <span className="text-brand">just one booking.</span></>} text="Travel apps alert you about a single flight. Nobody tells you that the train, the hotel and tomorrow's tour now depend on a connection you can no longer make — or what to do about it." />
        </Reveal>
        <div className="relative space-y-3">
          <div className="absolute bottom-8 left-[27px] top-8 w-px border-l-2 border-dashed border-line-strong" aria-hidden="true" />
          {cascade.map(({ icon: Icon, title, text, tone, status }, i) => (
            <Reveal key={title} delay={i * 120}>
              <div className="card relative flex items-center gap-4 p-4">
                <span className={cn('flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl', tone)}><Icon className="h-6 w-6" /></span>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-ink">{title}</div>
                  <div className="text-sm text-ink-muted">{text}</div>
                </div>
                <span className={cn('pill', tone)}><TriangleAlert className="h-3.5 w-3.5" />{status}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- 3. How it works ------------------------------------------------------------

const steps = [
  { icon: ClipboardList, title: 'Plan', text: 'Add flights, trains, transfers, hotels and activities.' },
  { icon: BellRing, title: 'Monitor', text: 'Every booking and connection is tracked continuously.' },
  { icon: ScanSearch, title: 'Detect', text: 'Delays and cancellations are caught the moment they happen.' },
  { icon: GitBranch, title: 'Understand', text: 'The impact is propagated through your whole itinerary.' },
  { icon: RefreshCcw, title: 'Recover', text: 'Ranked recovery plans, built around your priorities.' },
  { icon: ShieldCheck, title: 'Re-validate', text: 'The new journey is re-checked end to end before you go.' },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="scroll-mt-24 bg-white/60 px-4 py-20 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <Reveal><SectionHeading eyebrow="How Safar Sathi works" title="From disruption to recovered journey in six steps" /></Reveal>
        <div className="relative mt-14">
          <div className="absolute left-[8%] right-[8%] top-8 hidden h-px border-t-2 border-dashed border-brand/30 lg:block" aria-hidden="true">
            <Plane className="ss-glide absolute -top-[13px] h-6 w-6 fill-brand text-brand" />
          </div>
          <ol className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-6">
            {steps.map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 90}>
                <li className="relative flex flex-col items-center text-center">
                  <span className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-line bg-white text-brand shadow-card"><Icon className="h-7 w-7" /></span>
                  <span className="mt-3 text-[11px] font-bold tracking-widest text-ink-faint">STEP {i + 1}</span>
                  <h3 className="mt-1 font-display text-lg font-bold text-ink">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-muted">{text}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

// ---- 4. Live disruption detection -----------------------------------------------

const node = (id: string, title: string): ItineraryNodeData => ({
  id, title, category: 'flight', label: title, subtitle: '', location: '', scheduledTime: '', provider: '', cost: 0,
  cancellationPolicy: '', refundable: false, riskLevel: 0, dependencyCount: 0, status: 'healthy', day: 1, icon: '',
});
const at = (h: number, m: number) => { const d = new Date(); d.setHours(h, m, 0, 0); return d; };

function sampleJourney(stage: 0 | 1 | 2): Journey {
  const delhi: NodeStatus = stage === 0 ? 'healthy' : 'delayed';
  const agra: NodeStatus = stage === 0 ? 'healthy' : stage === 1 ? 'at-risk' : 'recovered';
  return {
    stops: [
      { city: 'Mumbai', code: 'BOM', status: 'healthy', role: 'origin', time: at(8, 0) },
      { city: 'Delhi', code: 'DEL', status: delhi, role: 'via', time: stage === 0 ? at(10, 15) : at(11, 50) },
      { city: 'Agra', code: 'AGC', status: agra, role: 'destination', time: at(15, 5) },
    ],
    legs: [
      { node: node('f', 'Mumbai → Delhi'), mode: 'flight', from: 'Mumbai', to: 'Delhi', status: delhi, delayMinutes: stage === 0 ? 0 : 95, start: at(8, 0), end: at(10, 15) },
      { node: node('t', 'Delhi → Agra'), mode: 'train', from: 'Delhi', to: 'Agra', status: agra, delayMinutes: 0, start: at(13, 25), end: at(15, 5) },
    ],
    stays: [],
    activities: [],
  };
}

const detectionCopy = [
  { label: 'Monitoring', text: 'All legs on schedule. Safar Sathi watches every connection buffer.', tone: 'bg-safe-light text-safe' },
  { label: 'Disruption detected', text: 'UA 901 is running 95 minutes late — the Delhi → Agra train is now at risk.', tone: 'bg-danger-light text-danger' },
  { label: 'Recovered', text: 'The connection was rebooked and the journey re-validated. Hotel check-in is protected.', tone: 'bg-brand-light text-brand' },
];

export function LiveDetectionSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, 0.3);
  const reduced = usePrefersReducedMotion();
  const [stage, setStage] = useState<0 | 1 | 2>(reduced ? 1 : 0);
  useEffect(() => {
    if (!inView || reduced) return;
    const id = setInterval(() => setStage((s) => ((s + 1) % 3) as 0 | 1 | 2), 2800);
    return () => clearInterval(id);
  }, [inView, reduced]);

  return (
    <section id="features" className="scroll-mt-24 px-4 py-20 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <Reveal><SectionHeading eyebrow="Live disruption detection" title="See the ripple before it reaches you" text="Safar Sathi models your trip as connected bookings, so a delay on one leg immediately shows up wherever it matters downstream." /></Reveal>
        <div ref={ref} className="card mt-12 p-5 sm:p-7">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Detection stage">
              {detectionCopy.map((d, i) => (
                <button key={d.label} role="tab" aria-selected={stage === i} onClick={() => setStage(i as 0 | 1 | 2)} className={cn('pill border px-3 py-1.5 text-xs transition', stage === i ? cn(d.tone, 'border-transparent') : 'border-line bg-white text-ink-muted')}>{d.label}</button>
              ))}
            </div>
            <p className="max-w-md text-sm text-ink-soft" aria-live="polite">{detectionCopy[stage].text}</p>
          </div>
          <JourneyRoute journey={sampleJourney(stage)} />
        </div>
      </div>
    </section>
  );
}

// ---- 5. Recovery engine -----------------------------------------------------------

const plans = [
  { badge: 'Recommended', tone: 'bg-safe-light text-safe', icon: Sparkles, title: 'Keep Your Arrival On Track', score: 96, cost: '₹1,250', arrive: '02:30 PM', risk: 'Low', mode: Plane, img: sceneImages.flight },
  { badge: 'Save More', tone: 'bg-ai-light text-ai', icon: BadgePercent, title: 'Lowest Extra Cost', score: 89, cost: '₹0', arrive: '04:10 PM', risk: 'Medium', mode: TrainFront, img: sceneImages.train },
  { badge: 'More Comfort', tone: 'bg-risk-light text-risk-dark', icon: Crown, title: 'Maximum Comfort', score: 92, cost: '₹2,400', arrive: '03:20 PM', risk: 'Low', mode: Car, img: sceneImages.transfer },
];

export function RecoverySection() {
  return (
    <section className="scroll-mt-24 bg-white/60 px-4 py-20 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <Reveal><SectionHeading eyebrow="Recovery engine" title="Three ways forward, ranked for you" text="Every plan is checked against your whole itinerary, scored on speed, cost, comfort and risk, and explained — you choose what matters most." /></Reveal>
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {plans.map((p, i) => (
            <Reveal key={p.title} delay={i * 120}>
              <article className={cn('card card-hover h-full p-5', i === 0 && 'border-brand shadow-[0_0_0_3px_rgba(31,107,255,.12)]')}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className={cn('pill', p.tone)}><p.icon className="h-3.5 w-3.5" />{p.badge}</span>
                    <h3 className="mt-3 font-display text-lg font-bold text-ink">{p.title}</h3>
                  </div>
                  <ScoreRing score={p.score} size={58} strokeWidth={6} gradient suffix="%" valueClassName="text-[14px]" label="" />
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <img src={p.img} alt="" loading="lazy" className="h-14 w-20 rounded-xl object-cover" />
                  <div className="flex flex-1 items-center justify-between text-sm">
                    <span className="font-semibold text-ink">Delhi</span>
                    <p.mode className="h-5 w-5 text-brand" />
                    <span className="font-semibold text-ink">Agra</span>
                  </div>
                </div>
                <dl className="mt-4 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-line bg-line text-center text-xs">
                  {[['Extra cost', p.cost], ['Arrival', p.arrive], ['Risk', p.risk]].map(([k, v]) => (
                    <div key={k} className="bg-white px-2 py-2.5"><dt className="text-ink-muted">{k}</dt><dd className="mt-0.5 text-sm font-bold text-ink">{v}</dd></div>
                  ))}
                </dl>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- 6. AI copilot ---------------------------------------------------------------

export function CopilotSection() {
  return (
    <section className="scroll-mt-24 px-4 py-20 sm:px-8">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <SectionHeading center={false} eyebrow="AI copilot" title={<>Ask anything. <span className="text-ai">Get grounded answers.</span></>} text="The Safar Sathi assistant explains your live trip state — why a connection is at risk, which plan is cheapest, what you can claim — using the same engine data you see on screen." />
          <ul className="mt-6 space-y-2.5 text-[15px] text-ink-soft">
            {['Explains every status in plain language', 'Runs what-if delay simulations as a dry run', 'Drafts refund claims and support messages'].map((t) => (
              <li key={t} className="flex items-center gap-2.5"><CheckCircle2 className="h-5 w-5 text-safe" />{t}</li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={150}>
          <div className="card space-y-4 p-5 sm:p-6">
            <div className="flex justify-end">
              <div className="max-w-[85%] rounded-2xl rounded-tr-md bg-brand-light px-4 py-3 text-[15px] text-ink">Why is my Agra train at risk?</div>
            </div>
            <div className="flex items-start gap-3">
              <BotAvatar />
              <div className="rounded-2xl rounded-tl-md border border-line bg-white px-4 py-3 text-[15px] leading-relaxed text-ink-soft shadow-sm">
                UA 901 now lands at 11:50 AM (+95 min). Reaching New Delhi station takes ~50 min, leaving only <b className="text-risk-dark">45 min</b> before your train — 60 min is recommended. Rebooking now keeps your Taj hotel check-in intact.
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pl-14">
              {['Show recovery options', 'Help me claim a refund'].map((c) => <span key={c} className="rounded-xl border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink-soft">{c}</span>)}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ---- 7. Multi-leg journey visualization -----------------------------------------------

const chain = [
  { icon: Plane, label: 'Flight', city: 'Mumbai' },
  { icon: Car, label: 'Transfer', city: 'Delhi' },
  { icon: TrainFront, label: 'Train', city: 'Delhi' },
  { icon: BedDouble, label: 'Hotel', city: 'Agra' },
  { icon: Ticket, label: 'Activity', city: 'Agra' },
];
type ChainState = 'ok' | 'hit' | 'risk' | 'fixed';
const chainStyle: Record<ChainState, { ring: string; pill: string; text: string }> = {
  ok: { ring: 'border-safe/40', pill: 'bg-safe-light text-safe', text: 'On Track' },
  hit: { ring: 'border-danger/50', pill: 'bg-danger-light text-danger', text: 'Delayed' },
  risk: { ring: 'border-risk/50', pill: 'bg-risk-light text-risk-dark', text: 'At Risk' },
  fixed: { ring: 'border-brand/50', pill: 'bg-brand-light text-brand', text: 'Recovered' },
};

export function MultiLegSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, 0.35);
  const reduced = usePrefersReducedMotion();
  const [tick, setTick] = useState(reduced ? 8 : 0);
  useEffect(() => {
    if (!inView || reduced) return;
    const id = setInterval(() => setTick((t) => (t + 1) % 12), 700);
    return () => clearInterval(id);
  }, [inView, reduced]);
  // ticks 1-4: cascade spreads; 6-9: recovery sweeps back through; 10+: all on track
  const state = (i: number): ChainState => {
    if (tick >= 10 || tick === 0) return 'ok';
    if (tick >= 6) return i === 0 ? 'hit' : i <= tick - 5 ? 'fixed' : 'risk';
    if (i === 0) return 'hit';
    return i <= tick - 1 ? 'risk' : 'ok';
  };
  return (
    <section className="scroll-mt-24 bg-white/60 px-4 py-20 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <Reveal><SectionHeading eyebrow="Multi-leg journeys" title="Your trip is a chain. We treat it like one." text="When one link changes, Safar Sathi knows exactly which bookings depend on it — and recovers the whole chain, not just the first leg." /></Reveal>
        <div ref={ref} className="mt-12 flex flex-col items-stretch gap-3 lg:flex-row lg:items-center">
          {chain.map(({ icon: Icon, label, city }, i) => {
            const s = chainStyle[state(i)];
            return (
              <div key={label} className="flex flex-1 flex-col items-center gap-3 lg:flex-row">
                <div className={cn('card w-full border-2 p-4 text-center transition-colors duration-500', s.ring)}>
                  <img src={resolveDestinationImage(city)} alt="" loading="lazy" className="mx-auto h-16 w-full rounded-xl object-cover" />
                  <div className="mt-3 flex items-center justify-center gap-2 font-bold text-ink"><Icon className="h-4 w-4 text-brand" />{label}</div>
                  <span className={cn('pill mt-2 transition-colors duration-500', s.pill)}>{s.text}</span>
                </div>
                {i < chain.length - 1 && <ArrowRight className="h-5 w-5 shrink-0 rotate-90 text-ink-faint lg:rotate-0" />}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ---- 8. Trust ------------------------------------------------------------------

const trust = [
  { icon: Brain, title: 'Explainable by design', text: 'Every status comes with the reason — the buffer, the delay, the dependency.' },
  { icon: Zap, title: 'Deterministic engines', text: 'Graph, propagation, recovery, scoring, refund and risk engines do the math; AI explains it.' },
  { icon: FileCheck2, title: 'Refund-aware', text: 'Cancellation policies are evaluated so you know what you can recover.' },
  { icon: ShieldCheck, title: 'You stay in control', text: 'Nothing is rebooked until you confirm, and every change is re-validated.' },
];

export function TrustSection() {
  return (
    <section id="why" className="scroll-mt-24 px-4 py-20 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <Reveal><SectionHeading eyebrow="Why Safar Sathi" title="Built to be trusted with your journey" /></Reveal>
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {trust.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 100}>
              <div className="card card-hover h-full p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-light text-brand"><Icon className="h-6 w-6" /></span>
                <h3 className="mt-4 font-display text-lg font-bold text-ink">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- FAQs ---------------------------------------------------------------------

const faqs = [
  { q: 'What does Safar Sathi actually monitor?', a: 'Every booking in your trip — flights, trains, transfers, hotels and activities — and the connection buffers between them.' },
  { q: 'Will it rebook anything without asking?', a: 'No. Safar Sathi prepares and ranks recovery plans, but nothing changes until you confirm. The new itinerary is then re-validated end to end.' },
  { q: 'How are recovery plans ranked?', a: 'By speed, cost, comfort, bookings preserved and remaining risk, weighted by what you say matters most.' },
  { q: 'Can I try it without an account?', a: 'Yes — "Watch Demo" opens the full product with a sample Mumbai → Delhi → Agra trip, right in your browser.' },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faqs" className="scroll-mt-24 bg-white/60 px-4 py-20 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <SectionHeading eyebrow="FAQs" title="Questions, answered" />
        <div className="mt-10 space-y-3">
          {faqs.map((f, i) => (
            <div key={f.q} className="card overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-ink" aria-expanded={open === i}>
                {f.q}<ChevronDown className={cn('h-5 w-5 shrink-0 text-ink-muted transition', open === i && 'rotate-180')} />
              </button>
              {open === i && <p className="px-5 pb-5 text-[15px] leading-relaxed text-ink-soft animate-fade-in">{f.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- 9. Final CTA + 10. Footer ------------------------------------------------------

export function FinalCta({ onGetStarted, onWatchDemo }: { onGetStarted: () => void; onWatchDemo: () => void }) {
  return (
    <section className="px-4 py-20 sm:px-8">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[28px] shadow-lift">
        <img src={sceneImages.bannerMountains} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B3A8C]/95 via-[#1F6BFF]/75 to-[#12B5E5]/40" />
        <div className="relative flex flex-col gap-6 p-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl text-white">
            <h2 className="font-display text-3xl font-extrabold leading-tight sm:text-4xl">Same destinations. Fewer disruptions.</h2>
            <p className="mt-3 text-white/90">Let Safar Sathi watch over your next journey — and recover it when plans change.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={onGetStarted} className="btn bg-white px-6 py-3.5 text-base text-brand shadow-card hover:bg-brand-light">Get Started <ArrowRight className="h-5 w-5" /></button>
            <button onClick={onWatchDemo} className="btn border border-white/50 bg-white/10 px-6 py-3.5 text-base text-white backdrop-blur hover:bg-white/20"><PlayCircle className="h-5 w-5" /> Watch Demo</button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <footer className="border-t border-line bg-white px-4 py-10 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <Logo />
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-soft" aria-label="Footer">
          {[['home', 'Home'], ['features', 'Features'], ['how-it-works', 'How It Works'], ['why', 'Why Safar Sathi'], ['faqs', 'FAQs']].map(([id, label]) => (
            <button key={id} onClick={() => onNavigate(id)} className="hover:text-brand">{label}</button>
          ))}
        </nav>
        <p className="text-xs text-ink-muted">© {new Date().getFullYear()} Safar Sathi</p>
      </div>
    </footer>
  );
}
