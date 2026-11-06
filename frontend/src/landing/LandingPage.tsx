import { useCallback, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/brand/Logo';
import { HeroWorld } from '@/landing/hero/HeroWorld';
import type { HeroFocus } from '@/landing/hero/HeroScene';
import { phaseCaption, sampleTimeline, STILL_FRAME_SECONDS, type TimelineSample } from '@/landing/hero/timeline';
import { CopilotSection, FaqSection, FinalCta, Footer, HowItWorksSection, LiveDetectionSection, MultiLegSection, ProblemSection, RecoverySection, TrustSection } from '@/landing/sections';
import { ArrowRight, BedDouble, BrainCircuit, Car, Layers, Menu, MousePointerClick, PlayCircle, Plane, RefreshCcw, ShieldCheck, Sparkles, TrainFront, X } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onWatchDemo: () => void;
}

const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'features', label: 'Features' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'why', label: 'Why Safar Sathi' },
  { id: 'faqs', label: 'FAQs' },
];

const modes: { id: HeroFocus; label: string; icon: typeof Plane; hint: string }[] = [
  { id: 'flights', label: 'Flights', icon: Plane, hint: 'Every flight tracked against the connections that depend on it.' },
  { id: 'trains', label: 'Trains', icon: TrainFront, hint: 'Rail connections re-checked the moment an upstream leg slips.' },
  { id: 'hotels', label: 'Hotels', icon: BedDouble, hint: 'Check-in times protected when arrivals change.' },
  { id: 'transfers', label: 'Transfers', icon: Car, hint: 'Airport and station transfers re-timed automatically.' },
];

// Capability facts, not marketing numbers.
const stats = [
  { icon: Layers, value: '6', label: 'Booking types linked', tone: 'text-brand' },
  { icon: RefreshCcw, value: '3', label: 'Ranked recovery plans', tone: 'text-safe' },
  { icon: BrainCircuit, value: '6', label: 'Engines working together', tone: 'text-danger' },
  { icon: ShieldCheck, value: '1-click', label: 'Recover & re-validate', tone: 'text-ai' },
];

