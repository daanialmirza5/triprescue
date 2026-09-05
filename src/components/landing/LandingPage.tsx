import {
  ArrowRight,
  LifeBuoy,
  Network,
  Waypoints,
  ShieldAlert,
  Sparkles,
  SlidersHorizontal,
  RefreshCw,
  Eye,
  Layers,
  Wallet,
  RotateCw,
  MessageCircleQuestion,
} from 'lucide-react';
import commandCenterShot from '@/assets/screenshots/01-command-center.png';
import impactShot from '@/assets/screenshots/03-impact-analysis.png';
import recoveryShot from '@/assets/screenshots/04-recovery-options.png';

interface LandingPageProps {
  onEnter: () => void;
}

const steps = [
  { icon: ShieldAlert, title: 'Disruption Triggered', desc: 'A flight delay, cancellation, or closure hits one booking in the itinerary.' },
  { icon: Network, title: 'Dependency Graph', desc: 'The trip is modeled as a graph of connected bookings, not a flat list.' },
  { icon: Waypoints, title: 'Impact Propagation', desc: 'Real timing buffers decide what actually breaks downstream, and why.' },
  { icon: Sparkles, title: 'Recovery Generation', desc: 'Feasible recovery plans are generated against the same live graph.' },
  { icon: SlidersHorizontal, title: 'Preference Ranking', desc: 'Plans are ranked and re-ranked by cost, speed, comfort, and risk.' },
  { icon: RefreshCw, title: 'Apply & Re-validate', desc: 'Applying a plan re-runs the checks — the new itinerary is re-verified.' },
];

const innovations = [
  { icon: Eye, title: 'Explainable Cascade', desc: 'Every status change comes with a reason, not just a red flag.' },
  { icon: Layers, title: 'Granular Severity', desc: 'Healthy, at-risk, broken, recovered — computed per booking.' },
  { icon: Wallet, title: 'Transparent Scoring', desc: 'Cost, speed, preservation, comfort, risk — full breakdown, every option.' },
  { icon: RotateCw, title: 'Re-disruption', desc: 'A recovered trip can be disrupted again without resetting anything.' },
  { icon: MessageCircleQuestion, title: 'Grounded AI Assistant', desc: 'Answers cite the actual live trip state, with a deterministic fallback.' },
  { icon: SlidersHorizontal, title: 'Live Re-ranking', desc: 'Move a slider, watch the recommended plan change in real time.' },
];

