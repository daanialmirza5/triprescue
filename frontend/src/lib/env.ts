/**
 * Type-safe environment variable helpers for the Safar Sathi client.
 */

export interface AppEnv {
  readonly apiUrl: string;
  readonly isDev: boolean;
  readonly isProd: boolean;
  readonly mode: string;
}

/**
 * Normalized client runtime environment configuration.
 */
export const env: AppEnv = {
  apiUrl: (import.meta.env.VITE_API_URL as string) || '',
  isDev: Boolean(import.meta.env.DEV),
  isProd: Boolean(import.meta.env.PROD),
  mode: (import.meta.env.MODE as string) || 'development',
};

/**
 * Resolves a path against the base API URL.
 */
export function getApiEndpoint(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${env.apiUrl}${normalizedPath}`;
}
