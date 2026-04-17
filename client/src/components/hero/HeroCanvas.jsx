import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import useBeautyStore from '../../store/beautyStore';

// ─── Soft atmospheric orb ─────────────────────────────────────────────────────
function AtmosphereOrb({ position, color, size = 2.5, speed = 0.3 }) {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed + position[0]) * 0.4;
    ref.current.rotation.y = state.clock.elapsedTime * 0.08;
  });
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshBasicMaterial color={color} transparent opacity={0.07} depthWrite={false} />
    </mesh>
  );
}

// ─── Scene content ────────────────────────────────────────────────────────────
function Scene() {
  const { scrollProgress } = useBeautyStore();

  // Glitter density peaks in Zone 2 (exploded view) and tones down elsewhere
  const sparkleCount = scrollProgress > 0.38 && scrollProgress < 0.75 ? 200 : 100;

  return (
    <>
      <ambientLight intensity={0.3} color="#FFF0F5" />

      {/* Atmosphere blobs — pure background ambiance */}
      <AtmosphereOrb position={[-6, 2, -8]}  color="#F8C8DC" size={4}   speed={0.25} />
      <AtmosphereOrb position={[6,  -1, -9]} color="#E8B4B8" size={3.5} speed={0.35} />
      <AtmosphereOrb position={[0,   4, -10]} color="#B76E79" size={5}  speed={0.2}  />
      <AtmosphereOrb position={[-3, -3, -7]} color="#F8C8DC" size={2.5} speed={0.4}  />
      <AtmosphereOrb position={[4,   3, -6]} color="#C5A059" size={1.8} speed={0.5}  />

      {/* Glitter field */}
      <Sparkles
        count={sparkleCount}
        scale={[18, 14, 8]}
        size={2.5}
        speed={0.3}
        opacity={0.5}
        color="#F8C8DC"
        noise={0.5}
      />
      <Sparkles
        count={40}
        scale={[12, 10, 6]}
        size={4}
        speed={0.6}
        opacity={0.3}
        color="#C5A059"
        noise={0.3}
      />

      {/* Post FX */}
      <EffectComposer multisampling={0}>
        <Bloom
          blendFunction={BlendFunction.ADD}
          intensity={0.3}
          luminanceThreshold={0.5}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}

// ─── Exported canvas ──────────────────────────────────────────────────────────
export default function HeroCanvas() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 8], fov: 60 }}
      style={{ position: 'absolute', inset: 0, background: 'transparent' }}
    >
      <Scene />
    </Canvas>
  );
}
