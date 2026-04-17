import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  Environment, Sparkles, Float, MeshDistortMaterial, MeshReflectorMaterial,
  useProgress, Html, Sphere, RoundedBox,
} from '@react-three/drei';
import { EffectComposer, Bloom, SMAA } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import useBeautyStore from '../../store/beautyStore';

// ─── Math helpers ─────────────────────────────────────────────────────────────
const lerp = THREE.MathUtils.lerp;
const clamp = THREE.MathUtils.clamp;
const damp = THREE.MathUtils.damp;

function easeInOut(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }

function zoneProgress(scrollP, start, end) {
  return easeInOut(clamp((scrollP - start) / (end - start), 0, 1));
}

// ─── Camera rig ───────────────────────────────────────────────────────────────
function CameraRig() {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 0, 8));
  const targetLook = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    const { scrollProgress, mouseNorm, hoveredCard } = useBeautyStore.getState();

    // Zone-based camera positions
    const z0 = zoneProgress(scrollProgress, 0, 0.12);    // hero arrival
    const z1 = zoneProgress(scrollProgress, 0.15, 0.38); // expansion
    const z2 = zoneProgress(scrollProgress, 0.75, 0.95); // reassemble-zoom

    // Zone 0: close-in cinematic detail
    const px = lerp(0, -2.5, z1) * (1 - z2 * 0.4);
    const py = lerp(0.3, 0.2, z1);
    const pz = lerp(9, 6.5, z1) * lerp(1, 0.95, z2);

    targetPos.current.set(px, py, pz);

    // Subtle mouse parallax on camera
    targetPos.current.x += mouseNorm.x * 0.3;
    targetPos.current.y += mouseNorm.y * 0.15;

    // Hover nudge — camera tilts slightly toward hovered card
    if (hoveredCard === 'skincare') targetPos.current.x -= 0.3;
    if (hoveredCard === 'makeup')   targetPos.current.x += 0.3;

    camera.position.lerp(targetPos.current, damp(0, 1, 3.5, delta));
    camera.lookAt(targetLook.current);
  });

  return null;
}

// ─── Procedural ornate compact ────────────────────────────────────────────────
const ROSE_GOLD   = new THREE.Color('#B76E79');
const BRASS_GOLD  = new THREE.Color('#C5A059');
const BABY_PINK   = new THREE.Color('#F8C8DC');
const DEEP_PINK   = new THREE.Color('#E8B4B8');
const BLUSH_PAN   = new THREE.Color('#F9C4D2');
const MIRROR_COL  = new THREE.Color('#ffffff');

function useRoseGoldMat() {
  return useMemo(() => new THREE.MeshPhysicalMaterial({
    color: ROSE_GOLD, metalness: 1.0, roughness: 0.15, envMapIntensity: 2.0,
  }), []);
}
function useEnamelMat(col = BABY_PINK) {
  return useMemo(() => new THREE.MeshPhysicalMaterial({
    color: col, clearcoat: 1, clearcoatRoughness: 0.1,
    roughness: 0.2, metalness: 0.1,
  }), [col]);
}
function useMirrorMat() {
  return useMemo(() => new THREE.MeshPhysicalMaterial({
    color: MIRROR_COL, metalness: 1, roughness: 0,
    envMapIntensity: 3,
  }), []);
}
function useGlassMat() {
  return useMemo(() => new THREE.MeshPhysicalMaterial({
    transmission: 1, thickness: 1.2, roughness: 0.02,
    ior: 1.45, color: new THREE.Color('#fce4ec'),
    transparent: true,
  }), []);
}

// Gem material — rich jewel
function useGemMat(col = '#E91E8C') {
  return useMemo(() => new THREE.MeshPhysicalMaterial({
    color: col, metalness: 0.3, roughness: 0,
    transmission: 0.4, ior: 2.4, clearcoat: 1,
    clearcoatRoughness: 0, envMapIntensity: 3,
  }), [col]);
}

