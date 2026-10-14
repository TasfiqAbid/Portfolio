"use client";

import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, TorusKnot } from "@react-three/drei";
import * as THREE from "three";

const Scene = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse coordinates from -1 to 1
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((_, delta) => {
    const heroScrollDistance = (typeof window !== "undefined" ? window.innerHeight : 900) * 2.8;

    // Skip 3D computations when scrolled past Hero section to eliminate scroll lag
    if (typeof window !== "undefined" && window.scrollY > heroScrollDistance * 1.05) {
      if (groupRef.current && groupRef.current.visible) {
        groupRef.current.visible = false;
      }
      return;
    }
    if (!meshRef.current || !groupRef.current) return;

    const scrollY = window.scrollY;
    const p = Math.min(1, Math.max(0, scrollY / heroScrollDistance));

    // Continuous natural progression: starts at center, descends smoothly, continuously shrinks, and fades before Work
    const exitEnd = 0.90;
    const progress = Math.min(1, Math.max(0, p / exitEnd));

    // Continuous smooth downward descent from center (0) to bottom (-2.5)
    const targetY = THREE.MathUtils.lerp(0, -2.5, Math.pow(progress, 1.1));
    // Continuous natural shrink from full size (1.0) down to 0
    const targetScale = Math.max(0, 1 - Math.pow(progress, 1.2));
    // Soft, organic fade out
    const targetOpacity = Math.max(0, 1 - Math.pow(progress, 2.2));

    // Scroll-based rotation targets
    const targetRotX = scrollY * 0.0018;
    const targetRotY = scrollY * 0.0018;

    // Mouse-based rotation targets
    const targetMouseRotX = -(mouse.current.y * Math.PI) / 6;
    const targetMouseRotY = (mouse.current.x * Math.PI) / 6;

    // Smoothly interpolate scroll rotation
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotX, delta * 3);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotY, delta * 3);

    // Smoothly interpolate group position, scale, and mouse rotation
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, delta * 6);
    const currentScale = THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, delta * 6);
    groupRef.current.scale.setScalar(currentScale);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetMouseRotX, delta * 4);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetMouseRotY, delta * 4);

    // Smoothly interpolate material opacity
    if (materialRef.current) {
      materialRef.current.opacity = THREE.MathUtils.lerp(materialRef.current.opacity, targetOpacity, delta * 6);
    }

    // Toggle visibility to completely skip WebGL draws when fully faded/shrunk
    groupRef.current.visible = currentScale > 0.01 && targetOpacity > 0.01;
  });

  return (
    <>
      <Environment preset="city" />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />

      <group ref={groupRef} position={[0, 0, 0]}>
        <Float
          speed={2}
          rotationIntensity={0.2}
          floatIntensity={0.35}
        >
          <TorusKnot
            ref={meshRef}
            args={[1.5, 0.4, 256, 64]}
          >
            <meshPhysicalMaterial
              ref={materialRef}
              color="#f5a623"
              metalness={0.5}
              roughness={0.1}
              clearcoat={1}
              clearcoatRoughness={0.1}
              envMapIntensity={2}
              transparent={true}
              opacity={1}
            />
          </TorusKnot>
        </Float>
      </group>
    </>
  );
};

export default function Hero3DObject() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
