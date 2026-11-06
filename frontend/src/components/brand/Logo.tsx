import { useId } from 'react';
import { cn } from '@/lib/utils';

/** The Safar Sathi mark: an infinity route (the journey that keeps going)
 * with a destination pin and a departing plane. Shared by the sidebar,
 * sign-in, landing page and favicon. */
export function LogoMark({ className }: { className?: string }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 128 70" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-route`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#38BDF8" />
          <stop offset="0.55" stopColor="#1F8BFF" />
          <stop offset="1" stopColor="#1F4FE0" />
        </linearGradient>
        <linearGradient id={`${id}-pin`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FB923C" />
          <stop offset="1" stopColor="#EA580C" />
        </linearGradient>
        <linearGradient id={`${id}-plane`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#1F6BFF" />
          <stop offset="1" stopColor="#1E3A8A" />
        </linearGradient>
      </defs>
      {/* lower-right loop, faded like the part of the route still to come */}
      <path d="M62 40 C72 55 84 62 96 59 C107 56 111 46 106 37" fill="none" stroke="#A9D2F8" strokeWidth="10" strokeLinecap="round" />
      {/* main route: around the left loop, through the crossing, up to the plane */}
      <path d="M62 40 C52 26 42 19 31 19 C19 19 10 29 10 40 C10 51 19 61 31 61 C42 61 52 54 62 40 C70 28 80 19 95 14" fill="none" stroke={`url(#${id}-route)`} strokeWidth="10" strokeLinecap="round" />
      {/* destination pin inside the left loop */}
      <path d="M31 51 C25 44 22.5 40 22.5 35.5 a8.5 8.5 0 1 1 17 0 C39.5 40 37 44 31 51 Z" fill={`url(#${id}-pin)`} />
      <circle cx="31" cy="35.5" r="3.2" fill="#FFFFFF" />
      {/* departing plane */}
      <g transform="translate(95 -2) rotate(-28 12 12) scale(1.25)">
        <path fill={`url(#${id}-plane)`} d="M21.5 12c0-.6-.5-1-1.1-1H15l-4.6-7.2c-.2-.3-.5-.5-.9-.5H8.3l2.3 7.7H5.9L4.3 8.8c-.1-.2-.4-.3-.6-.3H2.5l1.2 3.5-1.2 3.5h1.2c.2 0 .5-.1.6-.3l1.6-2.2h4.7l-2.3 7.7h1.2c.4 0 .7-.2.9-.5L15 13h5.4c.6 0 1.1-.4 1.1-1z" />
      </g>
    </svg>
  );
}

export function Logo({ compact = false, size = 'md', className }: { compact?: boolean; size?: 'sm' | 'md'; className?: string }) {
  return (
    <div className={cn('flex items-center', size === 'sm' ? 'gap-2' : 'gap-2.5', className)}>
      <LogoMark className={size === 'sm' ? 'h-9 w-[54px] shrink-0' : 'h-10 w-[62px] shrink-0'} />
      {!compact && (
        <div className="leading-tight">
          <div className={cn('font-display font-extrabold tracking-tight', size === 'sm' ? 'text-[20px]' : 'text-[22px]')}><span className="text-ink">Safar</span> <span className="text-brand">Sathi</span></div>
          <div className={cn('whitespace-nowrap font-medium text-ink-soft', size === 'sm' ? 'text-[10.5px]' : 'text-[11px]')}>Your Journey, Always with You</div>
        </div>
      )}
    </div>
  );
}

/** Handwritten brand line used in hero corners and the sidebar footer. */
export function ScriptTagline({ lines, className }: { lines: string[]; className?: string }) {
  return (
    <div className={cn('pointer-events-none select-none font-script font-semibold leading-[1.05] text-ink/85', className)} aria-hidden="true">
      {lines.map((line, i) => (
        <div key={line} style={{ paddingLeft: `${i * 0.9}em` }}>{line}</div>
      ))}
    </div>
  );
}
