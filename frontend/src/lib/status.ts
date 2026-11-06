import type { NodeStatus, EdgeStatus, ItineraryNodeData } from '@/types';

export const statusColors: Record<NodeStatus, { text: string; bg: string; border: string; dot: string }> = {
  healthy: { text: 'text-safar-safe', bg: 'bg-safar-safe/10', border: 'border-safar-safe/30', dot: 'bg-safar-safe' },
  'at-risk': { text: 'text-safar-risk', bg: 'bg-safar-saffron/10', border: 'border-safar-saffron/40', dot: 'bg-safar-saffron' },
  broken: { text: 'text-safar-broken', bg: 'bg-safar-broken/10', border: 'border-safar-broken/30', dot: 'bg-safar-broken' },
  delayed: { text: 'text-safar-saffron', bg: 'bg-safar-saffron/10', border: 'border-safar-saffron/30', dot: 'bg-safar-saffron' },
  cancelled: { text: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-300', dot: 'bg-slate-500' },
  recovered: { text: 'text-safar-blue', bg: 'bg-safar-blue/10', border: 'border-safar-blue/30', dot: 'bg-safar-blue' },
};

export const edgeColors: Record<EdgeStatus, string> = {
  healthy: '#16A34A',
  'at-risk': '#F59E0B',
  broken: '#EF4444',
  recovered: '#2563EB',
};

export const statusLabel: Record<NodeStatus, string> = {
  healthy: 'On Track', 'at-risk': 'At Risk', broken: 'Broken', delayed: 'Delayed', cancelled: 'Cancelled', recovered: 'Recovered',
};

/** Semantic tones shared by every status surface: green = on track,
 * amber = at risk, red = disrupted, blue = recovered/informational, purple = AI. */
export type Tone = 'safe' | 'risk' | 'danger' | 'brand' | 'ai' | 'muted';

export const statusTone: Record<NodeStatus, Tone> = {
  healthy: 'safe', 'at-risk': 'risk', delayed: 'danger', broken: 'danger', cancelled: 'danger', recovered: 'brand',
};

export const toneClasses: Record<Tone, { pill: string; icon: string; text: string; solid: string; hex: string }> = {
  safe: { pill: 'bg-safe-light text-safe', icon: 'bg-safe-light text-safe', text: 'text-safe', solid: 'bg-safe', hex: '#16A34A' },
  risk: { pill: 'bg-risk-light text-risk-dark', icon: 'bg-risk-light text-risk', text: 'text-risk-dark', solid: 'bg-risk', hex: '#F59E0B' },
  danger: { pill: 'bg-danger-light text-danger-dark', icon: 'bg-danger-light text-danger', text: 'text-danger', solid: 'bg-danger', hex: '#EF4444' },
  brand: { pill: 'bg-brand-light text-brand', icon: 'bg-brand-light text-brand', text: 'text-brand', solid: 'bg-brand', hex: '#1F6BFF' },
  ai: { pill: 'bg-ai-light text-ai', icon: 'bg-ai-light text-ai', text: 'text-ai', solid: 'bg-ai', hex: '#7C3AED' },
  muted: { pill: 'bg-canvas text-ink-muted', icon: 'bg-canvas text-ink-muted', text: 'text-ink-muted', solid: 'bg-ink-faint', hex: '#8A97AD' },
};

export const riskTone: Record<'low' | 'medium' | 'high', Tone> = { low: 'safe', medium: 'risk', high: 'danger' };

export function formatCurrency(amount: number): string { return `₹${amount.toLocaleString('en-IN')}`; }
export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60); const m = minutes % 60;
  if (h === 0) return `+${m}m`; if (m === 0) return `+${h}h`; return `+${h}h ${m}m`;
}
export function riskColor(percent: number): string { if (percent >= 60) return 'text-safar-broken'; if (percent >= 30) return 'text-safar-risk'; return 'text-safar-safe'; }
export function delayLabel(node: Pick<ItineraryNodeData, 'scheduledEnd' | 'actualEnd'>): string {
  if (node.scheduledEnd && node.actualEnd) {
    const minutes = Math.round((new Date(node.actualEnd).getTime() - new Date(node.scheduledEnd).getTime()) / 60000);
    if (minutes > 0) { const h = Math.floor(minutes / 60); const m = minutes % 60; return `DELAYED +${h > 0 ? `${h}h` : ''}${m > 0 ? `${m}m` : ''}`; }
  }
  return 'DELAYED';
}
export function riskBg(percent: number): string { if (percent >= 60) return 'bg-safar-broken'; if (percent >= 30) return 'bg-safar-risk'; return 'bg-safar-safe'; }
