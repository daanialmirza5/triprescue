import { useState, type FormEvent } from 'react';
import { cn } from '@/lib/utils';
import { DestinationImage } from '@/components/travel/DestinationImage';
import { formatINR, formatMinutes, formatTime } from '@/lib/journey';
import { optionBadge, type OptionRoute } from '@/lib/recovery';
import { riskTone, toneClasses } from '@/lib/status';
import type { ChatMessage, RecoveryOption } from '@/types';
import { ArrowRight, BadgePercent, CheckCircle2, Clock3, Crown, IndianRupee, SendHorizontal, ShieldCheck, Sparkles, Wallet } from 'lucide-react';

export function BotAvatar({ className }: { className?: string }) {
  return (
    <span className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#EEF2FF] to-[#E0E7FF] shadow-card', className)} aria-hidden="true">
      <svg viewBox="0 0 40 40" className="h-9 w-9">
        <defs><linearGradient id="bot-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#6D5BFF" /><stop offset="1" stopColor="#1F6BFF" /></linearGradient></defs>
        <rect x="6" y="10" width="28" height="22" rx="10" fill="url(#bot-g)" />
        <rect x="10" y="15" width="20" height="12" rx="6" fill="#0B1B3A" />
        <circle cx="16" cy="21" r="2.4" fill="#5EEAD4" /><circle cx="24" cy="21" r="2.4" fill="#5EEAD4" />
        <rect x="18.5" y="4" width="3" height="6" rx="1.5" fill="#6D5BFF" /><circle cx="20" cy="4" r="2.4" fill="#A78BFA" />
        <rect x="2" y="17" width="4" height="8" rx="2" fill="#A78BFA" /><rect x="34" y="17" width="4" height="8" rx="2" fill="#A78BFA" />
      </svg>
    </span>
  );
}

export function PromptChip({ label, icon: Icon, onClick, disabled, small }: { label: string; icon: typeof Sparkles; onClick: () => void; disabled?: boolean; small?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} className={cn('inline-flex items-center gap-2 rounded-xl border border-line bg-white font-medium text-ink-soft shadow-sm transition hover:border-brand/40 hover:text-brand disabled:opacity-50', small ? 'px-3 py-1.5 text-xs' : 'px-3.5 py-2 text-sm')}>
      <Icon className={small ? 'h-3.5 w-3.5' : 'h-4 w-4'} /> {label}
    </button>
  );
}

