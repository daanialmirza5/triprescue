import { forwardRef, useMemo, type ReactNode } from 'react';
import * as THREE from 'three';

/** Lightweight procedural models for the hero scene. Everything is built from
 * a handful of primitives with shared materials, so the scene ships no model
 * files and stays well under a few thousand triangles. */

const mat = {
  white: new THREE.MeshStandardMaterial({ color: '#F7F9FC', roughness: 0.45, metalness: 0.1 }),
  blue: new THREE.MeshStandardMaterial({ color: '#1F6BFF', roughness: 0.4, metalness: 0.15 }),
  navy: new THREE.MeshStandardMaterial({ color: '#16305F', roughness: 0.5 }),
  glass: new THREE.MeshStandardMaterial({ color: '#0B1B3A', roughness: 0.15, metalness: 0.4 }),
  sandstone: new THREE.MeshStandardMaterial({ color: '#D8B58A', roughness: 0.85 }),
  redstone: new THREE.MeshStandardMaterial({ color: '#C98A67', roughness: 0.85 }),
  marble: new THREE.MeshStandardMaterial({ color: '#F4F0E8', roughness: 0.6 }),
  building: new THREE.MeshStandardMaterial({ color: '#DCE6F2', roughness: 0.8 }),
  buildingDark: new THREE.MeshStandardMaterial({ color: '#B9C9DE', roughness: 0.8 }),
  hill: new THREE.MeshStandardMaterial({ color: '#BCD2C4', roughness: 1, flatShading: true }),
  tree: new THREE.MeshStandardMaterial({ color: '#7FAE8A', roughness: 1, flatShading: true }),
  ground: new THREE.MeshStandardMaterial({ color: '#E3EBDD', roughness: 1 }),
  cloud: new THREE.MeshBasicMaterial({ color: '#FFFFFF', transparent: true, opacity: 0.78, depthWrite: false }),
};

// ---- Vehicles ------------------------------------------------------------------

/** A twin-engine airliner, nose along +Z so `lookAt` points it down the route. */
export const Airplane = forwardRef<THREE.Group, { children?: ReactNode }>(function Airplane({ children }, ref) {
  return (
    <group ref={ref}>
      <group rotation={[0, -Math.PI / 2, 0]} scale={0.62}>
        <mesh material={mat.white} rotation={[0, 0, -Math.PI / 2]} castShadow>
          <capsuleGeometry args={[0.32, 3, 6, 12]} />
        </mesh>
        <mesh material={mat.glass} position={[1.62, 0.1, 0]} rotation={[0, 0, -Math.PI / 2.4]}>
          <sphereGeometry args={[0.2, 10, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        </mesh>
        {/* main wings, slightly swept */}
        {[1, -1].map((s) => (
          <mesh key={s} material={mat.white} position={[0.05, -0.08, s * 1.35]} rotation={[0, s * 0.35, 0]}>
            <boxGeometry args={[0.7, 0.06, 2.4]} />
          </mesh>
        ))}
        {[1, -1].map((s) => (
          <mesh key={`e${s}`} material={mat.blue} position={[0.35, -0.3, s * 0.95]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.14, 0.12, 0.6, 10]} />
          </mesh>
        ))}
        {/* tail */}
        <mesh material={mat.blue} position={[-1.55, 0.5, 0]} rotation={[0, 0, 0.45]}>
          <boxGeometry args={[0.65, 0.75, 0.06]} />
        </mesh>
        {[1, -1].map((s) => (
          <mesh key={`t${s}`} material={mat.white} position={[-1.6, 0.05, s * 0.45]} rotation={[0, s * 0.4, 0]}>
            <boxGeometry args={[0.35, 0.05, 0.8]} />
          </mesh>
        ))}
        <mesh material={mat.blue} position={[0, -0.02, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <cylinderGeometry args={[0.325, 0.325, 2.2, 12, 1, true]} />
        </mesh>
      </group>
      {children}
    </group>
  );
});

function TrainCar({ lead = false }: { lead?: boolean }) {
  return (
    <group>
      <mesh material={mat.white} position={[0, 0.22, 0]}>
        <boxGeometry args={[1.1, 0.32, 0.34]} />
      </mesh>
      <mesh material={mat.blue} position={[0, 0.14, 0]}>
        <boxGeometry args={[1.11, 0.06, 0.35]} />
      </mesh>
      <mesh material={mat.glass} position={[0, 0.29, 0]}>
        <boxGeometry args={[0.95, 0.08, 0.352]} />
      </mesh>
      {lead && (
        <mesh material={mat.white} position={[0.62, 0.2, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.18, 0.4, 4, 1]} />
        </mesh>
      )}
    </group>
  );
}

/** Three cars; the parent positions each car along the rail curve. */
export function Train({ carRefs }: { carRefs: (el: THREE.Group | null, i: number) => void }) {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <group key={i} ref={(el) => carRefs(el, i)}>
          <TrainCar lead={i === 0} />
        </group>
      ))}
    </>
  );
}

