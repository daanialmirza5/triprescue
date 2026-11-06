import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { QuickAddBar } from './QuickAddBar';

describe('QuickAddBar', () => {
  it('offers every kind of item and marks the active one', () => {
    render(<QuickAddBar active="hotels" onSelect={vi.fn()} />);
    for (const label of ['Flight', 'Train', 'Hotel', 'Place', 'Event']) {
      expect(screen.getByRole('tab', { name: new RegExp(label) })).toBeInTheDocument();
    }
    expect(screen.getByRole('tab', { name: /Hotel/ })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: /Flight/ })).toHaveAttribute('aria-selected', 'false');
  });

  it('switches discovery with one tap', () => {
    const onSelect = vi.fn();
    render(<QuickAddBar active="hotels" onSelect={onSelect} />);
    fireEvent.click(screen.getByRole('tab', { name: /Train/ }));
    expect(onSelect).toHaveBeenCalledWith('trains');
  });
});
