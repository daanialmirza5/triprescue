import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import * as api from '@/services/api';
import { ApiError } from '@/services/api';
import { clearStoredToken, getStoredToken, setStoredToken } from '@/lib/authStorage';

export type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated';

const DATA_MODE_KEY = 'safarsathi.dataMode';
/** Shown when the backend runs without seeded demo data (SEED_DEMO_DATA off). */
export const DEMO_UNAVAILABLE_MESSAGE = 'The demo traveler is not available on this server. Please create a new account or sign in.';

/** The offline demo was retired, so every session is live. Clears the mode a
 * browser may still have stored from it, so it signs in normally. */
function readStoredMode(): api.DataMode {
  storeMode('live');
  return 'live';
}

function storeMode(mode: api.DataMode) {
  try {
    if (mode === 'demo') localStorage.setItem(DATA_MODE_KEY, 'demo');
    else localStorage.removeItem(DATA_MODE_KEY);
  } catch {
    /* storage unavailable - mode still applies for this session */
  }
}

interface AuthState {
  status: AuthStatus;
  profile: api.TravelerProfile | null;
  busy: boolean;
  error: string | null;
  /** True when the last failure was a network error (backend unreachable). */
  offline: boolean;
  wakingServer: boolean;
  dataMode: api.DataMode;
}

interface AuthContextValue extends AuthState {
  loginWithPassword: (email: string, password: string) => Promise<void>;
  registerAccount: (name: string, email: string, password: string) => Promise<void>;
  continueAsDemo: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const signedOut = (dataMode: api.DataMode = 'live'): AuthState => ({ status: 'unauthenticated', profile: null, busy: false, error: null, offline: false, wakingServer: false, dataMode });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ ...signedOut(), status: 'checking' });

  const loadProfile = useCallback(async (dataMode: api.DataMode) => {
    const profile = await api.getMe();
    setState({ status: 'authenticated', profile, busy: false, error: null, offline: false, wakingServer: false, dataMode });
  }, []);

  useEffect(() => {
    const mode = readStoredMode();
    api.setDataMode(mode);
    if (mode === 'live' && !getStoredToken()) {
      setState(signedOut());
      return;
    }
    loadProfile(mode).catch(() => {
      // Stored token is stale/invalid (e.g. server restarted with a new auth
      // secret) - fall back to the sign-in screen rather than looping forever.
      clearStoredToken();
      storeMode('live');
      api.setDataMode('live');
      setState(signedOut());
    });
  }, [loadProfile]);

  const withAuthResponse = useCallback(async (call: () => Promise<api.AuthResponse>) => {
    api.setDataMode('live');
    setState((s) => ({ ...s, busy: true, error: null, offline: false, wakingServer: false }));
    // The backend can be cold (Render free-tier spin-down) the first time
    // someone hits it; api.ts retries automatically, this just reflects that
    // retry in the UI so the user sees "waking up" instead of a stuck spinner.
    api.onColdStartRetry(() => setState((s) => ({ ...s, wakingServer: true })));
    try {
      const auth = await call();
      setStoredToken(auth.token);
      storeMode('live');
      await loadProfile('live');
    } catch (err) {
      setState((s) => ({
        ...s,
        busy: false,
        wakingServer: false,
        offline: err instanceof ApiError && err.status === 0,
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

  const continueAsDemo = useCallback(async () => {
    try {
      await withAuthResponse(() => api.getDemoAccount());
    } catch (err) {
      // 404 = the server is in production mode with no seeded demo traveler.
      if (err instanceof ApiError && err.status === 404) setState((s) => ({ ...s, error: DEMO_UNAVAILABLE_MESSAGE }));
      throw err;
    }
  }, [withAuthResponse]);

  const logout = useCallback(() => {
    clearStoredToken();
    storeMode('live');
    api.setDataMode('live');
    setState(signedOut());
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
