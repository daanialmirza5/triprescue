import { useState } from 'react';
import { useApp } from '@/store/AppContext';
import { ItineraryGraph } from '@/components/graph/ItineraryGraph';
import { MapView } from '@/pages/MapView';
import { BeforeAfterView } from '@/components/recovery/BeforeAfterView';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { BookingsPage } from '@/pages/BookingsPage';
import { RiskIntelligence } from '@/pages/RiskIntelligence';
import { cn } from '@/lib/utils';
import { Plane, Calendar, GitBranch, Map as MapIcon, ClipboardList, ShieldAlert, Clock } from 'lucide-react';

type Tab = 'timeline' | 'graph' | 'map' | 'bookings' | 'risks';

const tabs: { id: Tab; label: string; icon: typeof Calendar }[] = [
  { id: 'timeline', label: 'Timeline', icon: Calendar },
  { id: 'graph', label: 'Graph', icon: GitBranch },
  { id: 'map', label: 'Map', icon: MapIcon },
  { id: 'bookings', label: 'Bookings', icon: ClipboardList },
  { id: 'risks', label: 'Risks', icon: ShieldAlert },
];

export function TripDetail() {
  const { trip, appliedRecovery } = useApp();
  const [tab, setTab] = useState<Tab>('timeline');

  return (
    <div className="space-y-5">
      <div className="glass rounded-xl p-5">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500/20 to-electric-600/10 border border-accent-500/20">
              <Plane className="h-7 w-7 text-accent-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-ink-100">{trip.name}</h1>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-ink-400">
                <span>{trip.route}</span>
                <span className="text-ink-400">·</span>
                <span>{trip.startDate} — {trip.endDate}</span>
                <StatusBadge status={trip.status === 'operational' ? 'healthy' : trip.status === 'recovered' ? 'recovered' : 'broken'} />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ScoreRing score={trip.healthScore} size={70} strokeWidth={6} label="Health" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 border-b border-ink-700">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'flex items-center gap-1.5 border-b-2 px-3 py-2 text-xs font-medium transition',
                tab === t.id ? 'border-accent-500 text-accent-600' : 'border-transparent text-ink-400 hover:text-ink-100'
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === 'timeline' && (
        <div className="space-y-4">
          {appliedRecovery && <BeforeAfterView />}
          <div className="glass rounded-xl p-5">
            <h3 className="text-sm font-semibold text-ink-100 mb-4">Day-by-day Timeline</h3>
            <div className="space-y-4">
              {trip.days.map((day) => (
                <div key={day.day} className="flex gap-4">
                  <div className="flex flex-col items-center shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-accent-500/30 bg-accent-500/10">
                      <span className="text-sm font-bold text-accent-600">{day.day}</span>
                    </div>
                    {day.day < trip.days.length && <div className="h-full w-px bg-ink-700 mt-1" />}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-ink-500 font-mono">{day.date}</span>
                      <span className="text-sm font-medium text-ink-100">{day.title}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-ink-400">{day.summary}</p>
                    {day.nodeIds.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {day.nodeIds.map((nid) => {
                          const node = trip.nodes.find((n) => n.id === nid);
                          if (!node) return null;
                          return (
                            <div key={nid} className="flex items-center gap-1.5 rounded-lg border border-ink-700 bg-white/60 px-2 py-1">
                              <Clock className="h-3 w-3 text-ink-500" />
                              <span className="text-[10px] text-ink-200">{node.title}</span>
                              <span className={cn(
                                'h-1.5 w-1.5 rounded-full',
                                node.status === 'healthy' ? 'bg-emerald-400' :
                                node.status === 'at-risk' ? 'bg-amber-400' :
                                node.status === 'broken' ? 'bg-red-400' : 'bg-accent-400'
                              )} />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'graph' && (
        <div className="glass rounded-xl p-4">
          <div className="h-[550px]">
            <ItineraryGraph nodes={trip.nodes} edges={trip.edges} />
          </div>
        </div>
      )}

      {tab === 'map' && <MapView />}
      {tab === 'bookings' && <BookingsPage />}
      {tab === 'risks' && <RiskIntelligence />}
    </div>
  );
}
