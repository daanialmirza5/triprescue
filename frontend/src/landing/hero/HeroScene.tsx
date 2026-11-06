import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, Line, Sparkles } from '@react-three/drei';
import { Airplane, CloudPuff, Landmark, Skyline, Terrain, Train } from '@/landing/hero/models';
import { LOOP_SECONDS, STILL_FRAME_SECONDS, sampleTimeline, type StopStatus, type TimelineSample } from '@/landing/hero/timeline';
import { resolveDestinationImage } from '@/lib/destinationImages';
import { cn } from '@/lib/utils';

export type HeroFocus = 'flights' | 'trains' | 'hotels' | 'transfers';

interface HeroSceneProps {
  focus: HeroFocus;
  reducedMotion: boolean;
  /** False while the hero is scrolled out of view: rendering pauses entirely. */
  active: boolean;
  onSample: (sample: TimelineSample) => void;
}

const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

const CITIES = {
  mumbai: { name: 'Mumbai', code: 'BOM', pos: V(-1, 0, 3.5), landmark: V(-1.4, 0, 2.2), card: 'Gateway of India' },
  delhi: { name: 'Delhi', code: 'DEL', pos: V(5.5, 0, -1.5), landmark: V(5.2, 0, -2.8), card: 'India Gate' },
  agra: { name: 'Agra', code: 'AGC', pos: V(10.8, 0, 2.8), landmark: V(11.5, 0, 1), card: 'Taj Mahal' },
} as const;
type CityKey = keyof typeof CITIES;

const FLIGHT = new THREE.CatmullRomCurve3([V(-1, 0.8, 3.5), V(0.8, 3.6, 2.6), V(3.2, 4.7, 0.8), V(5, 2.3, -1), V(5.5, 0.8, -1.5)]);
const RAIL = new THREE.CatmullRomCurve3([V(5.8, 0.12, -1.1), V(7, 0.12, 1.6), V(8.8, 0.12, 3.8), V(10.3, 0.12, 3.6), V(10.8, 0.12, 2.9)]);

const statusColor: Record<StopStatus, string> = {
  'on-track': '#16A34A', departed: '#16A34A', delayed: '#EF4444', 'at-risk': '#F59E0B', recovered: '#12B5E5',
};
const statusLabel: Record<StopStatus, string> = {
  'on-track': 'On Track', departed: 'Departed', delayed: 'Delayed', 'at-risk': 'At Risk', recovered: 'Recovered',
};

/** Trail of small glowing beads along a curve, revealed up to `progress`. */
function Trail({ curve, count, progressRef, color }: { curve: THREE.Curve<THREE.Vector3>; count: number; progressRef: React.MutableRefObject<number>; color: string }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const points = useMemo(() => Array.from({ length: count }, (_, i) => curve.getPointAt(i / (count - 1))), [curve, count]);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  useFrame(() => {
    if (!mesh.current) return;
    const p = progressRef.current;
    points.forEach((pt, i) => {
      const t = i / (count - 1);
      const visible = t <= p;
      dummy.position.copy(pt);
      dummy.scale.setScalar(visible ? 0.55 + 0.45 * Math.max(0, 1 - (p - t) * 6) : 0.0001);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
      <sphereGeometry args={[0.06, 8, 6]} />
      <meshBasicMaterial color={color} transparent opacity={0.9} toneMapped={false} />
    </instancedMesh>
  );
}

function PulseRing({ color }: { color: string }) {
  const ring = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ring.current) return;
    const k = (clock.elapsedTime % 2) / 2;
    ring.current.scale.setScalar(0.6 + k * 1.6);
    (ring.current.material as THREE.MeshBasicMaterial).opacity = 0.55 * (1 - k);
  });
  return (
    <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
      <ringGeometry args={[0.35, 0.5, 32]} />
      <meshBasicMaterial color={color} transparent toneMapped={false} />
    </mesh>
  );
}

