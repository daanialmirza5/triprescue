import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { useApp } from '@/store/AppContext';
import { ApiError } from '@/services/api';
import { Loader2, Plus } from 'lucide-react';

interface AddFlightModalProps {
  open: boolean;
  onClose: () => void;
  onAdded: () => void;
}

interface FieldErrors {
  title?: string;
  provider?: string;
  confirmation?: string;
  originCode?: string;
  destinationCode?: string;
  scheduledStart?: string;
  scheduledEnd?: string;
  cost?: string;
}

const AIRPORT_CODE_RE = /^[A-Za-z]{3}$/;

export function AddFlightModal({ open, onClose, onAdded }: AddFlightModalProps) {
  const { addFlightNode } = useApp();
  const [title, setTitle] = useState('');
  const [provider, setProvider] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [originCode, setOriginCode] = useState('');
  const [destinationCode, setDestinationCode] = useState('');
  const [scheduledStart, setScheduledStart] = useState('');
  const [scheduledEnd, setScheduledEnd] = useState('');
  const [cost, setCost] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setTitle('');
    setProvider('');
    setConfirmation('');
    setOriginCode('');
    setDestinationCode('');
    setScheduledStart('');
    setScheduledEnd('');
    setCost('');
    setFieldErrors({});
    setSubmitError(null);
    setSubmitting(false);
  };

  const handleClose = () => {
    if (submitting) return; // prevent closing mid-submit and losing the in-flight request's outcome
    resetForm();
    onClose();
  };

  const validate = (): FieldErrors => {
    const errors: FieldErrors = {};
    if (!title.trim()) errors.title = 'Flight title is required.';
    if (!provider.trim()) errors.provider = 'Airline/provider is required.';
    if (!confirmation.trim()) errors.confirmation = 'Booking reference is required.';
    if (!originCode.trim()) errors.originCode = 'Origin airport code is required.';
    else if (!AIRPORT_CODE_RE.test(originCode.trim())) errors.originCode = 'Must be a 3-letter airport code (e.g. DEL).';
    if (!destinationCode.trim()) errors.destinationCode = 'Destination airport code is required.';
    else if (!AIRPORT_CODE_RE.test(destinationCode.trim())) errors.destinationCode = 'Must be a 3-letter airport code (e.g. BOM).';
    if (!scheduledStart) errors.scheduledStart = 'Departure time is required.';
    if (!scheduledEnd) errors.scheduledEnd = 'Arrival time is required.';
    if (scheduledStart && scheduledEnd && scheduledEnd < scheduledStart) {
      errors.scheduledEnd = 'Arrival cannot be before departure.';
    }
    if (cost.trim() === '') errors.cost = 'Cost is required.';
    else if (Number.isNaN(Number(cost)) || Number(cost) < 0) errors.cost = 'Cost must be a non-negative number.';
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return; // prevent duplicate submissions (e.g. a double click or double Enter)

    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      await addFlightNode({
        category: 'flight',
        title: title.trim(),
        provider: provider.trim(),
        confirmation: confirmation.trim(),
        originCode: originCode.trim().toUpperCase(),
        destinationCode: destinationCode.trim().toUpperCase(),
        scheduledStart,
        scheduledEnd,
        cost: Number(cost),
      });
      resetForm();
      onAdded();
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : 'Could not add the flight. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title="Add Flight" subtitle="Add a flight to this trip's itinerary." className="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-3" noValidate>
        <Field label="Flight title" htmlFor="flight-title" error={fieldErrors.title}>
          <input
            id="flight-title"
            type="text"
            placeholder="e.g. Delhi to Mumbai"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClass(!!fieldErrors.title)}
            disabled={submitting}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Airline / provider" htmlFor="flight-provider" error={fieldErrors.provider}>
            <input
              id="flight-provider"
              type="text"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className={inputClass(!!fieldErrors.provider)}
              disabled={submitting}
            />
          </Field>
          <Field label="Booking reference" htmlFor="flight-confirmation" error={fieldErrors.confirmation}>
            <input
              id="flight-confirmation"
              type="text"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              className={inputClass(!!fieldErrors.confirmation)}
              disabled={submitting}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Origin airport code" htmlFor="flight-origin" error={fieldErrors.originCode}>
            <input
              id="flight-origin"
              type="text"
              placeholder="DEL"
              maxLength={3}
              value={originCode}
              onChange={(e) => setOriginCode(e.target.value)}
              className={inputClass(!!fieldErrors.originCode)}
              disabled={submitting}
            />
          </Field>
          <Field label="Destination airport code" htmlFor="flight-destination" error={fieldErrors.destinationCode}>
            <input
              id="flight-destination"
              type="text"
              placeholder="BOM"
              maxLength={3}
              value={destinationCode}
              onChange={(e) => setDestinationCode(e.target.value)}
              className={inputClass(!!fieldErrors.destinationCode)}
              disabled={submitting}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Scheduled departure" htmlFor="flight-start" error={fieldErrors.scheduledStart}>
            <input
              id="flight-start"
              type="datetime-local"
              value={scheduledStart}
              onChange={(e) => setScheduledStart(e.target.value)}
              className={inputClass(!!fieldErrors.scheduledStart)}
              disabled={submitting}
            />
          </Field>
          <Field label="Scheduled arrival" htmlFor="flight-end" error={fieldErrors.scheduledEnd}>
            <input
              id="flight-end"
              type="datetime-local"
              value={scheduledEnd}
              onChange={(e) => setScheduledEnd(e.target.value)}
              className={inputClass(!!fieldErrors.scheduledEnd)}
              disabled={submitting}
            />
          </Field>
        </div>

        <Field label="Cost (₹)" htmlFor="flight-cost" error={fieldErrors.cost}>
          <input
            id="flight-cost"
            type="number"
            min={0}
            step="0.01"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            className={inputClass(!!fieldErrors.cost)}
            disabled={submitting}
          />
        </Field>

        {submitError && (
          <p role="alert" className="text-xs text-red-600">
            {submitError}
          </p>
        )}

        <div className="flex items-center justify-between pt-1">
          <button type="button" onClick={handleClose} disabled={submitting} className="rounded-lg px-4 py-2 text-sm text-ink-400 transition hover:text-ink-100 disabled:opacity-50">
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-accent-500 to-electric-600 px-4 py-2 text-sm font-medium text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            {submitting ? 'Adding...' : 'Add Flight'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function inputClass(hasError: boolean) {
  return `w-full rounded-lg border bg-ink-800 px-3 py-2 text-sm text-ink-100 focus:outline-none ${
    hasError ? 'border-red-500/50 focus:border-red-500' : 'border-ink-600 focus:border-accent-500/50'
  }`;
}

function Field({ label, htmlFor, error, children }: { label: string; htmlFor: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1 block text-[10px] text-ink-500">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} className="mt-1 text-[11px] text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
