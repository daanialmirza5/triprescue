import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { useApp } from '@/store/AppContext';
import { ApiError } from '@/services/api';
import { Building2, Loader2 } from 'lucide-react';

interface AddAccommodationModalProps {
  open: boolean;
  onClose: () => void;
  onAdded: () => void;
}

interface FieldErrors {
  title?: string;
  provider?: string;
  confirmation?: string;
  location?: string;
  scheduledStart?: string;
  scheduledEnd?: string;
  cost?: string;
}

export function AddAccommodationModal({ open, onClose, onAdded }: AddAccommodationModalProps) {
  const { addNode } = useApp();
  const [title, setTitle] = useState('');
  const [provider, setProvider] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [location, setLocation] = useState('');
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
    setLocation('');
    setScheduledStart('');
    setScheduledEnd('');
    setCost('');
    setFieldErrors({});
    setSubmitError(null);
    setSubmitting(false);
  };

  const handleClose = () => {
    if (submitting) return;
    resetForm();
    onClose();
  };

  const validate = (): FieldErrors => {
    const errors: FieldErrors = {};
    if (!title.trim()) errors.title = 'Hotel/stay name is required';
    if (!provider.trim()) errors.provider = 'Provider or booking platform is required';
    if (!confirmation.trim()) errors.confirmation = 'Confirmation code is required';
    if (!location.trim()) errors.location = 'Location or address is required';

    if (!scheduledStart) {
      errors.scheduledStart = 'Check-in time is required';
    }
    if (!scheduledEnd) {
      errors.scheduledEnd = 'Check-out time is required';
    }
    if (scheduledStart && scheduledEnd) {
      const start = new Date(scheduledStart).getTime();
      const end = new Date(scheduledEnd).getTime();
      if (isNaN(start)) errors.scheduledStart = 'Invalid check-in date/time';
      if (isNaN(end)) errors.scheduledEnd = 'Invalid check-out date/time';
      if (!isNaN(start) && !isNaN(end) && end <= start) {
        errors.scheduledEnd = 'Check-out must be after check-in';
      }
    }

    if (cost === '') {
      errors.cost = 'Total cost is required';
    } else {
      const parsedCost = Number(cost);
      if (isNaN(parsedCost) || parsedCost < 0) {
        errors.cost = 'Cost must be a positive number';
      }
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    try {
      await addNode({
        category: 'hotel',
        title: title.trim(),
        provider: provider.trim(),
        confirmation: confirmation.trim().toUpperCase(),
        location: location.trim(),
        scheduledStart,
        scheduledEnd,
        cost: Number(cost),
      });
      resetForm();
      onAdded();
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setSubmitError(err.message);
      } else if (err instanceof Error) {
        setSubmitError(err.message);
      } else {
        setSubmitError('Failed to add hotel stay. Please check your connection.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title="Add Hotel Stay to Itinerary">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {submitError && (
          <div
            role="alert"
            className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300"
          >
            {submitError}
          </div>
        )}

        <div>
          <label htmlFor="hotel-title" className="block text-xs font-medium text-ink-300">
            Hotel / Property Name <span className="text-red-400">*</span>
          </label>
          <input
            id="hotel-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Grand Ladakh Mountain Resort"
            disabled={submitting}
            className="mt-1 w-full rounded-lg border border-ink-700 bg-ink-800/80 px-3 py-2 text-sm text-ink-100 placeholder-ink-500 focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500 disabled:opacity-50"
          />
          {fieldErrors.title && (
            <p className="mt-1 text-xs text-red-400">{fieldErrors.title}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="hotel-provider" className="block text-xs font-medium text-ink-300">
              Provider / Chain <span className="text-red-400">*</span>
            </label>
            <input
              id="hotel-provider"
              type="text"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              placeholder="e.g. Marriott / Booking.com"
              disabled={submitting}
              className="mt-1 w-full rounded-lg border border-ink-700 bg-ink-800/80 px-3 py-2 text-sm text-ink-100 placeholder-ink-500 focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500 disabled:opacity-50"
            />
            {fieldErrors.provider && (
              <p className="mt-1 text-xs text-red-400">{fieldErrors.provider}</p>
            )}
          </div>

          <div>
            <label htmlFor="hotel-confirmation" className="block text-xs font-medium text-ink-300">
              Confirmation Code <span className="text-red-400">*</span>
            </label>
            <input
              id="hotel-confirmation"
              type="text"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              placeholder="e.g. HTL-89421"
              disabled={submitting}
              className="mt-1 w-full rounded-lg border border-ink-700 bg-ink-800/80 px-3 py-2 text-sm uppercase text-ink-100 placeholder-ink-500 focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500 disabled:opacity-50"
            />
            {fieldErrors.confirmation && (
              <p className="mt-1 text-xs text-red-400">{fieldErrors.confirmation}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="hotel-location" className="block text-xs font-medium text-ink-300">
            Address / City Location <span className="text-red-400">*</span>
          </label>
          <input
            id="hotel-location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Fort Road, Leh, Ladakh"
            disabled={submitting}
            className="mt-1 w-full rounded-lg border border-ink-700 bg-ink-800/80 px-3 py-2 text-sm text-ink-100 placeholder-ink-500 focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500 disabled:opacity-50"
          />
          {fieldErrors.location && (
            <p className="mt-1 text-xs text-red-400">{fieldErrors.location}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="hotel-checkin" className="block text-xs font-medium text-ink-300">
              Check-in Date & Time <span className="text-red-400">*</span>
            </label>
            <input
              id="hotel-checkin"
              type="datetime-local"
              value={scheduledStart}
              onChange={(e) => setScheduledStart(e.target.value)}
              disabled={submitting}
              className="mt-1 w-full rounded-lg border border-ink-700 bg-ink-800/80 px-3 py-2 text-sm text-ink-100 focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500 disabled:opacity-50"
            />
            {fieldErrors.scheduledStart && (
              <p className="mt-1 text-xs text-red-400">{fieldErrors.scheduledStart}</p>
            )}
          </div>

          <div>
            <label htmlFor="hotel-checkout" className="block text-xs font-medium text-ink-300">
              Check-out Date & Time <span className="text-red-400">*</span>
            </label>
            <input
              id="hotel-checkout"
              type="datetime-local"
              value={scheduledEnd}
              onChange={(e) => setScheduledEnd(e.target.value)}
              disabled={submitting}
              className="mt-1 w-full rounded-lg border border-ink-700 bg-ink-800/80 px-3 py-2 text-sm text-ink-100 focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500 disabled:opacity-50"
            />
            {fieldErrors.scheduledEnd && (
              <p className="mt-1 text-xs text-red-400">{fieldErrors.scheduledEnd}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="hotel-cost" className="block text-xs font-medium text-ink-300">
            Total Cost ($) <span className="text-red-400">*</span>
          </label>
          <input
            id="hotel-cost"
            type="number"
            min="0"
            step="0.01"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            placeholder="e.g. 450"
            disabled={submitting}
            className="mt-1 w-full rounded-lg border border-ink-700 bg-ink-800/80 px-3 py-2 text-sm text-ink-100 placeholder-ink-500 focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500 disabled:opacity-50"
          />
          {fieldErrors.cost && (
            <p className="mt-1 text-xs text-red-400">{fieldErrors.cost}</p>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className="rounded-lg border border-ink-700 px-4 py-2 text-xs font-medium text-ink-300 transition-colors hover:bg-ink-800 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-1.5 rounded-lg bg-accent-500 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-accent-600 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Adding Stay...
              </>
            ) : (
              <>
                <Building2 className="h-3.5 w-3.5" />
                Add Stay
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
