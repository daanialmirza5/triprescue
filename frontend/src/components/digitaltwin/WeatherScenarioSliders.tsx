import type { ReactNode } from 'react';
import type { WeatherScenarioRequest } from '@/services/api';
import type { ItineraryNodeData } from '@/types';
import { cn } from '@/lib/utils';
import { SCENARIO_PRESETS, severityOf } from '@/lib/digitalTwin';
import { Loader2, Play } from 'lucide-react';

interface SliderProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  danger?: (v: number) => boolean;
  onChange: (v: number) => void;
}

function Slider({ id, label, value, min, max, step, unit, danger, onChange }: SliderProps) {
  const hot = danger?.(value);
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <label htmlFor={id} className="font-medium text-ink-soft">{label}</label>
        <span className={cn('font-mono text-[13px] font-semibold', hot ? 'text-danger' : 'text-ink')}>{value.toLocaleString('en-IN')} {unit}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn('mt-2 w-full cursor-pointer', hot ? 'accent-danger' : 'accent-brand')}
      />
    </div>
  );
}

interface WeatherScenarioSlidersProps {
  value: WeatherScenarioRequest;
  onChange: (next: WeatherScenarioRequest) => void;
  nodes: ItineraryNodeData[];
  onRun: () => void;
  running?: boolean;
  footer?: ReactNode;
}

/** Scenario builder: one-click presets plus fine-grained weather sliders. */
export function WeatherScenarioSliders({ value, onChange, nodes, onRun, running, footer }: WeatherScenarioSlidersProps) {
  const set = (patch: Partial<WeatherScenarioRequest>) => onChange({ ...value, ...patch, scenarioName: patch.scenarioName ?? customName(value.scenarioName) });
  const severity = severityOf(value);
  const activePreset = SCENARIO_PRESETS.find((p) => p.scenario.scenarioName === value.scenarioName)?.id;
  const bookable = nodes.filter((n) => n.category !== 'connection');

  return (
    <section className="card p-5" aria-labelledby="scenario-title">
      <h2 id="scenario-title" className="section-title">Weather scenario</h2>
      <p className="mt-1 text-sm text-ink-muted">Pick a preset or dial in your own storm.</p>

      <div className="mt-4 grid grid-cols-2 gap-2" role="group" aria-label="Scenario presets">
        {SCENARIO_PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            aria-pressed={activePreset === p.id}
            onClick={() => onChange({ ...p.scenario, affectedNodeId: value.affectedNodeId })}
            className={cn(
              'flex items-start gap-2 rounded-tile border px-3 py-2.5 text-left transition',
              activePreset === p.id ? 'border-brand bg-brand-light/70 shadow-card' : 'border-line bg-white hover:border-brand/40 hover:bg-canvas',
            )}
          >
            <p.icon className={cn('mt-0.5 h-4 w-4 shrink-0', activePreset === p.id ? 'text-brand' : 'text-ink-muted')} aria-hidden="true" />
            <span className="min-w-0">
              <span className="block text-[13px] font-semibold leading-tight text-ink">{p.label}</span>
              <span className="block text-[11px] text-ink-muted">{p.hint}</span>
            </span>
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-4">
        <Slider id="twin-rain" label="Rainfall" unit="mm/h" min={0} max={100} step={1} value={value.rainfallMmPerHour} danger={(v) => v > 35} onChange={(v) => set({ rainfallMmPerHour: v })} />
        <Slider id="twin-wind" label="Wind speed" unit="km/h" min={0} max={120} step={1} value={value.windSpeedKmh} danger={(v) => v > 60} onChange={(v) => set({ windSpeedKmh: v })} />
        <Slider id="twin-vis" label="Visibility" unit="m" min={100} max={5000} step={50} value={Math.min(5000, value.visibilityMeters)} danger={(v) => v < 800} onChange={(v) => set({ visibilityMeters: v })} />
        <Slider id="twin-temp" label="Temperature" unit="°C" min={0} max={50} step={1} value={value.temperatureCelsius} danger={(v) => v > 44} onChange={(v) => set({ temperatureCelsius: v })} />
        <Slider id="twin-duration" label="Storm duration" unit="h" min={1} max={12} step={1} value={value.stormDurationHours} onChange={(v) => set({ stormDurationHours: v })} />
      </div>

      <div className="mt-5">
        <label htmlFor="twin-target" className="text-sm font-medium text-ink-soft">Where it hits</label>
        <select
          id="twin-target"
          value={value.affectedNodeId ?? ''}
          onChange={(e) => onChange({ ...value, affectedNodeId: e.target.value || null })}
          className="mt-2 w-full rounded-tile border border-line bg-white px-3 py-2.5 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        >
          <option value="">Whole route (from the first departure)</option>
          {bookable.map((n) => <option key={n.id} value={n.id}>{n.title}</option>)}
        </select>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-ink-muted">
          <span>Scenario severity</span>
          <span className={severity > 0.7 ? 'text-danger' : severity > 0.4 ? 'text-risk-dark' : 'text-safe'}>{Math.round(severity * 100)}%</span>
        </div>
        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-canvas" role="meter" aria-label="Scenario severity" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(severity * 100)}>
          <div className={cn('h-full rounded-full transition-all', severity > 0.7 ? 'bg-danger' : severity > 0.4 ? 'bg-risk' : 'bg-safe')} style={{ width: `${Math.max(4, severity * 100)}%` }} />
        </div>
      </div>

      <button type="button" onClick={onRun} disabled={running || !bookable.length} className="btn-gradient mt-5 w-full justify-center disabled:opacity-60">
        {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
        {running ? 'Simulating…' : 'Run Digital Twin'}
      </button>
      {footer}
    </section>
  );
}

const customName = (current: string) => (SCENARIO_PRESETS.some((p) => p.scenario.scenarioName === current) ? `Custom (${current})` : current);
