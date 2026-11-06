import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

/** Minimal hash router. Hash URLs keep deep links working on static hosting
 * (GitHub Pages and similar) without server-side rewrites. */

export const ROUTES = ['dashboard', 'bookings', 'live', 'recovery', 'assistant', 'claims', 'settings', 'trip', 'digital-twin', 'explore', 'transport'] as const;
export type Route = (typeof ROUTES)[number];

export interface RouteParams {
  /** Question to send to the AI assistant on arrival. */
  prompt?: string;
  /** Bookings tab to open on arrival. */
  tab?: string;
}

interface RouterValue {
  route: Route;
  params: RouteParams;
  navigate: (route: Route, params?: RouteParams) => void;
  consumeParams: () => void;
}

const RouterContext = createContext<RouterValue | null>(null);

function parseHash(): Route {
  const raw = window.location.hash.replace(/^#\/?/, '').split('?')[0];
  return (ROUTES as readonly string[]).includes(raw) ? (raw as Route) : 'dashboard';
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>(() => parseHash());
  const [params, setParams] = useState<RouteParams>({});

  useEffect(() => {
    const onHash = () => setRoute(parseHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const navigate = useCallback((next: Route, nextParams: RouteParams = {}) => {
    setParams(nextParams);
    setRoute(next);
    if (parseHash() !== next || window.location.hash === '') window.location.hash = `/${next}`;
    document.getElementById('main-scroll')?.scrollTo({ top: 0 });
  }, []);

  const consumeParams = useCallback(() => setParams({}), []);

  const value = useMemo(() => ({ route, params, navigate, consumeParams }), [route, params, navigate, consumeParams]);
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter must be used within RouterProvider');
  return ctx;
}