export function LandingPage({ onEnter }: LandingPageProps) {
  return (
    <div className="min-h-screen overflow-y-auto bg-ink-950">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-accent-500 to-electric-600 shadow-glow-cyan">
            <LifeBuoy className="h-5 w-5 text-white" />
          </div>
          <span className="text-base font-bold tracking-tight text-ink-100">TripRescue</span>
        </div>
        <button
          onClick={onEnter}
          className="flex items-center gap-1.5 rounded-lg border border-ink-600 bg-white px-4 py-2 text-sm font-medium text-ink-100 shadow-card transition hover:border-accent-500/40 hover:text-accent-700"
        >
          Enter TripRescue
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pb-20 pt-12 text-center sm:pt-20">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-accent-500/30 bg-accent-500/10 px-3 py-1 text-xs font-medium text-accent-700">
          <Sparkles className="h-3.5 w-3.5" />
          Explainable Travel Disruption Recovery
        </div>
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-ink-100 sm:text-5xl md:text-6xl">
          When one flight breaks,<br className="hidden sm:block" /> know exactly what else does.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base text-ink-300 sm:text-lg">
          TripRescue models a multi-leg trip as a dependency graph. A disruption propagates along real timing
          buffers — so instead of a vague warning, you get exactly what breaks, why, and a ranked set of ways
          to fix it.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            onClick={onEnter}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-br from-accent-500 to-electric-600 px-7 py-3.5 text-base font-semibold text-white shadow-glow-cyan transition hover:brightness-110"
          >
            Enter TripRescue
            <ArrowRight className="h-4 w-4" />
          </button>
          <span className="text-xs text-ink-500">No signup required — demo login included</span>
        </div>
      </section>

      {/* Problem */}
      <section className="mx-auto max-w-4xl px-6 pb-20">
        <div className="glass rounded-2xl p-6 sm:p-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-accent-700">The Problem</h2>
          <p className="mt-3 text-lg font-medium text-ink-100">Travel disruptions are rarely isolated.</p>
          <div className="mt-5 flex flex-wrap items-center gap-2 text-sm font-medium text-ink-200">
            <span className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-red-700">Delayed flight</span>
            <ArrowRight className="h-4 w-4 text-ink-500" />
            <span className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-amber-700">Missed transfer</span>
            <ArrowRight className="h-4 w-4 text-ink-500" />
            <span className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-amber-700">Hotel conflict</span>
            <ArrowRight className="h-4 w-4 text-ink-500" />
            <span className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-red-700">Activity disrupted</span>
          </div>
          <p className="mt-5 text-sm text-ink-400">
            Most tools report the delay and stop there — leaving the traveler to manually work out every
            downstream consequence, across every provider and cancellation policy, alone.
          </p>
        </div>
      </section>

      {/* 6-step flow */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-ink-100 sm:text-3xl">How it works</h2>
          <p className="mt-2 text-sm text-ink-400">One consistent pipeline, from trigger to a re-validated itinerary.</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="relative rounded-xl border border-ink-700 bg-white p-5 shadow-card">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-accent-500/30 bg-accent-500/10 text-sm font-bold text-accent-700">
                    {i + 1}
                  </span>
                  <Icon className="h-5 w-5 text-accent-600" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-ink-100">{step.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-ink-400">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Product preview */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-ink-100 sm:text-3xl">See it in action</h2>
          <p className="mt-2 text-sm text-ink-400">Real screens from the running application — not mockups.</p>
        </div>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <figure className="overflow-hidden rounded-xl border border-ink-700 bg-white shadow-card">
            <img src={commandCenterShot} alt="TripRescue command center dashboard" className="w-full" />
            <figcaption className="px-4 py-3 text-xs font-medium text-ink-300">Command Center</figcaption>
          </figure>
          <figure className="overflow-hidden rounded-xl border border-ink-700 bg-white shadow-card">
            <img src={impactShot} alt="TripRescue impact analysis panel" className="w-full" />
            <figcaption className="px-4 py-3 text-xs font-medium text-ink-300">Cascade &amp; Impact Analysis</figcaption>
          </figure>
          <figure className="overflow-hidden rounded-xl border border-ink-700 bg-white shadow-card">
            <img src={recoveryShot} alt="TripRescue ranked recovery options" className="w-full" />
            <figcaption className="px-4 py-3 text-xs font-medium text-ink-300">Ranked Recovery Options</figcaption>
          </figure>
        </div>
      </section>

      {/* Differentiation */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-ink-100 sm:text-3xl">What makes it different</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {innovations.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-xl border border-ink-700 bg-white p-5 shadow-card">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-accent-500/30 bg-accent-500/10">
                  <Icon className="h-4 w-4 text-accent-600" />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-ink-100">{item.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-ink-400">{item.desc}</p>
              </div>
            );
          })}
        </div>
        <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-ink-500">
          Current demo disruptions are manually triggered or run via Demo Mode, using deterministic simulated
          events — TripRescue does not receive live airline or hotel delay data today.
        </p>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-3xl px-6 pb-24 text-center">
        <div className="rounded-2xl border border-accent-500/20 bg-gradient-to-br from-accent-500/10 to-electric-600/5 p-10">
          <h2 className="text-2xl font-bold text-ink-100 sm:text-3xl">Ready to see the recovery engine work?</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-ink-400">
            Log in with the demo traveler and trigger a real disruption on a real dependency graph.
          </p>
          <button
            onClick={onEnter}
            className="mx-auto mt-6 flex items-center gap-2 rounded-xl bg-gradient-to-br from-accent-500 to-electric-600 px-7 py-3.5 text-base font-semibold text-white shadow-glow-cyan transition hover:brightness-110"
          >
            Enter TripRescue
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      <footer className="border-t border-ink-700 py-6 text-center text-xs text-ink-500">
        TripRescue — Travel Disruption Recovery Engine
      </footer>
    </div>
  );
}
