import { useCallback, useEffect, useRef, useState } from 'react';
import { AppProvider, useApp } from '@/store/AppContext';
import { AuthProvider, useAuth } from '@/store/AuthContext';
import { ToastProvider, useToast } from '@/components/ui/ToastProvider';
import { RouterProvider, useRouter } from '@/lib/router';
import { LoginScreen } from '@/components/auth/LoginScreen';
import { LandingPage } from '@/landing/LandingPage';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { ShellActionsProvider, useShellActions } from '@/components/layout/ShellActions';
import { LogoMark } from '@/components/brand/Logo';
import { NetworkStatusBanner } from '@/components/ui/NetworkStatusBanner';
import { DashboardPage } from '@/pages/DashboardPage';
import { BookingsPage } from '@/pages/BookingsPage';
import { LiveUpdatesPage } from '@/pages/LiveUpdatesPage';
import { RecoveryPage } from '@/pages/RecoveryPage';
import { AssistantPage } from '@/pages/AssistantPage';
import { ClaimsPage } from '@/pages/ClaimsPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { TripDetailsPage } from '@/pages/TripDetailsPage';
import { DigitalTwinPage } from '@/pages/DigitalTwinPage';
import { ExplorePage } from '@/pages/ExplorePage';
import { LiveTransportPage } from '@/pages/LiveTransportPage';
import { BriefcaseBusiness, WifiOff } from 'lucide-react';

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
/** Set by the landing page's "Watch Demo": play the guided demo once the app loads. */
const AUTO_DEMO_KEY = 'safarsathi.autoDemo';

