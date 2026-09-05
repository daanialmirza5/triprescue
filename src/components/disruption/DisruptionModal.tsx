import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/lib/utils';
import { useApp } from '@/store/AppContext';
import { disruptionTypes } from '@/data/mockData';
import * as api from '@/services/api';
import {
  Clock,
  XCircle,
  Link2Off,
  Bed,
  CalendarX,
  PlaneLanding,
  AlertTriangle,
  ArrowRight,
  Zap,
  Loader2,
} from 'lucide-react';
import type { DisruptionType } from '@/types';

const iconMap: Record<string, typeof Clock> = {
  clock: Clock,
  'x-circle': XCircle,
  'link-x': Link2Off,
  bed: Bed,
  'calendar-x': CalendarX,
  'plane-landing': PlaneLanding,
};

const DELAY_BASED_TYPES = new Set(['flight-delay', 'activity-delay']);

interface DisruptionModalProps {
  open: boolean;
  onClose: () => void;
}

export function DisruptionModal({ open, onClose }: DisruptionModalProps) {
  const { triggerDisruption, tripId, isBusy } = useApp();
  const [selected, setSelected] = useState<DisruptionType['id']>('flight-delay');
  const [delayHours, setDelayHours] = useState(3);
  const [preview, setPreview] = useState<api.PropagationResult | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  const delayMinutes = DELAY_BASED_TYPES.has(selected) ? delayHours * 60 : undefined;

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setPreviewLoading(true);
    api
      .simulateDisruption(tripId, { type: selected, delayMinutes })
      .then((result) => {
        if (!cancelled) setPreview(result);
      })
      .catch(() => {
        if (!cancelled) setPreview(null);
      })
      .finally(() => {
        if (!cancelled) setPreviewLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, tripId, selected, delayMinutes]);

  const handleTrigger = async () => {
    onClose();
    await triggerDisruption(selected, { delayMinutes });
  };

  const affectedCount = preview ? preview.impacts.filter((i) => i.status !== 'healthy').length : null;

  return (
    <Modal open={open} onClose={onClose} title="Simulate Disruption" subtitle="Choose a disruption type to test the recovery engine" className="max-w-xl">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {disruptionTypes.map((dt) => {
            const Icon = iconMap[dt.icon] ?? AlertTriangle;
            const active = selected === dt.id;
            return (
              <button
                key={dt.id}
                onClick={() => setSelected(dt.id)}
                className={cn(
                  'flex flex-col items-start gap-2 rounded-lg border p-3 text-left transition-all',
                  active ? 'border-accent-500/40 bg-accent-500/10' : 'border-ink-700 bg-ink-900 hover:border-ink-600 hover:bg-ink-800'
                )}
              >
                <Icon className={cn('h-4 w-4', active ? 'text-accent-600' : 'text-ink-400')} />
                <div>
                  <div className={cn('text-xs font-medium', active ? 'text-ink-100' : 'text-ink-200')}>{dt.label}</div>
                  <div className="mt-0.5 text-[10px] text-ink-500 line-clamp-2">{dt.description}</div>
                </div>
              </button>
            );
          })}
        </div>

        {DELAY_BASED_TYPES.has(selected) && (
          <div className="rounded-lg border border-ink-700 bg-ink-900 p-4 animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-ink-100">Delay by</span>
              <span className="text-lg font-bold text-accent-600">{delayHours}h</span>
            </div>
            <input
              type="range"
              min={1}
              max={6}
              value={delayHours}
              onChange={(e) => setDelayHours(Number(e.target.value))}
              className="w-full accent-accent-500"
            />
            <div className="mt-2 flex items-center justify-between text-[10px] text-ink-500">
              <span>1h</span>
              <span>3h (recommended demo)</span>
              <span>6h</span>
            </div>
          </div>
        )}

        <div className="rounded-lg border border-ink-700 bg-ink-900 p-4">
          <div className="mb-2 text-[10px] font-medium uppercase tracking-wider text-ink-500">Computed impact preview</div>
          {previewLoading ? (
            <div className="flex items-center gap-2 text-xs text-ink-400">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Running propagation engine...
            </div>
          ) : preview ? (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-[10px] text-ink-500">Impact level</div>
                <div className={cn('text-sm font-semibold', preview.disruption.impactLevel === 'low' ? 'text-emerald-600' : preview.disruption.impactLevel === 'medium' ? 'text-amber-600' : 'text-red-600')}>
                  {preview.disruption.impactLevel.toUpperCase()}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-ink-500">Downstream</div>
                <div className="text-sm text-ink-100">{affectedCount} node(s) affected</div>
              </div>
            </div>
          ) : (
            <div className="text-xs text-ink-500">Could not reach the backend to preview this scenario.</div>
          )}
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-amber-500/5 border border-amber-500/20 p-3">
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
          <p className="text-[11px] text-ink-300">
            This will trigger the disruption cascade animation and generate recovery strategies from the backend.
          </p>
        </div>

        <div className="flex items-center justify-between">
          <button onClick={onClose} className="rounded-lg px-4 py-2 text-sm text-ink-400 transition hover:text-ink-100">
            Cancel
          </button>
          <button
            onClick={handleTrigger}
            disabled={isBusy}
            className={cn(
              'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition',
              !isBusy
                ? 'bg-gradient-to-r from-red-500 to-orange-500 hover:brightness-110 shadow-glow-amber'
                : 'bg-ink-600 cursor-not-allowed opacity-50'
            )}
          >
            <Zap className="h-4 w-4" />
            Trigger Disruption
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Modal>
  );
}
