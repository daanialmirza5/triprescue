import { resolveDestinationImage, sceneImages } from '@/lib/destinationImages';
import { Plane, TrainFront } from 'lucide-react';

const stops = [
  { city: 'Mumbai', status: 'Departed', color: '#16A34A', left: '14%', top: '58%' },
  { city: 'Delhi', status: 'Delayed', color: '#EF4444', left: '46%', top: '38%' },
  { city: 'Agra', status: 'Recovered', color: '#12B5E5', left: '78%', top: '56%' },
];

/** Static hero art: shown without WebGL, while the 3D chunk loads, or if the
 * scene fails. Same story, same cards - just no motion. */
export function HeroFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true" data-testid="hero-fallback">
      <img src={sceneImages.heroTajMahal} alt="" className="absolute inset-0 h-full w-full object-cover opacity-45" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#EAF2FC]/70 via-transparent to-[#F4F7FC]" />
      <div className="absolute inset-y-0 right-0 hidden w-[62%] lg:block">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M16 60 C 25 20, 40 22, 48 40" fill="none" stroke="#EF4444" strokeWidth="0.35" strokeDasharray="1.2 1" />
          <path d="M48 40 C 58 60, 68 64, 80 58" fill="none" stroke="#12B5E5" strokeWidth="0.45" strokeDasharray="1.2 0.8" />
        </svg>
        <Plane className="absolute left-[30%] top-[24%] h-9 w-9 rotate-12 fill-white text-white drop-shadow-lg" />
        <TrainFront className="absolute left-[64%] top-[58%] h-8 w-8 text-brand drop-shadow" />
        {stops.map((s) => (
          <div key={s.city} className="absolute -translate-x-1/2 -translate-y-full" style={{ left: s.left, top: s.top }}>
            <div className="flex items-center gap-2.5 rounded-2xl border border-white/80 bg-white/90 p-1.5 pr-3.5 shadow-lift backdrop-blur">
              <img src={resolveDestinationImage(s.city)} alt="" className="h-11 w-14 rounded-xl object-cover" />
              <div className="leading-tight">
                <div className="text-sm font-bold text-ink">{s.city}</div>
                <div className="text-xs font-semibold" style={{ color: s.color }}>● {s.status}</div>
              </div>
            </div>
            <div className="mx-auto mt-2 h-3 w-3 rounded-full border-2 border-white shadow" style={{ background: s.color }} />
          </div>
        ))}
      </div>
    </div>
  );
}
