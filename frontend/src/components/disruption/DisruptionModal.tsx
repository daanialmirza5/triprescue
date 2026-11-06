import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/lib/utils';
import { useApp } from '@/store/AppContext';
import { disruptionTypes } from '@/data/mockData';
import * as api from '@/services/api';
import { useRouter } from '@/lib/router';
import { useSpeechInput } from '@/hooks/useSpeechInput';
import {
  Clock,
  XCircle,
  Link2Off,
  Bed,
  CalendarX,
  PlaneLanding,
  CloudLightning,
  AlertTriangle,
  ArrowRight,
  Zap,
  Loader2,
  Mic,
  MicOff,
} from 'lucide-react';
import type { DisruptionType } from '@/types';

const iconMap: Record<string, typeof Clock> = {
  clock: Clock,
  'x-circle': XCircle,
  'link-x': Link2Off,
  bed: Bed,
  'calendar-x': CalendarX,
  'plane-landing': PlaneLanding,
  'cloud-lightning': CloudLightning,
};

const DELAY_BASED_TYPES = new Set(['flight-delay', 'activity-delay']);
const PREVIEW_DEBOUNCE_MS = 300;

/** Which bookings each disruption type can happen to (mirrors the backend's
 * check, which rejects e.g. a "flight delay" on a hotel). */
const FLIGHTS = ['flight', 'return', 'train'];
const ALLOWED_CATEGORIES: Record<string, string[]> = {
  'flight-delay': FLIGHTS,
  'flight-cancellation': FLIGHTS,
  'airport-closure': FLIGHTS,
  'missed-connection': ['connection', ...FLIGHTS],
  'hotel-conflict': ['hotel'],
  'hotel-cancellation': ['hotel'],
  'transfer-failure': ['transfer'],
  'activity-cancellation': ['activity'],
  'activity-delay': ['activity'],
  'weather-disruption': ['activity', 'transfer', 'hotel', ...FLIGHTS],
};

interface DisruptionModalProps {
  open: boolean;
  onClose: () => void;
}