function scrollToSection(id: string) {
  if (id === 'home') window.scrollTo({ top: 0, behavior: 'smooth' });
  else document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function LandingPage({ onGetStarted, onWatchDemo }: LandingPageProps) {
  const [focus, setFocus] = useState<HeroFocus>('flights');
  const [sample, setSample] = useState<TimelineSample>(() => sampleTimeline(STILL_FRAME_SECONDS));
  const [activeLink, setActiveLink] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const onSample = useCallback((s: TimelineSample) => setSample(s), []);

  useEffect(() => {
    document.title = 'Safar Sathi — Same Destinations. Fewer Disruptions.';
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    const sections = navLinks.map((l) => document.getElementById(l.id)).filter((el): el is HTMLElement => !!el);
    const io = typeof IntersectionObserver !== 'undefined'
      ? new IntersectionObserver((entries) => {
          const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
          if (visible) setActiveLink(visible.target.id);
        }, { rootMargin: '-40% 0px -50% 0px' })
      : null;
    sections.forEach((s) => io?.observe(s));
    return () => { window.removeEventListener('scroll', onScroll); io?.disconnect(); };
  }, []);

  const go = (id: string) => { setMenuOpen(false); scrollToSection(id); };

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <header className={cn('fixed inset-x-0 top-0 z-50 transition', scrolled ? 'border-b border-line bg-white/85 shadow-card backdrop-blur-xl' : 'bg-white/40 backdrop-blur-md')}>
        <div className="mx-auto flex h-[76px] max-w-[1400px] items-center justify-between gap-6 px-4 sm:px-8">
          <button onClick={() => go('home')} aria-label="Safar Sathi home"><Logo /></button>
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {navLinks.map((l) => (
              <button key={l.id} onClick={() => go(l.id)} aria-current={activeLink === l.id ? 'true' : undefined}
                className={cn('relative px-4 py-2 text-[15px] font-medium transition', activeLink === l.id ? 'text-ink' : 'text-ink-soft hover:text-ink')}>
                {l.label}
                {activeLink === l.id && <span className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-brand" />}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={onGetStarted} className="btn-primary hidden px-5 py-3 sm:inline-flex">Get Started <ArrowRight className="h-4 w-4" /></button>
            <button onClick={() => setMenuOpen((v) => !v)} className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-white lg:hidden" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen}>
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav className="border-t border-line bg-white px-4 pb-4 pt-2 lg:hidden animate-fade-in" aria-label="Mobile">
            {navLinks.map((l) => <button key={l.id} onClick={() => go(l.id)} className="block w-full rounded-xl px-3 py-3 text-left font-medium text-ink-soft hover:bg-canvas">{l.label}</button>)}
            <button onClick={onGetStarted} className="btn-primary mt-2 w-full">Get Started <ArrowRight className="h-4 w-4" /></button>
          </nav>
        )}
      </header>

      <main>
        {/* ---- 1. Hero: 3D travel world behind readable content ---- */}
        <section id="home" className="relative flex min-h-[100svh] flex-col overflow-hidden bg-gradient-to-b from-[#D9E9FB] via-[#EEF4FC] to-canvas pt-[76px]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_78%_18%,rgba(255,214,170,.55),transparent)]" aria-hidden="true" />
          {/* Readability wash behind the copy on desktop, where the world sits behind it */}
          <div className="pointer-events-none absolute inset-0 z-[1] hidden bg-gradient-to-r from-[#F2F6FC] via-[#F2F6FC]/75 via-35% to-transparent lg:block" aria-hidden="true" />


          <div className="pointer-events-none relative z-10 mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-center px-4 pb-10 pt-8 sm:px-8 lg:pb-24">
            <div className="pointer-events-auto max-w-[720px]">
              <span className="pill bg-white/80 px-3.5 py-1.5 text-[13px] text-brand shadow-card backdrop-blur"><Sparkles className="h-4 w-4" />AI-Powered Travel Disruption Recovery</span>
              <h1 className="mt-6 font-display text-[40px] font-extrabold leading-[1.04] tracking-tight text-ink sm:text-6xl xl:text-[66px] 2xl:text-[72px]">
                Same Destinations.
                <span className="block bg-gradient-to-r from-[#1F6BFF] to-[#12B5E5] bg-clip-text text-transparent">Fewer Disruptions.</span>
              </h1>
              <p className="mt-5 max-w-[540px] text-lg leading-relaxed text-ink-soft">
                Safar Sathi monitors your entire journey, detects disruptions in real-time, and finds the best recovery options — so you can travel stress-free.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button onClick={onGetStarted} className="btn-primary px-7 py-4 text-base">Get Started <ArrowRight className="h-5 w-5" /></button>
                <button onClick={onWatchDemo} className="btn border border-white bg-white/90 px-7 py-4 text-base text-ink shadow-card backdrop-blur hover:bg-white"><PlayCircle className="h-5 w-5" /> Watch Demo</button>
              </div>

              <div className="mt-8 inline-flex max-w-full flex-wrap gap-1 rounded-2xl border border-white/80 bg-white/70 p-1.5 shadow-card backdrop-blur" role="tablist" aria-label="Highlight in the scene">
                {modes.map(({ id, label, icon: Icon }) => (
                  <button key={id} role="tab" aria-selected={focus === id} onClick={() => setFocus(id)}
                    className={cn('flex items-center gap-2 rounded-xl px-4 py-2.5 text-[15px] font-medium transition', focus === id ? 'bg-white text-brand shadow-card' : 'text-ink-soft hover:text-ink')}>
                    <Icon className="h-5 w-5" />{label}
                  </button>
                ))}
              </div>
              <p className="mt-2 flex items-center gap-1.5 pl-1 text-xs text-ink-muted"><MousePointerClick className="h-3.5 w-3.5" />{modes.find((m) => m.id === focus)?.hint}</p>

              <dl className="mt-6 grid max-w-[640px] grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/80 bg-line/60 shadow-card backdrop-blur sm:grid-cols-4">
                {stats.map(({ icon: Icon, value, label, tone }) => (
                  <div key={label} className="bg-white/80 px-4 py-4">
                    <Icon className={cn('h-5 w-5', tone)} />
                    <dd className="mt-2 font-display text-2xl font-extrabold text-ink">{value}</dd>
                    <dt className="text-xs text-ink-muted">{label}</dt>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* The 3D world: full-bleed behind the copy on desktop, its own band on mobile */}
          <div className="relative h-[340px] w-full sm:h-[460px] lg:absolute lg:inset-0 lg:h-auto">
            <HeroWorld focus={focus} onSample={onSample} />
          </div>

          {/* Live story caption synced to the 3D timeline */}
          <div className="pointer-events-none relative z-10 mx-auto hidden w-full max-w-[1400px] justify-end px-8 pb-8 lg:flex">
            <div className="flex items-center gap-2.5 rounded-full border border-white/80 bg-white/85 px-4 py-2 text-sm font-medium text-ink shadow-card backdrop-blur" aria-live="polite">
              <span className={cn('h-2 w-2 rounded-full', sample.phase === 'delayed' ? 'bg-danger' : sample.phase === 'recovering' || sample.phase === 'recovered' ? 'bg-brand-cyan' : 'bg-safe')} />
              {phaseCaption[sample.phase]}
            </div>
          </div>

          <button onClick={() => go('problem')} className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-1 text-sm text-ink-soft lg:flex" aria-label="Scroll to explore">
            <span className="flex h-9 w-6 justify-center rounded-full border-2 border-ink-muted/60 pt-1.5"><span className="h-2 w-1 animate-bounce rounded-full bg-ink-muted" /></span>
            Scroll to Explore
          </button>
        </section>

        <ProblemSection />
        <HowItWorksSection />
        <LiveDetectionSection />
        <RecoverySection />
        <CopilotSection />
        <MultiLegSection />
        <TrustSection />
        <FaqSection />
        <FinalCta onGetStarted={onGetStarted} onWatchDemo={onWatchDemo} />
      </main>
      <Footer onNavigate={go} />
    </div>
  );
}
