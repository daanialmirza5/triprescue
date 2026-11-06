import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LandingPage } from './LandingPage';
import { LOOP_SECONDS, sampleTimeline } from './hero/timeline';

describe('hero timeline', () => {
  it('tells the disruption story in order', () => {
    expect(sampleTimeline(1)).toMatchObject({ phase: 'departed', flightStatus: 'on-track', stops: { delhi: 'on-track', agra: 'on-track' } });
    expect(sampleTimeline(4)).toMatchObject({ phase: 'delayed', flightStatus: 'delayed', railStatus: 'at-risk', stops: { delhi: 'delayed', agra: 'at-risk' } });
    expect(sampleTimeline(8)).toMatchObject({ phase: 'recovering', railStatus: 'recovered', stops: { agra: 'recovered' } });
    expect(sampleTimeline(16)).toMatchObject({ phase: 'arrived', stops: { agra: 'on-track' } });
  });

  it('moves the plane before the train and loops', () => {
    expect(sampleTimeline(2).flight).toBeGreaterThan(0);
    expect(sampleTimeline(2).train).toBe(0);
    expect(sampleTimeline(9).flight).toBeCloseTo(1, 2);
    expect(sampleTimeline(12).train).toBeGreaterThan(0);
    expect(sampleTimeline(LOOP_SECONDS + 1)).toEqual(sampleTimeline(1));
  });
});

describe('LandingPage', () => {
  it('renders the hero with a static fallback when WebGL is unavailable', () => {
    render(<LandingPage onGetStarted={() => {}} onWatchDemo={() => {}} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Same Destinations.Fewer Disruptions.');
    expect(screen.getByTestId('hero-fallback')).toBeInTheDocument();
  });

  it('wires the primary and secondary calls to action', async () => {
    const onGetStarted = vi.fn();
    const onWatchDemo = vi.fn();
    render(<LandingPage onGetStarted={onGetStarted} onWatchDemo={onWatchDemo} />);
    await userEvent.click(screen.getAllByRole('button', { name: /get started/i })[0]);
    await userEvent.click(screen.getAllByRole('button', { name: /watch demo/i })[0]);
    expect(onGetStarted).toHaveBeenCalledTimes(1);
    expect(onWatchDemo).toHaveBeenCalledTimes(1);
  });

  it('scrolls to sections from the navigation', async () => {
    const scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoView;
    render(<LandingPage onGetStarted={() => {}} onWatchDemo={() => {}} />);
    await userEvent.click(screen.getAllByRole('button', { name: 'How It Works' })[0]);
    expect(scrollIntoView).toHaveBeenCalled();
    expect(document.getElementById('how-it-works')).toBeInTheDocument();
    expect(document.getElementById('faqs')).toBeInTheDocument();
  });

  it('switches the highlighted travel mode', async () => {
    render(<LandingPage onGetStarted={() => {}} onWatchDemo={() => {}} />);
    await userEvent.click(screen.getByRole('tab', { name: /trains/i }));
    expect(screen.getByRole('tab', { name: /trains/i })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText(/Rail connections re-checked/)).toBeInTheDocument();
  });
});
