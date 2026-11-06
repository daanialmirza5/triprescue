import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';

export type QuickAddKind = 'hotels' | 'places' | 'events' | 'flights' | 'trains';

const QUICK_ADD_ITEMS: { id: QuickAddKind; label: string; glyph: string }[] = [
  { id: 'flights', label: 'Flight', glyph: '✈' },
  { id: 'trains', label: 'Train', glyph: '🚆' },
  { id: 'hotels', label: 'Hotel', glyph: '🏨' },
  { id: 'places', label: 'Place', glyph: '📍' },
  { id: 'events', label: 'Event', glyph: '🎟' },
];

/** "+ Add" shortcuts: one tap switches discovery to that kind of item. */
export function QuickAddBar({ active, onSelect, className }: { active?: QuickAddKind; onSelect: (kind: QuickAddKind) => void; className?: string }) {
  return (
    <div className={cn('flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin', className)} role="tablist" aria-label="Quick add">
      <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-ink-soft"><Plus className="h-4 w-4" /> Add</span>
      {QUICK_ADD_ITEMS.map((item) => (
        <button
          key={item.id}
          type="button"
          role="tab"
          aria-selected={active === item.id}
          onClick={() => onSelect(item.id)}
          className={cn(
            'flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-semibold transition',
            active === item.id ? 'border-brand bg-brand text-white shadow-glow' : 'border-line bg-white text-ink-soft hover:border-brand/40 hover:text-brand',
          )}
        >
          <span aria-hidden="true">{item.glyph}</span> {item.label}
        </button>
      ))}
    </div>
  );
}
