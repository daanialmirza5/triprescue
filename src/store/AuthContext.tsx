import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import * as api from '@/services/api';
import { ApiError } from '@/services/api';
import { clearStoredToken, getStoredToken, setStoredToken } from '@/lib/authStorage';

export type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated';

interface AuthState {
  status: AuthStatus;
  profile: api.TravelerProfile | null;
  busy: boolean;
  error: string | null;
  wakingServer: boolean;
}

interface AuthContextValue extends AuthState {
  loginWithPassword: (email: string, password: string) => Promise<void>;
  registerAccount: (name: string, email: string, password: string) => Promise<void>;
  continueAsDemo: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    status: 'checking',
    profile: null,
    busy: false,
    error: null,
    wakingServer: false,
  });

  const loadProfile = useCallback(async () => {
    const profile = await api.getMe();
    setState({ status: 'authenticated', profile, busy: false, error: null, wakingServer: false });
  }, []);

  useEffect(() => {
    if (!getStoredToken()) {
      setState((s) => ({ ...s, status: 'unauthenticated' }));
      return;
    }
    loadProfile().catch(() => {
      // Stored token is stale/invalid (e.g. server restarted with a new auth
      // secret) - fall back to the login screen rather than looping forever.
      clearStoredToken();
      setState({ status: 'unauthenticated', profile: null, busy: false, error: null, wakingServer: false });
    });
  }, [loadProfile]);

  const withAuthResponse = useCallback(async (call: () => Promise<api.AuthResponse>) => {
    setState((s) => ({ ...s, busy: true, error: null, wakingServer: false }));
    // The backend can be cold (Render free-tier spin-down) the first time
    // someone hits it; api.ts retries automatically, this just reflects that
    // retry in the UI so the user sees "waking up" instead of a stuck spinner.
    api.onColdStartRetry(() => setState((s) => ({ ...s, wakingServer: true })));
    try {
      const auth = await call();
      setStoredToken(auth.token);
      await loadProfile();
    } catch (err) {
      setState((s) => ({
        ...s,
        busy: false,
        wakingServer: false,
        error: err instanceof ApiError ? err.message : 'Something went wrong. Please try again.',
      }));
      throw err;
    } finally {
      api.onColdStartRetry(null);
    }
  }, [loadProfile]);

  const loginWithPassword = useCallback(
    (email: string, password: string) => withAuthResponse(() => api.login(email, password)),
    [withAuthResponse]
  );

  const registerAccount = useCallback(
    (name: string, email: string, password: string) => withAuthResponse(() => api.register(name, email, password)),
    [withAuthResponse]
  );

  const continueAsDemo = useCallback(() => withAuthResponse(() => api.getDemoAccount()), [withAuthResponse]);

  const logout = useCallback(() => {
    clearStoredToken();
    setState({ status: 'unauthenticated', profile: null, busy: false, error: null, wakingServer: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, loginWithPassword, registerAccount, continueAsDemo, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
