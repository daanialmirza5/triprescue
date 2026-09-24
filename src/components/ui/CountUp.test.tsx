import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CountUp } from './CountUp';

describe('CountUp Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders initial state with prefix and suffix', () => {
    render(<CountUp value={1000} prefix="$" suffix=" USD" />);
    expect(screen.getByText(/\$0 USD/)).toBeInTheDocument();
  });

  it('renders tabular numbers and respects custom className', () => {
    const { container } = render(<CountUp value={500} className="font-semibold text-accent-500" />);
    const span = container.querySelector('span');
    expect(span).toHaveClass('tabular-nums');
    expect(span).toHaveClass('font-semibold');
    expect(span).toHaveClass('text-accent-500');
  });
});
