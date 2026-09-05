import { useApp } from '@/store/AppContext';
import { useAuth } from '@/store/AuthContext';
import { useLocalStorageState } from '@/lib/useLocalStorageState';
import { cn } from '@/lib/utils';
import type { TravelerPreferences } from '@/types';
import { Settings, Sliders, Bell, Shield, Lock, Link2, Plane } from 'lucide-react';

export function SettingsPage() {
  const { preferences, setPreferences } = useApp();
  const { profile } = useAuth();
  const [notifPrefs, setNotifPrefs] = useLocalStorageState('triprescue.settings.notifications', {
    highRisk: true,
    recoveryReady: true,
    bookingUpdates: true,
    systemStatus: false,
    weather: true,
  });
  const [riskThresholds, setRiskThresholds] = useLocalStorageState('triprescue.settings.riskThresholds', {
    connection: 60,
    schedule: 50,
  });
  const [privacyPrefs, setPrivacyPrefs] = useLocalStorageState('triprescue.settings.privacy', {
    shareData: true,
    providerIntegrations: true,
    analytics: false,
  });

  const updatePreference = (key: keyof TravelerPreferences['recoveryPriorities'], value: boolean) => {
    setPreferences({
      ...preferences,
      recoveryPriorities: { ...preferences.recoveryPriorities, [key]: value },
    });
  };

  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-ink-400" />
          <h1 className="text-xl font-bold text-ink-100">Settings</h1>
        </div>
        <p className="mt-1 text-sm text-ink-400">Configure your travel and recovery preferences.</p>
      </div>

      <SettingsSection icon={<Plane className="h-4 w-4 text-accent-600" />} title="Traveler Preferences">
        <p className="mb-3 text-[11px] text-ink-500">
          Profile editing isn't available yet - shown read-only from your account.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Full name" value={profile?.name ?? ''} />
          <Field label="Email" value={profile?.email ?? ''} />
          <Field label="Home airport" value={profile?.homeAirport || 'Not set'} />
          <Field label="Loyalty tier" value={profile?.loyaltyTier ?? 'Standard'} />
        </div>
      </SettingsSection>

      <SettingsSection icon={<Sliders className="h-4 w-4 text-accent-600" />} title="Recovery Preferences">
        <div className="space-y-4">
          <SliderControl
            label="Cost vs Speed"
            leftLabel="Minimize cost"
            rightLabel="Maximize speed"
            value={preferences.costVsSpeed}
            onChange={(v) => setPreferences({ ...preferences, costVsSpeed: v })}
          />
          <SliderControl
            label="Disruption vs Comfort"
            leftLabel="Minimize disruption"
            rightLabel="Maximize comfort"
            value={preferences.disruptionVsComfort}
            onChange={(v) => setPreferences({ ...preferences, disruptionVsComfort: v })}
          />

          <div>
            <div className="text-xs font-medium text-ink-100 mb-2">Recovery priorities</div>
            <div className="grid grid-cols-2 gap-2">
              <Toggle
                label="Minimize cost"
                checked={preferences.recoveryPriorities.minimizeCost}
                onChange={(v) => updatePreference('minimizeCost', v)}
              />
              <Toggle
                label="Minimize time"
                checked={preferences.recoveryPriorities.minimizeTime}
                onChange={(v) => updatePreference('minimizeTime', v)}
              />
              <Toggle
                label="Minimize disruption"
                checked={preferences.recoveryPriorities.minimizeDisruption}
                onChange={(v) => updatePreference('minimizeDisruption', v)}
              />
              <Toggle
                label="Maximize comfort"
                checked={preferences.recoveryPriorities.maximizeComfort}
                onChange={(v) => updatePreference('maximizeComfort', v)}
              />
            </div>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection icon={<Bell className="h-4 w-4 text-accent-600" />} title="Notification Preferences">
        <p className="mb-3 text-[11px] text-ink-500">Saved on this device only.</p>
        <div className="space-y-2">
          <Toggle label="High-risk alerts" checked={notifPrefs.highRisk} onChange={(v) => setNotifPrefs(p => ({ ...p, highRisk: v }))} />
          <Toggle label="Recovery ready notifications" checked={notifPrefs.recoveryReady} onChange={(v) => setNotifPrefs(p => ({ ...p, recoveryReady: v }))} />
          <Toggle label="Booking updates" checked={notifPrefs.bookingUpdates} onChange={(v) => setNotifPrefs(p => ({ ...p, bookingUpdates: v }))} />
          <Toggle label="System status changes" checked={notifPrefs.systemStatus} onChange={(v) => setNotifPrefs(p => ({ ...p, systemStatus: v }))} />
          <Toggle label="Weather warnings" checked={notifPrefs.weather} onChange={(v) => setNotifPrefs(p => ({ ...p, weather: v }))} />
        </div>
      </SettingsSection>

      <SettingsSection icon={<Shield className="h-4 w-4 text-accent-600" />} title="Risk Thresholds">
        <p className="mb-3 text-[11px] text-ink-500">
          Saved on this device only - controls when Risk Intelligence highlights a node, not the underlying risk calculation.
        </p>
        <div className="space-y-4">
          <SliderControl label="Connection risk alert threshold" leftLabel="Low" rightLabel="High" value={riskThresholds.connection} onChange={(v) => setRiskThresholds(p => ({ ...p, connection: v }))} />
          <SliderControl label="Schedule risk alert threshold" leftLabel="Low" rightLabel="High" value={riskThresholds.schedule} onChange={(v) => setRiskThresholds(p => ({ ...p, schedule: v }))} />
        </div>
      </SettingsSection>

      <SettingsSection icon={<Lock className="h-4 w-4 text-accent-600" />} title="Data & Privacy">
        <div className="space-y-2">
          <Toggle label="Share itinerary data for AI improvement" checked={privacyPrefs.shareData} onChange={(v) => setPrivacyPrefs(p => ({ ...p, shareData: v }))} />
          <Toggle label="Allow provider integrations" checked={privacyPrefs.providerIntegrations} onChange={(v) => setPrivacyPrefs(p => ({ ...p, providerIntegrations: v }))} />
          <Toggle label="Anonymous usage analytics" checked={privacyPrefs.analytics} onChange={(v) => setPrivacyPrefs(p => ({ ...p, analytics: v }))} />
        </div>
      </SettingsSection>

      <SettingsSection icon={<Link2 className="h-4 w-4 text-accent-600" />} title="Connected Providers">
        <div className="space-y-2">
          <ProviderRow name="IndiGo" connected={true} />
          <ProviderRow name="Go First" connected={true} />
          <ProviderRow name="MakeMyTrip" connected={true} />
          <ProviderRow name="Grand Dragon Ladakh" connected={false} />
          <ProviderRow name="Ladakh Adventures" connected={true} />
        </div>
      </SettingsSection>
    </div>
  );
}

