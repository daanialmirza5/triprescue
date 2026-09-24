import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MetricCard } from './MetricCard';

describe('MetricCard Component', () => {
  it('renders label and static formatted value when animate is false', () => {
    render(
      <MetricCard
        value={12500}
        label="Total Savings"
        prefix="₹"
        suffix=" saved"
        animate={false}
      />
    );

    expect(screen.getByText('Total Savings')).toBeInTheDocument();
    expect(screen.getByText(/₹12,500 saved/)).toBeInTheDocument();
  });

  it('renders with custom accent and icon', () => {
    const { container } = render(
      <MetricCard
        value={98}
        label="Health Score"
        accent="green"
        icon={<span data-testid="metric-icon">Icon</span>}
        animate={false}
      />
    );

    expect(screen.getByTestId('metric-icon')).toBeInTheDocument();
    expect(container.querySelector('.text-emerald-600')).toBeInTheDocument();
  });

  it('applies custom className to wrapper', () => {
    const { container } = render(
      <MetricCard
        value={42}
        label="Active Nodes"
        className="custom-metric-class"
        animate={false}
      />
    );

    expect(container.firstChild).toHaveClass('custom-metric-class');
  });
});
