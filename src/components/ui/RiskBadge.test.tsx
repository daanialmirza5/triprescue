import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RiskBadge } from './RiskBadge';

describe('RiskBadge', () => {
  it('renders the level in uppercase with the word RISK', () => {
    render(<RiskBadge level="high" />);
    expect(screen.getByText('HIGH RISK')).toBeInTheDocument();
  });

  it('renders the percent when provided', () => {
    render(<RiskBadge level="medium" percent={42} />);
    expect(screen.getByText('42%')).toBeInTheDocument();
    expect(screen.getByText('MEDIUM RISK')).toBeInTheDocument();
  });

  it('omits the percent element when not provided', () => {
    render(<RiskBadge level="low" />);
    expect(screen.queryByText('%', { exact: false })).not.toBeInTheDocument();
  });
});
