import type { ExternalItem } from '@/services/api';
import type { AddOutcome, AddState } from '@/hooks/useAddToTrip';
import { useToast } from '@/components/ui/ToastProvider';
import { cn } from '@/lib/utils';
import { Check, Loader2, Plus } from 'lucide-react';

interface AddToTripButtonProps {
  state: AddState;
  add: (build: () => ExternalItem) => Promise<AddOutcome>;
  build: () => ExternalItem;
  label?: string;
  className?: string;
}

export function AddToTripButton({ state, add, build, label = 'Add to Trip', className }: AddToTripButtonProps) {
  const { addToast } = useToast();
  const done = state === 'added' || state === 'already';

  const onClick = async () => {
    const outcome = await add(build);
    if (outcome.state === 'error') addToast('error', 'Not added', outcome.message);
    else if (outcome.state === 'added') addToast('success', 'Added to your trip', 'It now appears in your itinerary and is monitored by SafarSathi.');
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={done || state === 'adding'}
      className={cn(
        'btn px-3 py-1.5 text-xs',
        done ? 'border border-safe/30 bg-safe-light text-safe' : 'border border-brand/30 bg-white text-brand hover:bg-brand-light/60',
        className,
      )}
    >
      {state === 'adding' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : done ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
      {state === 'adding' ? 'Adding…' : state === 'already' ? 'Already Added ✓' : state === 'added' ? 'Added ✓' : label}
    </button>
  );
}
