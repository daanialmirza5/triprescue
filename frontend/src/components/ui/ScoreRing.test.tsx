import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScoreRing } from './ScoreRing';

describe('ScoreRing', () => {
  it('renders the numeric score', () => {
    render(<ScoreRing score={87} />);
    expect(screen.getByText('87')).toBeInTheDocument();
  });

  it('renders an optional label under the score', () => {
    render(<ScoreRing score={50} label="Health" />);
    expect(screen.getByText('Health')).toBeInTheDocument();
  });

  it('picks the green stroke color for a high score', () => {
    const { container } = render(<ScoreRing score={90} />);
    const progressCircle = container.querySelectorAll('circle')[1];
    expect(progressCircle.getAttribute('stroke')).toBe('#34d399');
  });

  it('picks the amber stroke color for a mid-range score', () => {
    const { container } = render(<ScoreRing score={60} />);
    const progressCircle = container.querySelectorAll('circle')[1];
    expect(progressCircle.getAttribute('stroke')).toBe('#f59e0b');
  });

  it('picks the red stroke color for a low score', () => {
    const { container } = render(<ScoreRing score={20} />);
    const progressCircle = container.querySelectorAll('circle')[1];
    expect(progressCircle.getAttribute('stroke')).toBe('#ef4444');
  });

  it('lets an explicit color override the automatic one', () => {
    const { container } = render(<ScoreRing score={90} color="#123456" />);
    const progressCircle = container.querySelectorAll('circle')[1];
    expect(progressCircle.getAttribute('stroke')).toBe('#123456');
  });
});