// ---- Landmarks -----------------------------------------------------------------

function GatewayOfIndia() {
  return (
    <group>
      <mesh material={mat.sandstone} position={[0, 0.1, 0]}><boxGeometry args={[2.2, 0.2, 1]} /></mesh>
      {[-0.7, 0.7].map((x) => <mesh key={x} material={mat.sandstone} position={[x, 0.95, 0]}><boxGeometry args={[0.7, 1.5, 0.8]} /></mesh>)}
      <mesh material={mat.sandstone} position={[0, 1.95, 0]}><boxGeometry args={[2.1, 0.5, 0.85]} /></mesh>
      {[-0.95, -0.32, 0.32, 0.95].map((x) => (
        <group key={x} position={[x, 2.2, 0]}>
          <mesh material={mat.sandstone} position={[0, 0.25, 0]}><cylinderGeometry args={[0.13, 0.15, 0.5, 8]} /></mesh>
          <mesh material={mat.sandstone} position={[0, 0.55, 0]}><sphereGeometry args={[0.15, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2]} /></mesh>
        </group>
      ))}
    </group>
  );
}

function IndiaGate() {
  return (
    <group>
      <mesh material={mat.redstone} position={[0, 0.1, 0]}><boxGeometry args={[1.8, 0.2, 0.9]} /></mesh>
      {[-0.55, 0.55].map((x) => <mesh key={x} material={mat.redstone} position={[x, 1.25, 0]}><boxGeometry args={[0.55, 2.1, 0.7]} /></mesh>)}
      <mesh material={mat.redstone} position={[0, 2.55, 0]}><boxGeometry args={[1.7, 0.55, 0.75]} /></mesh>
      <mesh material={mat.redstone} position={[0, 2.95, 0]}><boxGeometry args={[1.2, 0.25, 0.55]} /></mesh>
      <mesh material={mat.redstone} position={[0, 3.18, 0]}><cylinderGeometry args={[0.28, 0.32, 0.22, 10]} /></mesh>
    </group>
  );
}

function TajMahal() {
  return (
    <group>
      <mesh material={mat.marble} position={[0, 0.12, 0]}><boxGeometry args={[3, 0.24, 3]} /></mesh>
      <mesh material={mat.marble} position={[0, 0.85, 0]}><boxGeometry args={[1.6, 1.2, 1.6]} /></mesh>
      <mesh material={mat.marble} position={[0, 1.6, 0]}><cylinderGeometry args={[0.55, 0.6, 0.35, 16]} /></mesh>
      <mesh material={mat.marble} position={[0, 2.05, 0]} scale={[1, 1.25, 1]}><sphereGeometry args={[0.62, 18, 14]} /></mesh>
      <mesh material={mat.sandstone} position={[0, 2.95, 0]}><coneGeometry args={[0.07, 0.4, 6]} /></mesh>
      {[[-0.55, -0.55], [0.55, -0.55], [-0.55, 0.55], [0.55, 0.55]].map(([x, z]) => (
        <mesh key={`${x}${z}`} material={mat.marble} position={[x, 1.65, z]}><sphereGeometry args={[0.2, 10, 8]} /></mesh>
      ))}
      {[[-1.35, -1.35], [1.35, -1.35], [-1.35, 1.35], [1.35, 1.35]].map(([x, z]) => (
        <group key={`m${x}${z}`} position={[x, 0.24, z]}>
          <mesh material={mat.marble} position={[0, 0.9, 0]}><cylinderGeometry args={[0.1, 0.13, 1.8, 8]} /></mesh>
          <mesh material={mat.marble} position={[0, 1.9, 0]}><sphereGeometry args={[0.14, 8, 6]} /></mesh>
        </group>
      ))}
    </group>
  );
}

