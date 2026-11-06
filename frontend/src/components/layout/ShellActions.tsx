import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { Modal } from '@/components/ui/Modal';
import { DisruptionModal } from '@/components/disruption/DisruptionModal';
import { AddFlightModal } from '@/components/trip/AddFlightModal';
import { AddAccommodationModal } from '@/components/trip/AddAccommodationModal';
import { AddActivityModal } from '@/components/trip/AddActivityModal';
import { CreateTripModal } from '@/components/trip/CreateTripModal';
import { useApp } from '@/store/AppContext';
import { useToast } from '@/components/ui/ToastProvider';
import { useRouter } from '@/lib/router';
import { nodeKind } from '@/lib/journey';
import { BedDouble, Check, Copy, MapPinned, MessageSquareText, Plane, PlusCircle, Ticket } from 'lucide-react';

type Dialog = null | 'simulate' | 'support' | 'add' | 'flight' | 'hotel' | 'activity' | 'trip';

interface ShellActions {
  openSimulate: () => void;
  openSupport: () => void;
  openAddBooking: () => void;
  openCreateTrip: () => void;
}

const ShellActionsContext = createContext<ShellActions | null>(null);

export function ShellActionsProvider({ children }: { children: ReactNode }) {
  const [dialog, setDialog] = useState<Dialog>(null);
  const { addToast } = useToast();
  const close = useCallback(() => setDialog(null), []);
  const added = (what: string) => () => { setDialog(null); addToast('success', `${what} added`, 'Safar Sathi re-validated your itinerary.'); };

  const value = useMemo<ShellActions>(() => ({
    openSimulate: () => setDialog('simulate'),
    openSupport: () => setDialog('support'),
    openAddBooking: () => setDialog('add'),
    openCreateTrip: () => setDialog('trip'),
  }), []);

  return (
    <ShellActionsContext.Provider value={value}>
      {children}
      <DisruptionModal open={dialog === 'simulate'} onClose={close} />
      <SupportModal open={dialog === 'support'} onClose={close} />
      <AddBookingPicker open={dialog === 'add'} onClose={close} onPick={setDialog} />
      <AddFlightModal open={dialog === 'flight'} onClose={close} onAdded={added('Flight')} />
      <AddAccommodationModal open={dialog === 'hotel'} onClose={close} onAdded={added('Hotel')} />
      <AddActivityModal open={dialog === 'activity'} onClose={close} onAdded={added('Activity')} />
      <CreateTripModal open={dialog === 'trip'} onClose={close} onCreated={() => { setDialog(null); addToast('success', 'Trip created', 'Add bookings to start monitoring it.'); }} />
    </ShellActionsContext.Provider>
  );
}

export function useShellActions() {
  const ctx = useContext(ShellActionsContext);
  if (!ctx) throw new Error('useShellActions must be used within ShellActionsProvider');
  return ctx;
}

function AddBookingPicker({ open, onClose, onPick }: { open: boolean; onClose: () => void; onPick: (d: Dialog) => void }) {
  const { trip } = useApp();
  const options = [
    { id: 'flight' as const, label: 'Flight', text: 'Airline booking with airport codes', icon: Plane },
    { id: 'hotel' as const, label: 'Hotel', text: 'Stay with check-in and check-out', icon: BedDouble },
    { id: 'activity' as const, label: 'Activity', text: 'Tour, event or excursion', icon: Ticket },
    { id: 'trip' as const, label: 'New trip', text: 'Start a separate journey', icon: MapPinned },
  ];
  return (
    <Modal open={open} onClose={onClose} title="Add Booking" subtitle={trip.name ? `Bookings are added to ${trip.name} (${trip.route}).` : 'Choose what you would like to add.'}>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {options.map(({ id, label, text, icon: Icon }) => (
          <button key={id} onClick={() => onPick(id)} className="card card-hover flex items-start gap-3 p-4 text-left">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-light text-brand"><Icon className="h-5 w-5" /></span>
            <span>
              <span className="block text-sm font-bold text-ink">{label}</span>
              <span className="mt-0.5 block text-xs text-ink-muted">{text}</span>
            </span>
          </button>
        ))}
      </div>
    </Modal>
  );
}

function SupportModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { trip } = useApp();
  const { navigate } = useRouter();
  const [copied, setCopied] = useState<string | null>(null);
  const bookings = trip.nodes.filter((n) => n.category !== 'connection' && n.confirmation);
  const copy = async (ref: string) => {
    try {
      await navigator.clipboard.writeText(ref);
      setCopied(ref);
      setTimeout(() => setCopied(null), 1600);
    } catch {
      setCopied(null);
    }
  };
  return (
    <Modal open={open} onClose={onClose} title="Contact Support" subtitle="Your booking references, ready for any provider's help desk." className="max-w-xl">
      <div className="space-y-2">
        {bookings.length === 0 && <p className="text-sm text-ink-muted">No bookings with references yet.</p>}
        {bookings.map((n) => (
          <div key={n.id} className="flex items-center gap-3 rounded-xl border border-line p-3">
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-ink">{n.provider}</div>
              <div className="truncate text-xs text-ink-muted">{n.title} · {nodeKind(n)}</div>
            </div>
            <code className="hidden rounded-lg bg-canvas px-2 py-1 text-xs text-ink-soft sm:block">{n.confirmation}</code>
            <button onClick={() => copy(n.confirmation!)} className="btn-ghost px-3 py-2 text-xs" aria-label={`Copy reference ${n.confirmation}`}>
              {copied === n.confirmation ? <Check className="h-4 w-4 text-safe" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <button onClick={() => { onClose(); navigate('assistant', { prompt: 'Help me write a message to support about my disrupted booking' }); }} className="btn-primary">
          <MessageSquareText className="h-4 w-4" /> Draft a message with AI
        </button>
        <button onClick={() => { onClose(); navigate('claims'); }} className="btn-outline"><PlusCircle className="h-4 w-4" /> Start a claim</button>
      </div>
    </Modal>
  );
}