function CityMarker({ city, status, selected, onToggle, extra, compact }: { city: CityKey; status: StopStatus; selected: boolean; onToggle: () => void; extra?: string; compact: boolean }) {
  const c = CITIES[city];
  const [hovered, setHovered] = useState(false);
  const color = statusColor[status];
  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : '';
    return () => { document.body.style.cursor = ''; };
  }, [hovered]);
  return (
    <group position={c.pos}>
      <PulseRing color={color} />
      <mesh position={[0, 0.25, 0]} scale={hovered || selected ? 1.35 : 1} onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }} onPointerOut={() => setHovered(false)} onClick={(e) => { e.stopPropagation(); onToggle(); }}>
        <sphereGeometry args={[0.22, 16, 12]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.55} />
      </mesh>
      <Html position={[0, 3.9, 0]} center zIndexRange={[5, 0]} wrapperClass="ss-hero-html" style={{ transform: city === 'agra' ? (compact ? 'translateX(-30%)' : 'translateX(-38%)') : undefined }}>
        <button
          onClick={onToggle}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={cn('ss-float flex items-center gap-2.5 whitespace-nowrap rounded-2xl border border-white/80 bg-white/90 p-1.5 pr-3.5 text-left shadow-lift backdrop-blur-md transition', (hovered || selected) && 'scale-105 border-brand/40')}
          aria-label={`${c.name}: ${statusLabel[status]}`}
          aria-expanded={selected}
        >
          {!compact && <img src={resolveDestinationImage(c.name)} alt="" className="h-11 w-14 rounded-xl object-cover" />}
          <span className="leading-tight">
            <span className="block text-sm font-bold text-ink">{c.name}</span>
            <span className="mt-0.5 flex items-center gap-1 text-xs font-semibold" style={{ color }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />{statusLabel[status]}
            </span>
          </span>
        </button>
        {selected && (
          <div className="mt-2 w-56 rounded-2xl border border-line bg-white p-3 text-xs text-ink-soft shadow-lift animate-scale-in">
            <div className="font-bold text-ink">{c.name} ({c.code})</div>
            <div className="mt-0.5 text-ink-muted">{c.card}</div>
            <div className="mt-2">{cityDetail(city, status)}</div>
            {extra && <div className="mt-1.5 font-semibold text-brand">{extra}</div>}
          </div>
        )}
      </Html>
    </group>
  );
}

function cityDetail(city: CityKey, status: StopStatus) {
  if (city === 'mumbai') return 'UA 901 departed 08:00 AM from Terminal 2.';
  if (city === 'delhi') return status === 'delayed' ? 'Arrival pushed to 11:50 AM (+95 min). Safar Sathi re-checked every downstream booking.' : 'Arriving 10:15 AM · 70 min connection to the Agra train.';
  return status === 'at-risk' ? 'Train connection at risk: only 45 min buffer left.' : status === 'recovered' ? 'Rebooked onto the next express · hotel check-in protected.' : 'Arriving 03:05 PM · Taj hotel check-in at 04:00 PM.';
}

function CameraRig({ reducedMotion }: { reducedMotion: boolean }) {
  const { camera, size } = useThree();
  const pointer = useRef({ x: 0, y: 0 });
  const scroll = useRef(0);
  const target = useMemo(() => new THREE.Vector3(), []);
  // On wide screens the copy sits on the left: shift the projection so the
  // world composes into the right ~60% of the hero, as in the reference.
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    // Below the lg breakpoint the world has its own band under the copy.
    if (window.innerWidth < 1024) cam.clearViewOffset();
    else cam.setViewOffset(size.width, size.height, -size.width * 0.21, -size.height * 0.02, size.width, size.height);
    cam.updateProjectionMatrix();
  }, [camera, size.width, size.height]);
  useEffect(() => {
    const move = (e: PointerEvent) => { pointer.current = { x: e.clientX / window.innerWidth - 0.5, y: e.clientY / window.innerHeight - 0.5 }; };
    const onScroll = () => { scroll.current = Math.min(1, window.scrollY / window.innerHeight); };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('scroll', onScroll); };
  }, []);
  useFrame((_, dt) => {
    const narrow = window.innerWidth < 1024;
    const phone = window.innerWidth < 640;
    const base = narrow ? (phone ? V(5.4, 11.5, 24) : V(5.2, 9.5, 21)) : V(3.5, 13, 28.5);
    const look = narrow ? V(5.3, phone ? 2.4 : 0.6, 1) : V(5.8, 0.2, 0.5);
    const motion = reducedMotion ? 0 : 1;
    // Scroll-driven camera drift only where the world sits behind the hero copy.
    const drift = narrow ? 0 : scroll.current;
    const want = V(
      base.x + pointer.current.x * 1.6 * motion,
      base.y - pointer.current.y * 0.8 * motion + drift * 2.5,
      base.z - drift * 2.5,
    );
    camera.position.lerp(want, reducedMotion ? 1 : Math.min(1, dt * 2.2));
    target.lerp(look, reducedMotion ? 1 : Math.min(1, dt * 2.2));
    camera.lookAt(target);
  });
  return null;
}

