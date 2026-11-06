import { useState } from 'react';
import { cn } from '@/lib/utils';
import { parseDate, sameDay, tripsOnDay } from '@/lib/journey';
import type { Trip } from '@/types';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface TravelCalendarProps {
  trips: Trip[];
  selectedDay: Date | null;
  onSelectDay: (day: Date | null) => void;
  /** Month to open on; defaults to the next upcoming trip, else today. */
  initialMonth?: Date;
}


export function TravelCalendar({ trips, selectedDay, onSelectDay, initialMonth }: TravelCalendarProps) {
  const today = new Date();
  const [month, setMonth] = useState(() => {
    const m = initialMonth ?? today;
    return new Date(m.getFullYear(), m.getMonth(), 1);
  });
  const firstWeekday = month.getDay();
  const cells = Array.from({ length: 42 }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i - firstWeekday + 1));
  const starts = trips.map((t) => parseDate(t.startDate)).filter((d): d is Date => !!d);

  return (
    <section className="card p-5" aria-labelledby="calendar-title">
      <div className="flex items-center justify-between">
        <h2 id="calendar-title" className="section-title">Travel Calendar</h2>
        <button onClick={() => { onSelectDay(null); setMonth(new Date(today.getFullYear(), today.getMonth(), 1)); }} className="flex items-center gap-1 text-sm font-semibold text-brand">View All <ArrowRight className="h-4 w-4" /></button>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="text-[15px] font-bold text-ink" aria-live="polite">{month.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</div>
        <div className="flex gap-1">
          <button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} className="rounded-lg p-1.5 text-ink hover:bg-canvas" aria-label="Previous month"><ChevronLeft className="h-5 w-5" /></button>
          <button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} className="rounded-lg p-1.5 text-ink hover:bg-canvas" aria-label="Next month"><ChevronRight className="h-5 w-5" /></button>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-7 gap-y-1 text-center" role="grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => <div key={d} className="pb-1 text-xs text-ink-muted" role="columnheader">{d}</div>)}
        {cells.map((day) => {
          const inMonth = day.getMonth() === month.getMonth();
          const onTrip = tripsOnDay(trips, day).length > 0;
          const isStart = starts.some((s) => sameDay(s, day));
          const isToday = sameDay(day, today);
          const isSelected = selectedDay ? sameDay(day, selectedDay) : false;
          return (
            <button
              key={day.toISOString()}
              onClick={() => onSelectDay(isSelected ? null : day)}
              aria-pressed={isSelected}
              aria-label={`${day.toDateString()}${onTrip ? ', has travel' : ''}`}
              className={cn(
                'mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm transition',
                !inMonth && 'text-ink-faint/60',
                inMonth && 'text-ink',
                onTrip && !isStart && 'bg-brand-light font-semibold text-brand',
                isStart && 'bg-brand font-bold text-white shadow-glow',
                isToday && !isStart && 'ring-2 ring-brand/40',
                isSelected && 'ring-2 ring-ink',
                !onTrip && !isStart && 'hover:bg-canvas'
              )}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </section>
  );
}
