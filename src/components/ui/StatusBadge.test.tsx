import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBadge } from './StatusBadge';

describe('StatusBadge', () => {
  it('renders the human-readable label for each status', () => {
    render(<StatusBadge status="at-risk" />);
    expect(screen.getByText('At Risk')).toBeInTheDocument();
  });

  it('renders a broken booking with the pulsing indicator dot', () => {
    const { container } = render(<StatusBadge status="broken" />);
    expect(screen.getByText('Broken')).toBeInTheDocument();
    expect(container.querySelector('.animate-pulse-soft')).not.toBeNull();
  });

  it('does not pulse for a healthy status', () => {
    const { container } = render(<StatusBadge status="healthy" />);
    expect(container.querySelector('.animate-pulse-soft')).toBeNull();
  });
});