// ─── Individual mesh parts ────────────────────────────────────────────────────
function OrnateCompact({ masterRef }) {
  const lidRef        = useRef();
  const baseRef       = useRef();
  const innerPanRef   = useRef();
  const mirrorRef     = useRef();
  const rimRef        = useRef();
  const filigree1Ref  = useRef();
  const filigree2Ref  = useRef();
  const gem1Ref       = useRef();
  const gem2Ref       = useRef();
  const gem3Ref       = useRef();
  const gem4Ref       = useRef();
  const gem5Ref       = useRef();
  const gem6Ref       = useRef();
  const centerGemRef  = useRef();
  const dropper1Ref   = useRef();
  const dropper2Ref   = useRef();

  const roseGoldMat = useRoseGoldMat();
  const enamelMat   = useEnamelMat(BABY_PINK);
  const darkEnamel  = useEnamelMat(DEEP_PINK);
  const mirrorMat   = useMirrorMat();
  const gemMat      = useGemMat('#E91E8C');
  const gemMatPink  = useGemMat('#F48FB1');
  const glassMat    = useGlassMat();
  const blushMat    = useMemo(() => new THREE.MeshStandardMaterial({
    color: BLUSH_PAN, roughness: 0.95, metalness: 0,
  }), []);
  const brassMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: BRASS_GOLD, metalness: 1, roughness: 0.1, envMapIntensity: 1.5,
  }), []);

  // Gem world positions for explosion radial movement
  const gemBasePositions = useMemo(() => [
    [0,    0.42,  1.0 ],   // front
    [0.87, 0.42,  0.5 ],   // front-right
    [0.87, 0.42, -0.5 ],   // back-right
    [0,    0.42, -1.0 ],   // back
    [-0.87,0.42, -0.5 ],   // back-left
    [-0.87,0.42,  0.5 ],   // front-left
  ], []);

  const gemRefs = [gem1Ref, gem2Ref, gem3Ref, gem4Ref, gem5Ref, gem6Ref];

  useFrame((state, delta) => {
    const { scrollProgress, hoveredCard } = useBeautyStore.getState();

    // ── Explosion progress (zone 2) ──────────────────────────────────────────
    const explodeP = zoneProgress(scrollProgress, 0.40, 0.62);
    const reassemP = zoneProgress(scrollProgress, 0.72, 0.88);
    const finalP   = zoneProgress(scrollProgress, 0.75, 1.0);

    // Net explosion (backs down during reassembly)
    const ep = lerp(explodeP, 0, reassemP);

    // LID — floats upward
    if (lidRef.current) {
      lidRef.current.position.y  = lerp(0.38, 4.2, ep);
      lidRef.current.rotation.x  = lerp(0, -0.35, ep);
      lidRef.current.rotation.z  = lerp(0, 0.12, ep);
    }

    // BASE — drops down
    if (baseRef.current) {
      baseRef.current.position.y = lerp(0, -2.2, ep);
    }

    // INNER PAN — revealed, scales up, rotates
    if (innerPanRef.current) {
      innerPanRef.current.position.y = lerp(-0.08, 0.6, ep);
      innerPanRef.current.scale.setScalar(lerp(1, 1.25, ep));
      innerPanRef.current.rotation.y += delta * lerp(0, 0.8, ep);
    }

    // MIRROR — moves up to meet lid
    if (mirrorRef.current) {
      mirrorRef.current.position.y = lerp(0.36, 4.1, ep);
    }

    // GEMS — fly outward radially
    gemRefs.forEach((ref, i) => {
      if (!ref.current) return;
      const base = gemBasePositions[i];
      const outX = base[0] * lerp(1, 2.8, ep);
      const outZ = base[2] * lerp(1, 2.8, ep);
      const outY = lerp(base[1], base[1] + 1.5 * ep, ep);
      ref.current.position.set(outX, outY, outZ);
      ref.current.rotation.y += delta * 1.2;
    });

    // CENTER GEM — rises to apex
    if (centerGemRef.current) {
      centerGemRef.current.position.y = lerp(0.44, 6.5, ep);
      centerGemRef.current.scale.setScalar(lerp(1, 1.8, ep));
    }

    // FILIGREE — expands outward
    if (filigree1Ref.current) {
      filigree1Ref.current.scale.setScalar(lerp(1, 1.4, ep));
      filigree1Ref.current.position.y = lerp(0.38, 4.3, ep);
    }
    if (filigree2Ref.current) {
      filigree2Ref.current.scale.setScalar(lerp(1, 1.35, ep));
      filigree2Ref.current.position.y = lerp(-0.02, -2.3, ep);
    }

    // DROPPERS — decorative elements drift apart
    if (dropper1Ref.current) {
      dropper1Ref.current.position.x = lerp(0.55, 2.2, ep);
      dropper1Ref.current.position.y = lerp(0.1, 1.8, ep);
      dropper1Ref.current.rotation.z = lerp(0, -0.4, ep);
    }
    if (dropper2Ref.current) {
      dropper2Ref.current.position.x = lerp(-0.55, -2.2, ep);
      dropper2Ref.current.position.y = lerp(0.1, 1.8, ep);
      dropper2Ref.current.rotation.z = lerp(0, 0.4, ep);
    }

    // ── MASTER GROUP animation ──────────────────────────────────────────────
    if (!masterRef.current) return;

    // Zone 0: centered hero rotation
    const z1 = zoneProgress(scrollProgress, 0.15, 0.38);
    const z3 = zoneProgress(scrollProgress, 0.75, 0.95);

    // Position: center → right (zone 1) → top-right (zone 3)
    const targetX = lerp(lerp(0, 1.8, z1), 3.0, z3);
    const targetY = lerp(lerp(0, 0.1, z1), 2.0, z3);
    const targetS = lerp(1, 0.52, z3);

    masterRef.current.position.x = damp(masterRef.current.position.x, targetX, 4, delta);
    masterRef.current.position.y = damp(masterRef.current.position.y, targetY, 4, delta);
    masterRef.current.scale.setScalar(damp(masterRef.current.scale.x, targetS, 4, delta));

    // Tilt in zone 1 for depth illusion
    masterRef.current.rotation.x = damp(masterRef.current.rotation.x, lerp(0, 0.2, z1) * (1 - z3), 4, delta);
    masterRef.current.rotation.z = damp(masterRef.current.rotation.z, lerp(0, -0.12, z1) * (1 - z3), 4, delta);

    // Continuous Y rotation (slows in zone 2 explosion)
    const rotSpeed = lerp(lerp(0.32, 0.2, z1), 0.15, zoneProgress(scrollProgress, 0.38, 0.45));
    masterRef.current.rotation.y += delta * rotSpeed;

    // Alive float
    masterRef.current.position.y += Math.sin(state.clock.elapsedTime * 0.7) * 0.003;

    // Hover nudge - compact "looks" toward hovered card
    if (hoveredCard === 'skincare') {
      masterRef.current.rotation.y = damp(masterRef.current.rotation.y, -0.6, 2, delta);
    }
  });

  return (
    <group ref={masterRef}>
      {/* ── BASE CASING ─────────────────────────────────────────────────── */}
      <group ref={baseRef}>
        {/* Main cylinder */}
        <mesh material={darkEnamel} castShadow receiveShadow>
          <cylinderGeometry args={[1.15, 1.18, 0.42, 64]} />
        </mesh>
        {/* Bottom rim ring */}
        <mesh material={roseGoldMat} position={[0, -0.19, 0]}>
          <torusGeometry args={[1.17, 0.035, 16, 80]} />
        </mesh>
        {/* Engraved side band */}
        <mesh material={brassMat} position={[0, 0, 0]}>
          <torusGeometry args={[1.185, 0.018, 8, 80]} />
        </mesh>
        {/* Bottom face */}
        <mesh material={enamelMat} position={[0, -0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.15, 64]} />
        </mesh>

        {/* Filigree outer ring on base */}
        <group ref={filigree2Ref} position={[0, -0.02, 0]}>
          {[...Array(12)].map((_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            return (
              <mesh key={i} material={roseGoldMat}
                position={[Math.cos(angle) * 1.12, 0.01, Math.sin(angle) * 1.12]}
                rotation={[0, -angle, 0]}>
                <torusGeometry args={[0.06, 0.012, 8, 20]} />
              </mesh>
            );
          })}
        </group>
      </group>

      {/* ── INNER BLUSH PAN ──────────────────────────────────────────────── */}
      <mesh ref={innerPanRef} material={blushMat} position={[0, -0.08, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 0.06, 64]} />
      </mesh>

      {/* Center rose emboss on blush */}
      <mesh material={gemMat} position={[0, -0.04, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.22, 0.055, 8, 48]} />
      </mesh>

      {/* ── RIM JUNCTION ────────────────────────────────────────────────── */}
      <mesh ref={rimRef} material={roseGoldMat} position={[0, 0.21, 0]}>
        <torusGeometry args={[1.17, 0.045, 16, 80]} />
      </mesh>

      {/* ── LID ─────────────────────────────────────────────────────────── */}
      <group ref={lidRef} position={[0, 0.38, 0]}>
        {/* Lid disc */}
        <mesh material={enamelMat} castShadow>
          <cylinderGeometry args={[1.15, 1.15, 0.3, 64]} />
        </mesh>
        {/* Top face face */}
        <mesh material={enamelMat} position={[0, 0.16, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.15, 64]} />
        </mesh>
        {/* Lid top rim */}
        <mesh material={roseGoldMat} position={[0, 0.165, 0]}>
          <torusGeometry args={[1.04 , 0.028, 16, 80]} />
        </mesh>
        {/* Outer lid band */}
        <mesh material={roseGoldMat} position={[0, 0.15, 0]}>
          <torusGeometry args={[1.165, 0.02, 8, 80]} />
        </mesh>

        {/* Filigree ring on lid top */}
        <group ref={filigree1Ref} position={[0, 0.17, 0]}>
          {/* Petal filigree */}
          {[...Array(8)].map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const r = 0.62;
            return (
              <group key={i} position={[Math.cos(angle) * r, 0, Math.sin(angle) * r]}
                rotation={[Math.PI / 2, angle, 0]}>
                <mesh material={roseGoldMat}>
                  <torusGeometry args={[0.18, 0.016, 8, 20, Math.PI]} />
                </mesh>
              </group>
            );
          })}
          {/* Inner decorative ring */}
          <mesh material={brassMat} position={[0, 0, 0]}>
            <torusGeometry args={[0.42, 0.015, 8, 64]} />
          </mesh>
        </group>

        {/* Mirror disc inside lid — faces downward */}
        <mesh ref={mirrorRef} material={mirrorMat} position={[0, -0.14, 0]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.9, 0.9, 0.01, 64]} />
        </mesh>

        {/* CENTER JEWEL */}
        <mesh ref={centerGemRef} material={gemMat} position={[0, 0.27, 0]}>
          <octahedronGeometry args={[0.16, 2]} />
        </mesh>

        {/* Gems ring */}
        {gemBasePositions.map(([x, , z], i) => (
          <mesh
            key={i}
            ref={gemRefs[i]}
            material={i % 2 === 0 ? gemMat : gemMatPink}
            position={[x, 0.04, z]}>
            <sphereGeometry args={[0.075, 16, 16]} />
          </mesh>
        ))}
      </group>

      {/* ── DECORATIVE DROPPER ACCENTS ───────────────────────────────────── */}
      <group ref={dropper1Ref} position={[0.55, 0.1, 0]}>
        <mesh material={roseGoldMat}>
          <cylinderGeometry args={[0.025, 0.025, 0.55, 16]} />
        </mesh>
        <mesh material={gemMat} position={[0, 0.32, 0]}>
          <sphereGeometry args={[0.055, 12, 12]} />
        </mesh>
      </group>
      <group ref={dropper2Ref} position={[-0.55, 0.1, 0]}>
        <mesh material={roseGoldMat}>
          <cylinderGeometry args={[0.025, 0.025, 0.55, 16]} />
        </mesh>
        <mesh material={gemMat} position={[0, 0.32, 0]}>
          <sphereGeometry args={[0.055, 12, 12]} />
        </mesh>
      </group>
    </group>
  );
}

