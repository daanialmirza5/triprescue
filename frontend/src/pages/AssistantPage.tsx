import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useApp } from '@/store/AppContext';
import { useAuth } from '@/store/AuthContext';
import { useRouter } from '@/lib/router';
import * as api from '@/services/api';
import { PageHero, LivePill } from '@/components/layout/PageHero';
import { useShellActions } from '@/components/layout/ShellActions';
import { AIRecoveryCard, ActionCard, BotAvatar, ChatInput, MessageBubble, PromptChip, TypingIndicator } from '@/components/ai/AssistantParts';
import { DestinationImage } from '@/components/travel/DestinationImage';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/ToastProvider';
import { sceneImages } from '@/lib/destinationImages';
import { formatINR, formatMinutes, formatTime, legDelayMinutes, nodeKind, parseDate } from '@/lib/journey';
import { optionRoute, priorityOf, rankOptions } from '@/lib/recovery';
import { riskTone, toneClasses } from '@/lib/status';
import { cn } from '@/lib/utils';
import type { ChatMessage, ItineraryNodeData, RecoveryOption } from '@/types';
import { AlertCircle, BedDouble, Car, CircleHelp, Clock3, FileText, GitCompareArrows, PercentCircle, PhoneCall, Plane, PlaneTakeoff, RefreshCcw, Search, ShieldQuestion, Sparkles, TrainFront } from 'lucide-react';

const stamp = () => new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
/** A chat message plus the recovery plan the assistant proposed with it, if any. */
type ThreadMessage = ChatMessage & { proposedOptionId?: string };
/** The backend adds `proposedRecoveryId` when the assistant proposes a plan; it never applies it. */
type AnswerWithProposal = api.AssistantAnswer & { proposedRecoveryId?: string | null };
const chatCache = new Map<string, ThreadMessage[]>();
const RECOVERY_INTENT = /recover|option|rebook|alternative|compare|fastest|cheap|comfort/i;

const starterPrompts = [
  { label: 'Check my trip status', icon: Search },
  { label: 'Show recovery options', icon: Sparkles },
  { label: 'Explain why my connection is at risk', icon: ShieldQuestion },
  { label: 'Simulate a 60 min delay', icon: Clock3 },
  { label: 'What if I miss my train?', icon: TrainFront },
  { label: 'Help me claim a refund', icon: CircleHelp },
];
const followUps = [
  { label: 'Explain this disruption', icon: AlertCircle },
  { label: 'Compare these options', icon: GitCompareArrows },
  { label: 'Help me rebook', icon: RefreshCcw },
  { label: 'What are my refund options?', icon: CircleHelp },
];