function Story({ focus, reducedMotion, onSample }: Omit<HeroSceneProps, 'active'>) {
  const plane = useRef<THREE.Group>(null);
  const cars = useRef<(THREE.Group | null)[]>([]);
  const clouds = useRef<THREE.Group>(null);
  const time = useRef(reducedMotion ? STILL_FRAME_SECONDS : 0);
  const flightProgress = useRef(0);
  const trainProgress = useRef(0);
  const [sample, setSample] = useState(() => sampleTimeline(time.current));
  const [selected, setSelected] = useState<CityKey | 'flight' | null>(null);
  const compact = useThree((st) => st.size.width < 640);
  const lastKey = useRef('');
  const tmp = useMemo(() => ({ tangent: new THREE.Vector3(), ahead: new THREE.Vector3(), look: new THREE.Vector3() }), []);

  useFrame((_, dt) => {
    if (!reducedMotion) time.current = (time.current + Math.min(dt, 0.1)) % LOOP_SECONDS;
    const s = sampleTimeline(time.current);
    flightProgress.current = s.flight;
    trainProgress.current = s.train;

    // Airplane: follow the curve, face along its tangent, bank into the turn.
    if (plane.current) {
      const t = Math.min(0.999, Math.max(0.001, s.flight));
      const pos = FLIGHT.getPointAt(t);
      FLIGHT.getTangentAt(t, tmp.tangent);
      FLIGHT.getTangentAt(Math.min(0.999, t + 0.02), tmp.ahead);
      plane.current.position.copy(pos);
      plane.current.lookAt(tmp.look.copy(pos).add(tmp.tangent));
      // Bank gently into the turn (roll about the local forward axis).
      const turn = tmp.tangent.x * tmp.ahead.z - tmp.tangent.z * tmp.ahead.x;
      plane.current.rotateZ(THREE.MathUtils.clamp(turn * 18, -0.35, 0.35));
      plane.current.visible = s.flight < 0.995;
    }
    // Train: three cars spaced along the rail.
    cars.current.forEach((car, i) => {
      if (!car) return;
      const t = Math.min(0.999, Math.max(0.001, s.train - i * 0.035));
      const pos = RAIL.getPointAt(t);
      RAIL.getTangentAt(t, tmp.tangent);
      car.position.copy(pos);
      car.rotation.set(0, Math.atan2(-tmp.tangent.z, tmp.tangent.x), 0);
      car.visible = s.train > 0.001 || i === 0;
    });
    if (clouds.current && !reducedMotion) {
      clouds.current.children.forEach((c, i) => {
        c.position.x += dt * (0.12 + i * 0.02);
        if (c.position.x > 22) c.position.x = -12;
      });
    }
    const key = `${s.phase}|${s.flightStatus}|${s.railStatus}|${s.stops.delhi}|${s.stops.agra}`;
    if (key !== lastKey.current) {
      lastKey.current = key;
      setSample(s);
      onSample(s);
    }
  });

  const flightColor = sample.flightStatus === 'delayed' ? '#FF6B6B' : '#FFFFFF';
  const railColor = sample.railStatus === 'at-risk' ? '#F59E0B' : sample.railStatus === 'scheduled' ? '#7DB4FF' : sample.railStatus === 'recovered' ? '#12B5E5' : '#16A34A';
  const flightPts = useMemo(() => FLIGHT.getPoints(90), []);
  const railPts = useMemo(() => RAIL.getPoints(90), []);
  const dim = (on: boolean) => (on ? 1 : 0.35);

  return (
    <>
      <Terrain />
      <Skyline position={[-1, 0, 1.8]} seed={3} />
      <Skyline position={[5.6, 0, -3.3]} seed={5} count={16} />
      <Skyline position={[10.8, 0, -0.6]} seed={9} count={8} spread={2.4} />
      {(Object.keys(CITIES) as CityKey[]).map((k) => (
        <group key={k} position={CITIES[k].landmark} scale={k === 'agra' ? 1.05 : 0.95}>
          <Landmark city={k} />
        </group>
      ))}

      {/* Routes: faint full path + revealed trail of travel particles */}
      <Line points={flightPts} color={flightColor} lineWidth={1.6} dashed dashSize={0.25} gapSize={0.18} transparent opacity={0.85 * dim(focus !== 'trains')} />
      <Trail curve={FLIGHT} count={60} progressRef={flightProgress} color={sample.flightStatus === 'delayed' ? '#FF8A8A' : '#BFE9FF'} />
      <Line points={railPts} color={railColor} lineWidth={2.4} dashed={sample.railStatus !== 'recovered'} dashSize={0.2} gapSize={0.14} transparent opacity={dim(focus !== 'flights')} />
      <Trail curve={RAIL} count={40} progressRef={trainProgress} color="#8BE3FF" />

      <Airplane ref={plane}>
        <Html position={[0, 0.9, 0]} center zIndexRange={[6, 0]}>
          <button
            onClick={() => setSelected((s) => (s === 'flight' ? null : 'flight'))}
            className={cn('flex items-center gap-2.5 whitespace-nowrap rounded-2xl border bg-white/92 px-3 py-2 text-left shadow-lift backdrop-blur-md transition', sample.flightStatus === 'delayed' ? 'border-danger/40' : 'border-white/80', focus === 'trains' && 'opacity-60')}
            aria-label="Flight UA 901 status"
            aria-expanded={selected === 'flight'}
          >
            <span className={cn('h-2 w-2 rounded-full', sample.flightStatus === 'delayed' ? 'bg-danger animate-pulse' : 'bg-safe')} />
            <span className="leading-tight">
              <span className="block text-sm font-bold text-ink">UA 901</span>
              <span className={cn('block text-xs font-semibold', sample.flightStatus === 'delayed' ? 'text-danger' : 'text-safe')}>
                {sample.flightStatus === 'delayed' ? '+95 min delay' : sample.flightStatus === 'landed' ? 'Landed' : 'On Track'}
              </span>
            </span>
            {!compact && <span className="border-l border-line pl-2.5 text-xs text-ink-muted">BOM → DEL</span>}
          </button>
          {selected === 'flight' && (
            <div className="mt-2 w-60 rounded-2xl border border-line bg-white p-3 text-xs text-ink-soft shadow-lift animate-scale-in">
              <div className="font-bold text-ink">Flight UA 901</div>
              <div className="text-ink-muted">Mumbai → Delhi</div>
              <div className={cn('mt-2 font-semibold', sample.flightStatus === 'delayed' ? 'text-danger' : 'text-safe')}>{sample.flightStatus === 'on-track' ? 'On schedule · arrives 10:15 AM' : '+95 min delay · arrives 11:50 AM'}</div>
              <div className="mt-1">Downstream: Delhi → Agra train {sample.railStatus === 'at-risk' ? 'at risk' : sample.railStatus === 'scheduled' ? 'on track' : 'protected by Safar Sathi'}.</div>
            </div>
          )}
        </Html>
      </Airplane>
      <Train carRefs={(el, i) => { cars.current[i] = el; }} />

      <CityMarker compact={compact} city="mumbai" status={sample.stops.mumbai} selected={selected === 'mumbai'} onToggle={() => setSelected((s) => (s === 'mumbai' ? null : 'mumbai'))} />
      <CityMarker compact={compact} city="delhi" status={sample.stops.delhi} selected={selected === 'delhi'} onToggle={() => setSelected((s) => (s === 'delhi' ? null : 'delhi'))} extra={focus === 'transfers' ? 'Transfer: airport → New Delhi station, 50 min' : undefined} />
      <CityMarker compact={compact} city="agra" status={sample.stops.agra} selected={selected === 'agra'} onToggle={() => setSelected((s) => (s === 'agra' ? null : 'agra'))} extra={focus === 'hotels' ? 'Hotel: Taj, check-in 4:00 PM' : undefined} />

      <group ref={clouds}>
        <CloudPuff position={[-6, 8.5, -14]} scale={1.6} />
        <CloudPuff position={[3, 9.5, -18]} scale={2.1} />
        <CloudPuff position={[11, 8, -12]} scale={1.3} />
        <CloudPuff position={[18, 10, -20]} scale={2.4} />
        <CloudPuff position={[8, 6.8, -6]} scale={0.7} />
      </group>
      {!reducedMotion && <Sparkles count={36} scale={[26, 7, 14]} position={[5, 4, 0]} size={2.2} speed={0.25} opacity={0.55} color="#ffffff" />}
    </>
  );
}

export default function HeroScene({ focus, reducedMotion, active, onSample }: HeroSceneProps) {
  return (
    <Canvas
      className="!absolute inset-0"
      dpr={[1, 1.5]}
      frameloop={!active ? 'never' : reducedMotion ? 'demand' : 'always'}
      camera={{ position: [3.5, 12.5, 27], fov: 34, near: 0.1, far: 160 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      aria-hidden="true"
    >
      <fog attach="fog" args={['#EDF3FB', 36, 78]} />
      <hemisphereLight args={['#DDEBFF', '#EAD9C4', 0.75]} />
      <directionalLight position={[10, 14, 8]} intensity={2} color="#FFE2C2" />
      <directionalLight position={[-8, 6, -6]} intensity={0.35} color="#BFD8FF" />
      <CameraRig reducedMotion={reducedMotion} />
      <Story focus={focus} reducedMotion={reducedMotion} onSample={onSample} />
    </Canvas>
  );
}
