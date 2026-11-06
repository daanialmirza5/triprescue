import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { JourneyLayer } from './JourneyLayer';
import type { PipelineEvent } from '@/services/api';
import type { ItineraryNodeData } from '@/types';

const node = (id: string, title: string, category: string, start: string) =>
  ({ id, title, category, scheduledStart: start, status: 'healthy' }) as unknown as ItineraryNodeData;
const nodes = [
  node('t', 'Airport Transfer', 'transfer', '2025-09-12T11:50:00'),
  node('f', 'Mumbai → Delhi', 'flight', '2025-09-12T06:30:00'),
];
const ev = (e: Partial<PipelineEvent>) => ({ type: 'node', runId: 'r', seq: 0, timestamp: '', elapsedMs: 0, stage: 'dependency_graph', ...e }) as PipelineEvent;

describe('JourneyLayer', () => {
  it('shows the traveller and bookings in time order', () => {
    render(<JourneyLayer nodes={nodes} events={{}} simulated={false} selectedId={null} onSelect={vi.fn()} />);
    expect(screen.getByText('Demo Traveller')).toBeInTheDocument();
    const labels = screen.getAllByRole('button').map((b) => b.getAttribute('aria-label'));
    expect(labels).toEqual(['Mumbai → Delhi: On track', 'Airport Transfer: On track']);
  });

  it('takes statuses from the engine events and reports clicks', () => {
    const onSelect = vi.fn();
    const events = {
      f: ev({ nodeId: 'f', status: 'delayed', relation: 'disrupted', delayMinutes: 120 }),
      t: ev({ nodeId: 't', status: 'broken', relation: 'affected' }),
    };
    render(<JourneyLayer nodes={nodes} events={events} simulated={false} selectedId={null} onSelect={onSelect} />);
    expect(screen.getByRole('button', { name: 'Mumbai → Delhi: DELAYED' })).toHaveTextContent('+120m');
    fireEvent.click(screen.getByRole('button', { name: 'Airport Transfer: AFFECTED' }));
    expect(onSelect).toHaveBeenCalledWith('t');
  });
});
