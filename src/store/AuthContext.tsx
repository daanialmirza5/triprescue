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
  });

  const loadProfile = useCallback(async () => {
    const profile = await api.getMe();
    setState({ status: 'authenticated', profile, busy: false, error: null });
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
      setState({ status: 'unauthenticated', profile: null, busy: false, error: null });
    });
  }, [loadProfile]);

  const withAuthResponse = useCallback(async (call: () => Promise<api.AuthResponse>) => {
    setState((s) => ({ ...s, busy: true, error: null }));
    try {
      const auth = await call();
      setStoredToken(auth.token);
      await loadProfile();
    } catch (err) {
      setState((s) => ({
        ...s,
        busy: false,
        error: err instanceof ApiError ? err.message : 'Something went wrong. Please try again.',
      }));
      throw err;
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
    setState({ status: 'unauthenticated', profile: null, busy: false, error: null });
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
