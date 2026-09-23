import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Sidebar } from './Sidebar';
import * as AuthContextModule from '@/store/AuthContext';

vi.mock('@/store/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('Sidebar Component', () => {
  const mockLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(AuthContextModule.useAuth).mockReturnValue({
      profile: {
        name: 'Aarav Sharma',
        email: 'aarav@example.com',
        loyaltyTier: 'Platinum',
        travelerId: 't-1',
        homeAirport: 'DEL',
      },
      logout: mockLogout,
    } as any);
  });

  it('renders navigation items and active state correctly', () => {
    render(
      <Sidebar
        current="overview"
        onNavigate={() => {}}
        collapsed={false}
        onToggleCollapse={() => {}}
      />
    );

    expect(screen.getByText('TripRescue')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Overview' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'My Trips' })).not.toHaveAttribute('aria-current');
    expect(screen.getByText('Aarav Sharma')).toBeInTheDocument();
    expect(screen.getByText('Platinum Traveler')).toBeInTheDocument();
  });

  it('invokes onNavigate callback when clicking nav buttons', () => {
    const handleNavigate = vi.fn();
    render(
      <Sidebar
        current="overview"
        onNavigate={handleNavigate}
        collapsed={false}
        onToggleCollapse={() => {}}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Live Monitor' }));
    expect(handleNavigate).toHaveBeenCalledWith('monitor');

    fireEvent.click(screen.getByRole('button', { name: 'Recovery Center' }));
    expect(handleNavigate).toHaveBeenCalledWith('recovery');
  });

  it('calls onToggleCollapse when collapse toggle is clicked', () => {
    const handleToggle = vi.fn();
    render(
      <Sidebar
        current="overview"
        onNavigate={() => {}}
        collapsed={false}
        onToggleCollapse={handleToggle}
      />
    );

    const toggleBtn = screen.getByLabelText('Collapse sidebar');
    fireEvent.click(toggleBtn);
    expect(handleToggle).toHaveBeenCalledTimes(1);
  });

  it('calls logout when logout button is clicked', () => {
    render(
      <Sidebar
        current="overview"
        onNavigate={() => {}}
        collapsed={false}
        onToggleCollapse={() => {}}
      />
    );

    const logoutBtn = screen.getByLabelText('Log out');
    fireEvent.click(logoutBtn);
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
