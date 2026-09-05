import { useState, useMemo, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/lib/utils';
import { formatCurrency, formatDuration } from '@/lib/status';
import { useApp } from '@/store/AppContext';
import type { RecoveryOption } from '@/types';
import { Star, Gauge } from 'lucide-react';

interface RecoveryComparisonProps {
  open: boolean;
  onClose: () => void;
  options: RecoveryOption[];
  onSelect: (id: string) => void;
}

export function RecoveryComparison({ open, onClose, options, onSelect }: RecoveryComparisonProps) {
  const { preferences, setPreferences, loadRecoveryOptions } = useApp();
  const [costSpeed, setCostSpeed] = useState(preferences.costVsSpeed);
  const [disruptComfort, setDisruptComfort] = useState(preferences.disruptionVsComfort);
  const commitTimer = useRef<ReturnType<typeof setTimeout>>();

  // Instant local preview re-weights the REAL backend-computed score
  // breakdown for immediate slider feedback. The authoritative ranking is
  // recomputed server-side (below) once the traveler settles on a value -
  // this is not a substitute for that, just a responsive preview of it.
  const ranked = useMemo(() => {
    const costWeight = (100 - costSpeed) / 100;
    const speedWeight = costSpeed / 100;
    const disruptionWeight = (100 - disruptComfort) / 100;
    const comfortWeight = disruptComfort / 100;

    return [...options]
      .map((o) => {
        const adjustedScore =
          o.scoreBreakdown.cost * costWeight * 0.25 +
          o.scoreBreakdown.speed * speedWeight * 0.25 +
          o.scoreBreakdown.preservation * disruptionWeight * 0.25 +
          o.scoreBreakdown.comfort * comfortWeight * 0.25;
        return { ...o, adjustedScore: Math.round(adjustedScore) };
      })
      .sort((a, b) => b.adjustedScore - a.adjustedScore);
  }, [options, costSpeed, disruptComfort]);

  useEffect(() => {
    if (!open) return;
    if (costSpeed === preferences.costVsSpeed && disruptComfort === preferences.disruptionVsComfort) return;
    clearTimeout(commitTimer.current);
    commitTimer.current = setTimeout(() => {
      setPreferences({ ...preferences, costVsSpeed: costSpeed, disruptionVsComfort: disruptComfort }).then(() =>
        loadRecoveryOptions()
      );
    }, 500);
    return () => clearTimeout(commitTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [costSpeed, disruptComfort, open]);

  return (
    <Modal open={open} onClose={onClose} title="Compare Recovery Plans" subtitle="Adjust preferences to see ranking update in real-time" className="max-w-4xl">
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SliderControl
            label="Cost ←→ Speed"
            leftLabel="Minimize cost"
            rightLabel="Maximize speed"
            value={costSpeed}
            onChange={setCostSpeed}
          />
          <SliderControl
            label="Minimal disruption ←→ Maximum comfort"
            leftLabel="Min. disruption"
            rightLabel="Max. comfort"
            value={disruptComfort}
            onChange={setDisruptComfort}
          />
        </div>

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-700 text-left text-[10px] uppercase text-ink-500">
                <th className="py-2 pr-4 font-medium">Recovery Plan</th>
                <th className="py-2 px-3 font-medium">Cost</th>
                <th className="py-2 px-3 font-medium">Time Lost</th>
                <th className="py-2 px-3 font-medium">Preserved</th>
                <th className="py-2 px-3 font-medium">Risk</th>
                <th className="py-2 px-3 font-medium">Refund</th>
                <th className="py-2 px-3 font-medium">Comfort</th>
                <th className="py-2 px-3 font-medium w-32">Score</th>
              </tr>
            </thead>
            <motion.tbody>
              {ranked.map((option, i) => (
                <motion.tr
                  key={option.id}
                  layout
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  className="border-b border-ink-700 transition-colors hover:bg-ink-800 cursor-pointer"
                  onClick={() => { onSelect(option.id); onClose(); }}
                >
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      {i === 0 && <Star className="h-3.5 w-3.5 text-accent-600" />}
                      <div>
                        <div className="text-xs font-medium text-ink-100">{option.name}</div>
                        <div className="text-[10px] text-ink-500">{option.tag}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-xs text-amber-600 font-medium">+{formatCurrency(option.costDelta)}</td>
                  <td className="py-3 px-3 text-xs text-ink-200">{formatDuration(option.timeImpactMinutes)}</td>
                  <td className="py-3 px-3 text-xs text-emerald-600 font-medium">{option.bookingsPreserved}/{option.totalBookings}</td>
                  <td className="py-3 px-3">
                    <span className={cn('text-xs font-medium', option.residualRisk === 'low' ? 'text-emerald-600' : option.residualRisk === 'medium' ? 'text-amber-600' : 'text-red-600')}>
                      {option.residualRisk === 'low' ? 'Low' : option.residualRisk === 'medium' ? 'Medium' : 'High'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-xs text-emerald-600 font-medium">
                    {option.refundRecovered > 0 ? formatCurrency(option.refundRecovered) : '—'}
                  </td>
                  <td className="py-3 px-3">
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-ink-700">
                      <div className="h-full rounded-full bg-amber-400 transition-all duration-700" style={{ width: `${option.scoreBreakdown.comfort}%` }} />
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-ink-700">
                        <div
                          className={cn('h-full rounded-full transition-all duration-700', i === 0 ? 'bg-accent-400' : 'bg-electric-500')}
                          style={{ width: `${option.adjustedScore}%` }}
                        />
                      </div>
                      <span className={cn('text-xs font-bold', i === 0 ? 'text-accent-600' : 'text-ink-100')}>
                        {option.adjustedScore}
                      </span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-accent-500/5 border border-accent-500/20 p-3">
          <Gauge className="h-4 w-4 text-accent-600 shrink-0" />
          <p className="text-[11px] text-ink-300">
            Rankings adjust dynamically based on your preferences. The top-ranked plan is recommended for your current priorities.
          </p>
        </div>
      </div>
    </Modal>
  );
}

function SliderControl({ label, leftLabel, rightLabel, value, onChange }: { label: string; leftLabel: string; rightLabel: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="rounded-lg border border-ink-700 bg-ink-900 p-3">
      <div className="mb-2 text-xs font-medium text-ink-100">{label}</div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-accent-500"
      />
      <div className="mt-1 flex items-center justify-between text-[10px] text-ink-500">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  );
}
