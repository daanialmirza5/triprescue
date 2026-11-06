import { useState, type FormEvent } from 'react';
import { ArrowLeft, Check, Circle, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '@/store/AuthContext';
import { useToast } from '@/components/ui/ToastProvider';
import { ApiError } from '@/services/api';
import { Logo, ScriptTagline } from '@/components/brand/Logo';
import { sceneImages } from '@/lib/destinationImages';
import { cn } from '@/lib/utils';
import { PASSWORD_MAX_LENGTH, PASSWORD_RULES, isStrongPassword } from '@/lib/password';

type Mode = 'login' | 'register';

/** Sign-in: backend account or the seeded demo traveler. */
export function LoginScreen({ onBack }: { onBack?: () => void }) {
  const { loginWithPassword, registerAccount, continueAsDemo, busy, error, wakingServer } = useAuth();
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { addToast } = useToast();
  const registering = mode === 'register';
  const weakPassword = registering && !isStrongPassword(password);

  const handleDemo = () => {
    continueAsDemo().catch((err) => {
      if (err instanceof ApiError && err.status === 404) addToast('info', 'Production mode active', 'Please create a new account.');
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (weakPassword) return;
    const action = mode === 'login' ? loginWithPassword(email, password) : registerAccount(name, email, password);
    action.catch(() => {});
  };

  return (
    <div className="flex min-h-screen bg-canvas">
      <div className="relative hidden flex-1 overflow-hidden lg:block">
        <img src={sceneImages.heroIndiaGate} alt="India Gate at sunset" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-12 text-white">
          <h1 className="max-w-lg font-display text-4xl font-extrabold leading-tight">Your journey, always with you.</h1>
          <p className="mt-3 max-w-md text-white/85">Safar Sathi monitors every leg of your trip, detects disruptions, and prepares recovery options before you have to ask.</p>
          <ScriptTagline lines={['Same Destinations.', 'Fewer Disruptions.']} className="mt-6 text-3xl text-white/90" />
        </div>
      </div>
      <div className="flex w-full items-center justify-center px-4 py-10 lg:w-[520px]">
        <div className="w-full max-w-sm">
          {onBack && <button type="button" onClick={onBack} className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-brand"><ArrowLeft className="h-4 w-4" /> Back to home</button>}
          <Logo className="mb-8" />
          <h2 className="font-display text-2xl font-bold text-ink">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
          <p className="mt-1 text-sm text-ink-muted">Sign in to see your trips and live disruption updates.</p>

          <div className="mt-6 flex gap-1 rounded-xl border border-line bg-white p-1">
            {(['login', 'register'] as const).map((m) => (
              <button key={m} type="button" onClick={() => setMode(m)} className={cn('flex-1 rounded-lg py-2 text-sm font-semibold transition', mode === m ? 'bg-brand text-white shadow-glow' : 'text-ink-soft hover:bg-canvas')}>
                {m === 'login' ? 'Log In' : 'Create Account'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-3">
            {mode === 'register' && (
              <div>
                <label htmlFor="name" className="mb-1 block text-xs font-medium text-ink-soft">Full name</label>
                <input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} className="field" autoComplete="name" />
              </div>
            )}
            <div>
              <label htmlFor="email" className="mb-1 block text-xs font-medium text-ink-soft">Email</label>
              <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="field" autoComplete="email" />
            </div>
            <div>
              <label htmlFor="password" className="mb-1 block text-xs font-medium text-ink-soft">Password</label>
              <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="field" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} maxLength={registering ? PASSWORD_MAX_LENGTH : undefined} aria-describedby={registering ? 'password-rules' : undefined} aria-invalid={registering && password.length > 0 && weakPassword ? true : undefined} />
              {registering && (
                <ul id="password-rules" aria-label="Password requirements" className="mt-2 grid grid-cols-1 gap-1 text-xs sm:grid-cols-2">
                  {PASSWORD_RULES.map((rule) => {
                    const met = rule.test(password);
                    return (
                      <li key={rule.label} className={cn('flex items-center gap-1.5', met ? 'text-safe' : 'text-ink-muted')}>
                        {met ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Circle className="h-3 w-3" aria-hidden="true" />}
                        <span>{rule.label}<span className="sr-only">{met ? ' (met)' : ' (missing)'}</span></span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {wakingServer && !error && <p className="text-xs text-ink-muted">Waking up the Safar Sathi server — the first request can take up to a minute.</p>}
            {error && (
              <div role="alert" className="rounded-xl border border-danger/20 bg-danger-light/60 p-3 text-xs text-danger">
                {error}

              </div>
            )}

            <button type="submit" disabled={busy || weakPassword} className="btn-primary w-full py-3">
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === 'login' ? 'Log In' : 'Create Account'}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs text-ink-faint"><div className="h-px flex-1 bg-line" />OR<div className="h-px flex-1 bg-line" /></div>

          <div className="space-y-2">
            <button type="button" disabled={busy} onClick={handleDemo} className="btn-outline w-full py-3">
              <Sparkles className="h-4 w-4" /> Continue as Demo Traveler
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
