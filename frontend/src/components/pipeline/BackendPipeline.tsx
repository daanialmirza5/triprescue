import { PIPELINE_STAGES, type StageState } from '@/lib/pipeline';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

const STYLE: Record<StageState['status'], { box: string; icon: string; label: string }> = {
  idle: { box: 'border-line bg-white text-ink-faint', icon: '○', label: 'Idle' },
  running: { box: 'border-brand bg-brand-light text-brand ring-4 ring-brand/15 animate-pulse-soft', icon: '●', label: 'Running' },
  completed: { box: 'border-brand/40 bg-white text-ink', icon: '✓', label: 'Completed' },
  failed: { box: 'border-danger/60 bg-danger-light text-danger', icon: '×', label: 'Failed' },
};

interface BackendPipelineProps {
  stages: Record<string, StageState>;
  simulated: boolean;
  selected: string | null;
  onSelect: (stage: string) => void;
  large?: boolean;
}

/** Layer 2: the backend stages, lit only by events the backend actually emitted. */
export function BackendPipeline({ stages, simulated, selected, onSelect, large }: BackendPipelineProps) {
  return (
    <div className="overflow-x-auto pb-2 scrollbar-thin">
      <ol className="flex min-w-max items-center gap-1" aria-label="Backend pipeline">
        {PIPELINE_STAGES.map((s, i) => {
          const st = stages[s.id];
          const style = STYLE[st.status];
          return (
            <li key={s.id} className="flex items-center">
              <button
                type="button"
                onClick={() => onSelect(s.id)}
                aria-pressed={selected === s.id}
                aria-label={`${s.label}: ${style.label}`}
                className={cn(
                  'flex flex-col rounded-tile border px-3 py-2 text-left transition',
                  style.box, large ? 'w-36' : 'w-32', selected === s.id && 'outline outline-2 outline-offset-2 outline-brand',
                  simulated && st.status !== 'idle' && 'border-dashed',
                )}
              >
                <span className="flex items-center justify-between text-[11px] font-semibold">
                  <span>{style.icon} {style.label}</span>
                  {st.runs > 1 && <span className="font-mono opacity-70">×{st.runs}</span>}
                </span>
                <span className={cn('mt-0.5 font-semibold', large ? 'text-[15px]' : 'text-sm')}>{s.label}</span>
                <span className="truncate text-[11px] opacity-80" title={st.last?.function ?? ''}>{st.last ? st.last.function : '—'}</span>
              </button>
              {i < PIPELINE_STAGES.length - 1 && <ChevronRight className={cn('mx-0.5 h-4 w-4 shrink-0', st.status === 'idle' ? 'text-line-strong' : 'text-brand')} />}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
