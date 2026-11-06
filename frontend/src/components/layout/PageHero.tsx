import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { ScriptTagline } from '@/components/brand/Logo';
import { ActiveTripBadge, Breadcrumbs, type Crumb } from '@/components/layout/PageContext';
import { Plane } from 'lucide-react';

interface PageHeroProps {
  title: ReactNode;
  titleAddon?: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
  /** Wide landmark photograph that fades into the page from the right. */
  image?: string;
  script?: string[];
  /** Illustration shown on the right on wide screens (instead of a photo). */
  art?: ReactNode;
  actions?: ReactNode;
  /** Breadcrumb trail after "Dashboard"; the last crumb is the current page. */
  crumbs?: Crumb[];
  /** Show which trip the page is about (with its status). */
  showTripBadge?: boolean;
  className?: string;
}

/** Page header shared by every screen: large title, supporting copy, and an
 * optional landmark photograph that sits behind the top bar on the right. */
export function PageHero({ title, titleAddon, subtitle, description, image, script, art, actions, crumbs, showTripBadge, className }: PageHeroProps) {
  return (
    <>
      {art && (
        <div className="pointer-events-none absolute right-0 top-0 z-0 hidden h-[330px] w-[62%] min-[1400px]:block" aria-hidden="true">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_65%_70%_at_62%_45%,rgba(31,107,255,.14),rgba(18,181,229,.08)_45%,transparent_75%)]" />
          <div className="absolute right-8 top-[92px]">{art}</div>
        </div>
      )}
      {image && (
        <div className="pointer-events-none absolute right-0 top-0 z-0 h-[250px] w-full overflow-hidden sm:h-[270px] lg:w-[68%]" aria-hidden="true">
          <img src={image} alt="" className="mask-fade-left h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-canvas" />
          <div className="absolute inset-0 bg-gradient-to-r from-canvas via-canvas/40 to-transparent lg:hidden" />
          {script && (
            <div className="absolute right-8 top-[104px] hidden -rotate-6 xl:block">
              <ScriptTagline lines={script} className="text-[28px] text-ink" />
              <Plane className="absolute -right-4 -top-10 h-8 w-8 -rotate-[20deg] fill-ink text-ink" />
              <svg className="absolute -top-8 left-8 h-16 w-48 text-ink/60" viewBox="0 0 200 60" fill="none"><path d="M2 58 C60 20 120 50 196 4" stroke="currentColor" strokeWidth="1.5" /></svg>
            </div>
          )}
        </div>
      )}
      <div className={cn('relative z-10 flex flex-wrap items-start justify-between gap-4 pb-6 pt-4', !!art && 'min-[1400px]:min-h-[250px]', className)}>
        <div className={cn('min-w-0 max-w-2xl', !!art && 'min-[1400px]:max-w-[560px]')}>
          {(crumbs || showTripBadge) && (
            <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2">
              {crumbs && <Breadcrumbs crumbs={crumbs} />}
              {showTripBadge && <ActiveTripBadge />}
            </div>
          )}
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-[30px] font-extrabold leading-tight tracking-tight text-ink sm:text-[38px]">{title}</h1>
            {titleAddon}
          </div>
          {subtitle && <p className="mt-1.5 text-lg text-ink-soft sm:text-[21px]">{subtitle}</p>}
          {description && <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-ink-soft">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
      </div>
    </>
  );
}

export function LivePill({ label = 'Real-time' }: { label?: string }) {
  return (
    <span className="pill bg-safe-light text-safe">
      <span className="relative flex h-2 w-2"><span className="absolute inset-0 animate-ping rounded-full bg-safe opacity-60" /><span className="relative h-2 w-2 rounded-full bg-safe" /></span>
      {label}
    </span>
  );
}
