import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ToastProvider, useToast } from './ToastProvider';

function TestConsumer() {
  const { addToast } = useToast();
  return (
    <div>
      <button onClick={() => addToast('success', 'Operation Succeeded', 'Details here')}>
        Trigger Success
      </button>
      <button onClick={() => addToast('error', 'Operation Failed', 'Fatal error')}>
        Trigger Error
      </button>
    </div>
  );
}

describe('ToastProvider & useToast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('throws error when useToast is called outside provider', () => {
    expect(() => render(<TestConsumer />)).toThrow('useToast must be used within ToastProvider');
  });

  it('renders and dismisses toast messages via user click', () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Trigger Success'));
    expect(screen.getByText('Operation Succeeded')).toBeInTheDocument();
    expect(screen.getByText('Details here')).toBeInTheDocument();

    const dismissBtn = screen.getByLabelText('Dismiss');
    fireEvent.click(dismissBtn);

    expect(screen.queryByText('Operation Succeeded')).not.toBeInTheDocument();
  });

  it('auto dismisses toast after timeout', () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Trigger Error'));
    expect(screen.getByText('Operation Failed')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(5100);
    });

    expect(screen.queryByText('Operation Failed')).not.toBeInTheDocument();
  });
});