export function MessageBubble({ message, initials }: { message: ChatMessage; initials: string }) {
  const user = message.role === 'user';
  if (user) {
    return (
      <div className="flex items-start justify-end gap-3 animate-fade-in">
        <div className="max-w-[80%] rounded-2xl rounded-tr-md bg-brand-light px-5 py-3.5 text-[15px] leading-relaxed text-ink">{message.content}</div>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1F6BFF] to-[#12B5E5] text-sm font-bold text-white">{initials}</span>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-3 animate-fade-in">
      <BotAvatar />
      <div className="ai-surface max-w-[88%] rounded-2xl rounded-tl-md px-5 py-3.5 text-[15px] leading-relaxed text-ink-soft shadow-sm">
        <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-safar-ai">✦ SAFARSATHI INSIGHT</div>
        <div className="whitespace-pre-line">{message.content}</div>
        <div className="mt-2 text-[11px] text-ink-faint">{message.timestamp}</div>
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-3" aria-live="polite" aria-label="Safar Sathi is typing">
      <BotAvatar />
      <span className="inline-flex gap-1.5 rounded-2xl border border-line bg-white px-4 py-3.5">
        {[0, 150, 300].map((d) => <i key={d} className="h-2 w-2 animate-typing rounded-full bg-ai" style={{ animationDelay: `${d}ms` }} />)}
      </span>
    </div>
  );
}

const badgeIcon = { safe: Sparkles, ai: BadgePercent, risk: Crown, brand: ShieldCheck };

export function AIRecoveryCard({ option, route, rank, selected, onOpen }: { option: RecoveryOption; route: OptionRoute | null; rank: number; selected: boolean; onOpen: () => void }) {
  const badge = optionBadge(option, rank);
  const Icon = badgeIcon[badge.tone];
  const risk = toneClasses[riskTone[option.residualRisk]];
  return (
    <button onClick={onOpen} className={cn('card card-hover flex h-full flex-col p-4 text-left', selected && 'border-brand shadow-[0_0_0_3px_rgba(31,107,255,.14)]')}>
      <div className="flex items-start justify-between gap-2">
        <span className={cn('pill', toneClasses[badge.tone].pill)}><Icon className="h-3.5 w-3.5" />{badge.label}</span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-brand"><ArrowRight className="h-4 w-4" /></span>
      </div>
      <div className="mt-3 text-[13px] font-semibold text-ink-muted">Option {rank + 1}</div>
      <div className="font-display text-base font-bold leading-snug text-ink">{option.name}</div>
      <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <div>
          <DestinationImage destination={route?.from} className="h-16 rounded-lg" />
          <div className="mt-1.5 text-sm font-semibold text-ink">{route?.from ?? '—'}</div>
          <div className="text-xs text-ink-muted">{route?.depart ? formatTime(route.depart) : ''}</div>
        </div>
        <ArrowRight className="h-4 w-4 text-ink-muted" />
        <div>
          <DestinationImage destination={route?.to} className="h-16 rounded-lg" />
          <div className="mt-1.5 text-sm font-semibold text-ink">{route?.to ?? '—'}</div>
          <div className="text-xs text-ink-muted">{route?.arrive ? formatTime(route.arrive) : ''}</div>
        </div>
      </div>
      <div className="mt-auto grid grid-cols-3 gap-2 border-t border-line pt-3 text-xs">
        <div className="flex items-start gap-1.5"><Clock3 className="mt-0.5 h-3.5 w-3.5 text-brand" /><span><b className="block text-ink">{option.timeImpactMinutes ? `+${formatMinutes(option.timeImpactMinutes)}` : 'On time'}</b><span className="text-ink-muted">Arrival</span></span></div>
        <div className="flex items-start gap-1.5"><IndianRupee className="mt-0.5 h-3.5 w-3.5 text-brand" /><span><b className="block text-ink">{formatINR(Math.max(0, option.costDelta)).replace('₹', '')}</b><span className="text-ink-muted">Extra cost</span></span></div>
        <div className="flex items-start gap-1.5"><CheckCircle2 className={cn('mt-0.5 h-3.5 w-3.5', risk.text)} /><span><b className="block capitalize text-ink">{option.residualRisk}</b><span className="text-ink-muted">Risk</span></span></div>
      </div>
    </button>
  );
}

/** The assistant proposing one specific plan. Reviewing opens a confirm dialog;
 * nothing is applied from this card itself. */
export function ActionCard({ option, onReview }: { option: RecoveryOption; onReview: () => void }) {
  return (
    <div className="ai-surface p-4">
      <div className="flex items-center gap-2 text-ai"><Sparkles className="h-4 w-4" /><span className="text-[10px] font-bold uppercase tracking-wider">Sathi can act</span></div>
      <div className="mt-2 text-sm font-bold text-ink">Apply: {option.name}</div>
      <p className="mt-1 text-xs text-ink-soft">{option.description}</p>
      <div className="mt-3 flex flex-wrap gap-3 text-xs text-ink-soft">
        <span className="flex items-center gap-1"><Wallet className="h-3.5 w-3.5" />{formatINR(Math.max(0, option.costDelta))}</span>
        <span className="flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" />{option.timeImpactMinutes ? `+${formatMinutes(option.timeImpactMinutes)}` : 'On time'}</span>
        <span className="flex items-center gap-1 text-safe"><CheckCircle2 className="h-3.5 w-3.5" />{option.bookingsPreserved}/{option.totalBookings} preserved</span>
      </div>
      <button onClick={onReview} className="mt-4 flex items-center gap-2 rounded-xl bg-brand px-3 py-2 text-xs font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2">
        Review &amp; confirm <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function ChatInput({ onSend, disabled }: { onSend: (text: string) => void; disabled?: boolean }) {
  const [value, setValue] = useState('');
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!value.trim() || disabled) return;
    onSend(value.trim());
    setValue('');
  };
  return (
    <form onSubmit={submit} className="flex items-center gap-2 rounded-2xl border border-line bg-white p-2 pl-4 shadow-card focus-within:border-brand/50 focus-within:ring-4 focus-within:ring-brand/10">
      <Sparkles className="h-5 w-5 shrink-0 text-ai" />
      <label htmlFor="assistant-input" className="sr-only">Message Safar Sathi</label>
      <input id="assistant-input" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Ask Safar Sathi anything about your trip..." className="min-w-0 flex-1 bg-transparent py-2 text-[15px] text-ink placeholder:text-ink-muted focus:outline-none" autoComplete="off" />
      <button type="submit" disabled={disabled || !value.trim()} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-glow transition disabled:opacity-40" aria-label="Send message">
        <SendHorizontal className="h-5 w-5" />
      </button>
    </form>
  );
}