function EiffelTower() {
  return (
    <group>
      <mesh material={mat.navy} position={[0, 1, 0]}><coneGeometry args={[0.9, 2, 4, 1, true]} /></mesh>
      <mesh material={mat.navy} position={[0, 2.6, 0]}><coneGeometry args={[0.35, 1.8, 4]} /></mesh>
      <mesh material={mat.navy} position={[0, 1.2, 0]}><boxGeometry args={[1, 0.1, 1]} /></mesh>
    </group>
  );
}

/** Generic fallback for destinations without a bespoke model: a slender tower. */
function GenericLandmark() {
  return (
    <group>
      <mesh material={mat.building} position={[0, 1.2, 0]}><cylinderGeometry args={[0.35, 0.5, 2.4, 8]} /></mesh>
      <mesh material={mat.blue} position={[0, 2.6, 0]}><sphereGeometry args={[0.4, 12, 10]} /></mesh>
    </group>
  );
}

const landmarks: Record<string, () => JSX.Element> = {
  mumbai: GatewayOfIndia,
  delhi: IndiaGate,
  agra: TajMahal,
  paris: EiffelTower,
};

/** Central landmark registry for the hero: any destination gets a model. */
export function Landmark({ city }: { city: string }) {
  const Model = landmarks[city.toLowerCase()] ?? GenericLandmark;
  return <Model />;
}

// ---- Environment ---------------------------------------------------------------

/** Deterministic pseudo-random so the skyline never reshuffles between renders. */
function seeded(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

export function Skyline({ position, seed, count = 14, spread = 3.2 }: { position: [number, number, number]; seed: number; count?: number; spread?: number }) {
  const blocks = useMemo(() => {
    const r = seeded(seed);
    return Array.from({ length: count }, () => {
      const w = 0.25 + r() * 0.35;
      const h = 0.4 + r() * 1.8;
      return { x: (r() - 0.5) * spread * 2, z: -0.8 - r() * 2.2, w, h, dark: r() > 0.6 };
    });
  }, [seed, count, spread]);
  return (
    <group position={position}>
      {blocks.map((b, i) => (
        <mesh key={i} material={b.dark ? mat.buildingDark : mat.building} position={[b.x, b.h / 2, b.z]}>
          <boxGeometry args={[b.w, b.h, b.w]} />
        </mesh>
      ))}
    </group>
  );
}

export function Terrain() {
  const hills = useMemo(() => {
    const r = seeded(7);
    return Array.from({ length: 10 }, () => ({ x: -16 + r() * 44, z: -24 - r() * 12, s: 3 + r() * 4, h: 1.2 + r() * 1.6 }));
  }, []);
  const trees = useMemo(() => {
    const r = seeded(21);
    return Array.from({ length: 22 }, () => ({ x: -5 + r() * 22, z: -5 + r() * 12, s: 0.12 + r() * 0.14 }));
  }, []);
  return (
    <group>
      <mesh material={mat.ground} rotation={[-Math.PI / 2, 0, 0]} position={[4, 0, 0]} receiveShadow>
        <circleGeometry args={[40, 48]} />
      </mesh>
      {hills.map((h, i) => (
        <mesh key={i} material={mat.hill} position={[h.x, h.h / 2 - 0.05, h.z]}>
          <coneGeometry args={[h.s, h.h, 6]} />
        </mesh>
      ))}
      {trees.map((t, i) => (
        <mesh key={`t${i}`} material={mat.tree} position={[t.x, t.s, t.z]}>
          <coneGeometry args={[t.s * 0.7, t.s * 2.2, 5]} />
        </mesh>
      ))}
    </group>
  );
}

export function CloudPuff({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      {[[0, 0, 0, 1], [0.9, -0.15, 0.1, 0.75], [-0.85, -0.2, 0, 0.7], [0.35, 0.35, -0.2, 0.65]].map(([x, y, z, s], i) => (
        <mesh key={i} material={mat.cloud} position={[x, y, z]} scale={s}>
          <icosahedronGeometry args={[0.8, 3]} />
        </mesh>
      ))}
    </group>
  );
}