function AppContent() {
  const { route, navigate } = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const { triggerDisruption, applyRecoveryPlan, resetTrip, setDemoRunning, demoRunning, isBusy, recoveryOptions, error, reload, noTripFound, trip, loading } = useApp();
  const { addToast } = useToast();
  const { openCreateTrip } = useShellActions();
  const demoCancelledRef = useRef(false);
  const recoveryOptionsRef = useRef(recoveryOptions);
  useEffect(() => { recoveryOptionsRef.current = recoveryOptions; }, [recoveryOptions]);

  /** Guided demo: reset → disruption → recovery options → apply & re-validate. */
  const runDemo = useCallback(async () => {
    if (demoRunning || isBusy) return;
    if (trip.resettable === false) {
      // The demo resets the trip first; only sample trips have an original state to go back to.
      addToast('info', 'Guided demo needs a sample trip', 'Switch to one of the demo trips to run it - your own trips are never auto-disrupted.');
      return;
    }
    demoCancelledRef.current = false;
    setDemoRunning(true);
    addToast('info', 'Guided demo started', 'Watch Safar Sathi move from disruption to recovery.');
    try {
      await resetTrip();
      navigate('dashboard');
      await wait(700);
      if (demoCancelledRef.current) return;
      await triggerDisruption('flight-delay', { delayMinutes: 95 });
      if (demoCancelledRef.current) return;
      await wait(1600);
      navigate('recovery');
      await wait(2200);
      const top = recoveryOptionsRef.current.filter((o) => o.feasible !== false).sort((a, b) => b.score - a.score)[0];
      if (top && !demoCancelledRef.current) {
        await applyRecoveryPlan(top.id);
        addToast('success', 'Journey recovered', `${top.bookingsPreserved}/${top.totalBookings} bookings preserved and re-validated.`);
      }
    } catch {
      addToast('error', 'Demo interrupted', 'Check the backend connection and try again.');
    } finally {
      setDemoRunning(false);
    }
  }, [demoRunning, isBusy, trip.resettable, resetTrip, triggerDisruption, applyRecoveryPlan, addToast, setDemoRunning, navigate]);

  useEffect(() => {
    if (loading || !trip.id) return;
    let pending = false;
    try {
      pending = sessionStorage.getItem(AUTO_DEMO_KEY) === '1';
      sessionStorage.removeItem(AUTO_DEMO_KEY);
    } catch {
      /* storage unavailable */
    }
    if (pending) runDemo();
  }, [loading, trip.id, runDemo]);

  const handleReset = useCallback(async () => {
    demoCancelledRef.current = true;
    await resetTrip();
    addToast('info', 'Journey reset', 'Your itinerary is back to its original schedule.');
  }, [resetTrip, addToast]);

  return (
    <div className="flex h-screen overflow-hidden">
      <button onClick={() => document.getElementById('main-scroll')?.focus()} className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow-lift">Skip to content</button>
      <Sidebar mobileOpen={menuOpen} onCloseMobile={() => setMenuOpen(false)} />
      <main id="main-scroll" tabIndex={-1} className="relative min-w-0 flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin">
        <TopBar onOpenMenu={() => setMenuOpen(true)} onRunDemo={runDemo} onReset={handleReset} />
        {error && (
          <div role="alert" className="relative z-30 mx-4 mb-2 flex items-center gap-2 rounded-2xl border border-danger/20 bg-white/95 px-4 py-2.5 text-sm text-danger shadow-card sm:mx-6 lg:mx-8">
            <WifiOff className="h-4 w-4 shrink-0" /><span className="min-w-0 flex-1">{error}</span>
            <button onClick={() => reload()} className="btn-ghost px-3 py-1.5 text-xs">Retry</button>
          </div>
        )}
        <div className="px-4 pb-10 sm:px-6 lg:px-8">
          {noTripFound && route !== 'bookings' && route !== 'settings' ? (
            <div className="relative z-10 flex min-h-[60vh] items-center justify-center">
              <div className="card max-w-md p-8 text-center">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-light text-brand"><BriefcaseBusiness className="h-8 w-8" /></span>
                <h1 className="mt-4 font-display text-xl font-bold text-ink">No trips yet</h1>
                <p className="mt-2 text-sm text-ink-muted">Create your first journey to start monitoring disruptions and recovery options.</p>
                <button onClick={openCreateTrip} className="btn-primary mt-5">Create a trip</button>
              </div>
            </div>
          ) : (
            <div key={route}>
              {route === 'dashboard' && <DashboardPage />}
              {route === 'bookings' && <BookingsPage />}
              {route === 'live' && <LiveUpdatesPage />}
              {route === 'recovery' && <RecoveryPage />}
              {route === 'assistant' && <AssistantPage />}
              {route === 'claims' && <ClaimsPage />}
              {route === 'settings' && <SettingsPage />}
              {route === 'trip' && <TripDetailsPage />}
              {route === 'digital-twin' && <DigitalTwinPage />}
              {route === 'explore' && <ExplorePage />}
              {route === 'transport' && <LiveTransportPage />}
            </div>
          )}
        </div>
      </main>
      <NetworkStatusBanner />
    </div>
  );
}

function Gate() {
  const { status, dataMode, continueAsDemo } = useAuth();
  const [view, setView] = useState<'landing' | 'login'>(() => (window.location.hash === '#/login' ? 'login' : 'landing'));
  const watchDemo = useCallback(async () => {
    try {
      sessionStorage.setItem(AUTO_DEMO_KEY, '1');
    } catch {
      /* storage unavailable - the demo still opens, just without autoplay */
    }
    window.location.hash = '/dashboard';
    await continueAsDemo();
  }, [continueAsDemo]);
  if (status === 'checking') {
    return <div className="flex h-screen items-center justify-center bg-canvas"><LogoMark className="h-14 w-24 animate-pulse-soft" /></div>;
  }
  if (status === 'unauthenticated') {
    return view === 'login'
      ? <ToastProvider><LoginScreen onBack={() => { setView('landing'); window.scrollTo(0, 0); }} /></ToastProvider>
      : <LandingPage onGetStarted={() => { setView('login'); window.scrollTo(0, 0); }} onWatchDemo={watchDemo} />;
  }
  return (
    // Keyed on the data source so switching between live and demo starts clean.
    <AppProvider key={dataMode}>
      <ToastProvider>
        <RouterProvider>
          <ShellActionsProvider>
            <AppContent />
          </ShellActionsProvider>
        </RouterProvider>
      </ToastProvider>
    </AppProvider>
  );
}

export default function App() {
  return <AuthProvider><Gate /></AuthProvider>;
}
