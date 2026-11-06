import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { HeroFallback } from '@/landing/hero/HeroFallback';
import type { HeroFocus } from '@/landing/hero/HeroScene';
import type { TimelineSample } from '@/landing/hero/timeline';

// three.js + R3F live in their own chunk, fetched only when the hero mounts.
const HeroScene = lazy(() => import('@/landing/hero/HeroScene'));

function webglAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  if (new URLSearchParams(window.location.search).get('hero') === 'static') return false;
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl2') || canvas.getContext('webgl')));
  } catch {
    return false;
  }
}

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <HeroFallback /> : this.props.children;
  }
}

interface HeroWorldProps {
  focus: HeroFocus;
  onSample: (sample: TimelineSample) => void;
}

/** The hero's 3D travel world, with graceful degradation: static art without
 * WebGL, a still frame under reduced motion, and no rendering off-screen. */
export function HeroWorld({ focus, onSample }: HeroWorldProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [supported] = useState(webglAvailable);
  const reducedMotion = usePrefersReducedMotion();
  const [active, setActive] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { threshold: 0.02 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="absolute inset-0">
      {supported ? (
        <SceneBoundary>
          <Suspense fallback={<HeroFallback />}>
            <HeroScene focus={focus} reducedMotion={reducedMotion} active={active} onSample={onSample} />
          </Suspense>
        </SceneBoundary>
      ) : (
        <HeroFallback />
      )}
    </div>
  );
}