function SettingsSection({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h2 className="text-sm font-semibold text-ink-100">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] text-ink-500 mb-1">{label}</div>
      <input
        type="text"
        value={value}
        readOnly
        className="w-full cursor-default rounded-lg border border-ink-700 bg-ink-800 px-3 py-2 text-sm text-ink-300 focus:outline-none"
      />
    </div>
  );
}

function SliderControl({ label, leftLabel, rightLabel, value, onChange }: { label: string; leftLabel: string; rightLabel: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="text-xs font-medium text-ink-100 mb-2">{label}</div>
      <input type="range" min={0} max={100} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-accent-500" />
      <div className="mt-1 flex items-center justify-between text-[10px] text-ink-500">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="flex items-center justify-between rounded-lg border border-ink-700 bg-white/60 p-3 transition hover:bg-ink-800"
    >
      <span className="text-xs text-ink-200">{label}</span>
      <span className={cn(
        'relative h-5 w-9 rounded-full transition',
        checked ? 'bg-accent-500' : 'bg-ink-600'
      )}>
        <span className={cn(
          'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-card transition-all',
          checked ? 'left-[18px]' : 'left-0.5'
        )} />
      </span>
    </button>
  );
}

function ProviderRow({ name, connected }: { name: string; connected: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-ink-700 bg-white/60 p-3">
      <span className="text-xs text-ink-200">{name}</span>
      <span className={cn(
        'flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium',
        connected ? 'bg-emerald-500/10 text-emerald-700' : 'bg-ink-500/10 text-ink-400'
      )}>
        <span className={cn('h-1.5 w-1.5 rounded-full', connected ? 'bg-emerald-400' : 'bg-ink-500')} />
        {connected ? 'Connected' : 'Not connected'}
      </span>
    </div>
  );
}