// ─── Ingredient science particles ─────────────────────────────────────────────
function IngredientParticles() {
  const { scrollProgress } = useBeautyStore();
  const ep = zoneProgress(scrollProgress, 0.40, 0.60);
  const rp = zoneProgress(scrollProgress, 0.72, 0.85);
  const opacity = easeInOut(lerp(ep, 0, rp));

  if (opacity < 0.01) return null;

  return (
    <group>
      <Sparkles
        count={140}
        scale={[6, 5, 6]}
        size={4}
        speed={0.5}
        opacity={opacity * 0.85}
        color="#F8C8DC"
        noise={0.4}
      />
      <Sparkles
        count={60}
        scale={[4, 3, 4]}
        size={2.5}
        speed={0.9}
        opacity={opacity * 0.5}
        color="#C5A059"
        noise={0.6}
      />
      <Sparkles
        count={30}
        scale={[2, 2, 2]}
        size={5}
        speed={0.3}
        opacity={opacity * 0.4}
        color="#ffffff"
        noise={0.2}
      />
    </group>
  );
}

// ─── Ambient floating orbs ────────────────────────────────────────────────────
function AmbientOrb({ position, color, radius = 0.5, speed = 1 }) {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed + position[0]) * 0.25;
    ref.current.rotation.y = state.clock.elapsedTime * 0.3 * speed;
  });
  return (
    <Sphere ref={ref} args={[radius, 32, 32]} position={position}>
      <MeshDistortMaterial
        color={color} distort={0.35} speed={1.8}
        transparent opacity={0.13} roughness={0.1} metalness={0.2}
      />
    </Sphere>
  );
}

