import { useRouter } from '@/lib/router';
import { ArrowRight, MessageCircleMore } from 'lucide-react';

export function HelpCard() {
  const { navigate } = useRouter();
  return (
    <section className="card p-5">
      <div className="flex items-start gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-light text-brand"><MessageCircleMore className="h-7 w-7" /></span>
        <div>
          <h2 className="section-title">Need Help?</h2>
          <p className="mt-1 text-sm leading-snug text-ink-muted">Ask Safar Sathi for recovery options, refunds or real-time updates.</p>
        </div>
      </div>
      <button onClick={() => navigate('assistant')} className="btn-gradient mt-5 w-full py-3 text-[15px]">
        Chat with AI Assistant <ArrowRight className="h-4 w-4" />
      </button>
    </section>
  );
}
