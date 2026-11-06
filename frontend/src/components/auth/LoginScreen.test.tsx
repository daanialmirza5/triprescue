import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { LoginScreen } from './LoginScreen';
import { AuthProvider } from '@/store/AuthContext';
import { ToastProvider } from '@/components/ui/ToastProvider';

const renderLogin = () => render(<AuthProvider><ToastProvider><LoginScreen /></ToastProvider></AuthProvider>);

afterEach(() => vi.unstubAllGlobals());

describe('LoginScreen demo traveler', () => {
  it('explains production mode when the backend has no seeded demo account', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ detail: 'Demo account not seeded yet' }), { status: 404, headers: { 'Content-Type': 'application/json' } })));
    renderLogin();
    fireEvent.click(await screen.findByRole('button', { name: /Continue as Demo Traveler/ }));

    expect(await screen.findByText('Production mode active')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('The demo traveler is not available on this server. Please create a new account or sign in.');
    expect(screen.queryByText(/not seeded/)).not.toBeInTheDocument();
  });
});

describe('LoginScreen password strength', () => {
  it('keeps Create Account disabled until the password meets every rule', async () => {
    const fetchMock = vi.fn(async () => new Response('{}', { status: 500 }));
    vi.stubGlobal('fetch', fetchMock);
    renderLogin();
    fireEvent.click(await screen.findByRole('button', { name: 'Create Account' }));

    const submit = () => screen.getAllByRole('button', { name: 'Create Account' }).find((b) => b.getAttribute('type') === 'submit')!;
    const password = screen.getByLabelText('Password');
    const rules = screen.getByRole('list', { name: 'Password requirements' });

    fireEvent.change(password, { target: { value: 'password' } });
    expect(submit()).toBeDisabled();
    expect(password).toHaveAttribute('aria-invalid', 'true');
    expect(rules).toHaveTextContent('At least 8 characters (met)');
    expect(rules).toHaveTextContent('An uppercase letter (missing)');
    expect(rules).toHaveTextContent('A symbol (e.g. ! @ # $) (missing)');

    fireEvent.change(password, { target: { value: 'Str0ng!Pass' } });
    expect(submit()).toBeEnabled();
    expect(password).not.toHaveAttribute('aria-invalid');
    expect(rules).not.toHaveTextContent('(missing)');
  });

  it('does not apply the strength rules to logging in', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('{}', { status: 500 })));
    renderLogin();
    await screen.findAllByRole('button', { name: 'Log In' });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'x' } });
    expect(screen.queryByRole('list', { name: 'Password requirements' })).toBeNull();
    const submit = screen.getAllByRole('button', { name: 'Log In' }).find((b) => b.getAttribute('type') === 'submit')!;
    expect(submit).toBeEnabled();
  });
});
