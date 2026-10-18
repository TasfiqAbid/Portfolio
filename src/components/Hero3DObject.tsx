"use client";

import { Component, Suspense, useRef, useEffect, useState, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, TorusKnot } from "@react-three/drei";
import * as THREE from "three";

function reportSceneFailure() {
  const root = document.documentElement;
  if (root.dataset.hero3dStatus === "error") return;
  root.dataset.hero3dStatus = "error";
  root.dataset.hero3dFailed = "true";
  delete root.dataset.hero3dReady;
  window.dispatchEvent(new Event("hero3d-error"));
}

class SceneErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    reportSceneFailure();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function waitForCompilation(promise: Promise<unknown>, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const finish = (error?: unknown) => {
      window.clearTimeout(timeout);
      signal.removeEventListener("abort", cancel);
      if (error) reject(error);
      else resolve();
    };
    const cancel = () => finish(new DOMException("Scene warmup canceled", "AbortError"));
    const timeout = window.setTimeout(() => finish(new Error("Scene compilation timed out")), 8000);
    signal.addEventListener("abort", cancel, { once: true });
    if (signal.aborted) cancel();
    promise.then(() => finish(), finish);
  });
}

function waitForIntroFill(signal: AbortSignal) {
  if (document.documentElement.dataset.introFilled === "true") return Promise.resolve();
  return new Promise<void>((resolve, reject) => {
    const cleanup = () => {
      window.removeEventListener("portfolio:intro-filled", done);
      signal.removeEventListener("abort", cancel);
    };
    const done = () => { cleanup(); resolve(); };
    const cancel = () => { cleanup(); reject(new DOMException("Scene warmup canceled", "AbortError")); };
    window.addEventListener("portfolio:intro-filled", done, { once: true });
    signal.addEventListener("abort", cancel, { once: true });
    if (signal.aborted) cancel();
  });
}

// Wait for submitted GPU work without synchronously blocking the main thread.
// The polling timer checks the fence only; it never drives scene rendering.
function waitForGpu(gl: THREE.WebGLRenderer, signal: AbortSignal) {
  const context = gl.getContext() as WebGL2RenderingContext;
  return new Promise<void>((resolve, reject) => {
    if (context.isContextLost()) {
      reject(new Error("WebGL context lost during warmup"));
      return;
    }
    const fence = context.fenceSync?.(context.SYNC_GPU_COMMANDS_COMPLETE, 0);
    if (!fence) {
      resolve();
      return;
    }
    let timer: number | undefined;
    const deadline = performance.now() + 1500;
    const finish = (error?: unknown) => {
      window.clearTimeout(timer);
      signal.removeEventListener("abort", cancel);
      if (!context.isContextLost()) context.deleteSync(fence);
      if (error) reject(error);
      else resolve();
    };
    const cancel = () => finish(new DOMException("Scene warmup canceled", "AbortError"));
    const check = () => {
      if (context.isContextLost()) {
        finish(new Error("WebGL context lost during warmup"));
        return;
      }
      const result = context.clientWaitSync(fence, 0, 0);
      if (result === context.ALREADY_SIGNALED || result === context.CONDITION_SATISFIED) {
        finish();
      } else if (result === context.WAIT_FAILED) {
        finish(new Error("WebGL warmup fence failed"));
      } else if (performance.now() >= deadline) {
        performance.mark("portfolio:scene-gpu-warmup-fallback");
        finish();
      } else {
        timer = window.setTimeout(check, 16);
      }
    };
    signal.addEventListener("abort", cancel, { once: true });
    context.flush();
    if (signal.aborted) cancel();
    else check();
  });
}

