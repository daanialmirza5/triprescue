import { cn } from '@/lib/utils';
import { useRouter } from '@/lib/router';
import { useShellActions } from '@/components/layout/ShellActions';
import { Clock3, FileText, PercentCircle, PhoneCall } from 'lucide-react';

/** The four quick-action tiles that close out the Dashboard and Live Updates pages. */
export function QuickActions({ className }: { className?: string }) {
  const { navigate } = useRouter();
  const { openSimulate, openSupport } = useShellActions();
  const actions = [
    { title: 'Simulate Delays', text: 'See what-if scenarios', icon: Clock3, tone: 'bg-ai-light text-ai', onClick: openSimulate },
    { title: 'Check Refund Eligibility', text: 'AI-powered claim check', icon: FileText, tone: 'bg-risk-light text-risk', onClick: () => navigate('claims') },
    { title: 'Alternative Routes', text: 'Find better options', icon: PercentCircle, tone: 'bg-[#E3F8F6] text-[#0EA5A0]', onClick: () => navigate('recovery') },
    { title: 'Contact Support', text: 'Get instant help', icon: PhoneCall, tone: 'bg-danger-light text-danger', onClick: openSupport },
  ];
  return (
    <div className={cn('grid gap-4 sm:grid-cols-2 xl:grid-cols-4', className)}>
      {actions.map(({ title, text, icon: Icon, tone, onClick }) => (
        <button key={title} onClick={onClick} className="card card-hover flex items-center gap-4 px-5 py-4 text-left">
          <span className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl', tone)}>
            <Icon className="h-6 w-6" strokeWidth={1.8} />
          </span>
          <span className="min-w-0">
            <span className="block text-[15px] font-bold text-ink">{title}</span>
            <span className="block text-sm text-ink-muted">{text}</span>
          </span>
        </button>
      ))}
    </div>
  );
}