// ─── Studio lighting setup ────────────────────────────────────────────────────
function StudioLighting() {
  return (
    <>
      <ambientLight intensity={0.6} color="#fff5f8" />

      {/* Key light — large soft-box top-right */}
      <rectAreaLight
        width={6} height={6}
        intensity={5}
        color="#ffffff"
        position={[5, 7, 4]}
        lookAt={[0, 0, 0]}
      />

      {/* Fill — warm pink from bottom-left */}
      <directionalLight position={[-4, -2, 3]} intensity={1.8} color="#F8C8DC" />

      {/* Back rim — gives depth */}
      <directionalLight position={[0, 3, -6]} intensity={1.2} color="#E8B4B8" />

      {/* Accent on gems */}
      <pointLight position={[0, 3, 2]} intensity={4} color="#ffffff" distance={8} decay={2} />

      {/* Warm floor bounce */}
      <pointLight position={[0, -3, 0]} intensity={1.5} color="#F8C8DC" distance={6} decay={2} />

      <Environment preset="studio" />
    </>
  );
}

// ─── Loading screen ───────────────────────────────────────────────────────────
function EtherealLoader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div style={{
        textAlign: 'center', color: '#B76E79', fontFamily: "'Playfair Display', serif",
        minWidth: 220,
      }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          border: '2px solid rgba(183,110,121,0.2)',
          borderTop: '2px solid #B76E79',
          animation: 'spin 1s linear infinite', margin: '0 auto 20px',
        }} />
        <p style={{ fontSize: 13, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 8 }}>
          Creating Magic
        </p>
        <p style={{ fontSize: 28, fontWeight: 700, letterSpacing: 2 }}>
          {Math.round(progress)}%
        </p>
      </div>
    </Html>
  );
}

