import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScoreBar } from './ScoreBar';

describe('ScoreBar Component', () => {
  it('renders label and numerical value correctly', () => {
    render(<ScoreBar label="Confidence Score" value={85} />);
    expect(screen.getByText('Confidence Score')).toBeInTheDocument();
    expect(screen.getByText('85')).toBeInTheDocument();
  });

  it('calculates width percentage based on max value and clamps to 100%', () => {
    const { container } = render(<ScoreBar label="Overfill Metric" value={150} max={100} />);
    const bar = container.querySelector('.transition-all');
    expect(bar).toHaveStyle({ width: '100%' });
  });

  it('applies chosen color style variant', () => {
    const { container } = render(<ScoreBar label="Warning Metric" value={40} color="amber" />);
    const bar = container.querySelector('.transition-all');
    expect(bar).toHaveClass('bg-amber-400');
  });
});
