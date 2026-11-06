import { cn } from '@/lib/utils';
import { formatDay, formatINR, formatMinutes, formatTime } from '@/lib/journey';
import { riskTone, toneClasses } from '@/lib/status';
import type { OptionRoute } from '@/lib/recovery';
import type { RecoveryOption } from '@/types';

interface ComparisonPanelProps {
  options: RecoveryOption[];
  routes: Map<string, OptionRoute | null>;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const dims: { key: keyof RecoveryOption['scoreBreakdown']; label: string }[] = [
  { key: 'speed', label: 'Speed' },
  { key: 'cost', label: 'Cost efficiency' },
  { key: 'comfort', label: 'Comfort' },
  { key: 'preservation', label: 'Bookings preserved' },
  { key: 'risk', label: 'Reliability' },
];

/** Side-by-side view of every plan: headline numbers plus the score breakdown
 * the backend used to rank them. */
export function ComparisonPanel({ options, routes, selectedId, onSelect }: ComparisonPanelProps) {
  return (
    <section className="card overflow-hidden animate-fade-in" aria-label="Plan comparison">
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-line bg-canvas/70">
              <th className="px-5 py-3 text-xs font-semibold text-ink-muted">Compare</th>
              {options.map((o) => (
                <th key={o.id} className="px-4 py-3">
                  <button onClick={() => onSelect(o.id)} className={cn('text-left font-bold', selectedId === o.id ? 'text-brand' : 'text-ink hover:text-brand')}>
                    {o.name}
                    {selectedId === o.id && <span className="ml-2 pill bg-brand-light text-brand">Selected</span>}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            <Row label="Recovery score">{options.map((o) => <td key={o.id} className="px-4 py-3 font-bold text-brand">{o.score}%</td>)}</Row>
            <Row label="Extra cost">{options.map((o) => <td key={o.id} className="px-4 py-3 font-semibold text-ink">{formatINR(Math.max(0, o.costDelta))}</td>)}</Row>
            <Row label="Arrival">{options.map((o) => { const r = routes.get(o.id); return <td key={o.id} className="px-4 py-3 text-ink">{r?.arrive ? `${formatTime(r.arrive)}${r.depart && r.arrive.toDateString() !== r.depart.toDateString() ? ` · ${formatDay(r.arrive)}` : ''}` : '—'}{o.timeImpactMinutes > 0 && <span className="ml-1 text-xs text-ink-muted">(+{formatMinutes(o.timeImpactMinutes)})</span>}</td>; })}</Row>
            <Row label="Bookings kept">{options.map((o) => <td key={o.id} className="px-4 py-3 text-safe">{o.bookingsPreserved}/{o.totalBookings}</td>)}</Row>
            <Row label="Refund recovered">{options.map((o) => <td key={o.id} className="px-4 py-3 text-ink">{formatINR(o.refundRecovered)}</td>)}</Row>
            <Row label="Disruption risk">{options.map((o) => <td key={o.id} className="px-4 py-3"><span className={cn('pill capitalize', toneClasses[riskTone[o.residualRisk]].pill)}>{o.residualRisk}</span></td>)}</Row>
            {dims.map((d) => (
              <Row key={d.key} label={d.label}>
                {options.map((o) => (
                  <td key={o.id} className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-canvas"><div className="h-full rounded-full bg-brand-gradient" style={{ width: `${o.scoreBreakdown[d.key]}%` }} /></div>
                      <span className="text-xs tabular-nums text-ink-muted">{o.scoreBreakdown[d.key]}</span>
                    </div>
                  </td>
                ))}
              </Row>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <tr>
      <th scope="row" className="px-5 py-3 text-xs font-semibold text-ink-muted">{label}</th>
      {children}
    </tr>
  );
}