// ─── Main exported Canvas ─────────────────────────────────────────────────────
export default function HeroCanvas() {
  const masterRef = useRef();

  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 9], fov: 50, near: 0.1, far: 100 }}
      style={{ position: 'absolute', inset: 0, background: 'transparent' }}
      shadows
    >
      <CameraRig />
      <StudioLighting />

      <Suspense fallback={<EtherealLoader />}>
        <OrnateCompact masterRef={masterRef} />
        <IngredientParticles />

        {/* Background atmosphere orbs */}
        <AmbientOrb position={[-4.5, 1, -4]} color="#F8C8DC" radius={2.5} speed={0.4} />
        <AmbientOrb position={[4,  -1, -5]} color="#E8B4B8" radius={2.0} speed={0.5} />
        <AmbientOrb position={[-1,  3, -6]} color="#B76E79" radius={1.5} speed={0.3} />
        <AmbientOrb position={[2,   2, -3]} color="#F8C8DC" radius={0.8} speed={0.7} />
      </Suspense>

      {/* Post-processing */}
      <EffectComposer multisampling={0}>
        <SMAA />
        <Bloom
          blendFunction={BlendFunction.ADD}
          intensity={0.45}
          luminanceThreshold={0.6}
          luminanceSmoothing={0.85}
          mipmapBlur
        />
      </EffectComposer>
    </Canvas>
  );
}
