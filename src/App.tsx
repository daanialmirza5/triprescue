import { useState, useCallback, useRef, useEffect } from 'react';
import { AppProvider, useApp } from '@/store/AppContext';
import { AuthProvider, useAuth } from '@/store/AuthContext';
import { ToastProvider, useToast } from '@/components/ui/ToastProvider';
import { LoginScreen } from '@/components/auth/LoginScreen';
import { LandingPage } from '@/components/landing/LandingPage';
import { Sidebar, type PageId } from '@/components/shell/Sidebar';
import { TopBar } from '@/components/shell/TopBar';
import { Overview } from '@/pages/Overview';
import { Trips } from '@/pages/Trips';
import { LiveMonitor } from '@/pages/LiveMonitor';
import { RecoveryCenter } from '@/components/recovery/RecoveryCenter';
import { RiskIntelligence } from '@/pages/RiskIntelligence';
import { ActivityPage } from '@/pages/ActivityPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { TripDetail } from '@/pages/TripDetail';
import { AIAssistant } from '@/components/ai/AIAssistant';
import { LifeBuoy, WifiOff } from 'lucide-react';

type ExtendedPage = PageId | 'trip-detail';

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const NARROW_VIEWPORT_QUERY = '(max-width: 768px)';

function AppContent() {
  const [page, setPage] = useState<ExtendedPage>('overview');
  // Default collapsed on narrow (tablet/mobile) viewports - the sidebar's
  // full 240px expanded width otherwise eats most of a phone-width screen.
  // Still just the sidebar's existing collapsed mode (icons + toggle), not a
  // new mobile-only nav pattern - the toggle keeps working either way.
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(NARROW_VIEWPORT_QUERY).matches
  );
  const [aiOpen, setAiOpen] = useState(false);
  const {
    triggerDisruption,
    applyRecoveryPlan,
    resetTrip,
    setDemoRunning,
    demoRunning,
    isBusy,
    recoveryOptions,
    error,
    reload,
  } = useApp();
  const { addToast } = useToast();
  const demoCancelledRef = useRef(false);
  // runDemo is a long-running async function invoked once per click; its
  // closure over `recoveryOptions` would otherwise be frozen at whatever
  // that value was at click-time (still empty, pre-disruption), not the
  // fresh options triggerDisruption populates moments later in the same
  // run. A ref always reflects the latest value regardless of when the
  // closure was created.
  const recoveryOptionsRef = useRef(recoveryOptions);
  useEffect(() => {
    recoveryOptionsRef.current = recoveryOptions;
  }, [recoveryOptions]);

  const handleNavigate = useCallback((p: string) => {
    setPage(p as ExtendedPage);
  }, []);

  // Follow viewport width changes (resize, orientation change) after mount -
  // the initial state above only covers first load.
  useEffect(() => {
    const query = window.matchMedia(NARROW_VIEWPORT_QUERY);
    const handler = (e: MediaQueryListEvent) => setSidebarCollapsed(e.matches);
    query.addEventListener('change', handler);
    return () => query.removeEventListener('change', handler);
  }, []);

  // Demo Mode reuses the exact same disruption/recovery flow as a manual
  // trigger - it is purely a scripted sequence of awaits over the same
  // AppContext functions, with no timers of its own. AppContext's isBusy
  // guard means this can never race a manually-triggered disruption.
  const runDemo = useCallback(async () => {
    if (demoRunning || isBusy) return;
    demoCancelledRef.current = false;
    setDemoRunning(true);
    addToast('info', 'Demo Mode Started', 'Watch the full disruption recovery sequence...');

    try {
      await resetTrip();
      setPage('overview');
      await wait(700);
      if (demoCancelledRef.current) return;

      await triggerDisruption('flight-delay', { delayMinutes: 180 });
      if (demoCancelledRef.current) return;
      addToast('info', 'Recovery Options Generated', `${recoveryOptionsRef.current.length || 3} strategies ranked by your preferences`);

      await wait(600);
      if (demoCancelledRef.current) return;
      setPage('recovery');
      await wait(1500);
      if (demoCancelledRef.current) return;

      const top = [...recoveryOptionsRef.current].sort((a, b) => b.score - a.score)[0];
      if (top) {
        await applyRecoveryPlan(top.id);
        addToast('success', 'Recovery Applied', `${top.bookingsPreserved}/${top.totalBookings} itinerary commitments preserved`);
      }
    } catch {
      addToast('error', 'Demo Interrupted', 'The backend may be unavailable. Check the connection and try again.');
    } finally {
      setDemoRunning(false);
    }
  }, [demoRunning, isBusy, resetTrip, triggerDisruption, applyRecoveryPlan, addToast, setDemoRunning]);

  const handleReset = useCallback(async () => {
    demoCancelledRef.current = true;
    await resetTrip();
    addToast('info', 'Trip Reset', 'Itinerary restored to healthy state');
  }, [resetTrip, addToast]);

  useEffect(() => {
    return () => {
      demoCancelledRef.current = true;
    };
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-ink-950">
      <Sidebar
        current={page === 'trip-detail' ? 'trips' : page}
        onNavigate={handleNavigate}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar current={page === 'trip-detail' ? 'trips' : (page as PageId)} onOpenAI={() => setAiOpen(true)} onRunDemo={runDemo} onReset={handleReset} />

        {error && (
          <div className="flex items-center gap-2 border-b border-red-500/20 bg-red-500/10 px-6 py-2 text-xs text-red-700">
            <WifiOff className="h-3.5 w-3.5 shrink-0" />
            <span>{error}</span>
            <button onClick={() => reload()} className="ml-auto rounded border border-red-500/30 px-2 py-0.5 text-red-700 hover:bg-red-500/20">
              Retry
            </button>
          </div>
        )}

        <main className="flex-1 overflow-y-auto scrollbar-thin p-6">
          <div key={page} className="animate-fade-in">
            {page === 'overview' && <Overview onNavigate={handleNavigate} />}
            {page === 'trips' && <Trips onNavigate={handleNavigate} />}
            {page === 'trip-detail' && <TripDetail />}
            {page === 'monitor' && <LiveMonitor />}
            {page === 'recovery' && <RecoveryCenter />}
            {page === 'risk' && <RiskIntelligence />}
            {page === 'activity' && <ActivityPage />}
            {page === 'settings' && <SettingsPage />}
          </div>
        </main>
      </div>

      <AIAssistant open={aiOpen} onClose={() => setAiOpen(false)} />
    </div>
  );
}

function Gate() {
  const { status } = useAuth();
  // Landing → Enter TripRescue → Login is a one-way gate per unauthenticated
  // session; once past it, staying on the login screen (e.g. after a failed
  // attempt) shouldn't bounce the user back to the landing page.
  const [pastLanding, setPastLanding] = useState(false);

  if (status === 'checking') {
    return (
      <div className="flex h-screen items-center justify-center bg-ink-950">
        <LifeBuoy className="h-6 w-6 animate-pulse text-accent-400" />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    if (!pastLanding) {
      return <LandingPage onEnter={() => setPastLanding(true)} />;
    }
    return <LoginScreen />;
  }

  return (
    <AppProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AppProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Gate />
    </AuthProvider>
  );
}