const Scene = ({ onActivityChange }: { onActivityChange: (active: boolean) => void }) => {
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);
  const camera = useThree((state) => state.camera);
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const fadeUniform = useRef<THREE.IUniform<number> | null>(null);
  const groupRef = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const floatElapsed = useRef(0);
  const applyHeroFade = (shader: THREE.WebGLProgramParametersWithUniforms) => {
    // Preserve the original 78%→98% CSS fade inside the existing material.
    // The live WebGL surface no longer needs a separate masked render pass.
    const height = { value: gl.domElement.height };
    fadeUniform.current = height;
    shader.uniforms.uHeroHeight = height;
    shader.fragmentShader = "uniform float uHeroHeight;\n" + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <premultiplied_alpha_fragment>",
      `float heroY = 1.0 - gl_FragCoord.y / uHeroHeight;
       gl_FragColor.a *= clamp((0.98 - heroY) / 0.20, 0.0, 1.0);
       #include <premultiplied_alpha_fragment>`,
    );
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse coordinates from -1 to 1
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let warmed = false;
    let visible = true;
    const root = document.documentElement;
    const updateActivity = () => onActivityChange(
      warmed && visible && !document.hidden && root.dataset.pageCovered !== "true"
        && root.dataset.hero3dStatus !== "error",
    );
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      updateActivity();
    });
    const section = gl.domElement.closest("section");
    if (section) observer.observe(section);
    const contextLost = () => {
      reportSceneFailure();
      controller.abort();
      updateActivity();
    };
    document.addEventListener("visibilitychange", updateActivity);
    window.addEventListener("portfolio:page-cover", updateActivity);
    gl.domElement.addEventListener("webglcontextlost", contextLost);

    const warm = async () => {
      try {
        // Environment's layout effect has applied the HDR before this effect.
        // No unlit scene or continuously animated scene competes with startup.
        if (!scene.environment) throw new Error("Scene environment unavailable");
        // Driver shader compilation can occupy the GPU itself, even when JS
        // awaits compileAsync. Do this while the completed logo is stationary.
        await waitForIntroFill(controller.signal);
        if (controller.signal.aborted) return;
        performance.mark("portfolio:scene-warmup-start");
        await waitForCompilation(gl.compileAsync(scene, camera), controller.signal);
        if (controller.signal.aborted || root.dataset.hero3dStatus === "error") return;
        gl.render(scene, camera);
        await waitForGpu(gl, controller.signal);
        if (controller.signal.aborted || root.dataset.hero3dStatus === "error") return;
        warmed = true;
        root.dataset.hero3dStatus = "ready";
        root.dataset.hero3dReady = "true";
        delete root.dataset.hero3dFailed;
        performance.mark("portfolio:scene-ready");
        window.dispatchEvent(new Event("hero3d-ready"));
        updateActivity();
      } catch {
        if (!controller.signal.aborted) reportSceneFailure();
      }
    };
    void warm();

    return () => {
      controller.abort();
      observer.disconnect();
      document.removeEventListener("visibilitychange", updateActivity);
      window.removeEventListener("portfolio:page-cover", updateActivity);
      gl.domElement.removeEventListener("webglcontextlost", contextLost);
    };
  }, [gl, scene, camera, onActivityChange]);

  useFrame(({ clock }, delta) => {
    if (fadeUniform.current) fadeUniform.current.value = gl.domElement.height;
    // R3F resets its clock when pausing its native loop. Keep Float's phase
    // continuous across covered/offscreen periods instead of snapping on return.
    floatElapsed.current += delta;
    clock.elapsedTime = floatElapsed.current;
    // The loop may resume after being offscreen; avoid interpolation overshooting.
    delta = Math.min(delta, 1 / 15);
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
    const targetMouseRotX = -(mouse.current.y * Math.PI) / 12;
    const targetMouseRotY = (mouse.current.x * Math.PI) / 12;
    const rotationBlend = 1 - Math.exp(-9 * delta);
    const positionBlend = 1 - Math.exp(-8 * delta);

    // Smoothly interpolate scroll rotation
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotX, rotationBlend);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotY, rotationBlend);

    // Smoothly interpolate group position, scale, and mouse rotation
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, positionBlend);
    const currentScale = THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, positionBlend);
    groupRef.current.scale.setScalar(currentScale);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetMouseRotX, rotationBlend);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetMouseRotY, rotationBlend);

    // Smoothly interpolate material opacity
    if (materialRef.current) {
      materialRef.current.opacity = THREE.MathUtils.lerp(materialRef.current.opacity, targetOpacity, positionBlend);
    }

    // Toggle visibility to completely skip WebGL draws when fully faded/shrunk
    groupRef.current.visible = currentScale > 0.01 && targetOpacity > 0.01;
  }, -1);

  return (
    <>
      <Environment files="/environments/city.hdr" />
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
            args={[1.5, 0.4, 128, 32]}
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
              onBeforeCompile={applyHeroFade}
            />
          </TorusKnot>
        </Float>
      </group>
    </>
  );
};

export default function Hero3DObject() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.hero3dStatus = "loading";
    delete root.dataset.hero3dReady;
    delete root.dataset.hero3dFailed;
    // Failed/never-ending asset loads must not strand the intro overlay.
    const timeout = window.setTimeout(() => {
      if (root.dataset.hero3dStatus === "loading") reportSceneFailure();
    }, 15000);
    const failure = () => setActive(false);
    window.addEventListener("hero3d-error", failure);
    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("hero3d-error", failure);
    };
  }, []);

  return (
    <div className="absolute inset-y-0 left-1/2 w-full max-w-[115svh] -translate-x-1/2 pointer-events-none z-0">
      <SceneErrorBoundary>
        <Canvas
          frameloop={active ? "always" : "never"}
          resize={{ scroll: false }}
          camera={{ position: [0, 0, 8], fov: 45 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          dpr={1}
        >
          <Suspense fallback={null}>
            <Scene onActivityChange={setActive} />
          </Suspense>
        </Canvas>
      </SceneErrorBoundary>
    </div>
  );
}
