import { cn } from '@/lib/utils';
import type { Priority } from '@/lib/recovery';
import { Armchair, IndianRupee, Loader2, Target, Zap } from 'lucide-react';

const choices: { id: Priority; label: string; icon: typeof Zap }[] = [
  { id: 'sooner', label: 'Arrive sooner', icon: Zap },
  { id: 'cost', label: 'Spend less', icon: IndianRupee },
  { id: 'comfort', label: 'Travel comfortably', icon: Armchair },
];

interface PreferenceSelectorProps {
  value: Priority;
  onChange: (p: Priority) => void;
  busy?: boolean;
}

export function PreferenceSelector({ value, onChange, busy }: PreferenceSelectorProps) {
  return (
    <section className="card flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between" aria-labelledby="pref-title">
      <div className="flex items-center gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-light text-brand"><Target className="h-6 w-6" /></span>
        <div>
          <h2 id="pref-title" className="section-title flex items-center gap-2">What matters most? {busy && <Loader2 className="h-4 w-4 animate-spin text-brand" aria-label="Re-ranking options" />}</h2>
          <p className="text-sm text-ink-muted">Adjust your preference to get personalised recovery options.</p>
        </div>
      </div>
      <div role="radiogroup" aria-label="Recovery priority" className="grid grid-cols-1 gap-1 rounded-2xl border border-line bg-white p-1.5 sm:grid-cols-3 lg:min-w-[560px]">
        {choices.map(({ id, label, icon: Icon }) => {
          const active = value === id;
          return (
            <button
              key={id}
              role="radio"
              aria-checked={active}
              onClick={() => onChange(id)}
              disabled={busy}
              className={cn('flex items-center justify-center gap-2.5 rounded-xl px-4 py-3 text-[15px] font-semibold transition', active ? 'bg-brand text-white shadow-card' : 'text-ink-soft hover:bg-canvas')}
            >
              <Icon className="h-5 w-5" /> {label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
