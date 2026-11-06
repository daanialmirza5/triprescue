import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LoadingSpinner } from './LoadingSpinner';
import { Skeleton } from './Skeleton';

describe('LoadingSpinner', () => {
  it('renders default loading spinner with role status', () => {
    render(<LoadingSpinner />);
    const status = screen.getByRole('status');
    expect(status).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders custom label when provided', () => {
    render(<LoadingSpinner label="Fetching live trip status..." />);
    expect(screen.getByText('Fetching live trip status...')).toBeInTheDocument();
  });
});

describe('Skeleton', () => {
  it('renders with custom class and aria-hidden', () => {
    const { container } = render(<Skeleton className="w-48 h-8 rounded" />);
    const skeletonElement = container.firstChild as HTMLElement;
    expect(skeletonElement).toHaveClass('animate-pulse');
    expect(skeletonElement).toHaveClass('w-48');
    expect(skeletonElement).toHaveAttribute('aria-hidden', 'true');
  });
});
