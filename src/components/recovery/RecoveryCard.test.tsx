import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RecoveryCard } from './RecoveryCard';
import type { RecoveryOption } from '@/types';

const mockOption: RecoveryOption = {
  id: 'plan-1',
  name: 'Next-Flight Direct Rebooking',
  tag: 'FASTEST',
  tagColor: 'cyan',
  description: 'Rebooks on AI-447 departing at 09:30 AM with zero hotel disruption.',
  score: 94,
  costDelta: 3500,
  timeImpactMinutes: 90,
  bookingsPreserved: 4,
  totalBookings: 4,
  residualRisk: 'low',
  refundRecovered: 1200,
  changes: [],
  scoreBreakdown: {
    cost: 88,
    speed: 95,
    preservation: 100,
    comfort: 90,
  },
};

describe('RecoveryCard Component', () => {
  it('renders option info, score, and RECOMMENDED badge for rank 0', () => {
    render(
      <RecoveryCard
        option={mockOption}
        rank={0}
        selected={false}
        onSelect={() => {}}
        onApply={() => {}}
        onDetails={() => {}}
      />
    );

    expect(screen.getByText('RECOMMENDED')).toBeInTheDocument();
    expect(screen.getByText('Next-Flight Direct Rebooking')).toBeInTheDocument();
    expect(screen.getByText('FASTEST')).toBeInTheDocument();
    expect(screen.getByText('94')).toBeInTheDocument();
    expect(screen.getByText('4/4')).toBeInTheDocument();
  });

  it('renders score breakdown when selected is true', () => {
    render(
      <RecoveryCard
        option={mockOption}
        rank={1}
        selected={true}
        onSelect={() => {}}
        onApply={() => {}}
        onDetails={() => {}}
      />
    );

    expect(screen.queryByText('RECOMMENDED')).not.toBeInTheDocument();
    expect(screen.getByText('Cost efficiency')).toBeInTheDocument();
    expect(screen.getByText('Speed')).toBeInTheDocument();
    expect(screen.getByText('Preservation')).toBeInTheDocument();
  });

  it('triggers onSelect, onApply, and onDetails callbacks', () => {
    const handleSelect = vi.fn();
    const handleApply = vi.fn();
    const handleDetails = vi.fn();

    render(
      <RecoveryCard
        option={mockOption}
        rank={0}
        selected={false}
        onSelect={handleSelect}
        onApply={handleApply}
        onDetails={handleDetails}
      />
    );

    fireEvent.click(screen.getByText('Next-Flight Direct Rebooking'));
    expect(handleSelect).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: /Apply Recovery/i }));
    expect(handleApply).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: /Details/i }));
    expect(handleDetails).toHaveBeenCalledTimes(1);
  });
});
