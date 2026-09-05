import type { NodeStatus, EdgeStatus, ItineraryNodeData } from '@/types';

export const statusColors: Record<NodeStatus, { text: string; bg: string; border: string; dot: string; glow: string }> = {
  healthy: { text: 'text-emerald-600', bg: 'bg-emerald-500/10', border: 'border-emerald-500/40', dot: 'bg-emerald-500', glow: 'shadow-glow-green' },
  'at-risk': { text: 'text-amber-600', bg: 'bg-amber-500/10', border: 'border-amber-500/40', dot: 'bg-amber-500', glow: 'shadow-glow-amber' },
  broken: { text: 'text-red-600', bg: 'bg-red-500/10', border: 'border-red-500/40', dot: 'bg-red-500', glow: 'shadow-glow-red' },
  delayed: { text: 'text-orange-600', bg: 'bg-orange-500/10', border: 'border-orange-500/40', dot: 'bg-orange-500', glow: 'shadow-glow-amber' },
  cancelled: { text: 'text-red-600', bg: 'bg-red-500/10', border: 'border-red-500/40', dot: 'bg-red-500', glow: 'shadow-glow-red' },
  recovered: { text: 'text-accent-600', bg: 'bg-accent-500/10', border: 'border-accent-500/40', dot: 'bg-accent-500', glow: 'shadow-glow-cyan' },
};

// Deeper than the equivalent node-status shades on purpose - a 2-3px line
// needs more saturation than a filled badge to stay legible against the
// light canvas background.
export const edgeColors: Record<EdgeStatus, string> = {
  healthy: '#059669',
  'at-risk': '#d97706',
  broken: '#dc2626',
  recovered: '#0891b2',
};

export const statusLabel: Record<NodeStatus, string> = {
  healthy: 'Healthy',
  'at-risk': 'At Risk',
  broken: 'Broken',
  delayed: 'Delayed',
  cancelled: 'Cancelled',
  recovered: 'Recovered',
};

export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `+${m}m`;
  if (m === 0) return `+${h}h`;
  return `+${h}h ${m}m`;
}

export function riskColor(percent: number): string {
  if (percent >= 60) return 'text-red-600';
  if (percent >= 30) return 'text-amber-600';
  return 'text-emerald-600';
}

export function delayLabel(node: Pick<ItineraryNodeData, 'scheduledEnd' | 'actualEnd'>): string {
  if (node.scheduledEnd && node.actualEnd) {
    const minutes = Math.round((new Date(node.actualEnd).getTime() - new Date(node.scheduledEnd).getTime()) / 60000);
    if (minutes > 0) {
      const h = Math.floor(minutes / 60);
      const m = minutes % 60;
      return `DELAYED +${h > 0 ? `${h}h` : ''}${m > 0 ? `${m}m` : ''}`;
    }
  }
  return 'DELAYED';
}

export function riskBg(percent: number): string {
  if (percent >= 60) return 'bg-red-500';
  if (percent >= 30) return 'bg-amber-500';
  return 'bg-emerald-500';
}
