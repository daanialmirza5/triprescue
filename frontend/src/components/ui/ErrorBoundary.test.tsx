import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ErrorBoundary } from './ErrorBoundary';

const FaultyComponent: React.FC<{ shouldThrow?: boolean }> = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test component crashed');
  }
  return <div>Component loaded successfully</div>;
};

describe('ErrorBoundary', () => {
  it('renders children when there are no errors', () => {
    render(
      <ErrorBoundary>
        <FaultyComponent shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Component loaded successfully')).toBeInTheDocument();
  });

  it('renders fallback UI when child component throws', () => {
    // Suppress console.error in test output for intentional throw
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary fallbackTitle="Custom Error Title">
        <FaultyComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom Error Title')).toBeInTheDocument();
    expect(screen.getByText('Test component crashed')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();

    spy.mockRestore();
  });

  it('calls onReset handler when retry button is clicked', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const onReset = vi.fn();

    render(
      <ErrorBoundary onReset={onReset}>
        <FaultyComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button', { name: /try again/i }));
    expect(onReset).toHaveBeenCalledTimes(1);

    spy.mockRestore();
  });
});
