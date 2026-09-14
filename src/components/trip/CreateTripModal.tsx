import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { useApp } from '@/store/AppContext';
import { ApiError } from '@/services/api';
import { Loader2, Plus } from 'lucide-react';

interface CreateTripModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

interface FieldErrors {
  name?: string;
  origin?: string;
  destination?: string;
  startDate?: string;
  endDate?: string;
}

export function CreateTripModal({ open, onClose, onCreated }: CreateTripModalProps) {
  const { createTrip } = useApp();
  const [name, setName] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setName('');
    setOrigin('');
    setDestination('');
    setStartDate('');
    setEndDate('');
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
    if (!name.trim()) errors.name = 'Trip name is required.';
    if (!origin.trim()) errors.origin = 'Origin is required.';
    if (!destination.trim()) errors.destination = 'Destination is required.';
    if (!startDate) errors.startDate = 'Start date is required.';
    if (!endDate) errors.endDate = 'End date is required.';
    if (startDate && endDate && endDate < startDate) {
      errors.endDate = 'End date cannot be before start date.';
    }
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
      await createTrip({ name: name.trim(), origin: origin.trim(), destination: destination.trim(), startDate, endDate });
      resetForm();
      onCreated();
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : 'Could not create the trip. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title="Create Trip" subtitle="Start tracking a new itinerary." className="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-3" noValidate>
        <Field label="Trip name" htmlFor="trip-name" error={fieldErrors.name}>
          <input
            id="trip-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass(!!fieldErrors.name)}
            disabled={submitting}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Origin" htmlFor="trip-origin" error={fieldErrors.origin}>
            <input
              id="trip-origin"
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className={inputClass(!!fieldErrors.origin)}
              disabled={submitting}
            />
          </Field>
          <Field label="Destination" htmlFor="trip-destination" error={fieldErrors.destination}>
            <input
              id="trip-destination"
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className={inputClass(!!fieldErrors.destination)}
              disabled={submitting}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Start date" htmlFor="trip-start-date" error={fieldErrors.startDate}>
            <input
              id="trip-start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={inputClass(!!fieldErrors.startDate)}
              disabled={submitting}
            />
          </Field>
          <Field label="End date" htmlFor="trip-end-date" error={fieldErrors.endDate}>
            <input
              id="trip-end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={inputClass(!!fieldErrors.endDate)}
              disabled={submitting}
            />
          </Field>
        </div>

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
            {submitting ? 'Creating...' : 'Create Trip'}
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
