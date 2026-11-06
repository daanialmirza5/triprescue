import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SourceBadge } from './SourceBadge';

describe('SourceBadge', () => {
  it('labels live provider data with its source and age', () => {
    const updated = new Date(Date.now() - 42_000).toISOString();
    render(<SourceBadge source="aviationstack" live updatedAt={updated} />);
    expect(screen.getByText(/LIVE · Aviationstack/)).toBeInTheDocument();
    expect(screen.getByText(/Updated 4\d sec ago/)).toBeInTheDocument();
  });

  it('never presents simulated data as live', () => {
    render(<SourceBadge source="aviationstack" simulation />);
    expect(screen.getByText(/SIMULATION/)).toBeInTheDocument();
    expect(screen.queryByText(/LIVE/)).not.toBeInTheDocument();
  });

  it('shows discovery sources without a live marker', () => {
    render(<SourceBadge source="openstreetmap" />);
    expect(screen.getByText('OpenStreetMap')).toBeInTheDocument();
    expect(screen.queryByText(/LIVE/)).not.toBeInTheDocument();
  });
});
