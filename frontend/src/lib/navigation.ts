import { BriefcaseBusiness, CalendarDays, CloudLightning, Compass, FileText, Home, MessageSquareText, Navigation, Radio, Settings, Sparkles } from 'lucide-react';
import type { Route } from '@/lib/router';

export interface NavItem { id: Route; label: string; icon: typeof Home }

export const primaryNav: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'bookings', label: 'My Bookings', icon: BriefcaseBusiness },
  { id: 'live', label: 'Live Updates', icon: Radio },
  { id: 'recovery', label: 'Recovery Options', icon: Sparkles },
  { id: 'assistant', label: 'AI Assistant', icon: MessageSquareText },
  { id: 'digital-twin', label: 'Digital Twin', icon: CloudLightning },
];

export const secondaryNav: NavItem[] = [
  { id: 'trip', label: 'Itinerary', icon: CalendarDays },
  { id: 'explore', label: 'Explore India', icon: Compass },
  { id: 'transport', label: 'Live Transport', icon: Navigation },
  { id: 'claims', label: 'Claims', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
];