export function DisruptionModal({ open, onClose }: DisruptionModalProps) {
  const { triggerDisruption, tripId, isBusy, trip } = useApp();
  const { navigate } = useRouter();
  const [selected, setSelected] = useState<DisruptionType['id']>('flight-delay');
  const [delayMinutesInput, setDelayMinutesInput] = useState(95);
  const [preview, setPreview] = useState<api.PropagationResult | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [smartText, setSmartText] = useState('');
  const [understood, setUnderstood] = useState<{ label: string } | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  /** The booking this disruption applies to; undefined = let Safar Sathi pick. */
  const [nodeId, setNodeId] = useState<string | undefined>(undefined);
  const speech = useSpeechInput((text) => {
    setSmartText((prev) => (prev.trim() ? `${prev.trim()} ${text}` : text));
    setUnderstood(null);
  });

  const delayMinutes = DELAY_BASED_TYPES.has(selected) ? delayMinutesInput : undefined;
  const allowed = ALLOWED_CATEGORIES[selected] ?? [];
  const candidates = trip.nodes.filter((n) => allowed.includes(n.category));
  // A booking chosen for one type may not fit another (a hotel can't have a flight delay).
  const primaryNodeId = nodeId && candidates.some((n) => n.id === nodeId) ? nodeId : undefined;

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setPreviewLoading(true);
    // Debounced: dragging the delay slider would otherwise fire a request per
    // 5-minute step and run into the endpoint's rate limit.
    const timer = setTimeout(() => {
      api
        .simulateDisruption(tripId, { type: selected, delayMinutes, primaryNodeId })
        .then((result) => {
          if (!cancelled) setPreview(result);
        })
        .catch(() => {
          if (!cancelled) setPreview(null);
        })
        .finally(() => {
          if (!cancelled) setPreviewLoading(false);
        });
    }, PREVIEW_DEBOUNCE_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [open, tripId, selected, delayMinutes, primaryNodeId]);

  const chooseType = (type: DisruptionType['id']) => {
    setSelected(type);
    setUnderstood(null); // the "I understood" card described the previous choice
  };


  /** Prefer the backend extractor (airline SMS/email formats, booking matching,
   * optional LLM); fall back to the local keyword parser offline or on error. */
  const analyzeSmartReport = async () => {
    setAnalyzing(true);
    try {
      const result = await api.extractDisruption(smartText, tripId);
      if (result.type && disruptionTypes.some((d) => d.id === result.type)) {
        setSelected(result.type as DisruptionType['id']);
        if (DELAY_BASED_TYPES.has(result.type) && result.delayMinutes) {
          setDelayMinutesInput(Math.max(15, Math.min(360, Math.round(result.delayMinutes / 5) * 5)));
        }
        setUnderstood({ label: `${result.summary} (${Math.round(result.confidence * 100)}% confident)` });
        setNodeId(result.primaryNodeId ?? undefined);
        return;
      }
      if (!result.type) {
        setUnderstood({ label: result.summary });
        return;
      }
    } catch {
      /* backend unavailable - use the local parser below */
    } finally {
      setAnalyzing(false);
    }
    analyzeLocally();
  };

  const analyzeLocally = () => {
    const text = smartText.toLowerCase();
    const hoursMatch = text.match(/(\d+(?:\.5)?)\s*(?:hour|hours|hr|hrs|h)/);
    const minutesMatch = text.match(/(\d+)\s*(?:minute|minutes|min|mins|m)/);
    const minutes = hoursMatch ? Math.round(Number(hoursMatch[1]) * 60) : minutesMatch ? Number(minutesMatch[1]) : 180;
    const node = trip.nodes.find((n) => text.includes(n.title.toLowerCase()) || text.includes(n.label.toLowerCase()) || text.includes(n.provider.toLowerCase()));
    const isWeather = /storm|snow|fog|flood|cyclone|weather|monsoon|blizzard/.test(text);
    const type = isWeather ? 'weather-disruption' : text.includes('cancel') ? 'flight-cancellation' : text.includes('miss') && text.includes('connection') ? 'missed-connection' : text.includes('hotel') ? 'hotel-conflict' : 'flight-delay';
    setSelected(type as DisruptionType['id']);
    if (DELAY_BASED_TYPES.has(type)) setDelayMinutesInput(Math.max(15, Math.min(360, Math.round(minutes / 5) * 5)));
    setUnderstood({ label: node ? `${node.title} · ${DELAY_BASED_TYPES.has(type) ? `Delayed by ${minutes} min` : 'Disruption detected'}` : `${type.replace(/-/g, ' ')} · ${minutes} min` });
    setNodeId(node?.id);
  };

  const handleTrigger = async () => {
    onClose();
    await triggerDisruption(selected, { delayMinutes, primaryNodeId });
    navigate('recovery');
  };

  const affectedCount = preview ? preview.impacts.filter((i) => i.status !== 'healthy').length : null;

  return (
    <Modal open={open} onClose={onClose} title="Simulate a disruption" subtitle="Describe what happened or pick a scenario - Safar Sathi previews the ripple effect before anything changes." className="max-w-xl">
      <div className="space-y-4">
        <div className="rounded-xl border border-safar-blue/20 bg-safar-blue/5 p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-safar-blue">Smart reporting</div>
          <div className="mt-1 text-sm font-semibold text-ink">What happened?</div>
          <div className="mt-3 flex gap-2">
            <textarea aria-label="Describe what happened" value={smartText} onChange={(e)=>{setSmartText(e.target.value);setUnderstood(null)}} rows={2} placeholder={speech.supported ? 'Type or tap the mic, e.g. My Mumbai to Delhi flight is delayed by 95 minutes.' : 'e.g. My Mumbai to Delhi flight is delayed by 95 minutes.'} className="min-h-20 flex-1 resize-none rounded-xl border border-line-strong bg-white px-3 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-safar-blue focus:outline-none"/>
            <div className="flex flex-col justify-end gap-2">
              {speech.supported && (
                <button
                  type="button"
                  onClick={speech.listening ? speech.stop : speech.start}
                  aria-pressed={speech.listening}
                  aria-label={speech.listening ? 'Stop listening' : 'Speak your report'}
                  title={speech.listening ? 'Stop listening' : 'Speak your report'}
                  className={cn('flex items-center justify-center rounded-xl border px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-safar-blue', speech.listening ? 'animate-pulse border-danger/40 bg-danger-light text-danger' : 'border-line-strong bg-white text-safar-blue hover:bg-safar-blue/5')}
                >
                  {speech.listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </button>
              )}
              <button onClick={analyzeSmartReport} disabled={!smartText.trim() || analyzing} className="rounded-xl bg-safar-blue px-3 py-2 text-xs font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-safar-blue focus-visible:ring-offset-2 disabled:opacity-40">{analyzing ? 'Analyzing…' : 'Analyze'}</button>
            </div>
          </div>
          <div aria-live="polite" className="text-xs">
            {speech.listening && <p className="mt-2 text-safar-blue">Listening… describe what happened.</p>}
            {speech.error && <p className="mt-2 text-danger">{speech.error}</p>}
          </div>
          {understood && <div className="mt-3 rounded-lg border border-safar-safe/20 bg-white p-3 text-xs"><div className="font-semibold text-ink">I understood</div><div className="mt-1 text-ink-muted">{understood.label}</div><div className="mt-2 text-[10px] text-ink-muted">Review the details below before confirming.</div></div>}
        </div>

        <div className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">Or report manually</div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {disruptionTypes.map((dt) => {
            const Icon = iconMap[dt.icon] ?? AlertTriangle;
            const active = selected === dt.id;
            return (
              <button
                key={dt.id}
                onClick={() => chooseType(dt.id)}
                className={cn(
                  'flex flex-col items-start gap-2 rounded-lg border p-3 text-left transition-all',
                  active ? 'border-safar-blue/40 bg-safar-blue/10' : 'border-line bg-white hover:border-line-strong hover:bg-canvas'
                )}
              >
                <Icon className={cn('h-4 w-4', active ? 'text-safar-blue' : 'text-ink-muted')} />
                <div>
                  <div className={cn('text-xs font-medium', active ? 'text-ink' : 'text-ink-soft')}>{dt.label}</div>
                  <div className="mt-0.5 text-[10px] text-ink-muted line-clamp-2">{dt.description}</div>
                </div>
              </button>
            );
          })}
        </div>

        {candidates.length > 0 && (
          <label className="block rounded-lg border border-line bg-white p-4">
            <span className="mb-2 block text-xs font-medium text-ink">Which booking?</span>
            <select
              value={primaryNodeId ?? ''}
              onChange={(e) => setNodeId(e.target.value || undefined)}
              className="w-full rounded-lg border border-line-strong bg-white px-3 py-2 text-sm text-ink focus:border-safar-blue focus:outline-none focus-visible:ring-2 focus-visible:ring-safar-blue/30"
            >
              <option value="">Let Safar Sathi choose the most likely booking</option>
              {candidates.map((n) => (
                <option key={n.id} value={n.id}>{n.title}{n.scheduledTime ? ` · ${n.scheduledTime}` : ''}</option>
              ))}
            </select>
          </label>
        )}

        {DELAY_BASED_TYPES.has(selected) && (
          <div className="rounded-lg border border-line bg-white p-4 animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-ink">Delay by</span>
              <span className="text-lg font-bold text-safar-blue">{delayMinutesInput} min</span>
            </div>
            <input
              type="range"
              min={15}
              max={360}
              step={5}
              value={delayMinutesInput}
              onChange={(e) => setDelayMinutesInput(Number(e.target.value))}
              aria-label="Delay in minutes"
              className="w-full" style={{ accentColor: '#2563EB' }}
            />
            <div className="mt-2 flex items-center justify-between text-[10px] text-ink-muted">
              <span>15 min</span>
              <span>95 min (demo scenario)</span>
              <span>6h</span>
            </div>
          </div>
        )}

        <div className="rounded-lg border border-line bg-white p-4">
          <div className="mb-2 text-[10px] font-medium uppercase tracking-wider text-ink-muted">Computed impact preview</div>
          {previewLoading ? (
            <div className="flex items-center gap-2 text-xs text-ink-muted">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Running propagation engine...
            </div>
          ) : preview ? (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-[10px] text-ink-muted">Impact level</div>
                <div className={cn('text-sm font-semibold', preview.disruption.impactLevel === 'low' ? 'text-safar-safe' : preview.disruption.impactLevel === 'medium' ? 'text-safar-risk' : 'text-safar-broken')}>
                  {preview.disruption.impactLevel.toUpperCase()}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-ink-muted">Downstream</div>
                <div className="text-sm text-ink">{affectedCount} node(s) affected</div>
              </div>
            </div>
          ) : (
            <div className="text-xs text-ink-muted">Preview unavailable right now - you can still apply the scenario.</div>
          )}
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-safar-risk/5 border border-safar-risk/20 p-3">
          <AlertTriangle className="h-4 w-4 shrink-0 text-safar-risk" />
          <p className="text-[11px] text-ink-soft">
            Confirming applies this disruption to your trip, runs impact propagation, and prepares recovery options. You can reset the journey afterwards.
          </p>
        </div>

        <div className="flex items-center justify-between">
          <button onClick={onClose} className="rounded-lg px-4 py-2 text-sm text-ink-muted transition hover:text-ink">
            Cancel
          </button>
          <button
            onClick={handleTrigger}
            disabled={isBusy}
            className={cn(
              'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition',
              !isBusy
                ? 'bg-gradient-to-r from-safar-broken to-safar-saffron hover:brightness-110 shadow-card'
                : 'bg-line-strong cursor-not-allowed opacity-50'
            )}
          >
            <Zap className="h-4 w-4" />
            Confirm Disruption
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Modal>
  );
}