export function AssistantPage() {
  const { tripId, trip, recoveryOptions, preferences, selectedRecovery, selectRecovery, activeDisruption, applyRecoveryPlan, appliedRecovery } = useApp();
  const { profile } = useAuth();
  const { navigate, params, consumeParams } = useRouter();
  const { openSimulate, openSupport } = useShellActions();
  const { addToast } = useToast();
  const [messages, setMessages] = useState<ThreadMessage[]>(() => chatCache.get(tripId) ?? []);
  const [thinking, setThinking] = useState(false);
  // The plan awaiting the traveler's explicit confirmation; nothing applies without it.
  const [confirm, setConfirm] = useState<RecoveryOption | null>(null);
  const [applying, setApplying] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const initials = (profile?.name ?? 'T').split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
  const firstName = profile?.name.split(' ')[0] ?? 'there';

  const ranked = useMemo(() => rankOptions(recoveryOptions, priorityOf(preferences)), [recoveryOptions, preferences]);

  useEffect(() => { setMessages(chatCache.get(tripId) ?? []); }, [tripId]);
  useEffect(() => { chatCache.set(tripId, messages); }, [tripId, messages]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [messages, thinking]);

  const send = useCallback(async (text: string) => {
    if (!text.trim() || thinking || !tripId) return;
    const push = (m: Omit<ThreadMessage, 'id' | 'timestamp'>) => setMessages((prev) => [...prev, { ...m, id: `${m.role}-${Date.now()}-${prev.length}`, timestamp: stamp() }]);
    push({ role: 'user', content: text });
    setThinking(true);
    try {
      const simulate = text.match(/simulate (?:a )?(\d+)\s*min/i);
      if (simulate) {
        // What-if runs through the backend propagation engine as a dry run - nothing is saved.
        const minutes = Number(simulate[1]);
        const result = await api.simulateDisruption(tripId, { type: 'flight-delay', delayMinutes: minutes });
        const affected = result.impacts.filter((i) => i.status !== 'healthy' && i.nodeId !== result.disruption.primaryNodeId);
        const names = affected.map((i) => `• ${trip.nodes.find((n) => n.id === i.nodeId)?.title ?? i.nodeId}: ${i.status.replace('-', ' ')}${i.reason ? ` — ${i.reason}` : ''}`);
        push({
          role: 'assistant',
          content: affected.length
            ? `If ${result.disruption.label.toLowerCase()}, ${affected.length} downstream booking${affected.length === 1 ? '' : 's'} would be affected and trip health would drop to ${result.tripHealthScore}%:\n${names.join('\n')}\nThis was a dry run — your itinerary hasn't changed.`
            : `A ${minutes} min delay would be absorbed by your connection buffers — no downstream bookings are affected (trip health ${result.tripHealthScore}%). This was a dry run.`,
        });
      } else {
        const answer: AnswerWithProposal = await api.askAssistant(tripId, text);
        const referenced = answer.references.filter((r) => r.type === 'recovery').map((r) => r.id).filter((id) => ranked.some((o) => o.id === id));
        const optionIds = referenced.length ? referenced : RECOVERY_INTENT.test(text) ? ranked.map((o) => o.id) : [];
        // Only a plan that is among the currently loaded options can be proposed;
        // anything else is ignored rather than guessed at.
        const proposed = answer.proposedRecoveryId ? ranked.find((o) => o.id === answer.proposedRecoveryId) : undefined;
        push({ role: 'assistant', content: answer.content, references: answer.references, optionIds, proposedOptionId: proposed?.id });
        if (proposed) setConfirm(proposed);
      }
    } catch (err) {
      push({ role: 'assistant', content: err instanceof api.ApiError && err.status !== 0 ? `I couldn't complete that: ${err.message}` : "I can't reach the travel intelligence service right now. Your trip data is still available on the Dashboard — please try again in a moment." });
    } finally {
      setThinking(false);
    }
  }, [thinking, tripId, trip.nodes, ranked]);

  // Questions handed over from search, alerts or other pages (sent once).
  const handedOff = useRef<string | null>(null);
  useEffect(() => {
    if (params.prompt && tripId && trip.id && handedOff.current !== params.prompt) {
      handedOff.current = params.prompt;
      consumeParams();
      send(params.prompt);
    }
  }, [params.prompt, tripId, trip.id, consumeParams, send]);

  const openOption = (id: string) => { selectRecovery(id); navigate('recovery'); };

  /** Runs only from the confirm dialog's button - the same apply path the Recovery page uses. */
  const applyConfirmed = async () => {
    if (!confirm) return;
    setApplying(true);
    try {
      await applyRecoveryPlan(confirm.id);
      addToast('success', 'Journey recovered', `${confirm.bookingsPreserved}/${confirm.totalBookings} commitments preserved.`);
      setConfirm(null);
    } catch {
      addToast('error', 'Recovery could not be applied', 'Nothing was changed. Please try again.');
    } finally {
      setApplying(false);
    }
  };
  const contextNodes = trip.nodes.filter((n) => n.category !== 'connection' && n.category !== 'activity' && n.category !== 'return').slice(0, 4);

  return (
    <div className="animate-fade-in">
      <PageHero
        crumbs={[{ label: 'Assistant' }]}
        title="Safar Sathi AI Assistant"
        titleAddon={<LivePill label="Online" />}
        subtitle={<span className="text-[17px] sm:text-lg">Get real-time insights, recovery options, and personalized travel support.</span>}
        image={sceneImages.heroTajMahal}
      />

      <div className="relative z-10 grid grid-cols-1 gap-5 2xl:grid-cols-[minmax(0,1fr)_330px]">
        <section className="card flex min-h-[560px] flex-col p-4 sm:p-6" aria-label="Conversation">
          <div className="flex-1 space-y-5">
            <div className="flex items-start gap-3">
              <BotAvatar />
              <div className="min-w-0">
                <h2 className="font-display text-lg font-bold text-ink">Hi {firstName}! <span aria-hidden="true">👋</span></h2>
                <p className="mt-1 max-w-2xl text-[15px] leading-relaxed text-ink-soft">I'm Safar Sathi, your travel companion. I can help you with real-time updates, disruption analysis, recovery options, bookings, and more.</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {starterPrompts.map((p) => <PromptChip key={p.label} label={p.label} icon={p.icon} disabled={thinking} onClick={() => send(p.label)} />)}
                </div>
              </div>
            </div>

            {messages.length === 0 && activeDisruption && ranked.length > 0 && (
              // Proactive brief built from the live disruption and the engine's ranked options.
              <div className="space-y-3">
                <MessageBubble initials={initials} message={{ id: 'brief', role: 'assistant', timestamp: activeDisruption.detectedAt, content: `I've analyzed your trip and found ${ranked.length} recovery option${ranked.length === 1 ? '' : 's'}. ${activeDisruption.label}, which affects ${activeDisruption.downstreamImpact} downstream booking${activeDisruption.downstreamImpact === 1 ? '' : 's'} on your ${trip.route} journey. Here are the best options based on speed, cost and comfort.` }} />
                <div className="grid grid-cols-1 gap-3 sm:pl-14 md:grid-cols-2 xl:grid-cols-3">
                  {ranked.map((o, i) => <AIRecoveryCard key={o.id} option={o} route={optionRoute(o, trip)} rank={i} selected={selectedRecovery === o.id} onOpen={() => openOption(o.id)} />)}
                </div>
              </div>
            )}

            {messages.map((m) => {
              const proposal = m.proposedOptionId ? ranked.find((o) => o.id === m.proposedOptionId) : undefined;
              return (
              <div key={m.id} className="space-y-3">
                <MessageBubble message={m} initials={initials} />
                {m.role === 'assistant' && proposal && appliedRecovery?.id !== proposal.id && (
                  <div className="sm:pl-14">
                    <ActionCard option={proposal} onReview={() => setConfirm(proposal)} />
                  </div>
                )}
                {m.role === 'assistant' && m.optionIds && m.optionIds.length > 0 && (
                  <div className="grid grid-cols-1 gap-3 pl-0 md:grid-cols-2 xl:grid-cols-3 sm:pl-14">
                    {m.optionIds.map((id) => ranked.find((o) => o.id === id)).filter((o): o is NonNullable<typeof o> => !!o).map((o) => (
                      <AIRecoveryCard key={o.id} option={o} route={optionRoute(o, trip)} rank={ranked.indexOf(o)} selected={selectedRecovery === o.id} onOpen={() => openOption(o.id)} />
                    ))}
                  </div>
                )}
              </div>
              );
            })}
            {thinking && <TypingIndicator />}
            <div ref={endRef} />
          </div>

          <div className="mt-6 space-y-3 border-t border-line pt-4">
            <ChatInput onSend={send} disabled={thinking} />
            <div className="flex flex-wrap gap-2">
              {followUps.map((p) => <PromptChip key={p.label} small label={p.label} icon={p.icon} disabled={thinking} onClick={() => send(p.label)} />)}
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 content-start gap-5 lg:grid-cols-2 2xl:grid-cols-1">
          <section className="card p-5" aria-labelledby="ctx-title">
            <div className="flex items-center justify-between gap-2">
              <h2 id="ctx-title" className="section-title">Current Trip Context</h2>
              {activeDisruption ? <StatusBadge status="broken" label="Disruption" /> : <StatusBadge status="healthy" />}
            </div>
            <ol className="relative mt-4 space-y-4 before:absolute before:bottom-6 before:left-[15px] before:top-6 before:border-l-2 before:border-dashed before:border-line-strong">
              {contextNodes.map((n) => <ContextItem key={n.id} node={n} delay={legDelayMinutes(n, activeDisruption)} />)}
              {contextNodes.length === 0 && <li className="text-sm text-ink-muted">No bookings yet.</li>}
            </ol>
          </section>

          <section className="card p-5" aria-labelledby="qa-title">
            <h2 id="qa-title" className="section-title">Quick Actions</h2>
            <div className="mt-3 space-y-2">
              <QuickRow icon={PlaneTakeoff} tone="bg-brand-light text-brand" label="Rebook Flights / Trains" onClick={() => navigate('recovery')} />
              <QuickRow icon={FileText} tone="bg-risk-light text-risk" label="Check Refund Eligibility" onClick={() => navigate('claims')} />
              <QuickRow icon={PercentCircle} tone="bg-[#E3F8F6] text-[#0EA5A0]" label="Find Alternative Routes" onClick={() => send('Show recovery options')} />
              <QuickRow icon={Clock3} tone="bg-ai-light text-ai" label="Simulate Delays" onClick={openSimulate} />
              <QuickRow icon={PhoneCall} tone="bg-danger-light text-danger" label="Contact Support" onClick={openSupport} />
            </div>
          </section>
        </div>
      </div>

      <Modal open={!!confirm} onClose={() => !applying && setConfirm(null)} title="Confirm recovery" subtitle="Sathi will not apply changes without your approval." initialFocusRef={cancelRef} hideCloseButton>
        {confirm && (
          <>
            <div className="rounded-xl border border-line bg-canvas p-4">
              <div className="text-sm font-semibold text-ink">{confirm.name}</div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-ink-soft">
                <span>Additional cost <b className="block text-ink">{formatINR(Math.max(0, confirm.costDelta))}</b></span>
                <span>Time impact <b className="block text-ink">{confirm.timeImpactMinutes ? `+${formatMinutes(confirm.timeImpactMinutes)}` : 'On time'}</b></span>
                <span>Preserved <b className="block text-ink">{confirm.bookingsPreserved}/{confirm.totalBookings}</b></span>
                <span>Residual risk <b className={cn('block capitalize', toneClasses[riskTone[confirm.residualRisk]].text)}>{confirm.residualRisk}</b></span>
              </div>
            </div>
            <div className="mt-5 flex gap-2">
              <button ref={cancelRef} type="button" onClick={() => setConfirm(null)} disabled={applying} className="btn-ghost flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2">Cancel</button>
              <button type="button" onClick={applyConfirmed} disabled={applying} className="btn-primary flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2">{applying ? 'Applying…' : 'Confirm & Apply'}</button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}

function ContextItem({ node, delay }: { node: ItineraryNodeData; delay: number }) {
  const k = nodeKind(node);
  const scene = k === 'flight' ? sceneImages.flight : k === 'train' ? sceneImages.train : k === 'transfer' ? sceneImages.transfer : undefined;
  const scheduled = parseDate(node.scheduledStart);
  const actual = parseDate(node.actualStart ?? undefined);
  const ModeIcon = k === 'flight' ? Plane : k === 'train' ? TrainFront : k === 'hotel' ? BedDouble : Car;
  return (
    <li className="relative flex gap-3 pl-10">
      <span className={cn('absolute left-0 top-5 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-white shadow-card', node.status === 'healthy' || node.status === 'recovered' ? 'bg-safe' : node.status === 'at-risk' ? 'bg-risk' : 'bg-brand')}>
        <ModeIcon className="h-3.5 w-3.5" />
      </span>
      <DestinationImage src={scene} destination={node.location} className="h-[62px] w-[78px] shrink-0 rounded-xl" />
      <div className="min-w-0">
        <div className="truncate text-sm font-bold text-ink">{k === 'hotel' ? node.title : node.subtitle.split(' · ')[0] || node.title}</div>
        <div className="truncate text-xs text-ink-muted">{k === 'hotel' ? node.location : node.title}</div>
        <div className="mt-1"><StatusBadge status={node.status} label={delay > 0 ? `+${delay} min delay` : node.status === 'healthy' && k === 'hotel' ? 'Confirmed' : undefined} /></div>
        <div className="mt-1 text-xs">
          {actual && scheduled && actual > scheduled ? <><span className="text-ink-faint line-through">{formatTime(scheduled)}</span> <span className="font-bold text-danger">{formatTime(actual)}</span></> : <span className="font-medium text-ink-soft">{k === 'hotel' ? 'Check-in ' : ''}{formatTime(scheduled)}</span>}
        </div>
      </div>
    </li>
  );
}

function QuickRow({ icon: Icon, tone, label, onClick }: { icon: typeof Clock3; tone: string; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 rounded-2xl border border-line px-3 py-2.5 text-left transition hover:border-brand/30 hover:bg-canvas">
      <span className={cn('flex h-10 w-10 items-center justify-center rounded-xl', tone)}><Icon className="h-5 w-5" /></span>
      <span className="flex-1 text-sm font-medium text-ink">{label}</span>
      <span className="text-ink-faint">›</span>
    </button>
  );
}
