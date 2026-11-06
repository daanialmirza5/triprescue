import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { BackendPipeline } from './BackendPipeline';
import { stageStates } from '@/lib/pipeline';
import type { PipelineEvent } from '@/services/api';

const ev = (e: Partial<PipelineEvent>) => ({ type: 'stage', runId: 'r', seq: 0, timestamp: '', elapsedMs: 0, status: 'completed', ...e }) as PipelineEvent;

describe('BackendPipeline', () => {
  it('lights up only the stages that ran', () => {
    const stages = stageStates([
      ev({ stage: 'api', function: 'POST /api/trips/x/disruptions' }),
      ev({ stage: 'impact_engine', status: 'running', spanId: 's1', function: 'PropagationEngine.propagate' }),
      ev({ stage: 'provider', status: 'failed', function: 'MockFlightProvider.get_alternatives' }),
    ]);
    render(<BackendPipeline stages={stages} simulated={false} selected={null} onSelect={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'API: Completed' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Impact engine: Running' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Providers: Failed' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Recovery engine: Idle' })).toBeInTheDocument();
  });

  it('opens a stage for details', () => {
    const onSelect = vi.fn();
    render(<BackendPipeline stages={stageStates([])} simulated={false} selected={null} onSelect={onSelect} />);
    fireEvent.click(screen.getByRole('button', { name: 'Dependency graph: Idle' }));
    expect(onSelect).toHaveBeenCalledWith('dependency_graph');
  });
});
